"use client";

import { useState, useEffect } from "react";
import NavBar from "./navbar/navbar";
import MainContent from "./main-content/main";
import RyanCVLayout from "./ryancv-layout/ryancv";

interface PortfolioContainerProps {
  data: any;
}

export default function PortfolioContainer({ data }: PortfolioContainerProps) {
  const [layoutStyle, setLayoutStyle] = useState<string>("default");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const savedLayout = localStorage.getItem("portfolio_layout_style") || "default";
    setLayoutStyle(savedLayout);
    setMounted(true);
  }, []);

  const handleLayoutChange = (style: string) => {
    setLayoutStyle(style);
    localStorage.setItem("portfolio_layout_style", style);
  };

  // Prevent server-side hydration mismatch
  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#07070a" }}></div>
    );
  }

  const showHeader = data?.showHeader !== false;

  if (layoutStyle === "vcard") {
    return (
      <RyanCVLayout 
        data={data} 
        layoutStyle={layoutStyle} 
        onLayoutChange={handleLayoutChange} 
      />
    );
  }

  return (
    <div className={`page-layout ${!showHeader ? "no-header" : ""}`}>
      {showHeader && (
        <NavBar 
          data={data} 
          layoutStyle={layoutStyle} 
          onLayoutChange={handleLayoutChange} 
        />
      )}
      <MainContent data={data} />
    </div>
  );
}
