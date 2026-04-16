const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '\u2070',
  '1': '\u00b9',
  '2': '\u00b2',
  '3': '\u00b3',
  '4': '\u2074',
  '5': '\u2075',
  '6': '\u2076',
  '7': '\u2077',
  '8': '\u2078',
  '9': '\u2079',
  '+': '\u207a',
  '-': '\u207b',
  '=': '\u207c',
  '(': '\u207d',
  ')': '\u207e',
  x: '\u02e3',
  n: '\u207f',
};

function toSuperscript(value: string) {
  return value
    .split('')
    .map((character) => SUPERSCRIPT_MAP[character] ?? character)
    .join('');
}

export function formatFormulaForDisplay(input: string) {
  return input
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\sin/g, 'sin')
    .replace(/\\cos/g, 'cos')
    .replace(/\\ln/g, 'ln')
    .replace(/\^\{([^}]+)\}/g, (_match, exponent: string) => toSuperscript(exponent))
    .replace(/\^([A-Za-z0-9+\-=()]+)/g, (_match, exponent: string) => toSuperscript(exponent))
    .replace(/->/g, '\u2192')
    .replace(/>=/g, '\u2265')
    .replace(/<=/g, '\u2264');
}
