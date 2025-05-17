import React from "react";
import loadingAnimation from "../../../assets/loading_animation.json";
import Lottie from "lottie-react";
import "./loadingstyle.css";
import { useSelector } from "react-redux";

export default function Loading() {
  let { isLoading } = useSelector((state) => state.loadingSlice);
  console.log("isLoading:", isLoading);

  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/60 z-50">
      <div className="w-48 h-48 sm:w-64 sm:h-64">
        <Lottie animationData={loadingAnimation} loop />
      </div>
      {/* Wave text animation */}
      <h1 className="wave-text mt-8 flex space-x-1 text-4xl font-bold text-[#ff386c]">
        {["a", "i", "r", "b", "n", "b", ".", ".", "."].map((char, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.15}s` }}>
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
}
