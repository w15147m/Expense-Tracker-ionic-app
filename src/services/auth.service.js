import { Storage } from '@ionic/storage';

class AuthService {
  constructor() {
    this.storage = new Storage();
    this.init();
  }

  async init() {
    await this.storage.create();
    // Clear any existing session on app initialization
    await this.storage.remove('currentUser');
  }

  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await this.storage.get(userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Store user data
      await this.storage.set(userData.email, {
        email: userData.email,
        password: userData.password,
        name: userData.name
      });

      return { success: true, message: 'Registration successful' };
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await this.storage.get(email);
      
      if (!user) {
        throw new Error('User not found');
      }

      if (user.password !== password) {
        throw new Error('Invalid password');
      }

      // Store current user session
      await this.storage.set('currentUser', {
        email: user.email,
        name: user.name
      });

      return { success: true, user: { email: user.email, name: user.name } };
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await this.storage.remove('currentUser');
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.storage.get('currentUser');
    } catch (error) {
      throw error;
    }
  }

  async isAuthenticated() {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService(); 