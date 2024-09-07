"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/util";
import Link from "next/link";

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
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <Link href='/' className="text-white">Home</Link>
      
        <MenuItem setActive={setActive} active={active} item="Login">
          <div className="flex flex-col space-y-4 text-sm ">
            <HoveredLink href="/supervisor/login">Supervisor</HoveredLink>
            <HoveredLink href="/therapist/login">Therapist</HoveredLink>
            <HoveredLink href="/patient/login">Patient</HoveredLink>
          </div>
        </MenuItem>

        <Link href='/' className="text-white">More about us</Link>
         
        
      </Menu>
    </div>
  );
}
