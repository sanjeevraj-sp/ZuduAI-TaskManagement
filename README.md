# ZuduAI Task Management RBAC Assessment

## 🚀 Core Features

- **Authentication** (Login / Register)
- **Role-Based Access Control (RBAC)**
  - **Admin**: CRUD own tasks + CRUD team tasks
  - **Manager**: CRUD own tasks + Read/Update team tasks they belong to
  - **User**: CRUD own tasks + Read tasks they belong to
- **Task CRUD Operations**
- **Form Validation** using Joi

---

## 🛠️ Tech Used

- **React.js** – Frontend framework
- **Redux Toolkit** – State management
- **Material UI** – UI components and theming
- **Mock Service Worker (MSW)** – For API mocking
- **IndexedDB (via Dexie.js)** – For storing users and tasks
- **Joi** – For form schema validation
- **React Helmet** - For SEO title and description.

---

## 📦 Installing and Running the Project

```bash
# 1. Clone the repository
git clone https://github.com/sanjeevraj-sp/ZuduAI-TaskManagement.git

# 2. Navigate to the project folder
cd ZuduAI-TaskManagement

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

---

## 👤 Default Users for Demo Purposes

You can use the following credentials to log in and explore different roles in the application.

All users, including Admins, Managers, and Users, have the **default password: `Password@123`**.

### Admin Accounts
- `admin@zudu.com`

### Manager Accounts
- `managerA@zudu.com`
- `managerB@zudu.com`

### User Accounts
- `userA@zudu.com`
- `userB@zudu.com`

These demo accounts are automatically initialized and stored in **IndexedDB** when the app starts.

> These accounts are auto-initialized in IndexedDB for demo purposes.

---
