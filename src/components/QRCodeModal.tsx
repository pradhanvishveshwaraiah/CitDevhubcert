import React, { useEffect, useState } from 'react';
import { X, Download, Copy, Check, Printer, ExternalLink, QrCode } from 'lucide-react';
import { QRService } from '../services/qrService';
import { EventItem } from '../types';

interface QRCodeModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ event, isOpen, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const eventUrl = QRService.getEventUrl(event.slug);

  useEffect(() => {
    if (isOpen) {
      QRService.generateQRDataUrl(eventUrl, 400).then((url) => {
        setQrDataUrl(url);
      });
    }
  }, [isOpen, eventUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `CITDEVHUB_QR_${event.slug}.png`;
    link.click();
  };

  const handlePrintPoster = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please allow popups to print poster.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Poster - ${event.title}</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              text-align: center;
              margin: 0;
              padding: 20px;
              color: #0F172A;
            }
            .border-wrap {
              border: 8px double #0A66C2;
              padding: 30px;
              border-radius: 12px;
              min-height: 90vh;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              box-sizing: border-box;
            }
            .college {
              font-size: 26px;
              font-weight: 800;
              color: #0A1E3F;
              letter-spacing: 1px;
              margin-bottom: 4px;
            }
            .dept {
              font-size: 18px;
              color: #475569;
              margin-bottom: 6px;
            }
            .club {
              font-size: 16px;
              font-weight: 700;
              color: #0A66C2;
              letter-spacing: 2px;
            }
            .divider {
              width: 120px;
              height: 3px;
              background: #E69C24;
              margin: 20px auto;
            }
            .title {
              font-size: 32px;
              font-weight: 800;
              margin: 15px 0 8px;
              color: #0A1E3F;
            }
            .subtitle {
              font-size: 20px;
              color: #475569;
              margin-bottom: 25px;
            }
            .qr-box {
              margin: 20px auto;
              padding: 20px;
              background: #FAFCFF;
              border: 2px solid #E2E8F0;
              border-radius: 16px;
              display: inline-block;
            }
            .qr-img {
              width: 320px;
              height: 320px;
              display: block;
            }
            .instruction {
              font-size: 22px;
              font-weight: 700;
              color: #0A66C2;
              margin-top: 20px;
            }
            .url-text {
              font-size: 14px;
              color: #64748B;
              font-family: monospace;
              margin-top: 8px;
            }
            .footer-info {
              font-size: 13px;
              color: #94A3B8;
              border-top: 1px solid #E2E8F0;
              padding-top: 15px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="border-wrap">
            <div>
              <div class="college">CAUVERY INSTITUTE OF TECHNOLOGY</div>
              <div class="dept">Department of Computer Applications</div>
              <div class="club">STUDENT CLUB – CITDEVHUB</div>
              <div class="divider"></div>
              <div class="title">${event.title}</div>
              <div class="subtitle">${event.subtitle || 'Hands-on Technical Session'}</div>
            </div>

            <div>
              <div class="qr-box">
                <img class="qr-img" src="${qrDataUrl}" alt="Event QR" />
              </div>
              <div class="instruction">Scan QR Code to Download Your Certificate</div>
              <div class="url-text">${eventUrl}</div>
            </div>

            <div class="footer-info">
              Venue: ${event.venue} &nbsp;|&nbsp; Date: ${event.eventDate} &nbsp;|&nbsp; CITDEVHUB Certificate Portal
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#0A66C2]" />
            <h3 className="font-bold text-slate-900 text-sm">Event QR Code &amp; Poster</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="mb-4">
            <h4 className="font-bold text-slate-900 text-lg leading-snug">{event.title}</h4>
            <p className="text-xs text-slate-500 mt-1">
              Event Slug: <span className="font-mono text-slate-700">/{event.slug}</span>
            </p>
          </div>

          {/* QR Display */}
          <div className="inline-block p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner mb-4">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code for ${event.title}`}
                className="w-56 h-56 mx-auto rounded-lg"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
                Generating QR...
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 mb-6">
            Participants scan this code in the seminar hall to open their event certificate page.
          </p>

          {/* URL Input Box */}
          <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200 mb-5 text-left">
            <span className="text-xs text-slate-600 truncate font-mono flex-1 px-1">
              {eventUrl}
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1 shrink-0 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Download PNG</span>
            </button>

            <button
              onClick={handlePrintPoster}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white font-semibold text-xs shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print A4 Poster</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
