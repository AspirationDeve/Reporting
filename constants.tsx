
import { ClientProfile, DashboardData, TechnicalTask, RoadmapItem } from './types';

const INITIAL_TECH_TASKS: TechnicalTask[] = [
  { task: "Website Visibility [SEMrush]", goal: "Increase to 15%", status: "Currently 8.4%", isCompleted: false },
  { task: "Backlink Goal", goal: "50 High DA Links", status: "32 Links Built", isCompleted: false },
  { task: "Article Posting", goal: "4 per Month", status: "4 Posted", isCompleted: true },
  { task: "Google Ads", goal: "Campaign Optimization", status: "Active & Scaling", isCompleted: true },
  { task: "Content Humanization Check", goal: "100% Pass", status: "In Progress", isCompleted: false },
  { task: "Content & Image Updates", goal: "Bi-weekly", status: "Batch 2 Pending", isCompleted: false },
  { task: "Google Analytics Setup", goal: "GA4 Config", status: "Connected", isCompleted: true },
  { task: "Google Search Console Setup", goal: "Verified", status: "Active", isCompleted: true },
  { task: "Sitemap Setup", goal: "XML Validated", status: "Indexed", isCompleted: true },
  { task: "Re-indexing Pages into GSC", goal: "Priority Pages", status: "80% Complete", isCompleted: false },
  { task: "Write Image Alt Tag", goal: "Site-wide", status: "Completed", isCompleted: true },
  { task: "Keyword Mapping Sheet Creation", goal: "Core Pages", status: "Approved", isCompleted: true },
  { task: "SEO Mapping Sheet Implementation", goal: "On-page Sync", status: "Live", isCompleted: true },
  { task: "Bing Webmaster Tools Setup", goal: "Verified", status: "Active", isCompleted: true },
  { task: "Yandex Search Engine Setup", goal: "Connected", status: "Active", isCompleted: true },
  { task: "Google Ads Setup", goal: "Conversion Tracking", status: "Operational", isCompleted: true },
  { task: "Title & Meta Writing", goal: "Top 50 Pages", status: "45/50 Done", isCompleted: false },
  { task: "Keyword Research & Finalization", goal: "Main Pillars", status: "Signed Off", isCompleted: true },
  { task: "Robots.txt File Setup", goal: "Optimized", status: "Live", isCompleted: true },
  { task: "Removed Unused Image", goal: "Speed Optimization", status: "Completed", isCompleted: true },
];

const INITIAL_ROADMAP: RoadmapItem[] = [
  { phase: "Phase 1", title: "Technical Audit & Setup", status: "completed", date: "Jan 2024" },
  { phase: "Phase 2", title: "Content Strategy & Launch", status: "completed", date: "Feb 2024" },
  { phase: "Phase 3", title: "Aggressive Link Building", status: "current", date: "Mar 2024" },
  { phase: "Phase 4", title: "Conversion Optimization", status: "upcoming", date: "Apr 2024" },
];

const MOCK_DATA: DashboardData = {
  rankings: Array.from({ length: 50 }, (_, i) => ({
    keyword: `Strategic Property Keyword #${i + 1}`,
    currentRank: Math.floor(Math.random() * 20) + 1,
    previousRank: Math.floor(Math.random() * 20) + 3,
    change: Math.floor(Math.random() * 5) - 2,
    volume: Math.floor(Math.random() * 5000) + 500,
    url: "/properties"
  })),
  visibility: 52,
  optimizationScore: 92,
  kpis: [
    { category: "Lead Gen", metric: "Qualified Leads", target: 100, actual: 70, status: 'on-track' },
    { category: "Digital", metric: "Website Traffic", target: 10000, actual: 8500, status: 'at-risk' },
  ],
  googleAds: [
    { campaign: "Search - Dubai Core", impressions: 700000, clicks: 200, ctr: 0.03, cpc: 10, spend: 2000, conversions: 50, roas: 4.5 },
  ],
  metaAds: [
    { campaign: "Social Retargeting", impressions: 700000, clicks: 200, ctr: 0.03, cpc: 10, spend: 2000, conversions: 50, roas: 5.2 },
  ],
  otherKpis: INITIAL_TECH_TASKS,
  roadmap: INITIAL_ROADMAP
};

export const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: 'client-001',
    kyc: {
      companyName: "Emaar Properties",
      contactPerson: "Ahmed Hassan",
      email: "ahmed@emaar.ae",
      phone: "+971 50 123 4567",
      contractSigned: true,
      registrationDate: "2024-01-15",
      contractStartDate: "2024-01-01",
      contractExpiryDate: "2025-12-31",
      status: 'approved',
      currency: 'AED'
    },
    assignedServices: ['rankings', 'kpis', 'google', 'meta', 'other_kpis', 'roadmap', 'approvals'],
    data: MOCK_DATA,
    contentApprovals: [
      {
        id: 'app-001',
        title: 'Q2 Social Media Campaign Assets',
        canvaLink: 'https://www.canva.com/design/DAF...',
        status: 'pending',
        dateCreated: '2024-05-10',
        notes: 'Please review the new visual style for Instagram Stories.'
      }
    ]
  }
];

export const CURRENCIES = ['USD', 'AED', 'EUR', 'GBP', 'INR', 'SAR', 'QAR', 'KWD'];
