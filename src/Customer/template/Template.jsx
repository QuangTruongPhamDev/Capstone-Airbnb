import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function Template({ content }) {
  return (
    <div style={{ minHeight: "100vh" }} className="flex flex-col">
      <Header />
      {/* Thêm class 'pt-20' (padding-top: 5rem / 80px) để đẩy content xuống dưới Header */}
      <div className="grow">{content}</div>
      <Footer />
    </div>
  );
}
