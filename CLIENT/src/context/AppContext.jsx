/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppProvider = ({children}) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const {user} = useUser();
    const {getToken} = useAuth();

    const[isOwner, setisOwner] = useState(false)
    const[showHotelReg, setShowHotelReg] = useState(false)
    const[searchedCities, setSearchedCities] = useState([]);
    const[rooms, setRooms] = useState([]); // owner-only rooms
    const[publicRooms, setPublicRooms] = useState([]); // all rooms for public browsing
    const[userDataLoaded, setUserDataLoaded] = useState(false); // Track if user data has been loaded


    const fetchRooms = useCallback(async () => {
        if (!user) {
            console.log('No user authenticated, skipping fetchRooms');
            return;
        }

        // Only fetch rooms if user is a hotel owner
        if (!isOwner) {
            console.log('User is not a hotel owner, skipping fetchRooms');
            return;
        }

        try {
            const token = await getToken();
            console.log('Token for fetchRooms:', token ? 'Token received' : 'No token');
            
            if (!token) {
                console.log('No token available, skipping fetchRooms');
                return;
            }
            
            const { data } = await axios.get('/api/rooms/owner', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setRooms(data.rooms);
                console.log('Rooms fetched successfully:', data.rooms.length, 'rooms');
            } else {
                console.log('fetchRooms failed with message:', data.message);
                if (data.message === 'No Hotel found') {
                    // User is authenticated but hasn't registered a hotel yet
                    setRooms([]);
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.error('fetchRooms error:', error);
            
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || error.message;
                
                console.error(`Server error ${status}:`, message);
                
                if (status === 401) {
                    console.log('Authentication failed for fetchRooms');
                    // Try to refresh user data
                    await fetchUser(true);
                } else if (status === 404) {
                    console.log('Rooms endpoint not found or no hotel registered');
                    setRooms([]);
                } else {
                    toast.error(`Error fetching rooms: ${message}`);
                }
            } else if (error.request) {
                console.error('Network error in fetchRooms:', error.request);
                toast.error('Network error - please check your connection');
            } else {
                console.error('Unexpected error in fetchRooms:', error.message);
                toast.error('Failed to fetch rooms');
            }
        }
    }, [getToken, user, isOwner]); // Removed fetchUser to prevent circular dependency
    
    // Fetch all rooms publicly available
    const fetchPublicRooms = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/rooms');
            if (data.success) {
                setPublicRooms(data.rooms);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to fetch public rooms');
        }
    }, []);

    const fetchUser = useCallback(async (forceRefresh = false) => {
        if (!user || (userDataLoaded && !forceRefresh)) {
            console.log('Skipping fetchUser - user:', !!user, 'userDataLoaded:', userDataLoaded, 'forceRefresh:', forceRefresh);
            return;
        }

        try {
            const token = await getToken();
            console.log('Token for fetchUser:', token ? 'Token received' : 'No token');
            
            if (!token) {
                console.log('No token available, skipping fetchUser');
                return;
            }
            
            const { data } = await axios.get('/api/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                const wasOwner = isOwner;
                const newOwnerStatus = data.role === 'hotelOwner';
                setisOwner(newOwnerStatus);
                setSearchedCities(data.recentSearchedCities);
                setUserDataLoaded(true); // Mark as loaded
                
                if (wasOwner !== newOwnerStatus) {
                    console.log('User owner status changed:', wasOwner, '→', newOwnerStatus);
                }
                
                console.log('User data loaded successfully:', data);
                return data; // Return the data for use in other functions
            } else {
                console.log('fetchUser failed with message:', data.message);
                // Don't retry on data.success false to avoid loops
            }
        } catch (error) {
            console.error('fetchUser error:', error);
            
            if (error.response) {
                // Server responded with error status
                const status = error.response.status;
                const message = error.response.data?.message || error.message;
                
                console.error(`Server error ${status}:`, message);
                
                if (status === 401) {
                    console.log('Authentication failed - user may need to log in again');
                    // Reset user data on auth failure
                    setUserDataLoaded(false);
                    setisOwner(false);
                    setSearchedCities([]);
                } else if (status === 404) {
                    console.log('User endpoint not found');
                } else if (status >= 500) {
                    console.log('Server error, will NOT retry to avoid loops');
                } else {
                    toast.error(`Error: ${message}`);
                }
            } else if (error.request) {
                // Request made but no response received
                console.error('Network error - no response received:', error.request);
                console.log('Network error, will NOT retry to avoid loops');
            } else {
                // Something else happened
                console.error('Unexpected error:', error.message);
                toast.error('An unexpected error occurred');
            }
        }
    }, [user, getToken]); // Removed userDataLoaded to prevent circular dependency

    useEffect(() => {
        if (user && !userDataLoaded) {
            console.log('User authenticated and data not loaded, calling fetchUser');
            fetchUser();
        } else if (!user) {
            console.log('User logged out, resetting state');
            setUserDataLoaded(false);
            setisOwner(false);
            setSearchedCities([]);
            setRooms([]);
        }
    }, [user, userDataLoaded, fetchUser]);

    // Separate effect for fetching rooms when isOwner changes
    useEffect(() => {
        if (user && isOwner && userDataLoaded) {
            console.log('User is owner and data loaded, fetching rooms');
            fetchRooms();
        }
    }, [user, isOwner, userDataLoaded]); // Removed fetchRooms to prevent circular dependency

    // Effect for fetching public rooms (doesn't require auth)
    useEffect(() => {
        fetchPublicRooms();
    }, []); // Removed fetchPublicRooms to prevent circular dependency - call once on mount

    const value = {
        currency,
        navigate,
        user,
        getToken,
        isOwner,
        setisOwner,
        showHotelReg,
        setShowHotelReg,
        searchedCities,
        setSearchedCities,
        rooms,
        fetchRooms,
        publicRooms,
        fetchPublicRooms,
        fetchUser,
        userDataLoaded // Add this to context for debugging
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext(AppContext);