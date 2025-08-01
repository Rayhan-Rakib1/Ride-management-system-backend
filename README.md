# Ride Booking API

## ✨ Project Overview

A secure, scalable, and role-based backend API for a ride booking system similar to Uber or Pathao. Built with **Express.js** and **Mongoose**, this system supports multiple user roles and implements complete ride lifecycle management.

---

## 🔐 Authentication

* JWT-based login system
* Role-based access control: `admin`, `rider`, `driver`
* Secure password hashing using **bcrypt**

---

## 👥 Roles & Permissions

### Rider

* Request a ride (with pickup & destination)
* Cancel a ride (before acceptance)
* View ride history

### Driver

* Accept/reject ride requests
* Update ride status: `Picked Up → In Transit → Completed`
* View earnings and completed rides
* Set availability: `Online/Offline`

### Admin

* View all users, drivers, and rides
* Approve/suspend drivers
* Block/unblock user accounts

---

## ✨ Features

* Full ride lifecycle: requested → accepted → picked\_up → in\_transit → completed/cancelled
* Location-based data: lat/lng with address
* Driver availability & approval status
* Rider & driver ratings (optional)
* Timestamps logged for all ride status updates

---

## 📂 Tech Stack

* **Node.js** + **Express.js**
* **MongoDB** + **Mongoose**
* **JWT** for auth
* **Zod** for request validation
* **TypeScript**

---

## 🚀 API Endpoints

### 🧑‍💼 **Authentication Routes**

| Method | Endpoint                    | Description                  | Access        |
| ------ | --------------------------- | ---------------------------- | ------------- |
| POST   | `/api/auth/login`           | Login user with credentials  | Public        |
| POST   | `/api/auth/refresh-token`   | Refresh JWT access token     | Public        |
| POST   | `/api/auth/logout`          | Logout a user                | Authenticated |
| POST   | `/api/auth/reset-password`  | Reset password               | All Roles     |
| GET    | `/api/auth/google`          | Start Google OAuth login     | Public        |
| GET    | `/api/auth/google/callback` | Handle Google OAuth callback | Public        |

---

### 👤 **User Routes**

| Method | Endpoint                     | Description              | Access    |
| ------ | ---------------------------- | ------------------------ | --------- |
| POST   | `/api/users/register`        | Register a new user      | Public    |
| GET    | `/api/users/all-users`       | Get all registered users | Admin     |
| PATCH  | `/api/users/:id`             | Update user info         | All Roles |
| PATCH  | `/api/users/user-status/:id` | Block/unblock user       | Admin     |

---

### 🚘 **Ride Routes**

| Method | Endpoint                 | Description                              | Access    |
| ------ | ------------------------ | ---------------------------------------- | --------- |
| POST   | `/api/rides/create-ride` | Create a new ride request                | Rider     |
| GET    | `/api/rides/All-rides`   | Get all rides in the system              | Admin     |
| PATCH  | `/api/rides/cancel/:id`  | Cancel a ride request                    | Rider     |
| PATCH  | `/api/rides/status/:id`  | Update the status of a ride              | Driver    |
| GET    | `/api/rides/:id`         | Get details of a ride by ID              | All Roles |
| GET    | `/api/rides/me/history`  | Get ride history for the logged-in rider | Rider     |

---

### 🚖 **Driver Routes**

| Method | Endpoint                            | Description                                         | Access        |
| ------ | ----------------------------------- | --------------------------------------------------- | ------------- |
| POST   | `/api/drivers/create-driver`        | Register a driver (only if not already registered)  | Authenticated |
| GET    | `/api/drivers/all-drivers`          | Get all drivers in the system                       | Admin         |
| GET    | `/api/drivers/:id`                  | Get a single driver profile                         | Driver, Admin |
| PATCH  | `/api/drivers/:id/approve`          | Update driver approval status                       | Admin         |
| PATCH  | `/api/drivers/:id/availability`     | Update driver's availability (online/offline)       | Driver        |
| GET    | `/api/drivers/:id/ride-history`     | Get all rides for a specific driver                 | Driver        |
| GET    | `/api/drivers/earnings/:id`         | Get total earnings for a driver                     | Driver        |
| PATCH  | `/api/drivers/rides/:rideId/accept` | Accept a ride request                               | Driver        |
| PATCH  | `/api/drivers/rides/:rideId/status` | Update the ride status (e.g. picked\_up, completed) | Driver        |



## 📚 Project Structure

```bash
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── driver/
│   ├── ride/
├── middlewares/
├── config/
├── utils/
├── app.ts
```





## 🎬 Demo Video Breakdown (5–10 mins)

* Project overview (30s)
* Folder structure walkthrough (1 min)
* Auth demo: register, login, JWT (1 min)
* Rider flow: request, cancel, view (1 min)
* Driver flow: accept, complete, earnings (1 min)
* Admin features: approve, block, all rides (1 min)
* Postman run through (3–4 min)
* Wrap up & README overview (30s)

---

## ⭐ Author

**Rayhan Rakib**

---

## 🌟 License

This project is licensed under the MIT License.
