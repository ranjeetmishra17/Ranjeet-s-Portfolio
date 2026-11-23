import { useState, useEffect, useRef, useMemo } from "react";
import {
  PROFILE,
  SERVICES,
  TOOLS,
  CATEGORIES,
  PROJECTS,
} from "./data.js";

/* ---------- Cinema & Film Editorial Icons ---------- */
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

const FilmReelIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="6" r="1.5" fill="currentColor" />
    <circle cx="12" cy="18" r="1.5" fill="currentColor" />
    <circle cx="6" cy="12" r="1.5" fill="currentColor" />
    <circle cx="18" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

const ApertureIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
    <line x1="9.69" y1="8" x2="21.17" y2="8" />
    <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
    <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
    <line x1="14.31" y1="16" x2="2.83" y2="16" />
    <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
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

/* ---------- Animated Running Stat Counter ---------- */
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

      const duration = 1600;
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
    <span ref={ref} className="stat-emerald-val">
      {val}
    </span>
  );
}

/* ---------- 35mm Celluloid Video Card ---------- */
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
      className={`cinema-frame-card ${project.shape} ${isPlaying ? "playing" : ""}`}
      style={{ animationDelay: `${index * 80}ms` }}
      tabIndex={0}
      aria-label={`${project.category} film cut, duration ${project.duration}`}
    >
      <div className="card-celluloid-ratio">
        {isPlaying ? (
          <div className="player-viewport">
            {isLoading && (
              <div className="player-emerald-loader" aria-hidden="true">
                <span className="loader-emerald-reel">
                  <FilmReelIcon size={24} />
                </span>
                <span className="loader-slate-label">ROLLING REEL...</span>
              </div>
            )}
            <iframe
              src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=0&playsinline=1&title=0&byline=0&portrait=0&badge=0&autopause=1&dnt=1`}
              className="vimeo-embed-iframe"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              title={`Film Reel ${project.id}`}
              onLoad={() => setIsLoading(false)}
            />
            {/* Live Screening Header Bar */}
            <div className="player-overlay-bar">
              <div className="overlay-left-meta">
                <span className="camera-rec-dot" />
                <span className="meta-slate-tag">ROLLING • {project.category.toUpperCase()}</span>
              </div>
              <div className="overlay-right-actions">
                <button
                  type="button"
                  className="icon-action-btn"
                  onClick={() => onOpenTheater(project)}
                  title="Expand to Full Theater Screen"
                  aria-label="Expand to full theater screen"
                >
                  <ExpandIcon size={14} />
                </button>
                <button
                  type="button"
                  className="icon-action-btn close-action"
                  onClick={stopPlayback}
                  title="Close Projector"
                  aria-label="Close projector"
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
              alt={`${project.category} still`}
              className="poster-media-img"
              loading="lazy"
            />
            {/* Emerald/Celluloid Vignette */}
            <div className="poster-emerald-vignette" />

            {/* Top Slates: Numbered Slate & Format (Strictly No Client Names) */}
            <div className="poster-top-slate">
              <span className="slate-take-num">REEL #{padNum}</span>
              <span className="slate-pill category">{project.category}</span>
              <span className="slate-pill format">{project.aspect}</span>
            </div>

            {/* Centered Emerald Play Reel Trigger */}
            <div className="poster-center-play">
              <div className="play-emerald-disc">
                <PlayIcon size={22} />
              </div>
              <span className="play-cinematic-label">PLAY REEL</span>
            </div>

            {/* Bottom Meta Timecode */}
            <div className="poster-bottom-slate">
              <span className="timecode-badge">RUNTIME {project.duration}</span>
              <button
                type="button"
                className="cinema-expand-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTheater(project);
                }}
                title="Open in Cinema Theater"
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
            <span className="theater-slate-tag take">CUT #{String(currentIndex + 1).padStart(2, "0")}</span>
            <span className="theater-slate-tag category">{project.category}</span>
            <span className="theater-slate-tag duration">TRT {project.duration}</span>
          </div>

          <button
            ref={closeBtnRef}
            className="theater-close-btn"
            onClick={onClose}
            aria-label="Exit screening room"
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
              aria-label="Previous cut"
            >
              PREVIOUS
            </button>
            <span className="theater-counter">
              {String(currentIndex + 1).padStart(2, "0")} OF {String(allProjects.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              className="theater-pager-btn"
              onClick={() => onNavigate(nextProject)}
              aria-label="Next cut"
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
            <span>VIMEO ARCHIVE</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Portfolio Application ---------- */
export default function App() {
  const [currentView, setCurrentView] = useState("studio"); // 'studio' | 'works'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionSlate, setTransitionSlate] = useState("SCREENING ROOM // SCENE 01");
  const [selectedCategory, setSelectedCategory] = useState("All Work");
  const [activeTheaterProject, setActiveTheaterProject] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Optical Aperture Focus Transition Handler
  const navigateToView = (nextView, slateText = "FOCUSING REPERTOIRE") => {
    if (nextView === currentView || isTransitioning) return;
    setTransitionSlate(slateText);
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
      }, 380);
    }, 420);
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
    <div className={`cinema-portfolio-root ${currentView}-active`}>
      {/* Background Emerald Celluloid Atmosphere */}
      <div className="cinema-atmosphere-canvas" aria-hidden="true">
        <div className="ambient-emerald-glow emerald-top" />
        <div className="ambient-emerald-glow sage-center" />
        <div className="ambient-emerald-glow jade-bottom" />
        <div className="film-celluloid-grain" />
      </div>

      {/* NEW: Camera Aperture & Optical Lens Focus Pull Transition */}
      <div
        className={`cinematic-aperture-overlay ${isTransitioning ? "active" : ""}`}
        aria-hidden={!isTransitioning}
      >
        <div className="aperture-iris-ring">
          <div className="iris-crosshair-h" />
          <div className="iris-crosshair-v" />
          <div className="iris-glow-bloom" />
        </div>
        <div className="aperture-center-slate">
          <div className="slate-pill-indicator">
            <ApertureIcon size={16} />
            <span className="slate-indicator-text">{transitionSlate}</span>
          </div>
          <div className="slate-camera-data">F/1.4 • 24 FPS • SOUND DESIGN READY</div>
        </div>
      </div>

      {/* Floating Emerald Glass Navigation Header */}
      <header className="cinema-nav-header">
        <div className="nav-inner-bar">
          {/* Director Signature */}
          <button
            type="button"
            className="nav-signature-btn"
            onClick={() => navigateToView("studio", "STUDIO // SCENE 01")}
          >
            <div className="avatar-portrait-wrap">
              <img
                src={PROFILE.avatar || `${import.meta.env.BASE_URL}avatar.png`}
                alt={PROFILE.name}
                className="nav-avatar-img"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="avatar-rec-dot" />
            </div>
            <div className="signature-titles">
              <span className="signature-name">{PROFILE.name}</span>
              <span className="signature-craft">Film & Video Editor</span>
            </div>
          </button>

          {/* Central Editorial Badge (Desktop) */}
          <div className="nav-center-badge">
            <span className="badge-film-dot" />
            <span className="badge-text">INDEPENDENT POST-PRODUCTION</span>
          </div>

          {/* View Navigation Switcher */}
          <nav className="nav-view-pills" aria-label="Portfolio Sections">
            <button
              type="button"
              className={`nav-tab-pill ${currentView === "studio" ? "active" : ""}`}
              onClick={() => navigateToView("studio", "STUDIO OVERVIEW")}
            >
              Director
            </button>
            <button
              type="button"
              className={`nav-tab-pill works-pill ${currentView === "works" ? "active" : ""}`}
              onClick={() => navigateToView("works", "SCREENING REPERTOIRE")}
            >
              <FilmReelIcon size={14} />
              <span>Recent Works</span>
              <span className="works-count-tag">{PROJECTS.length}</span>
            </button>
            <a href="#contact" className="nav-cta-inquire">
              <span>Contact</span>
              <ArrowUpRight size={12} />
            </a>
          </nav>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            className="mobile-burger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`burger-blade ${mobileMenuOpen ? "active" : ""}`} />
            <span className={`burger-blade ${mobileMenuOpen ? "active" : ""}`} />
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <nav className="mobile-curtain-menu" aria-label="Mobile Navigation">
            <button
              type="button"
              className={`mobile-nav-row ${currentView === "studio" ? "active" : ""}`}
              onClick={() => navigateToView("studio", "STUDIO // HOME")}
            >
              <span>Director Studio</span>
              <ArrowRight size={14} />
            </button>
            <button
              type="button"
              className={`mobile-nav-row works-accent ${currentView === "works" ? "active" : ""}`}
              onClick={() => navigateToView("works", "SCREENING ROOM")}
            >
              <span>Recent Works ({PROJECTS.length})</span>
              <FilmReelIcon size={15} />
            </button>
            <a
              href="#contact"
              className="mobile-nav-row"
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentView === "works") navigateToView("studio", "CONTACT");
              }}
            >
              <span>Initiate Collaboration</span>
              <ArrowUpRight size={14} />
            </a>
          </nav>
        )}
      </header>

      {/* ========================================================
          VIEW A: STUDIO (Creative Director & Craft Overview)
          ======================================================== */}
      {currentView === "studio" && (
        <main className="view-container studio-page">
          {/* HERO SECTION */}
          <section className="cinema-hero-section">
            <div className="hero-editorial-center">
              {/* Studio Status Slate */}
              <div className="hero-vintage-slate">
                <span className="slate-pill-location">MUMBAI [IST]</span>
                <span className="slate-sep">/</span>
                <span className="slate-avail">
                  <span className="camera-live-pulse" />
                  AVAILABLE FOR COMMISSIONS
                </span>
              </div>

              {/* Monumental Cinematic Headline */}
              <h1 className="hero-cinema-heading">
                <span className="heading-line bold-display">CRAFTING RHYTHM.</span>
                <span className="heading-line serif-italic">
                  Stories that leave an impression.
                </span>
              </h1>

              {/* Editorial Bio */}
              <p className="hero-editorial-summary">
                Specializing in high-retention short-form Reels, documentary founder films, and multi-cam podcast workflows. Frame-by-frame pacing, custom sound architecture, and organic DaVinci color grading.
              </p>

              {/* CENTERPIECE HERO ACTION: "RECENT WORKS" CINEMA PASS */}
              <div className="hero-centerpiece-actions">
                <button
                  type="button"
                  className="cinema-works-pass-btn"
                  onClick={() => navigateToView("works", "SCREENING ROOM // 09 CUTS")}
                  title="Step into the Screening Room to watch recent cuts"
                >
                  <div className="btn-ambient-halo" />
                  <div className="pass-btn-body">
                    <span className="pass-reel-icon">
                      <FilmReelIcon size={18} />
                    </span>
                    <span className="pass-main-title">Recent Works</span>
                    <span className="pass-count-chip">{PROJECTS.length} CUTS</span>
                    <span className="pass-arrow-disc">
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </button>

                <a href="#contact" className="cinema-secondary-btn">
                  <span>Start a Project</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>

              {/* Cinematic Stat Slates */}
              <div className="hero-stats-celluloid">
                {PROFILE.stats.map((s, idx) => (
                  <div key={idx} className="stat-slate-cell">
                    <span className="stat-label-vintage">{s.label}</span>
                    <div className="stat-val-row">
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
          <section className="cinema-disciplines-section">
            <div className="section-frame-wrap">
              <div className="section-header-slate">
                <span className="section-eyebrow-emerald">THE CRAFT</span>
                <h2 className="section-display-serif">Post-Production Disciplines</h2>
              </div>

              <div className="disciplines-art-grid">
                {SERVICES.map((srv) => (
                  <div key={srv.num} className="discipline-cinema-card">
                    <div className="card-top-take">
                      <span className="take-number">SCENE /{srv.num}</span>
                      <span className="take-emerald-line" />
                    </div>
                    <h3 className="card-craft-title">{srv.title}</h3>
                    <p className="card-craft-desc">{srv.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* THE SUITE & TECHNICAL CRAFT */}
          <section className="cinema-suite-section" id="stack">
            <div className="suite-vintage-container">
              <div className="suite-header">
                <span className="section-eyebrow-emerald">THE CUTTING ROOM</span>
                <h3 className="suite-display-title">Post Suite & Turnaround Standards</h3>
              </div>

              <div className="suite-columns-grid">
                <div className="suite-tools-col">
                  <span className="suite-col-label">NLE & FINISHING SUITE</span>
                  <div className="suite-tool-tags">
                    {TOOLS.map((tool) => (
                      <span key={tool} className="emerald-tool-tag">
                        <span className="tag-sparkle">✦</span>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="suite-standards-col">
                  <span className="suite-col-label">DELIVERY STANDARDS</span>
                  <ul className="suite-standards-list">
                    <li>
                      <span className="standard-num">01</span>
                      <div className="standard-info">
                        <strong>48-Hour Assembly & First Cut</strong>
                        <p>Rapid narrative locking and beat assembly so your release calendar never stalls.</p>
                      </div>
                    </li>
                    <li>
                      <span className="standard-num">02</span>
                      <div className="standard-info">
                        <strong>Master Quality Multi-Format Exports</strong>
                        <p>Lossless 4K ProRes 422 masters and calibrated H.264 files formatted for 9:16 and 16:9.</p>
                      </div>
                    </li>
                    <li>
                      <span className="standard-num">03</span>
                      <div className="standard-info">
                        <strong>DaVinci Color Science & Sound Mix</strong>
                        <p>Preserved film emulations, clean skin tones, and rich spatial audio sound design.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT & INQUIRY */}
          <section className="cinema-contact-section" id="contact">
            <div className="contact-velvet-frame">
              <span className="section-eyebrow-emerald">COLLABORATE</span>
              <h2 className="contact-heroic-title">
                Have raw footage waiting to be cut? <br />
                <span className="serif-italic">Let’s shape something unforgettable.</span>
              </h2>

              <div className="contact-interaction-bar">
                {/* 1-Click Copy Email */}
                <button
                  type="button"
                  className="copy-email-emerald-btn"
                  onClick={copyEmailToClipboard}
                  title="Copy email address"
                >
                  <span className="email-address-text">{PROFILE.email}</span>
                  <span className={`copy-badge ${copiedEmail ? "copied" : ""}`}>
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

                {/* Direct Mail */}
                <a
                  href={`mailto:${PROFILE.email}?subject=Editing%20Project%20Inquiry%20%E2%80%94%20Ranjeet%20Mishra`}
                  className="direct-mail-emerald-btn"
                >
                  <span>Compose Email</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>

              {/* Social Channels */}
              <div className="contact-social-channels">
                {PROFILE.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="social-emerald-link"
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
        <main className="view-container works-page">
          <section className="cinema-screening-section">
            {/* Screening Room Breadcrumb Bar */}
            <div className="screening-top-header">
              <button
                type="button"
                className="return-studio-btn"
                onClick={() => navigateToView("studio", "STUDIO // TAKE 01")}
              >
                <ArrowLeft size={14} />
                <span>Return to Studio</span>
              </button>

              <div className="screening-film-status">
                <span className="status-reel-icon">
                  <FilmReelIcon size={14} />
                </span>
                <span>SCREENING ROOM // {PROJECTS.length} SELECTED CUTS</span>
              </div>
            </div>

            {/* Works Header & Filters */}
            <div className="screening-title-row">
              <div className="title-lead-box">
                <span className="section-eyebrow-emerald">CURATED REPERTOIRE (2024—2025)</span>
                <h2 className="screening-main-heading">Selected Cuts</h2>
              </div>

              {/* Filter Tabs */}
              <div className="screening-filter-pills" role="tablist" aria-label="Filter works">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`filter-pill-btn ${selectedCategory === cat ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                    role="tab"
                    aria-selected={selectedCategory === cat}
                  >
                    <span className="filter-name">{cat}</span>
                    <span className="filter-count">{categoryCounts[cat] || 0}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Celluloid Film Grid */}
            <div className="screening-film-grid">
              {filteredProjects.map((project, idx) => (
                <VideoCard
                  key={project.id}
                  project={project}
                  index={idx}
                  onOpenTheater={setActiveTheaterProject}
                />
              ))}
            </div>

            {/* Screening Room Bottom Card */}
            <div className="screening-bottom-slate">
              <div className="slate-left-msg">
                <strong>Looking for a dedicated video editor or creator retainer?</strong>
                <p>Bringing narrative clarity, dynamic sound design, and fast turnarounds to every project.</p>
              </div>
              <div className="slate-right-actions">
                <button
                  type="button"
                  className="slate-return-btn"
                  onClick={() => navigateToView("studio", "STUDIO OVERVIEW")}
                >
                  <ArrowLeft size={13} />
                  <span>Studio Details</span>
                </button>
                <a
                  href={`mailto:${PROFILE.email}?subject=Project%20Inquiry%20from%20Portfolio`}
                  className="slate-inquire-btn"
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
      <footer className="cinema-footer">
        <div className="footer-content-wrap">
          <div className="footer-credits">
            <span className="footer-director">{PROFILE.name}</span>
            <span className="footer-dot">•</span>
            <span className="footer-craft">Film & Video Editor</span>
          </div>
          <div className="footer-copyright">
            <span>© {new Date().getFullYear()} RANJEET MISHRA STUDIO • ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </footer>

      {/* Fullscreen Cinema Theater Modal */}
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
