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
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ArrowLeft = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

/* ---------- Audio Equalizer Visualizer Component ---------- */
function AudioWaveVisualizer({ active = true }) {
  return (
    <div className={`audio-wave-bars ${active ? "is-active" : ""}`} aria-hidden="true">
      <span className="wave-bar bar-1" />
      <span className="wave-bar bar-2" />
      <span className="wave-bar bar-3" />
      <span className="wave-bar bar-4" />
      <span className="wave-bar bar-5" />
      <span className="wave-bar bar-6" />
      <span className="wave-bar bar-7" />
      <span className="wave-bar bar-8" />
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

  return <span className="timezone-live-clock">{timeStr || "17:00:00"}</span>;
}

/* ---------- Velocity Infinite Marquee ---------- */
function VelocityMarquee() {
  return (
    <div className="marquee-advanced" aria-hidden="true">
      <div className="marquee-advanced__track">
        <div className="marquee-advanced__item">
          <span>DIRECTORIAL POST-PRODUCTION</span>
          <span className="marquee-star">✦</span>
          <span>15M+ VIEWS MASTERED</span>
          <span className="marquee-star">✦</span>
          <span>KINETIC MOTION DESIGN</span>
          <span className="marquee-star">✦</span>
          <span>PSYCHOACOUSTIC SOUND DESIGN</span>
          <span className="marquee-star">✦</span>
          <span>DAVINCI 35MM COLOR GRADE</span>
          <span className="marquee-star">✦</span>
          <span>MUMBAI [IST]</span>
          <span className="marquee-star">✦</span>
        </div>
        <div className="marquee-advanced__item">
          <span>DIRECTORIAL POST-PRODUCTION</span>
          <span className="marquee-star">✦</span>
          <span>15M+ VIEWS MASTERED</span>
          <span className="marquee-star">✦</span>
          <span>KINETIC MOTION DESIGN</span>
          <span className="marquee-star">✦</span>
          <span>PSYCHOACOUSTIC SOUND DESIGN</span>
          <span className="marquee-star">✦</span>
          <span>DAVINCI 35MM COLOR GRADE</span>
          <span className="marquee-star">✦</span>
          <span>MUMBAI [IST]</span>
          <span className="marquee-star">✦</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Project Card Component ---------- */
function ProjectCard({ project, index, onOpenTheater }) {
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
    <div className={`project-card-box shape-${project.shape} ${isPlaying ? "is-playing" : ""}`}>
      <div className="card-stage-container">
        {isPlaying ? (
          <div className="card-iframe-wrapper">
            <iframe
              src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=0&loop=1&playsinline=1&title=0&byline=0&portrait=0`}
              className="card-vimeo-embed"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              title={project.title}
            />
            <div className="card-hud-overlay">
              <span className="hud-badge-tag">CUT #{padNum}</span>
              <button
                type="button"
                className="hud-close-action"
                onClick={stopPlayback}
                title="Close video"
                aria-label="Close video"
              >
                <CloseIcon size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div
            className="card-poster-interactive"
            onClick={startPlayback}
            title="Click to play in-card"
          >
            <img
              src={project.image}
              alt={`Poster for ${project.title}`}
              className="card-poster-visual"
              loading="lazy"
            />

            {/* Viewfinder Target Brackets */}
            <div className="card-viewfinder-grid" aria-hidden="true">
              <span className="vf-corner vf-top-left" />
              <span className="vf-corner vf-top-right" />
              <span className="vf-corner vf-bottom-left" />
              <span className="vf-corner vf-bottom-right" />
            </div>

            <div className="card-ambient-scrim" />

            {/* Top Slates */}
            <div className="card-header-slates">
              <span className="card-slate-num">#{padNum}</span>
              <span className="card-slate-cat">{project.category}</span>
            </div>

            {/* Center Play Disc */}
            <div className="card-action-center">
              <div className="play-disc-glyph">
                <PlayIcon size={24} />
              </div>
              <span className="play-disc-caption">PLAY CUT</span>
            </div>

            {/* Bottom Slates */}
            <div className="card-footer-slates">
              <span className="card-tag-pill">{project.aspect}</span>
              <span className="card-tag-pill">{project.duration}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Detail Bar */}
      <div className="card-info-strip">
        <div className="card-meta-text">
          <h3 className="card-work-title">{project.title}</h3>
          <p className="card-work-sub">
            <span>{project.client}</span>
            <span className="sub-separator">•</span>
            <span className="grade-highlight">{project.grade}</span>
          </p>
        </div>

        <button
          type="button"
          className="card-expand-theater-btn"
          onClick={() => onOpenTheater(project)}
          title="Open in Cinema Theater"
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
      className="cinema-theater-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Cinema Theater Player"
    >
      <div className="cinema-theater-frame" onClick={(e) => e.stopPropagation()}>
        {/* Header HUD */}
        <div className="theater-top-hud">
          <div className="theater-info-group">
            <span className="theater-cut-tag">CUT #{padNum}</span>
            <h2 className="theater-cut-title">{project.title}</h2>
            <span className="theater-genre-tag">{project.category} // {project.aspect}</span>
          </div>

          <button
            type="button"
            className="theater-exit-btn"
            onClick={onClose}
            aria-label="Close Theater"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Video Box */}
        <div className={`theater-video-stage shape-${project.shape}`}>
          <iframe
            src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=0&loop=1&playsinline=1&title=0&byline=0&portrait=0`}
            className="theater-vimeo-frame"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            title={project.title}
          />
        </div>

        {/* Footer Navigation */}
        <div className="theater-bottom-hud">
          <div className="theater-controls-group">
            <button
              type="button"
              className="theater-nav-trigger"
              onClick={() => onNavigate(prevProject)}
              aria-label="Previous Cut"
            >
              <ArrowLeft size={15} />
              <span>PREV CUT</span>
            </button>
            <span className="theater-counter-pill">
              {currentIndex + 1} / {allProjects.length}
            </span>
            <button
              type="button"
              className="theater-nav-trigger"
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
            className="theater-external-vimeo"
          >
            <span>Open on Vimeo</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ========================================================
   MAIN CINEMATIC ENGINE APPLICATION
   ======================================================== */
export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTheaterProject, setActiveTheaterProject] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lenisRef = useRef(null);

  // Initialize Smooth Momentum Scrolling
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

  const featuredCut = PROJECTS[0];

  return (
    <div className="engine-root-canvas">
      {/* Cinematic Ambient Atmosphere */}
      <div className="engine-atmosphere-glow" aria-hidden="true" />

      {/* ========================================================
          FLOATING GLASS HUD NAVBAR
          ======================================================== */}
      <header className="engine-navbar-hud">
        <div className="engine-navbar-inner">
          {/* Avatar & Brand identity */}
          <a
            href="#hero"
            className="engine-brand-anchor"
            onClick={(e) => scrollToSection(e, "#hero")}
          >
            <div className="engine-avatar-lens">
              <img
                src={PROFILE.avatar || "/avatar.png"}
                alt={PROFILE.name}
                className="engine-avatar-photo"
              />
              <span className="engine-status-beacon" />
            </div>
            <div className="engine-brand-label">
              <span className="brand-title-main">RANJEET MISHRA</span>
              <span className="brand-title-sub">POST & MOTION</span>
            </div>
          </a>

          {/* Center Availability Capsule */}
          <div className="engine-commissions-badge hide-mobile">
            <span className="rec-live-dot" />
            <span className="commissions-text">REC • LIVE // COMMISSIONS OPEN Q1/Q2</span>
          </div>

          {/* Desktop Links */}
          <nav className="engine-desktop-nav hide-mobile" aria-label="Main Navigation">
            <a href="#work" className="engine-nav-link" onClick={(e) => scrollToSection(e, "#work")}>
              WORK
            </a>
            <a href="#craft" className="engine-nav-link" onClick={(e) => scrollToSection(e, "#craft")}>
              CRAFT
            </a>
            <a href="#experience" className="engine-nav-link" onClick={(e) => scrollToSection(e, "#experience")}>
              EXPERIENCE
            </a>
            <a href="#contact" className="engine-nav-btn-highlight" onClick={(e) => scrollToSection(e, "#contact")}>
              <span>INQUIRE</span>
              <ArrowUpRight size={13} />
            </a>
          </nav>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="engine-hamburger-action show-mobile"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <CloseIcon size={18} />
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="engine-mobile-drawer show-mobile" role="dialog" aria-label="Mobile Navigation">
            <a
              href="#work"
              className="drawer-item-link"
              onClick={(e) => scrollToSection(e, "#work")}
            >
              <span className="drawer-num">01</span>
              <span>WORK</span>
            </a>
            <a
              href="#craft"
              className="drawer-item-link"
              onClick={(e) => scrollToSection(e, "#craft")}
            >
              <span className="drawer-num">02</span>
              <span>CRAFT</span>
            </a>
            <a
              href="#experience"
              className="drawer-item-link"
              onClick={(e) => scrollToSection(e, "#experience")}
            >
              <span className="drawer-num">03</span>
              <span>EXPERIENCE</span>
            </a>
            <a
              href="#contact"
              className="drawer-item-link contact-highlight"
              onClick={(e) => scrollToSection(e, "#contact")}
            >
              <span className="drawer-num">04</span>
              <span>INQUIRE / BOOK</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        )}
      </header>

      {/* ========================================================
          HERO STAGE: THE CINEMATIC ENGINE
          ======================================================== */}
      <section id="hero" className="engine-hero-section">
        <div className="engine-container">
          {/* Top HUD Telemetry */}
          <div className="hero-telemetry-hud">
            <div className="telemetry-item">
              <span className="telemetry-dot" />
              <span>MUMBAI, INDIA [IST] // <TimezoneClock /></span>
            </div>
            <div className="telemetry-item hide-mobile">
              <span className="telemetry-label">DISCIPLINE:</span>
              <span className="telemetry-value">RETENTION EDITING & MOTION</span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-accent">15M+ VIEWS MASTERED</span>
            </div>
          </div>

          {/* Main Hero Split Grid */}
          <div className="hero-dual-stage-grid">
            {/* Left Column: Monumental Identity & Mission */}
            <div className="hero-identity-column">
              <div className="hero-kicker-badge">
                <span className="kicker-glyph">✦</span>
                <span className="kicker-text">POST-PRODUCTION DIRECTOR</span>
              </div>

              <h1 className="hero-monumental-headline">
                RANJEET <br />
                <span className="headline-highlight">MISHRA</span>
              </h1>

              <p className="hero-mission-statement">
                I engineer film rhythm, surgical retention pacing, and psychoacoustic sound architectures that stop the scroll — stronger, sharper, unforgettable.
              </p>

              {/* Action Buttons Cluster */}
              <div className="hero-actions-cluster">
                <a
                  href="#work"
                  className="btn-primary-glow"
                  onClick={(e) => scrollToSection(e, "#work")}
                >
                  <PlayIcon size={16} />
                  <span>EXPLORE WORK</span>
                </a>
                <a
                  href="#contact"
                  className="btn-secondary-outline"
                  onClick={(e) => scrollToSection(e, "#contact")}
                >
                  <span>START A PROJECT</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>

              {/* Live Audio Spectrum Visualizer */}
              <div className="hero-audio-spec-bar">
                <div className="spec-info">
                  <span className="spec-dot" />
                  <span className="spec-title">PSYCHOACOUSTIC SOUND ENGINE</span>
                </div>
                <AudioWaveVisualizer active={true} />
              </div>
            </div>

            {/* Right Column: Hero Featured Cut Spotlight Card */}
            <div className="hero-spotlight-column">
              <div className="spotlight-card-frame">
                <div className="spotlight-header-meta">
                  <div className="spotlight-badge-group">
                    <span className="badge-live-tag">FEATURED CUT</span>
                    <span className="badge-tech-tag">4K 60FPS</span>
                  </div>
                  <span className="spotlight-aspect-tag">{featuredCut.aspect}</span>
                </div>

                {/* Spotlight Interactive Surface */}
                <div
                  className="spotlight-media-surface"
                  onClick={() => setActiveTheaterProject(featuredCut)}
                  title="Click to play in Cinema Theater"
                >
                  <img
                    src={featuredCut.image}
                    alt={featuredCut.title}
                    className="spotlight-poster-img"
                    loading="eager"
                    decoding="async"
                  />

                  {/* Corner Viewfinder Brackets */}
                  <div className="viewfinder-lens-brackets" aria-hidden="true">
                    <span className="vf-cross tl" />
                    <span className="vf-cross tr" />
                    <span className="vf-cross bl" />
                    <span className="vf-cross br" />
                  </div>

                  <div className="spotlight-media-scrim" />

                  {/* Center Play Beacon */}
                  <div className="spotlight-play-beacon">
                    <div className="beacon-disc">
                      <PlayIcon size={28} />
                    </div>
                    <span className="beacon-text">LAUNCH THEATER</span>
                  </div>

                  {/* Bottom Slate */}
                  <div className="spotlight-bottom-slate">
                    <div className="slate-titles">
                      <h4 className="slate-work-name">{featuredCut.title}</h4>
                      <p className="slate-sub">{featuredCut.client} • {featuredCut.grade}</p>
                    </div>
                    <span className="slate-duration">{featuredCut.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics Quad Strip */}
          <div className="hero-metrics-quad-strip">
            {PROFILE.stats.map((st, i) => (
              <div key={i} className="metric-cell-card">
                <span className="metric-number">{st.value}</span>
                <span className="metric-label">{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          VELOCITY INFINITE MARQUEE
          ======================================================== */}
      <VelocityMarquee />

      {/* ========================================================
          SECTION 01: THE CINEMA VAULT (Selected Work)
          ======================================================== */}
      <section id="work" className="engine-section-block">
        <div className="engine-container">
          {/* Section Header */}
          <div className="section-director-head">
            <div className="head-title-stack">
              <span className="head-micro-kicker">01 // THE CINEMA VAULT</span>
              <h2 className="head-monumental-title">Selected Works</h2>
            </div>
            <p className="head-paragraph-desc">
              High-retention vertical reels, cinematic commercial spots, and multi-cam founder podcast series masterfully edited for engagement.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="cinema-category-strip">
            {["All", "Reels & Shorts", "Brand Films"].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill-trigger ${selectedCategory === cat ? "is-selected" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{cat}</span>
                <span className="category-pill-counter">
                  {cat === "All"
                    ? PROJECTS.length
                    : PROJECTS.filter((p) => p.category === cat).length}
                </span>
              </button>
            ))}
          </div>

          {/* Project Gallery Grid */}
          <div className="cinema-works-masonry">
            {filteredProjects.map((project, idx) => (
              <ProjectCard
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
          SECTION 02: THE CRAFT (Methodology)
          ======================================================== */}
      <section id="craft" className="engine-section-block">
        <div className="engine-container">
          <div className="section-director-head">
            <div className="head-title-stack">
              <span className="head-micro-kicker">02 // ARCHITECTURE OF RETENTION</span>
              <h2 className="head-monumental-title">The Craft</h2>
            </div>
            <p className="head-paragraph-desc">
              Modern video editing is behavioral psychology. Every cut, riser, and sound layer is calculated to eliminate drop-off.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="craft-quad-grid">
            {DISCIPLINES.map((d) => (
              <div key={d.num} className="craft-pillar-card">
                <div className="pillar-header-slate">
                  <span className="pillar-number">{d.num}</span>
                  <span className="pillar-tagline">{d.tagline}</span>
                </div>
                <h3 className="pillar-headline">{d.title}</h3>
                <p className="pillar-description">{d.desc}</p>
                <div className="pillar-decor-line" />
              </div>
            ))}
          </div>

          {/* Suite & Tools Strip */}
          <div className="post-suite-bar">
            <div className="suite-bar-label">
              <span className="suite-glow-dot" />
              <span>POST-PRODUCTION SUITE:</span>
            </div>
            <div className="suite-tools-chips">
              {TOOLS.map((t) => (
                <span key={t} className="suite-chip">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 03: EXPERIENCE (Track Record)
          ======================================================== */}
      <section id="experience" className="engine-section-block">
        <div className="engine-container">
          <div className="section-director-head">
            <div className="head-title-stack">
              <span className="head-micro-kicker">03 // PROVEN TRACK RECORD</span>
              <h2 className="head-monumental-title">Experience</h2>
            </div>
            <p className="head-paragraph-desc">
              Delivering high-velocity post-production for high-growth creators, funded startups, and creative production studios.
            </p>
          </div>

          {/* Editorial Timeline Table */}
          <div className="editorial-timeline-board">
            {EXPERIENCE.map((exp, idx) => (
              <div key={idx} className="timeline-entry-row">
                <div className="timeline-period-col">
                  <span className="period-chip">{exp.period}</span>
                  <span className="studio-type-badge">{exp.type}</span>
                </div>

                <div className="timeline-role-col">
                  <h3 className="role-main-title">{exp.role}</h3>
                  <span className="company-main-name">{exp.company} // {exp.location}</span>
                  <p className="role-summary-note">{exp.highlight}</p>
                </div>

                <div className="timeline-impact-col">
                  <span className="impact-glow-badge">{exp.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 04: THE PORTAL (Contact / Inquiries)
          ======================================================== */}
      <section id="contact" className="engine-section-block contact-block">
        <div className="engine-container">
          <div className="contact-portal-card">
            <div className="portal-kicker-tag">
              <span className="portal-status-dot" />
              <span>04 // COMMISSIONS & RETAINERS</span>
            </div>

            <h2 className="portal-giant-title">
              READY TO COMMAND <br />
              <span className="title-accent-lime">ATTENTION?</span>
            </h2>

            <p className="portal-subtext">
              Accepting select commercial commissions, viral vertical series, and long-term YouTube / podcast post-production retainers.
            </p>

            {/* Email Copy Capsule */}
            <div className="portal-email-capsule">
              <span className="capsule-email-text">{PROFILE.email}</span>
              <button
                type="button"
                className={`capsule-copy-action ${copiedEmail ? "is-copied" : ""}`}
                onClick={copyEmailToClipboard}
                title="Copy email to clipboard"
              >
                {copiedEmail ? (
                  <>
                    <CheckIcon size={14} />
                    <span>COPIED TO CLIPBOARD!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon size={14} />
                    <span>COPY EMAIL</span>
                  </>
                )}
              </button>
            </div>

            {/* Action Channels */}
            <div className="portal-socials-row">
              {PROFILE.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="social-portal-link"
                >
                  <span>{s.label}</span>
                  <ArrowUpRight size={13} />
                </a>
              ))}
              <a
                href={`mailto:${PROFILE.email}`}
                className="social-portal-link email-direct"
              >
                <span>Direct Mail ↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          ENGINE FOOTER
          ======================================================== */}
      <footer className="engine-footer">
        <div className="engine-container footer-inner-grid">
          <div className="footer-left-identity">
            <span className="footer-title">RANJEET MISHRA</span>
            <span className="footer-tag">POST-PRODUCTION DIRECTOR & MOTION DESIGNER</span>
            <span className="footer-copy">© {new Date().getFullYear()} Ranjeet Mishra. All rights reserved.</span>
          </div>

          <div className="footer-right-telemetry">
            <span className="footer-clock">MUMBAI, INDIA // <TimezoneClock /> [IST]</span>
            <a
              href="#hero"
              className="footer-back-top"
              onClick={(e) => scrollToSection(e, "#hero")}
            >
              <span>BACK TO TOP ↑</span>
            </a>
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
