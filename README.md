# Fantasy IQ ⚽

**The fantasy football platform where your football knowledge earns your transfer budget.**

Fantasy IQ is a single-page web app that flips the usual fantasy football formula: instead of everyone starting with the same budget, you take a timed Soccer IQ quiz first — and how well you know the game determines how much you have to spend on your squad.

Built as an end-of-semester HTML/CSS/JavaScript project.

---

## 📸 Screenshots

| Home | IQ Quiz |
|---|---|
| ![Home page](screenshots/01-home.png) | ![Quiz intro](screenshots/02-quiz-intro.png) |

| Quiz in progress | Quiz result |
|---|---|
| ![Quiz active with timer](screenshots/03-quiz-active.png) | ![Quiz result screen](screenshots/04-quiz-result.png) |

| Squad Builder | AI Scout |
|---|---|
| ![Squad builder with pitch](screenshots/05-squad-builder.png) | ![Gaffer AI Scout chat](screenshots/06-ai-scout.png) |

---

## ✨ Features

- 🧠 **15-question IQ Quiz** — two attempts allowed, each with a completely different question set. Best score counts.
- ⏱️ **Strict timer** — 20 seconds per question. Run out of time and the attempt ends immediately; no partial credit for unanswered questions.
- 💰 **Score-based budget system** — your quiz result unlocks (or penalises) your transfer budget:

  | Score | Budget | Team Boost |
  |---|---|---|
  | Below 40% | £80M | 0.8× (penalty) |
  | 40–59% | £100M | 1.0× (standard) |
  | 60–79% | £115M | 1.1× (bonus) |
  | 80%+ | £130M | 1.3× (bonus) |

- ⚽ **Visual squad builder** — pick a full 4-4-3 squad on a rendered pitch, with a live budget tracker.
- 🌍 **30+ real players** from Europe's top leagues (Premier League, La Liga, Serie A, Bundesliga, Ligue 1, and more), filterable by league.
- 🎖️ **Captain & Vice Captain** — assign a captain (2× points) and vice captain (1.5× points) from your squad.
- 🪪 **Manager identity** — enter your name and club name, reflected live on your Manager Card.
- 🤖 **Gaffer AI Scout** — a fully offline, rule-based chatbot that gives captaincy advice, squad feedback, transfer tips, and the occasional roast. No API key required.
- 🔒 **One-way progression** — Squad and AI Scout tabs stay locked until the quiz is completed.
- 📱 **Responsive layout** — works down to small mobile screens.

---

##  Tech Stack

- **HTML5** — semantic structure across 4 pages (Home, Quiz, Squad, Scout)
- **CSS3** — custom properties, Flexbox/Grid, responsive breakpoints, animations, glassmorphism effects
- **Vanilla JavaScript (ES6+)** — no frameworks, no build step. All game logic, timers, and the AI Scout live here.
- **Google Fonts** — Bebas Neue, Barlow Condensed, Barlow

No dependencies to install. No backend. It's three files that run entirely in the browser.

---

##  Project Structure

```
fantasy-iq/
├── fantasy-iq.html    # Page structure & content
├── style.css          # All styling, layout, and animations
├── script.js          # Game logic: quiz, squad builder, AI scout
├── screenshots/        # App screenshots used in this README
└── README.md
```

---

##  Running It Locally

**Option 1 — Just open it**
Download all three files (`fantasy-iq.html`, `style.css`, `script.js`) into the same folder and double-click `fantasy-iq.html`. It runs entirely offline (background gradient works with zero setup — see note below).

**Option 2 — VS Code + Live Server (recommended for development)**
1. Clone or download this repo
2. Open the folder in VS Code
3. Install the **Live Server** extension
4. Right-click `fantasy-iq.html` → **Open with Live Server**
5. Changes to any file auto-refresh the browser

**Option 3 — GitHub Pages**
This repo is set up to be served directly via GitHub Pages — see [Deploying](#-deploying-with-github-pages) below.

---

##  About the Background

The background is a self-contained animated CSS gradient by default — no external files, nothing to configure, works fully offline. It won't win any cinematography awards, but it never breaks.

There's also optional support for a real YouTube video background if you'd like a more cinematic look. Open `script.js`, find `BACKGROUND_VIDEO_ID` near the bottom, and paste in a **video ID** (the part after `v=` in a normal `youtube.com/watch?v=...` URL) from a video *you've checked yourself* and confirmed allows embedding:

```js
const BACKGROUND_VIDEO_ID = 'yourVideoIdHere'; // leave blank to keep the animated background
```

Only use a single video ID here, not a playlist — playlist IDs aren't guaranteed to resolve to embeddable content, and a broken embed looks worse than no video at all.

---

##  Deploying with GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select the `main` branch and `/ (root)` folder
4. Save — your live link will appear as `https://<your-username>.github.io/<repo-name>/fantasy-iq.html`

---

##  How It Works

1. **Take the IQ Quiz** — answer all 15 questions on tactics, history and trivia. You get 2 attempts, each with a different set of questions.
2. **Unlock your budget** — your best score across both attempts sets your transfer budget and team boost.
3. **Build your squad** — pick a goalkeeper, 4 defenders, 4 midfielders and 3 forwards within your budget.
4. **Set your armband** — choose a Captain and Vice Captain for bonus points.
5. **Consult Gaffer** — head to the AI Scout for advice, banter, and tactical tips.

---

##  Credits

Built by **Mungai** as an end-of-semester HTML project, with player data and squad mechanics developed iteratively alongside a project partner.

##  License

Released under the [MIT License](LICENSE) — free to use, modify, and learn from.
