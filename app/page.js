import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import Skills from '@/components/Skills';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Education />
        <Skills />

        {/* CTA Section */}
        <section className="section" style={{ textAlign: 'center', paddingBottom: '4rem' }}>
          <div className="section-header">
            <h2 className="section-title">AI Job Finder</h2>
            <p className="section-subtitle">
              Curated job opportunities matched by Claude & Gemini AI, updated daily at 1:00 PM IST
            </p>
          </div>
          <Link href="/jobs" className="btn-primary" id="cta-find-jobs" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
            🔍 View Job Opportunities
          </Link>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-links">
          <a href="https://www.linkedin.com/in/venu-gopal-erra-73919451/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <Link href="/jobs">Job Finder</Link>
        </div>
        <p>© {new Date().getFullYear()} Venu Gopal Erra · Built with Next.js, powered by Vertex AI</p>
      </footer>
    </>
  );
}
