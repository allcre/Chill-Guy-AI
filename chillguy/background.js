chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateContent') {
    mockGroqApiCall(request.input)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indicates we will send a response asynchronously
  }
});

// Import the Groq SDK
import Groq from 'groq-sdk';

// Initialize the Groq client
const groq = new Groq({
  apiKey: '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'
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateContent') {
    realGroqApiCall(request.input)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indicates we will send a response asynchronously
  }
});

async function realGroqApiCall(input) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: input
        }
      ],
      model: 'llama3-70b-8192', 
      temperature: 0.7,
      max_tokens: 100
    });

    const response = chatCompletion.choices[0].message.content;
    return { text: response, audio: null }; // Audio functionality would need to be implemented separately
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw error;
  }
}


// function mockGroqApiCall(input) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const responses = [
//         "Yo, that's pretty chill!",
//         "Bruh, you're killing it!",
//         "Nah, that's kinda cringe, my dude.",
//         "Sick moves, bro!",
//         "Dude, you're vibing hard right now!"
//       ];
//       const randomResponse = responses[Math.floor(Math.random() * responses.length)];
//       resolve({ text: randomResponse, audio: "mock_audio_url" });
//     }, 1000);
//   });
// }

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
