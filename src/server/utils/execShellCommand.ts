import cp from "node:child_process";

export interface ShellCommandErrorInfo {
  cmd: string;
  code?: null | number;
  stderr?: string;
  stdout?: string;
}

export class ShellCommandError extends Error {
  cmd: string;
  code?: null | number;
  stderr?: string;
  stdout?: string;
  constructor(message: string, info: ShellCommandErrorInfo) {
    super(message);
    this.name = "ShellCommandError";
    this.code = info.code;
    this.cmd = info.cmd;
    this.stderr = info.stderr;
    this.stdout = info.stdout;
  }
}

export function execShellCommand(cmd: string) {
  console.log("execShellCommand", cmd);
  return new Promise<string>((resolve, reject) => {
    cp.exec(cmd, { maxBuffer: 10 * 1024 * 1024 }, (error: any, stdout: string, stderr: string) => {
      if (error) {
        // Compose a concise, informative error message including exit code and stderr
  const exitCode = error.code === undefined ? null : (error.code as null | number);
        const tail = (input: string) => (input || "").trim().split("\n").slice(-10).join("\n");
        const stderrTail = tail(stderr);
        const stdoutTail = tail(stdout);
        const messageParts = [
          `Command failed${exitCode === null ? "" : ` (code ${exitCode})`}: ${cmd}`,
          stderrTail || stdoutTail ? "\n--- output ---\n" + (stderrTail || stdoutTail) : "",
        ];
        const err = new ShellCommandError(messageParts.join(""), {
          cmd,
          code: exitCode,
          stderr,
          stdout,
        });
        console.error("Error executing command:", err.message);
        reject(err);
        return;
      }
      resolve((stdout ? stdout : stderr).trim());
    });
  });
}
