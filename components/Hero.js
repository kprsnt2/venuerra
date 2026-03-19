import { PROFILE } from '@/lib/profile-data';

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg" />
      <div className="hero-content">
        <div className="hero-photo-container animate-in">
          <div className="hero-photo">
            <span className="hero-photo-initials">VG</span>
          </div>
        </div>

        <div className="hero-text">
          {PROFILE.openToWork && (
            <div className="open-to-work-banner animate-in animate-delay-1">
              <span className="open-to-work-dot" />
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>Open to Work</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                — Project Manager, PMO, Scrum Master
              </span>
            </div>
          )}

          <h1 className="animate-in animate-delay-1">{PROFILE.name}</h1>

          <p className="hero-subtitle animate-in animate-delay-2">{PROFILE.title}</p>

          <div className="hero-company animate-in animate-delay-2">
            🏢 {PROFILE.company}
          </div>

          <div className="hero-location animate-in animate-delay-3">
            📍 {PROFILE.location}
          </div>

          <div className="hero-badges animate-in animate-delay-3">
            {PROFILE.certifications.map((cert) => (
              <span key={cert} className="badge badge-amber">🏅 {cert}</span>
            ))}
            {PROFILE.domains.map((domain) => (
              <span key={domain} className="badge badge-cyan">🔧 {domain}</span>
            ))}
            <span className="badge badge-accent">📊 {PROFILE.yearsExperience} Years</span>
          </div>

          <div className="hero-actions animate-in animate-delay-4">
            <a href="/jobs" className="btn-primary" id="hero-find-jobs">
              🔍 Find Jobs
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              id="hero-linkedin"
            >
              💼 LinkedIn
            </a>
            <a href="#experience" className="btn-outline" id="hero-view-experience">
              📋 View Experience
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
