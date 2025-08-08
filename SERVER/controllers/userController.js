
import { clerkClient } from '@clerk/clerk-sdk-node';
import User from '../models/User.js';

export const getUserData = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('getUserData called for userId:', userId);
    
    let userDoc = await User.findById(userId);
    if (!userDoc) {
      console.log('User not found in DB, creating new user record');
      // Auto-create user in DB from Clerk profile
      try {
        const cUser = await clerkClient.users.getUser(userId);
        userDoc = await User.create({
          _id: userId,
          username: cUser.username || `${cUser.firstName || ''} ${cUser.lastName || ''}`.trim() || userId,
          email: cUser.primaryEmailAddress?.emailAddress || `${userId}@temp.local`,
          image: cUser.imageUrl || 'https://via.placeholder.com/150',
          recentSearchedCities: []
        });
        console.log('Created new user record:', userDoc._id);
      } catch (clerkError) {
        console.error('Error fetching user from Clerk:', clerkError);
        // Create minimal user record if Clerk fetch fails
        userDoc = await User.create({
          _id: userId,
          username: userId,
          email: `${userId}@temp.local`,
          image: 'https://via.placeholder.com/150',
          recentSearchedCities: []
        });
        console.log('Created minimal user record:', userDoc._id);
      }
    } else {
      // Check if user has temporary data and update with real Clerk data
      if (userDoc.email.includes('@temp.local') || userDoc.image === 'https://via.placeholder.com/150') {
        console.log('User has temporary data, updating with Clerk info');
        try {
          const cUser = await clerkClient.users.getUser(userId);
          userDoc.username = cUser.username || `${cUser.firstName || ''} ${cUser.lastName || ''}`.trim() || userDoc.username;
          userDoc.email = cUser.primaryEmailAddress?.emailAddress || userDoc.email;
          userDoc.image = cUser.profileImageUrl || userDoc.image;
          await userDoc.save();
          console.log('Updated user with Clerk data:', userDoc._id);
        } catch (clerkError) {
          console.error('Error updating user from Clerk:', clerkError);
        }
      }
    }
    
    const role = userDoc.role;
    const recentSearchedCities = userDoc.recentSearchedCities || [];
    console.log('Returning user data:', { role, recentSearchedCities });
    return res.status(200).json({ success: true, role, recentSearchedCities });
  } catch (error) {
    console.error('getUserData error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const storeRecentSearchedCities = async(req, res)=>{
    try{
        const {recentSearchedCity} = req.body;
        const user = await req.body;

        if(user.recentCitiesSearched.length <3){
            recentCitiesSearched.push(recentSearchedCity)
        }else{
            user.storeRecentSearchedCities.shift()
            user.storeRecentSearchedCities.push(recentSearchedCity)
        }
    }catch(error){
        res.json(error.message)
    }
}