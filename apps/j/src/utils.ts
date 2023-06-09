// utils module

import pref2 from './pref2'

export function filterNameByPrefixAndMixValue<T>(
  nameList: string[],
  regex: RegExp,
  valueGetter: (key: string) => T
): [string, string | null, T][] {
  const newList: [string, string | null, T][] = [];
  for (let name of nameList) {
    const result = regex.exec(name)
    if (result) {
      newList.push(
        [
          name,
          result[1],
          valueGetter(name)
        ]
      )
    }
  }
  return newList
}

function getFileExtension(fileName: string): string {
  const index = fileName.lastIndexOf('.')
  return (index >= 1) ? fileName.substring(index + 1) : ""
}

export function buildLauncherSetFromFromFileName(fileName: string): {
  program: string,
  parameters: string[],
} {
  const extension = getFileExtension(fileName)

  const parameters: string[] = []

  let command: string | null = null
  if (fileName === "winmail.dat") {
    command = pref2.getExtensionCommand('winmaildat')
  }
  if (!command) {
    command = pref2.getExtensionCommand(extension || '@@@')
  }
  if (!command) {
    if (!isNaN(extension as unknown as number)) {
      command = pref2.getExtensionCommand('###')
    }
    if (!command) {
      command = pref2.getExtensionCommand('***')
    }
  }

  const parts = (command || '').split('%%')

  return {
    program: parts[0],
    parameters: parameters.concat(parts.slice(1)),
  }
}

export function strcmp<T>(a: T, b: T): number {
  if (a < b) {
    return -1;
  }
  else if (a > b) {
    return 1;
  }
  return 0;
}
