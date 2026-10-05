import React, { useEffect, useRef, useState } from 'react';
import { Download, ZoomIn, ZoomOut, RotateCcw, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { CertificateTemplate } from '../types';
import { renderCertificateToCanvas, downloadCertificatePdf } from '../services/pdfGenerator';
import { QRService } from '../services/qrService';

interface CertificateCanvasProps {
  participantName: string;
  eventName: string;
  eventDate: string;
  certificateId: string;
  template: CertificateTemplate;
  showDownloadButton?: boolean;
  onDownloaded?: () => void;
}

export const CertificateCanvas: React.FC<CertificateCanvasProps> = ({
  participantName,
  eventName,
  eventDate,
  certificateId,
  template,
  showDownloadButton = true,
  onDownloaded,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    async function render() {
      if (!canvasRef.current) return;
      setIsRendering(true);
      try {
        const qrUrl = await QRService.generateQRDataUrl(
          QRService.getVerificationUrl(certificateId, {
            name: participantName,
            event: eventName,
            date: eventDate,
          }),
          220
        );

        if (!isCancelled && canvasRef.current) {
          await renderCertificateToCanvas(canvasRef.current, {
            participantName: participantName || 'YOUR FULL NAME',
            eventName: eventName || 'CITDEVHUB WORKSHOP',
            eventDate,
            certificateId,
            template,
            qrDataUrl: qrUrl,
          });
        }
      } catch (err) {
        console.error('Error rendering certificate canvas:', err);
      } finally {
        if (!isCancelled) setIsRendering(false);
      }
    }

    render();

    return () => {
      isCancelled = true;
    };
  }, [participantName, eventName, eventDate, certificateId, template]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const qrUrl = await QRService.generateQRDataUrl(
        QRService.getVerificationUrl(certificateId, {
          name: participantName,
          event: eventName,
          date: eventDate,
        }),
        220
      );
      await downloadCertificatePdf({
        participantName: participantName || 'Participant',
        eventName,
        eventDate,
        certificateId,
        template,
        qrDataUrl: qrUrl,
      });
      setDownloadSuccess(true);
      if (onDownloaded) onDownloaded();
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Download error:', err);
      alert('Unable to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Interactive Controls Bar */}
      <div className="w-full flex items-center justify-between gap-3 mb-3 px-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0A66C2]" />
            Official A4 Landscape Layout
          </span>
          <span className="hidden sm:inline text-slate-400">·</span>
          <span className="hidden sm:inline text-slate-500 font-mono">
            {certificateId}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomScale((prev) => Math.max(0.7, prev - 0.1))}
            title="Zoom Out"
            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-slate-600 w-12 text-center">
            {Math.round(zoomScale * 100)}%
          </span>
          <button
            onClick={() => setZoomScale((prev) => Math.min(1.4, prev + 0.1))}
            title="Zoom In"
            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomScale(1)}
            title="Reset Zoom"
            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport Frame */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white p-2 sm:p-3">
        {isRendering && (
          <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-sm text-slate-700 font-medium">
            <Loader2 className="w-7 h-7 text-[#0A66C2] animate-spin" />
            <span>Rendering crisp vector certificate...</span>
          </div>
        )}

        <div
          className="w-full flex items-center justify-center overflow-auto transition-transform"
          style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-auto aspect-[297/210] max-h-[440px] object-contain rounded-lg shadow-inner"
          />
        </div>
      </div>

      {/* Download Action Footer */}
      {showDownloadButton && (
        <div className="w-full mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleDownload}
            disabled={isDownloading || !participantName.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-[#0A66C2] hover:bg-[#084e96] disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all text-base"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Print-Ready PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download Official Certificate PDF (A4)</span>
              </>
            )}
          </button>

          {downloadSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Downloaded! Ready for print &amp; LinkedIn upload.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
