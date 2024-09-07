"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/util";
import Link from "next/link";
import axios from "axios";
import { Router } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function NavbarMenu() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
        await axios.post('/api/auth/logout');
        toast.success("Logged out successfully");
        router.push('/');
        } catch (error: any) {
        const errorMsg = error.response?.data?.error || "Failed to logout";
        toast.error(errorMsg);
        }
    };
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <Link href='/' className="text-white">Home</Link>
        <button onClick={handleLogout} className="text-white">Logout</button>
        <Link href='/' className="text-white">More about us</Link>
      </Menu>
    </div>
  );
}
