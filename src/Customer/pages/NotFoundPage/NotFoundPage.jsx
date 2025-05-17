import Lottie from "lottie-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import errorAnimation from "../../../assets/404error.json";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-10">
      {/* Lottie 404 animation */}
      <div className="w-64 h-64 sm:w-100 sm:h-100">
        <Lottie animationData={errorAnimation} loop />
      </div>

      {/* Wave-text 404 KHÔNG TÌM THẤY */}
      <h1 className="wave-text mt-[10px] flex flex-wrap justify-center gap-x-1 text-4xl font-bold text-[#ff386c]">
        {"KHÔNG TÌM THẤY TRANG...".split("").map((char, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.08}s` }}>
            {char}
          </span>
        ))}
      </h1>

      {/* Nút quay về trang chủ */}
      <button
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-2 bg-[#ff386c] hover:bg-[#e02755] text-white text-base font-semibold rounded-md transition-all duration-200"
      >
        Về trang chủ
      </button>
    </div>
  );
}
