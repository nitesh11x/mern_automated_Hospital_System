# 🏥 Automated Hospital Management System

Follow these steps to get the project running on your local machine.

### 1. Backend Setup (API)
The backend handles the logic for the 10-slot hourly limit and appointment persistence.

1.  **Navigate to the API directory:**
    ```bash
    cd api
    ```
2.  **Install dependencies:**
    ```bash
    npm ci
    ```
3.  **Environment Variables:**
    Create a `.env` file in the folder and add your secret keys:
    ```env
    PORT=
    MONGO_URI=
    JWT_SECRET=your_secret_key=
    ....
    ....
    ....
    ....
    ....
    ```
4.  **Run the server:**
    ```bash
    node file.js
    ```

---

### 3. Frontend Setup (admin)
1.  **Navigate to the client directory:**
    ```bash
    cd admin
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    Update your local `.env` values to point to the backend:
    ```env
    VITE_API_URL=
    ```
4.  **Launch the development server:**
    ```bash
    npm run dev
    ```
---
### 2. Frontend Setup (Client)
1.  **Navigate to the client directory:**
    ```bash
    cd client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    Update your local `.env` values to point to the backend:
    ```env
    VITE_API_URL=
    ```
4.  **Launch the development server:**
    ```bash
    npm run dev
    ```
---

## 🛠️ Tech Stack
* **MongoDB:** Database for appointments and doctor profiles.
* **Express.js:** Backend framework.
* **React.js:** Frontend library.
* **Node.js:** Runtime environment.

backend port = 1111
client port = 1112
admin port = 1113

production = main branch
devlopment = devlopment branch