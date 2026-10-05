import QRCode from 'qrcode';

/**
 * Accurately determines the base URL of the deployed application,
 * taking into account GitHub Pages repository subpaths (e.g., https://username.github.io/repo-name/),
 * custom domains, and local preview environments.
 */
export function getAppBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  let pathname = window.location.pathname;

  // Remove any file names like index.html or 404.html
  pathname = pathname.replace(/\/[^/]+\.html?$/i, '/');

  // Ensure trailing slash so subpaths are preserved
  if (!pathname.endsWith('/')) {
    pathname += '/';
  }

  return `${origin}${pathname}`;
}

export interface VerificationMeta {
  name?: string;
  event?: string;
  date?: string;
  mode?: string;
}

export const QRService = {
  /**
   * Generates a high-resolution QR code as a Data URL (PNG)
   */
  async generateQRDataUrl(text: string, size = 300): Promise<string> {
    try {
      return await QRCode.toDataURL(text, {
        width: size,
        margin: 1.5,
        color: {
          dark: '#0A1E3F',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      });
    } catch (err) {
      console.error('Error generating QR code:', err);
      return '';
    }
  },

  /**
   * Gets absolute URL for an event
   */
  getEventUrl(slug: string): string {
    const base = getAppBaseUrl();
    const cleanSlug = encodeURIComponent(slug.trim());
    return `${base}?event=${cleanSlug}#event/${cleanSlug}`;
  },

  /**
   * Gets absolute URL for certificate verification.
   * Embeds verification metadata into the URL query parameters so that
   * ANY smartphone on ANY network scanning this QR code can instantly verify
   * and view the authentic certificate, even without pre-existing local storage.
   */
  getVerificationUrl(certId: string, meta?: VerificationMeta): string {
    const base = getAppBaseUrl();
    const cleanId = encodeURIComponent(certId.trim().toUpperCase());
    const params = new URLSearchParams();
    params.set('verify', certId.trim().toUpperCase());

    if (meta?.name) {
      params.set('n', meta.name.trim());
    }
    if (meta?.event) {
      params.set('e', meta.event.trim());
    }
    if (meta?.date) {
      params.set('d', meta.date.trim());
    }
    if (meta?.mode) {
      params.set('m', meta.mode.trim());
    }

    return `${base}?${params.toString()}#verify/${cleanId}`;
  },
};
