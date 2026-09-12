/**
 * AgenticPLC Core Architecture
 * 
 * This module isolates the LLM from the Editor UI by providing a robust, 
 * XML-driven data manipulation layer and native editor API interfaces.
 */

class XMLManager {
    constructor() {
        this.parser = new DOMParser();
        this.serializer = new XMLSerializer();
        this.currentXmlDoc = null;
        this.currentXmlPath = null;
    }

    async loadProject(projectPath) {
        if (!window.bridge || typeof window.bridge.readProjectFiles !== 'function') return false;
        try {
            const result = await window.bridge.readProjectFiles(projectPath);
            if (result && result.success && result.data) {
                const xmlContent = this.findXmlContent(result.data);
                if (xmlContent) {
                    this.currentXmlDoc = this.parser.parseFromString(xmlContent, "application/xml");
                    this.currentXmlPath = projectPath;
                    return true;
                }
            }
        } catch (e) {
            console.error("XMLManager load error:", e);
        }
        return false;
    }

    findXmlContent(data) {
        if (!data) return null;
        if (typeof data === 'object') {
            for (const key of Object.keys(data)) {
                if (key.endsWith('.xml') && typeof data[key] === 'string' && data[key].includes('<project')) {
                    return data[key];
                }
                const res = this.findXmlContent(data[key]);
                if (res) return res;
            }
        }
        return null;
    }

    async saveProject() {
        if (!this.currentXmlDoc || !this.currentXmlPath || !window.bridge || !window.bridge.writeFileNode) return false;
        const xmlString = '<?xml version="1.0" encoding="utf-8"?>\n' + this.serializer.serializeToString(this.currentXmlDoc);
        try {
            // Determine the exact path of plc.xml in the project directory
            // OpenPLC projects always use plc.xml at the root
            const fullPath = this.currentXmlPath.replace(/[/\\]$/, '') + "/plc.xml";
            await window.bridge.writeFileNode(fullPath, xmlString);
            return true;
        } catch (e) {
            console.error("XMLManager save error:", e);
        }
        return false;
    }

    insertNode(parentSelector, newElementXml) {
        if (!this.currentXmlDoc) return false;
        const parent = this.currentXmlDoc.querySelector(parentSelector);
        if (parent) {
            const newDoc = this.parser.parseFromString(newElementXml, "application/xml");
            const importedNode = this.currentXmlDoc.importNode(newDoc.documentElement, true);
            parent.appendChild(importedNode);
            return true;
        }
        return false;
    }
    
    deleteNode(selector) {
        if (!this.currentXmlDoc) return false;
        const node = this.currentXmlDoc.querySelector(selector);
        if (node && node.parentNode) {
            node.parentNode.removeChild(node);
            return true;
        }
        return false;
    }
}

class WorkspaceManager {
    constructor(xmlManager) {
        this.xmlManager = xmlManager;
    }

    getCurrentProject() {
        return this.xmlManager.currentXmlPath || "None";
    }

    getCurrentProgram() {
        if (!this.xmlManager.currentXmlDoc) return "None";
        const pous = this.xmlManager.currentXmlDoc.querySelectorAll("pou");
        let names = [];
        pous.forEach(p => names.push(p.getAttribute("name")));
        return names.length > 0 ? names.join(", ") : "None";
    }

    getCurrentVariables() {
        if (!this.xmlManager.currentXmlDoc) return "None";
        const vars = this.xmlManager.currentXmlDoc.querySelectorAll("variable");
        let details = [];
        vars.forEach(v => {
            const typeNode = v.querySelector("type > *");
            const typeName = typeNode ? typeNode.tagName : "UNKNOWN";
            details.push(`${v.getAttribute("name")} : ${typeName}`);
        });
        return details.length > 0 ? details.join("\n") : "No variables defined.";
    }

    getCurrentXML() {
        if (!this.xmlManager.currentXmlDoc) return "";
        return this.xmlManager.serializer.serializeToString(this.xmlManager.currentXmlDoc);
    }
}

class EditorController {
    constructor(xmlManager, workspaceManager) {
        this.xmlManager = xmlManager;
        this.workspaceManager = workspaceManager;
    }

    async insertElement(pouName, type, variableName, variant="default") {
        const store = window.__ROOT_STORE__;
        if (!store) {
            throw new Error("Agentic Core is not linked to the Editor Store! The UI injection patch may have failed.");
        }

        const flow = store.ladderFlows.find(f => f.name === pouName);
        if (!flow) {
            throw new Error(`Program '${pouName}' not found in the workspace. Please open it first.`);
        }

        if (!flow.rungs || flow.rungs.length === 0) {
            store.ladderFlowActions.startLadderRung({ editorName: pouName });
        }
        
        // Grab the active rung (default to first rung for now)
        const rung = flow.rungs[0];
        if (!rung) {
            throw new Error("No rung available to insert into.");
        }

        // Count elements before insertion for verification
        const beforeCount = rung.nodes.length;

        // Auto-layout: place the new block to the right of existing blocks
        const xOffset = 68 + (rung.nodes.length * 40);
        const uuid = crypto.randomUUID();
        const id = `${type.toUpperCase()}_${uuid}`;

        // Create the exact internal structure expected by OpenPLC Editor
        const newNode = {
            id: id,
            type: type,
            position: { x: xOffset, y: 38 },
            height: 24, 
            width: 24,
            draggable: true,
            selectable: true,
            data: {
                variant: variant,
                variable: { name: variableName },
                numericId: Math.floor(Math.random() * 10000000).toString(),
                executionOrder: 0,
                draggable: true,
                selectable: true,
                deletable: true,
                handles: [
                    { relPosition: { x: 0, y: 12 }, id: "input", position: "left", isConnectable: false, type: "target", style: { left: -3 } },
                    { relPosition: { x: 24, y: 12 }, id: "output", position: "right", isConnectable: false, type: "source", style: { right: -3 } }
                ],
                inputHandles: [
                    { relPosition: { x: 0, y: 12 }, id: "input", position: "left", isConnectable: false, type: "target", style: { left: -3 } }
                ],
                outputHandles: [
                    { relPosition: { x: 24, y: 12 }, id: "output", position: "right", isConnectable: false, type: "source", style: { right: -3 } }
                ],
                inputConnector: { relPosition: { x: 0, y: 12 }, id: "input", position: "left", isConnectable: false, type: "target", style: { left: -3 } },
                outputConnector: { relPosition: { x: 24, y: 12 }, id: "output", position: "right", isConnectable: false, type: "source", style: { right: -3 } }
            }
        };

        // Dispatch directly into the React AST!
        store.ladderFlowActions.addNode({
            editorName: pouName,
            rungId: rung.id,
            node: newNode
        });

        // Verification Layer (Wait up to 1 second for the store to update)
        for(let i = 0; i < 10; i++) {
            await new Promise(r => setTimeout(r, 100));
            const updatedFlow = window.__ROOT_STORE__.ladderFlows.find(f => f.name === pouName);
            const updatedRung = updatedFlow.rungs.find(r => r.id === rung.id);
            if (updatedRung.nodes.length > beforeCount) {
                return true; // Success!
            }
        }
        
        throw new Error(`The internal API rejected the ${type} insertion.`);
    }

    async buildLadderLogic(args) {
        if (!args) throw new Error("Missing arguments for buildLadderLogic. You must provide a 'nodes' array.");
        const pouName = args.pouName || "main";
        const nodes = Array.isArray(args.nodes) ? args.nodes : [];
        if (nodes.length === 0) throw new Error("LLM TOOL ERROR: You passed an empty 'nodes' array. YOU must generate the array of node objects (e.g. [{type:'contact', name:'Red'}, {type:'coil', name:'Green'}]) yourself and call this tool again. Do NOT ask the user to provide components.");
        
        const store = window.__ROOT_STORE__;
        if (!store) throw new Error("Agentic Core is not linked to the Editor Store!");
        
        const flow = store.ladderFlows.find(f => f.name === pouName);
        if (!flow) throw new Error(`Program '${pouName}' not found in the workspace. Please open it first.`);

        if (!flow.rungs || flow.rungs.length === 0) {
            store.ladderFlowActions.startLadderRung({ editorName: pouName });
            await new Promise(r => setTimeout(r, 200));
        }
        
        const updatedFlow = store.ladderFlows.find(f => f.name === pouName);
        const rung = updatedFlow.rungs[0];
        if (!rung) throw new Error("No rung available to insert into.");

        let successCount = 0;
        for (let i = 0; i < nodes.length; i++) {
            const nodeDef = nodes[i];
            const type = nodeDef.elementType || nodeDef.type; // 'contact', 'coil', 'timer', etc.
            const variableName = nodeDef.name;
            const variant = nodeDef.variant || "default";
            
            if (!type || typeof type !== 'string') {
                throw new Error(`Node at index ${i} is missing a valid 'type' property (e.g., 'contact', 'coil', 'timer'). Received: ${JSON.stringify(nodeDef)}`);
            }
            if (!variableName || typeof variableName !== 'string') {
                throw new Error(`Node at index ${i} is missing a valid 'name' property. Received: ${JSON.stringify(nodeDef)}`);
            }
            
            // Allow LLM to specify precise X/Y, or fallback to auto-layout
            const xOffset = nodeDef.x !== undefined ? nodeDef.x : 68 + (rung.nodes.length * 60);
            const yOffset = nodeDef.y !== undefined ? nodeDef.y : 38;
            
            const uuid = crypto.randomUUID();
            const id = `${type.toUpperCase()}_${uuid}`;

            let width = 24, height = 24;
            let handles = [
                { relPosition: { x: 0, y: 12 }, id: "input", position: "left", isConnectable: false, type: "target", style: { left: -3 } },
                { relPosition: { x: 24, y: 12 }, id: "output", position: "right", isConnectable: false, type: "source", style: { right: -3 } }
            ];

            if (type.toLowerCase() === 'timer' || type.toLowerCase() === 'functionblock') {
                width = 50; height = 60;
                handles = [
                    { relPosition: { x: 0, y: 15 }, id: "in1", position: "left", type: "target", style: { left: -3 } },
                    { relPosition: { x: 0, y: 45 }, id: "in2", position: "left", type: "target", style: { left: -3 } },
                    { relPosition: { x: 50, y: 15 }, id: "out1", position: "right", type: "source", style: { right: -3 } },
                    { relPosition: { x: 50, y: 45 }, id: "out2", position: "right", type: "source", style: { right: -3 } }
                ];
            }

            const newNode = {
                id: id,
                type: type,
                position: { x: xOffset, y: yOffset },
                height: height, 
                width: width,
                draggable: true,
                selectable: true,
                data: {
                    variant: variant,
                    variable: { name: variableName },
                    numericId: Math.floor(Math.random() * 10000000).toString(),
                    executionOrder: 0,
                    draggable: true,
                    selectable: true,
                    deletable: true,
                    handles: handles,
                    inputHandles: handles.filter(h => h.type === 'target'),
                    outputHandles: handles.filter(h => h.type === 'source'),
                    inputConnector: handles.find(h => h.type === 'target'),
                    outputConnector: handles.find(h => h.type === 'source')
                }
            };

            store.ladderFlowActions.addNode({
                editorName: pouName,
                rungId: rung.id,
                node: newNode
            });
            
            successCount++;
            await new Promise(r => setTimeout(r, 50));
        }
        
        return `Successfully injected ${successCount} nodes into the AST.`;
    }

    
    
    async addVariables(args) {
        const pouName = args.pouName || "main";
        let variables = args.variables;
        
        // Auto-fix if LLM hallucinated the schema
        if (!variables && args.name) {
            variables = [args]; // Single variable passed directly in args
        } else if (typeof variables === 'string') {
            try { variables = JSON.parse(variables); } catch (e) { variables = []; }
        } else if (!Array.isArray(variables)) {
            variables = [];
        }
        
        if (!variables || variables.length === 0) {
            return "No variables provided. Ensure you pass an array of variables.";
        }
        
        const store = window.__ROOT_STORE__;
        if (!store) throw new Error("Agentic Core is not linked to the Editor Store!");
        
        
        // Loose matching to handle paths like "pous/programs/main.st"
        let cleanName = pouName.replace(/\\/g, '/').split('/').pop().replace('.st', '').trim();
        const pou = store.project?.data?.pous?.find(p => p.name.toLowerCase() === cleanName.toLowerCase());
    
        if (!pou) throw new Error(`Program '${pouName}' not found in the workspace.`);
        

        
        let currentVars = JSON.parse(JSON.stringify(pou.interface.variables || []));
        let addedNames = [];
        
        for (const v of variables) {
            let varName, varType, varClass, location, initialValue, documentation;
            if (typeof v === 'string') {
                varName = v;
                varType = "BOOL";
                varClass = "Local";
                location = "";
                initialValue = "";
                documentation = "";
            } else if (v && typeof v === 'object') {
                varName = v.name;
                varType = v.dataType || v.type || "BOOL";
                varClass = v.class || "Local";
                location = v.location || "";
                initialValue = v.initialValue || "";
                documentation = v.documentation || "";
            } else {
                continue;
            }
            
            if (!varName) continue;
            
            if (currentVars.find(existing => existing.name === varName)) {
                continue; // Skip if it already exists
            }
            
            currentVars.push({
                id: crypto.randomUUID(),
                name: varName,
                type: { value: varType },
                class: (varClass || "local").toLowerCase(),
                location: location,
                initialValue: initialValue,
                documentation: documentation
            });
            addedNames.push(varName);
        }
        
        if (typeof store.projectActions.applyPouSnapshot === 'function') {
            store.projectActions.applyPouSnapshot(pouName, currentVars, pou.body ? JSON.parse(JSON.stringify(pou.body)) : { language: 'st', value: '' });
        } else {
            console.error("applyPouSnapshot not available!");
        }
        
        return `Successfully added ${addedNames.length} variables to program '${pouName}': ${addedNames.join(', ')}`;
    }
    
    async clearVariables(args) {
        const pouName = args?.pouName || "main";
        const store = window.__ROOT_STORE__;
        if (!store) throw new Error("Agentic Core is not linked to the Editor Store!");
        
        let cleanName = pouName.replace(/\\/g, '/').split('/').pop().replace('.st', '').trim();
        const pou = store.project?.data?.pous?.find(p => p.name.toLowerCase() === cleanName.toLowerCase());
    
        if (!pou) throw new Error(`Program '${pouName}' not found in the workspace.`);
        
        if (typeof store.projectActions.applyPouSnapshot === 'function') {
            store.projectActions.applyPouSnapshot(pouName, [], pou.body ? JSON.parse(JSON.stringify(pou.body)) : { language: 'st', value: '' });
        } else {
            console.error("applyPouSnapshot not available!");
            throw new Error("Unable to clear variables: applyPouSnapshot not found on store.");
        }
        
        return `Successfully cleared all variables from program '${pouName}'.`;
    }
    
    async readCurrentPou(args) {
        const pouName = args.pouName || "main";
        
        // Try to get fresh state from Zustand store
        let store = null;
        if (window.__ZUSTAND_STORE__ && typeof window.__ZUSTAND_STORE__.getState === 'function') {
            store = window.__ZUSTAND_STORE__.getState();
        }
        if (!store) store = window.__ROOT_STORE__;
        if (!store) throw new Error("Agentic Core is not linked to the Editor Store!");
        
        let cleanName = pouName.replace(/\\/g, '/').split('/').pop().replace('.st', '').trim();
        
        // Search all possible paths for pous array
        const possiblePouArrays = [
            store.project?.data?.pous,
            store.project?.pous,
            store.pous,
            store.project?.data?.configuration?.resource?.pous,
        ].filter(arr => Array.isArray(arr));
        
        let pou = null;
        for (const pouArr of possiblePouArrays) {
            pou = pouArr.find(p => p.name && p.name.toLowerCase() === cleanName.toLowerCase());
            if (pou) break;
        }
        
        // If still not found, try to dump available keys for debugging
        if (!pou) {
            const debugInfo = {
                storeKeys: Object.keys(store || {}),
                projectKeys: Object.keys(store?.project || {}),
                projectDataKeys: Object.keys(store?.project?.data || {}),
                pouArrayLengths: possiblePouArrays.map(a => a.length),
            };
            return JSON.stringify({ error: `POU '${pouName}' not found.`, debug: debugInfo });
        }
        
        const variables = pou.interface?.variables || [];
        const code = pou.body?.value || pou.body?.content || "";
        
        return JSON.stringify({
            name: pou.name,
            variables: variables.map(v => ({ name: v.name, type: v.type?.value || v.type })),
            code: code
        });
    }
    syncMonacoEditor(cleanName, newBodyValue) {
        try {
            if (window.monaco && window.monaco.editor) {
                const models = window.monaco.editor.getModels();
                for (let m of models) {
                    if (m.uri.path.toLowerCase().includes(cleanName.toLowerCase())) {
                        const text = m.getValue();
                        const lastVarIdx = text.lastIndexOf('END_VAR');
                        const endKeywordIdx = text.lastIndexOf('END_');
                        
                        if (lastVarIdx !== -1 && endKeywordIdx > lastVarIdx) {
                            const beforeBody = text.substring(0, lastVarIdx + 7);
                            const afterBody = text.substring(endKeywordIdx);
                            m.setValue(beforeBody + '\n' + newBodyValue + '\n' + afterBody);
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Monaco sync failed:", e);
        }
    }

    async writeSTCode(args) {
        const pouName = args.pouName || "main";
        let code = args.code || "";
        code = code.replace(/\\n/g, "\n");
        const store = window.__ROOT_STORE__;
        
        if (!store) throw new Error("Agentic Core is not linked to the Editor Store!");
        
        if (!store.project || !store.project.data || !store.project.data.pous) {
            throw new Error("No active project loaded in the store.");
        }
        
        let cleanName = pouName.replace(/\\/g, '/').split('/').pop().replace('.st', '').trim();
        const pou = store.project?.data?.pous?.find(p => p.name.toLowerCase() === cleanName.toLowerCase());
    
        if (!pou) throw new Error(`Program '${pouName}' not found in the workspace.`);
        
        if (!pou.body) pou.body = {};
        pou.body.value = code;
        pou.body.content = code;
        pou.body.language = "st";
        
        const newBody = { language: "st", value: code, content: code };
        
        this.syncMonacoEditor(cleanName, code);
        
        if (typeof store.projectActions.applyPouSnapshot === 'function') {
            const currentVars = {
                localVars: pou.variables?.localVars ? [...pou.variables.localVars] : [],
                inputVars: pou.variables?.inputVars ? [...pou.variables.inputVars] : [],
                outputVars: pou.variables?.outputVars ? [...pou.variables.outputVars] : [],
            };
            store.projectActions.applyPouSnapshot(pouName, currentVars, newBody);
        } else if (store.projectActions.updatePou) {
            store.projectActions.updatePou({ name: pouName, content: newBody });
        }
        
        try { await window.AgenticCore.XMLManager.saveProject(); await this.reloadProjectUI(); } catch(e){}
        return `Successfully injected ST code into the editor for program '${pouName}'.`;
    }

    async clearSTCode(args) {
        const pouName = args.pouName || "main";
        const store = window.__ROOT_STORE__;
        
        if (!store) throw new Error("Agentic Core is not linked to the Editor Store!");
        
        let cleanName = pouName.replace(/\\/g, '/').split('/').pop().replace('.st', '').trim();
        const pou = store.project?.data?.pous?.find(p => p.name.toLowerCase() === cleanName.toLowerCase());
    
        if (!pou) throw new Error(`Program '${pouName}' not found in the workspace.`);
        
        if (!pou.body) pou.body = {};
        pou.body.value = " ";
        pou.body.content = " ";
        pou.body.language = "st";
        
        const newBody = { language: "st", value: " ", content: " " };
        
        this.syncMonacoEditor(cleanName, " ");
        
        if (typeof store.projectActions.applyPouSnapshot === 'function') {
            const currentVars = {
                localVars: pou.variables?.localVars ? [...pou.variables.localVars] : [],
                inputVars: pou.variables?.inputVars ? [...pou.variables.inputVars] : [],
                outputVars: pou.variables?.outputVars ? [...pou.variables.outputVars] : [],
            };
            store.projectActions.applyPouSnapshot(pouName, currentVars, newBody);
        } else if (store.projectActions.updatePou) {
            store.projectActions.updatePou({ name: pouName, content: newBody });
        }
        
        try { await window.AgenticCore.XMLManager.saveProject(); await this.reloadProjectUI(); } catch(e){}
        return `Successfully cleared ST code from program '${pouName}'.`;
    }

    async reloadProjectUI() {
        const store = window.__ROOT_STORE__;
        if (!store || !store.project || !store.project.meta || !store.project.meta.path) return;
        try {
            const res = await window.bridge.readProjectFiles(store.project.meta.path);
            if (res && res.success && res.data) {
                if (store.sharedWorkspaceActions && typeof store.sharedWorkspaceActions.handleOpenProjectResponse === 'function') {
                    store.sharedWorkspaceActions.handleOpenProjectResponse(res.data);
                } else if (typeof store.getState === 'function') {
                    const fallback = store.getState();
                    if (fallback.sharedWorkspaceActions) fallback.sharedWorkspaceActions.handleOpenProjectResponse(res.data);
                }
            }
        } catch(e) { console.error("Failed to reload project UI:", e); }
    }

    async createPou(args) {
        const pouType = args.pouType || args.type;
        if (!args.name || !pouType) throw new Error("Missing 'name' or 'pouType' for POU.");
        // Use the native backend to avoid XML desyncs
        await window.bridge.createPouFile({
            name: args.name,
            type: pouType.toUpperCase(),
            language: (args.language || 'st').toLowerCase(),
            path: window.__ROOT_STORE__?.project?.meta?.path
        });
        await this.reloadProjectUI();
        return `Successfully created POU '${args.name}' of type '${pouType}'.`;
    }

    async deletePou(args) {
        if (!args.name) throw new Error("Missing 'name' for POU to delete.");
        await window.bridge.deletePouFile({
            name: args.name,
            path: window.__ROOT_STORE__?.project?.meta?.path
        });
        await this.reloadProjectUI();
        return `Successfully deleted POU '${args.name}'.`;
    }

    async renamePou(args) {
        if (!args.oldName || !args.newName) throw new Error("Missing 'oldName' or 'newName' for POU.");
        await window.bridge.renamePouFile({
            oldName: args.oldName,
            newName: args.newName,
            path: window.__ROOT_STORE__?.project?.meta?.path
        });
        await this.reloadProjectUI();
        return `Successfully renamed POU '${args.oldName}' to '${args.newName}'.`;
    }
    
    async executeAppCommand(args) {
        if (!args.command) throw new Error("Missing 'command'.");
        if (typeof window.bridge[args.command] !== 'function') throw new Error(`Command '${args.command}' does not exist on window.bridge.`);
        
        const payload = args.payload || {};
        // If it's a project/pou command and path is missing, auto-inject it
        if (!payload.path && window.__ROOT_STORE__?.project?.meta?.path) {
            payload.path = window.__ROOT_STORE__.project.meta.path;
        }
        
        const result = await window.bridge[args.command](payload);
        
        // If it looks like a mutating command, reload the UI
        if (args.command.toLowerCase().includes('create') || args.command.toLowerCase().includes('delete') || args.command.toLowerCase().includes('rename') || args.command.toLowerCase().includes('write')) {
            await this.reloadProjectUI();
        }
        
        return { success: true, message: `Executed ${args.command}`, data: result };
    }

    async compileProject(args) {
        const store = window.__ROOT_STORE__;
        if (!store) throw new Error("Agentic Core is not linked to the Editor Store!");
        
        // Try to trigger compilation via the bridge
        if (!window.bridge) throw new Error("Bridge not available for compilation.");
        
        return new Promise((resolve, reject) => {
            let output = [];
            let resolved = false;
            
            // Try the compile program flow
            if (typeof window.bridge.runCompileProgram === 'function') {
                const compileData = {
                    projectPath: store.project?.meta?.path || '',
                    type: 'program'
                };
                
                window.bridge.runCompileProgram(compileData, (msg) => {
                    if (resolved) return;
                    if (msg && msg.closePort) {
                        resolved = true;
                        const fullOutput = output.join('\n');
                        const hasError = /error|fail/i.test(fullOutput) && !/0 error/i.test(fullOutput);
                        resolve({
                            success: !hasError,
                            output: fullOutput,
                            summary: hasError ? 'Compilation failed. See errors above.' : 'Compilation successful!'
                        });
                    } else if (msg) {
                        output.push(typeof msg === 'string' ? msg : JSON.stringify(msg));
                    }
                });
                
                // Safety timeout
                setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        resolve({ success: false, output: output.join('\n'), summary: 'Compilation timed out after 30 seconds.' });
                    }
                }, 30000);
            } else {
                reject(new Error("Compile function not available on bridge."));
            }
        });
    }

    async simulateProject(args) {
        if (!window.bridge) throw new Error("Bridge not available.");
        
        if (typeof window.bridge.simulatorLoadFirmware === 'function') {
            const store = window.__ROOT_STORE__;
            const projectPath = store?.project?.data?.meta?.path || '';
            const result = await window.bridge.simulatorLoadFirmware(projectPath);
            return { success: true, result: result, message: 'Simulator loaded. The PLC logic is now running in simulation mode.' };
        }
        throw new Error("Simulator not available.");
    }

    async stopSimulation(args) {
        if (!window.bridge) throw new Error("Bridge not available.");
        if (typeof window.bridge.simulatorStop === 'function') {
            await window.bridge.simulatorStop();
            return { success: true, message: 'Simulator stopped.' };
        }
        throw new Error("Simulator stop not available.");
    }

    async getProjectSummary(args) {
        // Try to get fresh state from Zustand store
        let store = null;
        if (window.__ZUSTAND_STORE__ && typeof window.__ZUSTAND_STORE__.getState === 'function') {
            store = window.__ZUSTAND_STORE__.getState();
        }
        if (!store) store = window.__ROOT_STORE__;
        if (!store) throw new Error("Agentic Core is not linked to the Editor Store!");
        
        const project = store.project?.data || store.project || store;
        if (!project) return JSON.stringify({ error: "No project loaded." });
        
        // Search all possible paths for pous array
        const possiblePouArrays = [
            store.project?.data?.pous,
            store.project?.pous,
            store.pous,
            store.project?.data?.configuration?.resource?.pous,
        ].filter(arr => Array.isArray(arr));
        
        const pousArray = possiblePouArrays[0] || [];
        
        const pous = pousArray.map(pou => {
            const vars = (pou.interface?.variables || []).map(v => ({
                name: v.name,
                type: v.type?.value || v.type,
                class: v.class || 'local',
                location: v.location || '',
                initialValue: v.initialValue || ''
            }));
            return {
                name: pou.name,
                type: pou.type || 'program',
                language: pou.body?.language || 'st',
                variables: vars,
                code: pou.body?.value || pou.body?.content || ''
            };
        });
        
        return JSON.stringify({
            projectName: project.meta?.name || project.name || 'Unknown',
            projectPath: project.meta?.path || project.path || '',
            pous: pous
        }, null, 2);
    }

    async insertContact(args) {
        const pou = args.pouName || 'main';
        const name = args.contactName || args.name || 'C1';
        return await this.insertElement(pou, 'contact', name);
    }
    
    async insertCoil(args) {
        const pou = args.pouName || 'main';
        const name = args.coilName || args.name || 'C2';
        return await this.insertElement(pou, 'coil', name);
    }
}

class ContextBuilder {
    constructor(workspaceManager) {
        this.workspaceManager = workspaceManager;
    }

    buildContext() {
        return `
=== CURRENT WORKSPACE ===
Project Path: ${this.workspaceManager.getCurrentProject()}
Programs (POUs): ${this.workspaceManager.getCurrentProgram()}
Variables:
${this.workspaceManager.getCurrentVariables()}
=========================`.trim();
    }
}

class ToolDispatcher {
    constructor(editorController) {
        this.editorController = editorController;
        this.registry = {};
        
        // Auto-register EditorController methods
        const methods = Object.getOwnPropertyNames(EditorController.prototype).filter(m => m !== 'constructor');
        for (const method of methods) {
            this.registerCommand(method, async (args) => {
                return await this.editorController[method](args);
            });
        }
    }

    registerCommand(name, handler) {
        this.registry[name] = handler;
    }

    async dispatch(toolName, args) {
        if (this.registry[toolName]) {
            return await this.registry[toolName](args);
        }
        throw new Error(`Tool ${toolName} is not registered in the ToolDispatcher.`);
    }
}

// Instantiate Global Architecture
const coreXmlManager = new XMLManager();
const coreWorkspaceManager = new WorkspaceManager(coreXmlManager);
const coreEditorController = new EditorController(coreXmlManager);
const coreContextBuilder = new ContextBuilder(coreWorkspaceManager);
const coreToolDispatcher = new ToolDispatcher(coreEditorController);

window.AgenticCore = {
    XMLManager: coreXmlManager,
    WorkspaceManager: coreWorkspaceManager,
    EditorController: coreEditorController,
    ContextBuilder: coreContextBuilder,
    ToolDispatcher: coreToolDispatcher
};

console.log("AgenticPLC Core Architecture Loaded.");
