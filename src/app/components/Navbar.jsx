"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Use Next.js router
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { signOut, onAuthStateChanged } from "firebase/auth"; // Import signOut
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { auth } from "@/app/firebase/config";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null); // Track the logged-in user
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state on sign-out
      router.push("/"); // Redirect to home after sign out
    } catch (err) {
      console.error("Error during sign out:", err.message);
    }
  };

  return (
    <nav className="bg-neutral-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-lg font-bold">
          <Link href="">DOGNOSE</Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-4 ml-auto">
          {/* ICONS And USER */}
          <div className="flex  items-center">
            <span className="text-white leading-3 font-medium">ADMIN</span>
          </div>
          {/* Sign-Out Button */}
          <button
            onClick={handleSignOut}
            className="group flex items-center space-x-2 text-white hover:text-gray-400 p-2"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
            <span className="hidden group-hover:inline">Sign Out</span>
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden ml-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className="text-white focus:outline-none"
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Links */}
      {isOpen && (
        <div className="md:hidden">
          <button
            onClick={handleSignOut}
            className="group flex items-center space-x-2 text-white hover:text-gray-400 p-2"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
            <span className="hidden group-hover:inline">Sign Out</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
