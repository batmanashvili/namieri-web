# Namieri web

@AGENTS.md

Project setup, commands and conventions are in README.md. Run `pnpm check` before pushing.

## Branches and deploys (read before any git work)

- **Work on `dev`, never on `main`.** Commit and push changes to `dev` (directly, or via a
  feature branch merged into `dev`). Vercel deploys only `dev`, so every push to `dev` is
  live within minutes and can be checked on the deployed site.
- **Never commit to, push to, merge into, rebase or reset `main`.** `main` holds only tested
  code, and the owner updates it herself.
- **To propose changes for `main`, open a pull request** from `dev` into `main`
  (`gh pr create --base main --head dev`) with a description of what changed and how it was
  tested on the `dev` deployment. Never merge it; the owner reviews and merges.
- `.claude/hooks/protect-main.mjs` enforces this and blocks such commands. Do not edit,
  disable or work around it, and do not change GitHub branch rules. If it blocks something
  you think is needed, stop and ask the owner.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- The graph is not committed (`graphify-out/` is gitignored). If it is missing, build it with `graphify update .`. Cloud sessions build it at startup via `.claude/hooks/session-start.sh`.
