# chill guy ai

Chill Guy AI is a Chrome extension coupled with an on-chain experience that brings the iconic "chill guy" meme to life as your personal hype-capybara. Designed to help students stay focused and motivated, this AI-powered assistant provides timely, humorous, and encouraging feedback as you browse the internet while doing schoolwork. With its unique blend of genuine productivity insights and on-chain motivation, Chill Guy keeps you on track without ruining the vibe.

Demo video: https://youtu.be/DkEFwWnD6pk
![youtube](https://youtu.be/DkEFwWnD6pk)


## Features

- **AI-Powered Dialogue**: Chill Guy AI analyzes your browsing habits in real-time and offers witty, context-aware comments to keep you motivated.
- **Gain Aura**: Earn aura points for consistent productivity, visualized through an immersive "aura" experience.
- **On-Chain Rewards**: Leverage Starknet blockchain technology to issue and store aura points as digital assets.
- **Audio Feedback**: Hear Chill Guy AI's advice with text-to-speech functionality, bringing the capybara to life.

## Inspiration

Chill Guy AI was born from the desire to make productivity tools more relatable and engaging for students. By embodying the laid-back yet insightful persona of the "chill guy" meme, we've created an assistant that speaks the language of today's students while genuinely helping them stay focused.

## How It Works

1. Chill Guy AI monitors your browsing activity in the background.
2. When you visit a website, it analyzes the content and your browsing history.
3. Based on this analysis, Chill Guy AI decides whether to offer advice, encouragement, or a gentle nudge to stay on track.
4. For consistently productive behavior, you can earn aura points, visualized through an immersive full-screen experience.
5. Your productivity achievements are recorded on the Starknet blockchain, creating a permanent record of your progress.

## Tech Stack

- AI Integration: Groq API for natural language processing
- Audio Generation: ElevenLabs API for text-to-speech
- Blockchain: Starknet for on-chain rewards
- Chrome Extension: JavaScript, Chrome Extension API
- Smart Contracts: Cairo programming language
- Development Framework: Scaffold-Stark for rapid Starknet dapp development
- Frontend: HTML, CSS, JavaScript

## Future Plans

- Implement a social feature allowing friends to share and compare their productivity stats.
- Allow users to converse with Chill Guy AI.
- Expand the range of on-chain rewards and introduce NFT-based achievements.
- Integrate with other applications for more comprehensive tracking and rewards.

## Setup Instructions
1. Clone this repository

### Chrome Extension
#### Requirements
- Groq API key
- ElevenLabs API key

1. Unpack the `chillguy` folder in `chrome://extensions`
2. The first time the extension is run, you will be prompted to enter your Groq and EleventLabs API keys in the provided form. 

### Starknet
#### Dependencies
- Node (>= v18.17)
- Yarn (v1 or v2+)
- Git
- Rust
- asdf

1. Enter the starknet directory: `cd starknet`
2. Run `yarn install`
3. Run `yarn chain`
4. In a new terminal, run `yarn deploy --network`
5. Run `yarn start`
