"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-neutral-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <Link href="/">SENSOR</Link>
        </div>
        <div className="hidden md:flex space-x-4 ml-auto">
          <Link href="/" className="text-white hover:text-gray-400">
            Home
          </Link>
          <Link href="/services" className="text-white hover:text-gray-400">
            Services
          </Link>
        </div>
        <div className="md:hidden ml-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
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
      {isOpen && (
        <div className="md:hidden">
          <Link href="/" className="block text-white hover:text-gray-400 p-2">
            Home
          </Link>
          <Link
            href="/services"
            className="block text-white hover:text-gray-400 p-2"
          >
            Services
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
