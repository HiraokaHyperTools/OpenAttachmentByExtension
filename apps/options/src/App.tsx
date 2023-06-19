import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import * as pref from 'j/lib/pref';
import * as pref2 from 'j/lib/pref2';
import * as utils from 'j/lib/utils';
import {
  createHashRouter,
  RouterProvider,
  useParams,
  useNavigate,
} from "react-router-dom";

declare const browser: {
  oabeApi: {
    pickDir(): Promise<string>;
    pickFile(): Promise<string>;
  }
};

const defaultTheme = createTheme();

function Root() {
  const navigate = useNavigate();

  return <>
    <AppBar position="relative">
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap>
          OpenAttach: Options
        </Typography>
      </Toolbar>
    </AppBar>
    <Container fixed>
      <p>Select option going to customize:</p>
      <p>
        <Button variant="contained" onClick={_ => navigate("/TemporaryDirectory")}>Temporary directory to open attachments</Button>
      </p>
      <p>
        <Button variant="contained" onClick={_ => navigate("/FileExtensions")}>Command to run with extensions</Button>
      </p>
    </Container>
  </>;
}

interface TemporaryDirectoryProps {
  tmpDir?: string;
  useDir?: boolean;
  onSave?: (useDir: boolean, tmpDir: string) => void;
  onBrowse?: () => Promise<string | null>;
}

function TemporaryDirectory() {
  return <TemporaryDirectoryPage
    tmpDir={pref2.default.customTempDir || ""}
    useDir={pref2.default.useCustomTempDir || false}
    onBrowse={async () => await browser.oabeApi.pickDir()}
    onSave={(useDir, tmpDir) => {
      pref2.default.useCustomTempDir = useDir;
      pref2.default.customTempDir = tmpDir;
    }}
  />;
}

function TemporaryDirectoryPage(props: TemporaryDirectoryProps) {
  const navigate = useNavigate();
  const [tmpDir, setTmpDir] = useState(props.tmpDir || "");
  const [useDir, setUseDir] = useState(props.useDir || false);

  function onSave() {
    props.onSave && props.onSave(useDir, tmpDir);
    navigate(-1);
  }
  async function onBrowse() {
    if (props.onBrowse) {
      const resp = await props.onBrowse();
      if (resp !== null) {
        setTmpDir(resp);
      }
    }
  }

  return <>
    <AppBar position="relative">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={_ => navigate(-1)}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" color="inherit" noWrap>
          Temporary directory to open attachments
        </Typography>
      </Toolbar>
    </AppBar>
    <Container fixed>
      <br />
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={useDir} onChange={e => setUseDir(e.target.checked)} />}
          label="Use specified directory below (otherwise it tries to place files in TmpD)"
        />
      </FormGroup>
      <br />
      <FormGroup>
        <TextField id="outlined-basic" label="Temporary directory to open attachments" variant="outlined"
          value={tmpDir} onChange={e => setTmpDir(e.target.value)}
        />
      </FormGroup>
      <p>
        <Button variant="contained" onClick={onBrowse}>Browse...</Button>
      </p>
      <hr />
      <p>
        <Button variant="contained" onClick={onSave}>Save changes and close</Button>
      </p>
    </Container>
  </>;
}

interface FileExtensionsProps {
  list?: FileExtensionEntity[];
}

function FileExtensions() {
  return <FileExtensionsPage list={getFileExtensionsList()} />;
}

function FileExtensionsPage(props: FileExtensionsProps) {
  const navigate = useNavigate();

  return <>
    <AppBar position="relative">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={_ => navigate(-1)}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" color="inherit" noWrap>
          Command to run with extensions
        </Typography>
      </Toolbar>
    </AppBar>
    <Container fixed>
      <p>
        Command to run with extensions:
      </p>
      <p>
        <Button variant="contained" onClick={_ => navigate("/FileExtensionsAdd")}>Add new file extension</Button>
      </p>
      <List>
        {
          (props.list || []).map(
            one => {
              return <ListItem disablePadding key={one.extension}>
                <ListItemButton onClick={_ => navigate(`/FileExtensions/${one.extension}`)}>
                  <ListItemText
                    primary={one.extension}
                    secondary={one.command}
                  />
                </ListItemButton>
              </ListItem>;
            }
          )
        }
      </List>
    </Container>
  </>;
}

function FileExtensionsEdit() {
  const { extension } = useParams();

  return <FileExtensionPage
    entity={({
      extension: extension || "",
      command: pref2.default.getExtensionCommand(extension || "") || ""
    })}
    onBrowse={async () => await browser.oabeApi.pickFile()}
    onSave={entity => pref2.default.setExtensionCommand(entity.extension, entity.command)}
    onRemove={extension => pref2.default.removeExtensionCommand(extension)}
  />;
}

function FileExtensionsAdd() {
  return <FileExtensionPage
    onBrowse={async () => await browser.oabeApi.pickFile()}
    onSave={entity => pref2.default.setExtensionCommand(entity.extension, entity.command)}
  />
}

interface FileExtensionEntity {
  extension: string;
  command: string;
}

interface FileExtensionPageProps {
  entity?: FileExtensionEntity;
  onRemove?: (extension: string) => void;
  onSave?: (entity: FileExtensionEntity) => void;
  onBrowse?: () => Promise<string | null>;
}

function FileExtensionPage(props: FileExtensionPageProps) {
  const navigate = useNavigate();
  const [extension, setExtension] = useState(props.entity?.extension || "");
  const [command, setCommand] = useState(props.entity?.command || "");

  function onRemove() {
    props.onRemove && props.onRemove(props.entity?.extension || "");
    navigate(-1);
  }
  function onSave() {
    props.onSave && props.onSave({ extension, command });
    navigate(-1);
  }
  async function onBrowse() {
    if (props.onBrowse) {
      const resp = await props.onBrowse();
      if (resp !== null) {
        setCommand(resp);
      }
    }
  }

  return <>
    <AppBar position="relative">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={_ => navigate(-1)}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" color="inherit" noWrap>
          Command to run with extension detail
        </Typography>
      </Toolbar>
    </AppBar>
    <Container fixed>
      <br />
      <FormGroup>
        <TextField id="outlined-basic" label="File extension (without period)" variant="outlined"
          value={extension} onChange={e => setExtension(e.target.value)}
        />
      </FormGroup>
      <br />
      <i>Notes:</i>
      <ul>
        <li>Extension <code>@@@</code> stands for files without extension</li>
        <li>Extension <code>###</code> stands for all files with numeric extensions</li>
        <li>Extension <code>***</code> stands for every file (for extensions which are not defined)</li>
        <li>Extension <code>winmaildat</code> stands for winmail.dat files</li>
      </ul>
      <br />
      <hr />
      <br />
      <FormGroup>
        <TextField id="outlined-basic" label="Command to run" variant="outlined"
          value={command} onChange={e => setCommand(e.target.value)} />
      </FormGroup>
      <br />
      <i>Note:</i>
      <ul>
        <li>Use <code>%%</code> to add arguments to the command. Use <code>%%</code> per one argument.</li>
      </ul>
      <p>
        <Button variant="contained" onClick={onBrowse}>Browse...</Button>
      </p>
      <hr />
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={onSave}>Save changes and close</Button>
        <Button variant="outlined" onClick={onRemove}>Remove this file extension</Button>
      </Stack>
    </Container>
  </>;
}

function getFileExtensionsList(): FileExtensionEntity[] {
  return utils.filterNameByPrefixAndMixValue(
    pref.listKeys(),
    /^extension\.(.+)$/,
    (key: string) => pref.get(key) || ""
  )
    .sort(
      (a, b) => utils.strcmp(a[0], b[0])
    )
    .filter(array => array[1])
    .map(
      array => {
        const [, extension, command] = array as [string, string, string];
        return {
          extension,
          command,
        };
      }
    );
}

const router = createHashRouter([
  {
    children: [
      {
        path: "/",
        element: <Root />,
      },
      {
        path: "/TemporaryDirectory",
        element: <TemporaryDirectory />,
      },
      {
        path: "/FileExtensions",
        element: <FileExtensions />,
      },
      {
        path: "/FileExtensions/:extension",
        element: <FileExtensionsEdit />,
      },
      {
        path: "/FileExtensionsAdd",
        element: <FileExtensionsAdd />,
      },
    ],
  },
]);

export default function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
