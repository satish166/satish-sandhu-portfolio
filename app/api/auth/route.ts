import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONFIG_FILE_PATH = path.join(process.cwd(), "app", "data", "admin-config.json");

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

// Helper to read config
async function getAdminConfig(): Promise<any> {
  if (KV_ENABLED) {
    try {
      const configStr = await kvExecute(["GET", "admin_config"]);
      if (configStr) {
        const parsed = JSON.parse(configStr);
        if (!parsed.password) parsed.password = "Sandhu@123";
        return parsed;
      }
    } catch (err) {
      console.error("KV error reading admin config:", err);
    }
  }
  try {
    if (!fs.existsSync(CONFIG_FILE_PATH)) {
      return { password: "Sandhu@123" };
    }
    const fileContents = fs.readFileSync(CONFIG_FILE_PATH, "utf8");
    const parsed = JSON.parse(fileContents);
    if (!parsed.password) parsed.password = "Sandhu@123";
    return parsed;
  } catch (error) {
    console.error("Error reading admin-config data:", error);
    return { password: "Sandhu@123" };
  }
}

// Helper to save config
async function saveAdminConfig(config: any): Promise<boolean> {
  if (KV_ENABLED) {
    try {
      await kvExecute(["SET", "admin_config", JSON.stringify(config)]);
      return true;
    } catch (err) {
      console.error("KV error saving admin config:", err);
      return false;
    }
  }
  try {
    const dir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing admin-config data:", error);
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const passwordHeader = request.headers.get("x-admin-password");
    const config = await getAdminConfig();

    if (passwordHeader !== config.password) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    return NextResponse.json(config);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const config = await getAdminConfig();

    if (password === config.password) {
      return NextResponse.json({ success: true, message: "Authorized" });
    } else {
      return NextResponse.json({ error: "Incorrect passcode" }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { newPassword, reset, smtpHost, smtpPort, smtpUser, smtpPass, smtpReceiver } = body;

    const config = await getAdminConfig();

    if (reset) {
      const success = await saveAdminConfig({ password: "Sandhu@123" });
      if (!success) {
        return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: "Password reset to default successfully!" });
    }

    const passwordHeader = request.headers.get("x-admin-password");

    if (passwordHeader !== config.password) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Update fields
    if (newPassword !== undefined) {
      if (newPassword.length < 4) {
        return NextResponse.json({ error: "Password must be at least 4 characters long" }, { status: 400 });
      }
      config.password = newPassword;
    }

    if (smtpHost !== undefined) config.smtpHost = smtpHost;
    if (smtpPort !== undefined) config.smtpPort = smtpPort;
    if (smtpUser !== undefined) config.smtpUser = smtpUser;
    if (smtpPass !== undefined) config.smtpPass = smtpPass;
    if (smtpReceiver !== undefined) config.smtpReceiver = smtpReceiver;

    const success = await saveAdminConfig(config);
    if (!success) {
      return NextResponse.json({ error: "Failed to update configuration" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Configuration updated successfully!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
