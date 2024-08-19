"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, StepBackIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Error = () => {
  return (
    <div className="h-full min-h-[100vh] flex flex-col items-center justify-center space-y-4">
      <Image
        height={300}
        width={300}
        src="/images/404.svg"
        alt="404"
        className="dark:hidden"
      />
      <Image
        height={300}
        width={300}
        src="/images/404-dark.svg"
        alt="404"
        className="dark:block hidden"
      />
      <h2 className="text-xl font-medium">Something went wrong! </h2>
      <Button asChild>
        <Link href="/documents">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Link>
      </Button>
    </div>
  );
};

export default Error;
