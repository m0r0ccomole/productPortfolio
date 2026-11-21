// Fills {placeholder} tokens in a label read from XML, e.g.
// fillLabel('{minutes} min read', { minutes: 4 }) gives '4 min read'.
// Unknown tokens are left as written so a typo in XML stays visible.
export function fillLabel(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (token, name: string) =>
    name in values ? String(values[name]) : token
  );
}
