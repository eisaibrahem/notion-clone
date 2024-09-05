import React from "react";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <div className="flex items-center w-full p-6 bg-background z-50 dark:bg-[#1f1f1f]">
      <Logo />
      <div
        className="md:ml-auto w-full md:w-fit flex items-center gap-x-2 justify-between 
      md:justify-end  text-muted-foreground  "
      >
        <Button variant={"ghost"} size={"sm"}>
          Privacy Policy
        </Button>
        <Button variant={"ghost"} size={"sm"}>
          Terms & Conditions
        </Button>
      </div>
    </div>
  );
};

export default Footer;
