class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.username = user.username;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
    this.address = user.address;
    this.phoneNumber = user.phoneNumber;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static toPublicResponse(user) {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      fullName: `${user.firstName} ${user.lastName}`
    };
  }

  static toAuthResponse(user, token) {
    return {
      message: 'Authentication successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        fullName: `${user.firstName} ${user.lastName}`
      }
    };
  }

  static toProfileResponse(user) {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      address: user.address,
      phoneNumber: user.phoneNumber,
      fullName: `${user.firstName} ${user.lastName}`,
      memberSince: user.createdAt
    };
  }

  static toAdminListResponse(usersData) {
    return {
      users: usersData.users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        fullName: `${user.firstName} ${user.lastName}`,
        memberSince: user.createdAt,
        lastUpdated: user.updatedAt
      })),
      pagination: usersData.pagination,
      stats: usersData.stats || []
    };
  }

  static toRegisterRequest(data) {
    return {
      username: data.username?.trim().toLowerCase(),
      email: data.email?.trim().toLowerCase(),
      password: data.password,
      firstName: data.firstName?.trim(),
      lastName: data.lastName?.trim(),
      address: data.address?.trim(),
      phoneNumber: data.phoneNumber?.trim()
    };
  }

  static toUpdateRequest(data) {
    const updateData = {};
    if (data.firstName) updateData.firstName = data.firstName.trim();
    if (data.lastName) updateData.lastName = data.lastName.trim();
    if (data.email) updateData.email = data.email.trim().toLowerCase();
    if (data.username) updateData.username = data.username.trim().toLowerCase();
    if (data.address !== undefined) updateData.address = data.address.trim();
    if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber.trim();
    return updateData;
  }

  static fromArray(users) {
    return users.map(user => new UserDTO(user));
  }
}

module.exports = UserDTO;