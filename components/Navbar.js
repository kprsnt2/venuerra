import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar" id="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">VG Erra</Link>
        <ul className="navbar-links">
          <li><a href="/#about">About</a></li>
          <li><a href="/#experience">Experience</a></li>
          <li><a href="/#education">Education</a></li>
          <li><a href="/#skills">Skills</a></li>
        </ul>
        <Link href="/jobs" className="navbar-cta" id="nav-jobs-btn">
          🔍 Job Finder
        </Link>
      </div>
    </nav>
  );
}
