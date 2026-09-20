/**
 * Utilitários de renderização de insígnias e escudos esportivos.
 * Implementa fallback procedural vetorial em SVG para resiliência de rede e CORS.
 */

export function generateTeamBadgeSvg(
  abbreviation: string,
  primaryColor: string,
  secondaryColor: string,
  textColor: string = '#FFFFFF'
): string {
  const cleanAbbr = abbreviation.slice(0, 4).toUpperCase();
  const safeId = `grad-${cleanAbbr.replace(/[^a-zA-Z0-9]/g, '')}-${primaryColor.replace('#', '')}`;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="${safeId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}" />
      <stop offset="100%" stop-color="${secondaryColor}" />
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="46" fill="url(#${safeId})" stroke="${secondaryColor}" stroke-width="4" />
  <circle cx="50" cy="50" r="40" fill="none" stroke="${primaryColor}" stroke-width="2" stroke-dasharray="4 2" />
  <text x="50" y="58" font-family="'JetBrains Mono', monospace" font-size="${cleanAbbr.length > 3 ? '22' : '28'}" font-weight="900" text-anchor="middle" fill="${textColor}" letter-spacing="-1">${cleanAbbr}</text>
</svg>
  `.trim();
}

/**
 * Converte o SVG para uma URI de dados utilizável diretamente em tags <img src="...">
 */
export function getTeamBadgeDataUri(
  abbreviation: string,
  primaryColor: string,
  secondaryColor: string,
  textColor: string = '#FFFFFF'
): string {
  const svg = generateTeamBadgeSvg(abbreviation, primaryColor, secondaryColor, textColor);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
