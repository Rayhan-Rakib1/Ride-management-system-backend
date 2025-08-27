# 🚖 Ride Booking API

## ✨ Project Overview
A secure, scalable, and role-based backend API for a ride booking system inspired by **Uber** or **Pathao**. Built with **Express.js**, **MongoDB**, and **TypeScript**, this system supports multiple user roles (Rider, Driver, Admin, SuperAdmin) and manages the complete ride lifecycle, including authentication, OTP verification, payments, and ride history.

---

## 🔐 Authentication
- JWT-based authentication: Secure login with access and refresh tokens.  
- Google OAuth: Social login for seamless user onboarding.  
- OTP Verification: Two-factor authentication via email or SMS.  
- Role-based access control: Permissions for Rider, Driver, Admin, and SuperAdmin.  
- Secure password hashing using bcrypt.

---

## 👥 Roles & Permissions

### Rider
- Register and manage profile  
- Request, cancel, and view ride history  
- Make payments for rides  
- Rate drivers after ride completion  

### Driver
- Register and manage availability (online/offline)  
- Accept/reject ride requests  
- Update ride status (picked_up → in_transit → completed)  
- View ride history and earnings  
- Rate riders after ride completion  

### Admin / SuperAdmin
- View and manage all users, drivers, and rides  
- Approve or suspend drivers  
- Block/unblock user accounts  
- Access payment details  

---

## ✨ Features
- Full Ride Lifecycle: `requested → accepted → picked_up → in_transit → completed/cancelled`  
- Location-based data: Pickup and destination with latitude/longitude and addresses  
- Driver management: Approval status and availability toggling  
- Ratings: Optional rider and driver ratings post-ride  
- Payment integration: Initialize, validate, and handle payment success/failure/cancellation  
- OTP Verification: Secure user authentication with one-time passwords  
- Timestamps: Logged for ride status updates and history tracking  

---

## 📂 Tech Stack
- **Backend Framework:** Node.js + Express.js  
- **Database:** MongoDB + Mongoose  
- **Language:** TypeScript  
- **Authentication:** JWT, Passport (Google OAuth)  
- **Validation:** Zod  
- **Password Security:** bcrypt  
- **Deployment:** Vercel  

---

## 🚀 API Endpoints

### Live Link
[Backend Live](https://assainment-5-server.vercel.app)

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|---------|-------------|--------|
| POST | /api/auth/login | Login with credentials | Public |
| POST | /api/auth/refresh-token | Refresh JWT access token | Public |
| POST | /api/auth/logout | Logout a user | Authenticated |
| PATCH | /api/auth/reset-password | Reset user password | All Roles |
| GET | /api/auth/google | Start Google OAuth login | Public |
| GET | /api/auth/google/callback | Handle Google OAuth callback | Public |

### OTP Routes

| Method | Endpoint | Description | Access |
|--------|---------|-------------|--------|
| POST | /api/otp/send-otp | Send OTP for verification | Public |
| POST | /api/otp/verify-otp | Verify OTP | Public |

### Payment Routes

| Method | Endpoint | Description | Access |
|--------|---------|-------------|--------|
| POST | /api/payments/init-payment/:rideId | Initialize payment | Authenticated |
| POST | /api/payments/success | Handle successful payment | Authenticated |
| POST | /api/payments/fail | Handle failed payment | Authenticated |
| POST | /api/payments/cancel | Handle cancelled payment | Authenticated |
| POST | /api/payments/validate-payment | Validate payment status | Authenticated |
| GET | /api/payments/:paymentId | Get payment details by ID | Rider, Driver, SuperAdmin |

### User Routes

| Method | Endpoint | Description | Access |
|--------|---------|-------------|--------|
| POST | /api/users/register | Register new user | Public |
| GET | /api/users/all-users | Get all registered users | Admin, SuperAdmin |
| GET | /api/users/me | Get logged-in user profile | All Roles |
| PATCH | /api/users/user-status/:id | Block/unblock user | Admin, SuperAdmin |

### Ride Routes

| Method | Endpoint | Description | Access |
|--------|---------|-------------|--------|
| POST | /api/rides/create-ride | Create a new ride request | Rider |
| GET | /api/rides/all-rides | Get all rides | Admin, SuperAdmin |
| PATCH | /api/rides/cancel/:id | Cancel a ride | Rider |
| PATCH | /api/rides/status/:id | Update ride status | Driver |
| GET | /api/rides/:id | Get ride by ID | Rider, Driver, Admin, SuperAdmin |
| GET | /api/rides/me/history | Get ride history for logged-in rider | Rider |

### Driver Routes

| Method | Endpoint | Description | Access |
|--------|---------|-------------|--------|
| POST | /api/drivers/create-driver | Register a new driver | Authenticated |
| GET | /api/drivers/all-drivers | Get all drivers | Admin, SuperAdmin |
| GET | /api/drivers/:id | Get single driver profile | Driver, Admin, SuperAdmin |
| PATCH | /api/drivers/:id/approve | Approve/reject driver | Admin, SuperAdmin |
| PATCH | /api/drivers/:id/availability | Toggle driver availability | Driver |
| GET | /api/drivers/ride-history/driver | Driver ride history | Driver |
| GET | /api/drivers/earnings/driver | Driver earnings | Driver |
| PATCH | /api/drivers/rides/:rideId/accept | Accept ride request | Driver |
| PATCH | /api/drivers/rides/:rideId/status | Update ride status | Driver |
| DELETE | /api/drivers/me | Delete driver account | Driver |

### Rider Routes

| Method | Endpoint | Description | Access |
|--------|---------|-------------|--------|
| POST | /api/riders/create-rider | Register a new rider | Public |
| GET | /api/riders/all-riders | Get all riders | Admin, SuperAdmin |
| GET | /api/riders/me | Get logged-in rider profile | Rider |
| PUT | /api/riders/me | Update logged-in rider profile | Rider |
| GET | /api/riders/me/history | Get ride history | Rider |
| GET | /api/riders/:id | Get single rider profile | Rider, Admin, SuperAdmin |
| DELETE | /api/riders/me | Delete rider account | Rider |
| DELETE | /api/riders/:id | Delete rider account | Admin, SuperAdmin |

---

## 📚 Project Structure
src/
├── modules/
│ ├── auth/
│ │ ├── auth.controller.ts
│ │ ├── auth.routes.ts
│ ├── driver/
│ │ ├── driver.controller.ts
│ │ ├── driver.validation.ts
│ │ ├── driver.routes.ts
│ ├── otp/
│ │ ├── otp.controller.ts
│ │ ├── otp.routes.ts
│ ├── payment/
│ │ ├── payment.controller.ts
│ │ ├── payment.routes.ts
│ ├── ride/
│ │ ├── ride.controller.ts
│ │ ├── ride.validation.ts
│ │ ├── ride.routes.ts
│ │ ├── ride.interface.ts
│ │ ├── rideModel.ts
│ ├── rider/
│ │ ├── rider.controller.ts
│ │ ├── rider.validation.ts
│ │ ├── rider.routes.ts
│ │ ├── rider.interface.ts
│ │ ├── riderModel.ts
│ ├── user/
│ │ ├── user.controller.ts
│ │ ├── user.routes.ts
│ │ ├── user.interface.ts
├── middlewares/
│ ├── check.auth.ts
│ ├── validation.request.ts
├── utils/
│ ├── appError.ts
├── config/
├── app.ts

## ⭐ Author

**Rayhan Rakib**

---

## 🌟 License

This project is licensed under the MIT License.
