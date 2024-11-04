import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repository/UserRepository.js";
import { sendEmail } from "../utils/sendEmail.js";
import { validationResult } from "express-validator";
import crypto from "crypto";
import cookie from "cookie";
import { encryptPayload } from "../utils/encryption.js";

class UserController {
  async register(req, res) {
    // Validate request data using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Retrieve data from request body
      const {
        first_name,
        last_name,
        username,
        phone_number,
        email,
        password,
        user_type,
      } = req.body;

      // Check if username exists
      const existingUsername = await UserRepository.findByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists!" });
      }

      // Check if the email already exists
      const existingEmail = await UserRepository.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = await UserRepository.createUser({
        first_name,
        last_name,
        phone_number,
        username,
        email,
        password: hashedPassword,
        user_type: 1,
      });
      // Generate JWT token for user's session
      const token = jwt.sign(
        {
          user_id: newUser.user_id,
          username: newUser.username,
          user_type: newUser.user_type,
          doctors: "",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Return the token as a response
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          sameSite: "strict",
          path: "/",
          maxAge: 3600000,
        })
      );
      res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
      console.error("Error registering user:", error);
      res
        .status(500)
        .json({ error: "An error occurred during user registration!" });
    }
  }

  async changePassword(req, res) {
    try {
      // Validate request data using express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Retrieve data from request body
      const { userId, newPassword } = req.body;

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's record with the new password
      await UserRepository.updatePassword(userId, hashedPassword);

      // Send an email to the user confirming password change
      // You can customize the email content as per your requirement
      // await sendEmail(User.email, 'Password Changed', 'Your password has been changed successfully');

      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res
        .status(500)
        .json({ error: "An error occurred while changing password" });
    }
  }

  async getFoldersByUserIds(req, res) {
    try {
      const { userIds } = req.body;
      const foldersByUser = [];

      for (const userId of userIds) {
        // Find the user by ID
        const user = await UserRepository.findById(userId);

        // Check if the user exists
        if (user) {
          // If the user exists, extract the first name and last name
          const { first_name, last_name } = user;

          // Add the user's full name to the foldersByUser array
          foldersByUser.push({
            user_id: userId,
            full_name: `${first_name} ${last_name}`,
          });
        }
      }

      res.status(200).json({ status: "success", foldersByUser });
    } catch (error) {
      console.error("Error getting folders by user IDs:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  async login(req, res) {
    try {
      // Validate request data using express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Retrieve data from request body
      const { username, password } = req.body;

      // Check if the user exists by username or email
      const user = await UserRepository.findByUsername(username);
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      // Verify the password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      // Generate JWT token for user's session
      const token = jwt.sign(
        {
          user_id: user.user_id * 8312,
          username: user.username,
          user_type: user.user_type,
          doctors: user.doctors,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
      // const encryptedToken = encrypt(token);
      // Return the token as a response
      // res.setHeader('Set-Cookie', cookie.serialize('token', token, { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 3600000 }));
      // res.setHeader('Set-Cookie', cookie.serialize('token', encryptedToken, { httpOnly: true, secure:true, sameSite: 'strict', path: '/', maxAge: 3600000 }));
      // res.status(200).json({ message: 'Login successful', encryptedToken });
      const encryptedPayload = encryptPayload(token);
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", encryptedPayload, {
          httpOnly: true,
          sameSite: "strict",
          path: "/",
          maxAge: 3600000,
        })
      );
      res.status(200).json({ message: "Login successful", encryptedPayload });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ error: "An error occurred during user login" });
    }
  }

  // async forgotPassword(req, res) {
  //     try {
  //         // Validate request data using express-validator
  //         const errors = validationResult(req);
  //         if (!errors.isEmpty()) {
  //             return res.status(400).json({ errors: errors.array() });
  //         }

  //         // Retrieve data from request body
  //         const { email } = req.body;

  //         // Check if the user exists by email
  //         const user = await UserRepository.findByEmail(email);
  //         if (!user) {
  //             return res.status(404).json({ message: 'User with this email does not exist' });
  //         }

  //         // Generate a unique token for password reset
  //         const resetToken = crypto.randomBytes(20).toString('hex');

  //         // Set the token and expiry time in the user's record
  //         user.resetToken = resetToken;
  //         user.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

  //         // Save the updated user record
  //         await UserRepository.updateUser(user);

  //         // Send an email to the user with password reset instructions
  //         await sendEmail(email, 'Password Reset', `Your password reset token is: ${resetToken}`);

  //         res.status(200).json({ message: 'Password reset instructions have been sent to your email' });
  //     } catch (error) {
  //         console.error('Error initiating password reset:', error);
  //         res.status(500).json({ error: 'An error occurred during password reset initiation' });
  //     }
  // }
  async logout(req, res) {
    // Clear the token cookie
    // res.setHeader('Set-Cookie', cookie.serialize('token', '', { expires: new Date(0), path: '/' }));
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", "", { expires: new Date(0), path: "/" })
    );
    res.status(200).json({ message: "Logged out successfully" });
  }
  async getAllUsers(req, res) {
    try {
      const users = await UserRepository.findAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error getting all users:", error);
      res.status(500).json({ error: "An error occurred while fetching users" });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await UserRepository.deleteUserById(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the user" });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserRepository.findById(id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error getting user by ID:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the user" });
    }
  }

  async getUserByUserName(req, res) {
    try {
      const { username } = req.params;
      const user = await UserRepository.findByUsername(username);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error getting user by username:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the user" });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const [updated] = await UserRepository.updateUserById(id, updates);

      if (updated) {
        const updatedUser = await UserRepository.findById(id);
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the user" });
    }
  }

  async getFullNameById(req, res) {
    try {
      const { userId } = req.params;
      const user = await UserRepository.findById(userId);
      if (user) {
        const fullName = `${user.first_name} ${user.last_name}`;
        const phone_number = user.phone_number;
        const email = user.email;
        res.status(200).json({ fullName, phone_number, email });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error getting user full name by ID:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the user full name" });
    }
  }

  async getDoctorCount(req, res) {
    try {
      const { id } = req.params;
      const doctorCount = await UserRepository.getDoctorCountByUserId(id);
      res.status(200).json({ doctorCount });
    } catch (error) {
      console.error("Error getting doctor count:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the doctor count" });
    }
  }

  async forgotPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let user;
      const { email, username } = req.body;
      if (email) {
        user = await UserRepository.findByEmail(email);
      } else if (username) {
        user = await UserRepository.findByUsername(username);
      } else {
        return res
          .status(400)
          .json({ message: "Email or username is required" });
      }
      if (!user) {
        return res
          .status(404)
          .json({ message: "User with this email/username does not exist" });
      }

      const resetToken = crypto.randomBytes(20).toString("hex");
      user.resetToken = resetToken;
      user.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
      await UserRepository.updateUser(user);

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      const htmlContent = `
      <html>
      <head>
        <style>
          .email-container {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            background-color: #f9f9f9;
          }
          .email-header {
            text-align: center;
            margin-bottom: 20px;
          }
          .email-header h1 {
            margin: 0;
            color: #007BFF;
          }
          .email-body {
            margin-bottom: 20px;
          }
          .email-footer {
            text-align: center;
            font-size: 0.9em;
            color: #666;
          }
          .button {
            padding: 10px 20px;
            font-size: 16px;
            background-color: #007BFF;
            border-radius: 5px;
            }
        .link{
            color: white;
            display: inline-block;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Password Reset</h1>
          </div>
          <div class="email-body">
            <p>Dear ${user.username || user.email},</p>
            <p>You have requested to reset your password. Please click the link below to reset your password:</p>
            <span  class="button"><a href="${resetUrl}" class="link">Reset Password</a></span>
            <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
          </div>
          <div class="email-footer">
            <p>Thank you,</p>
            <p>The Support Team</p>
          </div>
        </div>
      </body>
      </html>
    `;

      await sendEmail(
        user.email,
        "Password Reset",
        "Please use the following link to reset your password.",
        htmlContent
      );

      res.status(200).json({
        message: "Password reset instructions have been sent to your email",
      });
    } catch (error) {
      console.error("Error initiating password reset:", error);
      res
        .status(500)
        .json({ error: "An error occurred during password reset initiation" });
    }
  }

  async resetPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { token, newPassword } = req.body;
      const user = await UserRepository.findByResetToken(token);
      if (!user || user.resetTokenExpiry < Date.now()) {
        return res
          .status(400)
          .json({ message: "Invalid or expired reset token" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await UserRepository.updateUser(user);

      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res
        .status(500)
        .json({ error: "An error occurred while resetting the password" });
    }
  }
}

export default UserController;
