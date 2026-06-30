# Mini HCM - Client (Frontend)

This is the frontend client for the Mini Human Capital Management (HCM) system. It provides a clean, modern interface for employees to log their daily attendance and for administrators to monitor reports and manage punches.

## 🚀 Features

### For Employees
- **Secure Login & Registration**: Powered by Firebase Authentication.
- **Attendance Dashboard**: Simple "Punch In" and "Punch Out" buttons.
- **Real-Time KPI Cards**: View total regular hours, overtime, late minutes, and undertime at a glance.
- **History Table**: A chronological breakdown of all past attendance records.

### For Administrators
- **Employee Punches Management**: View, track, and manually edit raw employee punches via a secure dialog interface.
- **Daily Reports**: Aggregated view of all employee metrics for the current day.
- **Weekly Reports**: Filter by date range to generate weekly summaries including regular hours, overtime (OT), night differential (ND), lateness, and undertime.

## 🛠️ Tech Stack

- **React 18**
- **Vite** (Build Tool)
- **Chakra UI v3** (Component Library)
- **TypeScript**
- **Axios** (API Requests)
- **Firebase** (Auth SDK)

## ⚙️ Setup & Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root of the `client` directory and populate it with your Firebase configuration and API URL:
   ```env
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   VITE_API_URL="http://localhost:3000" # Or your production Render URL
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 💡 Notes
- The client automatically pings the backend server (`/ping`) every 2 minutes while active to prevent the backend from sleeping on free hosting tiers (e.g., Render).
