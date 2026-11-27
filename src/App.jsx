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

/* ---------- Minimal SVGs ---------- */
const PlayIcon = ({ size = 20 }) => (
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

const CheckIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CopyIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

/* ---------- Rotating 4-Point Star Icon ---------- */
function StarIcon() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let lastY = window.scrollY;
    let boost = 0;
    let rot = 0;
    let rafId;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = Math.abs(currentY - lastY);
      boost = Math.min(diff * 0.35, 20);
      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const tick = () => {
      boost *= 0.94;
      rot = (rot + 0.6 + boost) % 360;
      setRotation(rot);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="star-icon" style={{ transform: `rotate(${rotation}deg)` }} aria-hidden="true">
      <svg width="38" height="38" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21 0C21.9 11.3 30.7 20.1 42 21C30.7 21.9 21.9 30.7 21 42C20.1 30.7 11.3 21.9 0 21C11.3 20.1 20.1 11.3 21 0Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

/* ---------- Live Timezone Clock (Mumbai IST) ---------- */
function TimezoneClock() {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setTimeStr(now.toLocaleTimeString("en-GB", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span className="timezone-live-clock">{timeStr || "23:56:09"}</span>;
}

/* ---------- Stagger Nav Link (Clean Rolling Text Effect) ---------- */
function StaggerLink({ href, children, className = "", onClick }) {
  return (
    <a href={href} className={`stagger-link ${className}`} onClick={onClick}>
      <span className="stagger-link__inner">
        <span className="stagger-link__layer is-default">{children}</span>
        <span className="stagger-link__layer is-hover" aria-hidden="true">{children}</span>
      </span>
    </a>
  );
}

/* ---------- Velocity Infinite Marquee ---------- */
function VelocityMarquee() {
  return (
    <div className="marquee-advanced" aria-hidden="true">
      <div className="marquee-advanced__track">
        <div className="marquee-advanced__item">
          <span>RANJEETMISHRA<span className="text-color-olive">.WORK</span></span>
          <span className="marquee-star">✦</span>
          <span>FILM & VIDEO POST-PRODUCTION</span>
          <span className="marquee-star">✦</span>
          <span>15M+ VIEWS GENERATED</span>
          <span className="marquee-star">✦</span>
          <span>MUMBAI [IST]</span>
          <span className="marquee-star">✦</span>
          <span>DAVINCI RESOLVE COLOR</span>
          <span className="marquee-star">✦</span>
          <span>COMMISSIONS OPEN</span>
          <span className="marquee-star">✦</span>
        </div>
        <div className="marquee-advanced__item">
          <span>RANJEETMISHRA<span className="text-color-olive">.WORK</span></span>
          <span className="marquee-star">✦</span>
          <span>FILM & VIDEO POST-PRODUCTION</span>
          <span className="marquee-star">✦</span>
          <span>15M+ VIEWS GENERATED</span>
          <span className="marquee-star">✦</span>
          <span>MUMBAI [IST]</span>
          <span className="marquee-star">✦</span>
          <span>DAVINCI RESOLVE COLOR</span>
          <span className="marquee-star">✦</span>
          <span>COMMISSIONS OPEN</span>
          <span className="marquee-star">✦</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Interactive Video Card ---------- */
function VideoProjectCard({ project, index, onOpenTheater }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const padNum = String(index + 1).padStart(2, "0");

  const startPlayback = (e) => {
    e.stopPropagation();
    setIsPlaying(true);
  };

  const stopPlayback = (e) => {
    e.stopPropagation();
    setIsPlaying(false);
  };

  return (
    <div className={`video-card-item shape-${project.shape} ${isPlaying ? "is-playing" : ""}`}>
      <div className="card-media-stage">
        {isPlaying ? (
          <div className="card-player-wrap">
            <iframe
              src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=0&loop=1&playsinline=1&title=0&byline=0&portrait=0`}
              className="card-vimeo-iframe"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              title={project.title}
            />
            <div className="card-player-hud">
              <span className="hud-cut-badge">CUT #{padNum}</span>
              <button
                type="button"
                className="hud-close-btn"
                onClick={stopPlayback}
                title="Stop playback"
                aria-label="Stop playback"
              >
                <CloseIcon size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div
            className="card-poster-surface"
            onClick={startPlayback}
            title="Click to play in-card"
          >
            <img
              src={project.image}
              alt={`Thumbnail for ${project.title}`}
              className="card-poster-img"
              loading="lazy"
            />

            {/* Viewfinder Corners */}
            <div className="viewfinder-brackets" aria-hidden="true">
              <span className="vf-bracket vf-tl" />
              <span className="vf-bracket vf-tr" />
              <span className="vf-bracket vf-bl" />
              <span className="vf-bracket vf-br" />
            </div>

            <div className="card-vignette-overlay" />

            {/* Top Slates */}
            <div className="card-top-hud">
              <span className="card-num-pill">#{padNum}</span>
              <span className="card-category-pill">{project.category}</span>
            </div>

            {/* Center Play Disc */}
            <div className="card-center-play">
              <div className="play-disc-circle">
                <PlayIcon size={22} />
              </div>
              <span className="play-disc-label">PLAY CUT</span>
            </div>

            {/* Bottom Floating Metadata */}
            <div className="card-bottom-hud">
              <span className="card-aspect-tag">{project.aspect}</span>
              <span className="card-duration-tag">{project.duration}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Detail Footer */}
      <div className="card-detail-footer">
        <div className="card-title-meta">
          <h3 className="card-title-text">{project.title}</h3>
          <p className="card-client-text">
            <span>{project.client}</span>
            <span className="meta-bullet">•</span>
            <span className="text-color-olive">{project.grade}</span>
          </p>
        </div>

        <button
          type="button"
          className="card-theater-trigger"
          onClick={() => onOpenTheater(project)}
          title="Open in Fullscreen Cinema Theater"
          aria-label={`Open ${project.title} in cinema theater`}
        >
          <span>THEATER</span>
          <ExpandIcon size={13} />
        </button>
      </div>
    </div>
  );
}

/* ---------- Fullscreen Cinema Theater Modal ---------- */
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
      className="cinema-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Cinema Theater Playback"
    >
      <div className="cinema-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header HUD */}
        <div className="cinema-modal-header">
          <div className="cinema-title-cluster">
            <span className="cinema-cut-pill">CUT #{padNum}</span>
            <h2 className="cinema-title-text">{project.title}</h2>
            <span className="cinema-meta-tag">{project.category} // {project.aspect}</span>
          </div>

          <button
            type="button"
            className="cinema-close-btn"
            onClick={onClose}
            aria-label="Close Theater"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Video Player Box */}
        <div className={`cinema-video-box aspect-${project.shape}`}>
          <iframe
            src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=0&loop=1&playsinline=1&title=0&byline=0&portrait=0`}
            className="cinema-vimeo-iframe"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            title={project.title}
          />
        </div>

        {/* Footer Navigation */}
        <div className="cinema-modal-footer">
          <div className="cinema-pager-group">
            <button
              type="button"
              className="cinema-nav-btn"
              onClick={() => onNavigate(prevProject)}
              aria-label="Previous Cut"
            >
              <ArrowLeft size={15} />
              <span>PREV CUT</span>
            </button>
            <span className="cinema-counter-text">
              {currentIndex + 1} / {allProjects.length}
            </span>
            <button
              type="button"
              className="cinema-nav-btn"
              onClick={() => onNavigate(nextProject)}
              aria-label="Next Cut"
            >
              <span>NEXT CUT</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <a
            href={`https://vimeo.com/${project.vimeoId}`}
            target="_blank"
            rel="noreferrer"
            className="cinema-vimeo-external"
          >
            <span>Open Vimeo</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ========================================================
   MAIN APPLICATION
   ======================================================== */
export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTheaterProject, setActiveTheaterProject] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lenisRef = useRef(null);

  // Smooth Lenis Momentum Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
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
      lenisRef.current.scrollTo(targetId, { offset: -80, duration: 1.1 });
    } else {
      const el = document.querySelector(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All" || selectedCategory === "All Work") return PROJECTS;
    return PROJECTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Copy email
  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(PROFILE.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  return (
    <div className="minimal-portfolio-root">
      {/* Ambient Lighting Canvas */}
      <div className="minimal-atmosphere-canvas" aria-hidden="true" />

      {/* ========================================================
          FIXED GLASS NAVBAR (Matches Image 1 Header Exactly)
          ======================================================== */}
      <header className="navbar-fixed-pill">
        <div className="navbar-inner-pill">
          {/* Avatar + Brand Logo */}
          <a
            href="#hero"
            className="navbar-brand-link"
            onClick={(e) => scrollToSection(e, "#hero")}
          >
            <div className="nav-avatar-circle">
              <img
                src={PROFILE.avatar || "/avatar.png"}
                alt={PROFILE.name}
                className="nav-avatar-img"
              />
              <span className="live-status-dot" />
            </div>
            <div className="nav-brand-text">
              <span className="brand-name">ranjeetmishra.work</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="navbar-stagger-links hide-mobile" aria-label="Main Navigation">
            <StaggerLink href="#work" onClick={(e) => scrollToSection(e, "#work")}>
              WORK
            </StaggerLink>
            <StaggerLink href="#about" onClick={(e) => scrollToSection(e, "#about")}>
              ABOUT
            </StaggerLink>
            <StaggerLink href="#experience" onClick={(e) => scrollToSection(e, "#experience")}>
              EXPERIENCE
            </StaggerLink>
            <StaggerLink href="#contact" onClick={(e) => scrollToSection(e, "#contact")}>
              CONTACT
            </StaggerLink>
          </nav>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="navbar-hamburger-btn show-mobile"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <CloseIcon size={18} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="navbar-mobile-drawer show-mobile" role="dialog" aria-label="Mobile Navigation">
            <a
              href="#work"
              className="mobile-drawer-link"
              onClick={(e) => scrollToSection(e, "#work")}
            >
              <span className="drawer-idx">01</span>
              <span>WORK</span>
            </a>
            <a
              href="#about"
              className="mobile-drawer-link"
              onClick={(e) => scrollToSection(e, "#about")}
            >
              <span className="drawer-idx">02</span>
              <span>ABOUT</span>
            </a>
            <a
              href="#experience"
              className="mobile-drawer-link"
              onClick={(e) => scrollToSection(e, "#experience")}
            >
              <span className="drawer-idx">03</span>
              <span>EXPERIENCE</span>
            </a>
            <a
              href="#contact"
              className="mobile-drawer-link contact-pill"
              onClick={(e) => scrollToSection(e, "#contact")}
            >
              <span className="drawer-idx">04</span>
              <span>CONTACT</span>
            </a>
          </div>
        )}
      </header>

      {/* ========================================================
          HERO SECTION (Exact 1:1 Match to Uploaded Images 1 & 2)
          ======================================================== */}
      <section id="hero" className="section-hero-stage">
        {/* Ambient Hairline Laser Ray (The diagonal green line from Image 2) */}
        <svg
          className="hero-laser-ray-svg"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="laserGrad" x1="1350" y1="40" x2="1050" y2="900" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#9bb857" stopOpacity="0.7" />
              <stop offset="45%" stopColor="#9bb857" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#9bb857" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <line
            x1="1320"
            y1="0"
            x2="1080"
            y2="900"
            stroke="url(#laserGrad)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>

        {/* ==================== DESKTOP HERO (Matches Image 1 Exactly) ==================== */}
        <div className="tdk-container hero-stage-inner hero-desktop-stage hide-mobile">
          {/* Top Metadata Row: 3 parts */}
          <div className="hero-top-bar">
            <div className="hero-top-left">
              <span className="live-status-dot" />
              <span className="hero-meta-label">MUMBAI, INDIA // <TimezoneClock /></span>
            </div>
            <div className="hero-top-center">
              <span className="hero-meta-badge">POST-PRODUCTION // RHYTHM & SOUND</span>
            </div>
            <div className="hero-top-right">
              <span className="hero-status-chip">
                <span className="chip-dot" />
                <span>COMMISSIONS OPEN Q1/Q2</span>
              </span>
            </div>
          </div>

          {/* Director Tagline Bar */}
          <div className="hero-director-row">
            <div className="hero-badge-tag">
              <span className="hero-tag-text">DIRECTORIAL POST-PRODUCTION & MOTION</span>
            </div>
            <div className="hero-tag-accent">
              <span className="live-status-dot" />
              <span className="meta-accent-text">FRAME ECONOMY // PSYCHOACOUSTIC SOUND</span>
            </div>
          </div>

          <div className="hairline-divider" />

          {/* Monumental Architectural Headline (Exact match to Image 1 & 2) */}
          <div className="hero-monumental-wrap">
            <h1 className="hero-monumental-title">
              ranjeetmishra<br />
              <span className="text-color-olive">.work</span>
            </h1>
          </div>

          {/* Director Hook & 4-Point Star */}
          <div className="hero-lead-row">
            <div className="hero-quote-wrap">
              <StarIcon />
              <p className="hero-intro-quote">
                I craft film rhythm and visual retention that turn heads — <br />
                stronger, sharper, unforgettable.
              </p>
            </div>
          </div>

          <div className="hairline-divider" />

          {/* Hero Proof Deck & Dual Action Links */}
          <div className="hero-proof-deck">
            <div className="hero-stats-trio">
              <div className="hero-stat-card">
                <span className="hero-stat-num">15M+</span>
                <span className="hero-stat-desc">VIEWS GENERATED</span>
              </div>
              <div className="hero-stat-divider" aria-hidden="true" />
              <div className="hero-stat-card">
                <span className="hero-stat-num">150+</span>
                <span className="hero-stat-desc">MASTERED CUTS</span>
              </div>
              <div className="hero-stat-divider" aria-hidden="true" />
              <div className="hero-stat-card">
                <span className="hero-stat-num">48h</span>
                <span className="hero-stat-desc">AVERAGE FIRST CUT</span>
              </div>
            </div>

            <div className="hero-actions-cluster">
              <a
                href="#work"
                className="hero-text-link"
                onClick={(e) => scrollToSection(e, "#work")}
              >
                <span>Explore Work</span>
                <span className="link-arrow">↓</span>
              </a>
              <a
                href="#contact"
                className="hero-text-link"
                onClick={(e) => scrollToSection(e, "#contact")}
              >
                <span>Start a Project</span>
                <span className="link-arrow">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* ==================== MOBILE HERO (Optimized, Zero Overlap, Glowing Buttons) ==================== */}
        <div className="tdk-container hero-mobile-stage show-mobile">
          {/* Top Location & Commissions */}
          <div className="hero-mobile-meta">
            <div className="hero-meta-loc-row">
              <span className="live-status-dot" />
              <span className="hero-meta-loc-text">MUMBAI, INDIA // <TimezoneClock /></span>
            </div>
            <div className="hero-commission-pill">
              <span className="chip-dot" />
              <span>COMMISSIONS OPEN Q1/Q2</span>
            </div>
          </div>

          {/* Category Tag */}
          <div className="hero-category-tag-row">
            <span className="hero-category-tag">DIRECTORIAL POST-PRODUCTION & MOTION</span>
          </div>

          {/* Headline */}
          <div className="hero-title-stack-mobile">
            <h1 className="hero-title-first">ranjeetmishra</h1>
            <div className="hero-title-second text-color-olive">.work</div>
          </div>

          {/* Quote & Star */}
          <div className="hero-quote-block-mobile">
            <StarIcon />
            <p className="hero-quote-text-mobile">
              I craft film rhythm and visual retention that turn heads — stronger, sharper, unforgettable.
            </p>
          </div>

          {/* Glowing Action Buttons (From User Request) */}
          <div className="hero-buttons-mobile">
            <a
              href="#work"
              className="hero-glow-pill-btn"
              onClick={(e) => scrollToSection(e, "#work")}
            >
              <span>Explore Work</span>
              <span className="btn-arrow">↓</span>
            </a>
            <a
              href="#contact"
              className="hero-outline-pill-btn"
              onClick={(e) => scrollToSection(e, "#contact")}
            >
              <span>Start a Project</span>
              <span className="btn-arrow">↗</span>
            </a>
          </div>

          {/* Mobile Stats Trio */}
          <div className="hero-stats-mobile">
            <div className="hero-stat-mobile-item">
              <span className="stat-mobile-num">15M+</span>
              <span className="stat-mobile-lbl">VIEWS</span>
            </div>
            <div className="hero-stat-divider-mobile" />
            <div className="hero-stat-mobile-item">
              <span className="stat-mobile-num">150+</span>
              <span className="stat-mobile-lbl">CUTS</span>
            </div>
            <div className="hero-stat-divider-mobile" />
            <div className="hero-stat-mobile-item">
              <span className="stat-mobile-num">48h</span>
              <span className="stat-mobile-lbl">FIRST CUT</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          VELOCITY MARQUEE STRIP
          ======================================================== */}
      <VelocityMarquee />

      {/* ========================================================
          SECTION 01: SELECTED WORK (The Film Vault)
          ======================================================== */}
      <section id="work" className="section-tdk-work">
        <div className="tdk-container">
          {/* Section Header */}
          <div className="section-head-minimal">
            <div className="section-title-wrap">
              <span className="section-eyebrow">01 // WHAT YOU’RE HERE FOR</span>
              <h2 className="heading-playfair">Selected Work</h2>
            </div>
            <p className="section-subtext">
              High-retention short-form reels, cinematic documentary shorts, and multi-cam podcast cuts.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="category-filter-strip">
            {["All", "Reels & Shorts", "Brand Films"].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-pill-btn ${selectedCategory === cat ? "is-active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{cat}</span>
                <span className="filter-pill-count">
                  {cat === "All"
                    ? PROJECTS.length
                    : PROJECTS.filter((p) => p.category === cat).length}
                </span>
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="projects-editorial-grid">
            {filteredProjects.map((project, idx) => (
              <VideoProjectCard
                key={project.id}
                project={project}
                index={idx}
                onOpenTheater={(p) => setActiveTheaterProject(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 02: THE CRAFT (About & Methodology)
          ======================================================== */}
      <section id="about" className="section-tdk-about">
        <div className="tdk-container">
          <div className="section-head-minimal">
            <div className="section-title-wrap">
              <span className="section-eyebrow">02 // ARCHITECTURE OF CRAFT</span>
              <h2 className="heading-playfair">The Craft</h2>
            </div>
            <p className="section-subtext">
              Video editing is cognitive engineering. Every micro-second either accelerates momentum or loses the room.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="disciplines-quad-grid">
            {DISCIPLINES.map((d) => (
              <div key={d.num} className="discipline-card">
                <div className="discipline-top-hud">
                  <span className="discipline-num">{d.num}</span>
                  <span className="discipline-tagline">{d.tagline}</span>
                </div>
                <h3 className="discipline-title">{d.title}</h3>
                <p className="discipline-desc">{d.desc}</p>
              </div>
            ))}
          </div>

          {/* Software & Suite Strip */}
          <div className="tools-suite-strip">
            <span className="tools-suite-label">POST-PRODUCTION SUITE:</span>
            <div className="tools-chips-list">
              {TOOLS.map((tool) => (
                <span key={tool} className="tool-chip-badge">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 03: EXPERIENCE (Track Record)
          ======================================================== */}
      <section id="experience" className="section-tdk-experience">
        <div className="tdk-container">
          <div className="section-head-minimal">
            <div className="section-title-wrap">
              <span className="section-eyebrow">03 // TRACK RECORD</span>
              <h2 className="heading-playfair">Experience</h2>
            </div>
            <p className="section-subtext">
              Collaborating with international creators, production houses, and high-growth brands.
            </p>
          </div>

          {/* Timeline Table */}
          <div className="timeline-editorial-table">
            {EXPERIENCE.map((item, idx) => (
              <div key={idx} className="timeline-row-item">
                <div className="timeline-period-cell">
                  <span className="period-badge">{item.period}</span>
                </div>
                <div className="timeline-role-cell">
                  <h3 className="timeline-role-title">{item.role}</h3>
                  <span className="timeline-company-name">{item.company}</span>
                </div>
                <div className="timeline-impact-cell">
                  <span className="impact-pill-badge">{item.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 04: CONTACT (The Portal)
          ======================================================== */}
      <section id="contact" className="section-tdk-contact">
        <div className="tdk-container">
          <div className="contact-portal-box">
            <span className="section-eyebrow text-color-olive">04 // COMMISSIONS & INQUIRIES</span>
            <h2 className="heading-contact-monument">
              Let’s make something <br />
              <span className="text-color-olive">unforgettable.</span>
            </h2>

            <p className="contact-lead-sub">
              Open for select video editing commissions, brand films, and long-term retainer partnerships.
            </p>

            {/* Email Copy Pill */}
            <div className="contact-email-capsule">
              <span className="email-display-text">{PROFILE.email}</span>
              <button
                type="button"
                className={`copy-btn-capsule ${copiedEmail ? "is-copied" : ""}`}
                onClick={copyEmailToClipboard}
                title="Copy email to clipboard"
              >
                {copiedEmail ? (
                  <>
                    <CheckIcon size={14} />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon size={14} />
                    <span>COPY EMAIL</span>
                  </>
                )}
              </button>
            </div>

            {/* Social Links Row */}
            <div className="contact-socials-row">
              {PROFILE.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="social-minimal-link"
                >
                  <span>{s.label}</span>
                  <ArrowUpRight size={13} />
                </a>
              ))}
              <a
                href={`mailto:${PROFILE.email}`}
                className="social-minimal-link direct-mail-btn"
              >
                <span>Direct Mail ↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MINIMAL FOOTER
          ======================================================== */}
      <footer className="site-minimal-footer">
        <div className="tdk-container footer-flex-inner">
          <div className="footer-left">
            <span className="footer-brand">ranjeetmishra<span className="text-color-olive">.work</span></span>
            <span className="footer-copyright">© {new Date().getFullYear()} Ranjeet Mishra. All rights reserved.</span>
          </div>

          <div className="footer-right">
            <span className="footer-location">MUMBAI, INDIA // <TimezoneClock /> [IST]</span>
            <a
              href="#hero"
              className="footer-top-link"
              onClick={(e) => scrollToSection(e, "#hero")}
            >
              <span>Back to Top ↑</span>
            </a>
          </div>
        </div>
      </footer>

      {/* ========================================================
          CINEMA THEATER MODAL (When a cut is expanded)
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
