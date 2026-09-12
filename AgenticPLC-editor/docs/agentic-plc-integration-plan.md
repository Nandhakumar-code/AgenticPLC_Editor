# AgenticPLC Integration Plan

## 1. Repository Inspection Summary

### Technology Stack

* **Application Framework:** Electron + Node.js Backend.
* **Frontend UI:** HTML/CSS/JS with a bundled React-based state manager (`window.__ROOT_STORE__`).
* **Backend:** Node.js (`main.js`) with an IPC bridge exposed to the frontend (`preload.js`).
* **Existing Chat Implementation:** The chat interface and AI loop are currently implemented directly in the frontend (`index.html`). It handles API calls via `fetch` and maintains local history and settings in browser `localStorage`.
* **Project/Workspace Management:** Handled via custom IPC bridges (`bridge.readProjectFiles`, `bridge.writeFileNode`, `bridge.retrieveRecent`) and a frontend XML abstraction layer (`agentic_core.js` -> `XMLManager`, `WorkspaceManager`, `EditorController`).
* **Integrations:** The `preload.js` bridge exposes comprehensive integrations for compilation (`compiler:run-compile-program`), simulation (`simulator:*`), and PlC runtime control (`runtime:*`, `debugger:*`).

## 2. Architecture & Implementation Plan

To transform the current AI chatbot into a safe, agentic PLC coding assistant without a massive rewrite, we will integrate a secure orchestration layer. Because the current AI calls are made directly from the frontend (`index.html`), we will move the tool definitions and execution routing to the backend (`main.js`) or implement a secure sandbox pattern while keeping the UI conversational.

### Phase 2: Secure Workspace Service (Read-Only)

* **Files Modified:** `preload.js`, `main.js`, `index.html`.
* **Changes:**
  * Implement backend handlers in `main.js` for safe workspace access: `get_active_project`, `list_workspace_files`, `read_workspace_file`, `search_workspace`, `get_project_symbols`.
  * Add path validation to ensure paths remain within the currently active workspace directory. Reject `../`, absolute paths outside the root, and access to hidden/system directories.
  * Expose these secure tools via `preload.js`.

### Phase 3: Agent Tool Calling & Mode Selection

* **Files Modified:** `index.html`, `agentic_core.js`.
* **Changes:**
  * **UI:** Add a visual agent mode selector (Chat, Plan, Agent) in `index.html` above the chat input.
  * **Logic:** Modify the chat loop in `index.html` to pass the selected mode to the LLM.
  * **Permissions:**
    * **Chat:** Provide no tools.
    * **Plan:** Provide only read tools.
    * **Agent:** Provide read and write-proposal tools.
  * Replace existing direct, unsafe tools (like `runOsCommand`, `writeFileNode`) with the new, scoped tools defined by this plan.

### Phase 4: Safe Code-Change Workflow (Write Proposals)

* **Files Modified:** `index.html`, `agentic_core.js`.
* **Changes:**
  * **New Tools:** `create_file_proposal`, `propose_file_patch`, `apply_approved_change`.
  * **UI:** When the LLM calls a proposal tool, the frontend intercepts it. Instead of executing immediately, it renders a "Change Review Panel" displaying the proposed diff and a reason.
  * **Approval Gate:** The UI provides `[Reject]` and `[Approve and Apply]` buttons. The `apply_approved_change` tool is only invoked (with a secure, tracked Proposal ID) when the user explicitly clicks "Approve".
  * **Audit Logging:** All executed tool calls (read and write) will be logged to a local file/store with timestamps and results.

### Phase 5: Compile and Simulation Integration

* **Files Modified:** `index.html`, `agentic_core.js`.
* **Changes:**
  * **New Tools:** `get_compile_status`, `compile_project`, `run_simulation`.
  * These tools will wrap the existing IPC calls (`bridge.runCompileProgram`, `bridge.simulatorLoadFirmware`, etc.).
  * **UI:** After an approved edit, prompt the user with "Compile" or "Simulate" buttons in the chat UI. When triggered by the LLM, render the results cleanly in the chat stream.

### Phase 6: High-Risk Runtime Operations

* **Files Modified:** `index.html`, `agentic_core.js`.
* **Changes:**
  * **New Tools:** `deploy_to_runtime`, `start_runtime`, `stop_runtime` (wrapping existing `runtimeStartPlc`, `runtimeStopPlc`).
  * **Approval Gate (Double Confirmation):** If the LLM proposes a high-risk operation, the UI will intercept it and present a prominent, red-themed confirmation dialog warning the user that this action affects physical equipment. The action will only proceed upon strict user confirmation.

## 3. Communication Flow

1. **User Input:** User types a request in `index.html`.
2. **Context Assembly:** Frontend gathers current `AgentMode`, Active Project ID, and Editor Context via `AgenticCore`.
3. **LLM Request:** Frontend sends the prompt + context + permitted tools to the LLM.
4. **Tool Routing:**
   * If a read-only tool is called (and mode allows), frontend calls the safe backend tool via `window.bridge`, gets the result, and loops back to the LLM.
   * If a write/high-risk tool is called, frontend pauses the loop, renders the proposal/confirmation UI, and waits for user interaction.
5. **Execution & Audit:** Once approved, the tool executes via `window.bridge`, logs the action, and returns the result to the LLM to finalize the response.

## 4. Deferred/Unavailable Features

* If specific compiler error line-number mapping is not supported by the existing OpenPLC integration, we will return raw compiler output text to the LLM instead.
* Full version control / diffing might be limited to in-memory patch application if the underlying project format (XML-based) makes unified text diffs difficult to read; in that case, we will diff the ST code specifically or provide structured property diffs.
