import React, { useState } from 'react';
import {
  Calendar,
  ShieldCheck,
  Search,
  ArrowRight,
  QrCode,
  Users,
  Award,
  Sparkles,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { EventItem } from '../types';
import { CITDEVHUB_LOGO_DATA_URL, MCA_DEPT_LOGO_DATA_URL } from '../assets/logos';
import { QRCodeModal } from '../components/QRCodeModal';

interface HomeViewProps {
  events: EventItem[];
  onSelectEvent: (slug: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  events,
  onSelectEvent,
}) => {
  const [selectedQrEvent, setSelectedQrEvent] = useState<EventItem | null>(null);

  const publishedEvents = events.filter((e) => e.status === 'published');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-100 bg-gradient-to-b from-white via-[#F9FBFE] to-[#F1F6FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Institutional Affiliation kicker */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0A66C2]">
                <span className="tracking-wide uppercase">Cauvery Institute of Technology</span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span>Dept. of Computer Applications</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Your Achievements,{' '}
                <span className="text-[#0A66C2] block sm:inline">One Certificate Away.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Access and download your verified certificates from CITDEVHUB workshops, technical symposiums,
                and hands-on bootcamps through one unified, print-ready platform.
              </p>

              {/* Primary CTA */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#events-section"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-[#0A66C2] hover:bg-[#084e96] shadow-sm hover:shadow transition-all text-sm"
                >
                  <span>Explore Available Events</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Official Institutional Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Print-Ready High-DPI A4 PDF</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Approved by Principal &amp; Department</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Lockup with Logos */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Official Issuing Entities
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">
                    Department &amp; Student Club Partnership
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center justify-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  {/* Left: Club Logo */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <img
                      src={CITDEVHUB_LOGO_DATA_URL}
                      alt="CITDEVHUB Club Logo"
                      className="w-24 h-24 object-contain drop-shadow-sm transition-transform hover:scale-105"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      CITDEVHUB Club
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Learn &amp; Code &amp; Share
                    </span>
                  </div>

                  {/* Right: Department Logo */}
                  <div className="flex flex-col items-center text-center space-y-2 border-l border-slate-200 pl-4">
                    <img
                      src={MCA_DEPT_LOGO_DATA_URL}
                      alt="Department of Computer Applications Logo"
                      className="w-24 h-24 object-contain drop-shadow-sm transition-transform hover:scale-105"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      MCA Department
                    </span>
                    <span className="text-[10px] text-slate-500">
                      CIT, Mandya
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-center space-y-1">
                  <span className="text-xs font-bold text-[#0A66C2] block">
                    Active Workshop Issuing Now
                  </span>
                  <span className="text-xs text-slate-600 block">
                    LinkedIn Masterclass &amp; Personal Branding
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Events Section */}
      <section id="events-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0A66C2] mb-1">
            <Calendar className="w-4 h-4" />
            <span>COLLEGIATE TECHNICAL EVENTS</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Workshops &amp; Technical Sessions
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Certificates are active for completed workshops. Upcoming sessions are marked as coming soon.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedEvents.map((evt) => {
            const hasActiveCert = evt.hasCertificate !== false && !evt.isComingSoon;

            return (
              <div
                key={evt.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Event Card Header with gradient accent */}
                <div className={`h-2.5 bg-gradient-to-r ${evt.bannerGradient}`} />

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Clean unboxed metadata */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                      <span>
                        {new Date(evt.eventDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{evt.venue}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0A66C2] transition-colors leading-snug">
                      {evt.title}
                    </h3>

                    {evt.subtitle && (
                      <p className="text-xs font-medium text-slate-500 mt-1">
                        {evt.subtitle}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500 font-mono">
                      {hasActiveCert ? `${evt.issuedCount} issued` : 'Registration Open'}
                    </div>

                    <div className="flex items-center gap-2">
                      {hasActiveCert ? (
                        <>
                          <button
                            onClick={() => setSelectedQrEvent(evt)}
                            title="Show Event QR Code & Poster"
                            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onSelectEvent(evt.slug)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0A66C2] hover:bg-[#084e96] transition-colors shadow-sm"
                          >
                            <span>Get Certificate</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <span className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 cursor-not-allowed">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#0A66C2] uppercase tracking-wider">
              About Student Club
            </div>
            <h3 className="text-lg font-bold text-slate-900">CITDEVHUB</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Student Club CITDEVHUB is the premier student-led technical collective at Cauvery Institute of Technology,
              focusing on peer-to-peer coding bootcamps, AI innovations, web architectures, and career branding under the motto:
              <strong className="block text-slate-800 mt-1">Learn &amp; Code &amp; Share</strong>
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-[#0A66C2] uppercase tracking-wider">
              Academic Wing
            </div>
            <h3 className="text-lg font-bold text-slate-900">Department of Computer Applications</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Department of Computer Applications (MCA) at Cauvery Institute of Technology, Mandya,
              delivers cutting-edge postgraduate computing education, research seminars, and industry collaborations.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-[#0A66C2] uppercase tracking-wider">
              Collegiate Endorsement
            </div>
            <h3 className="text-lg font-bold text-slate-900">Approved By</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every certificate issued is approved by Principal Dr Srikantappa A S, HOD Prof. Amos R,
              and Club Lead Pradhan V, representing Cauvery Institute of Technology, Department of Computer Applications, and Student Club CITDEVHUB.
            </p>
          </div>
        </div>
      </section>

      {/* QR Code Modal */}
      {selectedQrEvent && (
        <QRCodeModal
          event={selectedQrEvent}
          isOpen={!!selectedQrEvent}
          onClose={() => setSelectedQrEvent(null)}
        />
      )}
    </div>
  );
};
