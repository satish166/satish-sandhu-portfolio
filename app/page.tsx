export const dynamic = "force-dynamic";

import React from "react";
import fs from "fs";
import path from "path";

import NavBar from "./components/navbar/navbar";
import MainContent from "./components/main-content/main";

const KV_ENABLED = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

async function kvExecute(command: string[]): Promise<any> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  const response = await fetch(url!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`KV command failed: ${text}`);
  }
  const resData = await response.json();
  return resData.result;
}

export default async function Portfolio() {
  const dataPath = path.join(process.cwd(), "app", "data", "portfolio-data.json");
  let portfolioData: any = {};
  
  if (KV_ENABLED) {
    try {
      const dataStr = await kvExecute(["GET", "portfolio_data"]);
      if (dataStr) {
        portfolioData = JSON.parse(dataStr);
      }
    } catch (err) {
      console.error("Failed to load portfolio data from KV:", err);
    }
  }

  // Fallback to local file if KV is disabled or data was empty in the database
  if (!portfolioData || Object.keys(portfolioData).length === 0) {
    try {
      const fileContents = fs.readFileSync(dataPath, "utf8");
      portfolioData = JSON.parse(fileContents);
    } catch (error) {
      console.error("Failed to load local portfolio data:", error);
    }
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