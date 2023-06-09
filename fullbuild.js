const process = require('node:process');
const path = require('node:path');
const child_process = require('node:child_process');

function run(cwd, command, ifStatusIsAllowed) {
  console.log(`--- ${path.resolve(process.cwd(), cwd)}> ${command}`);
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

run("apps/j", "yarn");
run("apps/j", "yarn tsc");
run("apps/launcher", "npm ci");
run("apps/launcher", "yarn build");
run("apps/launcher", "yarn cp", status => (status & 8) === 0);
run("apps/options", "npm ci");
run("apps/options", "yarn build");
run("apps/options", "yarn cp", status => (status & 8) === 0);
run(".", "node pack");
