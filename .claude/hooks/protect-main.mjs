#!/usr/bin/env node
// Claude Code PreToolUse hook: stops AI agents from changing the `main` branch.
// `main` is updated only by the repo owner (by hand, or by merging a pull request on GitHub).
// Agents work on `dev` (which Vercel deploys) and open pull requests into `main`.
// Exit code 2 blocks the tool call and shows the message to the agent.
import { execFileSync } from "node:child_process";

const PROTECTED = "main";

let input = "";
for await (const chunk of process.stdin) input += chunk;

let command = "";
let cwd = process.cwd();
try {
  const data = JSON.parse(input);
  command = String(data?.tool_input?.command ?? "");
  if (data?.cwd) cwd = data.cwd;
} catch {
  process.exit(0);
}
if (!command) process.exit(0);

const block = (why) => {
  process.stderr.write(
    `Blocked: ${why}\n` +
      `The "${PROTECTED}" branch is changed only by the repo owner. Commit and push to "dev" ` +
      `(Vercel deploys it), then open a pull request from "dev" into "${PROTECTED}" ` +
      `with "gh pr create --base ${PROTECTED} --head dev" and leave the merge to the owner.\n`,
  );
  process.exit(2);
};

const git = (args, dir) => {
  try {
    return execFileSync("git", args, { cwd: dir, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return "";
  }
};

const isProtected = (ref) => {
  const r = ref
    .replace(/^\+/, "")
    .replace(/^refs\/heads\//, "")
    .replace(/^origin\//, "");
  return r === PROTECTED;
};

// Split into simple commands on ; && || | and newlines.
const segments = command
  .split(/;|&&|\|\||\||\n/)
  .map((s) => s.trim())
  .filter(Boolean);

for (const segment of segments) {
  const tokens =
    segment.match(/"[^"]*"|'[^']*'|\S+/g)?.map((t) => t.replace(/^["']|["']$/g, "")) ?? [];

  // Directory the command runs in: honour `git -C <dir>` and a preceding `cd <dir>`.
  let dir = cwd;
  const cdMatch = command.match(/(?:^|[;&|\n]\s*)cd\s+("[^"]+"|'[^']+'|\S+)/);
  if (cdMatch) dir = cdMatch[1].replace(/^["']|["']$/g, "");

  const gitIdx = tokens.findIndex((t) => t === "git" || t.endsWith("/git"));
  if (gitIdx !== -1) {
    let i = gitIdx + 1;
    while (i < tokens.length && tokens[i].startsWith("-")) {
      if (tokens[i] === "-C" && tokens[i + 1]) {
        dir = tokens[i + 1];
        i += 2;
      } else if (tokens[i] === "-c") {
        i += 2;
      } else {
        i += 1;
      }
    }
    const sub = tokens[i];
    const args = tokens.slice(i + 1);
    const branch = git(["rev-parse", "--abbrev-ref", "HEAD"], dir);

    if (sub === "push") {
      if (args.some((a) => a === "--all" || a === "--mirror")) {
        block("pushing all branches would include main.");
      }
      const positional = args.filter((a) => !a.startsWith("-"));
      const refspecs = positional.slice(1); // first positional is the remote
      if (refspecs.length === 0) {
        const upstream = git(["rev-parse", "--abbrev-ref", "@{u}"], dir);
        if (
          branch === PROTECTED ||
          (upstream && isProtected(upstream.split("/").slice(1).join("/")))
        ) {
          block("this push would update main.");
        }
      }
      for (const spec of refspecs) {
        const dst = spec.includes(":") ? spec.split(":").pop() : spec;
        if (isProtected(dst)) block(`this push targets main ("${spec}").`);
        if ((dst === "HEAD" || dst === "@") && branch === PROTECTED)
          block("this push would update main.");
      }
    }

    const writes = ["commit", "merge", "rebase", "cherry-pick", "revert", "am", "pull"];
    if (writes.includes(sub) && branch === PROTECTED) {
      block(`"git ${sub}" on the main branch. Switch to dev first: "git switch dev".`);
    }
    if ((sub === "branch" || sub === "update-ref") && args.some((a) => isProtected(a))) {
      if (
        args.some((a) => ["-f", "--force", "-D", "-d", "-m", "-M"].includes(a)) ||
        sub === "update-ref"
      ) {
        block("this would move or delete the main branch.");
      }
    }
  }

  // GitHub CLI: agents may create pull requests, but never merge them or write refs directly.
  const ghIdx = tokens.findIndex((t) => t === "gh" || t.endsWith("/gh"));
  if (ghIdx !== -1) {
    const rest = tokens.slice(ghIdx + 1);
    if (rest[0] === "pr" && rest[1] === "merge")
      block("merging pull requests is left to the owner.");
    if (rest[0] === "api") {
      const joined = rest.join(" ");
      if (
        /\/merges\b|\/pulls\/\d+\/merge\b|git\/refs\/heads\/main\b|\/rulesets|\/branches\/main\/protection/.test(
          joined,
        )
      ) {
        block("this GitHub API call could change main or its protection.");
      }
    }
  }
}

process.exit(0);
