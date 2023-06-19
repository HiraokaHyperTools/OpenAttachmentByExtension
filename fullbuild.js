const process = require('node:process');
const path = require('node:path');
const child_process = require('node:child_process');

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
      if (ex.stderr) {
        console.warn("---- stderr");
        console.warn(new TextDecoder().decode(ex.stderr));
      }
      if (ex.stdout) {
        console.warn("---- stdout");
        console.warn(new TextDecoder().decode(ex.stdout));
      }
      throw ex;
    }
  }
}

run("apps/j", "yarn");
run("apps/j", "yarn tsc");
run("apps/launcher", "npm ci");
run("apps/launcher", "yarn build");
run("apps/launcher", "yarn cp");
run("apps/options", "npm ci");
run("apps/options", "yarn build");
run("apps/options", "yarn cp");
run(".", "node pack");
