import { useState, useEffect, useRef, useMemo } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  PROFILE,
  EXPERIENCE,
  CATEGORIES,
  PROJECTS,
  TOOLS,
} from "./data.js";

/* ---------- Icons ---------- */
const PlayIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.14v13.72a1 1 0 001.52.85l11-6.86a1 1 0 000-1.7l-11-6.86A1 1 0 008 5.14z" />
  </svg>
);

const CloseIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ArrowUpRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const ArrowDown = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

const ArrowLeft = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ArrowRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CheckIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CopyIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

/* ---------- Live Timezone Clock (IST) ---------- */
function TimezoneClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istString = now.toLocaleTimeString("en-GB", {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(istString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span className="time-mono">{time || "00:00:00"}</span>;
}

/* ---------- Fullscreen Cinema Modal ---------- */
function CinemaModal({ project, allProjects, onClose, onNavigate }) {
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];
  const closeBtnRef = useRef(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(prevProject);
      if (e.key === "ArrowRight") onNavigate(nextProject);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, allProjects, onClose, onNavigate, prevProject, nextProject]);

  const isVertical = project.shape === "tall" || project.aspect.includes("9:16");

  return (
    <div className="cinema-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cinema-modal-frame" onClick={(e) => e.stopPropagation()}>
        {/* Header Bar */}
        <div className="cinema-modal-header">
          <div className="cinema-header-meta">
            <span className="cinema-badge">CUT #{String(currentIndex + 1).padStart(2, "0")}</span>
            <span className="cinema-category">{project.category}</span>
            <span className="cinema-aspect">{project.aspect}</span>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="cinema-close-btn"
            onClick={onClose}
            aria-label="Close theater"
          >
            <CloseIcon size={16} />
            <span className="close-label">ESC</span>
          </button>
        </div>

        {/* Video Player */}
        <div className={`cinema-video-container ${isVertical ? "is-vertical" : "is-widescreen"}`}>
          <iframe
            src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=0&loop=1&playsinline=1&title=0&byline=0&portrait=0`}
            className="cinema-iframe"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            title={`Cut ${project.id}`}
          />
        </div>

        {/* Footer Navigation */}
        <div className="cinema-modal-footer">
          <button
            type="button"
            className="cinema-nav-btn"
            onClick={() => onNavigate(prevProject)}
            aria-label="Previous project"
          >
            <ArrowLeft size={16} />
            <span>Prev Cut</span>
          </button>
          <span className="cinema-counter">
            {currentIndex + 1} / {allProjects.length}
          </span>
          <button
            type="button"
            className="cinema-nav-btn"
            onClick={() => onNavigate(nextProject)}
            aria-label="Next project"
          >
            <span>Next Cut</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Application ---------- */
export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("All Work");
  const [activeTheaterProject, setActiveTheaterProject] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Initialize smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      lenis.destroy();
    };
  }, []);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All Work") return PROJECTS;
    return PROJECTS.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
  }, [selectedCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { "All Work": PROJECTS.length };
    PROJECTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Copy email handler
  const copyEmail = () => {
    navigator.clipboard.writeText(PROFILE.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  // Smooth scroll helper
  const scrollTo = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="app-canvas">
      {/* ========================================================
          1. MINIMAL FIXED HEADER
          ======================================================== */}
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="header-inner">
          {/* Brand */}
          <a href="#hero" className="brand-logo" onClick={(e) => scrollTo(e, "#hero")}>
            <span className="brand-avatar-dot" />
            <span className="brand-text">
              ranjeetmishra<span className="brand-dot">.work</span>
            </span>
          </a>

          {/* Availability Status (Desktop) */}
          <div className="header-status hide-mobile">
            <span className="pulse-dot" />
            <span className="status-label">AVAILABLE FOR COMMISSIONS</span>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="desktop-nav hide-mobile">
            <a href="#work" onClick={(e) => scrollTo(e, "#work")} className="nav-link">
              Work
            </a>
            <a href="#about" onClick={(e) => scrollTo(e, "#about")} className="nav-link">
              About
            </a>
            <a href="#experience" onClick={(e) => scrollTo(e, "#experience")} className="nav-link">
              Experience
            </a>
            <a href="#contact" onClick={(e) => scrollTo(e, "#contact")} className="nav-btn-pill">
              <span>Contact</span>
              <ArrowUpRight size={12} />
            </a>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-menu-btn show-mobile"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`menu-bar ${mobileMenuOpen ? "bar-1-open" : ""}`} />
            <span className={`menu-bar ${mobileMenuOpen ? "bar-2-open" : ""}`} />
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer show-mobile">
            <div className="drawer-nav">
              <a href="#work" onClick={(e) => scrollTo(e, "#work")} className="drawer-link">
                <span className="drawer-num">01</span>
                <span>Work</span>
              </a>
              <a href="#about" onClick={(e) => scrollTo(e, "#about")} className="drawer-link">
                <span className="drawer-num">02</span>
                <span>About</span>
              </a>
              <a href="#experience" onClick={(e) => scrollTo(e, "#experience")} className="drawer-link">
                <span className="drawer-num">03</span>
                <span>Experience</span>
              </a>
              <a href="#contact" onClick={(e) => scrollTo(e, "#contact")} className="drawer-link drawer-contact">
                <span className="drawer-num">04</span>
                <span>Get in Touch</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="drawer-footer">
              <span className="drawer-loc">MUMBAI, INDIA // <TimezoneClock /></span>
              <div className="drawer-status-chip">
                <span className="pulse-dot" />
                <span>COMMISSIONS OPEN Q1/Q2</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================
          2. HERO STAGE (Minimal, Monumental, Breathing Room)
          ======================================================== */}
      <section id="hero" className="section-hero">
        <div className="hero-container">
          {/* Top Location & Category Bar */}
          <div className="hero-meta-bar">
            <div className="meta-loc-item">
              <span className="pulse-dot" />
              <span>MUMBAI, INDIA // <TimezoneClock /></span>
            </div>
            <div className="meta-category-item">
              <span className="category-text">DIRECTORIAL POST-PRODUCTION & MOTION</span>
            </div>
          </div>

          {/* Monumental Headline */}
          <div className="hero-headline-wrap">
            <h1 className="hero-main-title">
              <span className="title-row title-white">ranjeetmishra</span>
              <span className="title-row title-olive">.work</span>
            </h1>
          </div>

          {/* Minimal 1-Line Director Hook */}
          <div className="hero-subtext-wrap">
            <p className="hero-statement">
              I craft film rhythm, frame economy, and visual retention that turn heads — stronger, sharper, unforgettable.
            </p>
          </div>

          {/* Dual Action Buttons */}
          <div className="hero-actions-row">
            <a href="#work" onClick={(e) => scrollTo(e, "#work")} className="btn-glow-pill">
              <span>Explore Work</span>
              <ArrowDown size={14} />
            </a>
            <a href="#contact" onClick={(e) => scrollTo(e, "#contact")} className="btn-ghost-pill">
              <span>Start a Project</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Clean Proof Metrics Strip */}
          <div className="hero-metrics-strip">
            <div className="metric-cell">
              <span className="metric-number">15M+</span>
              <span className="metric-caption">Views Generated</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-cell">
              <span className="metric-number">150+</span>
              <span className="metric-caption">Mastered Cuts</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-cell">
              <span className="metric-number">48h</span>
              <span className="metric-caption">Average First Cut</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SELECTED WORKS (Visual-First Cinema Showcase Grid)
          ======================================================== */}
      <section id="work" className="section-work">
        <div className="site-container">
          {/* Section Header */}
          <div className="section-header-row">
            <div className="section-title-col">
              <span className="section-tag">01 // SELECTED WORK</span>
              <h2 className="section-title-large">The Reel Showcase</h2>
            </div>

            {/* Category Filter Pills */}
            <div className="category-filter-wrap" role="tablist">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-pill ${selectedCategory === cat ? "is-active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                  role="tab"
                  aria-selected={selectedCategory === cat}
                >
                  <span>{cat}</span>
                  <span className="count-tag">{categoryCounts[cat] || 0}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Visual Media Grid */}
          <div className="work-grid">
            {filteredProjects.map((project, idx) => {
              const isTall = project.shape === "tall" || project.aspect.includes("9:16");
              return (
                <div
                  key={project.id}
                  className={`work-card ${isTall ? "card-tall" : "card-wide"}`}
                  onClick={() => setActiveTheaterProject(project)}
                >
                  <div className="card-media-stage">
                    <img
                      src={project.image}
                      alt={`Cut #${String(idx + 1).padStart(2, "0")}`}
                      className="card-poster"
                      loading="lazy"
                    />
                    <div className="card-overlay" />

                    {/* Top Badges */}
                    <div className="card-top-hud">
                      <span className="hud-pill">#{String(idx + 1).padStart(2, "0")}</span>
                      <span className="hud-pill pill-category">{project.category}</span>
                    </div>

                    {/* Center Play Disc */}
                    <div className="card-center-play">
                      <div className="play-disc">
                        <PlayIcon size={20} />
                      </div>
                      <span className="play-label">WATCH CUT</span>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="card-bottom-hud">
                      <span className="hud-runtime">{project.duration}</span>
                      <span className="hud-aspect">{project.aspect}</span>
                    </div>
                  </div>

                  {/* Card Editorial Caption */}
                  <div className="card-caption">
                    <div className="caption-text">
                      <h3 className="caption-title">
                        Cut #{String(idx + 1).padStart(2, "0")} • {project.category}
                      </h3>
                      <p className="caption-sub">DaVinci Resolve Grade • Audio Mastering</p>
                    </div>
                    <span className="caption-action-icon">
                      <ArrowUpRight size={15} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. ABOUT SECTION (Manifesto, Philosophy & Minimal Disciplines)
          ======================================================== */}
      <section id="about" className="section-about">
        <div className="site-container">
          <div className="section-title-col">
            <span className="section-tag">02 // ABOUT</span>
            <h2 className="section-title-large">The Craft & Direction</h2>
          </div>

          {/* Editorial Philosophy Statement */}
          <div className="manifesto-card">
            <h3 className="manifesto-quote">
              "Rhythm is not what you see. It is what you feel between the cuts."
            </h3>
            <p className="manifesto-lead">
              Independent post-production editor and motion designer based in Mumbai. Specializing in frame economy, retention pacing, and psychoacoustic sound architectures that keep audiences locked in from the opening second.
            </p>
          </div>

          {/* 3 Minimal Pillars */}
          <div className="pillars-grid">
            <div className="pillar-card">
              <span className="pillar-num">01</span>
              <h4 className="pillar-title">Frame Economy</h4>
              <p className="pillar-desc">
                Every frame must justify its presence. Eliminating hesitation, sharpening comedic or dramatic timing, and maximizing viewer retention.
              </p>
            </div>
            <div className="pillar-card">
              <span className="pillar-num">02</span>
              <h4 className="pillar-title">Psychoacoustic Sound</h4>
              <p className="pillar-desc">
                Multi-layered audio design with bespoke risers, deep sub-bass impacts, and tactile foley that command attention even on phone speakers.
              </p>
            </div>
            <div className="pillar-card">
              <span className="pillar-num">03</span>
              <h4 className="pillar-title">Color Science</h4>
              <p className="pillar-desc">
                Natural skin tone calibration, soft highlight roll-off, and cinematic film print emulation graded natively inside DaVinci Resolve Studio.
              </p>
            </div>
          </div>

          {/* Minimal Tools Suite Strip */}
          <div className="tools-strip">
            <span className="tools-lead">POST-PRODUCTION ARSENAL:</span>
            <div className="tools-pills-list">
              {TOOLS.map((tool, i) => (
                <span key={i} className="tool-chip">
                  <span className="chip-dot" />
                  <span>{tool}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. EXPERIENCE SECTION (Track Record & Timeline)
          ======================================================== */}
      <section id="experience" className="section-experience">
        <div className="site-container">
          <div className="section-title-col">
            <span className="section-tag">03 // TRACK RECORD</span>
            <h2 className="section-title-large">Work Experience</h2>
          </div>

          <div className="timeline-table">
            {EXPERIENCE.map((item, idx) => (
              <div key={idx} className="timeline-row">
                <div className="timeline-period-cell">
                  <span className="timeline-period">{item.period}</span>
                  <span className="timeline-badge">{item.type}</span>
                </div>
                <div className="timeline-role-cell">
                  <h3 className="timeline-role">{item.role}</h3>
                  <span className="timeline-company">{item.company} • {item.location}</span>
                </div>
                <div className="timeline-impact-cell">
                  <span className="impact-caption">Key Impact</span>
                  <span className="impact-badge">{item.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. CONTACT / FOOTER (Monumental Invitation)
          ======================================================== */}
      <footer id="contact" className="section-contact">
        <div className="site-container">
          <div className="contact-box">
            <span className="section-tag">04 // CONNECT</span>
            <h2 className="contact-big-title">
              Let's create something<br />
              <span className="text-olive">unforgettable.</span>
            </h2>

            {/* Interactive Email Pill with Copy Feedback */}
            <div className="email-interactive-pill">
              <a
                href={`mailto:${PROFILE.email}?subject=Project%20Inquiry%20%E2%80%94%20Ranjeet%20Mishra`}
                className="email-address-link"
              >
                {PROFILE.email}
              </a>
              <button
                type="button"
                className="copy-btn"
                onClick={copyEmail}
                title="Copy email to clipboard"
              >
                {copiedEmail ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                <span>{copiedEmail ? "COPIED" : "COPY"}</span>
              </button>
            </div>

            {/* Social Links Row */}
            <div className="contact-socials-row">
              {PROFILE.socials.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="social-pill-link"
                >
                  <span>{s.label}</span>
                  <ArrowUpRight size={12} />
                </a>
              ))}
            </div>

            {/* Bottom Meta Bar */}
            <div className="contact-footer-bar">
              <div className="footer-left">
                <span>MUMBAI, INDIA [IST] • <TimezoneClock /></span>
              </div>
              <div className="footer-center">
                <span className="footer-brand-stamp">
                  ranjeetmishra<span className="text-olive">.work</span>
                </span>
              </div>
              <div className="footer-right">
                <span>© {new Date().getFullYear()} ALL RIGHTS RESERVED</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cinema Modal Portal */}
      {activeTheaterProject && (
        <CinemaModal
          project={activeTheaterProject}
          allProjects={filteredProjects}
          onClose={() => setActiveTheaterProject(null)}
          onNavigate={(p) => setActiveTheaterProject(p)}
        />
      )}
    </div>
  );
}
