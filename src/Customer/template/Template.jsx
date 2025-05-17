import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { ChevronUp } from "lucide-react";
import "./template.css";

export default function Template({ content, forceWhiteHeader = false }) {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div style={{ minHeight: "100vh" }} className="flex flex-col">
      <Header forceWhite={forceWhiteHeader} />

      <div className="grow">{content}</div>
      <Footer />

      {/* Scroll to top */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 z-40 bg-red-200 text-white p-3 rounded-full shadow-lg hover:bg-red-500 transition-colors duration-300"
          title="Lên đầu trang"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Call + Zalo buttons */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-3 items-end">
        {/* Nút gọi điện thoại với hiệu ứng rung */}
        <a
          href="tel:0123456789"
          className="phone-shake bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition"
          title="Gọi ngay"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5a2 2 0 012-2h3.586a1 1 0 01.707.293l2.414 2.414a1 1 0 010 1.414L10.414 9.586a1 1 0 000 1.414l3.586 3.586a1 1 0 001.414 0l2.465-2.465a1 1 0 011.414 0l2.414 2.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z"
            />
          </svg>
        </a>

        {/* Nút Zalo đơn giản */}
        <a
          href="https://zalo.me/0123456789"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white hover:bg-blue-100 p-0 w-14 h-14 rounded-full shadow-lg transition overflow-hidden flex items-center justify-center"
          title="Chat Zalo"
        >
          <img
            src="/images/zalo-icon.jpg"
            alt="Zalo"
            className="w-full h-full object-cover rounded-full"
          />
        </a>
      </div>
    </div>
  );
}
