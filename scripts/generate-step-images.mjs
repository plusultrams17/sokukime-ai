import OpenAI from "openai";
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
for (const line of envContent.split(/\r?\n/)) {
  const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const outputDir = path.join(__dirname, "..", "public", "images", "steps");
fs.mkdirSync(outputDir, { recursive: true });

const steps = [
  {
    slug: "step-01",
    prompt: "Flat minimal illustration of a person typing on a laptop, entering business information into a clean form interface, warm friendly colors, pastel background, no text, simple clean modern style"
  },
  {
    slug: "step-02",
    prompt: "Flat minimal illustration of a salesperson having a conversation with an AI chatbot on a screen, speech bubbles between them, warm friendly colors, pastel background, no text, simple clean modern style"
  },
  {
    slug: "step-03",
    prompt: "Flat minimal illustration of a performance scorecard dashboard showing charts and star ratings with a checkmark, warm friendly colors, pastel background, no text, simple clean modern style"
  },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(dest);
    mod.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", (err) => {
      fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function generateImage(step) {
  const outPath = path.join(outputDir, `${step.slug}.png`);
  if (fs.existsSync(outPath)) {
    console.log(`  [skip] ${step.slug} — already exists`);
    return;
  }

  console.log(`  [gen]  ${step.slug}...`);
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: step.prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });
    const url = response.data[0].url;
    await downloadFile(url, outPath);
    console.log(`  [done] ${step.slug}`);
  } catch (err) {
    console.error(`  [err]  ${step.slug}: ${err.message}`);
  }
}

async function main() {
  console.log(`Generating ${steps.length} step images with DALL-E 3...\n`);
  for (const step of steps) {
    await generateImage(step);
  }
  console.log("\nAll done!");
}

main();
