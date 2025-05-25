# 📭 Gmail Unsubscribe Manager

A full-stack web app that connects to your Gmail inbox, finds all subscription emails with unsubscribe links, and lets you easily unsubscribe with one click.

---

## 🚀 Features

- 🔐 Google OAuth login
- 📬 Gmail API integration
- 🔗 Detects unsubscribe links from emails
- ✅ Lets users unsubscribe from newsletters with one click
- 💾 Tracks unsubscribed status in a PostgreSQL database
- 🌐 Deployed frontend + backend (Vercel + Railway/Render)

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- OAuth via `@react-oauth/google`

### Backend
- Express.js
- Node.js
- Gmail API via `googleapis`

### Database
- PostgreSQL
- SQL schema includes `users` and `subscriptions` tables

---

## 🧠 How It Works

1. **User logs in** with their Google account via OAuth.
2. App uses Gmail API to fetch recent emails.
3. Filters emails with `List-Unsubscribe` headers or links.
4. Displays them in a dashboard.
5. User clicks “Unsubscribe” → app opens the unsubscribe link and marks it as unsubscribed in the DB.

---

🧑‍💻 Authors
Galileo Kim & Austin Bao


