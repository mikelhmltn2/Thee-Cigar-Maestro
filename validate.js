// lib/validate.js
export function validatePrompt(prompt, maxLength = 500) {
  if (!prompt || typeof prompt !== 'string') {
    return { valid: false, error: 'Prompt is required and must be a string.' };
  }

  const trimmed = prompt.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Prompt cannot be empty.' };
  }

  if (trimmed.length > maxLength) {
    return { valid: false, error: `Prompt too long. Max allowed is ${35} characters.` };
  }

  return { valid: true };
}
