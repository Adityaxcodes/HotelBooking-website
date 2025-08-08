import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets.js';
import { useClerk, UserButton } from '@clerk/clerk-react';
import { useAppContext } from '../context/AppContext.jsx';

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/rooms' },
        { name: 'Experience', path: '/', scrollTo: 'testimonials' },
        { name: 'About', path: '/' },
    ];

    const BookIcon = () => (
        <svg
            className="w-4 h-4 text-gray-700"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
            />
        </svg>
    );

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { openSignIn } = useClerk();
    const location = useLocation();
    const { user, navigate, isOwner, setShowHotelReg } = useAppContext();

    // Function to handle navigation with optional smooth scroll
    const handleNavigation = (link) => {
        if (link.scrollTo) {
            // If we're not on the home page, navigate there first
            if (location.pathname !== '/') {
                navigate('/');
                // Wait for navigation to complete, then scroll
                setTimeout(() => {
                    const element = document.getElementById(link.scrollTo);
                    if (element) {
                        element.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                        // Adjust for fixed navbar height
                        setTimeout(() => {
                            window.scrollBy(0, -80);
                        }, 100);
                    }
                }, 100);
            } else {
                // If already on home page, just scroll
                const element = document.getElementById(link.scrollTo);
                if (element) {
                    element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Adjust for fixed navbar height
                    setTimeout(() => {
                        window.scrollBy(0, -80);
                    }, 100);
                }
            }
        } else {
            // Regular navigation
            navigate(link.path);
        }
    };

    useEffect(() => {
        setIsScrolled(location.pathname !== '/');

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    return (
        <nav
            className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-8 lg:px-16 xl:px-24 transition-all duration-500 z-50 ${
                isScrolled
                    ? 'bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4'
                    : 'bg-transparent py-4 md:py-6'
            }`}
        >
            {/* Logo */}
            <Link to="/">
                <img
                    src={assets.logo}
                    alt="logo"
                    className={`h-9 ${isScrolled && 'invert opacity-80'}`}
                />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    link.scrollTo ? (
                        <div
                            key={i}
                            onClick={() => handleNavigation(link)}
                            className={`group flex flex-col gap-0.5 cursor-pointer ${
                                isScrolled ? 'text-gray-700' : 'text-white'
                            }`}
                        >
                            {link.name}
                            <div
                                className={`${
                                    isScrolled ? 'bg-gray-700' : 'bg-white'
                                } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
                            />
                        </div>
                    ) : (
                        <Link
                            key={i}
                            to={link.path}
                            className={`group flex flex-col gap-0.5 ${
                                isScrolled ? 'text-gray-700' : 'text-white'
                            }`}
                        >
                            {link.name}
                            <div
                                className={`${
                                    isScrolled ? 'bg-gray-700' : 'bg-white'
                                } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
                            />
                        </Link>
                    )
                ))}

            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
                <img
                    src={assets.searchIcon}
                    alt="search"
                    className={`${isScrolled ? 'invert' : ''} h-6 md:h-8 lg:h-10 transition-all duration-500 text-white px-2 md:px-4 py-1 md:py-2 rounded-full ml-2 md:ml-4`}
                />

                {user && (
                    <button
                        className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`}
                        onClick={() => {
                            if (isOwner) navigate('/owner');
                            else setShowHotelReg(true);
                        }}
                    >
                        {isOwner ? 'Dashboard' : 'List Your Hotel'}
                    </button>
                )}

                {user ? (
                    <UserButton
                        appearance={{ elements: { userButtonPopover: 'flex justify-center' } }}
                    >
                        <UserButton.MenuItems>
                            <UserButton.Action
                                label="My Bookings"
                                labelIcon={<BookIcon />}
                                onClick={() => navigate('/mybookings')}
                            />
                        </UserButton.MenuItems>
                    </UserButton>
                ) : (
                    <button
                        onClick={openSignIn}
                        className={`px-4 md:px-8 py-2 md:py-2.5 rounded-full ml-2 md:ml-4 transition-all duration-500 ${isScrolled ? 'text-white bg-black' : 'bg-black text-white'}`}
                    >
                        Login
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                <img
                    src={isMenuOpen ? assets.closeIcon : assets.menuIcon}
                    alt="menu-toggle"
                    className={`${isScrolled && 'invert'} h-6 cursor-pointer`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                />
            </div>

            {/* Mobile Menu */}
            <div
                className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
                    isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <button
                    className="absolute top-4 right-4"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <img src={assets.closeIcon} alt="close-menu" className="h-6" />
                </button>

                {navLinks.map((link, i) => (
                    link.scrollTo ? (
                        <div 
                            key={i} 
                            onClick={() => {
                                handleNavigation(link);
                                setIsMenuOpen(false);
                            }}
                            className="cursor-pointer"
                        >
                            {link.name}
                        </div>
                    ) : (
                        <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)}>
                            {link.name}
                        </Link>
                    )
                ))}

                {user && (
                    <button
                        className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all"
                        onClick={() => {
                            if (isOwner) {
                                navigate('/owner');
                            } else {
                                setShowHotelReg(true);
                            }
                        }}
                    >
                        {isOwner ? 'Dashboard' : 'List Your Hotel'}
                    </button>
                )}

                {user ? (
                    <UserButton
                        appearance={{
                            elements: {
                                userButtonPopover: 'flex justify-center',
                            },
                        }}
                    >
                        <UserButton.MenuItems>
                            <UserButton.Action
                                label="My Bookings"
                                labelIcon={<BookIcon />}
                                onClick={() => navigate('/mybookings')}
                            />
                        </UserButton.MenuItems>
                    </UserButton>
                ) : (
                    <button
                        onClick={openSignIn}
                        className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
