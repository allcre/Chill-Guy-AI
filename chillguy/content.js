// Create and style the popup element
function createCommentaryPopup(text, audioData) {
  console.log('Creating popup with:', { text, hasAudio: !!audioData });

  // Calculate random position along the bottom
  const windowWidth = window.innerWidth;
  const popupWidth = 300; // max-width of our popup
  const minMargin = 20; // minimum distance from edges
  const maxX = windowWidth - popupWidth - minMargin;
  const randomX = Math.max(minMargin, Math.floor(Math.random() * maxX));

  // Randomly decide if image should be flipped
  const shouldFlip = Math.random() > 0.5;

  const popup = document.createElement('div');
  popup.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: ${randomX}px;
    display: flex;
    flex-direction: column;
    align-items: ${shouldFlip ? 'flex-start' : 'flex-end'};
    max-width: 300px;
    z-index: 2147483647;
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 1.4;
    animation: slideIn 1.5s ease-out;
  `;

  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      0% { transform: translateY(100%); opacity: 0; }
      50% { transform: translateY(0); opacity: 1; }
      60% { transform: translateY(-10px); }
      100% { transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // Create the speech bubble container
  const speechBubble = document.createElement('div');
  speechBubble.style.cssText = `
    position: relative;
    background-color: white;
    color: black;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 15px;
    width: 100%;
  `;

  // Add the speech bubble pointer
  const pointer = document.createElement('div');
  pointer.style.cssText = `
    position: absolute;
    bottom: -10px;
    ${shouldFlip ? 'left' : 'right'}: 40px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid white;
  `;

  // Add the text content
  const content = document.createElement('div');
  content.style.marginTop = '5px';
  content.textContent = text;

  // Add the character image
  const img = document.createElement('img');
  img.src = chrome.runtime.getURL('95c.png');
  img.style.cssText = `
    width: 200px;
    height: auto;
    display: block;
    margin-${shouldFlip ? 'left' : 'right'}: 20px;
    transform: scaleX(${shouldFlip ? -1 : 1});
  `;

  // Assemble the speech bubble
  speechBubble.appendChild(content);
  speechBubble.appendChild(pointer);

  // Add elements to the popup
  popup.appendChild(speechBubble);
  popup.appendChild(img);

  // Handle audio if provided
  if (audioData) {
    console.log('Audio data received, creating blob');
    const binaryStr = atob(audioData);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    // Remove popup when audio ends
    audio.addEventListener('ended', () => {
      console.log('Audio ended, removing popup');
      if (popup.parentNode) {
        // Add fade out animation
        popup.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => popup.remove(), 500);
      }
    });

    // Add fade out animation
    const fadeOutStyle = document.createElement('style');
    fadeOutStyle.textContent = `
      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
      }
    `;
    document.head.appendChild(fadeOutStyle);

    // Start playing audio
    audio.play().catch(error => {
      console.error('Audio playback failed:', error);
      // Fallback to timeout if audio fails
      setTimeout(() => {
        if (popup.parentNode) {
          popup.style.animation = 'fadeOut 0.5s ease-out';
          setTimeout(() => popup.remove(), 500);
        }
      }, 10000);
    });
  } else {
    // If no audio, remove after 10 seconds
    setTimeout(() => {
      if (popup.parentNode) {
        popup.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => popup.remove(), 500);
      }
    }, 10000);
  }

  return popup;
}

// Update message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);

  if (request.action === 'showCommentary') {
    console.log('Creating commentary popup with:', {
      commentary: request.commentary,
      hasAudioData: !!request.audioData
    });
    const popup = createCommentaryPopup(request.commentary, request.audioData);
    document.body.appendChild(popup);
  }
});
