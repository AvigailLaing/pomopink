<div align="center">

# 💌 pomopink | daily task tracker

### A dreamy, cozy, and high-performance productivity space designed for mindful focus.

![Version](https://img.shields.io/badge/version-1.0.0-ffb6c1?style=for-the-badge)
![React 19](https://img.shields.io/badge/React-19-pink?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-f592ad?style=for-the-badge&logo=tailwind-css)
![AI Gemini Flash](https://img.shields.io/badge/AI-Gemini%20Flash-ff69b4?style=for-the-badge&logo=google-gemini)

<br>

**pomopink** is more than just a timer. It’s a digital sanctuary for your productivity. Featuring a soft baby-pink aura heart background, crystalline sound effects, and intelligent AI-powered motivation, it turns deep focus into a magical experience.

</div>

![Home Page](./assets/homepage.png)

## ✨ Key Features

### 🕒 Aesthetic Pomodoro Timer
* **Three Modes:** Seamlessly switch between **Work** (25m), **Short Break** (5m), and **Long Break** (15m).
* **Visual Progress:** A custom SVG circular progress ring that tracks your focus time with smooth animations.
* **Smart Transitions:** Automatically handles mode switching and notifies you with gentle, crystalline chimes.

### ✅ Power Checklist & Subtasks
* **Task Hierarchy:** Break down big goals into manageable subtasks.
* **Progress Tracking:** Real-time progress bar that changes from pink to emerald once you reach 100%.
* **Celebration Engine:** A custom physics-based confetti burst greets you when you clear your daily list.

### 🪄 AI Motivational Cheers
* **Gemini-Powered:** Uses Google’s **Gemini 3 Flash** to generate short, sweet, and unique cheers based on your remaining task count.
* **Smart Cooldowns:** Built-in rate limiting and cooldown logic to ensure the AI remains a special treat, not a distraction.

### 📝 Cozy Notes Section
* **Thought Dump:** A dedicated space for reflections, reminders, or scribbles.
* **Autosave:** Everything you write is saved instantly to local storage—your heart’s work is never lost.

### 📊 Daily Summary Dashboard
* **PDF Export:** Generate a professional, high-resolution daily summary of your stats, completed goals, and notes.
* **Daily Stats:** Tracks focused minutes, pomodoros completed, and "goals smashed" throughout the day.
![Daily Summary Dashboard](./assets/summary%20dashboard%20pomopink.png)

---

## 🎨 Design Philosophy

* **The Aura Heart:** A multi-layered radial gradient background that creates a "breathing" baby-pink aura effect using CSS animations.
* **Soundscape:** Custom crystalline "pings" and "pops" built using the Web Audio API (no heavy audio files to load).
* **Glassmorphism:** Soft white overlays with heavy backdrop blurs to keep the UI light and dreamy.

---

## 🛠️ Tech Stack

* **Frontend:** React 19 + TypeScript
* **Styling:** Tailwind CSS (Custom extended pink palette)
* **Icons:** Lucide React
* **AI Integration:** Google `@google/genai` (Gemini 3 Flash)
* **PDF Engine:** html2canvas & jsPDF
* **State:** LocalStorage for persistence (offline-first design)

---

## 🚀 Getting Started

### Prerequisites
* A Google Gemini API Key (get one at [ai.google.dev](https://ai.google.dev))

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/pomopink.git](https://github.com/yourusername/pomopink.git)
   cd pomopink
