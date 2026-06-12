
export const dynamic = "force-dynamic";

import React from "react";
import fs from "fs";
import path from "path";

import NavBar from "./components/navbar/navbar";
import MainContent from "./components/main-content/main";

export default function Portfolio() {
  const dataPath = path.join(process.cwd(), "app", "data", "portfolio-data.json");
  let portfolioData: any = {};
  
  try {
    const fileContents = fs.readFileSync(dataPath, "utf8");
    portfolioData = JSON.parse(fileContents);
  } catch (error) {
    console.error("Failed to load portfolio data:", error);
  }

  return (
    <>
      <div className="page-layout">
        <NavBar data={portfolioData} />
        <MainContent data={portfolioData} />
      </div>
    </>
  );
}