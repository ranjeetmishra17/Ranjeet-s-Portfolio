import { useState, useEffect, useRef, useMemo } from "react";
import {
  PROFILE,
  SERVICES,
  TOOLS,
  CATEGORIES,
  PROJECTS,
} from "./data.js";

/* ---------- Elegant Minimalist Icons ---------- */
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

const ExpandIcon = ({ size = 16 }) => (
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

const FilmIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="2" y1="7" x2="7" y2="7" />
    <line x1="2" y1="17" x2="7" y2="17" />
    <line x1="17" y1="17" x2="22" y2="17" />
    <line x1="17" y1="7" x2="22" y2="7" />
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

/* ---------- Real-Time 24fps SMPTE Timecode Hook ---------- */
function useSMPTETimecode() {
  const [tc, setTc] = useState("00:00:00:00");
  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      const ff = String(frame % 24).padStart(2, "0");
      setTc(`${hh}:${mm}:${ss}:${ff}`);
    }, 1000 / 24);
    return () => clearInterval(interval);
  }, []);
  return tc;
}

/* ---------- Monospaced Animated Stat Counter ---------- */
function CountUpStat({ target, decimals = 0, suffix = "" }) {
  const [val, setVal] = useState("0" + suffix);
  const ref = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const startCounter = () => {
      if (hasRun.current) return;
      hasRun.current = true;

      const duration = 1400;
      const startTime = performance.now();

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = target * ease;

        setVal(current.toFixed(decimals) + suffix);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setVal(target.toFixed(decimals) + suffix);
        }
      };

      requestAnimationFrame(step);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startCounter();
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    obs.observe(el);
    const fallback = setTimeout(startCounter, 300);

    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
  }, [target, decimals, suffix]);

  return (
    <span ref={ref} className="stat-mono-val">
      {val}
    </span>
  );
}

/* ---------- Curated Editorial Video Card ---------- */
function VideoCard({ project, index, onOpenTheater }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startPlayback = (e) => {
    e.stopPropagation();
    setIsPlaying(true);
    setIsLoading(true);
  };

  const stopPlayback = (e) => {
    e.stopPropagation();
    setIsPlaying(false);
    setIsLoading(false);
  };

  const padNum = String(index + 1).padStart(2, "0");

  return (
    <article
      className={`video-frame-card ${project.shape} ${isPlaying ? "playing" : ""}`}
      style={{ animationDelay: `${index * 65}ms` }}
      tabIndex={0}
      aria-label={`${project.category} reel, duration ${project.duration}`}
    >
      <div className="card-stage-ratio">
        {isPlaying ? (
          <div className="player-viewport">
            {isLoading && (
              <div className="player-shimmer-loader" aria-hidden="true">
                <span className="loader-pulse-dot" />
                <span className="loader-mono-label">BUFFERING STREAM</span>
              </div>
            )}
            <iframe
              src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=0&playsinline=1&title=0&byline=0&portrait=0&badge=0&autopause=1&dnt=1`}
              className="vimeo-embed-iframe"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              title={`Video ${project.id}`}
              onLoad={() => setIsLoading(false)}
            />
            {/* Live Overlay Header Bar */}
            <div className="player-overlay-bar">
              <div className="overlay-left-meta">
                <span className="rec-dot" />
                <span className="meta-mono-tag">PLAYING • {project.category}</span>
              </div>
              <div className="overlay-right-actions">
                <button
                  type="button"
                  className="icon-action-btn"
                  onClick={() => onOpenTheater(project)}
                  title="Expand to Full Cinema"
                  aria-label="Expand to full cinema"
                >
                  <ExpandIcon size={14} />
                </button>
                <button
                  type="button"
                  className="icon-action-btn close-action"
                  onClick={stopPlayback}
                  title="Close Video"
                  aria-label="Close video player"
                >
                  <CloseIcon size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="poster-viewport" onClick={startPlayback}>
            <img
              src={project.image}
              alt={`${project.category} preview frame`}
              className="poster-media-img"
              loading="lazy"
            />
            <div className="poster-cinematic-vignette" />

            {/* Top Slates / Meta Tags (NO Client or Project Names) */}
            <div className="poster-top-slate">
              <span className="slate-index">{padNum}</span>
              <span className="slate-pill">{project.category}</span>
              <span className="slate-pill aspect">{project.aspect}</span>
            </div>

            {/* Centered Minimal Play Trigger */}
            <div className="poster-center-play">
              <div className="play-glass-disc">
                <PlayIcon size={20} />
              </div>
              <span className="play-glass-label">WATCH FILM</span>
            </div>

            {/* Bottom Meta Timecode */}
            <div className="poster-bottom-slate">
              <span className="timecode-mono">TRT {project.duration}</span>
              <button
                type="button"
                className="cinema-trigger-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTheater(project);
                }}
                title="Open in Cinema Mode"
              >
                <ExpandIcon size={12} />
                <span>EXPAND</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

/* ---------- Fullscreen Cinema Theater Overlay ---------- */
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
    <div className="cinema-overlay-backdrop" onClick={onClose} role="presentation">
      <div
        className={`cinema-overlay-box ${project.shape}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.category} Theater`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="theater-top-bar">
          <div className="theater-meta-tags">
            <span className="theater-tag category">{project.category}</span>
            <span className="theater-tag aspect">{project.aspect}</span>
            <span className="theater-tag duration">TRT {project.duration}</span>
          </div>

          <button
            ref={closeBtnRef}
            className="theater-close-btn"
            onClick={onClose}
            aria-label="Close cinema mode"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className={`theater-screen ${project.shape}`}>
          <iframe
            src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=0&playsinline=1&title=0&byline=0&portrait=0&badge=0&autopause=0&dnt=1`}
            className="theater-iframe"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            title={`Cinema player ${project.id}`}
          />
        </div>

        <div className="theater-bottom-bar">
          <div className="theater-pager">
            <button
              type="button"
              className="theater-pager-btn"
              onClick={() => onNavigate(prevProject)}
              aria-label="Previous video"
            >
              PREV
            </button>
            <span className="theater-counter">
              {String(currentIndex + 1).padStart(2, "0")} / {String(allProjects.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              className="theater-pager-btn"
              onClick={() => onNavigate(nextProject)}
              aria-label="Next video"
            >
              NEXT
            </button>
          </div>

          <a
            href={`https://vimeo.com/${project.vimeoId}`}
            target="_blank"
            rel="noreferrer"
            className="theater-vimeo-link"
          >
            <span>VIMEO SOURCE</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Editorial Portfolio Application ---------- */
export default function App() {
  const [currentView, setCurrentView] = useState("studio"); // 'studio' | 'works'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionLabel, setTransitionLabel] = useState("INITIALIZING SCREENING ROOM");
  const [selectedCategory, setSelectedCategory] = useState("All Work");
  const [activeTheaterProject, setActiveTheaterProject] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const timecode = useSMPTETimecode();

  // URL Hash Sync for Back/Forward Navigation
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#works" || hash === "#repertoire") {
        setCurrentView("works");
      } else {
        setCurrentView("studio");
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Cinematic Transition Handler
  const navigateToView = (nextView, label = "TRANSITIONING") => {
    if (nextView === currentView || isTransitioning) return;
    setTransitionLabel(label);
    setIsTransitioning(true);
    setMobileMenuOpen(false);

    setTimeout(() => {
      setCurrentView(nextView);
      if (nextView === "works") {
        window.history.pushState(null, "", "#works");
      } else {
        window.history.pushState(null, "", "#studio");
      }
      window.scrollTo({ top: 0, behavior: "instant" });

      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }, 450);
  };

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All Work") return PROJECTS;
    return PROJECTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts = { "All Work": PROJECTS.length };
    PROJECTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(PROFILE.email).then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    });
  };

  return (
    <div className={`portfolio-editorial-root ${currentView}-active`}>
      {/* Background Architectural Canvas & Dynamic Ambient Light */}
      <div className="canvas-atmosphere" aria-hidden="true">
        <div className="ambient-radial-glow top" />
        <div className="ambient-radial-glow bottom" />
        <div className="ambient-radial-glow cyan" />
        <div className="hairline-grid" />
        <div className="cinema-grain" />
      </div>

      {/* Cinematic Dual Shutter Page Transition Curtain */}
      <div
        className={`cinematic-shutter-curtain ${isTransitioning ? "active" : ""}`}
        aria-hidden={!isTransitioning}
      >
        <div className="shutter-blade top-blade">
          <div className="shutter-laser-line" />
        </div>
        <div className="shutter-center-hud">
          <div className="hud-rec-wrap">
            <span className="hud-pulse-rec" />
            <span className="hud-label-mono">{transitionLabel}</span>
          </div>
          <div className="hud-tc-mono">{timecode}</div>
        </div>
        <div className="shutter-blade bottom-blade">
          <div className="shutter-laser-line" />
        </div>
      </div>

      {/* Floating Minimalist Header */}
      <header className="editorial-nav-header">
        <div className="nav-inner-container">
          {/* Logo / Director Mark */}
          <button
            type="button"
            className="nav-signature-btn"
            onClick={() => navigateToView("studio", "RETURNING TO STUDIO")}
          >
            <div className="avatar-dot-wrap">
              <img
                src={PROFILE.avatar || `${import.meta.env.BASE_URL}avatar.png`}
                alt={PROFILE.name}
                className="nav-avatar-circle"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="avatar-live-beacon" />
            </div>
            <div className="signature-info">
              <span className="signature-name">{PROFILE.name}</span>
              <span className="signature-sub">Director of Edit</span>
            </div>
          </button>

          {/* Live Studio Timecode HUD Bar (Desktop) */}
          <div className="nav-hud-center">
            <span className="hud-dot-rec" />
            <span className="hud-format">24.00 FPS [SMPTE]</span>
            <span className="hud-clock">{timecode}</span>
          </div>

          {/* Navigation Switcher Pills */}
          <nav className="nav-view-switcher" aria-label="Page View Navigation">
            <button
              type="button"
              className={`switcher-tab ${currentView === "studio" ? "active" : ""}`}
              onClick={() => navigateToView("studio", "STUDIO VIEW")}
            >
              Studio
            </button>
            <button
              type="button"
              className={`switcher-tab works-tab ${currentView === "works" ? "active" : ""}`}
              onClick={() => navigateToView("works", "SCREENING REPERTOIRE")}
            >
              <FilmIcon size={13} />
              <span>Recent Works</span>
              <span className="switcher-badge">{PROJECTS.length}</span>
            </button>
            <a href="#contact" className="switcher-contact-link">
              <span>Inquire</span>
              <ArrowUpRight size={12} />
            </a>
          </nav>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            className="mobile-burger-trigger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`burger-line ${mobileMenuOpen ? "active" : ""}`} />
            <span className={`burger-line ${mobileMenuOpen ? "active" : ""}`} />
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <nav className="mobile-curtain-menu" aria-label="Mobile Navigation">
            <button
              type="button"
              className={`mobile-menu-item ${currentView === "studio" ? "active" : ""}`}
              onClick={() => navigateToView("studio", "STUDIO VIEW")}
            >
              <span>Director Studio</span>
              <ArrowRight size={14} />
            </button>
            <button
              type="button"
              className={`mobile-menu-item works-highlight ${currentView === "works" ? "active" : ""}`}
              onClick={() => navigateToView("works", "OPENING REPERTOIRE")}
            >
              <span>Recent Works ({PROJECTS.length})</span>
              <FilmIcon size={15} />
            </button>
            <a
              href="#contact"
              className="mobile-menu-item"
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentView === "works") navigateToView("studio", "CONTACT");
              }}
            >
              <span>Initiate Project</span>
              <ArrowUpRight size={14} />
            </a>
          </nav>
        )}
      </header>

      {/* ========================================================
          VIEW A: STUDIO (Director's Studio & Hero Experience)
          ======================================================== */}
      {currentView === "studio" && (
        <main className="view-page studio-view-page">
          {/* HERO SECTION */}
          <section className="editorial-hero-section">
            <div className="hero-monument-box">
              {/* Top Studio Slates */}
              <div className="hero-metadata-line">
                <span className="meta-pill-outline">MUMBAI, IN [IST]</span>
                <span className="meta-divider">•</span>
                <span className="meta-text-status">
                  <span className="status-emerald-dot" />
                  AVAILABLE FOR SELECT COMMISSIONS
                </span>
              </div>

              {/* Monumental Headline */}
              <h1 className="hero-editorial-headline">
                <span className="headline-block">RHYTHM & FORM.</span>
                <span className="headline-block serif-italic">
                  Exploring the art of motion.
                </span>
              </h1>

              {/* Refined Editorial Lead */}
              <p className="hero-editorial-lead">
                Specializing in high-retention short-form Reels, documentary founder films, and multi-cam podcast workflows. Built on frame economy, calibrated sound architecture, and organic DaVinci color grading.
              </p>

              {/* CENTERPIECE HERO CTA: RECENT WORKS BUTTON */}
              <div className="hero-interactive-cta-cluster">
                <button
                  type="button"
                  className="hero-recent-works-btn"
                  onClick={() => navigateToView("works", "LAUNCHING SCREENING ROOM")}
                  title="View Selected Repertoire & Film Edits"
                >
                  <div className="btn-shimmer-sweep" />
                  <div className="btn-inner-content">
                    <span className="btn-film-reel-icon">
                      <FilmIcon size={17} />
                    </span>
                    <span className="btn-main-label">Recent Works</span>
                    <span className="btn-film-counter-chip">{PROJECTS.length} CUTS</span>
                    <span className="btn-arrow-bubble">
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </button>

                <a href="#contact" className="hero-secondary-inquire-btn">
                  <span>Initiate Inquiry</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>

              {/* Architectural Stat Specs */}
              <div className="hero-specs-banner">
                {PROFILE.stats.map((s, idx) => (
                  <div key={idx} className="spec-item">
                    <span className="spec-label-mono">{s.label}</span>
                    <div className="spec-number-row">
                      <CountUpStat
                        target={s.target}
                        decimals={s.decimals}
                        suffix={s.suffix}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* EDITORIAL DISCIPLINES / CRAFT PILLARS */}
          <section className="editorial-services-section">
            <div className="section-narrow-wrap">
              <div className="section-head-slate">
                <span className="eyebrow-mono">CRAFT & ARCHITECTURE</span>
                <h2 className="section-display-title">Post-Production Disciplines</h2>
              </div>

              <div className="services-curated-grid">
                {SERVICES.map((srv) => (
                  <div key={srv.num} className="service-editorial-card">
                    <div className="service-card-head">
                      <span className="service-num-slate">/{srv.num}</span>
                      <span className="service-deco-line" />
                    </div>
                    <h3 className="service-title">{srv.title}</h3>
                    <p className="service-desc">{srv.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SPECIFICATIONS & HARDWARE RUNTIME */}
          <section className="editorial-spec-section" id="stack">
            <div className="spec-sheet-container">
              <div className="spec-sheet-header">
                <span className="eyebrow-mono">STUDIO SPECIFICATIONS</span>
                <h3 className="spec-sheet-title">Technical Standards & Delivery Suite</h3>
              </div>

              <div className="spec-sheet-grid">
                <div className="spec-sheet-col">
                  <span className="col-mono-heading">SOFTWARE RUNTIME</span>
                  <div className="tool-chips-wrap">
                    {TOOLS.map((tool) => (
                      <span key={tool} className="editorial-tool-tag">
                        <span className="tool-bullet">/</span>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="spec-sheet-col">
                  <span className="col-mono-heading">DELIVERY BENCHMARKS</span>
                  <ul className="spec-benchmarks-list">
                    <li>
                      <span className="benchmark-idx">01</span>
                      <div className="benchmark-body">
                        <strong>48-Hour First Cut Turnaround</strong>
                        <p>Rapid assembly and narrative locking so your publishing pipeline never stalls.</p>
                      </div>
                    </li>
                    <li>
                      <span className="benchmark-idx">02</span>
                      <div className="benchmark-body">
                        <strong>Lossless Multi-Format Masters</strong>
                        <p>Full 4K ProRes 422 & optimized H.264 exports formatted for 9:16 vertical and 16:9 cinematic.</p>
                      </div>
                    </li>
                    <li>
                      <span className="benchmark-idx">03</span>
                      <div className="benchmark-body">
                        <strong>DaVinci Resolve Color & Sound Design</strong>
                        <p>Film emulation curves, natural skin tone preservation, and layered SFX dynamics.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT & INQUIRY */}
          <section className="editorial-contact-section" id="contact">
            <div className="contact-editorial-frame">
              <span className="eyebrow-mono">COMMISSIONS & COLLABORATIONS</span>
              <h2 className="contact-editorial-title">
                Have raw footage to cut? <br />
                <span className="serif-italic">Let’s build something iconic.</span>
              </h2>

              <div className="contact-action-interface">
                {/* Copy Email Button */}
                <button
                  type="button"
                  className="email-clipboard-button"
                  onClick={copyEmailToClipboard}
                  title="Copy email address"
                >
                  <span className="email-plain-text">{PROFILE.email}</span>
                  <span className={`clipboard-badge ${copiedEmail ? "copied" : ""}`}>
                    {copiedEmail ? (
                      <>
                        <CheckIcon size={12} />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon size={12} />
                        <span>COPY</span>
                      </>
                    )}
                  </span>
                </button>

                {/* Direct Compose Mail */}
                <a
                  href={`mailto:${PROFILE.email}?subject=Project%20Inquiry%20%E2%80%94%20Video%20Editing`}
                  className="direct-mail-button"
                >
                  <span>Compose Email</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>

              {/* Social Links */}
              <div className="contact-social-pills">
                {PROFILE.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="social-text-link"
                  >
                    <span>{s.label}</span>
                    <ArrowUpRight size={11} />
                  </a>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================
          VIEW B: WORKS (The Repertoire Screening Room)
          ======================================================== */}
      {currentView === "works" && (
        <main className="view-page works-view-page">
          <section className="editorial-work-section">
            {/* Works Header & Breadcrumbs */}
            <div className="works-top-nav-bar">
              <button
                type="button"
                className="back-to-studio-btn"
                onClick={() => navigateToView("studio", "RETURNING TO STUDIO")}
              >
                <ArrowLeft size={14} />
                <span>Back to Studio</span>
              </button>

              <div className="screening-room-tag">
                <span className="screening-dot" />
                <span>SCREENING ROOM // 2024—2025</span>
              </div>
            </div>

            <div className="work-section-header">
              <div className="work-title-wrap">
                <span className="eyebrow-mono">INDEX OF WORKS ({PROJECTS.length} REELS)</span>
                <h2 className="work-display-heading">Curated Repertoire</h2>
              </div>

              {/* Filter Tabs */}
              <div className="work-filter-tabs" role="tablist" aria-label="Filter works">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`filter-tab-pill ${selectedCategory === cat ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                    role="tab"
                    aria-selected={selectedCategory === cat}
                  >
                    <span className="tab-name">{cat}</span>
                    <span className="tab-digit">{categoryCounts[cat] || 0}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Video Masonry Grid */}
            <div className="work-masonry-grid">
              {filteredProjects.map((project, idx) => (
                <VideoCard
                  key={project.id}
                  project={project}
                  index={idx}
                  onOpenTheater={setActiveTheaterProject}
                />
              ))}
            </div>

            {/* Bottom Floating Bar in Works Page */}
            <div className="works-bottom-action-banner">
              <div className="banner-left-info">
                <strong>Need custom video editing or a monthly creator retainer?</strong>
                <p>Delivering high-pacing cuts within 48 hours for fast-growing brands.</p>
              </div>
              <div className="banner-right-btns">
                <button
                  type="button"
                  className="banner-studio-btn"
                  onClick={() => navigateToView("studio", "STUDIO OVERVIEW")}
                >
                  <ArrowLeft size={13} />
                  <span>Studio Specs</span>
                </button>
                <a
                  href={`mailto:${PROFILE.email}?subject=Project%20Inquiry%20from%20Portfolio`}
                  className="banner-inquire-btn"
                >
                  <span>Initiate Inquiry</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================
          GLOBAL FOOTER
          ======================================================== */}
      <footer className="editorial-footer">
        <div className="footer-wrap">
          <div className="footer-credits">
            <span className="footer-name">{PROFILE.name}</span>
            <span className="footer-sep">/</span>
            <span className="footer-role">Video Editor & Motion Designer</span>
          </div>
          <div className="footer-stamp">
            <span>© {new Date().getFullYear()} RANJEET MISHRA STUDIO • ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </footer>

      {/* Fullscreen Cinema Modal */}
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
