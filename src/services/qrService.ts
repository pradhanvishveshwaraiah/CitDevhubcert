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
  if (pathname.endsWith('.html') || pathname.endsWith('.htm')) {
    pathname = pathname.substring(0, pathname.lastIndexOf('/') + 1);
  }

  // Ensure trailing slash so subpaths are preserved
  if (!pathname.endsWith('/')) {
    pathname += '/';
  }

  return `${origin}${pathname}`;
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
    return `${base}?event=${encodeURIComponent(slug)}#event/${encodeURIComponent(slug)}`;
  },

  /**
   * Gets absolute URL for certificate verification
   * Includes both query param (?verify=...) and hash (#verify/...) for 100% scanner & browser compatibility
   */
  getVerificationUrl(certId: string): string {
    const base = getAppBaseUrl();
    return `${base}?verify=${encodeURIComponent(certId)}#verify/${encodeURIComponent(certId)}`;
  },
};
