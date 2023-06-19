const os = require('node:os');
const child_process = require('node:child_process');
const process = require('node:process');
const path = require('node:path');

function run(cwd, command, ifStatusIsAllowed) {
  console.log(`--- ${path.resolve(process.cwd(), cwd)}> ${command} `);
  try {
    child_process.execSync(
      command,
      {
        cwd: cwd,
      }
    );
  }
  catch (ex) {
    if (ifStatusIsAllowed && ifStatusIsAllowed(ex.status)) {
      // ok
    }
    else {
      throw ex;
    }
  }
}

const source = process.argv[2];
const dest = process.argv[3];

if (os.type() === "Windows_NT") {
  run(".", `robocopy /mir "${source}" "${dest}"`, status => (status & 8) === 0);
}
else {
  run(".", `rsync -avh "${source}/" "${dest}" --delete`);
}
