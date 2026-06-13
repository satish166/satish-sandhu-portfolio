import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const CONFIG_FILE_PATH = path.join(process.cwd(), "app", "data", "admin-config.json");
const KV_ENABLED = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
// Vercel Blob is available when BLOB_READ_WRITE_TOKEN env var is set
const BLOB_ENABLED = !!process.env.BLOB_READ_WRITE_TOKEN;

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
      console.error("KV error reading admin config in upload:", err);
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
    console.error("Error reading admin-config data in upload:", error);
    return { password: "Sandhu@123" };
  }
}

export async function POST(request: Request) {
  try {
    const passwordHeader = request.headers.get("x-admin-password");
    const usernameHeader = request.headers.get("x-admin-username");
    const config = await getAdminConfig();

    if (!usernameHeader || usernameHeader === "admin") {
      if (passwordHeader !== config.password) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
      }
    } else {
      const matchedUser = (config.users || []).find(
        (u: any) => u.username.toLowerCase() === usernameHeader.toLowerCase() && u.password === passwordHeader
      );
      if (!matchedUser) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
      }
      if (matchedUser.permission === "Read Only") {
        return NextResponse.json({ error: "You do not have permission to edit" }, { status: 403 });
      }
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Verify it is an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Uploaded file must be an image" }, { status: 400 });
    }

    // Generate unique filename
    const originalName = file.name || "image.png";
    const extension = path.extname(originalName) || ".png";
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    // ── Production: Use Vercel Blob ──────────────────────────────────────────
    if (BLOB_ENABLED) {
      try {
        const { put } = await import("@vercel/blob");
        const blob = await put(`uploads/${uniqueName}`, file, {
          access: "public",
          contentType: file.type,
        });
        return NextResponse.json({ message: "File uploaded successfully", url: blob.url });
      } catch (blobErr: any) {
        console.error("Vercel Blob upload failed:", blobErr);
        return NextResponse.json(
          { error: "Image upload failed: " + (blobErr.message || "Blob storage error") },
          { status: 500 }
        );
      }
    }

    // ── Development: Save to local public/uploads ────────────────────────────
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueName);
    fs.writeFileSync(filePath, buffer);

    const assetUrl = `/uploads/${uniqueName}`;
    return NextResponse.json({ message: "File uploaded successfully", url: assetUrl });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Upload failed: " + (error.message || "Internal Server Error") },
      { status: 500 }
    );
  }
}
