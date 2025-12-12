# AI Health Access Screener (Lagos Edition)

A Solvearn-style interactive AI screener for Lagos healthcare access.

## Features
- **Interactive Wizard**: 7-step conversational screener.
- **AI Analysis**: Generates risk assessment, summary, and advice (Mocked for demo, supports Gemini API).
- **Clinic Recommendation**: Suggests nearest affordable Lagos clinic.
- **Premium UI**: Dark mode + Neon Green aesthetics.

## How to Run
1.  Navigate to the directory:
    ```bash
    cd lagos-health-screener
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open the link shown (usually `http://localhost:5173`).

## AI Configuration
- The app runs in **Demo Mode** by default (no API key required).
- To use real Gemini AI, click "Set API Key" in the top right and enter your Google Gemini API Key.
