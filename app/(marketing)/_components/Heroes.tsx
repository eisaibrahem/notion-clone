"use client";
import Lottie from "lottie-react";
import Image from "next/image";
import React from "react";
import notionAnimation from "../../../public/animation/Animation1.json";

const Heroes = () => {
  return (
    <div
      className="flex flec-col items-center
     justify-center max-w-5xl"
    >
      <div className="flex items-center">
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
        <div
          className="relative w-[400px] h-[400px]
          hidden md:block   
           "
        >
          {/* <Image
            src="/hero2.png"
            fill
            className="object-left object-contain"
            alt="hero2"
          /> */}
          <Image
            src="/hero3.png"
            fill
            className="object-left object-contain"
            alt="hero1"
          />
        </div>
      </div>
    </div>
  );
};

export default Heroes;
