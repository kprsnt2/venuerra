import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import Skills from '@/components/Skills';

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


      </main>

      <footer className="footer">
        <div className="footer-links">
          <a href="https://www.linkedin.com/in/venu-gopal-erra-73919451/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
        <p>© {new Date().getFullYear()} Venu Gopal Erra · Built with Next.js, powered by Vertex AI</p>
      </footer>
    </>
  );
}
