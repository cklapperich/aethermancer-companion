import termDictionary from '../../public/data/term-dictionary.json';

/**
 * Colorizes terms in skill descriptions based on the term dictionary.
 * Wraps matching terms with span elements that have the appropriate color class.
 *
 * @param description The skill description text (may contain HTML)
 * @returns Colorized HTML string
 */
export function colorizeDescription(description: string): string {
  // Sort terms by length (longest first) to match longer terms before shorter ones
  // This prevents "Water" from matching before "Water Damage"
  const terms = Object.keys(termDictionary).sort((a, b) => b.length - a.length);

  let result = description;

  for (const term of terms) {
    const colorClass = termDictionary[term as keyof typeof termDictionary];

    // Create a regex that matches the term as a whole word
    // Negative lookbehind/lookahead to avoid matching inside HTML tags or already colored spans
    const regex = new RegExp(
      `(?<!<[^>]*)(\\b${escapeRegex(term)}\\b)(?![^<]*>)`,
      'g'
    );

    // Replace with colored span
    result = result.replace(regex, `<span class="${colorClass}">$1</span>`);
  }

  return result;
}

/**
 * Escapes special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
