🚗 Ride Booking API
A secure, scalable, and role-based backend API for a ride booking system, built with Express.js and Mongoose. This API supports riders requesting rides, drivers accepting and managing rides, and admins overseeing the system, with JWT-based authentication and role-based authorization.

📖 Table of Contents

Project Overview
Features
Tech Stack
Setup Instructions
API Endpoints
Project Structure
Testing
Contributing
License


🌟 Project Overview
The Ride Booking API powers a ride-sharing platform similar to Uber or Pathao. It provides a robust backend for managing users, rides, and system operations, ensuring security, scalability, and modularity. The system supports three roles:

Riders: Request rides, cancel rides, and view ride history.
Drivers: Accept/reject rides, update ride status, manage availability, and track earnings.
Admins: Manage users, approve/suspend drivers, and monitor system activity.


✨ Features

🔐 JWT-based Authentication: Secure login with role-based access control.
🔒 Role-Based Authorization: Protected routes for riders, drivers, and admins.
🧍 Rider Functionality:
Request rides with pickup and destination coordinates.
Cancel rides before driver acceptance.
View complete ride history.


🚘 Driver Functionality:
Accept or reject ride requests.
Update ride status (Picked Up → In Transit → Completed).
Set availability (Online/Offline).
View earnings history.


🛠 Admin Functionality:
View all users, drivers, and rides.
Approve or suspend drivers.
Block/unblock user accounts.


📜 Ride Management:
Full ride lifecycle with status tracking.
Geospatial storage for locations using MongoDB 2dsphere index.
Complete ride history stored persistently.


🧱 Modular Architecture: Clean, organized code with separation of concerns.


🛠 Tech Stack

Node.js with Express.js: Backend framework for API development.
MongoDB with Mongoose: Database for storing users, rides, and history.
JWT: Token-based authentication.
Bcrypt: Secure password hashing.
TypeScript: Type safety and improved developer experience.
Postman: API testing and documentation.


⚙️ Setup Instructions
Follow these steps to set up and run the project locally.
Prerequisites

Node.js (v16 or higher)
MongoDB (local or cloud instance)
Postman (for testing APIs)
Git (for cloning the repository)

Installation

Clone the repository:
git clone https://github.com/your-username/ride-booking-api.git
cd ride-booking-api


Install dependencies:
npm install


Set up environment variables:Create a .env file in the root directory with the following:
MONGO_URI=mongodb://localhost:27017/ride-booking
JWT_SECRET=your_jwt_secret_here
PORT=3000


Replace MONGO_URI with your MongoDB connection string.
Use a secure random string for JWT_SECRET.


Start the application:
npm start

For development with auto-restart:
npm run dev


Access the API:The server will run at http://localhost:3000. Use Postman to test endpoints.



🚀 API Endpoints
Below is a summary of the key API endpoints. All protected routes require an Authorization: Bearer <token> header.
🔑 Authentication



Method
Endpoint
Description
Access



POST
/api/auth/register
Register a new user
Public


POST
/api/auth/login
Login and receive JWT token
Public


Register Body Example:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "rider",
  "vehicleInfo": { "model": "Toyota Prius", "licensePlate": "ABC123" } // Optional, for drivers
}

👥 Users (Admin Only)



Method
Endpoint
Description
Access



GET
/api/users
Get all users
Admin


PATCH
/api/users/block/:id
Block a user account
Admin


🚘 Drivers



Method
Endpoint
Description
Access



PATCH
/api/drivers/approve/:id
Approve a driver
Admin


PATCH
/api/drivers/availability
Set driver availability
Driver


GET
/api/drivers/earnings
Get driver earnings history
Driver


Availability Body Example:
{
  "isAvailable": true
}

🛵 Rides



Method
Endpoint
Description
Access



POST
/api/rides/request
Request a new ride
Rider


PATCH
/api/rides/:id/accept
Accept a ride request
Driver


PATCH
/api/rides/:id/status
Update ride status
Driver


PATCH
/api/rides/:id/cancel
Cancel a ride
Rider


GET
/api/rides/history
Get ride history
Rider, Driver, Admin


Ride Request Body Example:
{
  "pickupLocation": { "coordinates": [-73.935242, 40.730610] },
  "destinationLocation": { "coordinates": [-73.935242, 40.740610] }
}

Update Status Body Example:
{
  "status": "picked_up" // or "in_transit", "completed"
}


📂 Project Structure
The project follows a modular, production-ready architecture:
src/
├── modules/
│   ├── auth/          # Authentication logic (register, login)
│   ├── user/          # User management (admin operations)
│   ├── driver/        # Driver-specific functionality
│   ├── ride/          # Ride management and lifecycle
├── middlewares/       # Authentication and error handling
├── config/            # Database and environment setup
├── utils/             # Helper functions and error classes
├── app.ts             # Express app configuration
├── server.ts          # Server entry point
├── README.md          # Project documentation
├── package.json       # Dependencies and scripts


🧪 Testing

Test with Postman:

Import the API collection (create one by testing endpoints).
Start with /api/auth/register and /api/auth/login to obtain a JWT.
Include the token in the Authorization header for protected routes.
Test rider, driver, and admin flows as outlined in the API Endpoints section.


Video Demonstration:A 5–10 minute screen-recorded video is recommended to showcase:

Project intro and core idea.
Folder structure walkthrough.
Authentication flow (register, login, JWT).
Rider features (request, cancel, history).
Driver features (accept, update status, earnings).
Admin features (approve drivers, block users).
Postman end-to-end testing.
Summary and README reference.




🤝 Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m 'Add your feature').
Push to the branch (git push origin feature/your-feature).
Open a Pull Request.

Please ensure your code follows the existing style and includes tests.

📜 License
This project is licensed under the MIT License. See the LICENSE file for details.

Developed with 🚀 by [Your Name]For questions or feedback, reach out at [your-email@example.com].gi