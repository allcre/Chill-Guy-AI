document.addEventListener('DOMContentLoaded', function () {
  const groqKeyInput = document.getElementById('apiKey');
  const elevenLabsKeyInput = document.getElementById('elevenLabsKey');
  const saveGroqButton = document.getElementById('save-groq-button');
  const saveElevenButton = document.getElementById('save-eleven-button');
  const deleteButton = document.getElementById('delete-button');
  const statusMessage = document.getElementById('status-message');

  // Retrieve saved API keys
  chrome.storage.local.get(['apiKey', 'elevenLabsKey'], function (result) {
    if (result.apiKey) groqKeyInput.value = result.apiKey;
    if (result.elevenLabsKey) elevenLabsKeyInput.value = result.elevenLabsKey;
  });

  // Save Groq API key
  saveGroqButton.addEventListener('click', function () {
    const apiKey = groqKeyInput.value.trim();
    if (isValidGroqKey(apiKey)) {
      chrome.storage.local.set({ apiKey }, function () {
        showStatus('Groq API key saved successfully!');
      });
    } else {
      showStatus('Please enter a valid Groq API key.');
    }
  });

  // Save ElevenLabs API key
  saveElevenButton.addEventListener('click', function () {
    const elevenLabsKey = elevenLabsKeyInput.value.trim();
    if (isValidElevenLabsKey(elevenLabsKey)) {
      chrome.storage.local.set({ elevenLabsKey }, function () {
        showStatus('ElevenLabs API key saved successfully!');
      });
    } else {
      showStatus('Please enter a valid ElevenLabs API key.');
    }
  });

  // Delete all API keys
  deleteButton.addEventListener('click', function () {
    if (confirm('Are you sure you want to delete all API keys?')) {
      chrome.storage.local.remove(['apiKey', 'elevenLabsKey'], function () {
        groqKeyInput.value = '';
        elevenLabsKeyInput.value = '';
        showStatus('All API keys deleted successfully!');
      });
    }
  });

  function isValidGroqKey(key) {
    return key !== '' && key.length > 10 && key.length < 100 && key.includes('gsk_');
  }

  function isValidElevenLabsKey(key) {
    return key !== '' && key.length > 10 && key.length < 100;
  }

  function showStatus(message) {
    statusMessage.textContent = message;
    setTimeout(() => statusMessage.textContent = '', 2000);
  }
});

// localize title optionsTitle
document.getElementById('optionsTitle').innerHTML = chrome.i18n.getMessage("optionsTitle");

// localize api title apiTitle
document.getElementById('apiTitle').innerHTML = chrome.i18n.getMessage("apiTitle");

// localize the api key input placeholder
document.getElementById('apiKey').placeholder = chrome.i18n.getMessage("optionsInputPlaceholder");

// localize api-key-note
document.getElementById('api-key-note').innerHTML = chrome.i18n.getMessage("optionsApiKeyNote");

// localize save button text
document.getElementById('save-button-text').innerText = chrome.i18n.getMessage("optionsSaveButtonText");

// localize delete button text
document.getElementById('delete-button-text').innerText = chrome.i18n.getMessage("optionsDeleteButtonText");
