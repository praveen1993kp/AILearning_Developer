export interface Experience {
  company: string;
  title: string;
  from?: string | Date;
  to?: string | Date;
  duration?: string;
  description?: string;
}

export interface Education {
  degree: string;
  institution: string;
  field?: string;
  graduationYear?: string | number;
  year?: string;
}

export interface Project {
  name: string;
  title?: string;
  description?: string;
  technologies?: string[];
}

export interface Certification {
  name: string;
  issuer?: string;
  year?: string | number;
}

export interface CandidateProfile {
  id?: string;
  _id?: string;
  resumeId?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  location?: string;
  title?: string;
  company?: string;
  role?: string;
  education?: Education[];
  experience?: Experience[];
  skills?: string[];
  projects?: Project[];
  certifications?: Certification[];
  text?: string;
  snippet?: string;
  rawContent?: string;
  score?: number;
  source?: string;
  summary?: string;
  experienceYears?: number;
  total_Experience?: number;
  relevant_Experience?: number;
  processedAt?: string;
}
