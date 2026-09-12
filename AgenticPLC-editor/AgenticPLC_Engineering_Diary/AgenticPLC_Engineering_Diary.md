# AgenticPLC Engineering Project Diary

**Institution:** PSG College of Technology\
**Department:** Electrical and Electronics Engineering\
**Project:** Design and Implementation of AgenticPLC with Custom Hardware Configuration\
**Duration:** 1 July 2026 – 27 July 2026

---

<div style='page-break-after: always;'></div>

## DAY 1

**Date:** 1 July 2026  
**Working Hours:** 7.0 hours  
**Objective:** Project scoping and literature survey on industrial PLC development environments.  

---

### Background
To build AgenticPLC, a foundational understanding of current IDEs and their limitations is required to identify areas where AI and modern software architecture can improve the development lifecycle.

---

### Research Activities
Reviewed OpenPLC documentation, the IEC 61131-3 standard overview, and 'Programmable Logic Controllers' by W. Bolton. Explored GitHub repositories for OpenPLC and Beremiz.

---

### Concepts Learned
1. PLC Scan Cycle: The continuous process of reading inputs, executing logic, and writing outputs.
2. IEC 61131-3: The international standard for programmable logic controllers, focusing on Ladder Diagram (LD) and Structured Text (ST).

---

### Engineering Analysis
Conventional IDEs are functional but structurally rigid and lack modern AI integration capabilities. Decided to adapt a modular architecture while completely revamping the user interface.

---

### Implementation Work
Set up the foundational Git repository. Drafted initial architecture document detailing the separation of IDE frontend, AI backend, and hardware abstraction layer.

---

### Testing
Cloned the existing OpenPLC repository and tested local compilation to verify the toolchain.

---

### Problems Encountered
Initial build of legacy OpenPLC editor failed due to missing Python dependencies.

---

### Solutions Applied
Isolated the dependencies into a virtual environment and patched build scripts to point to localized binaries.

---

### Deliverables
Project architecture draft, initialized Git repository, functioning local build of base OpenPLC.

---

### Knowledge Gained
Gained deep understanding of the legacy build process for industrial IDEs and the exact directory structure of the Beremiz/OpenPLC codebase.

---

### Next Day Plan
Analyze the Electron architecture and evaluate Monaco editor for Structured Text.

---

### Time Distribution
- **Research:** 4.0 hours
- **Implementation:** 2.0 hours
- **Testing:** 0.5 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 2

**Date:** 2 July 2026  
**Working Hours:** 6.5 hours  
**Objective:** Study of OpenPLC internal architecture and UI framework selection.  

---

### Background
Before building the new AgenticPLC IDE, the underlying mechanisms of project serialization and UI rendering must be understood.

---

### Research Activities
Studied the internal architecture of OpenPLC Editor to understand editor-rendering workflow and project serialization. Researched Electron.js and Next.js as potential UI frameworks.

---

### Concepts Learned
1. Electron Architecture: Main process for OS-level operations and Renderer process for the UI.
2. IPC (Inter-Process Communication): Mechanism for the UI to talk to the file system and compiler.

---

### Engineering Analysis
Electron provides the necessary desktop integration required for a native IDE feel, while allowing the use of modern React-based UI components. This is vastly superior to the legacy wxPython UI.

---

### Implementation Work
Created a proof-of-concept Electron app. Configured Webpack to bundle a React frontend.

---

### Testing
Tested IPC messaging between the React frontend and the Electron main process.

---

### Problems Encountered
React fast-refresh was causing IPC event listeners to multiply on hot-reload.

---

### Solutions Applied
Implemented a cleanup routine in the React `useEffect` hook to remove listeners on unmount.

---

### Deliverables
Basic Electron + React boilerplate application.

---

### Knowledge Gained
Mastered IPC communication patterns in Electron and Webpack configuration for desktop apps.

---

### Next Day Plan
Integrate Monaco Editor and configure it for Structured Text syntax highlighting.

---

### Time Distribution
- **Research:** 2.5 hours
- **Implementation:** 3.0 hours
- **Testing:** 0.5 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 3

**Date:** 3 July 2026  
**Working Hours:** 7.0 hours  
**Objective:** Integrate Monaco Editor and establish basic Structured Text (ST) support.  

---

### Background
A robust code editor is the core of any IDE. Monaco (the engine behind VS Code) provides excellent performance and extensibility.

---

### Research Activities
Read Microsoft's Monaco Editor documentation regarding custom language definitions and Monarch syntax highlighting.

---

### Concepts Learned
1. Monaco Editor: High-performance web-based code editor.
2. Monarch: A JSON-based declarative syntax highlighter used by Monaco.

---

### Engineering Analysis
ST is not supported out-of-the-box by Monaco. Writing a custom Monarch definition is required. This is preferable to using a less performant editor like CodeMirror.

---

### Implementation Work
Integrated `@monaco-editor/react`. Wrote a Monarch language definition for IEC 61131-3 Structured Text, including keywords, variable types (BOOL, INT, REAL), and comment styles.

---

### Testing
Loaded sample ST code into the editor to verify syntax highlighting and performance.

---

### Problems Encountered
Regex for floating-point numbers in ST was incorrectly matching integer boundaries.

---

### Solutions Applied
Refined the Monarch tokenizer regex to properly distinguish between INT and REAL literals based on the presence of a decimal point.

---

### Deliverables
Functioning code editor component with custom ST syntax highlighting.

---

### Knowledge Gained
Learned how to construct custom language tokenizers using the Monarch declarative syntax.

---

### Next Day Plan
Research AI integration strategies for code generation and the Agent workflow.

---

### Time Distribution
- **Research:** 2.0 hours
- **Implementation:** 4.0 hours
- **Testing:** 0.5 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 4

**Date:** 4 July 2026  
**Working Hours:** 7.5 hours  
**Objective:** Design the AI Assistant integration strategy and Agent workflow.  

---

### Background
The 'Agentic' part of AgenticPLC requires a robust architecture to securely and efficiently communicate with LLMs for logic generation.

---

### Research Activities
Explored OpenAI and Llama 3.1 API documentation. Researched Agentic workflows (ReAct, Plan-and-Execute) for coding tasks.

---

### Concepts Learned
1. AI Agent Workflow: The cycle of Thought, Action, and Observation used by LLMs to solve complex tasks.
2. Tool Calling: Providing the LLM with specific functions (e.g., `insert_ladder_rung`) to modify the IDE state.

---

### Engineering Analysis
A purely conversational LLM is insufficient. The AI must be an 'Agent' capable of directly invoking IDE APIs. Selected a ReAct-based architecture.

---

### Implementation Work
Drafted the AI middleware layer in Node.js. Defined the JSON schema for tool execution.

---

### Testing
Mocked LLM responses to test the middleware's JSON parsing and tool-routing logic.

---

### Problems Encountered
Initial tests showed the LLM attempting to call multiple tools at once in a single JSON payload, which our mock backend couldn't handle.

---

### Solutions Applied
Implemented a rudimentary parser to extract the first tool call, ignoring subsequent ones for now. Concurrency will need deeper investigation later.

---

### Deliverables
AI middleware architecture diagram and working JSON parsing utility.

---

### Knowledge Gained
Understood the complexities of handling non-deterministic LLM outputs in deterministic software systems.

---

### Next Day Plan
Implement the UI components for the AI Assistant chat interface.

---

### Time Distribution
- **Research:** 3.5 hours
- **Implementation:** 2.5 hours
- **Testing:** 1.0 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 5

**Date:** 5 July 2026  
**Working Hours:** 6.5 hours  
**Objective:** Develop the AI Assistant Chat UI and establish UI branding.  

---

### Background
A sleek, modern interface is required to interact with the AI agent. The legacy OpenPLC branding needs to be replaced.

---

### Research Activities
Studied modern IDE aesthetics (glassmorphism, dark mode, smooth transitions).

---

### Concepts Learned
1. UI State Management: Managing the chat history and loading states in React.
2. CSS Modules / Tailwind: Scoped styling for clean UI components.

---

### Engineering Analysis
Decided to implement a custom dark mode theme to give a premium R&D feel. The chat interface must support markdown rendering for code snippets.

---

### Implementation Work
Rebranded the application from OpenPLC to AgenticPLC. Updated logos and brand colors. Built the `ChatPanel` component with user/agent message bubbles and a typing indicator.

---

### Testing
Tested UI responsiveness and scroll-to-bottom behavior when new messages arrive.

---

### Problems Encountered
The chat panel would not automatically scroll when tall code blocks were rendered.

---

### Solutions Applied
Attached a `ResizeObserver` to the message container to trigger scrolling whenever the DOM height changes.

---

### Deliverables
Fully branded AgenticPLC UI shell with an interactive chat panel.

---

### Knowledge Gained
Gained experience in advanced React DOM manipulation and UI UX design principles.

---

### Next Day Plan
Configure actual Agentic API access and connect the frontend to the backend.

---

### Time Distribution
- **Research:** 1.0 hours
- **Implementation:** 4.5 hours
- **Testing:** 0.5 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 6

**Date:** 6 July 2026  
**Working Hours:** 7.0 hours  
**Objective:** Configure Agentic API Access and implement live LLM communication.  

---

### Background
The frontend UI needs to send user prompts to the AI middleware, which then communicates with the LLM API.

---

### Research Activities
Reviewed streaming API implementations (Server-Sent Events) to reduce perceived latency.

---

### Concepts Learned
1. Server-Sent Events (SSE): A unidirectional protocol for streaming updates from server to client.
2. API Authentication: Securely managing API keys in the Electron main process.

---

### Engineering Analysis
Standard HTTP requests feel too slow for LLM generation. Streaming the response token-by-token is essential for a modern IDE experience.

---

### Implementation Work
Implemented an API settings page to store the API key securely in the OS keychain. Built the SSE connection logic in the React frontend.

---

### Testing
Successfully sent a prompt to the LLM and streamed the response back to the UI in real-time.

---

### Problems Encountered
API keys were initially exposed in the renderer process memory.

---

### Solutions Applied
Refactored the architecture to keep API keys strictly in the Electron main process, proxying requests securely.

---

### Deliverables
Working AI chat integrated with live LLM API via streaming.

---

### Knowledge Gained
Learned secure credential management in Electron applications.

---

### Next Day Plan
Implement the Language Server Protocol (LSP) basics for ST code analysis.

---

### Time Distribution
- **Research:** 2.0 hours
- **Implementation:** 4.0 hours
- **Testing:** 0.5 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 7

**Date:** 7 July 2026  
**Working Hours:** 7.5 hours  
**Objective:** Integrate basic Language Server Protocol (LSP) for code analysis.  

---

### Background
For the AI to provide context-aware suggestions, it needs to understand the AST (Abstract Syntax Tree) of the PLC code.

---

### Research Activities
Studied the Language Server Protocol specification and tools for parsing Structured Text.

---

### Concepts Learned
1. LSP: A standardized protocol for providing editor features like auto-complete and diagnostics.
2. AST Parsing: Converting raw source code into a structured tree representing the logic.

---

### Engineering Analysis
Building a full LSP from scratch is out of scope, but a lightweight AST parser for variable extraction is necessary for the AI context window.

---

### Implementation Work
Wrote a custom Regex-based tokenizer and simple AST builder to extract variable declarations (`VAR ... END_VAR`) from ST code.

---

### Testing
Tested the parser against complex ST files to verify variable extraction accuracy.

---

### Problems Encountered
Nested comments in ST `(* ... (* ... *) ... *)` were breaking the regex parser.

---

### Solutions Applied
Switched from simple regex to a state-machine based lexer to correctly handle nested comments and string literals.

---

### Deliverables
A lightweight ST parser capable of extracting variable symbols.

---

### Knowledge Gained
Gained fundamental knowledge of lexing, parsing, and compiler frontend design.

---

### Next Day Plan
Hook the AI agent into the visual editor internals.

---

### Time Distribution
- **Research:** 3.0 hours
- **Implementation:** 3.5 hours
- **Testing:** 0.5 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 8

**Date:** 8 July 2026  
**Working Hours:** 8.0 hours  
**Objective:** Hooking AI Into Editor Internals (React Flow).  

---

### Background
To allow the AI to generate Ladder Logic, it needs direct programmatic control over the visual editor's state.

---

### Research Activities
Deep dive into React Flow architecture, node management, and edge routing.

---

### Concepts Learned
1. React Flow: A library for building node-based graphical interfaces.
2. Visual Programming Graphs: Representing PLC ladder logic as a directed graph.

---

### Engineering Analysis
UI automation (simulating mouse clicks) is too brittle. The AI must invoke internal state-management APIs directly to insert nodes and edges.

---

### Implementation Work
Patched the editor rendering bundle to expose the React Flow instance globally. Created wrapper functions `insertNode(type, position)` and `connectNodes(source, target)`.

---

### Testing
Used the browser console to programmatically construct a simple latching circuit.

---

### Problems Encountered
Nodes inserted programmatically lacked the necessary internal metadata, causing the compiler to crash later.

---

### Solutions Applied
Analyzed a manually created node's JSON structure and ensured the wrapper functions inject identical default metadata (e.g., execution order, data types).

---

### Deliverables
API layer allowing programmatic manipulation of the visual ladder logic canvas.

---

### Knowledge Gained
Mastered React Flow node lifecycle and data injection techniques.

---

### Next Day Plan
Connect the programmatic API to the AI Agent's tool execution layer and test tool calling.

---

### Time Distribution
- **Research:** 2.5 hours
- **Implementation:** 4.0 hours
- **Testing:** 1.0 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 9

**Date:** 9 July 2026  
**Working Hours:** 6.5 hours  
**Objective:** State Management and Exposing the Zustand Store.  

---

### Background
The visual editor relies heavily on global state. The AI tools must sync perfectly with this state.

---

### Research Activities
Analyzed how Zustand manages state in the existing application architecture.

---

### Concepts Learned
1. Zustand Store: A small, fast state-management library for React.
2. Store Hydration: Loading serialized project data into the active state.

---

### Engineering Analysis
By exposing the Zustand store, the AI can read the entire project context (all variables, POUs, and configurations) instantly without parsing files.

---

### Implementation Work
Exposed `useProjectStore` to the `window` object in development mode. Wrote a tool for the AI called `get_project_context` that dumps the store to a JSON string.

---

### Testing
Invoked `get_project_context` via the AI prompt and verified the LLM could 'see' the current variables.

---

### Problems Encountered
First encounter with a critical flaw: The AI attempted to insert multiple nodes and variables simultaneously by firing multiple tool calls in parallel. This caused state corruption in Zustand.

---

### Solutions Applied
Realized that React state updates are asynchronous. Parallel tool executions cause race conditions. Began planning a sequential execution constraint for the Agent.

---

### Deliverables
Optimized project context extraction tool, but identified a major architectural flaw regarding concurrent AI tasks.

---

### Knowledge Gained
Learned that AI tool execution must be carefully synchronized with UI state lifecycles to prevent race conditions.

---

### Next Day Plan
Implement an execution queue to handle the concurrent task error.

---

### Time Distribution
- **Research:** 2.0 hours
- **Implementation:** 3.0 hours
- **Testing:** 1.0 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 10

**Date:** 10 July 2026  
**Working Hours:** 7.0 hours  
**Objective:** Addressing the 'Multiple Task' Error in AI Logic Generation.  

---

### Background
The project is currently blocked by the AI assistant attempting to perform multiple tasks at the same time, leading to fatal crashes.

---

### Research Activities
Studied asynchronous queue implementations in JavaScript and Mutex locks.

---

### Concepts Learned
1. Concurrency Errors: When two operations attempt to modify the same state simultaneously.
2. Execution Queue: A data structure that ensures tasks are executed one after the other.

---

### Engineering Analysis
The AI is too eager. When asked to 'Create a motor circuit', it generates 5 tool calls and dispatches them simultaneously. This throws the 'multiple task cannot be done at the same time' error in our backend.

---

### Implementation Work
Implemented an asynchronous queue `AIToolQueue`. Every tool call requested by the LLM is pushed to the queue. The queue awaits the resolution of each React Flow state update before popping the next task.

---

### Testing
Tested the queue with a complex AI prompt. The tasks executed sequentially.

---

### Problems Encountered
While sequential execution prevented the crash, the LLM timed out waiting for the responses from the backend, breaking the AI chat loop.

---

### Solutions Applied
For now, instructed the LLM via system prompt to ONLY dispatch ONE tool call per response. This is a temporary band-aid.

---

### Deliverables
A highly restricted AI Agent that can only perform one action per turn.

---

### Knowledge Gained
Gained a deep understanding of the difficulties in mapping LLM concurrency to UI thread execution.

---

### Next Day Plan
Optimize API calls using a Smart Trigger heuristic to save tokens.

---

### Time Distribution
- **Research:** 2.5 hours
- **Implementation:** 3.5 hours
- **Testing:** 1.0 hours
- **Documentation:** 0.0 hours

<div style='page-break-after: always;'></div>

## DAY 11

**Date:** 11 July 2026  
**Working Hours:** 7.5 hours  
**Objective:** Optimizing Agentic IDE Intelligence with a Smart Trigger.  

---

### Background
Calling the LLM with full context for simple queries (e.g., 'Hello') wastes tokens and increases latency.

---

### Research Activities
Studied intent classification and heuristic-based routing.

---

### Concepts Learned
1. Smart Trigger: A local, fast evaluation to determine if a full AI Agent chain is necessary.
2. Latency Optimization: Reducing the time-to-first-token for the user.

---

### Engineering Analysis
A lightweight regex/keyword heuristic on the frontend can intercept conversational queries and respond locally or route to a cheaper/faster model without invoking tool execution logic.

---

### Implementation Work
Implemented a routing layer. If the user prompt matches generic greetings or simple help commands, it bypasses the Agent loop and responds directly. Also fixed API serialization errors specific to the Llama 3.1 model.

---

### Testing
Verified that 'Hello' returns in < 100ms, while 'Create a motor starter circuit' correctly triggers the Agent workflow.

---

### Problems Encountered
The AI assistant is still fundamentally incomplete. If a user bypasses the smart trigger with a complex coding request, the AI still occasionally triggers the 'multiple task cannot be done at the same time' error if it ignores the system prompt constraints.

---

### Solutions Applied
Added a hard abort in the middleware: If `tool_calls.length > 1`, throw a hard error back to the LLM forcing it to retry sequentially.

---

### Deliverables
Optimized AI routing layer resulting in a highly responsive UI, though the AI assistant remains an incomplete prototype.

---

### Knowledge Gained
Gained practical experience in system-level latency optimization for AI applications.

---

### Next Day Plan
Hardware Abstraction Layer (HAL) planning.

---

### Time Distribution
- **Research:** 1.5 hours
- **Implementation:** 4.0 hours
- **Testing:** 1.5 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 12

**Date:** 12 July 2026  
**Working Hours:** 6.5 hours  
**Objective:** Hardware Abstraction Layer (HAL) architecture planning.  

---

### Background
AgenticPLC is not just software; it must interact with custom industrial hardware. A HAL is required to decouple the software from the specific hardware.

---

### Research Activities
Studied HAL designs in embedded systems and RTOS (Real-Time Operating Systems).

---

### Concepts Learned
1. HAL: A software layer that hides the underlying hardware details from the upper software layers.
2. Embedded Interfaces: How microcontrollers communicate with sensors (GPIO, ADC).

---

### Engineering Analysis
The compiler will generate C code. The HAL must provide standard C functions (e.g., `read_digital_input(pin)`) that map to the specific hardware registers of the chosen microcontroller.

---

### Implementation Work
Drafted the HAL API specification. Defined the standard function signatures for digital I/O, analog I/O, and PWM.

---

### Testing
Reviewed the API with sample C programs to ensure it is generic enough.

---

### Problems Encountered
Different microcontrollers have different pin multiplexing architectures, complicating a generic pin mapping.

---

### Solutions Applied
Decided to implement a configuration file (JSON based) that maps generic logical pins (e.g., %IX0.0) to hardware-specific physical pins.

---

### Deliverables
HAL Architecture Document and API Specification.

---

### Knowledge Gained
Gained a deep appreciation for the complexities of cross-platform embedded software design.

---

### Next Day Plan
Select the specific embedded controller and research communication interfaces.

---

### Time Distribution
- **Research:** 4.0 hours
- **Implementation:** 1.5 hours
- **Testing:** 0.0 hours
- **Documentation:** 1.0 hours

<div style='page-break-after: always;'></div>

## DAY 13

**Date:** 13 July 2026  
**Working Hours:** 7.0 hours  
**Objective:** Embedded Controller Selection and Communication Interfaces.  

---

### Background
A physical hardware target is needed for the custom PLC implementation. Communication protocols must be established.

---

### Research Activities
Compared ESP32, STM32, and Raspberry Pi Pico for the custom hardware target. Studied UART, SPI, and I2C protocols.

---

### Concepts Learned
1. Microcontroller Architecture: ARM Cortex-M vs. Xtensa.
2. UART/SPI/I2C: Serial communication protocols for peripheral interaction.

---

### Engineering Analysis
The STM32 offers excellent real-time performance and robust industrial peripheral support. Selected STM32 as the primary target architecture.

---

### Implementation Work
Wrote documentation detailing the hardware requirements. Began designing the software driver skeleton for UART communication between the IDE and the hardware.

---

### Testing
N/A - Design phase.

---

### Problems Encountered
Ensuring deterministic timing for the PLC scan cycle on a microcontroller running an RTOS is challenging.

---

### Solutions Applied
Planned to utilize hardware timers and high-priority interrupts to guarantee the PLC scan cycle timing, independent of the communication threads.

---

### Deliverables
Hardware selection document and driver skeletons.

---

### Knowledge Gained
Understood the trade-offs between different microcontroller architectures for industrial control.

---

### Next Day Plan
Research industrial communication protocols (Modbus, OPC UA).

---

### Time Distribution
- **Research:** 5.0 hours
- **Implementation:** 1.5 hours
- **Testing:** 0.0 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 14

**Date:** 14 July 2026  
**Working Hours:** 7.5 hours  
**Objective:** Industrial Protocol Integration Analysis (Modbus).  

---

### Background
To be a true PLC, AgenticPLC must support standard industrial protocols like Modbus RTU/TCP.

---

### Research Activities
Read the Modbus protocol specification. Analyzed open-source Modbus C libraries.

---

### Concepts Learned
1. Modbus RTU/TCP: A widely used master/slave industrial communication protocol.
2. Holding Registers / Coils: The memory structure used by Modbus.

---

### Engineering Analysis
Integrating an existing library (like libmodbus) is preferable to writing the protocol from scratch. The HAL needs to map Modbus addresses to the IEC 61131-3 memory model.

---

### Implementation Work
Drafted the memory mapping algorithm to align Modbus registers (0x0000) with PLC memory locations.

---

### Testing
Created a python script to simulate a Modbus slave and verify the memory mapping logic.

---

### Problems Encountered
Endianness (byte order) differences between the STM32 and Modbus protocol standard.

---

### Solutions Applied
Added byte-swapping utility functions in the HAL to ensure cross-platform compatibility.

---

### Deliverables
Modbus memory mapping documentation and utility functions.

---

### Knowledge Gained
Mastered the intricacies of the Modbus protocol and endianness issues in embedded systems.

---

### Next Day Plan
Develop the Custom Hardware Configuration UI in the IDE.

---

### Time Distribution
- **Research:** 3.0 hours
- **Implementation:** 3.5 hours
- **Testing:** 0.5 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 15

**Date:** 15 July 2026  
**Working Hours:** 8.0 hours  
**Objective:** Develop Custom Hardware Configuration UI.  

---

### Background
Users need a graphical way to map logical PLC variables to physical microcontroller pins.

---

### Research Activities
Reviewed UI designs of existing hardware configurators (e.g., STM32CubeMX).

---

### Concepts Learned
1. Dynamic Form Generation: Creating UI forms based on a JSON schema describing the selected hardware.
2. Data Binding: Linking the UI selections to the internal Zustand store.

---

### Engineering Analysis
The UI needs to be flexible enough to support future hardware boards. A schema-driven approach is best.

---

### Implementation Work
Built the `HardwareConfig` component in React. Implemented a dynamic table where users can assign variables to physical pins based on the selected board profile.

---

### Testing
Verified that pin conflicts (e.g., assigning two variables to the same physical pin) trigger immediate validation errors in the UI.

---

### Problems Encountered
Managing the complex state of pin assignments across multiple boards was causing state mutation bugs.

---

### Solutions Applied
Refactored the Zustand store to use Immer for immutable state updates, completely eliminating the mutation bugs.

---

### Deliverables
Working Custom Hardware Configuration UI.

---

### Knowledge Gained
Gained advanced experience in complex React state management and validation logic.

---

### Next Day Plan
Harden AI variable stability and revisit the AI completion status.

---

### Time Distribution
- **Research:** 1.0 hours
- **Implementation:** 5.0 hours
- **Testing:** 1.5 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 16

**Date:** 16 July 2026  
**Working Hours:** 7.0 hours  
**Objective:** Hardening AgenticPLC Variable Stability & Schema Compliance.  

---

### Background
The AI frequently hallucinates variable names when generating logic, causing compilation failures. Strict enforcement is needed.

---

### Research Activities
Investigated JSON Schema validation libraries (Zod, Ajv).

---

### Concepts Learned
1. AI Hallucination: When an LLM generates plausible but incorrect data.
2. Schema Compliance: Forcing the LLM output to match a predefined structure.

---

### Engineering Analysis
We must enforce strict schema compliance for variable injection. The AI tool must reject variables that don't exist in the project store.

---

### Implementation Work
Integrated Zod for schema validation on the AI tool endpoints. When the AI attempts to use a variable, the middleware checks the Zustand store. If it doesn't exist, it throws an error back to the AI.

---

### Testing
Prompted the AI to use a fake variable 'Motor_X'. The system caught the error and forced the AI to declare it first.

---

### Problems Encountered
The AI assistant's completion status took a hit today. When presented with the schema error, the LLM attempted to fix it by dispatching both a 'declare_variable' and an 'insert_node' command simultaneously. This triggered the dreaded 'multiple task cannot be done at the same time' error again.

---

### Solutions Applied
Improved the error messaging sent back to the AI, explicitly reminding it of the single-task constraint. The AI assistant is still clearly incomplete when handling complex error recoveries.

---

### Deliverables
Robust schema validation layer, though AI execution remains fragile.

---

### Knowledge Gained
Learned practical strategies for mitigating LLM hallucinations in structured environments, and verified that agent concurrency is exceptionally hard to solve.

---

### Next Day Plan
Implement the 'Screen-Scraper' fallback for variable rendering.

---

### Time Distribution
- **Research:** 2.0 hours
- **Implementation:** 4.0 hours
- **Testing:** 0.5 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 17

**Date:** 17 July 2026  
**Working Hours:** 7.5 hours  
**Objective:** Implement the Screen-Scraper fallback for UI rendering.  

---

### Background
Even with schema validation, the AI occasionally produces broken JSON that fails to render correctly in the UI grid.

---

### Research Activities
Analyzed fail-safe mechanisms in UI rendering pipelines.

---

### Concepts Learned
1. Defensive Programming: Anticipating and gracefully handling invalid data states.
2. Fallback Rendering: Using alternative data sources when the primary source is corrupted.

---

### Engineering Analysis
If the AI's internal representation of the variables desyncs from the editor, the UI breaks. A 'Screen-Scraper' fallback can read the variables directly from the code text if the JSON state is invalid.

---

### Implementation Work
Wrote a utility that parses the Structured Text editor content on-the-fly. If the Zustand variable store throws a rendering error, the UI falls back to displaying the variables extracted by the scraper.

---

### Testing
Corrupted the Zustand store manually. The UI successfully recovered and displayed the correct variables scraped from the editor.

---

### Problems Encountered
The screen-scraper was running on every keystroke, causing performance lag.

---

### Solutions Applied
Debounced the scraper execution to run only after 500ms of inactivity.

---

### Deliverables
Fault-tolerant UI rendering system with a robust fallback mechanism.

---

### Knowledge Gained
Mastered defensive UI programming and performance optimization with debouncing.

---

### Next Day Plan
Focus on AgenticPLC IDE overall performance optimization.

---

### Time Distribution
- **Research:** 1.5 hours
- **Implementation:** 4.5 hours
- **Testing:** 1.0 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 18

**Date:** 18 July 2026  
**Working Hours:** 6.5 hours  
**Objective:** IDE Performance Optimization and UI Animations.  

---

### Background
To achieve a premium R&D feel, the IDE must be highly responsive and visually dynamic.

---

### Research Activities
Studied Framer Motion and CSS performance optimization techniques.

---

### Concepts Learned
1. Layout Thrashing: When DOM updates cause the browser to repeatedly recalculate layout.
2. Micro-animations: Small, subtle animations that provide user feedback.

---

### Engineering Analysis
The visual editor and chat panel feel stiff. Adding subtle enter/exit animations and optimizing heavy DOM elements will improve the perceived quality.

---

### Implementation Work
Integrated Framer Motion. Added animated transitions for dialog boxes, toast notifications, and the AI chat bubbles. Optimized the React Flow rendering by memoizing custom node components.

---

### Testing
Profiled the application using Chrome DevTools. Achieved a solid 60FPS during complex node dragging.

---

### Problems Encountered
Animating React Flow nodes caused rendering artifacts due to conflicting transform styles.

---

### Solutions Applied
Restricted animations to the UI overlay panels and avoided animating the heavy canvas elements directly.

---

### Deliverables
A highly performant, premium-feeling IDE interface.

---

### Knowledge Gained
Gained expertise in React performance profiling and advanced CSS/Framer Motion animations.

---

### Next Day Plan
Integrate the IEC 61131-3 compiler.

---

### Time Distribution
- **Research:** 1.5 hours
- **Implementation:** 4.0 hours
- **Testing:** 0.5 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 19

**Date:** 19 July 2026  
**Working Hours:** 8.0 hours  
**Objective:** Compiler Integration and Build Pipeline.  

---

### Background
The IDE must compile the visual logic and ST code into C code that can be executed on the hardware.

---

### Research Activities
Analyzed the MatIEC compiler architecture (the open-source IEC 61131-3 compiler).

---

### Concepts Learned
1. ST to C Compilation: Translating IEC 61131-3 semantics into standard C.
2. Build Automation: Automating the invocation of compilers and linkers.

---

### Engineering Analysis
AgenticPLC needs to transparently invoke MatIEC in the background, capture errors, and map them back to the specific lines in the UI.

---

### Implementation Work
Wrote a Node.js wrapper around the MatIEC executable. Implemented a build pipeline that exports the project to ST, runs MatIEC, and parses the stderr output.

---

### Testing
Created a project with intentional syntax errors. Verified that the build pipeline catches the errors and displays them in the IDE console.

---

### Problems Encountered
MatIEC error messages are cryptic and refer to the generated ST file, not the visual UI nodes.

---

### Solutions Applied
Implemented a source-map equivalent. When generating the ST, special comments are inserted linking ST lines back to their origin UUIDs in the visual editor, allowing accurate error highlighting.

---

### Deliverables
Functional compiler pipeline with accurate error reporting.

---

### Knowledge Gained
Understood the complexities of cross-compilation and error mapping in visual programming environments.

---

### Next Day Plan
Develop the Runtime Integration and Simulation Setup.

---

### Time Distribution
- **Research:** 2.5 hours
- **Implementation:** 4.0 hours
- **Testing:** 1.0 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 20

**Date:** 20 July 2026  
**Working Hours:** 7.0 hours  
**Objective:** Runtime Integration and Software Simulation.  

---

### Background
Before deploying to physical hardware, users must be able to simulate their logic locally.

---

### Research Activities
Investigated ways to compile the generated C code as a local executable on Windows.

---

### Concepts Learned
1. GCC / MinGW: Toolchains for compiling C code on Windows.
2. Shared Memory: IPC mechanism for communicating between the IDE and the simulated PLC runtime.

---

### Engineering Analysis
The IDE needs to compile the project into a local executable, run it in the background, and establish a communication channel to read/write live variables for debugging.

---

### Implementation Work
Configured a MinGW build script. Modified the HAL to use local shared memory instead of physical pins when in 'Simulation Mode'. Implemented a WebSocket server in the IDE to stream live data from the simulator.

---

### Testing
Ran a simple counter program in simulation mode and watched the variable values update live in the UI.

---

### Problems Encountered
The Windows firewall repeatedly blocked the local simulator executable.

---

### Solutions Applied
Switched from network sockets to OS-level named pipes for local IPC, completely bypassing firewall restrictions.

---

### Deliverables
Fully functional local PLC simulation environment.

---

### Knowledge Gained
Mastered local IPC mechanisms and simulation architecture.

---

### Next Day Plan
End-to-End System Testing of all software features.

---

### Time Distribution
- **Research:** 2.0 hours
- **Implementation:** 4.0 hours
- **Testing:** 0.5 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 21

**Date:** 21 July 2026  
**Working Hours:** 6.5 hours  
**Objective:** End-to-End Software System Testing.  

---

### Background
All individual modules (UI, AI Agent, Compiler, Simulator) must be tested holistically to identify integration bugs.

---

### Research Activities
Reviewed software testing methodologies for complex IDEs.

---

### Concepts Learned
1. End-to-End (E2E) Testing: Testing the entire application flow from start to finish.
2. Regression Testing: Ensuring new features didn't break old functionality.

---

### Engineering Analysis
A comprehensive test scenario is needed: Create a project using AI, modify it manually, compile it, and simulate it.

---

### Implementation Work
Executed multiple test scenarios across Windows 10 and Windows 11 environments.

---

### Testing
While manual IDE functions and simulation worked flawlessly, E2E testing confirmed that the complete AI assistant is not completed yet. When tasked with building an entire 10-rung logic system, the agent flooded the API queue, causing the 'multiple task cannot be done at the same time' error, crashing the visual editor.

---

### Problems Encountered
The AI assistant is unstable for complex, generative tasks due to unresolved state synchronization issues.

---

### Solutions Applied
For the scope of this project, the AI assistant will be documented as an 'experimental feature' intended for single-rung modifications rather than full-scale project generation.

---

### Deliverables
Stable baseline IDE, but recognized incomplete state for the AI Assistant module.

---

### Knowledge Gained
Gained practical experience in system integration testing and the importance of scoping down incomplete features for release.

---

### Next Day Plan
Hardware Communication Simulation & Testing.

---

### Time Distribution
- **Research:** 1.0 hours
- **Implementation:** 2.0 hours
- **Testing:** 3.0 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 22

**Date:** 22 July 2026  
**Working Hours:** 7.0 hours  
**Objective:** Hardware Communication Testing & Integration.  

---

### Background
The software must prove it can theoretically communicate with the selected custom hardware via the HAL.

---

### Research Activities
Reviewed serial communication debugging tools.

---

### Concepts Learned
1. Serial Loopback: Connecting TX to RX to test serial port functionality.
2. Payload Serialization: Packing data efficiently for transmission.

---

### Engineering Analysis
Since physical custom boards are pending, a mock serial device must be used to test the IDE's hardware communication layer.

---

### Implementation Work
Wrote a Python script acting as a mock microcontroller over a virtual COM port. Integrated the serialport library into the AgenticPLC Electron main process.

---

### Testing
Sent 'Start' and 'Stop' commands from the IDE to the Python mock device. Verified successful transmission and response.

---

### Problems Encountered
Node.js serialport library had native compilation issues across different Windows build environments.

---

### Solutions Applied
Switched to using pre-compiled binaries via `electron-rebuild` and explicitly defined the ABI version in the build config.

---

### Deliverables
Verified serial communication bridge between IDE and mock hardware.

---

### Knowledge Gained
Learned the complexities of using native Node.js modules in Electron applications.

---

### Next Day Plan
UI State Glitch fixing and final polish.

---

### Time Distribution
- **Research:** 1.5 hours
- **Implementation:** 4.0 hours
- **Testing:** 1.0 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 23

**Date:** 23 July 2026  
**Working Hours:** 7.5 hours  
**Objective:** Fixing UI State Glitches and Final UX Polish.  

---

### Background
A professional R&D tool must be free of visual bugs and state inconsistencies before final documentation.

---

### Research Activities
Reviewed user feedback (simulated) regarding IDE usability.

---

### Concepts Learned
1. UX Polish: Refining the user interface to ensure it feels intuitive and robust.
2. State Reconciliation: Ensuring all parts of the UI reflect the same underlying data.

---

### Engineering Analysis
Several minor issues exist: Tooltips getting stuck, variable grid not updating immediately after an AI action, and dark mode contrast issues.

---

### Implementation Work
Fixed the tooltip z-index issues. Forced a React re-render of the variable grid upon AI tool completion. Tweaked the dark mode color palette to improve text readability.

---

### Testing
Extensive visual testing. Verified all edge cases in the UI.

---

### Problems Encountered
The variable grid was losing focus after a re-render, interrupting the user's typing flow.

---

### Solutions Applied
Implemented stable React keys and managed the focus state manually using `useRef` to restore focus after rendering.

---

### Deliverables
Highly polished, bug-free user interface.

---

### Knowledge Gained
Mastered advanced React focus management and UX refinement.

---

### Next Day Plan
Begin comprehensive project documentation.

---

### Time Distribution
- **Research:** 0.5 hours
- **Implementation:** 5.0 hours
- **Testing:** 1.5 hours
- **Documentation:** 0.5 hours

<div style='page-break-after: always;'></div>

## DAY 24

**Date:** 24 July 2026  
**Working Hours:** 6.0 hours  
**Objective:** Architecture Documentation and Diagramming.  

---

### Background
The final year project requires professional documentation detailing the internal workings of AgenticPLC.

---

### Research Activities
Reviewed industry-standard architecture documentation formats (C4 model).

---

### Concepts Learned
1. System Context Diagram: Shows the system's interactions with external entities.
2. Container Diagram: Shows the high-level architecture (Frontend, Backend, LLM, Compiler).

---

### Engineering Analysis
Clear visual diagrams are essential to explain the complex AI tool-execution layer and the hardware abstraction layer to examiners.

---

### Implementation Work
Used draw.io to create comprehensive architecture diagrams. Wrote detailed descriptions of the ReAct agent workflow.

---

### Testing
N/A

---

### Problems Encountered
Accurately depicting the agent's current state was tricky.

---

### Solutions Applied
Explicitly documented the agent's concurrency limitations in the architecture diagram. Added a warning box indicating that 'multiple task cannot be done at the same time' error prevents full autonomous generation.

---

### Deliverables
High-quality system architecture diagrams and technical descriptions.

---

### Knowledge Gained
Improved technical communication and software architecture diagramming skills.

---

### Next Day Plan
Write the hardware and compiler integration documentation.

---

### Time Distribution
- **Research:** 1.0 hours
- **Implementation:** 0.0 hours
- **Testing:** 0.0 hours
- **Documentation:** 5.0 hours

<div style='page-break-after: always;'></div>

## DAY 25

**Date:** 25 July 2026  
**Working Hours:** 6.5 hours  
**Objective:** Hardware and Compiler Integration Documentation.  

---

### Background
The engineering depth of the project lies heavily in the custom hardware and compiler integration, which must be thoroughly documented.

---

### Research Activities
Reviewed notes from Day 12 to 15 regarding the HAL and Modbus implementation.

---

### Concepts Learned
1. Hardware Mapping: Documenting how logical IEC addresses map to physical pins.
2. Cross-Compilation: Explaining the ST to C pipeline.

---

### Engineering Analysis
The documentation must clearly demonstrate the theoretical soundness of the custom hardware approach, even if the physical board is a prototype.

---

### Implementation Work
Wrote sections detailing the MatIEC integration, the custom HAL API, and the memory mapping algorithms for Modbus. Included code snippets of the HAL implementation.

---

### Testing
N/A

---

### Problems Encountered
Formatting C code snippets and memory map tables in the documentation software was tedious.

---

### Solutions Applied
Utilized markdown tables and syntax highlighting tools to ensure a professional appearance.

---

### Deliverables
Complete hardware and compiler integration chapters.

---

### Knowledge Gained
Gained experience in writing technical specifications for embedded systems.

---

### Next Day Plan
Write the final testing and results chapter.

---

### Time Distribution
- **Research:** 1.5 hours
- **Implementation:** 0.0 hours
- **Testing:** 0.0 hours
- **Documentation:** 5.0 hours

<div style='page-break-after: always;'></div>

## DAY 26

**Date:** 26 July 2026  
**Working Hours:** 7.0 hours  
**Objective:** Testing, Results Documentation, and Final Review.  

---

### Background
The project report must conclude with proof that the system works as intended.

---

### Research Activities
Gathered screenshots, performance metrics, and logs from previous testing phases.

---

### Concepts Learned
1. Performance Metrics: API latency, UI framerate, compile times.
2. Usability Metrics: Time taken to create a circuit manually vs. using AI.

---

### Engineering Analysis
Providing quantitative data (e.g., 'AI generates a single motor circuit 4x faster than manual dragging') strongly supports the project's core hypothesis.

---

### Implementation Work
Documented the E2E test results, latency optimizations (Smart Trigger), and visual comparisons of the UI. Formatted the final report.

---

### Testing
Proofread the entire document for technical accuracy and tone.

---

### Problems Encountered
The results section needed to honestly reflect the project's current state without sounding like a failure.

---

### Solutions Applied
Wrote a dedicated 'Known Limitations' section. Clearly stated: 'The complete AI assistant is not completed yet. While sequential commands execute flawlessly, the system throws a fatal multiple task cannot be done at the same time error when tasked with parallel generation.'

---

### Deliverables
Final, polished project report chapters, accurately reflecting the current engineering state.

---

### Knowledge Gained
Learned how to present engineering results effectively and document technical debt.

---

### Next Day Plan
Package the project, generate the final HTML/PDF, and prepare for submission.

---

### Time Distribution
- **Research:** 1.0 hours
- **Implementation:** 0.0 hours
- **Testing:** 1.0 hours
- **Documentation:** 5.0 hours

<div style='page-break-after: always;'></div>

## DAY 27

**Date:** 27 July 2026  
**Working Hours:** 5.5 hours  
**Objective:** Project Packaging and Final Submission Prep.  

---

### Background
The final step is to compile all engineering work into the required deliverable formats.

---

### Research Activities
Reviewed university submission guidelines.

---

### Concepts Learned
1. Source Code Packaging: Cleaning directories (node_modules, build artifacts) before zipping.
2. Documentation Generation: Compiling markdown/latex into a single professional document.

---

### Engineering Analysis
The project directory is massive. A clean script is needed to package the source code properly. The diary and report must be finalized.

---

### Implementation Work
Wrote a Node.js script to clean the project workspace. Compiled all daily logs into this single comprehensive engineering diary.

---

### Testing
Verified the HTML formatting, page breaks, and image resolutions.

---

### Problems Encountered
Reviewing the final diary highlighted that the AI agent concurrency issue was the most significant roadblock encountered.

---

### Solutions Applied
Added explicit mentions of the 'multiple task cannot be done at the same time' error to the Future Scope document, outlining a proposed architecture utilizing Web Workers and React batched state updates to solve it in v2.0.

---

### Deliverables
Final Source Code Zip, AgenticPLC Architecture Report, and this updated Engineering Diary reflecting the exact current state.

---

### Knowledge Gained
Successfully completed a full-lifecycle engineering R&D project, including the documentation of unresolved engineering challenges.

---

### Next Day Plan
Project documentation phase completed. Prepare for final presentation/viva.

---

### Time Distribution
- **Research:** 0.5 hours
- **Implementation:** 2.0 hours
- **Testing:** 1.0 hours
- **Documentation:** 2.0 hours

<div style='page-break-after: always;'></div>

