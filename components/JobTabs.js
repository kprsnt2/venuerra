'use client';

import { useState, useMemo } from 'react';

export default function JobTabs({ jobData }) {
  const [activeTab, setActiveTab] = useState('claude');
  const [activeLocation, setActiveLocation] = useState('All');

  const currentData = jobData?.[activeTab];
  const jobs = currentData?.jobs || [];

  const locations = useMemo(() => {
    const locs = new Set(['All']);
    jobs.forEach((job) => {
      const loc = job.location || '';
      if (loc.toLowerCase().includes('remote')) locs.add('Remote');
      if (loc.toLowerCase().includes('uk') || loc.toLowerCase().includes('london') || loc.toLowerCase().includes('england') || loc.toLowerCase().includes('derby') || loc.toLowerCase().includes('coventry')) locs.add('UK');
      if (loc.toLowerCase().includes('hyderabad') || loc.toLowerCase().includes('telangana')) locs.add('Hyderabad');
      if (loc.toLowerCase().includes('india')) locs.add('India');
    });
    return Array.from(locs);
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (activeLocation === 'All') return jobs;
    return jobs.filter((job) => {
      const loc = (job.location || '').toLowerCase();
      switch (activeLocation) {
        case 'UK': return loc.includes('uk') || loc.includes('london') || loc.includes('england') || loc.includes('derby') || loc.includes('coventry');
        case 'Hyderabad': return loc.includes('hyderabad') || loc.includes('telangana');
        case 'India': return loc.includes('india') || loc.includes('hyderabad') || loc.includes('telangana');
        case 'Remote': return loc.includes('remote');
        default: return true;
      }
    });
  }, [jobs, activeLocation]);

  const getMatchClass = (score) => {
    if (score >= 85) return 'high';
    if (score >= 70) return 'medium';
    return 'low';
  };

  const lastUpdated = jobData?.lastUpdated
    ? new Date(jobData.lastUpdated).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata',
      })
    : 'Not yet updated';

  return (
    <>
      <div className="jobs-updated">
        🕐 Last Updated: {lastUpdated} IST
      </div>

      {/* Tab Switcher */}
      <div className="tabs-container" id="ai-tabs">
        <button
          className={`tab-btn ${activeTab === 'claude' ? 'active' : ''}`}
          onClick={() => setActiveTab('claude')}
          id="tab-claude"
        >
          🟣 Claude <span className="tab-model-tag">Haiku 4.5</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'gemini' ? 'active' : ''}`}
          onClick={() => setActiveTab('gemini')}
          id="tab-gemini"
        >
          🔵 Gemini <span className="tab-model-tag">3.1 Pro</span>
        </button>
      </div>

      {/* Location Filters */}
      <div className="location-filters">
        {locations.map((loc) => (
          <button
            key={loc}
            className={`location-btn ${activeLocation === loc ? 'active' : ''}`}
            onClick={() => setActiveLocation(loc)}
          >
            {loc === 'All' && '🌍 '}
            {loc === 'UK' && '🇬🇧 '}
            {loc === 'Hyderabad' && '🇮🇳 '}
            {loc === 'India' && '🇮🇳 '}
            {loc === 'Remote' && '🏠 '}
            {loc}
          </button>
        ))}
      </div>

      {/* Model info */}
      {currentData && (
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Model: <strong style={{ color: 'var(--accent-light)' }}>{currentData.model}</strong>
          {' · '}
          Generated: {currentData.generated_date}
          {' · '}
          {jobs.length} total jobs found
        </div>
      )}

      {/* Jobs Grid */}
      <div className="jobs-grid">
        {filteredJobs.length === 0 ? (
          <div className="no-jobs">
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</p>
            <p>No jobs found for this location filter.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>Try selecting &quot;All&quot; to see all listings.</p>
          </div>
        ) : (
          filteredJobs.map((job, idx) => (
            <div key={job.id || idx} className="job-card" style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="job-info">
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span className={`tier-badge tier-${job.tier || 2}`}>
                    Tier {job.tier || 2}
                  </span>
                  {job.posted && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      📅 {job.posted}
                    </span>
                  )}
                </div>
                <h3>{job.title}</h3>
                <div className="job-company">{job.company}</div>
                <div className="job-meta">
                  <span className="job-meta-item">📍 {job.location}</span>
                  {job.salary && <span className="job-meta-item">💰 {job.salary}</span>}
                </div>
                <div className="job-tags">
                  {(job.tags || []).map((tag) => (
                    <span key={tag} className="job-tag">{tag}</span>
                  ))}
                </div>
                {job.why_match && <div className="job-match">💡 {job.why_match}</div>}
              </div>

              <div className="job-actions">
                <div className={`match-score ${getMatchClass(job.match_score)}`}>
                  {job.match_score}%
                  <div className="match-bar">
                    <div
                      className={`match-bar-fill ${getMatchClass(job.match_score)}`}
                      style={{ width: `${job.match_score}%` }}
                    />
                  </div>
                </div>
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-apply"
                  id={`apply-${job.id || idx}`}
                >
                  Apply →
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
