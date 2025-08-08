let isProcessing = false;
let shouldStop = false;
let currentPromptIndex = 0;
let totalPrompts = 0;
let settings = {
  delay: 2,
  mode: 'sequential',
  autoScroll: false
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start") {
    shouldStop = false;
    const prompts = request.prompts;
    settings = request.settings || settings;
    
    currentPromptIndex = 0;
    totalPrompts = prompts.length;
    
    console.log(`Iniciando envio de ${totalPrompts} prompts com configurações:`, settings);
    
    // Notificar início
    chrome.runtime.sendMessage({ 
      action: "status", 
      status: "sending", 
      message: `Iniciando envio de ${totalPrompts} prompts...` 
    });

    if (settings.mode === 'batch') {
      sendBatchPrompts(prompts);
    } else {
      sendSequentialPrompts(prompts);
    }
  } else if (request.action === "stop") {
    shouldStop = true;
    isProcessing = false;
    console.log("Processo de envio interrompido pelo usuário");
    
    chrome.runtime.sendMessage({ 
      action: "status", 
      status: "idle", 
      message: "Envio interrompido pelo usuário." 
    });
  }
});

function sendSequentialPrompts(prompts) {
  const sendNextPrompt = () => {
    if (currentPromptIndex < prompts.length && !isProcessing && !shouldStop) {
      isProcessing = true;
      
      // Atualizar progresso
      chrome.runtime.sendMessage({ 
        action: "progress", 
        current: currentPromptIndex + 1, 
        total: totalPrompts 
      });
      
      sendPromptToChatGPT(prompts[currentPromptIndex])
        .then(() => {
          console.log(`Prompt ${currentPromptIndex + 1}/${totalPrompts} enviado com sucesso: ${prompts[currentPromptIndex]}`);
          currentPromptIndex++;
          isProcessing = false;
          
          if (currentPromptIndex < prompts.length && !shouldStop) {
            // Aguardar delay configurado antes do próximo prompt
            setTimeout(sendNextPrompt, settings.delay * 1000);
          } else if (currentPromptIndex >= prompts.length) {
            // Todos os prompts foram enviados
            chrome.runtime.sendMessage({ 
              action: "status", 
              status: "idle", 
              message: `Todos os ${totalPrompts} prompts foram enviados com sucesso!` 
            });
          }
        })
        .catch((error) => {
          console.error(`Erro ao enviar prompt ${currentPromptIndex + 1}:`, error);
          isProcessing = false;
          
          // Tentar novamente após um delay maior em caso de erro
          if (!shouldStop) {
            setTimeout(sendNextPrompt, (settings.delay + 2) * 1000);
          }
        });
    }
  };

  sendNextPrompt();
}

function sendBatchPrompts(prompts) {
  // Enviar todos os prompts de uma vez
  const promises = prompts.map((prompt, index) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        sendPromptToChatGPT(prompt)
          .then(() => {
            console.log(`Prompt ${index + 1}/${totalPrompts} enviado: ${prompt}`);
            chrome.runtime.sendMessage({ 
              action: "progress", 
              current: index + 1, 
              total: totalPrompts 
            });
            resolve();
          })
          .catch(reject);
      }, index * (settings.delay * 1000));
    });
  });

  Promise.all(promises)
    .then(() => {
      chrome.runtime.sendMessage({ 
        action: "status", 
        status: "idle", 
        message: `Todos os ${totalPrompts} prompts foram enviados em lote!` 
      });
    })
    .catch((error) => {
      console.error("Erro no envio em lote:", error);
      chrome.runtime.sendMessage({ 
        action: "status", 
        status: "error", 
        message: "Erro no envio em lote. Verifique a conexão." 
      });
    });
}

function sendPromptToChatGPT(prompt) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError || !tabs || tabs.length === 0) {
        const msg = chrome.runtime.lastError ? chrome.runtime.lastError.message : "Aba ativa não encontrada";
        chrome.runtime.sendMessage({ action: "notify", message: msg });
        return reject(msg);
      }

      const activeTab = tabs[0];
      const url = activeTab.url || "";
      const chatGPTRegex = /^https:\/\/(chat\.openai\.com|chatgpt\.com)/;

      if (!chatGPTRegex.test(url)) {
        const msg = "Por favor, abra o ChatGPT na aba ativa.";
        chrome.runtime.sendMessage({ action: "notify", message: msg });
        return reject(msg);
      }

      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: injectPrompt,
        args: [prompt, settings.autoScroll]
      }, (results) => {
        if (chrome.runtime.lastError) {
          const errorMsg = `Erro ao executar o script: ${chrome.runtime.lastError.message}`;
          reject(errorMsg);
        } else if (results && results[0] && results[0].result === 'success') {
          resolve("Prompt enviado com sucesso");
        } else {
          reject("Falha ao enviar o prompt");
        }
      });
    });
  });
}

function injectPrompt(prompt, autoScroll) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 10;

    const checkButtonAndSend = () => {
      attempts++;
      
      // Procurar por diferentes seletores do ChatGPT
      const textDiv = document.querySelector("div#prompt-textarea.ProseMirror") || 
                     document.querySelector("textarea[data-id='root']") ||
                     document.querySelector("div[data-testid='conversation-turn-2'] textarea") ||
                     document.querySelector("div[contenteditable='true']");

      if (textDiv) {
        // Limpar o conteúdo anterior
        textDiv.innerHTML = '';
        
        // Inserir o novo prompt
        if (textDiv.tagName === 'TEXTAREA') {
          textDiv.value = prompt;
          textDiv.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          textDiv.innerHTML = `<p>${prompt}</p>`;
          textDiv.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Procurar pelo botão de envio
        const submitButton = document.querySelector('button[data-testid="send-button"]') ||
                           document.querySelector('button[aria-label="Send message"]') ||
                           document.querySelector('button[type="submit"]') ||
                           document.querySelector('button:has(svg)');

        if (submitButton && !submitButton.disabled) {
          // Fazer scroll para o botão se necessário
          if (autoScroll) {
            submitButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }

          // Aguardar um pouco antes de clicar
          setTimeout(() => {
            const event = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true
            });
            submitButton.dispatchEvent(event);
            resolve('success');
          }, 500);
        } else {
          if (attempts < maxAttempts) {
            setTimeout(checkButtonAndSend, 1000);
          } else {
            reject("Botão de envio não encontrado ou desabilitado após várias tentativas");
          }
        }
      } else {
        if (attempts < maxAttempts) {
          setTimeout(checkButtonAndSend, 1000);
        } else {
          reject("Campo de texto não encontrado após várias tentativas");
        }
      }
    };

    checkButtonAndSend();
  });
}
