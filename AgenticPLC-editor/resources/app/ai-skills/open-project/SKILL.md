---
name: open-project
description: Open an AgenticPLC project from a natural-language request by resolving its name or path, invoking the editor's real project-opening flow, and verifying that the workspace context changed.
---

# Open Project

Use this skill whenever the user asks to open, load, switch to, or enter an AgenticPLC project.

1. Extract the project name or full path from the request.
2. Use the dedicated `openProject` tool. Do not use generic command discovery for this task.
3. If a name is provided, resolve it against recent projects. Prefer an exact case-insensitive name match, then a path/name containment match.
4. If the project is not found, report the available recent project names and ask for the full path. Do not claim success.
5. Wait for the tool result. Report success only when it returns `success: true` and `editorUpdated: true`.
6. After success, use the returned project/workspace information for subsequent file operations.
7. Never repeat the same open request more than once in a single user turn. If the result is inconclusive, report that the editor state could not be verified.

The chat response is not proof that the editor changed state. The native editor open action and its result are the source of truth.
