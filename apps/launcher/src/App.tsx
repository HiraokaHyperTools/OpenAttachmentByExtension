import React, { useState, useEffect } from 'react';
import './App.css';
import * as utils from 'j/lib/utils';
import * as pref2 from 'j/lib/pref2';

interface Attachment {
  name: string
}

declare const browser: {
  oabeApi: {
    listAttachmentFromActiveMail(): Promise<Attachment[]>;
    openAttachmentFromActiveMail(
      filter: {
        name?: string,
        partID?: string,
      },
      options: {
        workDir?: string,
        program?: string,
        parameters?: string[],
      }
    ): Promise<void>;
  }
}

function openAttachment(name: string): void {
  const launcherSet = utils.buildLauncherSetFromFromFileName(name)
  browser.oabeApi.openAttachmentFromActiveMail(
    {
      name: name
    },
    {
      workDir: pref2.default.customTempDir || undefined,
      program: launcherSet.program,
      parameters: launcherSet.parameters,
    }
  )
}

function App() {
  const [attachments, setAttachments] = useState([] as Attachment[]);
  const [ready, setReady] = useState(false);

  useEffect(
    () => {
      (
        async () => {
          setAttachments(await browser.oabeApi.listAttachmentFromActiveMail());
          setReady(true);
        }
      )()
    }
  );

  return (
    <>
      <h3>OpenAttachmentByExtension</h3>
      <ul id="attachment-list">
        {
          ready
            ? (attachments.length === 0)
              ? <li>No attachment observed in active message.</li>
              : attachments.map(
                attachment => <li key={attachment.name}>
                  <a href="/" onClick={e => { openAttachment(attachment.name); e.preventDefault(); }}>{attachment.name}</a>
                </li>
              )
            : <li>Loading...</li>
        }
      </ul>
    </>
  );
}

export default App;
