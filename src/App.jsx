import { useState, useEffect, useRef, useMemo } from "react";
import { flushSync } from "react-dom";
import {
  PROFILE,
  SERVICES,
  TOOLS,
  CATEGORIES,
  PROJECTS,
} from "./data.js";

/* ---------- Minimal Icons ---------- */
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

/* ---------- Minimal Animated Stat Counter ---------- */
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
    <span ref={ref} className="minimal-stat-val">
      {val}
    </span>
  );
}

/* ---------- Minimal Video Card (Works Screening Room) ---------- */
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
      className={`minimal-video-card ${project.shape} ${isPlaying ? "playing" : ""}`}
      tabIndex={0}
      aria-label={`${project.category} #${padNum}`}
    >
      <div className="card-aspect-viewport">
        {isPlaying ? (
          <div className="card-inline-player">
            <iframe
              src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=0&playsinline=1&title=0&byline=0&portrait=0&badge=0&autopause=1&dnt=1`}
              className="card-vimeo-iframe"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              title={`Cut #${padNum}`}
            />
            <div className="player-close-bar">
              <span className="player-cut-tag">CUT #{padNum}</span>
              <button
                type="button"
                className="player-close-pill"
                onClick={stopPlayback}
                aria-label="Close video"
              >
                <CloseIcon size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="card-poster-surface" onClick={startPlayback}>
            <img
              src={project.image}
              alt={`${project.category} preview`}
              className="card-media-poster"
              loading="lazy"
            />
            {/* Optical Viewfinder Corners */}
            <div className="viewfinder-brackets" aria-hidden="true">
              <span className="vf-bracket vf-tl" />
              <span className="vf-bracket vf-tr" />
              <span className="vf-bracket vf-bl" />
              <span className="vf-bracket vf-br" />
            </div>

            <div className="card-vignette-overlay" />

            {/* Clean Metadata Slates */}
            <div className="card-header-slate">
              <span className="card-num-badge">#{padNum}</span>
              <span className="card-category-pill">{project.category}</span>
            </div>

            {/* Clean Center Play Trigger */}
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
            <span className="theater-slate-tag duration">{project.duration}</span>
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
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
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
  const [targetView, setTargetView] = useState("works");
  const [isCircleTransitioning, setIsCircleTransitioning] = useState(false);
  const [circleOrigin, setCircleOrigin] = useState({ x: 0, y: 0 });
  const [selectedCategory, setSelectedCategory] = useState("All Work");
  const [activeTheaterProject, setActiveTheaterProject] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Interactive Hero Video Portal state
  const [heroProjectIndex, setHeroProjectIndex] = useState(0);
  const [isHeroPlaying, setIsHeroPlaying] = useState(false);

  const heroProject = PROJECTS[heroProjectIndex] || PROJECTS[0];

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

  /* 
   * CIRCULAR IRIS VIEW TRANSITION:
   * Smooth, hardware-accelerated circular reveal from button click coordinates.
   */
  const navigateWithCircleTransition = (targetViewName, e) => {
    if (currentView === targetViewName) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else if (e && e.clientX && e.clientY) {
      x = e.clientX;
      y = e.clientY;
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    if (typeof document !== "undefined" && "startViewTransition" in document) {
      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setCurrentView(targetViewName);
          window.scrollTo({ top: 0, behavior: "instant" });
          window.history.pushState(null, "", targetViewName === "works" ? "#works" : "#studio");
        });
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          [
            { clipPath: `circle(0px at ${x}px ${y}px)` },
            { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` },
          ],
          {
            duration: 650,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    } else {
      setCircleOrigin({ x, y });
      setTargetView(targetViewName);
      setIsCircleTransitioning(true);

      setTimeout(() => {
        setCurrentView(targetViewName);
        window.scrollTo({ top: 0, behavior: "instant" });
        window.history.pushState(null, "", targetViewName === "works" ? "#works" : "#studio");
      }, 320);

      setTimeout(() => {
        setIsCircleTransitioning(false);
      }, 650);
    }
  };

  const handleRecentWorksClick = (e) => navigateWithCircleTransition("works", e);
  const handleReturnToStudio = (e) => navigateWithCircleTransition("studio", e);

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
    <div className={`minimal-portfolio-root ${currentView}-active`}>
      {/* Discreet Ambient Background */}
      <div className="minimal-atmosphere-canvas" aria-hidden="true">
        <div className="minimal-ambient-glow" />
      </div>

      {/* Fallback circle overlay for non-ViewTransition browsers */}
      {isCircleTransitioning && (
        <div
          className="circle-scaling-overlay-portal"
          style={{
            "--circle-cx": `${circleOrigin.x}px`,
            "--circle-cy": `${circleOrigin.y}px`,
          }}
          aria-hidden="true"
        >
          <div className="scaling-olive-circle-disc" />
        </div>
      )}

      {/* PURE MINIMALIST NAVIGATION */}
      <header className="minimal-nav-header">
        <div className="minimal-nav-inner">
          {/* Director Identity with Avatar */}
          <button
            type="button"
            className="minimal-brand-btn"
            onClick={handleReturnToStudio}
          >
            <div className="nav-avatar-frame">
              <img
                src={PROFILE.avatar || "/avatar.png"}
                alt={PROFILE.name}
                className="nav-avatar-img"
              />
              <span className="nav-avatar-dot" />
            </div>
            <div className="brand-text-col">
              <span className="brand-name">{PROFILE.name}</span>
              <span className="brand-title">Video Editor</span>
            </div>
          </button>

          {/* Clean Actions */}
          <nav className="minimal-nav-actions" aria-label="Main Navigation">
            <button
              type="button"
              className={`minimal-nav-link ${currentView === "studio" ? "active" : ""}`}
              onClick={handleReturnToStudio}
            >
              Overview
            </button>
            <button
              type="button"
              className={`minimal-nav-pill ${currentView === "works" ? "active" : ""}`}
              onClick={handleRecentWorksClick}
            >
              <FilmReelIcon size={14} />
              <span>Recent Works</span>
              <span className="nav-count-dot">{PROJECTS.length}</span>
            </button>
            <a href="#contact" className="minimal-contact-link">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* ========================================================
          VIEW: STUDIO (The Minimal & Creative Hero Stage)
          ======================================================== */}
      {currentView === "studio" && (
        <main className="view-layer-minimal view-enter-reveal">
          {/* THE CREATIVE INTERACTIVE HERO */}
          <section className="creative-hero-section">
            <div className="creative-hero-grid">
              {/* Left Column: Directorial Narrative & Actions */}
              <div className="hero-editorial-column">
                <div className="hero-director-badge">
                  <div className="director-avatar-wrap">
                    <img
                      src={PROFILE.avatar || "/avatar.png"}
                      alt={PROFILE.name}
                      className="director-avatar-img"
                    />
                    <span className="director-rec-pulse" />
                  </div>
                  <div className="director-badge-info">
                    <span className="director-badge-name">{PROFILE.name}</span>
                    <span className="director-badge-craft">Post-Production Editor • Mumbai [IST]</span>
                  </div>
                  <span className="director-status-chip">
                    <span className="chip-live-dot" />
                    COMMISSIONS OPEN
                  </span>
                </div>

                <h1 className="hero-editorial-title">
                  <span className="title-bold">Crafting rhythm.</span>
                  <span className="title-italic">Stories that leave an impression.</span>
                </h1>

                <p className="hero-editorial-description">
                  Specializing in high-retention short-form Reels, documentary founder stories, and multi-cam podcast workflows. Frame-by-frame pacing, bespoke sound architecture, and organic DaVinci color grading.
                </p>

                {/* Centerpiece "Recent Works" Pass */}
                <div className="hero-action-row">
                  <button
                    type="button"
                    className="minimal-works-pass-btn"
                    onClick={handleRecentWorksClick}
                    title="Explore recent works"
                  >
                    <span className="btn-label">Recent Works</span>
                    <span className="btn-count-chip">{PROJECTS.length} CUTS</span>
                    <span className="btn-arrow-disc">
                      <ArrowRight size={13} />
                    </span>
                  </button>

                  <a href="#contact" className="minimal-secondary-btn">
                    <span>Start a Project</span>
                    <ArrowUpRight size={12} />
                  </a>
                </div>

                {/* Minimal Numbers Row */}
                <div className="minimal-stats-strip">
                  {PROFILE.stats.map((s, idx) => (
                    <div key={idx} className="stat-minimal-item">
                      <span className="stat-number">
                        <CountUpStat
                          target={s.target}
                          decimals={s.decimals}
                          suffix={s.suffix}
                        />
                      </span>
                      <span className="stat-caption">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: The Interactive Showreel Portal */}
              <div className="hero-portal-column">
                <div className="hero-cinema-portal">
                  <div className="portal-top-bar">
                    <div className="portal-left-meta">
                      <span className="portal-live-dot" />
                      <span className="portal-slate-label">PREVIEW REEL // 24 FPS</span>
                    </div>
                    <div className="portal-right-meta">
                      <span className="portal-category-tag">{heroProject.category}</span>
                      <button
                        type="button"
                        className="portal-expand-icon"
                        onClick={() => setActiveTheaterProject(heroProject)}
                        title="Expand to Fullscreen Theater"
                      >
                        <ExpandIcon size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Portal Screen Viewport */}
                  <div className={`portal-screen-viewport ${heroProject.shape}`}>
                    {isHeroPlaying ? (
                      <div className="portal-inline-player">
                        <iframe
                          src={`https://player.vimeo.com/video/${heroProject.vimeoId}?autoplay=1&muted=0&playsinline=1&title=0&byline=0&portrait=0&badge=0&autopause=1&dnt=1`}
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
                        {/* Optical Viewfinder Corners */}
                        <div className="viewfinder-brackets" aria-hidden="true">
                          <span className="vf-bracket vf-tl" />
                          <span className="vf-bracket vf-tr" />
                          <span className="vf-bracket vf-bl" />
                          <span className="vf-bracket vf-br" />
                        </div>

                        <div className="card-vignette-overlay" />

                        {/* Centered Play Trigger */}
                        <div className="portal-center-play">
                          <div className="play-disc-circle">
                            <PlayIcon size={24} />
                          </div>
                          <span className="portal-play-label">PLAY PREVIEW</span>
                        </div>

                        <div className="portal-bottom-tag">
                          <span>{heroProject.duration}</span>
                          <span className="tag-sep">•</span>
                          <span>{heroProject.aspect}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick-Switch Thumbnails below Portal */}
                  <div className="portal-switch-bar">
                    <span className="switch-hint">FEATURED CUTS:</span>
                    <div className="switch-chips">
                      {[0, 1, 3].map((idx) => {
                        const p = PROJECTS[idx];
                        if (!p) return null;
                        const isSelected = heroProjectIndex === idx;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            className={`switch-chip-btn ${isSelected ? "active" : ""}`}
                            onClick={() => {
                              setHeroProjectIndex(idx);
                              setIsHeroPlaying(false);
                            }}
                          >
                            <span>#{String(idx + 1).padStart(2, "0")} {p.category}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* EDITORIAL DISCIPLINES */}
          <section className="minimal-disciplines-section">
            <div className="minimal-section-container">
              <div className="section-title-header">
                <span className="section-label">THE CRAFT</span>
                <h2 className="section-heading">Post-Production Disciplines</h2>
              </div>

              <div className="disciplines-minimal-grid">
                {SERVICES.map((srv) => (
                  <div key={srv.num} className="discipline-clean-card">
                    <span className="discipline-num">SCENE /{srv.num}</span>
                    <h3 className="discipline-title">{srv.title}</h3>
                    <p className="discipline-desc">{srv.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FINISHING SUITE & TURNAROUND */}
          <section className="minimal-suite-section">
            <div className="minimal-section-container">
              <div className="suite-minimal-box">
                <div className="suite-info-col">
                  <span className="section-label">FINISHING SUITE</span>
                  <h3 className="suite-title">Precision Tools & 24–48h Turnaround</h3>
                  <p className="suite-desc">
                    Every project receives lossless 4K ProRes master deliveries, natural skin-tone color grading in DaVinci Resolve, and multi-track spatial sound design.
                  </p>
                  <div className="suite-tags-row">
                    {TOOLS.map((tool) => (
                      <span key={tool} className="suite-tag-pill">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT SECTION */}
          <section className="minimal-contact-section" id="contact">
            <div className="minimal-section-container">
              <div className="contact-clean-box">
                <span className="section-label">COLLABORATE</span>
                <h2 className="contact-clean-title">
                  Have raw footage ready to be cut? <br />
                  <span className="title-italic">Let’s shape something unforgettable.</span>
                </h2>

                <div className="contact-actions-row">
                  <button
                    type="button"
                    className="copy-email-clean-btn"
                    onClick={copyEmailToClipboard}
                    title="Copy email address"
                  >
                    <span className="email-text">{PROFILE.email}</span>
                    <span className={`copy-state-chip ${copiedEmail ? "copied" : ""}`}>
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

                  <a
                    href={`mailto:${PROFILE.email}?subject=Editing%20Project%20Inquiry%20%E2%80%94%20Ranjeet%20Mishra`}
                    className="direct-mail-clean-btn"
                  >
                    <span>Send Email</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>

                <div className="contact-social-row">
                  {PROFILE.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-minimal-link"
                    >
                      <span>{s.label}</span>
                      <ArrowUpRight size={11} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================
          VIEW: WORKS (Clean Minimal Screening Room)
          ======================================================== */}
      {currentView === "works" && (
        <main className="view-layer-minimal view-enter-reveal">
          <section className="minimal-works-section">
            <div className="minimal-section-container">
              {/* Back to Studio & Header */}
              <div className="works-top-nav">
                <button
                  type="button"
                  className="works-back-btn"
                  onClick={handleReturnToStudio}
                >
                  <ArrowLeft size={14} />
                  <span>Overview</span>
                </button>

                <div className="works-vault-tag">
                  <span>{PROJECTS.length} SELECTED CUTS</span>
                </div>

                <a
                  href={`mailto:${PROFILE.email}?subject=Project%20Inquiry%20from%20Portfolio`}
                  className="works-inquire-link"
                >
                  <span>Inquire</span>
                  <ArrowUpRight size={12} />
                </a>
              </div>

              {/* Title & Filter Tabs */}
              <div className="works-header-row">
                <div>
                  <h2 className="works-main-title">Selected Cuts</h2>
                  <p className="works-sub-title">
                    Commercial brand films, high-retention short-form Reels, and multi-cam podcast workflows.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="works-filter-cluster" role="tablist" aria-label="Filter works">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`filter-minimal-btn ${selectedCategory === cat ? "active" : ""}`}
                      onClick={() => setSelectedCategory(cat)}
                      role="tab"
                      aria-selected={selectedCategory === cat}
                    >
                      <span>{cat}</span>
                      <span className="filter-count-chip">{categoryCounts[cat] || 0}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clean Grid */}
              <div className={`minimal-works-grid layout-${selectedCategory.toLowerCase().replace(/[^a-z]/g, "")}`}>
                {filteredProjects.map((project, idx) => (
                  <VideoCard
                    key={project.id}
                    project={project}
                    index={idx}
                    onOpenTheater={setActiveTheaterProject}
                  />
                ))}
              </div>

              {/* Minimal Bottom Prompt */}
              <div className="works-bottom-prompt">
                <div className="prompt-left">
                  <span className="section-label">COMMISSIONS OPEN</span>
                  <h3 className="prompt-title">Need a dedicated editor or creator retainer?</h3>
                </div>
                <div className="prompt-actions">
                  <button
                    type="button"
                    className="prompt-back-btn"
                    onClick={handleReturnToStudio}
                  >
                    <span>Overview</span>
                  </button>
                  <a
                    href={`mailto:${PROFILE.email}?subject=Project%20Inquiry%20from%20Portfolio`}
                    className="prompt-email-btn"
                  >
                    <span>Start a Project</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* FOOTER */}
      <footer className="minimal-footer">
        <div className="footer-inner-clean">
          <span className="footer-brand">{PROFILE.name}</span>
          <span className="footer-dot">•</span>
          <span className="footer-role">Video Editor</span>
          <span className="footer-right">© {new Date().getFullYear()}</span>
        </div>
      </footer>

      {/* Cinema Modal */}
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
