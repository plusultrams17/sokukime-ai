/**
 * Process examples HTML:
 * 1. Wrap consecutive dialogue lines in .dialogue containers.
 * 2. Wrap speaker names (営業：, お客様：, etc.) with colored span tags.
 */
export function processExamplesHtml(html: string): string {
  // Step 1: Wrap speaker names with colored spans
  let processed = html
    .replace(
      /(<p><strong>)(営業(?:[\s\u3000]*[（(].*?[）)])?[\s\u3000]*[：:])(<\/strong>)/g,
      '$1<span class="speaker-sales">$2</span>$3'
    )
    .replace(
      /(<p><strong>)((?:お客様|顧客|相手|客)(?:[\s\u3000]*[（(].*?[）)])?[\s\u3000]*[：:])(<\/strong>)/g,
      '$1<span class="speaker-customer">$2</span>$3'
    )
    .replace(
      /(<p>)(営業(?:[\s\u3000]*[（(].*?[）)])?[\s\u3000]*[：:])(?!<\/strong>)/g,
      '$1<span class="speaker-sales">$2</span>'
    )
    .replace(
      /(<p>)((?:お客様|顧客|相手|客)(?:[\s\u3000]*[（(].*?[）)])?[\s\u3000]*[：:])(?!<\/strong>)/g,
      '$1<span class="speaker-customer">$2</span>'
    );

  // Step 2: Wrap consecutive dialogue lines in .dialogue containers
  const lines = processed.split("\n");
  const result: string[] = [];
  let inDialogue = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Dialogue starter: lines with role labels (check both raw and span-wrapped)
    const isDialogueStart =
      /^<p>(?:<strong>)?(?:<span class="speaker-(?:sales|customer)">)?(?:営業|お客様|顧客|相手|客)/.test(line);
    // Stage directions only continue an existing dialogue
    const isStageDirection =
      /^<p><em>[^<]*<\/em><\/p>$/.test(line);

    const canContinue = isDialogueStart || (inDialogue && isStageDirection);

    // Skip if already wrapped
    if (line.includes('class="dialogue"') || line.includes('class="example-')) {
      if (inDialogue) {
        result.push("</div>");
        inDialogue = false;
      }
      result.push(lines[i]);
      continue;
    }

    if (isDialogueStart && !inDialogue) {
      inDialogue = true;
      result.push('<div class="dialogue">');
      result.push(lines[i]);
    } else if (canContinue && inDialogue) {
      result.push(lines[i]);
    } else if (!canContinue && inDialogue) {
      if (line === "") {
        result.push(lines[i]);
      } else {
        result.push("</div>");
        inDialogue = false;
        result.push(lines[i]);
      }
    } else {
      result.push(lines[i]);
    }
  }

  if (inDialogue) {
    result.push("</div>");
  }

  return result.join("\n");
}
