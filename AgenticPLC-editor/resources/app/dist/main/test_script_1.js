
    // Global Theme Handler
    const themeSelect = document.getElementById('ai-theme-select');
    const htmlEl = document.documentElement;
    const savedTheme = localStorage.getItem('ai_theme') || 'material3';
    
    function applyGlobalTheme(theme) {
      themeSelect.value = theme;
      htmlEl.setAttribute('data-ai-theme', theme);
      if (theme === 'dark' || theme === 'mixed') { htmlEl.classList.add('dark'); } else { htmlEl.classList.remove('dark'); }
    }
    applyGlobalTheme(savedTheme);
    themeSelect.addEventListener('change', (e) => {
      applyGlobalTheme(e.target.value);
      localStorage.setItem('ai_theme', e.target.value);
    });

    // Formatting Markdown
    function formatMarkdown(text) {
      let html = text;
      html = html.replace(/^### (.*$)/gim, '<br><strong style="font-size:1.1em;">$1</strong>');
      html = html.replace(/^## (.*$)/gim, '<br><strong style="font-size:1.2em;">$1</strong>');
      html = html.replace(/^# (.*$)/gim, '<br><strong style="font-size:1.3em;">$1</strong>');
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
      html = html.replace(/^\* (.*$)/gim, '<div style="margin-left: 10px;">&bull; $1</div>');
      html = html.replace(/^- (.*$)/gim, '<div style="margin-left: 10px;">&bull; $1</div>');
      html = html.replace(/`(.*?)`/g, '<code style="padding:2px 4px;border-radius:3px;font-family:monospace;font-size:0.9em;background:rgba(127,127,127,0.2);">$1</code>');
      html = html.replace(/\n/g, '<br>');
      return html;
    }
    
    // History Management
    let historyData = JSON.parse(localStorage.getItem('ai_history') || '[]');
    function saveHistory(prompt, responseHtml) {
      historyData.push({ prompt, response: responseHtml, time: new Date().toLocaleString() });
      localStorage.setItem('ai_history', JSON.stringify(historyData));
      renderHistory();
    }
    function renderHistory() {
      const list = document.getElementById('ai-history-list');
      list.innerHTML = '';
      if (historyData.length === 0) {
        list.innerHTML = '<div style="opacity: 0.6; text-align: center; margin-top: 20px;">No history yet.</div>';
        return;
      }
      historyData.forEach((item, index) => {
        let div = document.createElement('div');
        div.style.cssText = 'background: var(--ai-msg-bg-ai); color: var(--ai-msg-text-ai); padding: 12px; border-radius: var(--ai-radius); box-shadow: 0 1px 3px rgba(0,0,0,0.1);';
        div.innerHTML = '<div style="color: var(--ai-primary); font-weight: bold; margin-bottom: 8px;">Q: ' + item.prompt + '</div><div style="margin-bottom: 12px; line-height: 1.5;">' + item.response + '</div><div style="display: flex; justify-content: space-between; font-size: 11px; opacity: 0.7; border-top: 1px solid var(--ai-border); padding-top: 8px;"><span>' + item.time + '</span><button onclick="deleteHistoryItem(' + index + ')" style="background: transparent; color: var(--ai-danger); border: none; cursor: pointer; font-weight: bold;">Delete</button></div>';
        list.appendChild(div);
      });
    }
    window.deleteHistoryItem = function(idx) {
      historyData.splice(idx, 1);
      localStorage.setItem('ai_history', JSON.stringify(historyData));
      renderHistory();
    };
    document.getElementById('ai-clear-history-btn').addEventListener('click', () => {
      historyData = [];
      localStorage.setItem('ai_history', JSON.stringify(historyData));
      renderHistory();
    });
    
    // Tabs Navigation
    function switchTab(activeId) {
      ['chat', 'history', 'settings'].forEach(id => {
        document.getElementById('tab-' + id).style.color = (activeId === id) ? 'var(--ai-tab-active)' : 'var(--ai-tab-inactive)';
        document.getElementById('view-' + id).style.display = (activeId === id) ? 'flex' : 'none';
      });
      if(activeId === 'history') renderHistory();
    }
    document.getElementById('tab-chat').addEventListener('click', () => switchTab('chat'));
    document.getElementById('tab-history').addEventListener('click', () => switchTab('history'));
    document.getElementById('tab-settings').addEventListener('click', () => switchTab('settings'));
    
    document.getElementById('ai-new-chat-btn').addEventListener('click', () => {
      switchTab('chat');
      document.getElementById('ai-chat-messages').innerHTML = '<div class="ai-bubble-ai">Hello! I am AgenticPLC\'s Autonomous Copilot. I can read your workspace, execute commands, and help you program! How can I help you today?</div>';
      currentSessionMessages = [];
    });
    
    // Settings Logic
    const defaultSettings = {
      preset: 'nvidia',
      url: 'https://integrate.api.nvidia.com/v1/chat/completions',
      key: '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',
      model: 'meta/llama-3.1-70b-instruct'
    };
    
    let apiSettings = JSON.parse(localStorage.getItem('ai_api_settings')) || defaultSettings;
    
    const elPreset = document.getElementById('setting-preset');
    const elUrl = document.getElementById('setting-url');
    const elKey = document.getElementById('setting-key');
    const elModel = document.getElementById('setting-model');
    
    function populateSettingsUI() {
      elPreset.value = apiSettings.preset || 'custom';
      elUrl.value = apiSettings.url;
      elKey.value = (apiSettings.key === defaultSettings.key) ? '' : apiSettings.key;
      elModel.value = apiSettings.model;
    }
    populateSettingsUI();
    
    elPreset.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'gemini') {
        elUrl.value = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
        elModel.value = 'gemini-2.5-pro';
      } else if (val === 'groq') {
        elUrl.value = 'https://api.groq.com/openai/v1/chat/completions';
        elModel.value = 'llama-3.3-70b-versatile';
      } else if (val === 'nvidia') {
        elUrl.value = 'https://integrate.api.nvidia.com/v1/chat/completions';
        elModel.value = 'meta/llama-3.1-70b-instruct';
      } else if (val === 'custom') {
        elUrl.value = 'http://localhost:11434/v1/chat/completions';
        elModel.value = 'llama3';
      }
    });
    
    document.getElementById('ai-save-settings').addEventListener('click', () => {
      let keyToSave = elKey.value;
      if (elPreset.value === 'nvidia' && !keyToSave) {
         keyToSave = defaultSettings.key;
      }
      apiSettings = {
        preset: elPreset.value,
        url: elUrl.value,
        key: keyToSave,
        model: elModel.value
      };
      localStorage.setItem('ai_api_settings', JSON.stringify(apiSettings));
      const msg = document.getElementById('settings-save-msg');
      msg.style.display = 'block';
      setTimeout(() => msg.style.display = 'none', 2000);
    });
    
    // Chat & Agent Logic
    let currentSessionMessages = [];
    let pendingConfirmation = null;

    async function getCurrentRuntimeAddress() {
      if (!window.bridge || typeof window.bridge.retrieveRecent !== 'function' || typeof window.bridge.readProjectFiles !== 'function') return '';
      const projects = await window.bridge.retrieveRecent();
      const visibleText = (document.body.innerText || '').toLowerCase();
      const currentProject = Array.isArray(projects) ? projects.find(project => project && project.name && visibleText.includes(String(project.name).toLowerCase())) : null;
      if (!currentProject || !currentProject.path) return '';
      const result = await window.bridge.readProjectFiles(currentProject.path);
      if (!result || !result.success) return '';
      const findAddress = value => {
        if (!value) return '';
        if (typeof value === 'string') {
          try { return findAddress(JSON.parse(value)); } catch (_) { return ''; }
        }
        if (Array.isArray(value)) {
          for (const item of value) { const address = findAddress(item); if (address) return address; }
          return '';
        }
        if (typeof value === 'object') {
          for (const [key, child] of Object.entries(value)) {
            if (/(runtimeIpAddress|runtimeHost|runtimeAddress|plcIpAddress)/i.test(key) && typeof child === 'string' && child.trim()) return child.trim();
            const address = findAddress(child);
            if (address) return address;
          }
        }
        return '';
      };
      return findAddress(result.data);
    }
    
    const aiTools = [
      {
        type: 'function',
        function: {
          name: 'getWorkspaceContext',
          description: 'Inspect the currently visible AgenticPLC workspace, current project, available projects, selected editor, and visible ladder/program context. Use this before modifying PLC work.',
          parameters: { type: 'object', properties: {}, required: [] }
        }
      },
      {
        type: 'function',
        function: {
          name: 'listProjects',
          description: 'List projects already available in the Projects list, including their names and paths. Use this when the user asks which project to open or gives an ambiguous project name.',
          parameters: { type: 'object', properties: {}, required: [] }
        }
      },
      {
        type: 'function',
        function: {
          name: 'deleteCurrentRung',
          description: 'Delete the current/only visible ladder rung through the editor UI. This is destructive and always requires user confirmation.',
          parameters: { type: 'object', properties: {}, required: [] }
        }
      },
      {
        type: 'function',
        function: {
          name: 'createNewRung',
          description: 'Create a new ladder rung in the currently visible ladder editor. This changes the workspace and always requires user confirmation.',
          parameters: { type: 'object', properties: {}, required: [] }
        }
      },
      {
        type: 'function',
        function: {
          name: 'drawAndGateLadder',
          description: 'Draw a basic ladder AND circuit in the current ladder editor by placing two series normally-open contacts followed by a coil. Use this for requests such as "draw ladder logic for an AND gate". It always requires confirmation.',
          parameters: {
            type: 'object',
            properties: {
              firstInput: { type: 'string', description: 'First input name, default Switch_1' },
              secondInput: { type: 'string', description: 'Second input name, default Switch_2' },
              output: { type: 'string', description: 'Output coil name, default Motor' }
            },
            required: []
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'runCurrentProject',
          description: 'Start the PLC runtime for the current project using the runtime address configured in that project. Ask for confirmation first. If no address is configured, explain that configuration is required instead of starting with an undefined address.',
          parameters: { type: 'object', properties: {}, required: [] }
        }
      },
      {
        type: 'function',
        function: {
          name: 'openProjectByName',
          description: 'Open a project already shown in the Projects list by its name. Use this for requests such as "open demo_openplc". Do not use openProject for a named project because that opens a file picker.',
          parameters: {
            type: 'object',
            properties: {
              projectName: { type: 'string', description: 'The exact or closest project name from the Projects list' }
            },
            required: ['projectName']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'listAppCommands',
          description: 'Get a list of all available commands and methods you can execute on the editor via window.bridge.',
          parameters: { type: 'object', properties: {}, required: [] }
        }
      },
      {
        type: 'function',
        function: {
          name: 'executeAppCommand',
          description: 'Execute ANY internal AgenticPLC command dynamically (e.g. getSystemInfo, runtimeStartPlc, debuggerConnect).',
          parameters: {
            type: 'object',
            properties: {
              command: { type: 'string', description: 'The exact method name on window.bridge' },
              argsJson: { type: 'string', description: 'A JSON array string of arguments to pass to the command (e.g., "[{\\"filePath\\":\\"C:/proj/main.st\\"}]"). Empty array if no args.' }
            },
            required: ['command', 'argsJson']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'runOsCommand',
          description: 'Run an OS terminal command (e.g. dir, ping, ipconfig). Returns stdout and stderr.',
          parameters: {
            type: 'object',
            properties: {
              command: { type: 'string', description: 'The OS command to run.' },
              cwd: { type: 'string', description: 'Optional current working directory.' }
            },
            required: ['command']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'readFileNode',
          description: 'Read the contents of a file on the file system.',
          parameters: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'Absolute path to the file.' }
            },
            required: ['path']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'writeFileNode',
          description: 'Write string data to a file on the file system. Requires confirmation.',
          parameters: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'Absolute path to the file.' },
              data: { type: 'string', description: 'String data to write.' }
            },
            required: ['path', 'data']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'readDirNode',
          description: 'List the contents of a directory on the file system.',
          parameters: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'Absolute path to the directory.' }
            },
            required: ['path']
          }
        }
      }
    ];
    
    document.getElementById('ai-chat-btn').addEventListener('click', async function() {
      var input = document.getElementById('ai-chat-input');
      var msgs = document.getElementById('ai-chat-messages');
      var prompt = input.value.trim();
      if (prompt !== '') {
        var uMsg = document.createElement('div');
        uMsg.className = 'ai-bubble-user';
        uMsg.textContent = prompt;
        msgs.appendChild(uMsg);
        
        var aiMsg = document.createElement('div');
        aiMsg.className = 'ai-bubble-ai';
        aiMsg.textContent = 'Thinking...';
        msgs.appendChild(aiMsg);
        msgs.scrollTop = msgs.scrollHeight;
         input.value = '';

         const isAffirmation = /^(yes|yeah|yep|ok|okay|confirm|do it|go ahead|proceed)\s*[!.]?$/i.test(prompt);
         const isDecline = /^(no|nope|cancel|don't|do not)\s*[!.]?$/i.test(prompt);
         if (pendingConfirmation && (isAffirmation || isDecline)) {
           const pending = pendingConfirmation;
           pendingConfirmation = null;
           if (isDecline) {
             aiMsg.textContent = 'Okay, I cancelled that change.';
             currentSessionMessages.push({ role: 'user', content: prompt });
             currentSessionMessages.push({ role: 'assistant', content: 'Okay, I cancelled that change.' });
             saveHistory(prompt, formatMarkdown(aiMsg.textContent));
             return;
           }
           try {
             let confirmedResult;
              if (pending.action === 'runCurrentProject') {
                const runtimeAddress = await getCurrentRuntimeAddress();
                confirmedResult = runtimeAddress && window.bridge && typeof window.bridge.runtimeStartPlc === 'function'
                  ? await window.bridge.runtimeStartPlc(runtimeAddress)
                  : { success: false, error: runtimeAddress ? 'The runtime start action is unavailable.' : 'No PLC runtime address is configured for this project. Configure the runtime address first.' };
              } else if (pending.action === 'drawAndGateLadder') {
                let rungBody = document.querySelector('[aria-label="Rung body"]');
                if (!rungBody) {
                  const createButton = document.querySelector('[aria-label="Create new rung button"]');
                  if (createButton) createButton.click();
                  await new Promise(resolve => setTimeout(resolve, 250));
                  rungBody = document.querySelector('[aria-label="Rung body"]');
                }
                const contactSource = document.querySelector('[aria-label="Contact"] [draggable="true"]');
                const coilSource = document.querySelector('[aria-label="Coil"] [draggable="true"]');
                if (!rungBody || !contactSource || !coilSource) {
                  confirmedResult = { success: false, error: 'The ladder toolbox or rung editor is not visible.' };
                } else {
                  const dropElement = (source, type, x, y) => {
                    const data = new DataTransfer();
                    data.setData('application/reactflow/ladder-blocks', type);
                    data.setData('text/plain', type);
                    data.effectAllowed = 'move';
                    const dropTarget = rungBody.querySelector('.react-flow__pane') || rungBody;
                    source.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: data }));
                    dropTarget.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, clientX: x, clientY: y, dataTransfer: data }));
                    dropTarget.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, clientX: x, clientY: y, dataTransfer: data }));
                    source.dispatchEvent(new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer: data }));
                  };
                  const bounds = rungBody.getBoundingClientRect();
                  const y = bounds.top + 60;
                  dropElement(contactSource, 'contact', bounds.left + 180, y);
                  dropElement(contactSource, 'contact', bounds.left + 360, y);
                  dropElement(coilSource, 'coil', bounds.left + 560, y);
                  confirmedResult = { success: true };
                }
              } else if (pending.action === 'deleteCurrentRung' || pending.action === 'createNewRung') {
               const selector = pending.action === 'deleteCurrentRung'
                 ? '[aria-label="Rung header"] button[aria-label="Delete body button"]'
                 : '[aria-label="Create new rung button"]';
               const editorButton = document.querySelector(selector);
               if (!editorButton) {
                 confirmedResult = { success: false, error: 'The requested ladder control is not visible in the current workspace.' };
               } else {
                 editorButton.click();
                 if (pending.action === 'deleteCurrentRung') {
                   await new Promise(resolve => setTimeout(resolve, 100));
                   const dialog = [...document.querySelectorAll('[role="dialog"]')].find(el => (el.textContent || '').includes('Are you sure you want to delete this item'));
                   const confirmButton = [...(dialog || document).querySelectorAll('button')].find(el => (el.textContent || '').trim().toLowerCase() === 'delete');
                   if (!confirmButton) {
                     confirmedResult = { success: false, error: 'The ladder delete confirmation dialog did not appear.' };
                   } else {
                     confirmButton.click();
                     confirmedResult = { success: true };
                   }
                 } else {
                   confirmedResult = { success: true };
                 }
               }
             } else {
               confirmedResult = window.bridge && typeof window.bridge[pending.command] === 'function'
                 ? await window.bridge[pending.command](...(pending.args || []))
                 : { success: false, error: 'The requested editor command is not available.' };
             }
             const confirmationAnswer = confirmedResult && confirmedResult.success === false
               ? 'I could not complete that change: ' + (confirmedResult.error?.description || confirmedResult.error || 'the editor rejected it.')
               : 'Done — I applied the approved change.';
             aiMsg.textContent = confirmationAnswer;
             currentSessionMessages.push({ role: 'user', content: prompt });
             currentSessionMessages.push({ role: 'assistant', content: confirmationAnswer });
             saveHistory(prompt, formatMarkdown(confirmationAnswer));
           } catch (confirmationError) {
             aiMsg.textContent = 'I could not complete the approved change: ' + confirmationError.message;
           }
           msgs.scrollTop = msgs.scrollHeight;
           return;
         }
         
         // Greetings are conversational and should never trigger workspace tools.
         const isCasualGreeting = /^(hi|hello|hey)([!,.\s].*)?$/i.test(prompt);
         if (isCasualGreeting) {
           const greetingAnswer = 'Hi! How can I help you with your PLC project today?';
           currentSessionMessages.push({ role: 'user', content: prompt });
           currentSessionMessages.push({ role: 'assistant', content: greetingAnswer });
           aiMsg.textContent = greetingAnswer;
           saveHistory(prompt, formatMarkdown(greetingAnswer));
           msgs.scrollTop = msgs.scrollHeight;
           return;
         }

         let sysPrompt = 'You are AgenticPLC Copilot, a friendly conversational assistant and a careful agent for PLC projects. Answer normal questions naturally without tools. For workspace requests, first inspect the workspace when context matters, then use only supported tools. Never invent command names: if an editor action is unavailable, say so clearly and offer the nearest supported path. For a request to open a project by name, use openProjectByName; never use openProject, because openProject opens a file picker. If several projects match or the name is unclear, list the matches and ask the user which one to open. For a request to draw an AND gate in ladder logic, use drawAndGateLadder; do not answer that the action is unsupported. For a request to run the current project, use runCurrentProject so that the configured PLC runtime address is used; never call runtimeStartPlc without an address. Before creating a project, creating a file, changing ladder logic, changing program code, changing hardware configuration, deleting anything, saving changes, or running/building code, explain the intended change and ask for confirmation. If the user replies yes/confirm/okay to your immediately preceding confirmation, perform the pending change. Always read the current workspace before generating or editing PLC logic. Prefer the existing graphical editor and its supported data model over manual drag-and-drop instructions. Do not expose tool calls, tool names, raw tool results, or internal implementation details. If the user asks for a Ladder Logic Diagram, represent the intended logic clearly and apply it only after the user confirms; use ASCII only as a fallback when the editor cannot perform the requested operation. Example: `|---[ Switch 1 ]---[ Switch 2 ]---( Motor )---|`.';
        
        currentSessionMessages.push({ role: 'user', content: prompt });
        
        let chatMessages = [
          { role: 'system', content: sysPrompt },
          ...currentSessionMessages
        ];
        
        async function processAgentLoop() {
          const headers = { 'Content-Type': 'application/json' };
          if (apiSettings.key) {
            headers['Authorization'] = 'Bearer ' + apiSettings.key;
          }
          
          let bodyPayload = {
            model: apiSettings.model,
            messages: chatMessages
          };
          
          // Only pass tools if not using local ollama basic endpoint which might break
          if (apiSettings.preset !== 'custom' || apiSettings.url.includes('api')) {
             bodyPayload.tools = aiTools;
          }
          
          const response = await fetch(apiSettings.url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(bodyPayload)
          });
          
          const data = await response.json();
          if (!response.ok || data.error || data.detail) {
            let errMsg = 'Unknown API Error';
            if (data.error && data.error.message) errMsg = data.error.message;
            else if (data.error) errMsg = JSON.stringify(data.error);
            else if (data.detail) errMsg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
            throw new Error(errMsg);
          }
          
          if (!data.choices || !data.choices[0]) throw new Error('No response from API');
          
          const msg = data.choices[0].message;
          
          if (msg.tool_calls && msg.tool_calls.length > 0) {
            chatMessages.push(msg);
            aiMsg.textContent = 'Agent is accessing workspace tools...';
            for (let tc of msg.tool_calls) {
              let resultObj = {};
              try {
                const args = tc.function.arguments ? (typeof tc.function.arguments === 'string' ? JSON.parse(tc.function.arguments) : tc.function.arguments) : {};
                 if (tc.function.name === 'getWorkspaceContext') {
                   const recentProjects = window.bridge && typeof window.bridge.retrieveRecent === 'function'
                     ? await window.bridge.retrieveRecent()
                     : [];
                   const visibleText = (document.body.innerText || '').replace(/\s+/g, ' ').trim();
                   const currentProject = Array.isArray(recentProjects)
                     ? recentProjects.find(p => p && p.name && visibleText.toLowerCase().includes(String(p.name).toLowerCase()))
                     : null;
                   let projectData = null;
                   if (currentProject && currentProject.path && window.bridge && typeof window.bridge.readProjectFiles === 'function') {
                     try {
                       const readResult = await window.bridge.readProjectFiles(currentProject.path);
                       if (readResult && readResult.success) projectData = readResult.data;
                     } catch (contextError) {
                       projectData = { error: contextError.message };
                     }
                   }
                   resultObj = {
                     currentProject: currentProject ? { name: currentProject.name, path: currentProject.path } : null,
                     availableProjects: Array.isArray(recentProjects) ? recentProjects.map(p => ({ name: p.name, path: p.path })) : [],
                     visibleWorkspace: visibleText.slice(0, 9000),
                     projectData: projectData
                   };
                 } else if (tc.function.name === 'listProjects') {
                   const projects = window.bridge && typeof window.bridge.retrieveRecent === 'function'
                     ? await window.bridge.retrieveRecent()
                     : [];
                   resultObj = Array.isArray(projects) ? projects.map(p => ({ name: p.name, path: p.path, lastOpenedAt: p.lastOpenedAt })) : [];
                  } else if (tc.function.name === 'drawAndGateLadder') {
                    pendingConfirmation = {
                      action: tc.function.name,
                      firstInput: args.firstInput,
                      secondInput: args.secondInput,
                      output: args.output
                    };
                    resultObj = {
                      requiresConfirmation: true,
                      message: 'Ask the user to confirm drawing two series normally-open contacts followed by one output coil in the current ladder editor.'
                    };
                  } else if (tc.function.name === 'runCurrentProject') {
                    const runtimeAddress = await getCurrentRuntimeAddress();
                    resultObj = runtimeAddress
                      ? (pendingConfirmation = { action: tc.function.name }, { requiresConfirmation: true, message: 'Ask the user to confirm starting the PLC runtime at ' + runtimeAddress + '.' })
                      : { success: false, error: 'No PLC runtime address is configured for the current project. Ask the user to configure it before running.' };
                  } else if (tc.function.name === 'deleteCurrentRung' || tc.function.name === 'createNewRung') {
                   const isDelete = tc.function.name === 'deleteCurrentRung';
                   const selector = isDelete
                     ? '[aria-label="Rung header"] button[aria-label="Delete body button"]'
                     : '[aria-label="Create new rung button"]';
                   const editorButton = document.querySelector(selector);
                   if (!editorButton) {
                     resultObj = { success: false, error: 'The requested ladder control is not visible in the current workspace.' };
                   } else {
                     pendingConfirmation = { action: tc.function.name };
                     resultObj = {
                       requiresConfirmation: true,
                       message: isDelete
                         ? 'Ask the user to confirm deleting the visible ladder rung.'
                         : 'Ask the user to confirm creating a new ladder rung.'
                     };
                   }
                 } else if (tc.function.name === 'openProjectByName') {
                    const requestedName = String(args.projectName || '').trim().toLowerCase();
                    const findProjectText = () => [...document.querySelectorAll('span,button,[role="button"]')].find(el => {
                      const text = (el.textContent || '').trim().toLowerCase();
                      return text === requestedName || text.replace(/\s+/g, '_') === requestedName;
                    });
                    let projectText = findProjectText();
                    if (!projectText) {
                      const recentButton = [...document.querySelectorAll('button,[role="button"]')].find(el => (el.textContent || '').trim().toLowerCase() === 'recent');
                      if (recentButton) {
                        recentButton.click();
                        await new Promise(resolve => setTimeout(resolve, 150));
                        projectText = findProjectText();
                      }
                    }
                    if (projectText) {
                     const target = projectText.closest('button,[role="button"]') || projectText.parentElement;
                     if (target) {
                       target.click();
                       resultObj = { success: true, projectName: projectText.textContent.trim() };
                     } else {
                       resultObj = { success: false, error: 'Project card could not be opened' };
                     }
                   } else {
                     resultObj = { success: false, error: 'No project named "' + (args.projectName || '') + '" was found in the Projects list' };
                   }
                 } else if (tc.function.name === 'listAppCommands') {
                  if(window.bridge) {
                    resultObj = Object.keys(window.bridge).filter(k => typeof window.bridge[k] === 'function');
                  } else {
                    resultObj = { success: false, error: 'Bridge unavailable' };
                  }
                 } else if (['runOsCommand', 'readFileNode', 'writeFileNode', 'readDirNode'].includes(tc.function.name)) {
                   if (window.bridge && typeof window.bridge[tc.function.name] === 'function') {
                     if (tc.function.name === 'writeFileNode' && args.confirmed !== true) {
                       pendingConfirmation = { command: tc.function.name, args: [args.path, args.data] };
                       resultObj = {
                         requiresConfirmation: true,
                         message: `Ask the user to confirm writing data to the file: ${args.path}`
                       };
                     } else if (tc.function.name === 'runOsCommand' && args.confirmed !== true) {
                       pendingConfirmation = { command: tc.function.name, args: [args.command, args.cwd] };
                       resultObj = {
                         requiresConfirmation: true,
                         message: `Ask the user to confirm executing the terminal command: ${args.command}`
                       };
                     } else {
                       try {
                         let res;
                         if (tc.function.name === 'runOsCommand') {
                           res = await window.bridge.runOsCommand(args.command, args.cwd);
                         } else if (tc.function.name === 'readFileNode') {
                           res = await window.bridge.readFileNode(args.path);
                         } else if (tc.function.name === 'writeFileNode') {
                           res = await window.bridge.writeFileNode(args.path, args.data);
                           res = { success: true };
                         } else if (tc.function.name === 'readDirNode') {
                           res = await window.bridge.readDirNode(args.path);
                         }
                         resultObj = { success: true, result: res };
                       } catch (e) {
                         resultObj = { success: false, error: e.message };
                       }
                     }
                   } else {
                     resultObj = { success: false, error: 'OS tools unavailable. Did you restart the app after the update?' };
                   }
                 } else if (tc.function.name === 'executeAppCommand') {
                   if(window.bridge && typeof window.bridge[args.command] === 'function') {
                     let callArgs = [];
                     if (args.argsJson) {
                       try { callArgs = JSON.parse(args.argsJson); } catch(e) { callArgs = [args.argsJson]; }
                     }
                     const requiresApproval = [
                       'createProject', 'writeProjectFiles', 'createPouFile', 'deletePouFile',
                       'deleteProject', 'saveFile', 'renamePouFile', 'setStoreValue',
                       'runtimeStartPlc', 'runtimeStopPlc', 'debuggerConnect', 'debuggerDisconnect'
                     ].includes(args.command);
                     if (requiresApproval && args.confirmed !== true) {
                       pendingConfirmation = { command: args.command, args: callArgs };
                       resultObj = {
                         requiresConfirmation: true,
                         message: 'This action changes the project, files, hardware connection, or runtime. Ask the user for confirmation before executing it.',
                         command: args.command
                       };
                     } else {
                       const tempRes = window.bridge[args.command](...callArgs);
                       resultObj = (tempRes instanceof Promise) ? await tempRes : tempRes;
                     }
                   } else {
                     resultObj = { success: false, error: 'That editor action is not available. Do not retry with a guessed command name.' };
                   }
                } else {
                  resultObj = { success: false, error: 'Unknown tool' };
                }
              } catch(e) {
                resultObj = { success: false, error: e.message };
              }
              chatMessages.push({ role: 'tool', tool_call_id: tc.id, name: tc.function.name, content: JSON.stringify(resultObj) });
            }
            return await processAgentLoop();
          } else {
            return msg.content || "";
          }
        }
        
        try {
          const finalAnswer = await processAgentLoop();
          currentSessionMessages.push({ role: 'assistant', content: finalAnswer });
          const fmt = formatMarkdown(finalAnswer);
          aiMsg.innerHTML = fmt;
          saveHistory(prompt, fmt);
        } catch(err) {
          aiMsg.innerHTML = '<span style="color: var(--ai-danger); font-weight: bold;">API Error:</span> ' + err.message + '<br><br><strong>Tip:</strong> If you are hitting rate limits, click the ⚙ <strong>SETTINGS</strong> tab above and switch to the Google Gemini API (it is 100% free with massive limits) or Groq!';
        }
        msgs.scrollTop = msgs.scrollHeight;
      }
    });
    
    document.getElementById('ai-chat-input').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') document.getElementById('ai-chat-btn').click();
    });
    
    // Sidebar resizing and toggle
    var resizer = document.getElementById('ai-resizer');
    var openBtn = document.getElementById('ai-open-btn');
    var sidebar = document.getElementById('ai-sidebar');
    var closeBtn = document.getElementById('ai-close-btn');
    openBtn.style.display = 'none';
    
    closeBtn.addEventListener('click', function() {
      sidebar.style.display = 'none';
      resizer.style.display = 'none';
      openBtn.style.display = 'flex';
    });
    openBtn.addEventListener('click', function() {
      sidebar.style.display = 'flex';
      resizer.style.display = 'block';
      openBtn.style.display = 'none';
    });
    
    var isResizing = false;
    resizer.addEventListener('mousedown', function(e) {
      isResizing = true;
      document.body.style.cursor = 'col-resize';
      resizer.style.background = 'var(--ai-primary)';
      e.preventDefault();
    });
    resizer.addEventListener('mouseenter', function() { if(!isResizing) resizer.style.background = 'var(--ai-primary)'; });
    resizer.addEventListener('mouseleave', function() { if(!isResizing) resizer.style.background = '#252526'; });
    window.addEventListener('mousemove', function(e) {
      if (!isResizing) return;
      var newWidth = document.body.clientWidth - e.clientX;
      if (newWidth > 200 && newWidth < 800) sidebar.style.width = newWidth + 'px';
    });
    window.addEventListener('mouseup', function() {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = 'default';
        resizer.style.background = '#252526';
      }
    });
  