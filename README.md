# 🎲 Lucky 7 Scratch Card (Vibecoding Project)

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?logo=tailwind-css&logoColor=white)

This project was built entirely using an AI agent (Roo / Gemini) in a **vibecoding** style. It is a simple, browser-based scratch card game ("Lucky 7") with custom HTML5 Canvas interactions and specific probability logic.

## 📌 Features
- 💰 **Wallet System**: Start with 10 PLN, each card costs 2 PLN.
- 🎨 **HTML5 Canvas**: Realistic scratch card effect with a 60% reveal threshold.
- 🌍 **I18n**: Built-in bilingual support (English & Polish).
- 🎉 **Confetti**: Special effects for big wins (>= 100 PLN).
- 💅 **Styling**: Tailored with Tailwind CSS v4 and Lucide-React icons.

## 🚀 Quick Start

### Preconditions
- **Node.js**: `^20.0.0` or higher recommended.
- **npm**: `^10.0.0` or higher.

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🧪 Testing (E2E)
This project uses **Playwright** for end-to-end testing, covering the core scratch mechanic and winning logic.

```bash
# Install Playwright browsers (first time only)
npx playwright install --with-deps

# Run tests
npx playwright test

# Show test report (HTML)
npx playwright show-report
```

## 📝 To-Do List
- [x] Setup Vite + React + TypeScript + Tailwind CSS v4
- [x] Implement Game Logic & Probabilities
- [x] Create Scratch Card Canvas Component
- [x] Implement I18n Context
- [x] Add E2E tests (Playwright)
- [x] Setup CI/CD Pipeline (GitHub Actions)

---
*Built with ❤️ via AI Vibecoding.*