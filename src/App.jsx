import { useState, useEffect, useRef, useMemo } from "react";
import {
  PROFILE,
  SERVICES,
  TOOLS,
  CATEGORIES,
  PROJECTS,
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

/* ---------- Tom de Koning Style Rotating Star (Velocity Accelerated) ---------- */
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
      rot = (rot + 0.65 + boost) % 360;
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
      <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21 0C21.9 11.3 30.7 20.1 42 21C30.7 21.9 21.9 30.7 21 42C20.1 30.7 11.3 21.9 0 21C11.3 20.1 20.1 11.3 21 0Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

/* ---------- Tom de Koning Style Stagger Link (Dual-Layer Roll) ---------- */
function StaggerLink({ href, children, className = "", onClick, target, rel }) {
  return (
    <a
      href={href}
      className={`stagger-link ${className}`}
      onClick={onClick}
      target={target}
      rel={rel}
    >
      <span className="stagger-link__inner">
        <span className="stagger-link__layer is-default">{children}</span>
        <span className="stagger-link__layer is-hover" aria-hidden="true">{children}</span>
      </span>
    </a>
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

  return <span className="timezone-live-clock">{timeStr || "15:45:00"}</span>;
}

/* ---------- Interactive Trailing Custom Cursor ---------- */
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let isHovered = false;
    let isClicking = false;
    let rafId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onMouseDown = () => { isClicking = true; };
    const onMouseUp = () => { isClicking = false; };

    const checkHover = (e) => {
      const target = e.target;
      const interactive = target.closest("a, button, [role='button'], .minimal-video-card, .portal-poster-surface, .tdk-featured-monitor");
      isHovered = !!interactive;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", checkHover);

    const animate = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringRef.current) {
        const scale = isClicking ? 0.75 : isHovered ? 1.85 : 1;
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${scale})`;
        ringRef.current.style.borderColor = isHovered ? "var(--olive-champagne)" : "var(--olive-primary)";
        ringRef.current.style.background = isHovered ? "var(--olive-halo-strong)" : "transparent";
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", checkHover);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="cursor-wrap" aria-hidden="true">
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </div>
  );
}

/* ---------- Velocity Infinite Marquee ---------- */
function VelocityMarquee() {
  return (
    <div className="marquee-advanced" aria-hidden="true">
      <div className="marquee-advanced__track">
        <div className="marquee-advanced__item">
          <span>RANJEETMISHRA<span className="text-color-olive">.WORK</span></span>
          <span className="marquee-star">★</span>
          <span>FILM & VIDEO POST-PRODUCTION</span>
          <span className="marquee-star">★</span>
          <span>10M+ VIEWS GENERATED</span>
          <span className="marquee-star">★</span>
          <span>MUMBAI [IST]</span>
          <span className="marquee-star">★</span>
          <span>DAVINCI RESOLVE COLOR</span>
          <span className="marquee-star">★</span>
          <span>COMMISSIONS OPEN</span>
          <span className="marquee-star">★</span>
        </div>
        <div className="marquee-advanced__item">
          <span>RANJEETMISHRA<span className="text-color-olive">.WORK</span></span>
          <span className="marquee-star">★</span>
          <span>FILM & VIDEO POST-PRODUCTION</span>
          <span className="marquee-star">★</span>
          <span>10M+ VIEWS GENERATED</span>
          <span className="marquee-star">★</span>
          <span>MUMBAI [IST]</span>
          <span className="marquee-star">★</span>
          <span>DAVINCI RESOLVE COLOR</span>
          <span className="marquee-star">★</span>
          <span>COMMISSIONS OPEN</span>
          <span className="marquee-star">★</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Video Project Card ---------- */
function VideoCard({ project, index, onOpenTheater }) {
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
    <article
      className={`minimal-video-card ${project.shape} ${isPlaying ? "is-playing" : ""}`}
      tabIndex={0}
      aria-label={`Project cut #${padNum} - ${project.category}`}
    >
      <div className="card-aspect-viewport">
        {isPlaying ? (
          <div className="card-inline-player">
            <iframe
              src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=0&loop=1&playsinline=1&title=0&byline=0&portrait=0`}
              className="card-vimeo-iframe"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              title={`Video ${project.id}`}
            />
            <div className="player-close-bar">
              <span className="player-cut-tag">CUT #{padNum}</span>
              <button
                type="button"
                className="player-close-pill"
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
            className="card-poster-surface"
            onClick={startPlayback}
            title="Click to play in-card"
          >
            <img
              src={project.image}
              alt={`Thumbnail for cut #${padNum}`}
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
            <div className="card-header-slate">
              <span className="card-num-badge">#{padNum}</span>
              <span className="card-category-pill">{project.category}</span>
            </div>

            {/* Play Trigger */}
            <div className="card-center-play">
              <div className="play-disc-circle">
                <PlayIcon size={22} />
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="card-footer-slate">
              <span className="card-runtime-tag">{project.duration}</span>
              <button
                type="button"
                className="card-expand-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTheater(project);
                }}
                title="Fullscreen Theater"
                aria-label="Fullscreen Theater"
              >
                <ExpandIcon size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
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
  }, [currentIndex, allProjects, onClose, onNavigate, prevProject, nextProject]);

  return (
    <div
      className="cinema-overlay-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen Cinema Theater"
    >
      <div
        className={`cinema-overlay-box ${project.shape}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="theater-top-bar">
          <div className="theater-meta-tags">
            <span className="theater-slate-tag take">TAKE #{project.id.slice(-4)}</span>
            <span className="theater-slate-tag">•</span>
            <span className="theater-slate-tag">{project.category}</span>
            <span className="theater-slate-tag">•</span>
            <span className="theater-slate-tag">{project.aspect}</span>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="theater-close-btn"
            onClick={onClose}
            aria-label="Close Cinema"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <div className={`theater-screen ${project.shape}`}>
          <iframe
            src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=0&loop=1&playsinline=1&title=0&byline=0&portrait=0`}
            className="theater-iframe"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            title="Fullscreen project playback"
          />
        </div>

        <div className="theater-bottom-bar">
          <div className="theater-pager">
            <button
              type="button"
              className="theater-pager-btn"
              onClick={() => onNavigate(prevProject)}
            >
              PREV CUT
            </button>
            <span className="theater-counter">
              {currentIndex + 1} / {allProjects.length}
            </span>
            <button
              type="button"
              className="theater-pager-btn"
              onClick={() => onNavigate(nextProject)}
            >
              NEXT CUT
            </button>
          </div>

          <a
            href={`https://vimeo.com/${project.vimeoId}`}
            target="_blank"
            rel="noreferrer"
            className="theater-vimeo-link"
          >
            <span>Open on Vimeo</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ========================================================
   MAIN PORTFOLIO APPLICATION
   ======================================================== */
export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("All Work");
  const [activeTheaterProject, setActiveTheaterProject] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isHeroPlaying, setIsHeroPlaying] = useState(false);
  const [heroCategoryKey, setHeroCategoryKey] = useState("Reels");

  // Showreel representative project
  const heroProject = useMemo(() => {
    const found = PROJECTS.find((p) => p.category === heroCategoryKey);
    return found || PROJECTS[0];
  }, [heroCategoryKey]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { "All Work": PROJECTS.length };
    PROJECTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered list
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All Work") return PROJECTS;
    return PROJECTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(PROFILE.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  return (
    <div className="minimal-portfolio-root">
      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* Ambient Canvas Lighting */}
      <div className="minimal-atmosphere-canvas" aria-hidden="true" />

      {/* FLOATING GLASS PILL NAVBAR (Tom de Koning Style) */}
      <header className="navbar-fixed-pill">
        <div className="navbar-inner-pill">
          {/* Brand & Avatar */}
          <a href="#header" className="navbar-brand-link">
            <div className="nav-avatar-circle">
              <img
                src={PROFILE.avatar || "/avatar.png"}
                alt={PROFILE.name}
                className="nav-avatar-img"
              />
              <span className="live-status-dot" />
            </div>
            <div className="nav-brand-text">
              <span className="brand-name">ranjeetmishra<span className="text-color-olive">.work</span></span>
            </div>
          </a>

          {/* Stagger Nav Links */}
          <nav className="navbar-stagger-links" aria-label="Main Navigation">
            <StaggerLink href="#info" className="nav-stagger-item">
              INFO
            </StaggerLink>
            <StaggerLink href="#about" className="nav-stagger-item">
              ABOUT
            </StaggerLink>
            <StaggerLink href="#work" className="nav-stagger-item">
              WORK
            </StaggerLink>
            <StaggerLink href="#contact" className="nav-stagger-item">
              CONTACT
            </StaggerLink>
          </nav>
        </div>
      </header>

      {/* ========================================================
          HERO SECTION (Tom de Koning Layout & Kinetic Typography)
          ======================================================== */}
      <section id="header" className="section-tdk-header">
        <div className="tdk-container">
          {/* Header Top Micro-Bar */}
          <div className="header-meta-bar">
            <span className="meta-brand-text">ranjeetmishra.work</span>
            <span className="meta-portfolio-text">portfolio 2026</span>
          </div>

          {/* Director Intro & Spinning Star */}
          <div className="header-intro-row">
            <div className="director-micro-pill">
              <div className="director-avatar-circle">
                <img
                  src={PROFILE.avatar || "/avatar.png"}
                  alt={PROFILE.name}
                  className="director-img"
                />
                <span className="live-status-dot" />
              </div>
              <div className="director-info-col">
                <span className="director-name">{PROFILE.name}</span>
                <span className="director-role">Post-Production Editor // Mumbai</span>
              </div>
            </div>

            <div className="header-quote-wrap">
              <StarIcon />
              <p className="header-intro-quote">
                I craft film rhythm and visual retention that turn heads — <br className="hide-mobile" />
                stronger, sharper, unforgettable.
              </p>
            </div>
          </div>

          <div className="hairline-divider" />

          {/* Monumental Hero Headline */}
          <div className="header-monumental-wrap">
            <h1 className="hero-monumental-title">
              ranjeetmishra<br />
              <span className="text-color-olive">.work</span>
            </h1>
          </div>
        </div>
      </section>

      {/* ========================================================
          INFO & SPECS SECTION (Directorial Spec Rows)
          ======================================================== */}
      <section id="info" className="section-tdk-info">
        <div className="tdk-container">
          <div className="info-2col-grid">
            <div className="info-col-label">
              <h6>About</h6>
            </div>

            <div className="info-col-specs">
              <div className="spec-row">
                <span className="spec-label">Services</span>
                <span className="spec-value text-right">
                  Film & Reel Editing, Commercials, Podcasts, DaVinci Grading & Sound
                </span>
                <div className="spec-line" />
              </div>

              <div className="spec-row">
                <span className="spec-label">Experience</span>
                <span className="spec-value">4+ Years // 150+ Mastered Cuts</span>
                <div className="spec-line" />
              </div>

              <div className="spec-row">
                <span className="spec-label">Timezone</span>
                <span className="spec-value">
                  MUMBAI [IST] // <TimezoneClock />
                </span>
                <div className="spec-line" />
              </div>

              <div className="spec-row">
                <span className="spec-label">Availability</span>
                <span className="spec-value text-olive-champagne">
                  ● Taking on select projects for Q1/Q2
                </span>
                <div className="spec-line" />
              </div>

              <div className="spec-row">
                <span className="spec-label">Audience Reach</span>
                <span className="spec-value">10M+ Organic Views Generated</span>
                <div className="spec-line" />
              </div>

              {/* Action Buttons */}
              <div className="info-actions-bar">
                <a href="#work" className="tdk-magnetic-btn">
                  <span className="btn-inner">
                    <span className="btn-text">View work</span>
                    <ArrowRight size={14} />
                  </span>
                </a>
                <a href="#contact" className="tdk-secondary-btn">
                  <span>Start a Project</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          GRADIENT WAVE MANIFESTO SECTION (Tom de Koning Inspired)
          ======================================================== */}
      <section id="about" className="section-tdk-manifesto">
        <div className="tdk-container">
          <div className="manifesto-wrap">
            <h2 className="heading-gradient-wave">
              I cut stories that stop the scroll — frame by frame, sound to color.
            </h2>
          </div>

          <div className="hairline-divider" />

          <div className="manifesto-2col-grid">
            <div className="manifesto-col-label">
              <h6>Because</h6>
            </div>
            <div className="manifesto-col-body">
              <p className="manifesto-lead">
                I’m an independent post-production editor and motion designer based in Mumbai, India. I combine rhythmic frame economy, psychoacoustic sound architecture, and organic DaVinci color grading to build films that captivate and convert.
              </p>
              <p className="manifesto-sub">
                From high-retention short-form Reels and founder documentaries to multi-cam podcast workflows, I engineer every cut for retention. One creative vision. Relentless pacing. Stories that linger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          WORK SHOWCASE (What you’re here for)
          ======================================================== */}
      <section id="work" className="section-tdk-work">
        <div className="tdk-container">
          <div className="work-header-block">
            <span className="section-micro-tag">What you’re here for (I guess)</span>
            <h2 className="heading-extreme-work">Work</h2>
          </div>

          {/* Category Tabs */}
          <div className="work-filter-bar" role="tablist" aria-label="Filter works">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`tdk-filter-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
                role="tab"
                aria-selected={selectedCategory === cat}
              >
                <span>{cat}</span>
                <span className="filter-badge">{categoryCounts[cat] || 0}</span>
              </button>
            ))}
          </div>

          {/* Interactive Featured Monitor Portal */}
          <div className="tdk-featured-monitor">
            <div className="portal-top-bar">
              <div className="portal-left-meta">
                <span className="portal-live-dot" />
                <span className="portal-slate-label">FEATURED CUT // {heroProject.category.toUpperCase()}</span>
              </div>
              <div className="portal-right-meta">
                <span className="portal-category-tag">{heroProject.duration}</span>
                <button
                  type="button"
                  className="portal-expand-icon"
                  onClick={() => setActiveTheaterProject(heroProject)}
                  title="Expand to Fullscreen Cinema"
                  aria-label="Expand to Fullscreen Cinema"
                >
                  <ExpandIcon size={13} />
                </button>
              </div>
            </div>

            <div className={`portal-screen-viewport ${heroProject.shape}`}>
              {isHeroPlaying ? (
                <div className="portal-inline-player">
                  <iframe
                    src={`https://player.vimeo.com/video/${heroProject.vimeoId}?autoplay=1&muted=0&loop=1&playsinline=1&title=0&byline=0&portrait=0`}
                    className="portal-vimeo-iframe"
                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Hero preview player"
                  />
                  <button
                    type="button"
                    className="portal-close-trigger"
                    onClick={() => setIsHeroPlaying(false)}
                    title="Close preview"
                  >
                    <CloseIcon size={14} />
                    <span>STOP</span>
                  </button>
                </div>
              ) : (
                <div
                  className="portal-poster-surface"
                  onClick={() => setIsHeroPlaying(true)}
                  title="Click to play in preview monitor"
                >
                  <img
                    src={heroProject.image}
                    alt="Showreel preview still"
                    className="portal-poster-img"
                  />
                  <div className="viewfinder-brackets" aria-hidden="true">
                    <span className="vf-bracket vf-tl" />
                    <span className="vf-bracket vf-tr" />
                    <span className="vf-bracket vf-bl" />
                    <span className="vf-bracket vf-br" />
                  </div>
                  <div className="card-vignette-overlay" />
                  <div className="portal-center-play">
                    <div className="play-disc-circle">
                      <PlayIcon size={24} />
                    </div>
                    <span className="portal-play-label">WATCH PREVIEW</span>
                  </div>
                  <div className="portal-bottom-tag">
                    <span>{heroProject.category}</span>
                    <span className="tag-sep">•</span>
                    <span>{heroProject.duration}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Switch Chips */}
            <div className="portal-switch-bar">
              <span className="switch-hint">QUICK FORMATS:</span>
              <div className="switch-chips">
                <button
                  type="button"
                  className={`switch-chip-btn ${heroCategoryKey === "Reels" ? "active" : ""}`}
                  onClick={() => {
                    setHeroCategoryKey("Reels");
                    setIsHeroPlaying(false);
                  }}
                >
                  #01 REELS
                </button>
                <button
                  type="button"
                  className={`switch-chip-btn ${heroCategoryKey === "Brand Films" ? "active" : ""}`}
                  onClick={() => {
                    setHeroCategoryKey("Brand Films");
                    setIsHeroPlaying(false);
                  }}
                >
                  #02 BRAND FILMS
                </button>
                <button
                  type="button"
                  className={`switch-chip-btn ${heroCategoryKey === "Podcasts" ? "active" : ""}`}
                  onClick={() => {
                    setHeroCategoryKey("Podcasts");
                    setIsHeroPlaying(false);
                  }}
                >
                  #04 PODCASTS
                </button>
              </div>
            </div>
          </div>

          {/* Projects Cards Grid */}
          <div className={`tdk-projects-grid layout-${selectedCategory.toLowerCase().replace(/[^a-z]/g, "")}`}>
            {filteredProjects.map((project, idx) => (
              <VideoCard
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
          DISCIPLINES & FINISHING SUITE
          ======================================================== */}
      <section className="section-tdk-disciplines">
        <div className="tdk-container">
          <div className="disciplines-header">
            <span className="section-micro-tag">THE CRAFT</span>
            <h2 className="heading-section-title">Post-Production Disciplines</h2>
          </div>

          <div className="disciplines-grid">
            {SERVICES.map((srv) => (
              <div key={srv.num} className="discipline-tdk-card">
                <span className="discipline-tag">SCENE /{srv.num}</span>
                <h3 className="discipline-title">{srv.title}</h3>
                <p className="discipline-desc">{srv.desc}</p>
                <div className="discipline-glow" />
              </div>
            ))}
          </div>

          {/* Finishing Suite Box */}
          <div className="finishing-suite-box">
            <div className="suite-left">
              <span className="section-micro-tag">FINISHING SUITE</span>
              <h3 className="suite-title">Precision Tools & 24–48h Turnaround</h3>
              <p className="suite-desc">
                Every project receives lossless 4K ProRes master deliveries, natural skin-tone color grading in DaVinci Resolve, and multi-track spatial sound design.
              </p>
            </div>
            <div className="suite-tags-grid">
              {TOOLS.map((tool) => (
                <span key={tool} className="suite-tag-badge">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          VELOCITY INFINITE MARQUEE (Tom de Koning Style)
          ======================================================== */}
      <VelocityMarquee />

      {/* ========================================================
          FOOTER & CONTACT SECTION (Tom de Koning Footer Architecture)
          ======================================================== */}
      <footer id="contact" className="section-tdk-footer">
        <div className="tdk-container">
          {/* Top Line */}
          <div className="footer-top-meta">
            <h6>ranjeetmishra.work</h6>
            <h6>portfolio 2026</h6>
          </div>

          <div className="hairline-divider" />

          {/* Main Contact Grid */}
          <div className="footer-contact-grid">
            <div className="footer-contact-col">
              <div className="contact-field-group">
                <span className="field-label">Direct Mail</span>
                <div className="mail-copy-row">
                  <StaggerLink
                    href={`mailto:${PROFILE.email}?subject=Editing%20Project%20Inquiry%20%E2%80%94%20Ranjeet%20Mishra`}
                    className="contact-stagger-text"
                  >
                    {PROFILE.email}
                  </StaggerLink>
                  <button
                    type="button"
                    className="copy-icon-btn"
                    onClick={copyEmailToClipboard}
                    title="Copy email address"
                  >
                    {copiedEmail ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
                    <span>{copiedEmail ? "COPIED" : "COPY"}</span>
                  </button>
                </div>
              </div>

              <div className="contact-field-group">
                <span className="field-label">Location & Local Time</span>
                <p className="contact-location-text">
                  Mumbai, India [IST] • <TimezoneClock />
                </p>
              </div>
            </div>

            <div className="footer-social-col">
              <div className="contact-field-group align-right">
                <span className="field-label">LinkedIn</span>
                <StaggerLink
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-stagger-text text-right"
                >
                  @ranjeet-mishra
                </StaggerLink>
              </div>

              <div className="contact-field-group align-right">
                <span className="field-label">Instagram</span>
                <StaggerLink
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-stagger-text text-right"
                >
                  @ranjeetmishra.work
                </StaggerLink>
              </div>

              <div className="contact-field-group align-right">
                <span className="field-label">YouTube</span>
                <StaggerLink
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-stagger-text text-right"
                >
                  @ranjeetmishra-editor
                </StaggerLink>
              </div>
            </div>
          </div>

          <div className="hairline-divider" />

          {/* Bottom Monumental Brand Stamp */}
          <div className="footer-bottom-stamp">
            <h3 className="footer-huge-name">
              ranjeetmishra<span className="text-color-olive">.work</span>
            </h3>
          </div>
        </div>
      </footer>

      {/* Fullscreen Theater Modal */}
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
