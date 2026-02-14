## Project Rules (Lean)

- iOS-first development. Do not spend time on Android unless explicitly requested.
- Keep scope tight: do not add backend services, mocks, or new flows unless explicitly requested.
- Temporary scaffolding must be clearly marked as dev-only.
- For new `EXPO_PUBLIC_*` vars:
  - update `.env.example`
  - do not commit `.env`
  - remind to restart Metro with `--clear`
- For local iOS simulator networking, use `http://127.0.0.1:<port>` by default.
- After code changes, run `npm run typecheck`.
- For networking changes, provide a reproducible check command (for example, `curl /health`).
- If sandbox cannot verify runtime behavior, explicitly say so and provide exact local verification steps.
- In responses: root cause first, minimal fix second.
