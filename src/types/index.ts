export type EligibilityMode = 'open' | 'approved_attendees';

export type EventStatus = 'draft' | 'published' | 'unpublished' | 'archived';

export interface SignatureConfig {
  enabled: boolean;
  label: string;
  name: string;
  title: string;
  signatureType: 'transparent_image' | 'blank_line';
  signatureDataUrl?: string; // base64 or SVG data url
}

export interface CertificateTemplate {
  id: string;
  name: string;
  isDefault: boolean;
  title: string; // e.g. "CERTIFICATE OF PARTICIPATION" or "CERTIFICATE OF ACHIEVEMENT"
  subtitle: string; // e.g. "This certificate is proudly presented to"
  statementTemplate: string; // e.g. "for participating in {eventName} organized by Student Club – CITDEVHUB..."
  institutionName: string;
  departmentName: string;
  clubName: string;
  primaryColor: string; // LinkedIn blue #0A66C2
  accentColor: string;
  textColor: string;
  borderStyle: 'classic_double' | 'modern_minimal' | 'tech_geometric';
  showQrCode: boolean;
  showWatermark: boolean;
  signatures: {
    principal: SignatureConfig;
    hod: SignatureConfig;
    clubLead: SignatureConfig;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  eventDate: string; // ISO date string or formatted date
  venue: string;
  speakerOrLead?: string;
  status: EventStatus;
  eligibilityMode: EligibilityMode;
  templateId: string;
  templateSnapshot: CertificateTemplate;
  bannerGradient: string;
  issuedCount: number;
  maxAttendees?: number;
  requireRegCode: boolean;
  isComingSoon?: boolean;
  hasCertificate?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovedParticipant {
  id: string;
  eventId: string;
  regId: string; // Attendee code e.g. CIT2026-AI01
  name: string;
  email?: string;
  college?: string;
  issued: boolean;
  issuedAt?: string;
  certificateId?: string;
}

export interface IssuedCertificate {
  certificateId: string; // e.g. CITDH-2026-7F82A9C1
  eventId: string;
  eventTitle: string;
  eventDate: string;
  participantName: string;
  regId?: string;
  issuedAt: string;
  revoked: boolean;
  revocationReason?: string;
  mode: EligibilityMode;
  templateSnapshot: CertificateTemplate;
}

export interface AdminUser {
  email: string;
  role: 'superadmin' | 'organizer';
  name: string;
}
