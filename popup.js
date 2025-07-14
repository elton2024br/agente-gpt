document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById("status");
  statusEl.textContent = "Status: Idle";

  // Restaurar os prompts salvos quando o popup for aberto
  chrome.storage.local.get("prompts", (data) => {
    if (data.prompts) {
      document.getElementById("prompts").value = data.prompts;  // Carregar os prompts salvos
    }
  });

  document.getElementById("start").addEventListener("click", () => {
    const rawPrompts = document.getElementById("prompts").value;
    const prompts = rawPrompts.split('\n').map(p => p.trim()).filter(p => p !== ""); // Separar por linhas e remover espaços em branco e linhas vazias

    if (prompts.length > 0) {
      // Salvar os prompts no armazenamento local
      chrome.storage.local.set({ prompts: rawPrompts });

      chrome.runtime.sendMessage({ action: "start", prompts });  // Enviar os prompts como um array de linhas
      statusEl.textContent = "Sending prompts...";
    } else {
      alert("Please enter at least one valid prompt.");
    }
  });

  document.getElementById("stop").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "stop" });  // Enviar mensagem para parar o envio dos prompts
    statusEl.textContent = "Stopped.";
  });
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "notify" && request.message) {
    alert(request.message);
  }
});
