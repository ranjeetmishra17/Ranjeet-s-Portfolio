import { useState, useEffect, useRef, useMemo } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  PROFILE,
  EXPERIENCE,
  CATEGORIES,
  PROJECTS,
  TOOLS,
  DISCIPLINES,
} from "./data.js";

/* ---------- SVG Icons ---------- */
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

const ExpandIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const ArrowUpRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const ArrowRight = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ArrowLeft = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
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

/* ---------- Magnetic Studio Cursor ---------- */
function MagneticStudioCursor() {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    const render = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    rafId = requestAnimationFrame(render);

    const handleMouseOver = (e) => {
      const target = e.target.closest("[data-cursor]");
      if (target) {
        setCursorText(target.getAttribute("data-cursor") || "");
        setIsHovered(true);
      } else {
        setCursorText("");
        setIsHovered(false);
      }
    };

    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className={`magnetic-cursor ${isVisible ? "is-visible" : ""} ${isHovered ? "is-hovered" : ""}`} aria-hidden="true">
      <div ref={cursorDotRef} className="cursor-dot" />
      <div ref={cursorRingRef} className="cursor-ring">
        {cursorText && <span className="cursor-text">{cursorText}</span>}
      </div>
    </div>
  );
}

/* ---------- Live Timezone Clock (Mumbai IST) ---------- */
function MumbaiClock() {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span>{timeStr || "18:00:00"} IST</span>;
}

/* ---------- Project Video Card ---------- */
function ProjectCard({ project, index, onOpenTheater }) {
  const [isPlayingInline, setIsPlayingInline] = useState(false);
  const padNum = String(index + 1).padStart(2, "0");

  const handlePlayInline = (e) => {
    e.stopPropagation();
    setIsPlayingInline(true);
  };

  const handleStopInline = (e) => {
    e.stopPropagation();
    setIsPlayingInline(false);
  };

  return (
    <article
      className={`work-card aspect-${project.shape} ${isPlayingInline ? "is-playing" : ""}`}
      data-cursor={isPlayingInline ? "" : "PLAY"}
    >
      <div className="card-media-wrapper">
        {isPlayingInline ? (
          <div className="card-inline-player">
            <iframe
              src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=0&loop=1&playsinline=1&title=0&byline=0&portrait=0`}
              className="vimeo-inline-iframe"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              title={project.title}
            />
            <button
              type="button"
              className="card-stop-inline-btn"
              onClick={handleStopInline}
              aria-label="Stop video"
              data-cursor="CLOSE"
            >
              <CloseIcon size={14} />
              <span>Close</span>
            </button>
          </div>
        ) : (
          <>
            <img
              src={project.image}
              alt={project.title}
              className="card-poster"
              loading="lazy"
              decoding="async"
            />
            <div className="card-overlay" onClick={handlePlayInline}>
              <div className="card-play-pill">
                <PlayIcon size={16} />
                <span>Play Cut</span>
              </div>
            </div>
          </>
        )}

        <div className="card-top-badges">
          <span className="badge-shape">{project.aspect}</span>
          {project.metrics && <span className="badge-metric">{project.metrics}</span>}
        </div>

        <button
          type="button"
          className="card-expand-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpenTheater(project);
          }}
          aria-label={`Open ${project.title} in Cinema Theater`}
          title="Fullscreen Theater"
          data-cursor="EXPAND"
        >
          <ExpandIcon size={15} />
        </button>
      </div>

      <div className="card-caption">
        <div className="caption-meta">
          <span className="caption-num">#{padNum}</span>
          <span className="caption-category">{project.category}</span>
        </div>
        <h3 className="caption-title" onClick={() => onOpenTheater(project)}>
          {project.title}
        </h3>
        <p className="caption-desc">{project.description}</p>
      </div>
    </article>
  );
}

/* ---------- Cinema Theater Modal ---------- */
function CinemaTheaterModal({ project, allProjects, onClose, onNavigate }) {
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];
  const padNum = String(currentIndex + 1).padStart(2, "0");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(prevProject);
      if (e.key === "ArrowRight") onNavigate(nextProject);
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [project, onClose, onNavigate, prevProject, nextProject]);

  return (
    <div
      className="theater-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Cinema Theater Player"
      data-cursor="CLOSE"
    >
      <div className="theater-dialog" onClick={(e) => e.stopPropagation()} data-cursor="">
        <div className="theater-topbar">
          <div className="theater-title-info">
            <span className="theater-index">CUT #{padNum}</span>
            <h2 className="theater-title">{project.title}</h2>
            <span className="theater-aspect-tag">{project.aspect} • {project.category}</span>
          </div>

          <button
            type="button"
            className="theater-close-btn"
            onClick={onClose}
            aria-label="Close Theater"
            data-cursor="CLOSE"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className={`theater-screen aspect-${project.shape}`}>
          <iframe
            src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=0&loop=1&playsinline=1&title=0&byline=0&portrait=0`}
            className="theater-iframe"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            title={project.title}
          />
        </div>

        <div className="theater-bottombar">
          <div className="theater-nav-controls">
            <button
              type="button"
              className="theater-nav-btn"
              onClick={() => onNavigate(prevProject)}
              data-cursor="PREV"
            >
              <ArrowLeft size={14} />
              <span>Prev Cut</span>
            </button>
            <span className="theater-pagination">
              {currentIndex + 1} / {allProjects.length}
            </span>
            <button
              type="button"
              className="theater-nav-btn"
              onClick={() => onNavigate(nextProject)}
              data-cursor="NEXT"
            >
              <span>Next Cut</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <a
            href={`https://vimeo.com/${project.vimeoId}`}
            target="_blank"
            rel="noreferrer"
            className="theater-vimeo-link"
            data-cursor="OPEN"
          >
            <span>Open in Vimeo</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ========================================================
   MAIN APPLICATION COMPONENT
   ======================================================== */
export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTheaterProject, setActiveTheaterProject] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lenisRef = useRef(null);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetId, { offset: -70, duration: 1.1 });
    } else {
      const el = document.querySelector(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All" || selectedCategory === "All Work") return PROJECTS;
    return PROJECTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const copyEmail = () => {
    navigator.clipboard.writeText(PROFILE.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  return (
    <div className="portfolio-app">
      {/* Magnetic Cursor */}
      <MagneticStudioCursor />

      {/* Atmospheric Background Ray & Gradients (matches the user's reference image) */}
      <div className="ambient-background" aria-hidden="true">
        <div className="ambient-gradient-1" />
        <div className="ambient-gradient-2" />
        <div className="ambient-light-ray" />
      </div>

      {/* ========================================================
          NAVIGATION BAR
          ======================================================== */}
      <header className="navbar-wrapper">
        <div className="navbar-container">
          <a
            href="#hero"
            className="navbar-brand"
            onClick={(e) => scrollToSection(e, "#hero")}
            data-cursor="HOME"
          >
            <span className="brand-text">ranjeetmishra</span>
            <span className="brand-dot-ext">.work</span>
          </a>

          <div className="navbar-status hide-mobile">
            <span className="status-dot-pulse" />
            <span className="status-label">Available for Commissions • Mumbai</span>
          </div>

          <nav className="navbar-links hide-mobile">
            <a href="#work" onClick={(e) => scrollToSection(e, "#work")} data-cursor="WORK">
              Work
            </a>
            <a href="#process" onClick={(e) => scrollToSection(e, "#process")} data-cursor="PROCESS">
              Process
            </a>
            <a href="#about" onClick={(e) => scrollToSection(e, "#about")} data-cursor="ABOUT">
              About
            </a>
            <a
              href="#contact"
              className="navbar-cta-pill"
              onClick={(e) => scrollToSection(e, "#contact")}
              data-cursor="CONTACT"
            >
              <span>Get in Touch</span>
              <ArrowUpRight size={13} />
            </a>
          </nav>

          <button
            type="button"
            className="navbar-hamburger show-mobile"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <CloseIcon size={18} /> : <span>Menu</span>}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer show-mobile">
            <a href="#work" onClick={(e) => scrollToSection(e, "#work")}>
              01 // Work
            </a>
            <a href="#process" onClick={(e) => scrollToSection(e, "#process")}>
              02 // Process
            </a>
            <a href="#about" onClick={(e) => scrollToSection(e, "#about")}>
              03 // About
            </a>
            <a href="#contact" className="mobile-drawer-cta" onClick={(e) => scrollToSection(e, "#contact")}>
              04 // Get in Touch →
            </a>
          </div>
        )}
      </header>

      {/* ========================================================
          HERO STAGE (INSPIRED BY THE USER'S IMAGE)
          ======================================================== */}
      <section id="hero" className="hero-stage">
        <div className="hero-content-container">
          {/* Top Metadata Strip */}
          <div className="hero-meta-strip">
            <div className="hero-meta-item">
              <span className="meta-indicator" />
              <span>MUMBAI, INDIA // <MumbaiClock /></span>
            </div>
            <div className="hero-meta-item hide-mobile">
              <span className="meta-dim">SPECIALTY:</span>
              <span>RETENTION RHYTHM & 35MM CINEMA COLOR</span>
            </div>
            <div className="hero-meta-item">
              <span className="meta-highlight">15M+ VIEWS GENERATED</span>
            </div>
          </div>

          {/* Monumental Brand Typography */}
          <div className="hero-title-block">
            <h1 className="hero-brand-display">
              <span className="hero-name-part">ranjeetmishra</span>
              <span className="hero-ext-part">.work</span>
            </h1>
          </div>

          {/* Minimalist Subtitle */}
          <p className="hero-subheadline">
            Film Editor & Post-Production Director. Engineering surgical retention pacing,
            psychoacoustic audio, and cinema-grade finishes that command attention.
          </p>

          {/* Minimalist Performance Metric Pills */}
          <div className="hero-metrics-row">
            <div className="metric-pill">
              <span className="metric-num">15M+</span>
              <span className="metric-tag">Views Mastered</span>
            </div>
            <div className="metric-pill">
              <span className="metric-num">150+</span>
              <span className="metric-tag">Film Cuts</span>
            </div>
            <div className="metric-pill">
              <span className="metric-num">48h</span>
              <span className="metric-tag">First-Cut Turnaround</span>
            </div>
            <div className="metric-pill">
              <span className="metric-num">100%</span>
              <span className="metric-tag">Retention Focus</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="hero-cta-cluster">
            <a
              href="#work"
              className="btn-primary-olive"
              onClick={(e) => scrollToSection(e, "#work")}
              data-cursor="EXPLORE"
            >
              <PlayIcon size={15} />
              <span>Explore Selected Work</span>
            </a>

            <button
              type="button"
              className="btn-secondary-glass"
              onClick={copyEmail}
              data-cursor="COPY"
            >
              {copiedEmail ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
              <span>{copiedEmail ? "Email Copied!" : "Copy Email"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          SELECTED WORK SECTION
          ======================================================== */}
      <section id="work" className="work-section">
        <div className="work-container">
          <div className="section-header-row">
            <div className="section-title-group">
              <span className="section-eyebrow">PORTFOLIO</span>
              <h2 className="section-title">Selected Work</h2>
            </div>

            {/* Filter Pills */}
            <div className="category-pills-row" role="tablist">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-pill ${selectedCategory === cat ? "is-active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                  data-cursor="FILTER"
                >
                  {cat === "All" ? `All Work (${PROJECTS.length})` : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Work Cards Grid */}
          <div className="work-grid">
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                onOpenTheater={setActiveTheaterProject}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          PROCESS / ANATOMY OF A CUT
          ======================================================== */}
      <section id="process" className="process-section">
        <div className="process-container">
          <div className="section-header-centered">
            <span className="section-eyebrow">METHODOLOGY</span>
            <h2 className="section-title">Anatomy of a Cut</h2>
            <p className="section-subtitle">
              Four surgical pillars behind every high-retention post-production edit.
            </p>
          </div>

          <div className="process-grid">
            {DISCIPLINES.map((item) => (
              <div key={item.num} className="process-card" data-cursor="INSPECT">
                <div className="process-card-top">
                  <span className="process-num">{item.num}</span>
                  <span className="process-tagline">{item.tagline}</span>
                </div>
                <h3 className="process-title">{item.title}</h3>
                <p className="process-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          ABOUT & TRACK RECORD
          ======================================================== */}
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-split-grid">
            {/* Left Column: Bio & Toolkit */}
            <div className="about-bio-column">
              <span className="section-eyebrow">BACKGROUND</span>
              <h2 className="section-title">Director's Eye. Surgical Frame Economy.</h2>
              <p className="about-paragraph">
                Based in Mumbai, I collaborate with venture-backed creators, creative agencies,
                and ambitious brands globally to turn raw footage into cinematic, high-velocity assets.
              </p>
              <p className="about-paragraph">
                Every project is treated like a theatrical release — calibrated for hook retention,
                visceral sound immersion, and precision color fidelity.
              </p>

              <div className="toolkit-box">
                <span className="toolkit-label">CORE TOOLKIT & PIPELINE:</span>
                <div className="toolkit-tags">
                  {TOOLS.map((tool) => (
                    <span key={tool} className="tool-tag">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Experience Timeline */}
            <div className="about-experience-column">
              <span className="section-eyebrow">TRACK RECORD</span>
              <div className="experience-list">
                {EXPERIENCE.map((exp, idx) => (
                  <div key={idx} className="experience-item">
                    <div className="exp-period-row">
                      <span className="exp-period">{exp.period}</span>
                      <span className="exp-impact-badge">{exp.impact}</span>
                    </div>
                    <h3 className="exp-role">{exp.role}</h3>
                    <div className="exp-company">{exp.company} • {exp.location}</div>
                    <p className="exp-highlight">{exp.highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CONTACT / FOOTER SECTION
          ======================================================== */}
      <footer id="contact" className="contact-footer">
        <div className="contact-container">
          <div className="contact-card">
            <span className="contact-eyebrow">LET'S BUILD SOMETHING UNFORGETTABLE</span>

            <div className="footer-brand-title">
              <span className="footer-name">ranjeetmishra</span>
              <span className="footer-ext">.work</span>
            </div>

            <p className="contact-desc">
              Currently accepting select projects, brand films, and retained post-production pipelines.
            </p>

            <div className="contact-actions">
              <a
                href={`mailto:${PROFILE.email}`}
                className="btn-primary-olive large"
                data-cursor="EMAIL"
              >
                <span>{PROFILE.email}</span>
                <ArrowUpRight size={16} />
              </a>

              <button
                type="button"
                className="btn-secondary-glass large"
                onClick={copyEmail}
                data-cursor="COPY"
              >
                {copiedEmail ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                <span>{copiedEmail ? "Copied to Clipboard!" : "Copy Address"}</span>
              </button>
            </div>

            <div className="contact-socials-row">
              {PROFILE.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                  data-cursor="VISIT"
                >
                  <span>{s.label}</span>
                  <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-bottom-bar">
            <span>© {new Date().getFullYear()} ranjeetmishra.work — All Rights Reserved</span>
            <div className="footer-meta-right">
              <span>Mumbai, India [IST]</span>
              <span className="footer-sep">•</span>
              <a href="#hero" onClick={(e) => scrollToSection(e, "#hero")} className="back-to-top">
                Back to Top ↑
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================
          FULLSCREEN CINEMA THEATER MODAL
          ======================================================== */}
      {activeTheaterProject && (
        <CinemaTheaterModal
          project={activeTheaterProject}
          allProjects={filteredProjects}
          onClose={() => setActiveTheaterProject(null)}
          onNavigate={(nextP) => setActiveTheaterProject(nextP)}
        />
      )}
    </div>
  );
}
