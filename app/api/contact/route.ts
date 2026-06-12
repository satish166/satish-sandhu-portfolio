import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import nodemailer from "nodemailer";

const MESSAGES_FILE_PATH = path.join(process.cwd(), "app", "data", "messages.json");
const CONFIG_FILE_PATH = path.join(process.cwd(), "app", "data", "admin-config.json");

// Helper to read config
function getAdminConfig(): any {
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
function getMessages() {
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
function saveMessages(messages: any[]) {
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
    // Check Authorization Password for Admin reading messages
    const passwordHeader = request.headers.get("x-admin-password");
    const config = getAdminConfig();

    if (passwordHeader !== config.password) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const messages = getMessages();
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

    const messages = getMessages();
    const newMessage = {
      id: String(Date.now()),
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    };

    messages.unshift(newMessage); // Add new message to the beginning
    const success = saveMessages(messages);

    if (!success) {
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
    }

    // Direct SMTP Email sending via nodemailer
    const config = getAdminConfig();
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
    const config = getAdminConfig();

    if (passwordHeader !== config.password) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
    }

    const messages = getMessages();
    const filtered = messages.filter((m: any) => m.id !== id);
    const success = saveMessages(filtered);

    if (!success) {
      return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Message deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
