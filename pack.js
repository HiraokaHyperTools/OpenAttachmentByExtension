const process = require('node:process');
const path = require('node:path');
const fs = require('node:fs');
const child_process = require('node:child_process');

process.env.PATH = process.env.PATH + path.delimiter + "C:\\Program Files\\7-Zip";

xpi = path.resolve(process.cwd(), "OpenAttachmentByExtension.xpi");

if (fs.existsSync(xpi)) {
  fs.unlinkSync(xpi);
}

child_process.execSync(
  `7z a "${xpi}" *.* -x!*.pxf -x!.gitignore -r`,
  {
    cwd: path.resolve(process.cwd(), "src"),
  }
);
