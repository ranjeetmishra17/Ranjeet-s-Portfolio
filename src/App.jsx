import { useState, useEffect, useRef, useMemo } from "react";
import {
  PROFILE,
  EXPERIENCE,
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

/* ---------- Tom de Koning Style Rotating Geometric Star ---------- */
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
      boost = Math.min(diff * 0.35, 22);
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
      <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21 0C21.9 11.3 30.7 20.1 42 21C30.7 21.9 21.9 30.7 21 42C20.1 30.7 11.3 21.9 0 21C11.3 20.1 20.1 11.3 21 0Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

/* ---------- Dual-Layer Stagger Link (Rolling Text on Hover) ---------- */
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

  return <span className="timezone-live-clock">{timeStr || "16:00:00"}</span>;
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
          <span>15M+ VIEWS GENERATED</span>
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
          <span>15M+ VIEWS GENERATED</span>
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

/* ---------- Ultra-Sleek Glass Carousel Card ---------- */
function GlassCarouselCard({ project, index, onOpenTheater }) {
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
    <div className={`glass-carousel-slide shape-${project.shape} ${isPlaying ? "is-playing" : ""}`}>
      <div className="slide-media-stage">
        {isPlaying ? (
          <div className="slide-player-box">
            <iframe
              src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=0&loop=1&playsinline=1&title=0&byline=0&portrait=0`}
              className="slide-vimeo-iframe"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              title={`Video ${project.id}`}
            />
            <div className="slide-player-hud">
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
            className="slide-poster-surface"
            onClick={startPlayback}
            title="Click to play in-card"
          >
            <img
              src={project.image}
              alt={`Thumbnail for cut #${padNum}`}
              className="slide-poster-img"
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
            <div className="slide-top-hud">
              <span className="slide-num-pill">#{padNum}</span>
              <span className="slide-category-pill">{project.category}</span>
            </div>

            {/* Play Trigger */}
            <div className="slide-center-play">
              <div className="play-disc-circle">
                <PlayIcon size={22} />
              </div>
              <span className="play-disc-label">PLAY CUT</span>
            </div>

            {/* Bottom Meta */}
            <div className="slide-bottom-hud">
              <span className="slide-runtime-tag">{project.duration}</span>
              <button
                type="button"
                className="slide-theater-btn"
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

      {/* Editorial Label Beneath Slide */}
      <div className="slide-caption-row">
        <div className="slide-caption-title">
          <h3>Cut #{padNum} // {project.category}</h3>
          <p>{project.aspect} • Organic DaVinci Grade</p>
        </div>
        <button
          type="button"
          className="slide-quick-expand"
          onClick={() => onOpenTheater(project)}
          title="Watch in Theater Modal"
        >
          <span>Theater</span>
          <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
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
        className={`cinema-overlay-box shape-${project.shape}`}
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

        <div className={`theater-screen shape-${project.shape}`}>
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
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const carouselTrackRef = useRef(null);

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

  const scrollPrev = () => {
    if (!carouselTrackRef.current) return;
    const container = carouselTrackRef.current;
    const cardWidth = container.querySelector(".glass-carousel-slide")?.offsetWidth || 400;
    container.scrollBy({ left: -(cardWidth + 32), behavior: "smooth" });
    setActiveSlideIndex((prev) => Math.max(0, prev - 1));
  };

  const scrollNext = () => {
    if (!carouselTrackRef.current) return;
    const container = carouselTrackRef.current;
    const cardWidth = container.querySelector(".glass-carousel-slide")?.offsetWidth || 400;
    container.scrollBy({ left: cardWidth + 32, behavior: "smooth" });
    setActiveSlideIndex((prev) => Math.min(filteredProjects.length - 1, prev + 1));
  };

  // Track active slide on scroll
  useEffect(() => {
    const el = carouselTrackRef.current;
    if (!el) return;

    const onScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.querySelector(".glass-carousel-slide")?.offsetWidth || 400;
      const index = Math.round(scrollLeft / (cardWidth + 32));
      setActiveSlideIndex(Math.min(filteredProjects.length - 1, Math.max(0, index)));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [filteredProjects.length]);

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(PROFILE.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  // Scroll reveal animation observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px",
    };

    const handleIntersect = (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          obs.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const targets = document.querySelectorAll(
      ".reveal-section, .reveal-item, .reveal-divider, .reveal-stagger-group"
    );
    targets.forEach((el) => observer.observe(el));

    // Reveal hero immediately on initial mount
    const hero = document.getElementById("header");
    if (hero) {
      requestAnimationFrame(() => {
        hero.classList.add("is-revealed");
      });
    }

    return () => observer.disconnect();
  }, [selectedCategory, filteredProjects.length]);

  return (
    <div className="minimal-portfolio-root">
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
            <StaggerLink href="#experience" className="nav-stagger-item">
              EXPERIENCE
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
      <section id="header" className="section-tdk-header reveal-section">
        <div className="tdk-container">
          {/* Header Top Micro-Bar */}
          <div className="header-meta-bar reveal-item">
            <span className="meta-brand-text">ranjeetmishra.work</span>
            <span className="meta-portfolio-text">portfolio 2026</span>
          </div>

          {/* Director Intro & Spinning Star */}
          <div className="header-intro-row reveal-item">
            <div className="header-status-indicator">
              <span className="live-status-dot" />
              <span className="status-meta-text">POST-PRODUCTION EDITOR // MUMBAI [IST]</span>
            </div>

            <div className="header-quote-wrap">
              <StarIcon />
              <p className="header-intro-quote">
                I craft film rhythm and visual retention that turn heads — <br className="hide-mobile" />
                stronger, sharper, unforgettable.
              </p>
            </div>
          </div>

          <div className="hairline-divider reveal-divider" />

          {/* Monumental Hero Headline */}
          <div className="header-monumental-wrap reveal-item">
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
      <section id="info" className="section-tdk-info reveal-section">
        <div className="tdk-container">
          <div className="info-2col-grid">
            <div className="info-col-label reveal-item">
              <h6>About</h6>
            </div>

            <div className="info-col-specs reveal-stagger-group">
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
                <span className="spec-value">15M+ Organic Views Generated</span>
                <div className="spec-line" />
              </div>

              {/* Action Buttons */}
              <div className="info-actions-bar reveal-item">
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
      <section id="about" className="section-tdk-manifesto reveal-section">
        <div className="tdk-container">
          <div className="manifesto-wrap reveal-item">
            <h2 className="heading-gradient-wave">
              I cut stories that stop the scroll — frame by frame, sound to color.
            </h2>
          </div>

          <div className="hairline-divider reveal-divider" />

          <div className="manifesto-2col-grid reveal-item">
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
          REDESIGNED WORK SECTION (Interactive Glass Showcase Carousel)
          ======================================================== */}
      <section id="work" className="section-tdk-work reveal-section">
        <div className="tdk-container">
          <div className="work-header-row reveal-item">
            <div className="work-title-wrap">
              <span className="section-micro-tag">WHAT YOU’RE HERE FOR (I GUESS)</span>
              <h2 className="heading-extreme-work">Work</h2>
            </div>

            {/* Carousel Navigation Arrows & Counter */}
            <div className="carousel-nav-controls">
              <button
                type="button"
                className="carousel-arrow-btn"
                onClick={scrollPrev}
                title="Previous Cut"
                aria-label="Previous Cut"
              >
                <ArrowLeft size={16} />
              </button>
              <span className="carousel-counter-badge">
                {String(activeSlideIndex + 1).padStart(2, "0")} / {String(filteredProjects.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                className="carousel-arrow-btn"
                onClick={scrollNext}
                title="Next Cut"
                aria-label="Next Cut"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="work-filter-bar reveal-item" role="tablist" aria-label="Filter works">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`tdk-filter-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveSlideIndex(0);
                  if (carouselTrackRef.current) {
                    carouselTrackRef.current.scrollTo({ left: 0, behavior: "smooth" });
                  }
                }}
                role="tab"
                aria-selected={selectedCategory === cat}
              >
                <span>{cat}</span>
                <span className="filter-badge">{categoryCounts[cat] || 0}</span>
              </button>
            ))}
          </div>

          {/* Liquid Glass Horizontal Showcase Carousel Track */}
          <div className="glass-carousel-container reveal-item" ref={carouselTrackRef}>
            <div className="glass-carousel-track">
              {filteredProjects.map((project, idx) => (
                <GlassCarouselCard
                  key={project.id}
                  project={project}
                  index={idx}
                  onOpenTheater={setActiveTheaterProject}
                />
              ))}
            </div>
          </div>

          {/* Curated Exhibition Film Index Table */}
          <div className="film-index-table-wrap reveal-item">
            <div className="index-table-header">
              <span className="section-micro-tag">CURATED CUTS INDEX</span>
              <span className="index-total-tag">{filteredProjects.length} CUTS IN VAULT</span>
            </div>
            <div className="index-table-body">
              {filteredProjects.map((project, idx) => {
                const padNum = String(idx + 1).padStart(2, "0");
                return (
                  <div
                    key={project.id}
                    className="index-table-row"
                    onClick={() => setActiveTheaterProject(project)}
                  >
                    <span className="col-idx">#{padNum}</span>
                    <span className="col-cat">{project.category}</span>
                    <span className="col-aspect">{project.aspect}</span>
                    <span className="col-dur">{project.duration}</span>
                    <span className="col-cta">
                      <span>Watch Cut</span>
                      <ArrowUpRight size={12} />
                    </span>
                    <div className="row-divider-line" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          WORK EXPERIENCE SECTION (Added as requested)
          ======================================================== */}
      <section id="experience" className="section-tdk-experience reveal-section">
        <div className="tdk-container">
          <div className="experience-header reveal-item">
            <span className="section-micro-tag">BACKGROUND & TRACK RECORD</span>
            <h2 className="heading-experience-title">Work Experience</h2>
          </div>

          <div className="experience-table reveal-stagger-group">
            {EXPERIENCE.map((item, idx) => (
              <div key={idx} className="experience-row">
                <div className="exp-col-period">
                  <span className="exp-period-tag">{item.period}</span>
                  <span className="exp-status-chip">{item.type}</span>
                </div>

                <div className="exp-col-role">
                  <h3 className="exp-role-title">{item.role}</h3>
                  <span className="exp-company-text">{item.company} • {item.location}</span>
                  <p className="exp-desc-text">{item.desc}</p>
                </div>

                <div className="exp-col-metrics">
                  <span className="exp-metric-label">Key Impact</span>
                  <span className="exp-metric-value">{item.impact}</span>
                </div>

                <div className="exp-row-line" />
              </div>
            ))}
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
      <footer id="contact" className="section-tdk-footer reveal-section">
        <div className="tdk-container">
          {/* Top Line */}
          <div className="footer-top-meta reveal-item">
            <h6>ranjeetmishra.work</h6>
            <h6>portfolio 2026</h6>
          </div>

          <div className="hairline-divider reveal-divider" />

          {/* Main Contact Grid */}
          <div className="footer-contact-grid reveal-item">
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

          <div className="hairline-divider reveal-divider" />

          {/* Bottom Monumental Brand Stamp */}
          <div className="footer-bottom-stamp reveal-item">
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
