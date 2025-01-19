// Initialize chat history
let chatHistory;

// Listen for when the extension is installed
chrome.runtime.onInstalled.addListener(function () {
  // Set default API model
  let defaultModel = "gpt-4o";
  chrome.storage.local.set({ apiModel: defaultModel });

  // Set empty chat history
  chrome.storage.local.set({ chatHistory: [] });

  // Open the options page
  chrome.runtime.openOptionsPage();
});

// Fetch data from the OpenAI Chat Completion API
async function fetchChatCompletion(messages, apiKey, apiModel) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        "messages": messages,
        "model": "llama-3.3-70b-versatile",
      })
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Unauthorized - Incorrect API key
        throw new Error("Looks like your API key is incorrect. Please check your API key and try again.");
      } else {
        throw new Error(`Failed to fetch. Status code: ${response.status}`);
      }
    }

    return await response.json();
  } catch (error) {
    // Send a response to the popup script
    chrome.runtime.sendMessage({ error: error.message });

    console.error(error);
  }
}

// Get data from local storage
function getStorageData(keys) {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (result) => resolve(result));
  });
}


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

// Fetch audio from ElevenLabs API
async function fetchElevenLabsAudio(text) {
  try {
    console.log('Fetching ElevenLabs audio for text:', text);

    const { elevenLabsKey } = await getStorageData(["elevenLabsKey"]);
    if (!elevenLabsKey) {
      console.log('No ElevenLabs API key found');
      return null;
    }

    console.log('Making ElevenLabs API request...');
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsKey
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      console.error('ElevenLabs API error:', response.status);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    console.log('Successfully received audio response');
    const audioBuffer = await response.arrayBuffer();
    // Convert ArrayBuffer to Base64
    const base64Audio = btoa(
      new Uint8Array(audioBuffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    console.log('Created base64 audio data');
    return base64Audio;
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    return null;
  }
}

// Modify the existing navigation listener
chrome.webNavigation.onCompleted.addListener(async (details) => {
  if (details.frameId === 0 && !details.url.startsWith('chrome://')) {
    const message = { userInput: `the user has visited ${details.url}` };

    const { apiKey } = await getStorageData(["apiKey"]);
    const { apiModel } = await getStorageData(["apiModel"]);

    const { chatHistory: existingHistory } = await getStorageData(["chatHistory"]);
    let updatedHistory = existingHistory || [];

    if (updatedHistory.length === 0) {
      updatedHistory.push({
        role: "system",
        content: `You are Chill Guy, a laid-back AI surfer dude who's super knowledgeable about the web.
        Your vibe is casual and friendly, using tiktok/online/gen z (cooked, crash out, sick, vibe, cooking, it's over, nonchalant, chalant etc) slang naturally. You give brief, insightful takes on websites,
        keeping responses under 2 sentences. You often use slang, but not in a forced way. You're honest but generally positive, and you actually analyze the URL/website
        being discussed. However, you are audacious and bold, and you are not afraid to say what you think. You are very judgemental, and you are providing honest commentary about the user who is visiting the website provided to you.
        For example, if the user is visiting a distracting website like tiktok.com, you will tell them to "Lock in, you don't want to be unemployed". You are humourous in your bluntness. The user who is visiting these sites is a university student CS major living in Ottawa, Canada, and is probably a man.
        You are motivating in your answers though, not mean. Use the user's browsing history to infer what they are working on/doing, and use this information in your response. Your responses can reference things you've previously said if it makes sense.

        After 3 page visits, if the user is on a productive website, respond with "AURA_BOOST" and nothing else. Example message: "AURA_BOOST".
        If they are not on a productive website, you must reply with "NO_AURA_BOOST" and nothing else.
        Do not offer any additional message besides "AURA_BOOST" or "NO_AURA_BOOST".

        IMPORTANT: You should only respond with a message if you think it's meaningful or helpful to do so. For example:
        - If they're visiting a distracting site when they should be working/studying
        - If they're visiting a site that's concerning or potentially harmful
        - If they're visiting a site that's related to their studies/work and you have something encouraging to say
        - If they're visiting the same distracting site multiple times

        If you don't think a message would be meaningful, respond with "NO_MESSAGE" and nothing else.
        For all other responses, make them impactful and relevant to what they're doing, unless the message is "AURA_BOOST", "NO_AURA_BOOST" or "NO_MESSAGE".`
      });
    }

    updatedHistory.push({ role: "user", content: message.userInput });

    const response = await fetchChatCompletion(updatedHistory, apiKey, apiModel);
    if (response?.choices?.[0]?.message?.content) {
      const assistantResponse = response.choices[0].message.content;
      console.log('Assistant response:', assistantResponse);

      // Skip if the LLM decides not to show a message
      if (assistantResponse.trim().includes("NO_MESSAGE")) {
        return;
      }

      if (assistantResponse.trim().includes("NO_AURA_BOOST")) {
        return;
      }

      if (assistantResponse.trim().includes("AURA_BOOST")) {
        // open aura.html in a new tab and focus on it
        chrome.tabs.create({ url: chrome.runtime.getURL("aura.html") });
        return;
      }

      updatedHistory.push({ role: "assistant", content: assistantResponse });
      await chrome.storage.local.set({ chatHistory: updatedHistory });

      // Get audio as base64
      const audioData = await fetchElevenLabsAudio(assistantResponse);
      // const audioData = null;

      // Send both text and audio data to content script
      chrome.tabs.sendMessage(details.tabId, {
        action: 'showCommentary',
        commentary: assistantResponse,
        audioData: audioData
      });
    }
  }
});
