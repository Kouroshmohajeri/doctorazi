import User from '../models/User.js';

class UserRepository {
    static async findByUsername(username) {
        return await User.findOne({ where: { username } });
    }

    static async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    static async findById(id) {
        return await User.findByPk(id);
    }
    
    static async findAllUsers() {
        return await User.findAll();
    }

    static async createUser(userData) {
        return await User.create(userData);
    }

    static async updateUserRole(user_Id, user_type) {
        const user = await User.findByPk(user_Id);
        if (!user) {
            throw new Error('User not found');
        }
        user.user_type = user_type;
        await user.save();
        return user;
    }

    static async getDoctorCountByUserId(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Split the doctors string into an array and filter out empty values
        const doctorIds = user.doctors ? user.doctors.split(',').filter(Boolean) : [];
        return doctorIds.length;
    }
    
    static async deleteUserById(user_Id) {
        const user = await User.destroy({ where: { user_id: user_Id } });
        return user;
    }

    static async updateUserById(user_Id, updates) {
        return await User.update(updates, {
            where: { user_id: user_Id }
        });
    }
    
    static async updatePassword(userId, newPassword) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.password = newPassword;
        await user.save();
        return user;
    }
    static async findByResetToken(token) {
        return User.findOne({ where: { resetToken: token } });
    }

    static async updateUser(user) {
        const { user_id, resetToken, resetTokenExpiry, password } = user;
        return await User.update(
            { user_id, resetToken, resetTokenExpiry, password },
            { where: { user_id } }
        );
    }
    
}

export default UserRepository;
