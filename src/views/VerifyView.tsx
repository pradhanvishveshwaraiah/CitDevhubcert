import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  Calendar,
  User,
  Building,
  Award,
  Download,
  AlertTriangle,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import { IssuedCertificate } from '../types';
import { StorageService } from '../services/storage';
import { CertificateCanvas } from '../components/CertificateCanvas';
import { CITDEVHUB_LOGO_DATA_URL, MCA_DEPT_LOGO_DATA_URL } from '../assets/logos';

interface VerifyViewProps {
  initialCertId?: string;
  onSelectEvent?: (slug: string) => void;
}

export const VerifyView: React.FC<VerifyViewProps> = ({ initialCertId, onSelectEvent }) => {
  const [searchId, setSearchId] = useState(initialCertId || '');
  const [certificate, setCertificate] = useState<IssuedCertificate | null>(null);
  const [searched, setSearched] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  useEffect(() => {
    if (initialCertId) {
      setSearchId(initialCertId);
      performSearch(initialCertId);
    }
  }, [initialCertId]);

  const performSearch = (idToSearch: string) => {
    const cleanId = idToSearch.trim();
    if (!cleanId) return;

    setSearched(true);
    const cert = StorageService.getCertificateById(cleanId);
    setCertificate(cert || null);
    setShowPreview(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchId);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0A66C2] flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Official Credential Verification
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Verify the authenticity and current validity status of any certificate issued by
            Student Club CITDEVHUB &amp; Department of Computer Applications, Cauvery Institute of Technology.
          </p>
        </div>

        {/* Search Bar Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Certificate ID e.g. CITDH-2026-7F82A9C1"
                className="w-full pl-12 pr-4 py-3.5 text-sm sm:text-base border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A66C2] font-mono uppercase bg-slate-50/50"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#0A66C2] hover:bg-[#084e96] text-white font-semibold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Verify Record</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>Try sample issued IDs:</span>
            <button
              type="button"
              onClick={() => {
                setSearchId('CITDH-2026-7F82A9C1');
                performSearch('CITDH-2026-7F82A9C1');
              }}
              className="font-mono text-[#0A66C2] hover:underline bg-blue-50 px-2 py-0.5 rounded"
            >
              CITDH-2026-7F82A9C1 (B. Aashreetha)
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchId('CITDH-2026-2E198C44');
                performSearch('CITDH-2026-2E198C44');
              }}
              className="font-mono text-[#0A66C2] hover:underline bg-blue-50 px-2 py-0.5 rounded"
            >
              CITDH-2026-2E198C44 (Chetan M)
            </button>
          </div>
        </div>

        {/* Verification Result */}
        {searched && (
          <div className="animate-fade-in">
            {certificate ? (
              <div
                className={`bg-white rounded-3xl border shadow-sm overflow-hidden ${
                  certificate.revoked
                    ? 'border-red-300 ring-4 ring-red-50'
                    : 'border-emerald-300 ring-4 ring-emerald-50'
                }`}
              >
                {/* Result Header Banner */}
                <div
                  className={`px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${
                    certificate.revoked
                      ? 'bg-red-50/80 border-red-200 text-red-900'
                      : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {certificate.revoked ? (
                      <ShieldAlert className="w-7 h-7 text-red-600 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                    )}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider">
                        {certificate.revoked ? 'CREDENTIAL REVOKED' : 'VALID & AUTHENTIC CERTIFICATE'}
                      </div>
                      <div className="text-sm font-semibold mt-0.5 font-mono">
                        {certificate.certificateId}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs sm:text-right font-medium text-slate-600">
                    <div>Issued on: {new Date(certificate.issuedAt).toLocaleDateString()}</div>
                    <div className="text-[11px] text-slate-500">
                      Mode: {certificate.mode === 'approved_attendees' ? 'Verified Attendance' : 'Self-Service'}
                    </div>
                  </div>
                </div>

                {/* Revocation Warning Box if revoked */}
                {certificate.revoked && (
                  <div className="p-4 bg-red-100/60 border-b border-red-200 flex items-start gap-3 text-xs text-red-800">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Notice of Administrative Revocation:</div>
                      <div>
                        {certificate.revocationReason || 'This certificate has been revoked by institutional authority.'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Verified Metadata Grid */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                        Recipient Name
                      </div>
                      <div className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                        <User className="w-5 h-5 text-[#0A66C2]" />
                        <span>{certificate.participantName}</span>
                      </div>
                      {certificate.regId && (
                        <div className="text-xs text-slate-500 font-mono mt-1">
                          Attendee Code: {certificate.regId}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                        Event / Workshop Title
                      </div>
                      <div className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                        <Award className="w-5 h-5 text-[#0A66C2]" />
                        <span>{certificate.eventTitle}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Conducted on: {new Date(certificate.eventDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                        Issuing Institution
                      </div>
                      <div className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-500" />
                        <span>Cauvery Institute of Technology, Mandya</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Department of Computer Applications (MCA)
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                        Organizing Student Club
                      </div>
                      <div className="text-sm font-semibold text-slate-800 mt-1">
                        Student Club – CITDEVHUB
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Signatories: Principal, HOD, Club Lead (Pradhan V)
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="px-4 py-2 text-xs font-semibold text-[#0A66C2] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      {showPreview ? 'Hide Certificate Preview' : 'View High-Resolution Certificate'}
                    </button>

                    <div className="flex items-center gap-3">
                      {onSelectEvent && (
                        <button
                          onClick={() => {
                            const evt = StorageService.getEventById(certificate.eventId);
                            if (evt) onSelectEvent(evt.slug);
                          }}
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          View Event Details
                        </button>
                      )}
                    </div>
                  </div>

                  {/* High Resolution Preview Accordion */}
                  {showPreview && (
                    <div className="pt-6 border-t border-slate-200">
                      <CertificateCanvas
                        participantName={certificate.participantName}
                        eventName={certificate.eventTitle}
                        eventDate={certificate.eventDate}
                        certificateId={certificate.certificateId}
                        template={certificate.templateSnapshot}
                        showDownloadButton={!certificate.revoked}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Invalid or Not Found State */
              <div className="bg-white rounded-3xl border border-red-200 p-8 text-center shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Certificate Record Not Found
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                  No certificate matching the identifier <strong className="font-mono text-slate-900">{searchId}</strong> was found in the official registry. Please check the spelling or scan the QR code on the certificate.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
