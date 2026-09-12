const fs = require('fs');
const filePath = 'c:\\Users\\ELCOT\\AppData\\Local\\Programs\\open-plc-editor\\resources\\app\\dist\\renderer\\index.html';

const htmlContent = `<!doctype html>
<html class="h-full" lang="en" data-ai-theme="material3">
<head>
  <title>AgenticPLC (src2)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline'">
  <script defer="defer" src="./renderer.js"></script>
  <link href="./style.css" rel="stylesheet">
  <style id="global-theme-styles">
    /* Global Application Theme Overrides */
    
    /* MATERIAL 3 */
    html[data-ai-theme="material3"] body, 
    html[data-ai-theme="material3"] #root,
    html[data-ai-theme="material3"] .bg-neutral-50,
    html[data-ai-theme="material3"] .bg-neutral-100 {
        background-color: #F3EDF7 !important;
    }
    html[data-ai-theme="material3"] .bg-white {
        background-color: #FEF7FF !important;
    }
    html[data-ai-theme="material3"] .text-gray-500,
    html[data-ai-theme="material3"] .text-neutral-500 {
        color: #49454F !important;
    }
    html[data-ai-theme="material3"] .text-neutral-1000 {
        color: #1D1B20 !important;
    }
    html[data-ai-theme="material3"] * {
        font-family: 'Poppins', sans-serif !important;
    }

    /* MIXED MODE (Dark Neon) */
    html[data-ai-theme="mixed"] body,
    html[data-ai-theme="mixed"] #root,
    html[data-ai-theme="mixed"] .dark\\:bg-neutral-950,
    html[data-ai-theme="mixed"] .dark\\:bg-neutral-900,
    html[data-ai-theme="mixed"] .dark\\:bg-neutral-850 {
        background-color: #0f172a !important;
    }
    html[data-ai-theme="mixed"] .dark\\:border-neutral-800 {
        border-color: #334155 !important;
    }
    html[data-ai-theme="mixed"] .dark\\:text-neutral-400 {
        color: #cbd5e1 !important;
    }
    html[data-ai-theme="mixed"] .dark\\:text-white {
        color: #38bdf8 !important;
    }

    /* AI Sidebar Themes */
    :root {
      --ai-bg: #1e1e1e;
      --ai-text: #ccc;
      --ai-border: #333;
      --ai-primary: #007acc;
      --ai-primary-text: #fff;
      --ai-msg-bg-user: #007acc;
      --ai-msg-text-user: #fff;
      --ai-msg-bg-ai: #2a2d2e;
      --ai-msg-text-ai: #ccc;
      --ai-input-bg: #3c3c3c;
      --ai-input-text: #fff;
      --ai-input-border: #555;
      --ai-tab-active: #fff;
      --ai-tab-inactive: #888;
      --ai-danger: #a00;
      --ai-radius: 4px;
      --ai-font: 'Inter', sans-serif;
    }

    [data-ai-theme="light"] {
      --ai-bg: #f5f5f5;
      --ai-text: #333;
      --ai-border: #e0e0e0;
      --ai-primary: #0078d4;
      --ai-primary-text: #fff;
      --ai-msg-bg-user: #0078d4;
      --ai-msg-text-user: #fff;
      --ai-msg-bg-ai: #ffffff;
      --ai-msg-text-ai: #333;
      --ai-input-bg: #ffffff;
      --ai-input-text: #333;
      --ai-input-border: #ccc;
      --ai-tab-active: #000;
      --ai-tab-inactive: #888;
      --ai-danger: #d13438;
      --ai-radius: 6px;
    }

    [data-ai-theme="material3"] {
      --ai-bg: #F3EDF7;
      --ai-text: #1D1B20;
      --ai-border: #CAC4D0;
      --ai-primary: #6750A4;
      --ai-primary-text: #FFFFFF;
      --ai-msg-bg-user: #6750A4;
      --ai-msg-text-user: #FFFFFF;
      --ai-msg-bg-ai: #EADDFF;
      --ai-msg-text-ai: #21005D;
      --ai-input-bg: #FFFFFF;
      --ai-input-text: #1D1B20;
      --ai-input-border: #79747E;
      --ai-tab-active: #6750A4;
      --ai-tab-inactive: #49454F;
      --ai-danger: #B3261E;
      --ai-radius: 16px;
      --ai-font: 'Poppins', sans-serif;
    }

    [data-ai-theme="mixed"] {
      --ai-bg: #0f172a;
      --ai-text: #cbd5e1;
      --ai-border: #334155;
      --ai-primary: #38bdf8;
      --ai-primary-text: #0f172a;
      --ai-msg-bg-user: #38bdf8;
      --ai-msg-text-user: #0f172a;
      --ai-msg-bg-ai: #1e293b;
      --ai-msg-text-ai: #f8fafc;
      --ai-input-bg: #1e293b;
      --ai-input-text: #f8fafc;
      --ai-input-border: #475569;
      --ai-tab-active: #38bdf8;
      --ai-tab-inactive: #64748b;
      --ai-danger: #ef4444;
      --ai-radius: 12px;
    }

    #ai-sidebar {
      background: var(--ai-bg);
      color: var(--ai-text);
      font-family: var(--ai-font);
      border-left: 1px solid var(--ai-border);
      transition: all 0.3s ease;
      user-select: text !important;
      -webkit-user-select: text !important;
    }

    .ai-header-btn {
      background: transparent;
      color: var(--ai-primary);
      border: 1px solid var(--ai-primary);
      border-radius: var(--ai-radius);
      padding: 4px 10px;
      cursor: pointer;
      font-size: 11px;
      transition: all 0.2s ease;
    }
    .ai-header-btn:hover {
      background: var(--ai-primary);
      color: var(--ai-primary-text);
    }

    .ai-bubble-user {
      background: var(--ai-msg-bg-user);
      color: var(--ai-msg-text-user);
      border-radius: var(--ai-radius);
      border-bottom-right-radius: 2px;
      padding: 10px 14px;
      align-self: flex-end;
      max-width: 90%;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }
    
    .ai-bubble-ai {
      background: var(--ai-msg-bg-ai);
      color: var(--ai-msg-text-ai);
      border-radius: var(--ai-radius);
      border-bottom-left-radius: 2px;
      padding: 10px 14px;
      align-self: flex-start;
      max-width: 90%;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }
    .ai-bubble-ai code {
       background: rgba(127,127,127,0.2) !important;
       color: inherit;
    }

    .ai-input {
      background: var(--ai-input-bg);
      color: var(--ai-input-text);
      border: 1px solid var(--ai-input-border);
      border-radius: var(--ai-radius);
      transition: all 0.3s ease;
    }
    .ai-input:focus {
      border-color: var(--ai-primary);
      box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
    }

    .ai-send-btn {
      background: var(--ai-primary);
      color: var(--ai-primary-text);
      border-radius: var(--ai-radius);
      border: none;
      transition: all 0.3s ease;
    }
    .ai-send-btn:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    
    .ai-select {
      background: var(--ai-bg);
      color: var(--ai-text);
      border: 1px solid var(--ai-border);
      border-radius: var(--ai-radius);
      font-size: 11px;
      padding: 2px 5px;
      outline: none;
    }
  </style>
</head>
<body class="h-full" style="display: flex; flex-direction: row; margin: 0; overflow: hidden;">
  <div class="h-full bg-neutral-50 text-gray-500 dark:bg-neutral-950 dark:text-gray-400" id="root" style="flex: 1; min-width: 0; overflow: hidden; position: relative;"></div>
  
  <div id="ai-resizer" style="width: 5px; background: #252526; cursor: col-resize; z-index: 10000; flex-shrink: 0; transition: background 0.2s;"></div>
  
  <div id="ai-sidebar" style="width: 350px; min-width: 200px; max-width: 800px; display: flex; flex-direction: column; height: 100vh; overflow: hidden; position: relative; z-index: 9999; flex-shrink: 0;">
    
    <div style="padding: 15px; border-bottom: 1px solid var(--ai-border); display: flex; flex-direction: column; gap: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <span id="tab-chat" style="font-weight: 600; font-size: 13px; cursor: pointer; color: var(--ai-tab-active); transition: color 0.2s;">CHAT</span>
          <span id="tab-history" style="font-weight: 600; font-size: 13px; cursor: pointer; color: var(--ai-tab-inactive); transition: color 0.2s;">HISTORY</span>
          <span id="tab-settings" style="font-weight: 600; font-size: 13px; cursor: pointer; color: var(--ai-tab-inactive); transition: color 0.2s;">⚙ SETTINGS</span>
        </div>
        <button id="ai-close-btn" style="background: transparent; color: var(--ai-text); border: none; cursor: pointer; font-size: 20px; line-height: 1; opacity: 0.7;">&times;</button>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <select id="ai-theme-select" class="ai-select">
          <option value="material3">Material 3</option>
          <option value="dark">Dark Mode</option>
          <option value="light">Light Mode</option>
          <option value="mixed">Mixed Mode</option>
        </select>
        <button id="ai-new-chat-btn" class="ai-header-btn">+ New Chat</button>
      </div>
    </div>
    
    <div id="view-chat" style="display: flex; flex-direction: column; flex: 1; overflow: hidden;">
      <div id="ai-chat-messages" style="flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; font-size: 13px; scroll-behavior: smooth;">
        <div class="ai-bubble-ai">Hello! I am AgenticPLC's Autonomous Copilot. I can read your workspace, execute commands, and help you program! Check out the Settings tab to configure my API. How can I help you today?</div>
      </div>
      <div style="padding: 15px; border-top: 1px solid var(--ai-border); display: flex; gap: 10px; background: var(--ai-bg); z-index: 10;">
        <input type="text" id="ai-chat-input" class="ai-input" placeholder="Ask a question or give a command..." style="flex: 1; padding: 10px 14px; font-size: 13px; outline: none;">
        <button id="ai-chat-btn" class="ai-send-btn" style="padding: 10px 18px; cursor: pointer; font-size: 13px; font-weight: 500;">Send</button>
      </div>
    </div>
    
    <div id="view-history" style="display: none; flex-direction: column; flex: 1; overflow: hidden;">
      <div style="padding: 10px 15px; border-bottom: 1px solid var(--ai-border); display: flex; justify-content: flex-end;">
        <button id="ai-clear-history-btn" style="background: var(--ai-danger); color: white; border: none; padding: 6px 12px; border-radius: var(--ai-radius); cursor: pointer; font-size: 12px; transition: opacity 0.2s;">Delete All History</button>
      </div>
      <div id="ai-history-list" style="flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 15px; font-size: 13px;"></div>
    </div>

    <div id="view-settings" style="display: none; flex-direction: column; flex: 1; overflow-y: auto; padding: 15px; font-size: 13px; gap: 15px;">
      <div style="color: var(--ai-text); font-weight: 600; margin-bottom: -5px;">API Configuration</div>
      <p style="opacity: 0.8; font-size: 11px;">Switch to Gemini API for a generous free tier (15 requests/min) or Groq for ultra-fast reasoning.</p>
      
      <label style="display: flex; flex-direction: column; gap: 5px;">
        Provider Preset:
        <select id="setting-preset" class="ai-input" style="padding: 8px;">
          <option value="gemini">Google Gemini (Free 15 RPM)</option>
          <option value="groq">Groq API (Ultra-Fast)</option>
          <option value="nvidia">NVIDIA (Default, Rate Limited)</option>
          <option value="custom">Local Ollama / Custom API</option>
        </select>
      </label>
      
      <label style="display: flex; flex-direction: column; gap: 5px;">
        API URL:
        <input type="text" id="setting-url" class="ai-input" style="padding: 8px;">
      </label>
      
      <label style="display: flex; flex-direction: column; gap: 5px;">
        API Key:
        <input type="password" id="setting-key" class="ai-input" style="padding: 8px;" placeholder="Leave blank for local servers">
      </label>
      
      <label style="display: flex; flex-direction: column; gap: 5px;">
        Model Name:
        <input type="text" id="setting-model" class="ai-input" style="padding: 8px;">
      </label>
      
      <button id="ai-save-settings" class="ai-send-btn" style="padding: 10px; margin-top: 10px; font-weight: 600; cursor: pointer;">Save Settings</button>
      <div id="settings-save-msg" style="color: #10b981; font-size: 12px; display: none;">Saved successfully!</div>
    </div>
  </div>
  
  <button id="ai-open-btn" style="display: none; position: fixed; bottom: 20px; right: 20px; background: var(--ai-primary); color: var(--ai-primary-text); border: none; border-radius: 50%; width: 56px; height: 56px; cursor: pointer; z-index: 10001; font-size: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); justify-content: center; align-items: center; transition: transform 0.2s;" title="Open AI Copilot">🤖</button>

  <script>
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
      html = html.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
      html = html.replace(/\\*(.*?)\\*/g, '<em>$1</em>');
      html = html.replace(/^\\* (.*$)/gim, '<div style="margin-left: 10px;">&bull; $1</div>');
      html = html.replace(/^- (.*$)/gim, '<div style="margin-left: 10px;">&bull; $1</div>');
      html = html.replace(/\`(.*?)\`/g, '<code style="padding:2px 4px;border-radius:3px;font-family:monospace;font-size:0.9em;background:rgba(127,127,127,0.2);">$1</code>');
      html = html.replace(/\\n/g, '<br>');
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
      document.getElementById('ai-chat-messages').innerHTML = '<div class="ai-bubble-ai">Hello! I am AgenticPLC\\'s Autonomous Copilot. I can read your workspace, execute commands, and help you program! How can I help you today?</div>';
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
  </script>
</body>
</html>`;

fs.writeFileSync(filePath, htmlContent, 'utf-8');
console.log('Successfully updated HTML file with API configuration settings');
