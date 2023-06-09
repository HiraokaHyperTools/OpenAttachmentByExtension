# Build notes

This built in builder will run on

- Windows 10
- Linux (Debian GNU/Linux 11 (bullseye) and so on)

Run:

```bat
node fullbuild
```

This will require additional ones like:

- Node.js v19.7.0 or such
- npm v8.5.3 or such
- [yarn](https://yarnpkg.com/) by `npm i -g yarn`
- [7-Zip](https://7-zip.org/) (or p7zip on Linux) installed
- rsync installed for non-Windows

Finally this will compose file: `OpenAttachmentByExtension.xpi`
