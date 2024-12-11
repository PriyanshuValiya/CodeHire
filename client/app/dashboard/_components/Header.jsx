import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

function Header() {
  return (
    <div className="h-16 py-2 px-28 shadow-md">
      <Link href={"/"}>
        <img className="h-12 w-48" src="./Logo.jpg" alt="logo" />
      </Link>
    </div>
  );
}

export default Header;
