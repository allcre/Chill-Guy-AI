chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateContent') {
    mockGroqApiCall(request.input)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indicates we will send a response asynchronously
  }
});

function mockGroqApiCall(input) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses = [
        "Yo, that's pretty chill!",
        "Bruh, you're killing it!",
        "Nah, that's kinda cringe, my dude.",
        "Sick moves, bro!",
        "Dude, you're vibing hard right now!"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      resolve({ 
        text: randomResponse, 
        imageUrl: chrome.runtime.getURL('95c.png')
      });
    }, 1000);
  });
}

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId === 0) {
    // wait 1 second for it to load
    setTimeout(() => {
      chrome.tabs.get(details.tabId, (tab) => {
        if (tab.status === 'complete') {
          const url = new URL(details.url);
          const baseUrl = url.origin;
          console.log("visited " + baseUrl);
          chrome.tabs.sendMessage(details.tabId, {
            action: "showPopup",
            baseUrl: baseUrl
          }, (response) => {
            if (chrome.runtime.lastError) {
              console.log("Error sending message:", chrome.runtime.lastError.message);
            }
          });
        }
        else {
          console.log("Tab not yet loaded. Ignoring.");
        }
      });
    }, 1000);
  }
}, {
  url: [{ schemes: ["http", "https"] }]
});


chrome.tabs.onCreated.addListener((tab) => {
  if (tab.pendingUrl === "chrome://newtab/") {
    chrome.tabs.update(tab.id, { url: "https://www.google.com" });
  }
});


chrome.tabs.onCreated.addListener((tab) => {
  if (tab.pendingUrl === "chrome://newtab/") {
    chrome.tabs.update(tab.id, { url: "https://www.google.com" });
  }
});
