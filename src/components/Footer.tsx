import React from 'react';
import { Award, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center font-bold">
                <Award className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                CITDEVHUB Certificate Portal
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Official centralized certificate distribution and digital credential verification engine
              for Cauvery Institute of Technology, Department of Computer Applications, Mandya.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span>Established 2026</span>
              <span aria-hidden="true">·</span>
              <span>Student Club – CITDEVHUB</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> High-Assurance Verification
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Institution &amp; Wing
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Cauvery Institute of Technology</li>
              <li>Dept. of Computer Applications (MCA)</li>
              <li>CIT, Mandya, Karnataka</li>
              <li>Lead: Pradhan V</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#events" className="hover:text-white transition-colors">
                  Available Workshops
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About CITDEVHUB
                </a>
              </li>
              <li>
                <span className="text-xs text-slate-500">ISO 9001:2015 Collegiate Standard</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Cauvery Institute of Technology. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Powered by Student Club CITDEVHUB</span>
            <span aria-hidden="true">·</span>
            <span>Learn &amp; Code &amp; Share</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
