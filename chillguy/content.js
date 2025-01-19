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

// Create and style the popup element
function createCommentaryPopup(text, imageUrl) {
  const popup = document.createElement('div');
  popup.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    max-width: 300px;
    background-color: #343541;
    color: white;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 2147483647;
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 1.4;
    animation: slideIn 0.3s ease-out;
  `;

  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // Add close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '×';
  closeButton.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 0 5px;
  `;
  closeButton.onclick = () => popup.remove();

  // Add the image if provided
  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.cssText = `
      width: 100px;
      height: auto;
      display: block;
      margin: 0 auto 10px auto;
      border-radius: 5px;
    `;
    popup.appendChild(img);
  }

  // Add the text
  const content = document.createElement('div');
  content.style.marginTop = '10px';
  content.textContent = text;

  popup.appendChild(closeButton);
  popup.appendChild(content);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (popup.parentNode) {
      popup.remove();
    }
  }, 10000);

  return popup;
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "activateChillGuy") {
    activateChillGuy();
  } else if (request.action === "showPopup") {
    console.log("showing popup with ", request.baseUrl);
    showPopup(request.baseUrl);
  }
  if (request.action === 'showCommentary') {
    const popup = createCommentaryPopup(request.commentary, request.imageUrl);
    document.body.appendChild(popup);
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
