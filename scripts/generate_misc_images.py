"""
コスパ比較 + ツールセクションの画像生成スクリプト
OpenAI gpt-image-1 で8枚の画像を生成
"""
import os
import base64
import time
import json
from openai import OpenAI

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

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'misc')
os.makedirs(OUTPUT_DIR, exist_ok=True)

IMAGES = [
    # === コスパ比較セクション (pricing) ===
    ("comparison-training",
     "Flat vector icon illustration: a corporate training seminar room with a presenter at whiteboard and rows of seated business people. Professional blue and grey color scheme, minimal clean style, white background, no text"),
    ("comparison-consulting",
     "Flat vector icon illustration: a business consultant in a suit with a briefcase sitting across from a client at a desk, giving professional advice with charts. Navy and grey color scheme, minimal clean style, white background, no text"),
    ("comparison-senpai",
     "Flat vector icon illustration: two business colleagues doing a roleplay practice session, one acting as customer and another as salesperson, with speech bubbles. Warm blue and grey color scheme, minimal clean style, white background, no text"),
    ("comparison-ai-pro",
     "Flat vector icon illustration: a glowing AI robot assistant with orange energy aura, available 24/7 with a clock icon, helping a salesperson practice. Vibrant orange and dark navy color scheme, minimal clean style, white background, no text"),

    # === ツールセクション (tools) ===
    ("tool-sales-quiz",
     "Flat vector icon illustration: a diagnostic chart with 5 radar/spider chart axes showing sales skill assessment - approach, hearing, presentation, closing, objection handling. Orange and navy color scheme, minimal clean style, white background, no text"),
    ("tool-script-generator",
     "Flat vector icon illustration: a document with a magic wand auto-generating a sales talk script with 5 steps flowing from top to bottom. Orange and navy color scheme, minimal clean style, white background, no text"),
    ("tool-objection-handbook",
     "Flat vector icon illustration: a shield with speech bubbles showing comeback responses to common sales objections, organized in a reference book format. Orange and navy color scheme, minimal clean style, white background, no text"),
    ("tool-closing-calculator",
     "Flat vector icon illustration: a calculator with pie charts and bar graphs showing closing rate analysis and benchmarks, with upward improvement arrows. Orange and navy color scheme, minimal clean style, white background, no text"),
]

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
    try:
        result = client.images.generate(
            model="gpt-image-1",
            prompt=prompt,
            size="1024x1024",
            quality="medium",
        )
        image_base64 = result.data[0].b64_json
        filepath = os.path.join(OUTPUT_DIR, f"{filename}.png")
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(image_base64))
        return True
    except Exception as e:
        print(f"  ERROR: {e}")
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
    total = len(IMAGES)
    done = sum(1 for img in IMAGES if progress.get(img[0], False))

    print(f"=== Misc Image Generator ===")
    print(f"Total: {total}, Already done: {done}, Remaining: {total - done}")
    print(f"Output: {OUTPUT_DIR}")
    print()

    for i, (filename, prompt) in enumerate(IMAGES):
        if progress.get(filename, False):
            print(f"[{i+1}/{total}] SKIP: {filename}")
            continue

        print(f"[{i+1}/{total}] Generating: {filename}")
        success = generate_image(prompt, filename)

        if success:
            progress[filename] = True
            save_progress(progress)
            print(f"  OK -> {filename}.png")
        else:
            print(f"  FAILED: {filename}")

        if i < total - 1:
            time.sleep(1)

    done_final = sum(1 for v in progress.values() if v)
    print(f"\n=== Done! {done_final}/{total} images generated ===")

if __name__ == "__main__":
    main()
