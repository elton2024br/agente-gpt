let isProcessing = false;
let shouldStop = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "start") {
      shouldStop = false;
      const prompts = request.prompts;
      let promptIndex = 0;
  
      const sendNextPrompt = () => {
        if (promptIndex < prompts.length && !isProcessing && !shouldStop) {
          isProcessing = true;
          sendPromptToChatGPT(prompts[promptIndex])
            .then(() => {
              console.log(`Prompt enviado com sucesso: ${prompts[promptIndex]}`);
              promptIndex++;
              isProcessing = false;
              if (!shouldStop) {
                setTimeout(sendNextPrompt, 1000);
              }
            })
            .catch((error) => {
              console.error("Erro ao enviar prompt:", error);
              isProcessing = false;
              if (!shouldStop) {
                setTimeout(sendNextPrompt, 1000);
              }
            });
        }
      };
  
      sendNextPrompt();
    } else if (request.action === "stop") {
      shouldStop = true;
      console.log("Processo de envio interrompido");
    }
});

function sendPromptToChatGPT(prompt) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError || !tabs || tabs.length === 0) {
        const msg = chrome.runtime.lastError ? chrome.runtime.lastError.message : "Active tab not found";
        chrome.runtime.sendMessage({ action: "notify", message: msg });
        return reject(msg);
      }

      const activeTab = tabs[0];
      const url = activeTab.url || "";
      const chatGPTRegex = /^https:\/\/chat\.openai\.com/;

      if (!chatGPTRegex.test(url)) {
        const msg = "Please open ChatGPT in the active tab.";
        chrome.runtime.sendMessage({ action: "notify", message: msg });
        return reject(msg);
      }

      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: injectPrompt,
        args: [prompt]
      }, (results) => {
        if (chrome.runtime.lastError) {
          reject(`Erro ao executar o script: ${chrome.runtime.lastError.message}`);
        } else if (results && results[0] && results[0].result === 'success') {
          resolve("Prompt enviado com sucesso");
        } else {
          reject("Falha ao enviar o prompt");
        }
      });
    });
  });
}

function injectPrompt(prompt) {
  return new Promise((resolve, reject) => {
    const checkButtonAndSend = () => {
      const textDiv = document.querySelector("div#prompt-textarea.ProseMirror");

      if (textDiv) {
        textDiv.innerHTML = `<p>${prompt}</p>`;
        textDiv.dispatchEvent(new Event('input', { bubbles: true }));

        const submitButton = document.querySelector('button[data-testid="send-button"]');
        if (submitButton && !submitButton.disabled) {
          const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          submitButton.dispatchEvent(event);
          resolve('success');
        } else {
          setTimeout(checkButtonAndSend, 1000);
        }
      } else {
        reject("Div de entrada não encontrada");
      }
    };

    checkButtonAndSend();
  });
}
