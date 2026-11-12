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

Participating in hobbies can lead to improved mental health and overall well-being (Cleary et al., 2025).  They can also provide an opportunity to socialise and develop relationships with others (Cleary et al., 2025).  The problem is that finding information on hobbies is scattered across numerous sources including Facebook groups, reddit forums, hobby-specific websites and local community groups.  The Hobby Sharing Community application will be a dedicated platform for sharing projects and advice on hobbies, for both hobby enthusiasts and novices alike.  By centralising these scattered resources into a single, structured environment, the application solves the difficulty of discovering reliable hobby guidance and connecting with like-minded peers.  

Built by Lucy Keeling (n8102571) for IFQ636 at QUTOnline, extending the starter project provided: (https://github.com/nahaQUT/sampleapp_IFQ636).

## 🚀 Usage

| Page | Route | Who |
|---|---|---|
| Home / feed | `/` | Logged-in users |
| Register / Login | `/register`, `/login` | Everyone |
| Create / edit post | `/createpost`, `/post/:id/edit` | Logged-in users |
| Dashboard | `/dashboard` | Logged-in users |
| Search | `/search` | Logged-in users |
| Moderate posts | `/moderate` | Admins |
| Edit Categories | `/settings` | Admins |

**Admin account log in details for demo:**
* **Email:** admin@qut.edu.au
* **Password:** admin

## 📦 Installation

**Requirements:** Node.js, npm, and a MongoDB database (local or Atlas).

```bash
git clone https://github.com/lucykeeling/hobby-sharing-community.git
cd hobby-sharing-community
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

Project layout:

```
backend/    Express API (routes, controllers, models, middleware)
frontend/   React app (pages, components, context)
```

API overview:

- `/api/auth`: `POST /register`, `POST /login`, `GET/PUT /profile`
- `/api/posts`: `POST /create`, `GET /all`, `GET /search`, `GET/PUT/DELETE /:id`, `PUT /:id/moderate`
- `/api/categories`: `GET /`, and admin-only `POST`, `PUT /:id`, `DELETE /:id`

## 🔗 Links:

- Jira link: https://lucykeeling.atlassian.net/jira/software/projects/HSC/summary
- Live Deployment: 

## 📚 Acknowledgements & References:

 - Cleary, M., Le Lagadec, D., Thapa, D. K., & Kornhaber, R. (2025). Exploring the impact of hobbies on mental health and well-being: a scoping review. Issues in Mental Health Nursing, 46(8), 804-814.

* **MERN Stack Guidance:** This project was developed with structural guidance and implementation concepts adapted from the Class Central YouTube MERN Stack tutorial ([Class Central Course / YouTube Tutorial](https://www.classcentral.com/classroom/youtube-complete-mern-stack-project-react-node-js-express-js-mongodb-context-api-jwt-blog-app-tutorial-276907/659e1a805444c)).
