/**
 * Highly realistic transparent signatures faithfully matching the uploaded scanned signatures:
 * 1. Dr Srikantappa A S (Principal)
 * 2. Prof. Amos R (Head of Department - HOD)
 */

// Principal Signature: Dr Srikantappa A S
// Modeled directly from the uploaded reference signature with authentic fountain pen pressure and ink flow
export const PRINCIPAL_SIGNATURE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 180" width="100%" height="100%">
  <g fill="none" stroke="#0D1B2A" stroke-linecap="round" stroke-linejoin="round">
    <!-- Initial steep ascent loop for 'S' -->
    <path d="M 85 130 C 90 105, 102 48, 118 32 C 126 22, 134 26, 132 44 C 128 68, 112 108, 100 135" stroke-width="2.8" opacity="0.95" />
    
    <!-- Sharp tall needle ascender -->
    <path d="M 100 135 C 94 146, 84 148, 82 138 C 80 124, 98 94, 126 80 C 146 70, 158 48, 164 34 C 168 25, 175 28, 172 44 C 166 72, 148 106, 134 130" stroke-width="3.2" opacity="0.98" />
    
    <!-- Central dense cursive knot cluster (Srikantappa) -->
    <path d="M 134 130 C 128 136, 120 134, 122 122 C 126 104, 144 88, 162 92 C 176 96, 180 112, 170 124 C 158 138, 136 140, 124 130 C 110 118, 116 96, 134 84 C 150 72, 174 68, 190 78" stroke-width="2.6" opacity="0.92" />
    <path d="M 190 78 C 202 85, 208 104, 200 120 C 192 134, 178 136, 172 126 C 162 112, 174 88, 192 74 C 206 64, 218 50, 224 34 C 228 24, 236 28, 234 44 C 228 72, 214 108, 206 134" stroke-width="3.0" opacity="0.96" />
    
    <!-- Sharp horizontal upper crossing strike -->
    <path d="M 188 68 C 212 63, 238 58, 264 56 C 272 55, 266 68, 258 80 C 244 100, 226 120, 216 138" stroke-width="2.5" opacity="0.9" />
    
    <!-- Flowing terminal 'A S' lower loop flourish -->
    <path d="M 212 128 C 224 108, 240 90, 256 88 C 268 86, 274 96, 268 112 C 258 134, 234 148, 220 152 C 210 155, 214 142, 228 134 C 246 125, 270 124, 292 130 C 304 133, 312 140, 308 150 C 302 158, 290 160, 280 154" stroke-width="2.8" opacity="0.95" />
    
    <!-- Under-accent loop tail -->
    <path d="M 252 114 C 264 116, 274 126, 276 140 C 278 152, 268 162, 258 160 C 248 158, 244 144, 250 132" stroke-width="2.4" opacity="0.9" />
  </g>
</svg>`;

// HOD Signature: Prof. Amos R
// Modeled directly from the uploaded reference signature with distinct horizontal entry, high 'A' crest, and terminal underline dot
export const HOD_SIGNATURE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 180" width="100%" height="100%">
  <g fill="none" stroke="#0D1B2A" stroke-linecap="round" stroke-linejoin="round">
    <!-- Distinct long horizontal entry stroke from left -->
    <path d="M 45 82 C 78 80, 114 78, 146 77" stroke-width="3.2" opacity="0.96" />
    
    <!-- Sharp upward crest and loop for capital 'A' -->
    <path d="M 146 77 C 158 74, 168 54, 166 40 C 164 26, 152 24, 146 36 C 140 48, 142 68, 148 90 C 154 112, 156 126, 150 138 C 146 145, 138 147, 136 140 C 133 128, 145 106, 160 92" stroke-width="3.2" opacity="0.98" />
    
    <!-- Connecting cursive waves (mos) -->
    <path d="M 160 92 C 174 80, 190 78, 204 80 C 214 82, 216 92, 212 102 C 206 112, 194 122, 182 124 C 170 126, 168 114, 176 104 C 186 94, 200 92, 214 94 C 226 96, 234 94, 246 91" stroke-width="2.7" opacity="0.92" />
    
    <!-- Horizontal flourish line -->
    <path d="M 178 90 C 202 88, 230 85, 258 85 C 272 85, 280 90, 274 98 C 266 106, 254 104, 244 100" stroke-width="2.6" opacity="0.9" />
    
    <!-- Terminal accent dot matching the scanned mark -->
    <circle cx="242" cy="128" r="3.2" fill="#0D1B2A" />
  </g>
</svg>`;

export function signatureSvgToDataUrl(svg: string): string {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

export const PRINCIPAL_SIGNATURE_DATA_URL = signatureSvgToDataUrl(PRINCIPAL_SIGNATURE_SVG);
export const HOD_SIGNATURE_DATA_URL = signatureSvgToDataUrl(HOD_SIGNATURE_SVG);
