# HabitFlow

HabitFlow is a habit tracking app with an Express/MySQL backend and a React frontend.

## Project structure

- `backend/` - Express API, Sequelize models, MySQL connection, auth, habits, progress, dashboard, app settings, and AI coach routes.
- `frontend/` - React + Vite UI split into `api/`, `hooks/`, `components/`, and `pages/`.

## Dynamic UI settings

UI text is served from the database through:

```text
GET /api/settings
```

The backend stores this in the `appSettings` table under the `app_ui` key. It controls the app name, document titles, navigation labels, page headings, form labels, action labels, categories, and frequencies. The React app updates `document.title` from these settings for the active page.

## Setup

Create or update `.env` in the project root:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=habitflow_beta
JWT_SECRET=change_this_secret
```

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Run the app in two terminals:

```bash
npm run backend
npm run frontend
```

Backend API: `http://localhost:5000/api`
Frontend UI: `http://localhost:5173`
