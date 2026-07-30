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
      if (loc.toLowerCase().includes('hyderabad') || loc.toLowerCase().includes('telangana')) locs.add('Hyderabad');
      if (loc.toLowerCase().includes('india') || loc.toLowerCase().includes('bangalore') || loc.toLowerCase().includes('bengaluru') || loc.toLowerCase().includes('pune') || loc.toLowerCase().includes('mumbai') || loc.toLowerCase().includes('chennai') || loc.toLowerCase().includes('delhi') || loc.toLowerCase().includes('noida') || loc.toLowerCase().includes('gurgaon') || loc.toLowerCase().includes('gurugram')) locs.add('India');
    });
    return Array.from(locs);
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (activeLocation === 'All') return jobs;
    return jobs.filter((job) => {
      const loc = (job.location || '').toLowerCase();
      switch (activeLocation) {
        case 'Hyderabad': return loc.includes('hyderabad') || loc.includes('telangana');
        case 'India': return loc.includes('india') || loc.includes('hyderabad') || loc.includes('telangana') || loc.includes('bangalore') || loc.includes('bengaluru') || loc.includes('pune') || loc.includes('mumbai') || loc.includes('chennai') || loc.includes('delhi') || loc.includes('noida') || loc.includes('gurgaon') || loc.includes('gurugram');
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
          🔵 Gemini <span className="tab-model-tag">2.5 Flash</span>
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
          {' · '}
          <span style={{ color: 'var(--accent-2)' }}>Last 24 hrs only</span>
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
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                  <span className={`tier-badge tier-${job.tier || 2}`}>
                    Tier {job.tier || 2}
                  </span>
                  {job.posted && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      📅 {job.posted}
                    </span>
                  )}
                  {job.source && (
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', color: 'var(--accent-light)' }}>
                      via {job.source}
                    </span>
                  )}
                  {job.verified === true && (
                    <span style={{ fontSize: '0.7rem', color: '#4ade80' }} title="URL verified">✅</span>
                  )}
                  {job.verified === false && (
                    <span style={{ fontSize: '0.7rem', color: '#fbbf24' }} title="URL could not be verified">⚠️</span>
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

