import User from "../models/User.js";
import { clerkClient } from '@clerk/clerk-sdk-node';
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    console.log('Auth header received:', authHeader ? 'Yes' : 'No');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid auth header format');
      return res.status(401).json({ success: false, message: 'Not authorized, missing token' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('Token length:', token.length);
    
    // Try to decode the token to get the user ID
    let userId;
    try {
      // First try to decode without verification to get the payload
      const decoded = jwt.decode(token);
      console.log('Token decoded successfully, sub:', decoded?.sub);
      
      if (decoded && decoded.sub) {
        userId = decoded.sub;
        console.log('Extracted userId:', userId);
      } else {
        console.error('No sub claim found in token');
        return res.status(401).json({ success: false, message: 'Invalid token payload' });
      }
    } catch (err) {
      console.error('Token decode failed:', err);
      return res.status(401).json({ success: false, message: 'Invalid token format' });
    }

    // Find or create user in database
    let user = await User.findById(userId);
    if (!user) {
      console.log('User not found in DB, creating minimal user record');
      // Create minimal user record with proper defaults (not empty strings)
      user = await User.create({
        _id: userId,
        username: userId,
        email: `${userId}@temp.local`, // Temporary email until we get real one
        image: 'https://via.placeholder.com/150', // Default placeholder image
        recentSearchedCities: []
      });
      console.log('Created minimal user record for:', userId);
    } else {
      console.log('Found existing user:', userId, 'role:', user.role);
    }

    req.user = user;
    req.auth = { userId }; // For compatibility with existing controller code
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};