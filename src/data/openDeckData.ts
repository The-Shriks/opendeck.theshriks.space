export const WRAPPERS = [
  {
    id: 'wrapper-whichllm',
    name: 'whichllm',
    description: 'Auto-detects your GPU/CPU/RAM and ranks the top models from HuggingFace that fit your system.',
    stars: '★',
    url: 'https://github.com/Andyyyy64/whichllm',
    type: 'CLI Tool',
    locked: false,
    content: `# whichllm

Find the best local LLM that actually runs on your hardware.
Auto-detects your GPU/CPU/RAM and ranks the top models from HuggingFace that fit your system.

## Quick start

Run the recommendation command once, with no project setup.
> uvx whichllm@latest

Simulate a GPU before you buy hardware.
> uvx whichllm@latest --gpu "RTX 4090"

## Features
- Auto-detect hardware (NVIDIA, AMD, Apple Silicon, CPU-only)
- Smart ranking by VRAM fit, speed, and benchmark quality
- One-command chat (whichllm run)`
  },
  {
    id: 'wrapper-genai',
    name: 'GenAI React Wrapper',
    description: 'A lightweight React hook wrapper for the Google GenAI SDK, providing easy context management and stream parsing.',
    stars: 1204,
    url: 'https://github.com/opendeck/genai-react',
    type: 'React Hook'
  },
  {
    id: 'wrapper-motion',
    name: 'Framer Motion Utilities',
    description: 'Pre-configured animation variants and primitives for building high-performance micro-interactions.',
    stars: 843,
    url: 'https://github.com/opendeck/motion-utils',
    type: 'Utility Library'
  },
  {
    id: 'wrapper-auth',
    name: 'Local Auth Mock',
    description: 'A zero-dependency local authentication mock for testing OAuth flows without 3rd party services.',
    stars: 592,
    url: 'https://github.com/opendeck/local-auth',
    type: 'Node Package'
  }
];

export const MATERIALS = [
  {
    id: 'mat-ui-kit',
    title: 'Monochrome UI Kit (.fig)',
    description: 'The official OpenDeck Figma UI kit featuring all components, variants, and dark/light mode tokens.',
    size: '12.4 MB',
    type: 'Design',
    link: 'https://drive.google.com/mock-link-ui-kit'
  },
  {
    id: 'mat-architecture',
    title: 'System Architecture Diagrams',
    description: 'High-res exports of network topologies, database alignments, and distributed consensus models.',
    size: '4.2 MB',
    type: 'Diagrams',
    link: 'https://drive.google.com/mock-link-arch'
  },
  {
    id: 'mat-cheat-sheet',
    title: 'Docker & K8s Cheat Sheet',
    description: 'A printable PDF cheat sheet for common container orchestration commands and kubectl hacks.',
    size: '1.1 MB',
    type: 'PDF',
    link: 'https://drive.google.com/mock-link-cheatsheet'
  }
];

export const NOTES = [
  {
    id: 'note-docker-setup',
    title: 'Dockerizing the React Wrapper',
    description: 'A step-by-step guide on how to containerize the GenAI React Wrapper for production deployment.',
    content: `Step 1: Create a Dockerfile in your root directory.
Step 2: Use node:18-alpine as the base image to keep it lightweight.
Step 3: Copy package.json and run npm install.
Step 4: Copy the rest of the source code.
Step 5: Run npm run build.
Step 6: Use nginx:alpine to serve the static files from the dist directory.

Make sure to expose port 80 and set up the necessary environment variables for your GenAI API keys before starting the container.`,
    type: 'Guide'
  },
  {
    id: 'note-arch-decisions',
    title: 'Why we chose Hash Routing',
    description: 'An architectural decision record (ADR) explaining the use of hash routing over browser router.',
    content: `In the Developer Archive (now OpenDeck) architecture, we opted for Hash Routing (#/route) instead of the standard Browser History API.

Reasoning:
1. Static Hosting: The application is designed to be hosted anywhere without server-side rewrite rules.
2. Terminal Aesthetic: The hash symbol (#) naturally fits with the command-line interface theme we are portraying.
3. Resilience: It completely bypasses issues with refreshing deep links on misconfigured CDNs.`,
    type: 'Architecture'
  },
  {
    id: 'note-state-management',
    title: 'State Management Strategy',
    description: 'A deep dive into why we avoid global state stores for simple UI states in OpenDeck.',
    content: `State Management in OpenDeck is deliberately kept simple.

1. Local State First: We rely on React's useState for component-level toggles (modals, search).
2. Props Drilling: Since the component tree is shallow, prop drilling is preferred over introducing heavy libraries like Redux or Zustand.
3. Persistence: Bookmarks and theme settings are synced directly to localStorage for durability without complex hydration logic.`,
    type: 'Strategy'
  }
];

export const PROMPTS = [
  {
    id: 'prompt-code-review',
    title: 'Strict Code Reviewer',
    description: 'Instructs the AI to act as a senior staff engineer focusing on performance, security, and edge cases.',
    content: 'Act as a Senior Staff Software Engineer. Review the following code snippet for performance bottlenecks, security vulnerabilities, and edge cases. Do not focus on minor style issues unless they violate standard conventions. Provide a severity level (Low, Medium, High) for each issue found.',
    category: 'Engineering'
  },
  {
    id: 'prompt-refactor',
    title: 'Clean Architecture Refactor',
    description: 'Transforms messy spaghetti code into modular, SOLID-compliant architecture.',
    content: 'Refactor the following code to adhere strictly to SOLID principles. Separate concerns by extracting logic into pure functions, isolating side effects, and improving dependency injection. Provide a brief explanation of the architectural changes you made.',
    category: 'Architecture'
  },
  {
    id: 'prompt-test-gen',
    title: 'Comprehensive Test Generator',
    description: 'Generates edge-case heavy unit tests for a given function or module.',
    content: 'Write comprehensive unit tests for the following function using Jest. Include tests for the happy path, null/undefined inputs, boundary conditions, and expected exceptions. Ensure high branch coverage.',
    category: 'Testing'
  }
];
