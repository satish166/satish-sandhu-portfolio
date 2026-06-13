import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import fs from "fs";
import path from "path";
import crypto from "crypto";

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

function verifyWebAuthnSignature(
  publicKeyDerBase64: string,
  signatureBase64: string,
  authenticatorDataHex: string,
  clientDataJSONString: string
): boolean {
  try {
    const publicKeyDer = Buffer.from(publicKeyDerBase64, "base64");
    
    const pemKey = [
      "-----BEGIN PUBLIC KEY-----",
      publicKeyDer.toString("base64").match(/.{1,64}/g)?.join("\n") || "",
      "-----END PUBLIC KEY-----"
    ].join("\n");

    const clientDataJSONHash = crypto
      .createHash("sha256")
      .update(Buffer.from(clientDataJSONString, "utf8"))
      .digest();
      
    const authenticatorData = Buffer.from(authenticatorDataHex, "hex");
    const verifyData = Buffer.concat([authenticatorData, clientDataJSONHash]);
    
    const signature = Buffer.from(signatureBase64, "base64");

    return crypto.verify(
      "sha256",
      verifyData,
      pemKey,
      signature
    );
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkBiometric = searchParams.get("checkBiometric");

    const config = await getAdminConfig();

    if (checkBiometric) {
      const hasBiometric = !!(config.biometric && config.biometric.credentialId && config.biometric.publicKey);
      return NextResponse.json({ hasBiometric });
    }

    const passwordHeader = request.headers.get("x-admin-password");

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
    const { action } = body;

    const config = await getAdminConfig();

    if (action === "webauthn-register-options") {
      const passwordHeader = request.headers.get("x-admin-password");
      if (passwordHeader !== config.password) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const hostHeader = request.headers.get("host") || "localhost";
      const rpId = hostHeader.split(":")[0];

      const challenge = crypto.randomBytes(32).toString("base64");
      
      const options = {
        challenge,
        rp: { name: "Satish Portfolio", id: rpId },
        user: {
          id: Buffer.from("admin-user-id-satish").toString("base64"),
          name: "sandhusatish166@gmail.com",
          displayName: "Satish Kumar"
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" }, // ES256
          { alg: -257, type: "public-key" } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required"
        },
        timeout: 60000
      };
      
      return NextResponse.json(options);
    }

    if (action === "request-reset") {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000;

      config.resetCode = {
        code,
        expiresAt
      };

      const success = await saveAdminConfig(config);
      if (!success) {
        return NextResponse.json({ error: "Failed to save reset configuration" }, { status: 500 });
      }

      if (config.smtpHost && config.smtpUser && config.smtpPass) {
        try {
          const nodemailer = await import("nodemailer");
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
            from: `"Portfolio Auth" <${config.smtpUser}>`,
            to: config.smtpReceiver || "sandhusatish166@gmail.com",
            subject: "Portfolio Passcode Reset Verification Code",
            text: `A request was made to reset your portfolio admin passcode.\n\nYour 6-digit verification code is: ${code}\n\nThis code has also been sent to your mobile phone number 8278860269.\n\nThis code expires in 10 minutes.`
          });
        } catch (err: any) {
          console.error("Failed to send reset code email:", err);
        }
      }

      console.log(`\n==================================================`);
      console.log(`[SMS OTP SENT TO 8278860269]: ${code}`);
      console.log(`==================================================\n`);

      return NextResponse.json({ success: true, message: "Verification code sent to 8278860269 successfully" });
    }

    if (action === "verify-code") {
      const { code } = body;
      if (!code) {
        return NextResponse.json({ error: "Code is required" }, { status: 400 });
      }

      if (!config.resetCode || config.resetCode.code !== code || Date.now() > config.resetCode.expiresAt) {
        return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: "Code verified successfully" });
    }

    if (action === "verify-reset") {
      const { code, newPassword } = body;
      if (!code || !newPassword) {
        return NextResponse.json({ error: "Code and new password are required" }, { status: 400 });
      }

      if (!config.resetCode || config.resetCode.code !== code || Date.now() > config.resetCode.expiresAt) {
        return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
      }

      if (newPassword.length < 4) {
        return NextResponse.json({ error: "Password must be at least 4 characters long" }, { status: 400 });
      }

      config.password = newPassword;
      delete config.resetCode;

      const success = await saveAdminConfig(config);
      if (!success) {
        return NextResponse.json({ error: "Failed to update configuration" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Passcode updated successfully!" });
    }

    if (action === "get-users") {
      const passwordHeader = request.headers.get("x-admin-password");
      const usernameHeader = request.headers.get("x-admin-username");
      if (passwordHeader !== config.password || (usernameHeader && usernameHeader !== "admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.json(config.users || []);
    }

    if (action === "add-user") {
      const passwordHeader = request.headers.get("x-admin-password");
      const usernameHeader = request.headers.get("x-admin-username");
      if (passwordHeader !== config.password || (usernameHeader && usernameHeader !== "admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { user } = body;
      if (!user || !user.username || !user.password || !user.permission) {
        return NextResponse.json({ error: "Invalid user details" }, { status: 400 });
      }

      const users = config.users || [];
      if (users.some((u: any) => u.username.toLowerCase() === user.username.toLowerCase())) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
      }

      users.push({
        username: user.username,
        password: user.password,
        permission: user.permission
      });

      config.users = users;
      const success = await saveAdminConfig(config);
      if (!success) {
        return NextResponse.json({ error: "Failed to save user" }, { status: 500 });
      }

      return NextResponse.json({ success: true, users });
    }

    if (action === "delete-user") {
      const passwordHeader = request.headers.get("x-admin-password");
      const usernameHeader = request.headers.get("x-admin-username");
      if (passwordHeader !== config.password || (usernameHeader && usernameHeader !== "admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { usernameToDelete } = body;
      if (!usernameToDelete) {
        return NextResponse.json({ error: "Username to delete is required" }, { status: 400 });
      }

      let users = config.users || [];
      users = users.filter((u: any) => u.username.toLowerCase() !== usernameToDelete.toLowerCase());

      config.users = users;
      const success = await saveAdminConfig(config);
      if (!success) {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
      }

      return NextResponse.json({ success: true, users });
    }

    if (action === "update-user") {
      const passwordHeader = request.headers.get("x-admin-password");
      const usernameHeader = request.headers.get("x-admin-username");
      if (passwordHeader !== config.password || (usernameHeader && usernameHeader !== "admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { usernameToUpdate, permission } = body;
      if (!usernameToUpdate || !permission) {
        return NextResponse.json({ error: "Username and permission are required" }, { status: 400 });
      }

      let users = config.users || [];
      const userIndex = users.findIndex((u: any) => u.username.toLowerCase() === usernameToUpdate.toLowerCase());
      if (userIndex === -1) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      users[userIndex].permission = permission;
      config.users = users;

      const success = await saveAdminConfig(config);
      if (!success) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
      }

      return NextResponse.json({ success: true, users });
    }

    if (action === "webauthn-register-verify") {
      const passwordHeader = request.headers.get("x-admin-password");
      if (passwordHeader !== config.password) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { credentialId, publicKey } = body;
      if (!credentialId || !publicKey) {
        return NextResponse.json({ error: "Invalid registration data" }, { status: 400 });
      }

      config.biometric = {
        credentialId,
        publicKey
      };

      const success = await saveAdminConfig(config);
      if (!success) {
        return NextResponse.json({ error: "Failed to save biometric configuration" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Biometrics registered successfully" });
    }

    if (action === "webauthn-login-options") {
      if (!config.biometric || !config.biometric.credentialId) {
        return NextResponse.json({ error: "No biometric credential registered" }, { status: 400 });
      }

      const challenge = crypto.randomBytes(32).toString("base64");
      
      const options = {
        challenge,
        allowCredentials: [
          {
            id: config.biometric.credentialId,
            type: "public-key"
          }
        ],
        userVerification: "required",
        timeout: 60000
      };

      return NextResponse.json(options);
    }

    if (action === "webauthn-login-verify") {
      const { credentialId, signatureBase64, authenticatorDataHex, clientDataJSON } = body;
      if (!config.biometric || config.biometric.credentialId !== credentialId) {
        return NextResponse.json({ error: "Invalid credential" }, { status: 400 });
      }

      const verified = verifyWebAuthnSignature(
        config.biometric.publicKey,
        signatureBase64,
        authenticatorDataHex,
        clientDataJSON
      );

      if (!verified) {
        return NextResponse.json({ error: "Biometric signature verification failed" }, { status: 401 });
      }

      return NextResponse.json({ success: true, password: config.password });
    }

    // Default password/user login
    const { username, password } = body;
    if (username) {
      const users = config.users || [];
      const matchedUser = users.find(
        (u: any) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );
      if (matchedUser) {
        return NextResponse.json({ 
          success: true, 
          username: matchedUser.username, 
          permission: matchedUser.permission 
        });
      } else {
        return NextResponse.json({ error: "Incorrect username or password" }, { status: 401 });
      }
    } else {
      if (password === config.password) {
        return NextResponse.json({ 
          success: true, 
          username: "admin", 
          permission: "Full Access" 
        });
      } else {
        return NextResponse.json({ error: "Incorrect passcode" }, { status: 401 });
      }
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { newPassword, reset, smtpHost, smtpPort, smtpUser, smtpPass, smtpReceiver, removeBiometric } = body;

    const config = await getAdminConfig();

    if (reset) {
      const success = await saveAdminConfig({ password: "Sandhu@123" });
      if (!success) {
        return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: "Password reset to default successfully!" });
    }

    const passwordHeader = request.headers.get("x-admin-password");
    const usernameHeader = request.headers.get("x-admin-username");

    if (passwordHeader !== config.password || (usernameHeader && usernameHeader !== "admin")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    if (removeBiometric) {
      if (config.biometric) {
        delete config.biometric;
      }
      const success = await saveAdminConfig(config);
      if (!success) {
        return NextResponse.json({ error: "Failed to update configuration" }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: "Biometrics removed successfully!" });
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
