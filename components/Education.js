import { PROFILE } from '@/lib/profile-data';

export default function Education() {
  const certDescriptions = {
    'PMP®': 'Project Management Professional',
    'PRINCE2® Practitioner': 'Projects IN Controlled Environments',
    'CSM®': 'Certified ScrumMaster',
  };

  return (
    <section className="section" id="education">
      <div className="section-header">
        <h2 className="section-title">Education & Certifications</h2>
      </div>

      <div className="education-grid">
        {PROFILE.education.map((edu, idx) => (
          <div key={idx} className="education-card animate-in" style={{ animationDelay: `${idx * 0.15}s` }}>
            <div className="education-icon">🎓</div>
            <div className="education-name">{edu.institution}</div>
            {edu.degree && <div className="education-degree">{edu.degree} – {edu.field}</div>}
            <div className="education-period">{edu.period}</div>
          </div>
        ))}
      </div>

      <div className="certs-grid">
        {PROFILE.certifications.map((cert, idx) => (
          <div
            key={cert}
            className="cert-card animate-in"
            style={{ animationDelay: `${(idx + 2) * 0.15}s` }}
          >
            <div className="cert-icon">🏅</div>
            <div className="cert-name">{cert}</div>
            <div className="cert-full">{certDescriptions[cert] || ''}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
