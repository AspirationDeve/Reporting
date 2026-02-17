
export enum DashboardTab {
  OVERVIEW = 'overview',
  RANKINGS = 'rankings',
  KPIS = 'kpis',
  GOOGLE = 'google',
  META = 'meta',
  OTHER_KPIS = 'other_kpis',
  ROADMAP = 'roadmap',
  APPROVALS = 'approvals',
  REPORTING = 'reporting',
  PROFILE = 'profile',
  ADMIN_CLIENTS = 'admin_clients',
  ADMIN_SYNC = 'admin_sync',
  ADMIN_SETUP = 'admin_setup',
  ADMIN_REPORT_SETUP = 'admin_report_setup'
}

export type UserRole = 'admin' | 'client';

export interface ReportSettings {
  mainTitle: string;
  coverImage: string;
  p1Heading: string;
  p1SubHeading: string;
  p2Heading: string;
  p2Body: string;
  showSecurityPage: boolean;
}

export interface AdminSettings {
  agencyLogo: string;
  urlSlug: string;
  footerCredit: string;
  primaryColor: string;
  defaultCurrency: string;
  reportSettings: ReportSettings;
}

export interface ContentApproval {
  id: string;
  title: string;
  canvaLink: string;
  status: 'pending' | 'approved' | 'rejected';
  dateCreated: string;
  notes?: string;
}

export interface TechnicalTask {
  task: string;
  goal: string;
  status: string;
  isCompleted: boolean;
}

export interface RoadmapItem {
  phase: string;
  title: string;
  status: 'completed' | 'current' | 'upcoming';
  date: string;
}

export interface KYCData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  tradeLicenseUrl?: string;
  brandBookUrl?: string;
  vatCertificateUrl?: string;
  profilePhotoUrl?: string;
  contractSigned: boolean;
  registrationDate: string;
  contractStartDate: string;
  contractExpiryDate: string; 
  status: 'pending' | 'approved';
  currency: string;
}

export interface SeoRanking {
  keyword: string;
  currentRank: number;
  previousRank: number;
  change: number;
  volume: number;
  url: string;
}

export interface KpiMetric {
  category: string;
  metric: string;
  target: number;
  actual: number;
  status: 'on-track' | 'at-risk' | 'behind';
}

export interface AdPerformance {
  campaign: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  spend: number;
  conversions: number;
  roas: number;
}

export interface DashboardData {
  rankings: SeoRanking[];
  kpis: KpiMetric[];
  googleAds: AdPerformance[];
  metaAds: AdPerformance[];
  otherKpis: TechnicalTask[];
  roadmap: RoadmapItem[];
  visibility: number;
  optimizationScore: number;
}

export interface ClientProfile {
  id: string;
  kyc: KYCData;
  assignedServices: string[];
  data: DashboardData;
  contentApprovals: ContentApproval[];
}
