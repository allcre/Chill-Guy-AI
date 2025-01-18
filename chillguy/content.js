function createChillGuyElement(text) {
  const chillGuy = document.createElement('div');
  chillGuy.style.position = 'fixed';
  chillGuy.style.bottom = '20px';
  chillGuy.style.right = '20px';
  chillGuy.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  chillGuy.style.color = 'white';
  chillGuy.style.padding = '10px';
  chillGuy.style.borderRadius = '5px';
  chillGuy.style.zIndex = '9999';
  chillGuy.textContent = text;
  return chillGuy;
}

function activateChillGuy() {
  chrome.runtime.sendMessage({ action: "generateContent", input: "Activate Chill Guy" }, (response) => {
    if (response.success) {
      const chillGuy = createChillGuyElement(response.data.text);
      document.body.appendChild(chillGuy);
      setTimeout(() => {
        chillGuy.remove();
      }, 5000);
    }
  });
}

// Automatically activate Chill Guy when TikTok is loaded
window.addEventListener('load', activateChillGuy);

// Keep the existing message listener for manual activation
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "activateChillGuy") {
    activateChillGuy();
  }
});
