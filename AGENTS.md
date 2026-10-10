<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Codebase knowledge graph (Graphify)

This repo uses [Graphify](https://github.com/Graphify-Labs/graphify) to map the code into a knowledge graph at `graphify-out/` (not committed; build it with `graphify update .`, AST-only, no API key).

- For codebase questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"` and `graphify explain "<concept>"` over grepping raw files when `graphify-out/graph.json` exists.
- Read `graphify-out/GRAPH_REPORT.md` for a broad architecture overview.
- After changing code, run `graphify update .` to keep the graph current.
