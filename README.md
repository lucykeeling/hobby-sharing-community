# 📝 Hobby Sharing Community

A full-stack MERN app for a hobby sharing community application.  Users can write, browsing and search posts.  Posts are moderated by admin to ensure they meet community standards.

## ✨ Highlights

- **Accounts**: register, log in and edit your profile
- **Posts**: create, edit, delete and view your own posts from a dashboard
- **Categories**: browse posts by category, categories are managed by admins
- **Search**: find posts quickly by searching title or category
- **Admin moderation**: admins review pending posts before they are published to maintain strict community guidelines

## 📖 Overview

The Hobby sharing community is a blogging type platform built with React, Node.js/Express and MongoDB.
Registered users can write and manage their own posts, as well as browse and search posts by title or category. 
Admins moderate submissions and manage categories.

Built by Lucy Keeling (n8102571) for IFQ636 at QUTOnline, extending the starter project provided: (https://github.com/nahaQUT/sampleapp_IFQ636).

## 🚀 Usage

![Home page](docs/screenshots/home.png)
![Admin moderation](docs/screenshots/moderate.png)

| Page | Route | Who |
|---|---|---|
| Home / feed | `/` | Logged-in users |
| Register / Login | `/register`, `/login` | Everyone |
| Create / edit post | `/createpost`, `/post/:id/edit` | Logged-in users |
| Dashboard | `/dashboard` | Logged-in users |
| Search | `/search` | Logged-in users |
| Moderate posts | `/moderate` | Admins |

Admin account log in details for demo:
Email: admin@qut.edu.au
Password: admin

## 📦 Installation

**Requirements:** Node.js, npm, and a MongoDB database (local or Atlas).

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm run install-all
```

Create `backend/.env`:

```env
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<a long random string>
PORT=5001
```

Run backend and frontend together:

```bash
npm run dev
```

The frontend runs at http://localhost:3000 and the API at http://localhost:5001.

## 🛠️ Development

```bash
npm test --prefix backend   # run backend tests (mocha)
```

Project layout:

```
backend/    Express API (routes, controllers, models, middleware)
frontend/   React app (pages, components, context)
```

API overview:

- `/api/auth`: `POST /register`, `POST /login`, `GET/PUT /profile`
- `/api/posts`: `POST /create`, `GET /all`, `GET /search`, `GET/PUT/DELETE /:id`, `PUT /:id/moderate`
- `/api/categories`: `GET /`, and admin-only `POST`, `PUT /:id`, `DELETE /:id`

## 📚 Links:

- Jira link: https://lucykeeling.atlassian.net/jira/software/projects/HSC/summary
- Live Deployment: 
