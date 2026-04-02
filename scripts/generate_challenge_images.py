"""
業種別チャレンジカード画像生成スクリプト
OpenAI gpt-image-1 (DALL-E) で48枚の画像を生成
"""
import os
import base64
import time
import json
from openai import OpenAI

# .env.local から OPENAI_API_KEY を読み取り
def load_env():
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
    with open(env_path, encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                os.environ.setdefault(key.strip(), val.strip())

load_env()
client = OpenAI()

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'challenges')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 全48チャレンジカード: (slug, index, filename, prompt)
CHALLENGES = [
    # === 1. 保険 (insurance) ===
    ("insurance", 0, "insurance-1-needs-awareness",
     "Flat vector icon illustration: a businessman giving a presentation with a magnifying glass examining a family's life risks. Warm orange and dark navy color scheme, minimal clean style, white background, no text"),
    ("insurance", 1, "insurance-2-competitor-differentiation",
     "Flat vector icon illustration: multiple office buildings with comparison arrows, one highlighted in orange standing out from grey competitors. Minimal clean style, white background, no text"),
    ("insurance", 2, "insurance-3-consideration-wall",
     "Flat vector icon illustration: a clock with a thought bubble showing 'thinking' gesture, a person hesitating at a desk. Orange and dark navy color scheme, minimal clean style, white background, no text"),

    # === 2. 不動産 (real-estate) ===
    ("real-estate", 0, "realestate-1-high-price-decision",
     "Flat vector icon illustration: a house with a large price tag and a couple looking worried with thought bubbles. Orange and navy color scheme, minimal clean style, white background, no text"),
    ("real-estate", 1, "realestate-2-proposal-beyond-specs",
     "Flat vector icon illustration: a house blueprint transforming into a happy family scene with lifestyle images. Orange and navy, minimal clean style, white background, no text"),
    ("real-estate", 2, "realestate-3-competitor-comparison",
     "Flat vector icon illustration: multiple property cards being compared side by side with a magnifying glass. Orange and navy, minimal clean style, white background, no text"),

    # === 3. リフォーム (reform) ===
    ("reform", 0, "reform-1-competing-estimates",
     "Flat vector icon illustration: three estimate documents stacked side by side with checkmarks and price tags. Orange and navy, minimal clean style, white background, no text"),
    ("reform", 1, "reform-2-needs-discovery",
     "Flat vector icon illustration: a person with a magnifying glass looking deeper beneath the surface of a house, revealing hidden needs. Orange and navy, minimal clean style, white background, no text"),
    ("reform", 2, "reform-3-price-resistance",
     "Flat vector icon illustration: a person looking concerned at a large estimate document with yen symbol, shield of confidence nearby. Orange and navy, minimal clean style, white background, no text"),

    # === 4. 外壁塗装 (exterior-painting) ===
    ("exterior-painting", 0, "painting-1-first-impression",
     "Flat vector icon illustration: a door opening with a friendly salesperson making a great first impression to a homeowner. Orange and navy, minimal clean style, white background, no text"),
    ("exterior-painting", 1, "painting-2-need-awareness",
     "Flat vector icon illustration: a house exterior with cracks and deterioration being pointed out with a target/bullseye icon. Orange and navy, minimal clean style, white background, no text"),
    ("exterior-painting", 2, "painting-3-distrust",
     "Flat vector icon illustration: a shield protecting a homeowner from suspicious door-to-door salesperson silhouettes. Orange and navy, minimal clean style, white background, no text"),

    # === 5. 太陽光 (solar) ===
    ("solar", 0, "solar-1-initial-cost",
     "Flat vector icon illustration: solar panels on a roof with a large yen coin and downward price arrow showing investment concern. Orange and navy, minimal clean style, white background, no text"),
    ("solar", 1, "solar-2-info-overload",
     "Flat vector icon illustration: a customer overwhelmed by multiple floating information screens and data, looking confused. Orange and navy, minimal clean style, white background, no text"),
    ("solar", 2, "solar-3-policy-changes",
     "Flat vector icon illustration: a bar chart with shifting arrows and policy document with update symbol. Orange and navy, minimal clean style, white background, no text"),

    # === 6. 自動車 (automotive) ===
    ("automotive", 0, "auto-1-temperature-check",
     "Flat vector icon illustration: a car dealer observing a customer in a showroom, with a thermometer gauge showing customer interest level. Orange and navy, minimal clean style, white background, no text"),
    ("automotive", 1, "auto-2-price-negotiation",
     "Flat vector icon illustration: two people at a desk with a car model between them, price tag with negotiation arrows. Orange and navy, minimal clean style, white background, no text"),
    ("automotive", 2, "auto-3-online-comparison",
     "Flat vector icon illustration: a smartphone showing car comparison website vs a friendly car dealer in person. Orange and navy, minimal clean style, white background, no text"),

    # === 7. 人材紹介 (recruitment) ===
    ("recruitment", 0, "recruit-1-cold-call",
     "Flat vector icon illustration: a phone with sound waves breaking through an office door barrier. Orange and navy, minimal clean style, white background, no text"),
    ("recruitment", 1, "recruit-2-deep-hearing",
     "Flat vector icon illustration: an interviewer with a magnifying glass uncovering hidden organizational needs behind a job posting. Orange and navy, minimal clean style, white background, no text"),
    ("recruitment", 2, "recruit-3-low-close-rate",
     "Flat vector icon illustration: a declining graph with candidate profiles slipping away, showing missed placements. Orange and navy, minimal clean style, white background, no text"),

    # === 8. IT/SaaS (it-saas) ===
    ("it-saas", 0, "saas-1-feature-trap",
     "Flat vector icon illustration: a presenter drowning in gear icons and feature lists, while the audience looks confused. Orange and navy, minimal clean style, white background, no text"),
    ("it-saas", 1, "saas-2-long-approval",
     "Flat vector icon illustration: a vertical chain of approval steps with multiple business people in a hierarchy. Orange and navy, minimal clean style, white background, no text"),
    ("it-saas", 2, "saas-3-trial-churn",
     "Flat vector icon illustration: a trial badge transforming into a fading exit door, showing customers leaving after free trial. Orange and navy, minimal clean style, white background, no text"),

    # === 9. 広告 (advertising) ===
    ("advertising", 0, "ad-1-roi-measurement",
     "Flat vector icon illustration: a bar chart with question marks showing difficulty measuring advertising ROI. Orange and navy, minimal clean style, white background, no text"),
    ("advertising", 1, "ad-2-budget-wall",
     "Flat vector icon illustration: a wallet being squeezed with scissors cutting ad budget, person defending the budget. Orange and navy, minimal clean style, white background, no text"),
    ("advertising", 2, "ad-3-presentation",
     "Flat vector icon illustration: a person presenting growth charts and compelling story to executives. Orange and navy, minimal clean style, white background, no text"),

    # === 10. 医療機器 (medical-devices) ===
    ("medical-devices", 0, "medical-1-short-meeting",
     "Flat vector icon illustration: a doctor in white coat checking watch with only 5 minutes on a timer, sales rep with brief pitch. Orange and navy, minimal clean style, white background, no text"),
    ("medical-devices", 1, "medical-2-key-persons",
     "Flat vector icon illustration: a hospital building with multiple connected stakeholder icons - doctor, nurse, administrator. Orange and navy, minimal clean style, white background, no text"),
    ("medical-devices", 2, "medical-3-evidence-based",
     "Flat vector icon illustration: a medical document with research data, clinical trial icons, and scientific proof checkmarks. Orange and navy, minimal clean style, white background, no text"),

    # === 11. 印刷 (printing) ===
    ("printing", 0, "print-1-price-war",
     "Flat vector icon illustration: printing price tags racing downward with a person trying to break free and add value. Orange and navy, minimal clean style, white background, no text"),
    ("printing", 1, "print-2-digital-shift",
     "Flat vector icon illustration: paper documents transforming into digital screens and tablets, showing industry transition. Orange and navy, minimal clean style, white background, no text"),
    ("printing", 2, "print-3-new-customers",
     "Flat vector icon illustration: a rocket launching from a printing press toward new customer icons, breaking through a wall. Orange and navy, minimal clean style, white background, no text"),

    # === 12. ブライダル (bridal) ===
    ("bridal", 0, "bridal-1-instant-decision",
     "Flat vector icon illustration: a wedding chapel with a ticking clock, couple at crossroads deciding now vs later. Orange and navy, minimal clean style, white background, no text"),
    ("bridal", 1, "bridal-2-couple-gap",
     "Flat vector icon illustration: a couple with different sized enthusiasm thought bubbles about a wedding venue. Orange and navy, minimal clean style, white background, no text"),
    ("bridal", 2, "bridal-3-premium-options",
     "Flat vector icon illustration: wedding items (flowers, dress, cake) with sparkle upgrade arrows showing premium options. Orange and navy, minimal clean style, white background, no text"),

    # === 13. SaaS営業 (saas-sales) ===
    ("saas-sales", 0, "saassales-1-internal-review",
     "Flat vector icon illustration: a corporate meeting room with 'under review' stamp, deal stuck in pipeline. Orange and navy, minimal clean style, white background, no text"),
    ("saas-sales", 1, "saassales-2-competitor-diff",
     "Flat vector icon illustration: crossed swords between two SaaS product icons, hard to tell apart. Orange and navy, minimal clean style, white background, no text"),
    ("saas-sales", 2, "saassales-3-trial-conversion",
     "Flat vector icon illustration: a free trial badge with a declining arrow showing low conversion to paid plan. Orange and navy, minimal clean style, white background, no text"),

    # === 14. 人材営業 (hr-sales) ===
    ("hr-sales", 0, "hr-1-rejection",
     "Flat vector icon illustration: a door being closed on a salesperson with 'no hiring' sign. Orange and navy, minimal clean style, white background, no text"),
    ("hr-sales", 1, "hr-2-differentiation",
     "Flat vector icon illustration: multiple identical staffing agency buildings, hard to differentiate, one trying to stand out. Orange and navy, minimal clean style, white background, no text"),
    ("hr-sales", 2, "hr-3-poor-matching",
     "Flat vector icon illustration: a resume and job description misaligned with gap indicator, showing poor matching. Orange and navy, minimal clean style, white background, no text"),

    # === 15. 教育・スクール (education) ===
    ("education", 0, "edu-1-family-consultation",
     "Flat vector icon illustration: parents and child having a discussion with thought bubbles, parent unsure about enrollment. Orange and navy, minimal clean style, white background, no text"),
    ("education", 1, "edu-2-price-resistance",
     "Flat vector icon illustration: a tuition fee document with yen symbols making a parent frown, comparison bubbles. Orange and navy, minimal clean style, white background, no text"),
    ("education", 2, "edu-3-post-trial",
     "Flat vector icon illustration: a student leaving a trial class happy but walking past the enrollment desk without signing up. Orange and navy, minimal clean style, white background, no text"),

    # === 16. 物販営業 (retail-sales) ===
    ("retail-sales", 0, "retail-1-door-rejection",
     "Flat vector icon illustration: a front door closing on a door-to-door salesperson with a dismissive hand gesture. Orange and navy, minimal clean style, white background, no text"),
    ("retail-sales", 1, "retail-2-lost-contact",
     "Flat vector icon illustration: a phone with no signal and unanswered messages after an estimate was sent. Orange and navy, minimal clean style, white background, no text"),
    ("retail-sales", 2, "retail-3-estimate-loss",
     "Flat vector icon illustration: multiple competing estimate documents with the lowest price winning, others losing. Orange and navy, minimal clean style, white background, no text"),
]

# 進捗ファイル
PROGRESS_FILE = os.path.join(OUTPUT_DIR, '_progress.json')

def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_progress(progress):
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(progress, f, indent=2)

def generate_image(prompt, filename):
    """OpenAI Image Generation APIで画像を生成"""
    try:
        result = client.images.generate(
            model="gpt-image-1",
            prompt=prompt,
            size="1024x1024",
            quality="medium",
        )
        # gpt-image-1 returns base64
        image_base64 = result.data[0].b64_json
        filepath = os.path.join(OUTPUT_DIR, f"{filename}.png")
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(image_base64))
        return True
    except Exception as e:
        print(f"  ERROR: {e}")
        # Fallback to dall-e-3
        try:
            print(f"  Trying dall-e-3 fallback...")
            result = client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
                quality="standard",
                response_format="b64_json",
            )
            image_base64 = result.data[0].b64_json
            filepath = os.path.join(OUTPUT_DIR, f"{filename}.png")
            with open(filepath, "wb") as f:
                f.write(base64.b64decode(image_base64))
            return True
        except Exception as e2:
            print(f"  FALLBACK ERROR: {e2}")
            return False

def main():
    progress = load_progress()
    total = len(CHALLENGES)
    done = sum(1 for c in CHALLENGES if progress.get(c[2], False))

    print(f"=== Challenge Image Generator ===")
    print(f"Total: {total} images, Already done: {done}, Remaining: {total - done}")
    print(f"Output: {OUTPUT_DIR}")
    print()

    for i, (slug, idx, filename, prompt) in enumerate(CHALLENGES):
        if progress.get(filename, False):
            print(f"[{i+1}/{total}] SKIP (already done): {filename}")
            continue

        print(f"[{i+1}/{total}] Generating: {filename} ({slug} challenge #{idx+1})")
        success = generate_image(prompt, filename)

        if success:
            progress[filename] = True
            save_progress(progress)
            print(f"  OK -> {filename}.png")
        else:
            print(f"  FAILED: {filename}")

        # Rate limit: small delay between requests
        if i < total - 1:
            time.sleep(1)

    done_final = sum(1 for v in progress.values() if v)
    print(f"\n=== Done! {done_final}/{total} images generated ===")

if __name__ == "__main__":
    main()
