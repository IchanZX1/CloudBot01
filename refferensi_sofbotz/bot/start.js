const { spawn } = require("child_process");

const child = spawn("node", ["index.js"], {
  cwd: __dirname,
  stdio: ["pipe", "inherit", "inherit"],
});

setTimeout(() => {
  child.stdin.write("\n");
  console.log(">> Auto ENTER dikirim ke bot");
}, 6000);
