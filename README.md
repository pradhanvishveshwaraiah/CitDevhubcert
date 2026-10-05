# CITDEVHUB Certificate Management Portal

**Institution:** Cauvery Institute of Technology, Mandya  
**Department:** Department of Computer Applications (MCA)  
**Student Club:** CITDEVHUB ("Learn & Code & Share")  
**Club Lead:** Pradhan V  

---

## 🚀 Overview

The **CITDEVHUB Certificate Management Portal** is a production-grade, centralized certificate distribution, template customization, and digital verification platform. It allows college event organizers to create workshops, manage approved attendee rosters, generate authentic certificates with dynamic QR verification, and allow participants to download print-ready A4 landscape PDF certificates.

### Key Capabilities
- **Official Dual Institutional Logos**:
  - **Left**: Student Club – CITDEVHUB (`<CIT> DevHub Learn & Code & Share`)
  - **Right**: Department of Computer Applications, CIT Mandya
- **Three-Signature Standardized Bottom Layout**:
  - **Signature 1 (Left)**: Dr Srikantappa A S, Principal (Realistic transparent digital signature stroke)
  - **Signature 2 (Center)**: Prof. Amos R, HOD (Realistic transparent digital signature stroke)
  - **Signature 3 (Right)**: Pradhan V, Club Lead (Clean blank signature line for manual signing as requested, with official printed designation)
- **Dual Participant Eligibility Modes**:
  1. *Open Self-Service Mode*: Participants enter their names to generate participation certificates.
  2. *Approved Attendee Mode*: Participants must enter their unique Registration Code (e.g., `CIT-AI-101`) to claim their credential.
- **Cryptographic Certificate Verification**:
  - Each certificate receives an unpredictable unique identifier: `CITDH-YYYY-XXXXXXXX` (e.g. `CITDH-2026-7F82A9C1`).
  - Public verification page checks validity, issuer, timestamp, and real-time revocation status.
  - Verification QR code embedded directly into the certificate canvas and exported PDF.
- **Executive Admin Dashboard**:
  - Workshop creation & lifecycle (Draft, Published, Unpublished, Archived).
  - Certificate Template Library for reusable collegiate branding.
  - Attendee roster management with manual addition and batch CSV upload (sample template included).
  - Real-time revocation system with audit logging.
  - Event QR Code modal with downloadable PNG and one-click printable A4 poster layout.

---

## 🛠 Tech Stack
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4
- **PDF Generation**: `jspdf` (300 DPI A4 Landscape format)
- **QR Code Engine**: `qrcode`
- **Security & Storage**: Cloud Firestore & Firebase Storage rules (`firestore.rules`, `storage.rules`, `firebase.json`) with local persistence synchronization for zero-latency instant offline capability.

---

## 💻 Local Development & Deployment

### 1. Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Admin Credentials
Click **"Admin Portal"** in the top navigation bar:
- **Email**: `admin@citdevhub.edu` (or `pradhanv2409@gmail.com`)
- **Password**: `citdevhub2026`
- *Alternatively, click the **"1-Click Quick Demo Sign In"** button on the login modal.*

### 3. Production Build & Firebase Hosting
```bash
npm run build
firebase deploy
```

---

## 🎓 Signatories & Administration
- **Principal**: Dr Srikantappa A S
- **Head of the Department (HOD)**: Prof. Amos R
- **Club Lead & Software Lead**: Pradhan V
