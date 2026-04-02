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
const outputDir = path.join(__dirname, "..", "public", "images", "ba");
fs.mkdirSync(outputDir, { recursive: true });

const images = [
  // Before cards (frustrated, struggling, negative mood)
  {
    slug: "before-01",
    prompt: "Flat minimal illustration of a lonely young Japanese salesperson sitting at a desk looking frustrated, wanting to practice but no one is available, empty office chairs around, muted desaturated red-gray tones, soft pastel style, no text"
  },
  {
    slug: "before-02",
    prompt: "Flat minimal illustration of a nervous young Japanese salesperson standing outside a client's door sweating and trembling with anxiety before a sales meeting, muted desaturated red-gray tones, soft pastel style, no text"
  },
  {
    slug: "before-03",
    prompt: "Flat minimal illustration of a confused young Japanese salesperson at a desk with a single speech bubble and question marks, unable to handle client objections, muted desaturated red-gray tones, soft pastel style, no text"
  },
  {
    slug: "before-04",
    prompt: "Flat minimal illustration of a puzzled young Japanese salesperson looking at a blank whiteboard with a question mark, not knowing their own weaknesses, muted desaturated red-gray tones, soft pastel style, no text"
  },
  // After cards (confident, empowered, positive mood)
  {
    slug: "after-01",
    prompt: "Flat minimal illustration of a happy young Japanese salesperson practicing with an AI chatbot on their laptop at any time of day, clock showing late night, bright cheerful green tones, soft pastel style, no text"
  },
  {
    slug: "after-02",
    prompt: "Flat minimal illustration of a confident young Japanese salesperson walking into a client meeting with a big smile and confident posture, bright cheerful green tones, soft pastel style, no text"
  },
  {
    slug: "after-03",
    prompt: "Flat minimal illustration of a skilled young Japanese salesperson confidently handling multiple speech bubbles with checkmarks, mastering sales techniques, bright cheerful green tones, soft pastel style, no text"
  },
  {
    slug: "after-04",
    prompt: "Flat minimal illustration of a young Japanese salesperson looking at a clear analytics dashboard with scores and charts showing their strengths and weaknesses, bright cheerful green tones, soft pastel style, no text"
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

async function generateImage(item) {
  const outPath = path.join(outputDir, `${item.slug}.png`);
  if (fs.existsSync(outPath)) {
    console.log(`  [skip] ${item.slug} — already exists`);
    return;
  }

  console.log(`  [gen]  ${item.slug}...`);
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: item.prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });
    const url = response.data[0].url;
    await downloadFile(url, outPath);
    console.log(`  [done] ${item.slug}`);
  } catch (err) {
    console.error(`  [err]  ${item.slug}: ${err.message}`);
  }
}

async function main() {
  console.log(`Generating ${images.length} Before/After images with DALL-E 3...\n`);
  for (const item of images) {
    await generateImage(item);
  }
  console.log("\nAll done!");
}

main();
