import { Mail, Phone, Briefcase, GraduationCap, Code2, Award, FolderOpen, User } from 'lucide-react';
import { CandidateProfile } from '@/types/candidate.types';
import { Dialog, DialogHeader, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { LoadingDots } from '@/components/common/LoadingDots';
import { formatDate } from '@/lib/utils/formatters';

// ── Sub-sections ─────────────────────────────────────────────────────────────

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="px-6 py-4 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-primary/70">{icon}</span>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ContactSection({ profile }: { profile: CandidateProfile }) {
  return (
    <Section icon={<Mail size={14} />} title="Contact">
      <div className="flex flex-wrap gap-3">
        {profile.email && (
          <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 text-sm text-white/70 hover:text-primary transition-colors">
            <Mail size={12} /> {profile.email}
          </a>
        )}
        {profile.phoneNumber && (
          <div className="flex items-center gap-1.5 text-sm text-white/70">
            <Phone size={12} /> {profile.phoneNumber}
          </div>
        )}
      </div>
    </Section>
  );
}

function SkillsSection({ skills }: { skills: string[] }) {
  return (
    <Section icon={<Code2 size={14} />} title="Skills">
      <div className="flex flex-wrap gap-1.5">
        {skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
      </div>
    </Section>
  );
}

function ExperienceSection({ experience }: { experience: CandidateProfile['experience'] }) {
  if (!experience?.length) return null;
  return (
    <Section icon={<Briefcase size={14} />} title="Experience">
      <div className="flex flex-col gap-3">
        {experience.map((e, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/80">{e.title}</span>
              <span className="text-xs text-white/30">{formatDate(e.from)} – {e.to ? formatDate(e.to) : 'Present'}</span>
            </div>
            <span className="text-xs text-primary/70">{e.company}</span>
            {e.description && <p className="text-xs text-white/40 mt-1 leading-relaxed">{e.description}</p>}
          </div>
        ))}
      </div>
    </Section>
  );
}

function EducationSection({ education }: { education: CandidateProfile['education'] }) {
  if (!education?.length) return null;
  return (
    <Section icon={<GraduationCap size={14} />} title="Education">
      <div className="flex flex-col gap-3">
        {education.map((e, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-white/80">{e.degree} {e.field ? `in ${e.field}` : ''}</span>
            <span className="text-xs text-primary/70">{e.institution}</span>
            {e.graduationYear && <span className="text-xs text-white/30">{e.graduationYear}</span>}
          </div>
        ))}
      </div>
    </Section>
  );
}

function ProjectsSection({ projects }: { projects: CandidateProfile['projects'] }) {
  if (!projects?.length) return null;
  return (
    <Section icon={<FolderOpen size={14} />} title="Projects">
      <div className="flex flex-col gap-3">
        {projects.map((p, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-sm font-medium text-white/80">{p.name}</span>
            {p.description && <p className="text-xs text-white/40 leading-relaxed">{p.description}</p>}
            {p.technologies && (
              <div className="flex flex-wrap gap-1 mt-1">
                {p.technologies.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

function CertificationsSection({ certs }: { certs: CandidateProfile['certifications'] }) {
  if (!certs?.length) return null;
  return (
    <Section icon={<Award size={14} />} title="Certifications">
      <div className="flex flex-col gap-2">
        {certs.map((c, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm text-white/70">{c.name}</span>
            {c.year && <span className="text-xs text-white/30">{c.year}</span>}
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateProfile | null;
  isLoading: boolean;
}

export function CandidateModal({ isOpen, onClose, candidate, isLoading }: CandidateModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <User size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              {candidate?.name || 'Candidate Profile'}
            </h2>
            {typeof candidate?.experienceYears === 'number' && (
              <p className="text-xs text-white/40">{candidate.experienceYears} years of experience</p>
            )}
          </div>
        </div>
        <DialogClose onClose={onClose} />
      </DialogHeader>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <LoadingDots />
        </div>
      ) : candidate ? (
        <div>
          {(candidate.email || candidate.phoneNumber) && <ContactSection profile={candidate} />}
          {candidate.skills && candidate.skills.length > 0 && <SkillsSection skills={candidate.skills} />}
          {candidate.experience && <ExperienceSection experience={candidate.experience} />}
          {candidate.education && <EducationSection education={candidate.education} />}
          {candidate.projects && <ProjectsSection projects={candidate.projects} />}
          {candidate.certifications && <CertificationsSection certs={candidate.certifications} />}

          {/* Raw content fallback */}
          {!candidate.skills?.length && !candidate.experience?.length && candidate.rawContent && (
            <div className="px-6 py-4">
              <pre className="text-xs text-white/40 whitespace-pre-wrap leading-relaxed font-mono max-h-80 overflow-y-auto">
                {candidate.rawContent}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center py-16 text-white/30 text-sm">
          No candidate data available
        </div>
      )}
    </Dialog>
  );
}
