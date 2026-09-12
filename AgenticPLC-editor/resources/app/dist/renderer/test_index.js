
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
    
    const aiTools = [
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
        
        let sysPrompt = 'You are an expert Autonomous Agentic AI embedded inside AgenticPLC. You have access to tools that can list available workspace commands and execute them. ALWAYS prioritize using tools to accomplish tasks for the user. If the user asks for a Ladder Logic Diagram, you MUST draw it visually using ASCII art inside a code block in a single horizontal line format (Left Power Rail to Right Power Rail). Example: `|---[ Switch 1 ]---[ Switch 2 ]---( Motor )---|`.';
        
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
                if (tc.function.name === 'listAppCommands') {
                  if(window.bridge) {
                    resultObj = Object.keys(window.bridge).filter(k => typeof window.bridge[k] === 'function');
                  } else {
                    resultObj = { success: false, error: 'Bridge unavailable' };
                  }
                } else if (tc.function.name === 'executeAppCommand') {
                  if(window.bridge && typeof window.bridge[args.command] === 'function') {
                    let callArgs = [];
                    if (args.argsJson) {
                      try { callArgs = JSON.parse(args.argsJson); } catch(e) { callArgs = [args.argsJson]; }
                    }
                    const tempRes = window.bridge[args.command](...callArgs);
                    resultObj = (tempRes instanceof Promise) ? await tempRes : tempRes;
                  } else {
                    resultObj = { success: false, error: 'Command not found: ' + args.command };
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
  