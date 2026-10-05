import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Layers,
  Users,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  Eye,
  QrCode,
  Archive,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Download,
  Upload,
  Search,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  KeyRound,
  X,
} from 'lucide-react';
import {
  EventItem,
  CertificateTemplate,
  ApprovedParticipant,
  IssuedCertificate,
  AdminUser,
  EligibilityMode,
  EventStatus,
} from '../types';
import { StorageService, DEFAULT_TEMPLATE, hashAdminPassword } from '../services/storage';
import { CertificateCanvas } from '../components/CertificateCanvas';
import { QRCodeModal } from '../components/QRCodeModal';
import {
  PRINCIPAL_SIGNATURE_DATA_URL,
  HOD_SIGNATURE_DATA_URL,
} from '../assets/signatures';

interface AdminViewProps {
  adminUser: AdminUser;
  onPreviewEvent: (slug: string) => void;
  onViewCert: (certId: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  adminUser,
  onPreviewEvent,
  onViewCert,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'events' | 'templates' | 'attendees' | 'issued'
  >('overview');

  // Data states
  const [events, setEvents] = useState<EventItem[]>([]);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [participants, setParticipants] = useState<ApprovedParticipant[]>([]);
  const [issuedCerts, setIssuedCerts] = useState<IssuedCertificate[]>([]);

  // Modals & Sub-states
  const [selectedEventForQr, setSelectedEventForQr] = useState<EventItem | null>(null);
  const [isEditingEvent, setIsEditingEvent] = useState<boolean>(false);
  const [currentEventForm, setCurrentEventForm] = useState<Partial<EventItem>>({});
  const [selectedAttendeeEventId, setSelectedAttendeeEventId] = useState<string>('');
  const [attendeeSearchQuery, setAttendeeSearchQuery] = useState<string>('');

  // Manual participant add form
  const [showAddAttendeeModal, setShowAddAttendeeModal] = useState<boolean>(false);
  const [newAttendeeRegId, setNewAttendeeRegId] = useState('');
  const [newAttendeeName, setNewAttendeeName] = useState('');
  const [newAttendeeEmail, setNewAttendeeEmail] = useState('');

  // Template editor state
  const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate>(DEFAULT_TEMPLATE);
  const [showTemplatePreview, setShowTemplatePreview] = useState<boolean>(false);

  // Revocation modal
  const [revokingCertId, setRevokingCertId] = useState<string | null>(null);
  const [revocationReasonInput, setRevocationReasonInput] = useState<string>('');

  // Security / Password modal
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput.length < 6) {
      setPasswordChangeStatus('Password must be at least 6 characters.');
      return;
    }
    if (newPasswordInput !== confirmNewPasswordInput) {
      setPasswordChangeStatus('Passwords do not match.');
      return;
    }
    const hash = await hashAdminPassword(newPasswordInput);
    StorageService.setAdminPasswordHash(hash);
    setPasswordChangeStatus('Password successfully updated!');
    setTimeout(() => {
      setIsChangePasswordOpen(false);
      setPasswordChangeStatus(null);
      setNewPasswordInput('');
      setConfirmNewPasswordInput('');
    }, 1200);
  };

  const refreshData = () => {
    const evts = StorageService.getEvents();
    setEvents(evts);
    setTemplates(StorageService.getTemplates());
    setParticipants(StorageService.getParticipants());
    setIssuedCerts(StorageService.getIssuedCertificates());

    if (!selectedAttendeeEventId && evts.length > 0) {
      setSelectedAttendeeEventId(evts[0].id);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // --- EVENT HANDLERS ---
  const handleOpenCreateEvent = () => {
    setCurrentEventForm({
      id: `evt-${Date.now()}`,
      title: '',
      slug: '',
      subtitle: '',
      description: '',
      eventDate: new Date().toISOString().split('T')[0],
      venue: 'MCA Seminar Hall, CIT Mandya',
      speakerOrLead: 'Pradhan V (Club Lead)',
      status: 'draft',
      eligibilityMode: 'open',
      templateId: templates[0]?.id || DEFAULT_TEMPLATE.id,
      templateSnapshot: templates[0] || DEFAULT_TEMPLATE,
      bannerGradient: 'from-blue-600 to-sky-700',
      issuedCount: 0,
      requireRegCode: false,
    });
    setIsEditingEvent(true);
  };

  const handleOpenEditEvent = (evt: EventItem) => {
    setCurrentEventForm({ ...evt });
    setIsEditingEvent(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEventForm.title || !currentEventForm.slug) {
      alert('Event Title and URL Slug are required.');
      return;
    }

    // Ensure slug is clean
    const cleanSlug = currentEventForm.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const existing = events.find(
      (ev) => ev.slug.toLowerCase() === cleanSlug && ev.id !== currentEventForm.id
    );
    if (existing) {
      alert('This URL Slug is already used by another event. Please choose a unique slug.');
      return;
    }

    const templateToUse =
      templates.find((t) => t.id === currentEventForm.templateId) || DEFAULT_TEMPLATE;

    const fullEvent: EventItem = {
      id: currentEventForm.id || `evt-${Date.now()}`,
      title: currentEventForm.title,
      slug: cleanSlug,
      subtitle: currentEventForm.subtitle || '',
      description: currentEventForm.description || '',
      eventDate: currentEventForm.eventDate || new Date().toISOString().split('T')[0],
      venue: currentEventForm.venue || 'CIT Mandya',
      speakerOrLead: currentEventForm.speakerOrLead || 'CITDEVHUB Team',
      status: (currentEventForm.status as EventStatus) || 'draft',
      eligibilityMode: (currentEventForm.eligibilityMode as EligibilityMode) || 'open',
      templateId: templateToUse.id,
      templateSnapshot: templateToUse,
      bannerGradient: currentEventForm.bannerGradient || 'from-blue-600 to-indigo-800',
      issuedCount: currentEventForm.issuedCount || 0,
      requireRegCode: currentEventForm.eligibilityMode === 'approved_attendees',
      createdAt: currentEventForm.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageService.saveEvent(fullEvent);
    setIsEditingEvent(false);
    refreshData();
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete event "${title}"? This cannot be undone.`)) {
      StorageService.deleteEvent(id);
      refreshData();
    }
  };

  const handleToggleEventStatus = (evt: EventItem, newStatus: EventStatus) => {
    StorageService.saveEvent({ ...evt, status: newStatus });
    refreshData();
  };

  // --- ATTENDEE HANDLERS ---
  const handleAddSingleAttendee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttendeeRegId || !newAttendeeName || !selectedAttendeeEventId) return;

    StorageService.addParticipant({
      eventId: selectedAttendeeEventId,
      regId: newAttendeeRegId.trim().toUpperCase(),
      name: newAttendeeName.trim(),
      email: newAttendeeEmail.trim(),
      college: 'Cauvery Institute of Technology',
    });

    setNewAttendeeRegId('');
    setNewAttendeeName('');
    setNewAttendeeEmail('');
    setShowAddAttendeeModal(false);
    refreshData();
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAttendeeEventId) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      const parsedRecords: Array<{ regId: string; name: string; email?: string }> = [];

      // Assume header row if contains "name" or "reg"
      const startIndex = lines[0].toLowerCase().includes('name') ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
        if (parts.length >= 2) {
          // format: RegId, Name, Email
          parsedRecords.push({
            regId: parts[0],
            name: parts[1],
            email: parts[2] || '',
          });
        }
      }

      if (parsedRecords.length === 0) {
        alert('No valid records found in CSV. Please ensure format: AttendeeCode,FullName,Email');
        return;
      }

      const count = StorageService.batchAddParticipants(selectedAttendeeEventId, parsedRecords);
      alert(`Successfully added ${count} new attendees from CSV!`);
      refreshData();
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const downloadSampleCsv = () => {
    const csvContent =
      'AttendeeCode,FullName,Email\nCIT-AI-201,Pawan Kumar,pawan.k@cit.edu\nCIT-AI-202,Meghana Rao,meghana.r@cit.edu\nCIT-AI-203,Karthik S,karthik.s@cit.edu';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'citdevhub_attendees_sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- TEMPLATE HANDLERS ---
  const handleSaveTemplate = () => {
    StorageService.saveTemplate(editingTemplate);
    alert('Certificate template saved successfully!');
    refreshData();
  };

  // --- REVOCATION HANDLERS ---
  const handleToggleRevoke = (cert: IssuedCertificate) => {
    if (cert.revoked) {
      // Restore
      if (confirm(`Restore certificate ${cert.certificateId} to VALID status?`)) {
        StorageService.toggleCertificateRevocation(cert.certificateId);
        refreshData();
      }
    } else {
      // Prompt for reason
      setRevokingCertId(cert.certificateId);
      setRevocationReasonInput('Academic integrity review or unauthorized generation');
    }
  };

  const handleConfirmRevocation = () => {
    if (!revokingCertId) return;
    StorageService.toggleCertificateRevocation(revokingCertId, revocationReasonInput);
    setRevokingCertId(null);
    setRevocationReasonInput('');
    refreshData();
  };

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20">
      {/* Admin Dashboard Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0A66C2] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Executive Management Console</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                CITDEVHUB Portal Administration
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Logged in as <strong>{adminUser.name}</strong> ({adminUser.email})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                title="Change your private admin master password"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Security &amp; Password</span>
              </button>

              <button
                onClick={handleOpenCreateEvent}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0A66C2] hover:bg-[#084e96] text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Workshop</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto border-t border-slate-100 pt-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              System Overview
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'events'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Workshops &amp; Events ({events.length})
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'templates'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Certificate Template Library
            </button>
            <button
              onClick={() => setActiveTab('attendees')}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'attendees'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Approved Attendees ({participants.length})
            </button>
            <button
              onClick={() => setActiveTab('issued')}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'issued'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Issued Registry &amp; Revocation ({issuedCerts.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB 1: SYSTEM OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Workshops
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
                  {events.length}
                </div>
                <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                  <span className="text-emerald-600 font-semibold">
                    {events.filter((e) => e.status === 'published').length} published
                  </span>
                  <span>·</span>
                  <span>{events.filter((e) => e.status === 'draft').length} drafts</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Certificates Issued
                </div>
                <div className="text-3xl font-extrabold text-[#0A66C2] mt-2 font-mono tabular-nums">
                  {issuedCerts.length}
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {issuedCerts.filter((c) => !c.revoked).length} verified authentic
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Approved Attendees
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
                  {participants.length}
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {participants.filter((p) => p.issued).length} claimed certificates
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Revoked Credentials
                </div>
                <div className="text-3xl font-extrabold text-red-600 mt-2 font-mono tabular-nums">
                  {issuedCerts.filter((c) => c.revoked).length}
                </div>
                <div className="text-xs text-slate-500 mt-2">Enforced on public verification</div>
              </div>
            </div>

            {/* Quick Actions & Recent Issuances */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-sm">
                    Recent Certificate Issuances
                  </h3>
                  <button
                    onClick={() => setActiveTab('issued')}
                    className="text-xs font-semibold text-[#0A66C2] hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-3">Certificate ID</th>
                        <th className="pb-3">Participant</th>
                        <th className="pb-3">Workshop</th>
                        <th className="pb-3">Issued Date</th>
                        <th className="pb-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {issuedCerts.slice(0, 6).map((cert) => (
                        <tr key={cert.certificateId} className="hover:bg-slate-50/80">
                          <td className="py-3 font-mono font-semibold text-slate-900">
                            {cert.certificateId}
                          </td>
                          <td className="py-3 font-medium text-slate-800">
                            {cert.participantName}
                          </td>
                          <td className="py-3 text-slate-600">{cert.eventTitle}</td>
                          <td className="py-3 text-slate-500">
                            {new Date(cert.issuedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 text-right">
                            {cert.revoked ? (
                              <span className="text-red-700 font-semibold">Revoked</span>
                            ) : (
                              <span className="text-emerald-700 font-semibold">Valid</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Club Signatory Info */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Active Certificate Signatories</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every issued certificate carries these three official designations along the bottom:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      Signature 1 · Principal
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">
                      Dr Srikantappa A S
                    </div>
                    <div className="text-[11px] text-emerald-600 font-medium">
                      ✓ Authentic Transparent Signature Active
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      Signature 2 · Head of Department
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">
                      Prof. Amos R
                    </div>
                    <div className="text-[11px] text-emerald-600 font-medium">
                      ✓ Authentic Transparent Signature Active
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      Section 3 · Club Lead
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">
                      Pradhan V (Club Lead, CIT DevHub)
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      ✓ No line above, clean printed designation (As Requested)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EVENTS MANAGEMENT */}
        {activeTab === 'events' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">All Workshops &amp; Events</h2>
              <button
                onClick={handleOpenCreateEvent}
                className="px-4 py-2 bg-[#0A66C2] text-white rounded-xl text-xs font-semibold hover:bg-[#084e96] flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                      <th className="py-3 px-4">Event Title</th>
                      <th className="py-3 px-4">Slug (URL)</th>
                      <th className="py-3 px-4">Event Date</th>
                      <th className="py-3 px-4">Mode</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Issued</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {events.map((evt) => (
                      <tr key={evt.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs">
                          {evt.title}
                          {evt.subtitle && (
                            <span className="block text-[11px] font-normal text-slate-500 truncate">
                              {evt.subtitle}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">/{evt.slug}</td>
                        <td className="py-3.5 px-4 text-slate-600">{evt.eventDate}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              evt.eligibilityMode === 'approved_attendees'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {evt.eligibilityMode === 'approved_attendees' ? 'Verified Code' : 'Open'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={evt.status}
                            onChange={(e) =>
                              handleToggleEventStatus(evt, e.target.value as EventStatus)
                            }
                            className={`text-xs font-semibold rounded-lg px-2 py-1 border ${
                              evt.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : evt.status === 'draft'
                                ? 'bg-amber-50 text-amber-700 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="unpublished">Unpublished</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium">{evt.issuedCount}</td>
                        <td className="py-3.5 px-4 text-right space-x-1">
                          <button
                            onClick={() => onPreviewEvent(evt.slug)}
                            title="Preview Public Page"
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedEventForQr(evt)}
                            title="Generate QR Code & Poster"
                            className="p-1.5 text-[#0A66C2] hover:bg-blue-50 rounded-lg"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditEvent(evt)}
                            title="Edit Event"
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(evt.id, evt.title)}
                            title="Delete Event"
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TEMPLATE LIBRARY & CUSTOMIZER */}
        {activeTab === 'templates' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Certificate Template Engine</h2>
                <p className="text-xs text-slate-500">
                  Reusable templates ensuring institutional consistency across all CITDEVHUB events.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTemplatePreview(!showTemplatePreview)}
                  className="px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {showTemplatePreview ? 'Hide Live Preview' : 'Show Live Preview'}
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="px-4 py-2 bg-[#0A66C2] text-white rounded-xl text-xs font-semibold hover:bg-[#084e96]"
                >
                  Save Template Settings
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Controls */}
              <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-4">
                    Typography &amp; Headings
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Certificate Main Title
                      </label>
                      <input
                        type="text"
                        value={editingTemplate.title}
                        onChange={(e) =>
                          setEditingTemplate({ ...editingTemplate, title: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Subtitle Lead-in
                      </label>
                      <input
                        type="text"
                        value={editingTemplate.subtitle}
                        onChange={(e) =>
                          setEditingTemplate({ ...editingTemplate, subtitle: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Institution Name
                      </label>
                      <input
                        type="text"
                        value={editingTemplate.institutionName}
                        onChange={(e) =>
                          setEditingTemplate({
                            ...editingTemplate,
                            institutionName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Department Name
                      </label>
                      <input
                        type="text"
                        value={editingTemplate.departmentName}
                        onChange={(e) =>
                          setEditingTemplate({
                            ...editingTemplate,
                            departmentName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Student Club Name
                      </label>
                      <input
                        type="text"
                        value={editingTemplate.clubName}
                        onChange={(e) =>
                          setEditingTemplate({
                            ...editingTemplate,
                            clubName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Accents */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm mb-3">Color Palette</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Primary (Border / Headings)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editingTemplate.primaryColor}
                          onChange={(e) =>
                            setEditingTemplate({
                              ...editingTemplate,
                              primaryColor: e.target.value,
                            })
                          }
                          className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                        />
                        <span className="font-mono text-xs">{editingTemplate.primaryColor}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Accent (Gold Ribbon)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editingTemplate.accentColor}
                          onChange={(e) =>
                            setEditingTemplate({
                              ...editingTemplate,
                              accentColor: e.target.value,
                            })
                          }
                          className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                        />
                        <span className="font-mono text-xs">{editingTemplate.accentColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* THREE SIGNATURE SECTIONS MANAGEMENT */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Official Three-Signature Sections
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Configure the labels, names, and signature image preferences for the bottom bar.
                    </p>
                  </div>

                  {/* 1. Principal Section */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="text-xs font-bold text-slate-800">
                      Signature 1 · Principal Section
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Label</span>
                        <input
                          type="text"
                          value={editingTemplate.signatures.principal.label}
                          onChange={(e) =>
                            setEditingTemplate({
                              ...editingTemplate,
                              signatures: {
                                ...editingTemplate.signatures,
                                principal: {
                                  ...editingTemplate.signatures.principal,
                                  label: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Signatory Name</span>
                        <input
                          type="text"
                          value={editingTemplate.signatures.principal.name}
                          onChange={(e) =>
                            setEditingTemplate({
                              ...editingTemplate,
                              signatures: {
                                ...editingTemplate.signatures,
                                principal: {
                                  ...editingTemplate.signatures.principal,
                                  name: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border rounded bg-white"
                        />
                      </div>
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium pt-1">
                      ✓ Transparent Principal Signature applied
                    </div>
                  </div>

                  {/* 2. HOD Section */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="text-xs font-bold text-slate-800">
                      Signature 2 · HOD Section
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Label</span>
                        <input
                          type="text"
                          value={editingTemplate.signatures.hod.label}
                          onChange={(e) =>
                            setEditingTemplate({
                              ...editingTemplate,
                              signatures: {
                                ...editingTemplate.signatures,
                                hod: {
                                  ...editingTemplate.signatures.hod,
                                  label: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Signatory Name</span>
                        <input
                          type="text"
                          value={editingTemplate.signatures.hod.name}
                          onChange={(e) =>
                            setEditingTemplate({
                              ...editingTemplate,
                              signatures: {
                                ...editingTemplate.signatures,
                                hod: {
                                  ...editingTemplate.signatures.hod,
                                  name: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border rounded bg-white"
                        />
                      </div>
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium pt-1">
                      ✓ Transparent HOD Signature applied
                    </div>
                  </div>

                  {/* 3. Club Lead Section */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="text-xs font-bold text-slate-800">
                      Section 3 · Club Lead (Pradhan V)
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Label</span>
                        <input
                          type="text"
                          value={editingTemplate.signatures.clubLead.label}
                          onChange={(e) =>
                            setEditingTemplate({
                              ...editingTemplate,
                              signatures: {
                                ...editingTemplate.signatures,
                                clubLead: {
                                  ...editingTemplate.signatures.clubLead,
                                  label: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Lead Name</span>
                        <input
                          type="text"
                          value={editingTemplate.signatures.clubLead.name}
                          onChange={(e) =>
                            setEditingTemplate({
                              ...editingTemplate,
                              signatures: {
                                ...editingTemplate.signatures,
                                clubLead: {
                                  ...editingTemplate.signatures.clubLead,
                                  name: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border rounded bg-white"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1">
                      Mode: <strong>No line above, clean printed designation</strong>: Pradhan V · Club Lead, CIT DevHub
                    </p>
                  </div>
                </div>
              </div>

              {/* Template Preview Panel */}
              <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm mb-4">
                  Live Preview: {editingTemplate.name}
                </h3>
                <CertificateCanvas
                  participantName="ROHITH GOWDA"
                  eventName="Generative AI: Episode 1"
                  eventDate="2026-10-02"
                  certificateId="CITDH-2026-SAMPLE"
                  template={editingTemplate}
                  showDownloadButton={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: APPROVED ATTENDEES */}
        {activeTab === 'attendees' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold text-slate-600">Select Event:</span>
                <select
                  value={selectedAttendeeEventId}
                  onChange={(e) => setSelectedAttendeeEventId(e.target.value)}
                  className="text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 text-slate-900 focus:outline-none"
                >
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title} ({evt.eligibilityMode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={downloadSampleCsv}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download Sample CSV</span>
                </button>

                <label className="px-3 py-1.5 border border-[#0A66C2] bg-blue-50/70 hover:bg-blue-50 text-[#0A66C2] text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Batch CSV Upload</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => setShowAddAttendeeModal(true)}
                  className="px-4 py-1.5 bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Attendee</span>
                </button>
              </div>
            </div>

            {/* Attendees Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="relative w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={attendeeSearchQuery}
                    onChange={(e) => setAttendeeSearchQuery(e.target.value)}
                    placeholder="Search attendee or code..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {
                    participants.filter(
                      (p) =>
                        (!selectedAttendeeEventId || p.eventId === selectedAttendeeEventId) &&
                        (p.name.toLowerCase().includes(attendeeSearchQuery.toLowerCase()) ||
                          p.regId.toLowerCase().includes(attendeeSearchQuery.toLowerCase()))
                    ).length
                  }{' '}
                  records
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="py-3 px-4">Attendee Code / Reg ID</th>
                      <th className="py-3 px-4">Participant Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Issuance Status</th>
                      <th className="py-3 px-4">Certificate ID</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {participants
                      .filter(
                        (p) =>
                          (!selectedAttendeeEventId || p.eventId === selectedAttendeeEventId) &&
                          (p.name.toLowerCase().includes(attendeeSearchQuery.toLowerCase()) ||
                            p.regId.toLowerCase().includes(attendeeSearchQuery.toLowerCase()))
                      )
                      .map((attendee) => (
                        <tr key={attendee.id} className="hover:bg-slate-50/80">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            {attendee.regId}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            {attendee.name}
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {attendee.email || '—'}
                          </td>
                          <td className="py-3 px-4">
                            {attendee.issued ? (
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Claimed
                              </span>
                            ) : (
                              <span className="text-amber-600 font-medium">Pending Claim</span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-700">
                            {attendee.certificateId ? (
                              <button
                                onClick={() => onViewCert(attendee.certificateId!)}
                                className="text-[#0A66C2] hover:underline"
                              >
                                {attendee.certificateId}
                              </button>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Remove attendee ${attendee.name}?`)) {
                                  StorageService.deleteParticipant(attendee.id);
                                  refreshData();
                                }
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ISSUED REGISTRY & REVOCATION */}
        {activeTab === 'issued' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Issued Certificate Master Ledger
                </h2>
                <p className="text-xs text-slate-500">
                  Official immutable registry of every generated certificate with real-time revocation authority.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="py-3 px-4">Certificate ID</th>
                      <th className="py-3 px-4">Participant Name</th>
                      <th className="py-3 px-4">Workshop</th>
                      <th className="py-3 px-4">Event Date</th>
                      <th className="py-3 px-4">Mode</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Revocation Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {issuedCerts.map((cert) => (
                      <tr key={cert.certificateId} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {cert.certificateId}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {cert.participantName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{cert.eventTitle}</td>
                        <td className="py-3.5 px-4 text-slate-500">{cert.eventDate}</td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {cert.mode === 'approved_attendees' ? 'Verified Code' : 'Self-Service'}
                        </td>
                        <td className="py-3.5 px-4">
                          {cert.revoked ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                              Revoked
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Valid &amp; Authentic
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => onViewCert(cert.certificateId)}
                            className="text-xs text-[#0A66C2] font-semibold hover:underline"
                          >
                            Verify View
                          </button>
                          <button
                            onClick={() => handleToggleRevoke(cert)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                              cert.revoked
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                            }`}
                          >
                            {cert.revoked ? 'Restore Validity' : 'Revoke Credential'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: CREATE / EDIT EVENT */}
      {isEditingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl my-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                {currentEventForm.id?.startsWith('evt-') && !events.some((e) => e.id === currentEventForm.id)
                  ? 'Create New Workshop'
                  : 'Edit Workshop Configuration'}
              </h3>
              <button
                onClick={() => setIsEditingEvent(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Workshop Title *
                </label>
                <input
                  type="text"
                  required
                  value={currentEventForm.title || ''}
                  onChange={(e) => {
                    const title = e.target.value;
                    const autoSlug = title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-|-$/g, '');
                    setCurrentEventForm({
                      ...currentEventForm,
                      title,
                      slug: currentEventForm.slug || autoSlug,
                    });
                  }}
                  placeholder="e.g. Generative AI: Episode 2"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Slug * (Unique)
                  </label>
                  <input
                    type="text"
                    required
                    value={currentEventForm.slug || ''}
                    onChange={(e) =>
                      setCurrentEventForm({
                        ...currentEventForm,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                      })
                    }
                    placeholder="generative-ai-episode-2"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={currentEventForm.eventDate || ''}
                    onChange={(e) =>
                      setCurrentEventForm({ ...currentEventForm, eventDate: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtitle / Theme
                </label>
                <input
                  type="text"
                  value={currentEventForm.subtitle || ''}
                  onChange={(e) =>
                    setCurrentEventForm({ ...currentEventForm, subtitle: e.target.value })
                  }
                  placeholder="e.g. Building Production Agents with Gemini"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={currentEventForm.description || ''}
                  onChange={(e) =>
                    setCurrentEventForm({ ...currentEventForm, description: e.target.value })
                  }
                  placeholder="Detailed summary of the workshop..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={currentEventForm.venue || ''}
                    onChange={(e) =>
                      setCurrentEventForm({ ...currentEventForm, venue: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Speaker / Lead
                  </label>
                  <input
                    type="text"
                    value={currentEventForm.speakerOrLead || ''}
                    onChange={(e) =>
                      setCurrentEventForm({ ...currentEventForm, speakerOrLead: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Eligibility Mode
                  </label>
                  <select
                    value={currentEventForm.eligibilityMode || 'open'}
                    onChange={(e) =>
                      setCurrentEventForm({
                        ...currentEventForm,
                        eligibilityMode: e.target.value as EligibilityMode,
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="open">Open Self-Service (Name entry)</option>
                    <option value="approved_attendees">
                      Approved Attendee Code Required
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Publish Status
                  </label>
                  <select
                    value={currentEventForm.status || 'draft'}
                    onChange={(e) =>
                      setCurrentEventForm({
                        ...currentEventForm,
                        status: e.target.value as EventStatus,
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="draft">Draft (Admin only)</option>
                    <option value="published">Published (Public)</option>
                    <option value="unpublished">Unpublished</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingEvent(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0A66C2] text-white text-xs font-semibold rounded-xl hover:bg-[#084e96]"
                >
                  Save Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ATTENDEE */}
      {showAddAttendeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Add Approved Attendee</h3>
              <button
                onClick={() => setShowAddAttendeeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSingleAttendee} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attendee Code / Registration ID *
                </label>
                <input
                  type="text"
                  required
                  value={newAttendeeRegId}
                  onChange={(e) => setNewAttendeeRegId(e.target.value)}
                  placeholder="e.g. CIT-AI-107"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Participant Name *
                </label>
                <input
                  type="text"
                  required
                  value={newAttendeeName}
                  onChange={(e) => setNewAttendeeName(e.target.value)}
                  placeholder="e.g. Rohith Gowda"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={newAttendeeEmail}
                  onChange={(e) => setNewAttendeeEmail(e.target.value)}
                  placeholder="participant@cit.edu"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAttendeeModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0A66C2] text-white text-xs font-semibold rounded-xl"
                >
                  Add Attendee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REVOCATION REASON */}
      {revokingCertId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-red-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-red-100 flex items-center justify-between bg-red-50">
              <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <span>Revoke Certificate {revokingCertId}</span>
              </div>
              <button
                onClick={() => setRevokingCertId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600">
                Revoking this certificate will immediately mark it as invalid on the public verification portal.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Revocation *
                </label>
                <input
                  type="text"
                  required
                  value={revocationReasonInput}
                  onChange={(e) => setRevocationReasonInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRevokingCertId(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRevocation}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl"
                >
                  Confirm Revocation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#0A66C2]" />
                <h3 className="font-bold text-slate-900 text-sm">Security &amp; Password Settings</h3>
              </div>
              <button
                onClick={() => {
                  setIsChangePasswordOpen(false);
                  setPasswordChangeStatus(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Update your private master password for <strong>{adminUser.email}</strong>.
                Passwords are cryptographically secured using client-side SHA-256.
              </p>

              {passwordChangeStatus && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    passwordChangeStatus.includes('successfully')
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  <span>{passwordChangeStatus}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Master Password
                </label>
                <input
                  type="password"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPasswordInput}
                  onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePasswordOpen(false);
                    setPasswordChangeStatus(null);
                  }}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-semibold rounded-xl"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {selectedEventForQr && (
        <QRCodeModal
          event={selectedEventForQr}
          isOpen={!!selectedEventForQr}
          onClose={() => setSelectedEventForQr(null)}
        />
      )}
    </div>
  );
};
