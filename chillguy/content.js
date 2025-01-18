let lastPopupTime = 0;

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
  
  // Create and add the image
  const img = document.createElement('img');
  img.src = chrome.runtime.getURL('95c.png');
  img.style.width = '100px';
  img.style.height = 'auto';
  img.style.display = 'block';
  img.style.marginBottom = '10px';
  
  chillGuy.appendChild(img);
  
  const textElement = document.createElement('p');
  textElement.textContent = text;
  chillGuy.appendChild(textElement);
  
  return chillGuy;
}

function activateChillGuy() {
  const currentTime = Date.now();
  if (currentTime - lastPopupTime < 10000) {
    return; // Don't show popup if less than 10 seconds have passed
  }

  chrome.runtime.sendMessage({ action: "generateContent", input: "Activate Chill Guy" }, (response) => {
    if (response.success) {
      const chillGuy = createChillGuyElement(response.data.text);
      document.body.appendChild(chillGuy);
      lastPopupTime = currentTime;
      setTimeout(() => {
        chillGuy.remove();
      }, 5000);
    }
  });
}

function checkForRizz() {
  const pageContent = document.body.innerText.toLowerCase();
  if (pageContent.includes('rizz')) {
    activateChillGuy();
  }
}

// Activate Chill Guy when TikTok is loaded
if (window.location.hostname.includes('tiktok.com')) {
  window.addEventListener('load', activateChillGuy);
}

// Run the "rizz" check every 5 seconds on all pages
setInterval(checkForRizz, 5000);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "activateChillGuy") {
    activateChillGuy();
  } else if (request.action === "showPopup") {
    // const currentTime = Date.now();
    // if (currentTime - lastPopupTime < 3000) {
    //   return; // Don't show popup if less than 10 seconds have passed
    // }
    console.log("showing popup with ", request.baseUrl);
    showPopup(request.baseUrl);
    // lastPopupTime = currentTime;
  }
});

function showPopup(baseUrl) {
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '20px';
  popup.style.right = '20px';
  popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  popup.style.color = 'white';
  popup.style.padding = '10px';
  popup.style.borderRadius = '5px';
  popup.style.zIndex = '9999';
  popup.textContent = `Bro, are you really on ${baseUrl} right now?`;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 5000);
}
