document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById("status");
  const delayInput = document.getElementById("delay");
  statusEl.textContent = "Status: Idle";

  // Restaurar os prompts salvos quando o popup for aberto
  chrome.storage.local.get(["prompts", "delay"], (data) => {
    if (data.prompts) {
      document.getElementById("prompts").value = data.prompts;
    }
    if (data.delay) {
      delayInput.value = data.delay;
    }
  });

  document.getElementById("start").addEventListener("click", () => {
    const rawPrompts = document.getElementById("prompts").value;
    const prompts = rawPrompts.split('\n').map(p => p.trim()).filter(p => p !== "");
    const delay = parseInt(delayInput.value, 10) > 0 ? parseInt(delayInput.value, 10) : 1000;

    if (prompts.length > 0) {
      // Salvar os prompts no armazenamento local
      chrome.storage.local.set({ prompts: rawPrompts, delay });

      chrome.runtime.sendMessage({ action: "start", prompts, delay });
      statusEl.textContent = `Sending prompts (0/${prompts.length})...`;
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
  } else if (request.action === "progress") {
    statusEl.textContent = `Sending prompts (${request.index}/${request.total})...`;
    if (request.index === request.total) {
      statusEl.textContent = "Completed.";
    }
  }
});
