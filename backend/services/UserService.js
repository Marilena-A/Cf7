const UserRepository = require('../repositories/UserRepository');
const UserDTO = require('../dto/UserDTO');
const jwt = require('jsonwebtoken');

class UserService {
  generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  }

  async registerUser(userData) {
    const processedData = UserDTO.toRegisterRequest(userData);

    // Check if user already exists
    const existingUser = await UserRepository.findOne({
      $or: [{ email: processedData.email }, { username: processedData.username }]
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    const user = await UserRepository.create(processedData);
    const token = this.generateToken(user._id);

    return UserDTO.toAuthResponse(user, token);
  }

  async loginUser(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user._id);
    return UserDTO.toAuthResponse(user, token);
  }

  async getUserProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return UserDTO.toProfileResponse(user);
  }

  async updateUserProfile(userId, updateData) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if email or username is already taken by another user
    if (updateData.email && updateData.email !== user.email) {
      const emailExists = await UserRepository.checkEmailExists(updateData.email, userId);
      if (emailExists) {
        throw new Error('Email already taken by another user');
      }
    }

    if (updateData.username && updateData.username !== user.username) {
      const usernameExists = await UserRepository.checkUsernameExists(updateData.username, userId);
      if (usernameExists) {
        throw new Error('Username already taken by another user');
      }
    }

    const processedData = UserDTO.toUpdateRequest(updateData);
    const updatedUser = await UserRepository.updateById(userId, processedData);
    
    return {
      message: 'Profile updated successfully',
      user: UserDTO.toProfileResponse(updatedUser)
    };
  }

  async getAllUsers(queryParams) {
    const { page, limit, search } = queryParams;

    let query = {};
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const options = { page, limit };
    const result = await UserRepository.findAll(query, options);
    const stats = await UserRepository.getUserStats();

    return UserDTO.toAdminListResponse({
      ...result,
      stats
    });
  }

  async getUserById(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return UserDTO.toProfileResponse(user);
  }

  async updateUserRole(userId, role, currentUserId) {
    // Prevent admin from changing their own role
    if (userId === currentUserId) {
      throw new Error('You cannot change your own role');
    }

    const user = await UserRepository.updateRole(userId, role);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      message: 'User role updated successfully',
      user: UserDTO.toPublicResponse(user)
    };
  }

  async deleteUser(userId, currentUserId) {
    // Prevent admin from deleting themselves
    if (userId === currentUserId) {
      throw new Error('You cannot delete your own account');
    }

    const user = await UserRepository.deleteById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return { message: 'User deleted successfully' };
  }

  async validateUserExists(userId) {
    const user = await UserRepository.findById(userId);
    return !!user;
  }

  async searchUsers(searchTerm) {
    const users = await UserRepository.searchUsers(searchTerm);
    return UserDTO.fromArray(users);
  }

  async getUserStats() {
    return await UserRepository.getUserStats();
  }
}

module.exports = new UserService();