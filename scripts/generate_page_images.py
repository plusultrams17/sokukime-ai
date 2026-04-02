"""
全ページの絵文字→画像置き換え用スクリプト
about, features, scoring, scenarios, coach, use-cases, objection-handbook
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

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'pages')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Style prefix for consistency
STYLE = "Flat vector icon illustration, minimal clean style, orange (#f97316) and dark navy (#0a0f1a) color scheme, white background, no text, no words, simple and modern"

IMAGES = [
    # === about/page.tsx - values ===
    ("about-value-practice",
     f"{STYLE}. A bullseye target with an arrow hitting center, surrounded by repeating practice arrows. Concept: mastery through repetition and practice."),
    ("about-value-datadriven",
     f"{STYLE}. A dashboard with bar charts, line graphs, and a magnifying glass analyzing data points. Concept: data-driven improvement."),
    ("about-value-accessible",
     f"{STYLE}. A smartphone with a 24h clock and a person practicing anywhere - on a train, at home, in bed. Concept: accessible anytime anywhere."),

    # === about/page.tsx - problems ===
    ("about-problem-burden",
     f"{STYLE}. A junior employee hesitating to ask a busy senior colleague for roleplay practice, looking stressed. Concept: burden of asking others."),
    ("about-problem-unprepared",
     f"{STYLE}. A nervous salesperson walking into a meeting room unprepared, with sweat drops and a worried expression. Concept: going unprepared to meetings."),
    ("about-problem-unknown",
     f"{STYLE}. A person surrounded by question marks, looking confused, unable to identify their weak points. Concept: unknown weaknesses."),

    # === about/page.tsx - related links ===
    ("about-link-features",
     f"{STYLE}. A wrench and gear icon representing tools and features, with a settings/configuration concept."),
    ("about-link-usecases",
     f"{STYLE}. A briefcase with multiple business scenario icons radiating from it. Concept: various business use cases."),
    ("about-link-method",
     f"{STYLE}. An open book with a lightbulb above it, knowledge flowing out. Concept: learning methodology."),
    ("about-link-pricing",
     f"{STYLE}. A price tag with yen symbol and a balanced scale showing value vs cost. Concept: pricing and value."),

    # === features/page.tsx ===
    ("feature-roleplay",
     f"{STYLE}. Theater masks (comedy/tragedy) with AI circuit patterns, representing AI roleplay simulation. A salesperson and customer facing each other."),
    ("feature-coach",
     f"{STYLE}. A glowing brain with neural network connections and a coaching whistle. Concept: AI coaching intelligence."),
    ("feature-scoring",
     f"{STYLE}. A radar chart with 5 axes showing scores, with a grade badge (like S-rank). Concept: multi-dimensional scoring."),

    # === features/scoring/page.tsx - hero + cards ===
    ("scoring-hero",
     f"{STYLE}. A large radar/pentagon chart with 5 dimensions, each with a score bar, glowing with orange accents. Concept: comprehensive scoring system."),
    ("scoring-total",
     f"{STYLE}. A rising bar chart with a trophy/medal showing overall rank achievement. Concept: total score and ranking."),
    ("scoring-feedback",
     f"{STYLE}. A clipboard with categorized checklist items and detailed feedback notes. Concept: category-by-category feedback."),
    ("scoring-strength",
     f"{STYLE}. A flexed arm muscle with a star badge, showing strength and strong points. Concept: identifying strengths."),
    ("scoring-improve",
     f"{STYLE}. A bullseye target with an arrow and an upward improvement arrow. Concept: specific improvement points to work on."),

    # === features/scenarios/page.tsx - hero + scenes + customer types ===
    ("scenario-hero",
     f"{STYLE}. Theater/drama masks with customization sliders and settings icons. Concept: customizable roleplay scenarios."),
    ("scenario-phone",
     f"{STYLE}. A telephone handset with sound waves and a conversation bubble. Concept: phone sales/telemarketing scenario."),
    ("scenario-visit",
     f"{STYLE}. A house door being opened with a friendly salesperson arriving with a briefcase. Concept: door-to-door/visit sales."),
    ("scenario-inbound",
     f"{STYLE}. An inbox/email envelope opening with a customer inquiry flowing in. Concept: inbound inquiry response."),
    ("scenario-individual",
     f"{STYLE}. A single person silhouette as a consumer/individual customer. Concept: individual customer persona."),
    ("scenario-executive",
     f"{STYLE}. A business suit with a tie and a CEO/executive nameplate. Concept: company owner/executive customer."),
    ("scenario-manager",
     f"{STYLE}. A chart presentation to a manager figure with approval authority. Concept: department manager customer."),
    ("scenario-staff",
     f"{STYLE}. A person raising hand in a meeting, representing a regular employee. Concept: staff-level customer who needs to escalate."),

    # === features/coach/page.tsx - hero + features ===
    ("coach-hero",
     f"{STYLE}. A glowing brain with coaching arrows and real-time analysis waves. Concept: real-time AI coaching during conversation."),
    ("coach-step",
     f"{STYLE}. A location pin/marker on a progress path showing 5 steps. Concept: current step indicator in sales process."),
    ("coach-detect",
     f"{STYLE}. A checkmark badge detecting patterns from conversation text. Concept: automatic technique detection from speech."),
    ("coach-suggest",
     f"{STYLE}. A lightbulb with an arrow pointing to the next action item. Concept: next action suggestion/recommendation."),
    ("coach-example",
     f"{STYLE}. A speech bubble with a copy icon and example text lines. Concept: copyable example phrases for sales techniques."),

    # === use-cases/page.tsx ===
    ("usecase-newbie",
     f"{STYLE}. A young new employee with a 'NEW' badge practicing with an AI robot partner. Concept: new hire training with AI."),
    ("usecase-team",
     f"{STYLE}. A group of business people with unified upward arrows and score meters. Concept: team skill improvement together."),
    ("usecase-freelance",
     f"{STYLE}. A solo entrepreneur/freelancer at a desk with a laptop and AI practice partner. Concept: solo business owner self-practice."),
    ("usecase-teleapo",
     f"{STYLE}. A phone headset with rapid-fire conversation bubbles and a calendar appointment icon. Concept: telephone appointment setting practice."),

    # === tools/objection-handbook/page.tsx - categories ===
    ("objection-price",
     f"{STYLE}. A price tag with yen symbol and a concerned customer face. Concept: price/cost objection category."),
    ("objection-timing",
     f"{STYLE}. A clock with a 'later' arrow, customer pushing decision to the future. Concept: timing/postponement objection."),
    ("objection-consider",
     f"{STYLE}. A thinking person with chin on hand, thought bubble with question marks. Concept: consideration/hold objection."),
    ("objection-competitor",
     f"{STYLE}. Multiple company buildings being compared side by side with versus arrows. Concept: competitor comparison objection."),
    ("objection-noneed",
     f"{STYLE}. A hand making a stop/rejection gesture with an X mark. Concept: no need/rejection objection."),
    ("objection-distrust",
     f"{STYLE}. A worried/anxious face with a shield and question mark. Concept: distrust/anxiety objection."),
    ("objection-badge",
     f"{STYLE}. A shield with 30 comeback speech bubbles arranged around it. Concept: 30 objection handling patterns."),
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

    print(f"=== Page Image Generator ===")
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
