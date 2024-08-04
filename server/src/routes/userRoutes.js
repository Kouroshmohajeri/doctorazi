// Routing for user authentication 
import express from 'express';
import UserController  from '../controllers/userController.js';

const router = express.Router();
const userController = new UserController();

// Endpoint for Registering 
router.post("/register",userController.register);

// Endpoint for Loging in
router.post("/login",userController.login);

// Endpoint for Logging out
router.post("/logout", userController.logout);

// Endpoint for Forgot password
router.post("/forgotPassword", userController.forgotPassword);

// Endpoint for resetting password
router.put("/resetPassword", userController.resetPassword);

// Endpoint for getting all users
router.get("/allUsers", userController.getAllUsers);

// Endpoint for deleting a user
router.delete("/delete/:id", userController.deleteUser);

// Endpoint for getting a user by ID
router.post("/getUserById/:id", userController.getUserById);

// Endpoint for getting a user by username
router.post("/getUserByUsername/:username", userController.getUserByUserName);

// Endpoint for updating a user
router.put("/update/:id", userController.updateUser);

// User First Name and Last Name
router.post("/getFoldersByUserIds", userController.getFoldersByUserIds);

// Route to get user's full name by ID
router.get('/fullname/:userId', userController.getFullNameById);

// Add a route for changing password
router.put('/changePassword/:id', userController.changePassword);

// Endpoint for getting the count of doctors for a user
router.get("/doctorCount/:id", userController.getDoctorCount);

export default router;