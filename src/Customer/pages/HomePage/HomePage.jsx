import React from "react";
import VideoBanner from "./VideoBanner";
import MainSearchForm from "../../components/MainSearchForm/MainSearchForm";
import NearByLocations from "./NearByLocations";
import AccommodationTypes from "./AccommodationTypes";
import FilterButtons from "../../components/FilterButtons/FilterButtons";

export default function HomePage() {
  return (
    <div>
      {/* 2. RENDER VideoBanner ở đây */}
      <VideoBanner />

      {/* Thanh tìm kiếm, z-40 để nổi trên SVG của banner (z-20) */}
      <div className="container mx-auto px-4 mt-4 md:mt-12 relative z-40">
        <MainSearchForm />
      </div>

      {/* Các button Filter */}
      <div className="container mx-auto px-4 mt-4 md:mt-6">
        {/* Thêm container và margin top */}
        <FilterButtons />
      </div>

      <NearByLocations />

      <AccommodationTypes />
    </div>
  );
}
