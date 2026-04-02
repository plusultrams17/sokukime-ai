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
    // Remove surrounding quotes if any
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

console.log("API key found:", process.env.OPENAI_API_KEY ? "yes" : "no");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const outputDir = path.join(__dirname, "..", "public", "images", "industries");
fs.mkdirSync(outputDir, { recursive: true });

const industries = [
  { slug: "insurance", prompt: "Flat illustration of a professional insurance agent shaking hands with a happy family in a modern office, warm tones, minimal clean style, white background, no text" },
  { slug: "real-estate", prompt: "Flat illustration of a real estate agent showing a beautiful modern house to a young couple, keys and documents visible, warm tones, minimal clean style, white background, no text" },
  { slug: "reform", prompt: "Flat illustration of a home renovation scene with a contractor showing blueprints to a homeowner, tools and a renovated kitchen in background, warm tones, minimal clean style, white background, no text" },
  { slug: "exterior-painting", prompt: "Flat illustration of house exterior painting service, painters on scaffolding painting a house facade, bright colors, minimal clean style, white background, no text" },
  { slug: "solar", prompt: "Flat illustration of solar panel installation on a residential rooftop, a technician explaining to homeowner, sun shining, green energy concept, minimal clean style, white background, no text" },
  { slug: "automotive", prompt: "Flat illustration of a car dealership showroom, a salesperson presenting a new car to a customer, modern vehicles displayed, minimal clean style, white background, no text" },
  { slug: "recruitment", prompt: "Flat illustration of a recruitment consultant interviewing a candidate, professional office setting, resume and handshake, minimal clean style, white background, no text" },
  { slug: "it-saas", prompt: "Flat illustration of IT SaaS business, a tech salesperson presenting software dashboard on screen to business team, modern tech office, minimal clean style, white background, no text" },
  { slug: "advertising", prompt: "Flat illustration of advertising agency professionals presenting a campaign proposal with charts and creative materials to a client, minimal clean style, white background, no text" },
  { slug: "medical-devices", prompt: "Flat illustration of medical device sales, a representative demonstrating medical equipment to a doctor in a hospital setting, minimal clean style, white background, no text" },
  { slug: "printing", prompt: "Flat illustration of a printing company representative showing printed materials and catalogs to a business client, printing press in background, minimal clean style, white background, no text" },
  { slug: "bridal", prompt: "Flat illustration of a bridal wedding planner consulting with a happy couple, wedding dress and venue photos displayed, elegant and romantic atmosphere, minimal clean style, white background, no text" },
  { slug: "saas", prompt: "Flat illustration of SaaS cloud software sales, a presenter showing subscription plans on a laptop to business clients, cloud icons and analytics, minimal clean style, white background, no text" },
  { slug: "hr", prompt: "Flat illustration of HR consulting, a human resources consultant presenting talent management solutions to a company executive, charts and people icons, minimal clean style, white background, no text" },
  { slug: "education", prompt: "Flat illustration of education services sales, a representative presenting online learning platform to a school administrator, digital classroom elements, minimal clean style, white background, no text" },
  { slug: "retail", prompt: "Flat illustration of retail store management, a sales consultant helping a store owner optimize their shop display and inventory, products on shelves, minimal clean style, white background, no text" },
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

async function generateImage(industry) {
  const outPath = path.join(outputDir, `${industry.slug}.png`);
  if (fs.existsSync(outPath)) {
    console.log(`  [skip] ${industry.slug} — already exists`);
    return;
  }

  console.log(`  [gen]  ${industry.slug}...`);
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: industry.prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });
    const url = response.data[0].url;
    await downloadFile(url, outPath);
    console.log(`  [done] ${industry.slug}`);
  } catch (err) {
    console.error(`  [err]  ${industry.slug}: ${err.message}`);
  }
}

async function main() {
  console.log(`Generating ${industries.length} industry images with DALL-E 3...\n`);

  // Generate sequentially to respect rate limits
  for (const industry of industries) {
    await generateImage(industry);
  }

  console.log("\nAll done!");
}

main();
