import {
  EventItem,
  CertificateTemplate,
  ApprovedParticipant,
  IssuedCertificate,
  AdminUser,
} from '../types';
import {
  PRINCIPAL_SIGNATURE_DATA_URL,
  HOD_SIGNATURE_DATA_URL,
} from '../assets/signatures';

// Default Master Template
export const DEFAULT_TEMPLATE: CertificateTemplate = {
  id: 'tpl-default-master',
  name: 'Official CITDEVHUB Gold & Blue Classic',
  isDefault: true,
  title: 'CERTIFICATE OF PARTICIPATION',
  subtitle: 'This certificate is proudly presented to',
  statementTemplate:
    'for successfully participating in {eventName} organized by Student Club – CITDEVHUB, Department of Computer Applications, Cauvery Institute of Technology, Mandya.',
  institutionName: 'CAUVERY INSTITUTE OF TECHNOLOGY',
  departmentName: 'Department of Computer Applications',
  clubName: 'STUDENT CLUB – CITDEVHUB',
  primaryColor: '#0A66C2', // LinkedIn blue
  accentColor: '#E69C24', // Gold accent
  textColor: '#1D2733',
  borderStyle: 'classic_double',
  showQrCode: true,
  showWatermark: true,
  signatures: {
    principal: {
      enabled: true,
      label: 'PRINCIPAL',
      name: 'Dr Srikantappa A S',
      title: 'Principal, CIT Mandya',
      signatureType: 'transparent_image',
      signatureDataUrl: PRINCIPAL_SIGNATURE_DATA_URL,
    },
    hod: {
      enabled: true,
      label: 'HEAD OF THE DEPARTMENT (HOD)',
      name: 'Prof. Amos R',
      title: 'HOD, Department of Computer Applications',
      signatureType: 'transparent_image',
      signatureDataUrl: HOD_SIGNATURE_DATA_URL,
    },
    clubLead: {
      enabled: true,
      label: 'CLUB LEAD',
      name: 'Pradhan V',
      title: 'Club Lead, CIT DevHub',
      signatureType: 'blank_line', // Explicitly no line and no signature image per user instruction
    },
  },
  createdAt: '2026-09-01T10:00:00Z',
  updatedAt: '2026-10-04T12:00:00Z',
};

// Initial Events
const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-linkedin-workshop',
    slug: 'linkedin-workshop',
    title: 'LinkedIn Masterclass & Personal Branding',
    subtitle: 'Building a High-Impact Engineering Presence',
    description:
      'An intensive hands-on workshop guiding students on profile optimization, creator mode, technical networking, and landing top tier internships via LinkedIn.',
    eventDate: '2026-10-07',
    venue: 'MCA Seminar Hall, Ground Floor',
    speakerOrLead: 'Pradhan V (Club Lead)',
    status: 'published',
    eligibilityMode: 'open',
    templateId: 'tpl-default-master',
    templateSnapshot: { ...DEFAULT_TEMPLATE, title: 'CERTIFICATE OF PARTICIPATION' },
    bannerGradient: 'from-blue-600 to-sky-700',
    issuedCount: 68,
    requireRegCode: false,
    hasCertificate: true,
    isComingSoon: false,
    createdAt: '2026-09-10T08:00:00Z',
    updatedAt: '2026-10-07T18:00:00Z',
  },
  {
    id: 'evt-genai-ep1',
    slug: 'generative-ai-episode-1',
    title: 'Generative AI: Episode 1',
    subtitle: 'From LLM Fundamentals to Multi-Modal Agents',
    description:
      'A deep dive technical symposium exploring large language models, prompt engineering, Gemini developer API, RAG architecture, and building production AI applets.',
    eventDate: '2026-10-02',
    venue: 'CIT Main Auditorium & Computer Lab 3',
    speakerOrLead: 'Prof. Amos R & Core AI Team',
    status: 'published',
    eligibilityMode: 'approved_attendees',
    templateId: 'tpl-default-master',
    templateSnapshot: { ...DEFAULT_TEMPLATE, title: 'CERTIFICATE OF ACHIEVEMENT' },
    bannerGradient: 'from-indigo-600 to-violet-800',
    issuedCount: 0,
    maxAttendees: 50,
    requireRegCode: true,
    hasCertificate: false,
    isComingSoon: true,
    createdAt: '2026-09-25T10:00:00Z',
    updatedAt: '2026-10-03T16:00:00Z',
  },
  {
    id: 'evt-langchain-automation',
    slug: 'workflow-automation-langchain',
    title: 'Workflow Automation using LangChain',
    subtitle: 'Building Autonomous Multi-Agent Chains',
    description:
      'Hands-on technical workshop on LangChain agents, memory structures, document loaders, vector stores, and event-driven automation pipelines.',
    eventDate: '2026-10-16',
    venue: 'Computer Applications Lab 1',
    speakerOrLead: 'CITDEVHUB Technical Wing',
    status: 'published',
    eligibilityMode: 'open',
    templateId: 'tpl-default-master',
    templateSnapshot: { ...DEFAULT_TEMPLATE, title: 'CERTIFICATE OF PARTICIPATION' },
    bannerGradient: 'from-emerald-600 to-teal-800',
    issuedCount: 0,
    requireRegCode: false,
    hasCertificate: false,
    isComingSoon: true,
    createdAt: '2026-10-01T09:00:00Z',
    updatedAt: '2026-10-04T11:00:00Z',
  },
  {
    id: 'evt-cloud-native-microservices',
    slug: 'cloud-native-microservices',
    title: 'Modern Cloud Architecture & Docker Containers',
    subtitle: 'Next-Gen Backend Deployment Patterns',
    description:
      'Draft upcoming technical workshop on containerization, Kubernetes fundamentals, and microservice communication.',
    eventDate: '2026-10-28',
    venue: 'MCA Seminar Hall',
    speakerOrLead: 'Guest Industry Architect',
    status: 'draft',
    eligibilityMode: 'approved_attendees',
    templateId: 'tpl-default-master',
    templateSnapshot: { ...DEFAULT_TEMPLATE },
    bannerGradient: 'from-slate-700 to-slate-900',
    issuedCount: 0,
    requireRegCode: true,
    hasCertificate: false,
    isComingSoon: true,
    createdAt: '2026-10-04T14:00:00Z',
    updatedAt: '2026-10-04T14:00:00Z',
  },
];

// Initial Sample Approved Attendees for Generative AI Episode 1 & Events
const INITIAL_PARTICIPANTS: ApprovedParticipant[] = [
  {
    id: 'p-1',
    eventId: 'evt-genai-ep1',
    regId: 'CIT-AI-101',
    name: 'B. Aashreetha',
    email: 'aashreetha.b@cit.edu',
    college: 'Cauvery Institute of Technology',
    issued: true,
    issuedAt: '2026-10-03T11:20:00Z',
    certificateId: 'CITDH-2026-7F82A9C1',
  },
  {
    id: 'p-2',
    eventId: 'evt-genai-ep1',
    regId: 'CIT-AI-102',
    name: 'Rohit Kulkarni',
    email: 'rohit.k@cit.edu',
    college: 'Cauvery Institute of Technology',
    issued: true,
    issuedAt: '2026-10-03T12:05:00Z',
    certificateId: 'CITDH-2026-9B31D4E2',
  },
  {
    id: 'p-3',
    eventId: 'evt-genai-ep1',
    regId: 'CIT-AI-103',
    name: 'Ananya Sharma',
    email: 'ananya.s@cit.edu',
    college: 'Cauvery Institute of Technology',
    issued: false,
  },
  {
    id: 'p-4',
    eventId: 'evt-genai-ep1',
    regId: 'CIT-AI-104',
    name: 'Mohammed Farhan',
    email: 'm.farhan@cit.edu',
    college: 'Cauvery Institute of Technology',
    issued: false,
  },
  {
    id: 'p-5',
    eventId: 'evt-genai-ep1',
    regId: 'CIT-AI-105',
    name: 'Pooja Hegde',
    email: 'pooja.h@cit.edu',
    college: 'Cauvery Institute of Technology',
    issued: false,
  },
  {
    id: 'p-6',
    eventId: 'evt-genai-ep1',
    regId: 'CIT-AI-106',
    name: 'Sanjay Kumar Gowda',
    email: 'sanjay.kg@cit.edu',
    college: 'Cauvery Institute of Technology',
    issued: false,
  },
];

// Initial Issued Certificates
const INITIAL_ISSUED_CERTS: IssuedCertificate[] = [
  {
    certificateId: 'CITDH-2026-2E198C44',
    eventId: 'evt-linkedin-workshop',
    eventTitle: 'LinkedIn Masterclass & Personal Branding',
    eventDate: '2026-10-07',
    participantName: 'Chetan M',
    issuedAt: '2026-10-07T09:15:00Z',
    revoked: false,
    mode: 'open',
    templateSnapshot: DEFAULT_TEMPLATE,
  },
  {
    certificateId: 'CITDH-2026-8A45F109',
    eventId: 'evt-linkedin-workshop',
    eventTitle: 'LinkedIn Masterclass & Personal Branding',
    eventDate: '2026-10-07',
    participantName: 'B. Aashreetha',
    issuedAt: '2026-10-07T10:30:00Z',
    revoked: false,
    mode: 'open',
    templateSnapshot: DEFAULT_TEMPLATE,
  },
];

const STORAGE_KEYS = {
  EVENTS: 'citdevhub_events_v4',
  TEMPLATES: 'citdevhub_templates_v4',
  PARTICIPANTS: 'citdevhub_participants_v4',
  ISSUED_CERTS: 'citdevhub_issued_certs_v4',
  ADMIN_SESSION: 'citdevhub_admin_session_v4',
};

export const AUTHORIZED_ADMIN_EMAIL = 'pradhanv2409@gmail.com';

export async function hashAdminPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Generate cryptographically secure, human-readable unpredictable ID
export function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  return `CITDH-${year}-${hex}`;
}

export const StorageService = {
  // --- EVENTS ---
  getEvents(): EventItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
        return INITIAL_EVENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_EVENTS;
    }
  },

  getPublishedEvents(): EventItem[] {
    return this.getEvents().filter((e) => e.status === 'published');
  },

  getEventById(id: string): EventItem | undefined {
    return this.getEvents().find((e) => e.id === id);
  },

  getEventBySlug(slug: string): EventItem | undefined {
    return this.getEvents().find((e) => e.slug.toLowerCase() === slug.toLowerCase());
  },

  saveEvent(event: EventItem): void {
    const list = this.getEvents();
    const index = list.findIndex((e) => e.id === event.id);
    if (index >= 0) {
      list[index] = { ...event, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...event, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(list));
  },

  deleteEvent(id: string): void {
    const list = this.getEvents().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(list));
  },

  // --- TEMPLATES ---
  getTemplates(): CertificateTemplate[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify([DEFAULT_TEMPLATE]));
        return [DEFAULT_TEMPLATE];
      }
      return JSON.parse(data);
    } catch {
      return [DEFAULT_TEMPLATE];
    }
  },

  getTemplateById(id: string): CertificateTemplate {
    const list = this.getTemplates();
    return list.find((t) => t.id === id) || DEFAULT_TEMPLATE;
  },

  saveTemplate(template: CertificateTemplate): void {
    const list = this.getTemplates();
    const index = list.findIndex((t) => t.id === template.id);
    if (index >= 0) {
      list[index] = { ...template, updatedAt: new Date().toISOString() };
    } else {
      list.push({ ...template, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(list));
  },

  deleteTemplate(id: string): boolean {
    const list = this.getTemplates();
    if (list.length <= 1) return false; // Prevent deleting last template
    const filtered = list.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(filtered));
    return true;
  },

  // --- PARTICIPANTS (Approved attendee mode) ---
  getParticipants(eventId?: string): ApprovedParticipant[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
      const all: ApprovedParticipant[] = data ? JSON.parse(data) : INITIAL_PARTICIPANTS;
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(INITIAL_PARTICIPANTS));
      }
      return eventId ? all.filter((p) => p.eventId === eventId) : all;
    } catch {
      return INITIAL_PARTICIPANTS;
    }
  },

  addParticipant(participant: Omit<ApprovedParticipant, 'id' | 'issued'>): ApprovedParticipant {
    const list = this.getParticipants();
    const newParticipant: ApprovedParticipant = {
      ...participant,
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      issued: false,
    };
    list.push(newParticipant);
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(list));
    return newParticipant;
  },

  batchAddParticipants(
    eventId: string,
    records: Array<{ regId: string; name: string; email?: string; college?: string }>
  ): number {
    const list = this.getParticipants();
    let added = 0;
    records.forEach((r) => {
      if (!r.regId || !r.name) return;
      const cleanReg = r.regId.trim().toUpperCase();
      const existing = list.find((p) => p.eventId === eventId && p.regId.toUpperCase() === cleanReg);
      if (!existing) {
        list.push({
          id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          eventId,
          regId: cleanReg,
          name: r.name.trim(),
          email: r.email?.trim(),
          college: r.college?.trim() || 'Cauvery Institute of Technology',
          issued: false,
        });
        added++;
      }
    });
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(list));
    return added;
  },

  deleteParticipant(id: string): void {
    const list = this.getParticipants().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(list));
  },

  validateAttendee(
    eventId: string,
    codeOrRegId: string
  ): { valid: boolean; participant?: ApprovedParticipant; message?: string } {
    const list = this.getParticipants(eventId);
    const clean = codeOrRegId.trim().toUpperCase();
    const record = list.find((p) => p.regId.toUpperCase() === clean);

    if (!record) {
      return { valid: false, message: 'Attendee Code / Registration ID not found in approved attendee list.' };
    }
    return { valid: true, participant: record };
  },

  // --- CERTIFICATE ISSUANCE & VERIFICATION ---
  getIssuedCertificates(): IssuedCertificate[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ISSUED_CERTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ISSUED_CERTS, JSON.stringify(INITIAL_ISSUED_CERTS));
        return INITIAL_ISSUED_CERTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ISSUED_CERTS;
    }
  },

  getCertificateById(certId: string): IssuedCertificate | undefined {
    const list = this.getIssuedCertificates();
    const cleanId = certId.trim().toUpperCase();
    return list.find((c) => c.certificateId.toUpperCase() === cleanId);
  },

  issueCertificate(params: {
    eventId: string;
    participantName: string;
    regId?: string;
  }): IssuedCertificate {
    const event = this.getEventById(params.eventId);
    if (!event) throw new Error('Event not found');

    const certId = generateCertificateId();
    const newCert: IssuedCertificate = {
      certificateId: certId,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.eventDate,
      participantName: params.participantName.trim(),
      regId: params.regId?.trim().toUpperCase(),
      issuedAt: new Date().toISOString(),
      revoked: false,
      mode: event.eligibilityMode,
      templateSnapshot: event.templateSnapshot || DEFAULT_TEMPLATE,
    };

    const certList = this.getIssuedCertificates();
    certList.unshift(newCert);
    localStorage.setItem(STORAGE_KEYS.ISSUED_CERTS, JSON.stringify(certList));

    // Increment event counter
    event.issuedCount = (event.issuedCount || 0) + 1;
    this.saveEvent(event);

    // If approved attendee mode, mark participant as issued
    if (params.regId) {
      const participants = this.getParticipants();
      const pIndex = participants.findIndex(
        (p) => p.eventId === event.id && p.regId.toUpperCase() === params.regId!.toUpperCase()
      );
      if (pIndex >= 0) {
        participants[pIndex].issued = true;
        participants[pIndex].issuedAt = newCert.issuedAt;
        participants[pIndex].certificateId = certId;
        localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
      }
    }

    return newCert;
  },

  toggleCertificateRevocation(certId: string, reason?: string): boolean {
    const list = this.getIssuedCertificates();
    const cert = list.find((c) => c.certificateId === certId);
    if (!cert) return false;
    cert.revoked = !cert.revoked;
    cert.revocationReason = cert.revoked ? (reason || 'Revoked by Department Administrator') : undefined;
    localStorage.setItem(STORAGE_KEYS.ISSUED_CERTS, JSON.stringify(list));
    return true;
  },

  // --- ADMIN AUTH STATE ---
  getAdminSession(): AdminUser | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
      if (!data) return null;
      const parsed: AdminUser = JSON.parse(data);
      // Strictly enforce that only pradhanv2409@gmail.com is valid
      if (parsed.email.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  },

  setAdminSession(admin: AdminUser | null): void {
    if (admin && admin.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(admin));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    }
  },

  getAdminPasswordHash(): string | null {
    try {
      return localStorage.getItem('citdevhub_admin_pwd_hash_v4');
    } catch {
      return null;
    }
  },

  setAdminPasswordHash(hash: string): void {
    localStorage.setItem('citdevhub_admin_pwd_hash_v4', hash);
  },
};
