"use client";
import Lottie from "lottie-react";
import Image from "next/image";
import React from "react";
import notionAnimation from "../../../public/animation/Animation1.json";

const Heroes = () => {
  return (
    <div
      className="flex items-center
     justify-center max-w-5xl"
    >
      <div
        className="relative w-[350px] h-[350px]
             sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]
            "
      >
        <Lottie
          loop={true}
          style={{ width: "fit-content", margin: "10px 0px 10px 50px" }}
          animationData={notionAnimation}
        />
      </div>
      <div className="relative w-[400px] h-[400px] hidden md:block">
        <Image
          src="/images/1-white.svg"
          fill
          className="object-left object-contain dark:hidden"
          alt="hero1"
        />
        <Image
          src="/images/1-dark.svg"
          fill
          className="object-left object-contain dark:block hidden"
          alt="hero1"
        />
      </div>
    </div>
  );
};

export default Heroes;
