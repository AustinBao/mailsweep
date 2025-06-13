# Gmail Unsubscriber App 📬❌

A full-stack web app that connects to your Gmail inbox, scans for email subscriptions, and helps you **unsubscribe** or **delete** emails in bulk.

---

## 🔧 Features

- ✅ Google OAuth2 login with Passport.js
- 📬 Scans your Gmail inbox progressively using the Gmail API
- 🧠 Saves sender info, unsubscribe links, and counts of emails per sender
- 📉 Tracks email counts per sender and shows a progress bar during scanning
- ✂️ Allows one-click unsubscribe (updates DB only)
- 🗑️ Allows deleting all emails from a sender (via Gmail batchDelete API)
- 🔁 Remembers your last scan and resumes from where you left off
- 📸 Shows favicon of sender domains

---

## 🗂️ Tech Stack

| Frontend      | Backend        | Database   | APIs           |
|---------------|----------------|------------|----------------|
| React.js      | Express.js     | PostgreSQL (via Supabase) | Gmail API |
| Bootstrap     | Passport.js    | Supabase client            | Google OAuth2 |

---

## 🚀 Getting Started

### 1. Clone and Install
```bash
git clone https://github.com/your-username/gmail-unsubscriber.git
cd gmail-unsubscriber
npm install && cd client && npm install
