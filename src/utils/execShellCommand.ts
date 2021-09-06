import cp from "child_process";

export function execShellCommand(cmd: string) {
  console.log("execShellCommand", cmd);
  return new Promise<string>((resolve, reject) => {
    cp.exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log("error", error);
        reject(error);
        return;
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}
