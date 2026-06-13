import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

const MESSAGES_FILE_PATH = path.join(process.cwd(), "app", "data", "messages.json");
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
      console.error("KV error reading admin config in contact:", err);
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

// Helper to get messages
async function getMessages(): Promise<any[]> {
  if (KV_ENABLED) {
    try {
      const messagesStr = await kvExecute(["GET", "portfolio_messages"]);
      if (messagesStr) {
        return JSON.parse(messagesStr);
      }
    } catch (err) {
      console.error("KV error reading portfolio messages:", err);
    }
  }
  try {
    if (!fs.existsSync(MESSAGES_FILE_PATH)) {
      return [];
    }
    const fileContents = fs.readFileSync(MESSAGES_FILE_PATH, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading messages data:", error);
    return [];
  }
}

// Helper to save messages
async function saveMessages(messages: any[]): Promise<boolean> {
  if (KV_ENABLED) {
    try {
      await kvExecute(["SET", "portfolio_messages", JSON.stringify(messages)]);
      return true;
    } catch (err) {
      console.error("KV error saving portfolio messages:", err);
      return false;
    }
  }
  try {
    const dir = path.dirname(MESSAGES_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(MESSAGES_FILE_PATH, JSON.stringify(messages, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing messages data:", error);
    return false;
  }
}

export async function GET(request: Request) {
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
    }

    const messages = await getMessages();
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Please fill all required fields" }, { status: 400 });
    }

    const messages = await getMessages();
    const newMessage = {
      id: String(Date.now()),
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    };

    messages.unshift(newMessage); // Add new message to the beginning
    const success = await saveMessages(messages);

    if (!success) {
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
    }

    // Direct SMTP Email sending via nodemailer
    const config = await getAdminConfig();
    let emailSent = false;
    let emailErrorMsg = "";

    if (config.smtpHost && config.smtpUser && config.smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: config.smtpHost,
          port: Number(config.smtpPort) || 465,
          secure: Number(config.smtpPort) === 465,
          auth: {
            user: config.smtpUser,
            pass: config.smtpPass
          }
        });

        await transporter.sendMail({
          from: `"${name}" <${config.smtpUser}>`,
          to: config.smtpReceiver || "sandhusatish166@gmail.com",
          replyTo: email,
          subject: `New Portfolio Message from ${name}`,
          text: `You have received a new contact form message from your portfolio.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        });
        emailSent = true;
      } catch (err: any) {
        console.error("Direct SMTP mail delivery failed:", err);
        emailErrorMsg = err.message || "Connection error";
      }
    }

    let successMessage = "Thank you! Your message has been saved in the Admin Inbox.";
    if (emailSent) {
      successMessage = "Thank you! Your message has been sent directly to Satish's email and saved in the Inbox.";
    } else if (config.smtpHost && !emailSent) {
      successMessage = `Message saved in Inbox, but email forwarding failed: ${emailErrorMsg}. Please check SMTP configuration.`;
    }

    return NextResponse.json({ success: true, message: successMessage });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
    }

    const messages = await getMessages();
    const filtered = messages.filter((m: any) => m.id !== id);
    const success = await saveMessages(filtered);

    if (!success) {
      return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Message deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
