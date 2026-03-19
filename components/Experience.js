import { PROFILE } from '@/lib/profile-data';

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="section-header">
        <h2 className="section-title">Experience</h2>
        <p className="section-subtitle">{PROFILE.yearsExperience}+ years across rail transport, automotive & IT</p>
      </div>

      <div className="timeline">
        {PROFILE.experience.map((exp, idx) => (
          <div
            key={idx}
            className="timeline-item"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="timeline-dot" />
            <div className="timeline-card">
              <div className="timeline-role">{exp.title}</div>
              <div className="timeline-company">
                {exp.company}
                {exp.subtitle && <span style={{ color: 'var(--text-muted)' }}> · {exp.subtitle}</span>}
              </div>
              <div className="timeline-meta">
                <span>📅 {exp.period}</span>
                <span>⏱️ {exp.duration}</span>
                {exp.type && <span>💼 {exp.type}</span>}
                {exp.location && <span>📍 {exp.location}</span>}
              </div>
              {exp.skills && exp.skills.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {exp.skills.map((skill) => (
                    <span key={skill} className="job-tag">{skill}</span>
                  ))}
                </div>
              )}
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="timeline-highlights">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
              {exp.teamManagement && exp.teamManagement.length > 0 && (
                <>
                  <div style={{ color: 'var(--accent-2)', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.8rem' }}>
                    Team Management
                  </div>
                  <ul className="timeline-highlights">
                    {exp.teamManagement.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
