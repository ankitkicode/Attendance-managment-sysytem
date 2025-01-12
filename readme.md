# Attendance Management System

## Description
The **Attendance Management System** is a MERN (MongoDB, Express.js, React.js, Node.js) based web application designed to streamline attendance tracking for organizations. It features role-based access control (User  and Admin), secure authentication, geolocation-based check-in/check-out, and customizable attendance radius settings. Admins can manage users, view attendance reports, and perform advanced operations.

## Key Features
- **Role-Based Access Control**:
  - **User  Role**: Check-in/check-out using geolocation, view personal attendance history.
  - **Admin Role**: Add/edit/delete users, view attendance reports, set attendance radius, and manage system settings.
- **Secure Authentication**: JWT-based authentication for secure user login and role management.
- **Geolocation-Based Attendance**: Users can check-in/check-out only within a predefined radius of their workplace.
- **Customizable Attendance Radius**: Admins can set and modify the allowed radius for attendance.
- **Attendance Reports**: Admins can view and export detailed attendance reports for all users.
- **MERN Stack**: Built using MongoDB, Express.js, React.js, and Node.js for a scalable and modern web application.

## Installation
Follow these steps to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/attendance-management-system.git
## Navigate to the project directory:
<!-- ```
Insert Code
Run
Copy code
cd attendance-management-system
Install backend dependencies:
bash
Insert Code
Run
Copy code
cd backend
npm install
Install frontend dependencies:
bash
Insert Code
Run
Copy code
cd ../frontend
npm install
Set up environment variables:
Create a .env file in the backend directory and add the following:
env
Insert Code
Run
Copy code
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Run the backend server:
bash
Insert Code
Run
Copy code
cd ../backend
npm start
Run the frontend development server:
bash
Insert Code
Run
Copy code
cd ../frontend
npm start
Usage
User Role:
Log in to the system.
Use the check-in/check-out feature within the allowed radius.
View personal attendance history.
Admin Role:
Log in as an admin.
Manage users (add, edit, delete).
Set and modify attendance radius.
View and export attendance reports.
Contributing
Contributions are welcome! Follow these steps to contribute:

Fork the repository.
Create a new branch:
bash
Insert Code
Run
Copy code
git checkout -b feature/your-feature-name
Commit your changes:
bash
Insert Code
Run
Copy code
git commit -m "Add your feature"
Push to the branch:
bash
Insert Code
Run
Copy code
git push origin feature/your-feature-name
Open a pull request.
License
This project is licensed under the MIT License.

Contact
For questions, feedback, or collaboration, feel free to reach out:

Your Name
Email: your.email@example.com
GitHub: your-username -->