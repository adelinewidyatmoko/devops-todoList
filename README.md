# To-Do App — DevOps Pipeline

> Week 3: Initial Prototype & Documentation

---

## Project Overview

This project is a To-Do List application built with **JavaScript / Node.js**, set up with a full **DevOps pipeline** using **GitHub Actions** for CI/CD and **Azure** for deployment.

The goal of Week 3 is to prototype the pipeline end-to-end — meaning every time a team member pushes code to GitHub, the pipeline automatically installs dependencies, builds the app, runs tests, and deploys the latest version to Azure.

---

## Team Members & Responsibilities

| Member   | Role              | Responsibility                             |
| -------- | ----------------- | ------------------------------------------ |
| Member 1 | DevOps / CI Setup | GitHub repo setup, GitHub Actions workflow |
| Member 2 | Build & Test      | Build step, automated tests with Jest      |
| Member 3 | Deployment        | Azure deployment configuration             |
| Member 4 | Documentation     | README, setup guide, screenshots           |

---

## Tech Stack

| Tool           | Purpose             |
| -------------- | ------------------- |
| Node.js        | Application runtime |
| JavaScript     | App language        |
| Jest           | Automated testing   |
| GitHub Actions | CI/CD pipeline      |
| Azure          | Cloud deployment    |

---

## Project Structure

```
todo-app/
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions pipeline
├── src/
│   └── todo.js             # Core To-Do logic (add, complete, delete)
├── tests/
│   └── todo.test.js        # Automated tests
├── package.json            # Project config & scripts
└── README.md               # This file
```

---

## How to Run Locally

### Prerequisites

Make sure you have these installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or above)
- [Git](https://git-scm.com/)

### Steps

**1. Clone the repository**

```bash
git clone https://github.com/your-team/todo-app.git
cd todo-app
```

**2. Install dependencies**

```bash
npm install
```

**3. Run the app**

```bash
npm start
```

**4. Run the tests**

```bash
npm test
```

You should see all 3 tests pass in the terminal:

```
✓ adds a new todo item
✓ marks a todo as complete
✓ removes a todo item

Tests: 3 passed, 3 total
```

---

## CI/CD Pipeline (GitHub Actions)

Every time code is pushed to the `main` branch, the pipeline runs automatically.

### Pipeline Steps

```
Push to GitHub
     ↓
Install dependencies  (npm install)
     ↓
Build the app         (npm run build)
     ↓
Run tests             (npm test)
     ↓
Deploy to Azure       (if all tests pass)
```

### Workflow File Location

`.github/workflows/ci.yml`

### How to check pipeline status

1. Go to your GitHub repository
2. Click the **Actions** tab
3. You will see each run — green ✅ means all steps passed, red ❌ means something failed

---

## ☁️ Deployment (Azure)

The app is deployed to **Microsoft Azure**. Every successful pipeline run automatically pushes the latest version live.

### Deployment Details

- **Platform:** Microsoft Azure
- **Trigger:** Automatic on push to `main` branch (only if tests pass)
- **Live URL:** _(add your Azure app URL here once deployed)_

---

## 🧪 Test Coverage

Tests are written using **Jest** and cover the 3 core functions of the To-Do app:

| Test                       | What it checks                           |
| -------------------------- | ---------------------------------------- |
| `adds a new todo item`     | Adding a task works and saves correctly  |
| `marks a todo as complete` | Completing a task updates its status     |
| `removes a todo item`      | Deleting a task removes it from the list |

---

## Current Status (Week 3)

- [x] GitHub repository created
- [x] GitHub Actions workflow configured
- [x] Build step added to pipeline
- [x] Automated tests written and passing
- [x] Azure deployment configured
- [x] Documentation written

---

CI to CD
# 1. Pindah ke branch cd_role
git checkout cd_role

# 2. Ambil update terbaru dari server (termasuk ci_role temenmu)
git fetch origin

# 3. Merge isi ci_role ke cd_role kamu
git merge origin/ci_role

Staging Deployment
# Push ke github (ini akan manggil auto-deploy staging)
git push origin cd_role

Production Deployment
# 1. Pindah ke branch main
git checkout main

# 2. Ambil update terbaru dari server
git fetch origin

# 3. Merge isi cd_role ke main
git merge origin/cd_role

# 4. Push ke github (ini akan manggil auto-deploy production)
git push origin main
