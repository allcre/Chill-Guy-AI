// Create and style the popup element
function createCommentaryPopup(text, audioData) {
  console.log('Creating popup with:', { text, hasAudio: !!audioData });

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

  // Handle audio
  if (audioData) {
    console.log('Audio data received, creating blob');
    // Convert base64 back to blob
    const binaryStr = atob(audioData);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);

    console.log('Created audio URL:', audioUrl);
    const audio = new Audio(audioUrl);

    // Debug audio events
    audio.addEventListener('canplay', () => console.log('Audio can play'));
    audio.addEventListener('playing', () => console.log('Audio started playing'));
    audio.addEventListener('error', (e) => console.error('Audio error:', e));

    // Add play/pause button
    const audioButton = document.createElement('button');
    audioButton.innerHTML = '<i class="fa fa-pause"></i>';
    audioButton.style.cssText = `
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 5px;
      margin-right: 5px;
    `;

    let isPlaying = false;

    // Autoplay when ready
    audio.addEventListener('canplaythrough', () => {
      console.log('Attempting autoplay...');
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Autoplay started successfully');
            isPlaying = true;
            audioButton.innerHTML = '<i class="fa fa-pause"></i>';
          })
          .catch(error => {
            console.error('Autoplay failed:', error);
            isPlaying = false;
            audioButton.innerHTML = '<i class="fa fa-play"></i>';
          });
      }
    });

    // Toggle play / pause
    audioButton.onclick = () => {
      console.log('Audio button clicked, current state:', isPlaying);
      if (isPlaying) {
        audio.pause();
        audioButton.innerHTML = '<i class="fa fa-play"></i>';
      } else {
        audio.play();
        audioButton.innerHTML = '<i class="fa fa-pause"></i>';
      }
      isPlaying = !isPlaying;
    };

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    `;

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 0 5px;
    `;
    closeButton.onclick = () => {
      console.log('Closing popup, stopping audio');
      audio.pause();
      popup.remove();
    };

    buttonContainer.appendChild(audioButton);
    buttonContainer.appendChild(closeButton);
    popup.appendChild(buttonContainer);
  } else {
    console.log('No audio URL provided');
    // Just add the close button if no audio
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
    popup.appendChild(closeButton);
  }

  // Add the text content
  const content = document.createElement('div');
  content.style.marginTop = '10px';
  content.textContent = text;
  popup.appendChild(content);

  const img = document.createElement('img');
  img.src = chrome.runtime.getURL('95c.png');
  img.style.width = '100px';
  img.style.height = 'auto';
  img.style.display = 'block';
  img.style.marginBottom = '10px';

  popup.appendChild(img);

  // Auto-remove after 15 seconds
  setTimeout(() => {
    if (popup.parentNode) {
      console.log('Auto-removing popup after 10 seconds');
      popup.remove();
    }
  }, 100000);

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
