import QRCode from 'qrcode';

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
    const origin = window.location.origin;
    return `${origin}/#event/${slug}`;
  },

  /**
   * Gets absolute URL for certificate verification
   */
  getVerificationUrl(certId: string): string {
    const origin = window.location.origin;
    return `${origin}/#verify/${certId}`;
  },
};
