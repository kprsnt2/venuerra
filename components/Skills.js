import { PROFILE } from '@/lib/profile-data';

export default function Skills() {
  return (
    <section className="section" id="skills">
      <div className="section-header">
        <h2 className="section-title">Skills</h2>
        <p className="section-subtitle">Core competencies & domain expertise</p>
      </div>

      <div className="skills-grid">
        {PROFILE.skills.map((skill, idx) => (
          <span
            key={skill}
            className="skill-tag animate-in"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
