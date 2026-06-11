# To-Do App — DevOps Pipeline (Azure CI/CD)

This project is a To-Do List application built with **Node.js**, **Express**, and **MongoDB (Cosmos DB)**. It features a fully automated **CI/CD pipeline** with multi-environment deployment (Staging & Production) using **GitHub Actions**.

---

## 🚀 CI/CD Pipeline Architecture

We use a unified pipeline defined in `.github/workflows/ci-cd.yml` that handles quality checks, testing, and deployment.

### Pipeline Flow:

1.  **Code Quality**: Automatic Linting & Formatting checks.
2.  **Automated Testing**: Unit tests (Jest) to ensure logic integrity.
3.  **Deployment**:
    - **Staging**: Triggered on push to `cd_role`.
    - **Production**: Triggered on push to `main`.

---

## 🛠️ Branching Strategy & Workflow

To maintain a stable production environment, follow this workflow:

### 1. Update Staging from Developer Branch

If changes are ready in `ci_role` (from other team members), merge them into your staging branch:

```powershell
# Switch to staging branch
git checkout cd_role
git fetch origin
git merge origin/ci_role

# after edit, run these tests
npm run lint
npx prettier --write .
npx cypress open

# Push to trigger Staging Deployment
git push origin cd_role
```

### 2. Promote Staging to Production

Once the Staging environment is verified and working perfectly:

```powershell
# Switch to production branch
git checkout main

# Synchronize main with cd_role perfectly
git reset --hard cd_role

# Push to trigger Production Deployment
git push origin main --force
```

---

## ⚙️ Azure Configuration (Environment Variables)

The application requires specific variables to be set in the **Azure Portal (Environment Variables)** for both Staging and Production App Services:

| Variable Name    | Description                                                     |
| :--------------- | :-------------------------------------------------------------- |
| `MONGODB_URL`    | Connection string to Azure Cosmos DB                            |
| `SESSION_SECRET` | A secret string for session security (can be any random string) |
| `PORT`           | Set to `8080` (App handles this automatically)                  |

---

## 🧪 Local Development

### Prerequisites

- Node.js (v22 or above)
- MongoDB / Cosmos DB instance

### Setup

1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Environment**: Create a `.env` file with `MONGODB_URL` and `SESSION_SECRET`.
3. **Run**:
   ```bash
   npm start
   ```

---

## 📈 Current Project Status

- [x] Unified CI/CD Pipeline (`ci-cd.yml`)
- [x] Azure Staging Site - **Live**
- [x] Azure Production Site - **Live**
- [x] Automated Quality Checks (Lint/Format)
- [x] Environment Variables configured in Azure
