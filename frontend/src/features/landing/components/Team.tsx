import { Check, Copy, ExternalLink, Mail, Phone, type LucideIcon } from 'lucide-react';

import type { ContactKind, TeamMember } from '../../../shared/types/types';
import { useCopyToClipboard } from '../../../shared/hooks/useCopyToClipboard';
import { useToast } from '../../../shared/components/ui/Toast';
import { TEAM, TEAM_SECTION } from '../data/content';
import Reveal from '../../../shared/components/ui/Reveal';


const CONTACT_ICON: Record<ContactKind, LucideIcon> = {
  email: Mail,
  linkedin: ExternalLink,
  github: ExternalLink,
  phone: Phone,
};const CONTACT_LABEL: Record<ContactKind, string> = { email: '', linkedin: 'LinkedIn', github: 'GitHub', phone: '' };

const hrefFor = ({ kind, value }: TeamMember['contact']): string =>
  kind === 'email' ? `mailto:${value}` : kind === 'phone' ? `tel:${value.replace(/\s/g, '')}` : value;

/** One team card: photo (or initial), name and a single way to get in touch. Email gets a copy button. */
function TeamCard({ member }: { member: TeamMember }) {
  const { copied, copy } = useCopyToClipboard();
  const { showToast } = useToast();
  const { kind, value } = member.contact;
  const Icon = CONTACT_ICON[kind];

  const handleCopy = async () => {
    const ok = await copy(value);
    showToast(ok ? `${member.name}’s email copied` : 'Couldn’t copy – select the address instead');
  };

  return (
    <article className="team-card">
      <div className="team-avatar" style={{ background: member.gradient }}>
        {member.photo ? <img src={member.photo} alt={`Photo of ${member.name}`} loading="lazy" /> : <span aria-hidden="true">{member.name.charAt(0)}</span>}
      </div>
      <h3>{member.name}</h3>
      {member.role && <p className="team-role">{member.role}</p>}

      <div className="team-contact">
        <a href={hrefFor(member.contact)} className="team-contact-link" {...(kind === 'linkedin' || kind === 'github' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          <Icon size={14} aria-hidden="true" />
          <span>{CONTACT_LABEL[kind] || value}</span>
        </a>
        {kind === 'email' && (
          <button type="button" className="team-copy" aria-label={`Copy ${member.name}’s email address`} onClick={handleCopy}>
            {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          </button>
        )}
      </div>
    </article>
  );
}

/** "Meet the team" section. Edit people in data/content.ts → TEAM. Styles: `.team-*` in landing.css. */
export default function Team() {
  return (
    <section id="team" className="section" aria-labelledby="team-title">
      <div className="section-inner">
        <Reveal className="section-intro">
          <p className="eyebrow">{TEAM_SECTION.eyebrow}</p>
          <h2 id="team-title">{TEAM_SECTION.title}</h2>
          <p>{TEAM_SECTION.description}</p>
        </Reveal>

        <div className="team-grid">
          {TEAM.map((member, index) => (
            <Reveal key={member.id} delay={index * 70}>
              <TeamCard member={member} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
