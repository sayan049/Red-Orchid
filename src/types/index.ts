export type WorkCategory = "Short Film" | "Photography" | "Reels" | "Commercial" | "Branding";

export type AspectRatio = "16:9" | "2.39:1" | "4:5" | "9:16" | "1:1";

export interface CreditItem {
  role: string;
  name: string;
}

export interface TechnicalSpecs {
  camera?: string;
  lenses?: string;
  aspectRatio?: string;
  colorGrade?: string;
  soundDesign?: string;
  location?: string;
  filmStock?: string;
}

export interface StillItem {
  id: string;
  url: string;
  caption?: string;
  aspectRatio?: "16:9" | "4:5" | "9:16" | "1:1" | "3:2";
  camera?: string;
  iso?: string;
  focalLength?: string;
}

export interface WorkItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  client: string;
  category: WorkCategory;
  subCategory?: string;
  year: string;
  duration?: string;
  aspectRatio: AspectRatio;
  coverImage: string;
  videoUrl?: string;
  posterUrl?: string;
  synopsis: string;
  directorStatement?: string;
  credits: CreditItem[];
  technicalSpecs?: TechnicalSpecs;
  stills: StillItem[];
  awards?: string[];
  featured: boolean;
  trending: boolean;
  order: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  featuredWorkImage: string;
  aspectRatio: string;
}

export interface ContactInquiry {
  name: string;
  email: string;
  company?: string;
  serviceType: string;
  budgetRange: string;
  timeline?: string;
  message: string;
}
