export default function Navbar() {
  return (
    <nav className="navbar" id="navbar">
      <div className="navbar-inner">
        <a href="/" className="navbar-logo">VG Erra</a>
        <ul className="navbar-links">
          <li><a href="/#about">About</a></li>
          <li><a href="/#experience">Experience</a></li>
          <li><a href="/#education">Education</a></li>
          <li><a href="/#skills">Skills</a></li>
        </ul>
      </div>
    </nav>
  );
}
