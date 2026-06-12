import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "app", "data", "portfolio-data.json");
const CONFIG_FILE_PATH = path.join(process.cwd(), "app", "data", "admin-config.json");
const LOG_FILE_PATH = path.join(process.cwd(), "app", "data", "activity-log.json");

// Helper to read config
function getAdminPassword(): string {
  try {
    if (!fs.existsSync(CONFIG_FILE_PATH)) {
      return "Sandhu@123";
    }
    const fileContents = fs.readFileSync(CONFIG_FILE_PATH, "utf8");
    const parsed = JSON.parse(fileContents);
    return parsed.password || "Sandhu@123";
  } catch (error) {
    console.error("Error reading admin-config data:", error);
    return "Sandhu@123";
  }
}

// Helper to read data
function getPortfolioData() {
  try {
    const fileContents = fs.readFileSync(DATA_FILE_PATH, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    return null;
  }
}

// Helper to write data
function savePortfolioData(data: any) {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing portfolio data:", error);
    return false;
  }
}

// Helper to calculate difference
function calculateDiff(oldData: any, newData: any): string[] {
  const changes: string[] = [];
  if (!oldData || !newData) return [];
  
  const compareKeys = (obj1: any, obj2: any, prefix: string) => {
    const o1 = obj1 || {};
    const o2 = obj2 || {};
    const keys = Array.from(new Set([...Object.keys(o1), ...Object.keys(o2)]));
    keys.forEach((key) => {
      if (typeof o1[key] !== "object" && o1[key] !== o2[key]) {
        changes.push(`${prefix} [${key}]: "${o1[key] || ""}" ➔ "${o2[key] || ""}"`);
      }
    });
  };

  compareKeys(oldData.profile, newData.profile, "Profile");
  compareKeys(oldData.socials, newData.socials, "Socials");

  const compareProjects = (arr1: any[], arr2: any[], label: string) => {
    const map1 = new Map((arr1 || []).map((p) => [p.id, p]));
    const map2 = new Map((arr2 || []).map((p) => [p.id, p]));

    // Check for removed or modified
    for (const [id, p1] of map1.entries()) {
      const p2 = map2.get(id);
      if (!p2) {
        changes.push(`${label}: Removed "${p1.name || "Untitled"}"`);
      } else if (JSON.stringify(p1) !== JSON.stringify(p2)) {
        const fields = [];
        if (p1.name !== p2.name) fields.push(`Name changed to "${p2.name}"`);
        if (p1.description !== p2.description) fields.push("Description modified");
        if (p1.link !== p2.link) fields.push("Link modified");
        if (p1.image !== p2.image) fields.push("Image modified");
        const details = fields.length > 0 ? `: ${fields.join(", ")}` : " details modified";
        changes.push(`${label} [${p1.name || "Untitled"}]${details}`);
      }
    }

    // Check for added
    for (const [id, p2] of map2.entries()) {
      if (!map1.has(id)) {
        changes.push(`${label}: Added "${p2.name || "Untitled"}"`);
      }
    }
  };

  compareProjects(oldData.liveProjects, newData.liveProjects, "Live Project");
  compareProjects(oldData.personalProjects, newData.personalProjects, "Personal Project");

  // Compare Skills
  const origSkills = oldData.skills || [];
  const currSkills = newData.skills || [];
  const maxSkillsLen = Math.max(origSkills.length, currSkills.length);
  for (let i = 0; i < maxSkillsLen; i++) {
    const origCat = origSkills[i];
    const currCat = currSkills[i];
    if (!origCat && currCat) {
      changes.push(`Skills Category: Added "${currCat.category}"`);
    } else if (origCat && !currCat) {
      changes.push(`Skills Category: Removed "${origCat.category}"`);
    } else if (origCat && currCat) {
      if (origCat.category !== currCat.category) {
        changes.push(`Skills Category: Renamed "${origCat.category}" ➔ "${currCat.category}"`);
      }
      // Compare items
      const origItems = origCat.items || [];
      const currItems = currCat.items || [];
      const maxItemsLen = Math.max(origItems.length, currItems.length);
      for (let j = 0; j < maxItemsLen; j++) {
        const origItem = origItems[j];
        const currItem = currItems[j];
        if (!origItem && currItem) {
          changes.push(`Skill [${currCat.category}]: Added "${currItem.name}"`);
        } else if (origItem && !currItem) {
          changes.push(`Skill [${currCat.category}]: Removed "${origItem.name}"`);
        } else if (origItem && currItem && JSON.stringify(origItem) !== JSON.stringify(currItem)) {
          changes.push(`Skill [${currCat.category}]: Modified "${origItem.name || currItem.name}"`);
        }
      }
    }
  }
  
  return changes;
}

// Helper to append log
function appendActivityLog(changes: string[]) {
  if (changes.length === 0) return;
  try {
    const dir = path.dirname(LOG_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let logs = [];
    if (fs.existsSync(LOG_FILE_PATH)) {
      logs = JSON.parse(fs.readFileSync(LOG_FILE_PATH, "utf8"));
    }
    logs.unshift({
      id: String(Date.now()),
      timestamp: new Date().toISOString(),
      changes
    });
    logs = logs.slice(0, 50); // Keep last 50 entries
    fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write activity log:", err);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activity = searchParams.get("activity");

    if (activity) {
      if (!fs.existsSync(LOG_FILE_PATH)) {
        return NextResponse.json([]);
      }
      const logs = JSON.parse(fs.readFileSync(LOG_FILE_PATH, "utf8"));
      return NextResponse.json(logs);
    }

    const data = getPortfolioData();
    if (!data) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const passwordHeader = request.headers.get("x-admin-password");
    const adminPassword = getAdminPassword();

    if (passwordHeader !== adminPassword) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const updatedData = await request.json();
    if (!updatedData || typeof updatedData !== "object") {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const oldData = getPortfolioData();
    const changes = calculateDiff(oldData, updatedData);

    const success = savePortfolioData(updatedData);
    if (!success) {
      return NextResponse.json({ error: "Failed to save data on disk" }, { status: 500 });
    }

    appendActivityLog(changes);

    return NextResponse.json({ message: "Portfolio updated successfully", data: updatedData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
