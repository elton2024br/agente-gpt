// Configurações da extensão ChatGPT Auto Sender Pro
const CONFIG = {
  // Configurações padrão
  DEFAULT_SETTINGS: {
    delay: 2,
    mode: 'sequential',
    autoScroll: false,
    maxRetries: 3,
    retryDelay: 5000
  },

  // Seletores do ChatGPT (para compatibilidade)
  SELECTORS: {
    textArea: [
      "div#prompt-textarea.ProseMirror",
      "textarea[data-id='root']",
      "div[data-testid='conversation-turn-2'] textarea",
      "div[contenteditable='true']",
      "textarea[placeholder*='Message']",
      "div[role='textbox']"
    ],
    submitButton: [
      'button[data-testid="send-button"]',
      'button[aria-label="Send message"]',
      'button[type="submit"]',
      'button:has(svg)',
      'button[data-testid="submit-button"]'
    ]
  },

  // Mensagens de status
  MESSAGES: {
    START: 'Iniciando envio de prompts...',
    SUCCESS: 'Todos os prompts foram enviados com sucesso!',
    ERROR: 'Erro ao enviar prompt. Tentando novamente...',
    STOPPED: 'Envio interrompido pelo usuário.',
    NO_PROMPTS: 'Por favor, digite pelo menos um prompt válido.',
    NO_CHATGPT: 'Por favor, abra o ChatGPT na aba ativa.',
    TEMPLATE_SAVED: 'Template salvo com sucesso!',
    TEMPLATE_LOADED: 'Template carregado com sucesso!',
    TEMPLATE_DELETED: 'Template excluído com sucesso!',
    EXPORT_SUCCESS: 'Prompts exportados com sucesso!',
    IMPORT_SUCCESS: 'Prompts importados com sucesso!'
  },

  // Configurações de UI
  UI: {
    POPUP_WIDTH: 400,
    NOTIFICATION_DURATION: 3000,
    PROGRESS_UPDATE_INTERVAL: 100,
    MAX_PROMPT_LENGTH: 4000
  },

  // Configurações de validação
  VALIDATION: {
    MIN_DELAY: 1,
    MAX_DELAY: 60,
    MIN_PROMPTS: 1,
    MAX_PROMPTS: 100
  },

  // Configurações de armazenamento
  STORAGE_KEYS: {
    PROMPTS: 'prompts',
    TEMPLATES: 'templates',
    SETTINGS: 'settings',
    HISTORY: 'history'
  },

  // Configurações de exportação/importação
  EXPORT: {
    FILE_PREFIX: 'chatgpt-prompts',
    FILE_EXTENSION: '.json',
    VERSION: '2.0'
  }
};

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}