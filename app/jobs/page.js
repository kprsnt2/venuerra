import Navbar from '@/components/Navbar';
import JobTabs from '@/components/JobTabs';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export const metadata = {
  title: 'Job Finder | Venu Gopal Erra',
  description: 'AI-curated job opportunities for Project Manager roles in UK, Hyderabad, India, and Remote - powered by Claude & Gemini on Vertex AI',
};

async function getJobData() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'jobs.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default async function JobsPage() {
  const jobData = await getJobData();

  return (
    <>
      <Navbar />
      <main className="jobs-page">
        <div className="jobs-header">
          <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1rem' }}>
            ← Back to Profile
          </Link>
          <h1>AI Job Finder</h1>
          <p>
            Curated opportunities for Project Manager, PMO & Scrum Master roles
            <br />
            <span style={{ color: 'var(--accent-2)' }}>UK · Hyderabad · Telangana · India · Remote</span>
          </p>
        </div>

        {jobData ? (
          <JobTabs jobData={jobData} />
        ) : (
          <div className="no-jobs">
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</p>
            <h3>Job data not yet generated</h3>
            <p>The AI job search runs daily at 1:00 PM IST.</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Configure your Vertex AI credentials and trigger the GitHub Action to get started.
            </p>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Powered by Vertex AI · Claude Opus 4.6 & Gemini 3.1 Pro · Updated daily at 1:00 PM IST</p>
      </footer>
    </>
  );
}
