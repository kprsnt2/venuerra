import { PROFILE } from '@/lib/profile-data';

export default function About() {
  return (
    <section className="section" id="about">
      <div className="section-header">
        <h2 className="section-title">About</h2>
        <p className="section-subtitle">Professional Summary</p>
      </div>

      <div className="about-content">
        <div className="about-text animate-in">
          {PROFILE.about.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="about-stats animate-in animate-delay-2">
          <div className="stat-card">
            <div className="stat-number">{PROFILE.yearsExperience}</div>
            <div className="stat-label">Years Experience</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{PROFILE.experience.length}</div>
            <div className="stat-label">Roles Held</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{PROFILE.certifications.length}</div>
            <div className="stat-label">Certifications</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{PROFILE.connections}</div>
            <div className="stat-label">Connections</div>
          </div>
        </div>
      </div>
    </section>
  );
}
