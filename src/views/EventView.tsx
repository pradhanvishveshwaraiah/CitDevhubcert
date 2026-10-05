import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  QrCode,
  FileCheck,
  KeyRound,
} from 'lucide-react';
import { EventItem, ApprovedParticipant } from '../types';
import { StorageService, generateCertificateId } from '../services/storage';
import { CertificateCanvas } from '../components/CertificateCanvas';
import { QRCodeModal } from '../components/QRCodeModal';
import { CITDEVHUB_LOGO_DATA_URL, MCA_DEPT_LOGO_DATA_URL } from '../assets/logos';

interface EventViewProps {
  slug: string;
  onBack: () => void;
}

export const EventView: React.FC<EventViewProps> = ({ slug, onBack }) => {
  const [event, setEvent] = useState<EventItem | null>(null);
  const [participantName, setParticipantName] = useState<string>('');
  const [regCodeInput, setRegCodeInput] = useState<string>('');
  const [verifiedAttendee, setVerifiedAttendee] = useState<ApprovedParticipant | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeCertificateId, setActiveCertificateId] = useState<string>('');
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  useEffect(() => {
    const foundEvent = StorageService.getEventBySlug(slug);
    if (foundEvent) {
      setEvent(foundEvent);
      // Generate a preliminary preview ID
      setActiveCertificateId(generateCertificateId());
    }
  }, [slug]);

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Event Not Found</h2>
          <p className="text-xs text-slate-600 mt-2 mb-6">
            The workshop you requested does not exist or may have been updated.
          </p>
          <button
            onClick={onBack}
            className="px-5 py-2.5 bg-[#0A66C2] text-white text-xs font-semibold rounded-xl hover:bg-[#084e96]"
          >
            Return to Available Events
          </button>
        </div>
      </div>
    );
  }

  // Unpublished or Draft Event Guard
  if (event.status !== 'published') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Event Unavailable</h2>
          <p className="text-xs text-slate-600 mt-2 mb-6">
            This event is currently in {event.status} status and is not accepting public certificate requests.
          </p>
          <button
            onClick={onBack}
            className="px-5 py-2.5 bg-slate-800 text-white text-xs font-semibold rounded-xl hover:bg-slate-700"
          >
            View Other Events
          </button>
        </div>
      </div>
    );
  }

  // Coming Soon Guard
  if (event.hasCertificate === false || event.isComingSoon) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0A66C2] flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Certificate Coming Soon</h2>
          <p className="text-xs text-slate-600 mt-2 mb-6 leading-relaxed">
            Certificates for <strong>{event.title}</strong> will be opened once the technical workshop concludes.
          </p>
          <button
            onClick={onBack}
            className="px-5 py-2.5 bg-[#0A66C2] text-white text-xs font-semibold rounded-xl hover:bg-[#084e96]"
          >
            Explore Active Workshops
          </button>
        </div>
      </div>
    );
  }

  const isApprovedMode = event.eligibilityMode === 'approved_attendees';

  const handleVerifyAttendeeCode = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!regCodeInput.trim()) {
      setValidationError('Please enter your Attendee Code or Registration ID.');
      return;
    }

    const check = StorageService.validateAttendee(event.id, regCodeInput);
    if (!check.valid || !check.participant) {
      setValidationError(
        check.message || 'Registration Code not found. Please verify with your workshop coordinator.'
      );
      setVerifiedAttendee(null);
      return;
    }

    setVerifiedAttendee(check.participant);
    setParticipantName(check.participant.name);

    if (check.participant.issued && check.participant.certificateId) {
      setActiveCertificateId(check.participant.certificateId);
      setIsGenerated(true);
    }
  };

  const handleIssueAndFinalize = () => {
    if (!participantName.trim()) {
      setValidationError('Please enter your full name as it should appear on the certificate.');
      return;
    }

    if (participantName.trim().length < 2 || participantName.trim().length > 60) {
      setValidationError('Participant name must be between 2 and 60 characters.');
      return;
    }

    setValidationError(null);

    // Issue certificate record in backend storage
    const newCert = StorageService.issueCertificate({
      eventId: event.id,
      participantName: participantName.trim(),
      regId: verifiedAttendee?.regId,
    });

    setActiveCertificateId(newCert.certificateId);
    setIsGenerated(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0A66C2] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </button>

          <button
            onClick={() => setShowQrModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5 text-[#0A66C2]" />
            <span>Event QR &amp; Poster</span>
          </button>
        </div>

        {/* Event Header Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0A66C2]">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(event.eventDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {event.venue}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {event.title}
              </h1>

              {event.subtitle && (
                <p className="text-sm font-medium text-slate-500">
                  {event.subtitle}
                </p>
              )}

              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed pt-1">
                {event.description}
              </p>
            </div>

            {/* Quick Entity Badge */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3 shrink-0">
              <img
                src={CITDEVHUB_LOGO_DATA_URL}
                alt="Club"
                className="w-12 h-12 object-contain"
              />
              <div className="text-left text-xs">
                <span className="font-bold text-slate-800 block">CITDEVHUB</span>
                <span className="text-slate-500 block text-[11px]">Dept. of Computer Applications</span>
              </div>
              <img
                src={MCA_DEPT_LOGO_DATA_URL}
                alt="Department"
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Workflow Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Validation */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0A66C2] uppercase tracking-wider mb-1">
                <FileCheck className="w-4 h-4" />
                <span>Step 1: Participant Identity</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {isApprovedMode ? 'Verify Approved Attendance' : 'Personalize Your Certificate'}
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {isApprovedMode
                  ? 'This workshop enforces verified attendance. Enter your designated Attendee Code to retrieve your verified credential.'
                  : 'Enter your legal full name with accurate capitalization as you want it printed on your official document.'}
              </p>
            </div>

            {/* Error Message */}
            {validationError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Mode A: Approved Attendee Code Check */}
            {isApprovedMode ? (
              <div className="space-y-4">
                <form onSubmit={handleVerifyAttendeeCode} className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700">
                    Attendee Code / Registration ID
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regCodeInput}
                        onChange={(e) => setRegCodeInput(e.target.value)}
                        placeholder="e.g. CIT-AI-101"
                        className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A66C2] font-mono uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                    >
                      Verify
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Sample approved codes to test: <code className="font-mono text-slate-700">CIT-AI-101</code> (B. Aashreetha), <code className="font-mono text-slate-700">CIT-AI-103</code> (Ananya Sharma)
                  </p>
                </form>

                {verifiedAttendee && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Verified Attendee Record Found</span>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1">
                      <div>
                        <strong>Name:</strong> {verifiedAttendee.name}
                      </div>
                      <div>
                        <strong>Registration ID:</strong> <span className="font-mono">{verifiedAttendee.regId}</span>
                      </div>
                      {verifiedAttendee.email && (
                        <div>
                          <strong>Institution:</strong> {verifiedAttendee.college || 'Cauvery Institute of Technology'}
                        </div>
                      )}
                    </div>

                    {verifiedAttendee.issued && (
                      <div className="text-[11px] text-emerald-700 font-medium pt-1">
                        Certificate already issued with ID: <span className="font-mono">{verifiedAttendee.certificateId}</span>. You can re-download below.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Mode B: Open Self-Service Full Name Entry */
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Full Name (As printed on certificate)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={participantName}
                      onChange={(e) => {
                        setParticipantName(e.target.value);
                        setValidationError(null);
                      }}
                      placeholder="e.g. Rohith Gowda"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A66C2] text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-800 leading-relaxed">
                  <strong>Open Self-Service Mode:</strong> Certificates in this mode are issued for workshop participation based on user submission.
                </div>
              </div>
            )}

            {/* Generate Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleIssueAndFinalize}
                disabled={!participantName.trim()}
                className="w-full py-3 px-4 bg-[#0A66C2] hover:bg-[#084e96] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isGenerated ? 'Update & Refresh Certificate Preview' : 'Generate & Confirm Certificate'}
                </span>
              </button>
            </div>

            {/* Approved By Disclosure */}
            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700">Approved By:</div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                <li>Dr Srikantappa A S (Principal)</li>
                <li>Prof. Amos R (Head of Department)</li>
                <li>Pradhan V (Club Lead, CITDEVHUB)</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Live Interactive Canvas Preview */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm">
            <div className="mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0A66C2] uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-[#0A66C2]" />
                <span>Step 2: Instant High-DPI Preview</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Certificate Preview</h2>
              <p className="text-xs text-slate-500 mt-1">
                Live vector rendering showing authentic signatures, dual logos, and cryptographic QR code.
              </p>
            </div>

            <CertificateCanvas
              participantName={participantName || 'PARTICIPANT NAME'}
              eventName={event.title}
              eventDate={event.eventDate}
              certificateId={activeCertificateId}
              template={event.templateSnapshot}
              showDownloadButton={true}
              onDownloaded={() => {
                if (!isGenerated) {
                  handleIssueAndFinalize();
                }
              }}
            />
          </div>
        </div>
      </div>

      {showQrModal && (
        <QRCodeModal
          event={event}
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </div>
  );
};
