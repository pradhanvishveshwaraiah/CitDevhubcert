import { jsPDF } from 'jspdf';
import { CertificateTemplate } from '../types';
import { CITDEVHUB_LOGO_SVG, drawMCADepartmentLogo } from '../assets/logos';
import { QRService } from './qrService';

export interface GeneratePdfOptions {
  participantName: string;
  eventName: string;
  eventDate: string;
  certificateId: string;
  template: CertificateTemplate;
  qrDataUrl?: string;
}

// Convert SVG string to HTMLImageElement
function svgToImage(svgString: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

function dataUrlToImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = dataUrl;
  });
}

/**
 * Draws the high-resolution certificate on an HTML5 canvas (2970 x 2100 px = 10x A4 landscape)
 * This is used for both crisp real-time web rendering and sharp PDF exports.
 */
export async function renderCertificateToCanvas(
  canvas: HTMLCanvasElement,
  options: GeneratePdfOptions
): Promise<void> {
  const { participantName, eventName, eventDate, certificateId, template } = options;

  // High resolution: 2970 x 2100 (standard 300 DPI for A4 landscape 297mm x 210mm)
  canvas.width = 2970;
  canvas.height = 2100;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle patterned background or clean micro tint
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#FFFFFF');
  gradient.addColorStop(0.5, '#FAFCFF');
  gradient.addColorStop(1, '#F3F8FD');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Borders
  // Outer border - LinkedIn Blue
  ctx.strokeStyle = template.primaryColor || '#0A66C2';
  ctx.lineWidth = 14;
  ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

  // Inner border - Gold Accent
  ctx.strokeStyle = template.accentColor || '#E69C24';
  ctx.lineWidth = 4;
  ctx.strokeRect(84, 84, canvas.width - 168, canvas.height - 168);

  // Delicate corner ornaments
  const cornerSize = 48;
  const drawCorner = (x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = template.accentColor || '#E69C24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(cornerSize, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, cornerSize);
    ctx.stroke();
    ctx.fillStyle = template.primaryColor || '#0A66C2';
    ctx.beginPath();
    ctx.arc(10, 10, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawCorner(96, 96, 0);
  drawCorner(canvas.width - 96, 96, Math.PI / 2);
  drawCorner(canvas.width - 96, canvas.height - 96, Math.PI);
  drawCorner(96, canvas.height - 96, -Math.PI / 2);

  // 3. Logos
  try {
    // Left Logo: CITDEVHUB Student Club Logo (240x240 at x=140, y=130)
    const leftLogoImg = await svgToImage(CITDEVHUB_LOGO_SVG);
    ctx.drawImage(leftLogoImg, 140, 130, 240, 240);

    // Right Logo: Department of Computer Applications Logo
    // Rendered directly via vector math to guarantee 100% precision matching image.png
    drawMCADepartmentLogo(ctx, canvas.width - 260, 250, 120);
  } catch (err) {
    console.warn('Could not draw logos directly, fallback gracefully', err);
  }

  // 4. Header Titles (Centered between logos)
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Institution
  ctx.font = "bold 44px 'Plus Jakarta Sans', Arial, sans-serif";
  ctx.fillStyle = '#0F1E36';
  ctx.fillText(template.institutionName.toUpperCase(), canvas.width / 2, 170);

  // Department
  ctx.font = "600 32px 'Plus Jakarta Sans', Arial, sans-serif";
  ctx.fillStyle = '#334155';
  ctx.fillText(template.departmentName, canvas.width / 2, 230);

  // Club Name with decorative accent
  ctx.font = "800 30px 'Plus Jakarta Sans', Arial, sans-serif";
  ctx.fillStyle = template.primaryColor || '#0A66C2';
  ctx.fillText(template.clubName.toUpperCase(), canvas.width / 2, 285);

  // Thin decorative separator
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 300, 325);
  ctx.lineTo(canvas.width / 2 + 300, 325);
  ctx.stroke();

  // Diamond in center of separator
  ctx.fillStyle = template.accentColor || '#E69C24';
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 325, 5, 0, Math.PI * 2);
  ctx.fill();

  // 5. Certificate Title
  ctx.font = "bold 68px 'Cinzel', 'Times New Roman', Georgia, serif";
  ctx.fillStyle = '#0A1E3F';
  ctx.fillText(template.title.toUpperCase(), canvas.width / 2, 450);

  // Subtitle
  ctx.font = "italic 400 34px 'Playfair Display', Georgia, serif";
  ctx.fillStyle = '#475569';
  ctx.fillText(template.subtitle, canvas.width / 2, 540);

  // 6. Participant Name (Dominant focal point)
  ctx.font = "bold 88px 'Playfair Display', Georgia, serif";
  ctx.fillStyle = template.primaryColor || '#0A66C2';
  ctx.fillText(participantName, canvas.width / 2, 690);

  // Underline beneath participant name
  ctx.strokeStyle = template.accentColor || '#E69C24';
  ctx.lineWidth = 3;
  ctx.beginPath();
  const nameWidth = Math.min(ctx.measureText(participantName).width + 80, 1400);
  ctx.moveTo(canvas.width / 2 - nameWidth / 2, 755);
  ctx.lineTo(canvas.width / 2 + nameWidth / 2, 755);
  ctx.stroke();

  // Small center pip under name
  ctx.fillStyle = template.primaryColor || '#0A66C2';
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 755, 6, 0, Math.PI * 2);
  ctx.fill();

  // 7. Event Statement
  ctx.font = "400 33px 'Plus Jakarta Sans', Arial, sans-serif";
  ctx.fillStyle = '#334155';
  
  // Wrap or format the participation statement nicely
  const line1 = `for actively participating in the workshop`;
  const line2 = `"${eventName}"`;
  const line3 = `organized by Student Club – CITDEVHUB, Department of Computer Applications, Cauvery Institute of Technology.`;

  ctx.fillText(line1, canvas.width / 2, 850);
  ctx.font = "bold 44px 'Plus Jakarta Sans', Arial, sans-serif";
  ctx.fillStyle = '#0F1E36';
  ctx.fillText(line2, canvas.width / 2, 925);
  ctx.font = "400 30px 'Plus Jakarta Sans', Arial, sans-serif";
  ctx.fillStyle = '#475569';
  ctx.fillText(line3, canvas.width / 2, 1000);

  // 8. Event Date & Certificate ID Bar
  ctx.font = "500 26px 'Plus Jakarta Sans', Arial, sans-serif";
  ctx.fillStyle = '#64748B';
  const formattedDate = eventDate ? new Date(eventDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'October 2026';
  ctx.fillText(`Event Date: ${formattedDate}   |   Certificate ID: ${certificateId}`, canvas.width / 2, 1140);

  // 9. QR Code for Instant Verification (Lower center/right)
  let qrImg: HTMLImageElement | null = null;
  const qrUrl = options.qrDataUrl || (await QRService.generateQRDataUrl(QRService.getVerificationUrl(certificateId), 200));
  if (qrUrl) {
    try {
      qrImg = await dataUrlToImage(qrUrl);
      ctx.drawImage(qrImg, canvas.width - 360, 1220, 190, 190);
      ctx.font = "600 20px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillStyle = '#64748B';
      ctx.fillText('Scan to Verify', canvas.width - 265, 1435);
      ctx.font = "400 16px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText(certificateId, canvas.width - 265, 1460);
    } catch {
      // ignore
    }
  }

  // 10. EXACT THREE ENDORSEMENT SECTIONS AT BOTTOM
  // Positions: Left (Principal), Center (HOD), Right (Club Lead)
  // Clean, official typography with no signature drawings as requested
  const sigY = 1730;
  const col1X = 540;            // Principal
  const col2X = canvas.width / 2; // HOD
  const col3X = canvas.width - 540; // Club Lead

  const drawEndorsementBlock = (
    x: number,
    name: string,
    designation: string,
    subtext: string
  ) => {
    // Signatory Name in refined serif
    ctx.font = "bold 34px 'Playfair Display', Georgia, serif";
    ctx.fillStyle = '#0F1E36';
    ctx.fillText(name, x, sigY);

    // Title / Designation in primary brand blue
    ctx.font = "bold 23px 'Plus Jakarta Sans', Arial, sans-serif";
    ctx.fillStyle = template.primaryColor || '#0A66C2';
    ctx.fillText(designation, x, sigY + 44);

    // Institution / Department / Club subtitle
    ctx.font = "500 19px 'Plus Jakarta Sans', Arial, sans-serif";
    ctx.fillStyle = '#64748B';
    ctx.fillText(subtext, x, sigY + 80);
  };

  const sigs = template.signatures;

  // 1. Principal
  if (sigs.principal.enabled) {
    drawEndorsementBlock(
      col1X,
      sigs.principal.name || 'Dr Srikantappa A S',
      'Principal',
      'Cauvery Institute of Technology, Mandya'
    );
  }

  // 2. Head of Department (HOD)
  if (sigs.hod.enabled) {
    drawEndorsementBlock(
      col2X,
      sigs.hod.name || 'Prof. Amos R',
      'Head of the Department (HOD)',
      'Department of Computer Applications'
    );
  }

  // 3. Club Lead (Pradhan V)
  if (sigs.clubLead.enabled) {
    drawEndorsementBlock(
      col3X,
      sigs.clubLead.name || 'Pradhan V',
      'Club Lead, CIT DevHub',
      'Student Club – CITDEVHUB'
    );
  }
}

/**
 * Generates an A4 Landscape print-ready PDF using jsPDF
 */
export async function downloadCertificatePdf(options: GeneratePdfOptions): Promise<void> {
  const canvas = document.createElement('canvas');
  await renderCertificateToCanvas(canvas, options);

  // Standard A4 landscape dimensions: 297mm x 210mm
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);

  const cleanFileName = `CITDEVHUB_Certificate_${options.participantName.replace(/[^a-zA-Z0-9]/g, '_')}_${options.certificateId}.pdf`;
  pdf.save(cleanFileName);
}
