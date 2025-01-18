chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateContent') {
    mockGroqApiCall(request.input)
      .then(result => sendResponse({success: true, data: result}))
      .catch(error => sendResponse({success: false, error: error.message}));
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
      resolve({text: randomResponse, audio: "mock_audio_url"});
    }, 1000);
  });
}
