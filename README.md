AI Canvas Architect Frontend 🎨⚡

A state-of-the-art Generative UI Mockup Canvas built with Next.js, React, Tailwind CSS, and the modern Vercel AI SDK v6

This application bridges the gap between natural language prompts and functional software mockups. Instead of conversing via standard chat bubbles, users describe interfaces, and an LLM streams dynamic schema blueprints to the client. The frontend parses this data structure in real-time, mapping structured JSON blocks directly into interactive, beautifully styled Tailwind components on an adjacent designer canvas.

🚀 Core Features

Generative UI Engine: Instantly translates unstructured user prompts into highly-visual interface components.

Vercel AI SDK v6 Integration: Leverages the robust Next.js server-side streaming helpers (toUIMessageStreamResponse) and client-side modern UI hooks (useChat).

Real-Time Chunk Parsing: Securely cleans and parses partial streaming JSON strings on stream finalization without triggering synchronous render cascades or freezing the main thread.

Component Preview: Maps JSON layouts onto a designer canvas, rendering real headers, input forms, and dynamic action buttons depending on structural parameters.

Sleek Developer UI: Built with custom Tailwind CSS dark layouts, Lucide icons, and responsive layouts.

🛠️ Tech Stack & Ecosystem

Frontend Framework: Next.js 15+ (App Router)

Language: TypeScript

Styling: Tailwind CSS (Fluid responsive layouts)

AI SDK: Vercel AI SDK v6 (ai, @ai-sdk/react)

Core Model: OpenAI GPT-4o-mini (@ai-sdk/openai)

Icons: Lucide React

⚙️ Architecture & Data Protocol

When a user clicks "Architect Interface", a modular data transformation sequence occurs:

[Prompt Input] ──► [Next.js API Route (/api/chat)] ──► [OpenAI Stream]
                          │                                     │
                          ▼                                     ▼
                 convertToModelMessages()              result.toUIMessageStreamResponse()
                          │                                     │
[Render Preview] ◄── [JSON Parse & Component Map] ◄── [onFinish Client Event]



Supported Component Schema

The AI is instructed to reply with a strict JSON format matching:

{
  "layoutTitle": "Registration Form",
  "components": [
    { "type": "heading", "label": "Create an Account" },
    { "type": "input", "label": "Full Name" },
    { "type": "button", "label": "Register Now", "color": "indigo" }
  ]
}


🏁 Setup & Installation

1. Navigate to Workspace

cd ai-frontend


2. Install Dependencies

npm install


3. Environment Configuration

Create a .env.local file in the root folder of ai-frontend:

OPENAI_API_KEY=your-actual-api-key-here


4. Launch Development Environment

Run the local next server:

npx next dev


Open your browser to http://localhost:3000 to interact with the mockup canvas!

📝 Example Layout Prompt

Give this design description a try inside the canvas interface:

"Create a login portal with a heading that says Welcome Back, an input field for Username, an input field for Secure Token, and a green button that says Gain Access."