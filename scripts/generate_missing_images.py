"""Generate the 6 missing objection-handbook images."""
import os, base64, json
from openai import OpenAI

# Read API key from .env.local
env_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
api_key = None
with open(env_path, encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if line.startswith('OPENAI_API_KEY='):
            api_key = line.split('=', 1)[1].strip().strip('"').strip("'")
            break

if not api_key:
    raise RuntimeError("OPENAI_API_KEY not found in .env.local")

client = OpenAI(api_key=api_key)
output_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'pages')

STYLE = "Flat vector icon illustration, minimal clean style, orange (#f97316) and dark navy (#0a0f1a) color scheme, white background, no text, square format"

images_to_generate = [
    ("objection-timing", "Clock with hourglass representing timing and deadline pressure in sales negotiations"),
    ("objection-consider", "Person with thought bubble and question marks representing hesitation and consideration in sales"),
    ("objection-competitor", "Two buildings side by side with comparison arrows representing competitive comparison in sales"),
    ("objection-noneed", "Person with crossed arms and X mark representing rejection and no-need objection in sales"),
    ("objection-distrust", "Shield with caution symbol representing distrust and anxiety in sales negotiations"),
    ("objection-badge", "Shield with checkmark badge representing objection handling expertise in sales"),
]

for name, desc in images_to_generate:
    filepath = os.path.join(output_dir, f"{name}.png")
    if os.path.exists(filepath):
        print(f"SKIP (exists): {name}")
        continue

    prompt = f"{STYLE}. {desc}"
    print(f"Generating: {name}...")

    try:
        result = client.images.generate(
            model="gpt-image-1",
            prompt=prompt,
            size="1024x1024",
            quality="medium",
        )
        image_data = base64.b64decode(result.data[0].b64_json)
        with open(filepath, 'wb') as f:
            f.write(image_data)
        print(f"  OK: {filepath}")
    except Exception as e:
        print(f"  ERROR with gpt-image-1: {e}")
        try:
            result = client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
                quality="standard",
            )
            import urllib.request
            urllib.request.urlretrieve(result.data[0].url, filepath)
            print(f"  OK (dall-e-3 fallback): {filepath}")
        except Exception as e2:
            print(f"  FAILED: {e2}")

print("Done!")
