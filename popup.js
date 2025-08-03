class ChatGPTAutoSender {
  constructor() {
    this.isSending = false;
    this.currentProgress = 0;
    this.totalPrompts = 0;
    this.settings = {
      delay: 2,
      mode: 'sequential',
      autoScroll: false
    };
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadSettings();
    this.loadTemplates();
    this.loadSavedPrompts();
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    // Main buttons
    document.getElementById('start-btn').addEventListener('click', () => this.startSending());
    document.getElementById('stop-btn').addEventListener('click', () => this.stopSending());

    // Template buttons
    document.getElementById('save-template-btn').addEventListener('click', () => this.saveTemplate());

    // Settings
    document.getElementById('delay-input').addEventListener('change', (e) => {
      this.settings.delay = parseInt(e.target.value);
      this.saveSettings();
    });

    document.getElementById('mode-select').addEventListener('change', (e) => {
      this.settings.mode = e.target.value;
      this.saveSettings();
    });

    document.getElementById('auto-scroll').addEventListener('change', (e) => {
      this.settings.autoScroll = e.target.checked;
      this.saveSettings();
    });

    // Import/Export
    document.getElementById('export-btn').addEventListener('click', () => this.exportPrompts());
    document.getElementById('import-btn').addEventListener('click', () => this.importPrompts());

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request) => {
      if (request.action === "notify" && request.message) {
        this.showNotification(request.message);
      } else if (request.action === "progress") {
        this.updateProgress(request.current, request.total);
      } else if (request.action === "status") {
        this.updateStatus(request.status, request.message);
      }
    });
  }

  switchTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
  }

  startSending() {
    const prompts = this.getPrompts();
    if (prompts.length === 0) {
      this.showNotification('Por favor, digite pelo menos um prompt válido.');
      return;
    }

    this.isSending = true;
    this.totalPrompts = prompts.length;
    this.currentProgress = 0;
    
    this.updateUI();
    this.showProgress();

    chrome.runtime.sendMessage({ 
      action: "start", 
      prompts,
      settings: this.settings
    });
  }

  stopSending() {
    this.isSending = false;
    chrome.runtime.sendMessage({ action: "stop" });
    this.updateStatus('idle', 'Envio interrompido.');
    this.hideProgress();
    this.updateUI();
  }

  getPrompts() {
    const rawPrompts = document.getElementById('prompts-textarea').value;
    return rawPrompts.split('\n')
      .map(p => p.trim())
      .filter(p => p !== "");
  }

  savePrompts() {
    const prompts = document.getElementById('prompts-textarea').value;
    chrome.storage.local.set({ prompts });
  }

  loadSavedPrompts() {
    chrome.storage.local.get("prompts", (data) => {
      if (data.prompts) {
        document.getElementById("prompts-textarea").value = data.prompts;
      }
    });
  }

  saveTemplate() {
    const name = document.getElementById('template-name').value.trim();
    const content = document.getElementById('template-content').value.trim();

    if (!name || !content) {
      this.showNotification('Por favor, preencha o nome e conteúdo do template.');
      return;
    }

    chrome.storage.local.get('templates', (data) => {
      const templates = data.templates || {};
      templates[name] = content;
      
      chrome.storage.local.set({ templates }, () => {
        this.showNotification('Template salvo com sucesso!');
        this.loadTemplates();
        document.getElementById('template-name').value = '';
        document.getElementById('template-content').value = '';
      });
    });
  }

  loadTemplates() {
    chrome.storage.local.get('templates', (data) => {
      const templates = data.templates || {};
      const templatesList = document.getElementById('templates-list');
      templatesList.innerHTML = '';

      Object.keys(templates).forEach(name => {
        const templateItem = document.createElement('div');
        templateItem.className = 'template-item';
        templateItem.innerHTML = `
          <span class="template-name">${name}</span>
          <div class="template-actions">
            <button class="btn btn-small btn-primary" onclick="app.loadTemplate('${name}')">Usar</button>
            <button class="btn btn-small btn-danger" onclick="app.deleteTemplate('${name}')">Excluir</button>
          </div>
        `;
        templatesList.appendChild(templateItem);
      });
    });
  }

  loadTemplate(name) {
    chrome.storage.local.get('templates', (data) => {
      const templates = data.templates || {};
      if (templates[name]) {
        document.getElementById('prompts-textarea').value = templates[name];
        this.switchTab('prompts');
        this.showNotification(`Template "${name}" carregado!`);
      }
    });
  }

  deleteTemplate(name) {
    if (confirm(`Tem certeza que deseja excluir o template "${name}"?`)) {
      chrome.storage.local.get('templates', (data) => {
        const templates = data.templates || {};
        delete templates[name];
        
        chrome.storage.local.set({ templates }, () => {
          this.showNotification('Template excluído com sucesso!');
          this.loadTemplates();
        });
      });
    }
  }

  saveSettings() {
    chrome.storage.local.set({ settings: this.settings });
  }

  loadSettings() {
    chrome.storage.local.get('settings', (data) => {
      if (data.settings) {
        this.settings = { ...this.settings, ...data.settings };
        document.getElementById('delay-input').value = this.settings.delay;
        document.getElementById('mode-select').value = this.settings.mode;
        document.getElementById('auto-scroll').checked = this.settings.autoScroll;
      }
    });
  }

  exportPrompts() {
    const prompts = this.getPrompts();
    if (prompts.length === 0) {
      this.showNotification('Não há prompts para exportar.');
      return;
    }

    const data = {
      prompts: prompts,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `chatgpt-prompts-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    this.showNotification('Prompts exportados com sucesso!');
  }

  importPrompts() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.prompts && Array.isArray(data.prompts)) {
            document.getElementById('prompts-textarea').value = data.prompts.join('\n');
            this.showNotification(`${data.prompts.length} prompts importados com sucesso!`);
          } else {
            this.showNotification('Arquivo inválido. Use um arquivo JSON exportado pela extensão.');
          }
        } catch (error) {
          this.showNotification('Erro ao ler o arquivo. Verifique se é um JSON válido.');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  }

  updateProgress(current, total) {
    this.currentProgress = current;
    this.totalPrompts = total;
    
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    const percentage = total > 0 ? (current / total) * 100 : 0;
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${current} de ${total} enviados`;
  }

  showProgress() {
    document.getElementById('progress-container').classList.remove('hidden');
  }

  hideProgress() {
    document.getElementById('progress-container').classList.add('hidden');
  }

  updateStatus(status, message) {
    const statusEl = document.getElementById('status');
    statusEl.className = `status ${status}`;
    statusEl.textContent = message;
  }

  updateUI() {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    
    if (this.isSending) {
      startBtn.style.display = 'none';
      stopBtn.style.display = 'block';
      startBtn.disabled = true;
    } else {
      startBtn.style.display = 'block';
      stopBtn.style.display = 'none';
      startBtn.disabled = false;
    }
  }

  showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      z-index: 1000;
      font-size: 12px;
      max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new ChatGPTAutoSender();
});
