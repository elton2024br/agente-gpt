# ChatGPT Auto Sender

This repository contains a lightweight Chrome extension that automatically sends a list of prompts to ChatGPT. It provides a simple popup where you can paste or type prompts, then start or stop the automated sending process.

## Loading the extension

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the folder of this repository.
5. The extension will appear in the list and its icon will be available next to the address bar.

## Using the extension

1. Make sure you have ChatGPT open in a tab and that you are logged in.
2. Click the extension icon to open the popup.
3. Enter your prompts in the text box **one per line**.
4. Press **Start Sending** to begin. The extension will send each prompt sequentially to the active ChatGPT tab.
5. Press **Stop Sending** at any time to cancel the remaining prompts.

The extension remembers the last prompts you entered, so the text box will be pre-filled the next time you open it.

## Prerequisites

- Google Chrome (or any Chromium-based browser that supports extensions)
- A ChatGPT session open and logged in before starting the sender

