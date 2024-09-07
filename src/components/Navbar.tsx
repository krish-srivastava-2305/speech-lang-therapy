"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/util";
import Link from "next/link";
import { motion } from "framer-motion";

export function NavbarMenu() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
    className={cn("fixed top-4 inset-x-0 max-w-3xl mx-auto z-50", className)}
  >
    <Menu setActive={setActive}>
      <nav className="px-4 py-3 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-full shadow-lg">
        <ul className="flex justify-around items-center space-x-2">
          {['Home', 'Supervisor', 'Therapist', 'Patient', 'More about us'].map((item) => (
            <motion.li key={item} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href={item === 'Home' ? '/' : `/${item.toLowerCase()}/login`}
                className="text-white font-medium px-3 py-2 rounded-full transition-colors duration-200 hover:bg-blue-700 hover:text-blue-100"
              >
                {item}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
    </Menu>
  </div>
  );
}
