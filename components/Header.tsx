import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  HomeIcon,
  MessageSquare,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import Home from "@/app/page";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
const Header = () => {
  return (
    <div className="flex items-center p-2 max-w-6xl mx-auto">
      <Image
        className="rounded-lg"
        src="https://links.papareact.com/b3z" /* /linkedin-logo.png */
        alt="LinkedIn Logo"
        width={40}
        height={40}
      />

      <div className="flex-1">
        <form className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96">
          <SearchIcon className="h-4 text-gray-600" />
          <input
            type="text"
            className="bg-transparent flex-1 outline-none"
            placeholder="Search"
          />
        </form>
      </div>
      <div className="flex items-center space-x-4 px-6">
        <Link href="/" className="icon">
          <HomeIcon className="h-5 " />
          <p>Home</p>
        </Link>

        <Link href="/" className="icon hidden md:flex">
          <UserIcon className="h-5 " />
          <p>Network</p>
        </Link>

        <Link href="/" className="icon hidden md:flex">
          <Briefcase className="h-5 " />
          <p>Jobs</p>
        </Link>

        <Link href="/" className="icon ">
          <MessageSquare className="h-5 " />
          <p>Messaging</p>
        </Link>

        {/* User Button if signIn */}
        <SignedIn>
          <UserButton />
        </SignedIn>

        {/* SignIn Button if not signed in */}
        <SignedOut>
          <Button asChild variant="secondary">
            <SignInButton />
          </Button>
        </SignedOut>
      </div>
    </div>
  );
};

export default Header;
