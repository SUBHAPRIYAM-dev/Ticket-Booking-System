# 🎟️ Ticket Booking System for Events  

## Overview  
This project is a **full-stack ticket booking system** built with **React.js, Node.js, Express, MongoDB, Material UI, and Tailwind CSS**.  
It enables students or participants to register for event tickets securely and allows administrators to manage and verify entries using QR codes.  

---

## ✨ Features  
- Student/Participant Registration Form with  
  - Name, Roll Number, Branch, Email, Phone Number, Student ID Card Upload  
- Admin Dashboard  
  - View Ticket Applications  
  - Approve/Reject Applications  
- Email Notifications with QR Code upon Approval  
- QR Code Generation & Scanner for Entry Verification  
- Secure Admin Authentication (Login/Protected Dashboard)  
- Mobile-Responsive and Dynamic UI (Material UI + Tailwind CSS)  
- MongoDB for efficient and scalable data storage  

---

## 🛠️ Technologies Used  
**Frontend:**  
- React.js  
- Tailwind CSS  
- Material UI  
- React Router  
- React QR Scanner  

**Backend:**  
- Node.js  
- Express.js  
- MongoDB & Mongoose  
- Nodemailer for Emails  
- jsonwebtoken (JWT) for Authentication  
- qrcode package for QR Code Generation  

---

## 🚀 Setup Instructions  

### 1. Clone the Repository  
```bash
https://github.com/SUBHAPRIYAM-dev/Ticket-Booking-System.git
cd ticket-booking-system
```

### 2. Set up the Backend  
```bash
cd server
npm install
```
Create a `.env` file inside the `server` folder and add the following:
```
PORT=5000
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```
Then, start the backend server:  
```bash
npm start
```
or for development:
```bash
nodemon server.js
```

### 3. Set up the Frontend  
```bash
cd client
npm install
npm start
```

The frontend will run at `http://localhost:3000` and the backend will run at `http://localhost:5000`.

---



## 📬 Contact  
Feel free to connect with me:  
- GitHub: [your-github-username](https://github.com/SUBHAPRIYAM-dev)  
- LinkedIn: [your-linkedin-profile](https://www.linkedin.com/in/subhapriyam-dash-b77184230/)  

---

## 📢 Contribution  
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.  

---

## 📝 License  
This project is licensed under the [MIT License](LICENSE).  

---

# 🌟 Thank You for Visiting! 🌟
