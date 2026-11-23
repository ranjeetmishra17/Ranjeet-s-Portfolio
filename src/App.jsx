import { useState, useEffect, useRef, useMemo } from "react";
import {
  PROFILE,
  TOOLS,
  CATEGORIES,
  PROJECTS,
  MARQUEE_ITEMS,
} from "./data.js";

/* ---------- SVG Icons ---------- */
const PlayIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.14v13.72a1 1 0 001.52.85l11-6.86a1 1 0 000-1.7l-11-6.86A1 1 0 008 5.14z" />
  </svg>
);

const CloseIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ExpandIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);

const ExternalIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M7 7h10v10" />
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

const FilmIcon = ({ size = 15 }) => (
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

/* ---------- Running Stat Counter ---------- */
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

      const duration = 1800;
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
    <span ref={ref} className="stat-number tabular-nums">
      {val}
    </span>
  );
}

/* ---------- Interactive Video Card Component ---------- */
function VideoCard({ project, onOpenTheater }) {
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

  return (
    <article
      className={`cinema-card ${project.shape} ${isPlaying ? "is-playing" : ""}`}
      tabIndex={0}
      aria-label={`${project.category} video, duration ${project.duration}`}
    >
      <div className="card-media-stage">
        {isPlaying ? (
          <div className="player-embed-container">
            {isLoading && (
              <div className="player-loading-spinner" aria-hidden="true">
                <div className="spinner-orbit" />
                <span>Buffering Stream...</span>
              </div>
            )}
            <iframe
              src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=0&playsinline=1&title=0&byline=0&portrait=0&badge=0&autopause=1&dnt=1`}
              className="vimeo-embed-iframe"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              title={`Video player ${project.id}`}
              onLoad={() => setIsLoading(false)}
            />
            {/* Top Bar inside active player */}
            <div className="player-active-controls">
              <div className="player-active-tags">
                <span className="live-pulse-badge" />
                <span className="tag-pill">{project.category}</span>
                <span className="tag-pill">{project.duration}</span>
              </div>
              <div className="player-action-btns">
                <button
                  type="button"
                  className="player-ctrl-btn"
                  onClick={() => onOpenTheater(project)}
                  title="Expand to Full Cinema"
                  aria-label="Expand to full cinema"
                >
                  <ExpandIcon size={15} />
                </button>
                <button
                  type="button"
                  className="player-ctrl-btn close"
                  onClick={stopPlayback}
                  title="Close Video"
                  aria-label="Close video player"
                >
                  <CloseIcon size={15} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="poster-cover-stage" onClick={startPlayback}>
            <img
              src={project.image}
              alt={`${project.category} frame preview`}
              className="poster-artwork"
              loading="lazy"
            />
            <div className="poster-gradient-scrim" />

            {/* Top Meta Badges (Strictly NO Names) */}
            <div className="card-top-meta">
              <span className="meta-badge category-badge">{project.category}</span>
              <span className="meta-badge aspect-badge">{project.aspect}</span>
            </div>

            {/* Centered Glowing Play Button with Concentric Waves */}
            <div className="center-play-trigger" title="Click to Play Video">
              <div className="play-ripple-waves" aria-hidden="true">
                <span className="wave-ring ring-1" />
                <span className="wave-ring ring-2" />
              </div>
              <div className="play-disc-btn">
                <PlayIcon size={26} />
              </div>
              <span className="play-prompt-label">Play Video</span>
            </div>

            {/* Bottom Meta Bar */}
            <div className="card-bottom-bar">
              <span className="duration-tag">
                <FilmIcon size={12} />
                <span>{project.duration}</span>
              </span>
              <button
                type="button"
                className="theater-expand-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTheater(project);
                }}
                title="Open in Cinema Mode"
              >
                <ExpandIcon size={13} />
                <span>Cinema</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

/* ---------- Fullscreen Cinema Modal Component ---------- */
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
    <div className="cinema-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className={`cinema-modal-stage ${project.shape}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.category} Cinema View`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cinema Header */}
        <div className="cinema-header-bar">
          <div className="cinema-tags-row">
            <span className="cinema-badge category">{project.category}</span>
            <span className="cinema-badge duration">{project.duration}</span>
            <span className="cinema-badge aspect">{project.aspect}</span>
          </div>

          <button
            ref={closeBtnRef}
            className="cinema-close-btn"
            onClick={onClose}
            aria-label="Close cinema mode"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Video Player Frame */}
        <div className={`cinema-video-screen ${project.shape}`}>
          <iframe
            src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=0&playsinline=1&title=0&byline=0&portrait=0&badge=0&autopause=0&dnt=1`}
            className="cinema-vimeo-iframe"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            title={`Cinema player ${project.id}`}
          />
        </div>

        {/* Cinema Footer & Navigation */}
        <div className="cinema-footer-bar">
          <div className="cinema-pager-group">
            <button
              type="button"
              className="cinema-pager-btn"
              onClick={() => onNavigate(prevProject)}
              aria-label="Previous video"
            >
              ← Previous
            </button>
            <span className="cinema-pager-counter">
              {currentIndex + 1} of {allProjects.length}
            </span>
            <button
              type="button"
              className="cinema-pager-btn"
              onClick={() => onNavigate(nextProject)}
              aria-label="Next video"
            >
              Next →
            </button>
          </div>

          <a
            href={`https://vimeo.com/${project.vimeoId}`}
            target="_blank"
            rel="noreferrer"
            className="cinema-direct-link"
          >
            <span>Open on Vimeo</span>
            <ExternalIcon size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Application Entrypoint ---------- */
export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("All Work");
  const [activeTheaterProject, setActiveTheaterProject] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 20 });

  // Mouse spotlight coordinates tracking
  useEffect(() => {
    let frameId;
    const handleMouseMove = (e) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        setMousePos({
          x: ((e.clientX / window.innerWidth) * 100).toFixed(1),
          y: ((e.clientY / window.innerHeight) * 100).toFixed(1),
        });
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

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
    <div
      className="app-root-cinema"
      style={{
        "--mouse-x": `${mousePos.x}%`,
        "--mouse-y": `${mousePos.y}%`,
      }}
    >
      {/* Ambient Atmospheric Background with Dynamic Mouse Spotlight */}
      <div className="ambient-background" aria-hidden="true">
        <div className="ambient-spot cyan" />
        <div className="ambient-spot purple" />
        <div className="ambient-interactive-spot" />
        <div className="grid-overlay" />
      </div>

      {/* Floating Glass Navigation Header */}
      <header className="site-nav-header">
        <div className="nav-container">
          <a href="#" className="nav-brand-lockup">
            <div className="nav-avatar-ring">
              <img
                src={PROFILE.avatar || `${import.meta.env.BASE_URL}avatar.png`}
                alt={PROFILE.name}
                className="nav-avatar-img"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className="nav-brand-text">
              <span className="nav-brand-name">{PROFILE.name}</span>
              <span className="nav-brand-role">Video Editor</span>
            </div>
            <div className="nav-status-pill">
              <span className="status-dot-pulse" />
              <span className="status-label">Available for Projects</span>
            </div>
          </a>

          {/* Desktop Links */}
          <nav className="nav-links-desktop" aria-label="Main Navigation">
            <a href="#work" className="nav-link">Selected Work</a>
            <a href="#stack" className="nav-link">Stack & Deliverables</a>
            <a href="#contact" className="nav-cta-pill">
              <span>Let's Talk</span>
              <span className="cta-arrow-dot">↗</span>
            </a>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`ham-bar ${mobileMenuOpen ? "open" : ""}`} />
            <span className={`ham-bar ${mobileMenuOpen ? "open" : ""}`} />
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <nav className="mobile-dropdown-menu" aria-label="Mobile Navigation">
            <a href="#work" onClick={() => setMobileMenuOpen(false)}>Selected Work</a>
            <a href="#stack" onClick={() => setMobileMenuOpen(false)}>Stack & Deliverables</a>
            <a href="#contact" className="mobile-dropdown-cta" onClick={() => setMobileMenuOpen(false)}>
              Start a Project ↗
            </a>
          </nav>
        )}
      </header>

      {/* ========================================================
          HERO SECTION: Pure, Minimalist, Cinematic Impact
          ======================================================== */}
      <section className="hero-cinema-section">
        <div className="hero-content-wrapper">
          {/* Sparkle Pill */}
          <div className="hero-badge-pill">
            <span className="beacon-sparkle">✦</span>
            <span>Commercial • Short-Form • Multi-Cam Systems</span>
          </div>

          <h1 className="hero-main-headline">
            <span className="headline-row">CRAFTING VISUAL RHYTHM.</span>
            <span className="headline-row">
              TURNING FOOTAGE INTO <span className="headline-gradient">ENGAGING STORIES.</span>
            </span>
          </h1>

          <p className="hero-subtext">
            Specializing in high-retention short-form Reels, documentary brand stories, and podcast video workflows. Calibrated for frame economy, pacing, and clean grade.
          </p>

          {/* Running Metric Counters with Frosted Glass Strip */}
          <div className="hero-stats-strip">
            {PROFILE.stats.map((s, idx) => (
              <div key={idx} className="hero-stat-card">
                <CountUpStat
                  target={s.target}
                  decimals={s.decimals}
                  suffix={s.suffix}
                />
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Primary Action Buttons */}
          <div className="hero-action-buttons">
            <a href="#work" className="btn-primary-action">
              <span>View Selected Work</span>
              <span className="btn-icon-circle">↓</span>
            </a>
            <a href="#contact" className="btn-secondary-action">
              <span>Start a Project</span>
              <ExternalIcon size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================
          KINETIC FILM TAPE / MARQUEE TICKER
          ======================================================== */}
      <div className="marquee-banner-container" aria-hidden="true">
        <div className="marquee-track">
          <div className="marquee-content">
            {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((item, idx) => (
              <span key={idx} className="marquee-item">
                <span className="marquee-sparkle">✦</span>
                <span>{item}</span>
              </span>
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((item, idx) => (
              <span key={`clone-${idx}`} className="marquee-item">
                <span className="marquee-sparkle">✦</span>
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          SELECTED WORK SECTION: High-Definition Video Grid
          ======================================================== */}
      <section className="work-cinema-section" id="work">
        <div className="section-header-row">
          <div className="section-title-lockup">
            <div className="section-eyebrow-box">
              <span className="live-dot" />
              <span className="section-eyebrow">Curated Film Vault</span>
            </div>
            <h2 className="section-heading">Selected Work</h2>
            <p className="section-subheading">
              Tap any video to play directly with sound, or expand to cinema theater.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="category-filter-bar" role="tablist" aria-label="Filter portfolio projects">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-filter-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
                role="tab"
                aria-selected={selectedCategory === cat}
              >
                <span>{cat}</span>
                <span className="cat-count">{categoryCounts[cat] || 0}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="video-cinema-grid">
          {filteredProjects.map((project) => (
            <VideoCard
              key={project.id}
              project={project}
              onOpenTheater={setActiveTheaterProject}
            />
          ))}
        </div>
      </section>

      {/* ========================================================
          STACK & PRODUCTION STANDARDS SECTION
          ======================================================== */}
      <section className="stack-standards-section" id="stack">
        <div className="stack-card-container">
          <div className="stack-column">
            <div className="stack-header-box">
              <span className="section-eyebrow">Software Suite</span>
              <h3 className="stack-column-title">Production Tools</h3>
            </div>
            <div className="tools-badge-cloud">
              {TOOLS.map((t) => (
                <div key={t} className="tool-chip">
                  <span className="tool-dot" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="standards-column">
            <div className="stack-header-box">
              <span className="section-eyebrow">Delivery Standards</span>
              <h3 className="stack-column-title">What Every Project Includes</h3>
            </div>
            <div className="standards-list">
              <div className="standard-item">
                <span className="standard-check">✓</span>
                <div className="standard-info">
                  <strong>48-Hour First Cut Turnaround</strong>
                  <span>Fast rough cuts so your production schedule never stalls.</span>
                </div>
              </div>
              <div className="standard-item">
                <span className="standard-check">✓</span>
                <div className="standard-info">
                  <strong>Multi-Format Master Deliveries</strong>
                  <span>Full 4K ProRes & H.264 exports formatted for 9:16 and 16:9.</span>
                </div>
              </div>
              <div className="standard-item">
                <span className="standard-check">✓</span>
                <div className="standard-info">
                  <strong>DaVinci Resolve Color & Sound Polish</strong>
                  <span>Natural skin tones, film emulation, and layered SFX sound design.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CONTACT / INQUIRY SECTION
          ======================================================== */}
      <section className="contact-cinema-section" id="contact">
        <div className="contact-card-box">
          <div className="contact-ambient-shimmer" />

          <div className="contact-header-text">
            <span className="section-eyebrow">Work Together</span>
            <h2 className="contact-main-heading">Ready To Elevate Your Content?</h2>
            <p className="contact-lead-text">
              Have raw footage or an upcoming product campaign? Let's discuss scope, references, and delivery timelines.
            </p>
          </div>

          <div className="contact-interactive-actions">
            {/* 1-Click Copy Email Pill */}
            <button
              type="button"
              className="copy-email-cinema-btn"
              onClick={copyEmailToClipboard}
              title="Click to copy email address"
            >
              <span className="email-addr-text">{PROFILE.email}</span>
              <span className={`copy-state-pill ${copiedEmail ? "copied" : ""}`}>
                {copiedEmail ? (
                  <>
                    <CheckIcon size={14} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon size={14} />
                    <span>Copy Email</span>
                  </>
                )}
              </span>
            </button>

            {/* Direct Mailto Button */}
            <a
              href={`mailto:${PROFILE.email}?subject=Video%20Editing%20Project%20Inquiry`}
              className="send-email-cinema-btn"
            >
              <span>Compose Email</span>
              <ExternalIcon size={15} />
            </a>
          </div>

          {/* Social Links */}
          <div className="contact-socials-row">
            {PROFILE.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="social-cinema-link"
              >
                <span>{s.label}</span>
                <ExternalIcon size={12} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          FOOTER
          ======================================================== */}
      <footer className="cinema-footer">
        <div className="footer-container">
          <div className="footer-left">
            <span className="footer-brand">{PROFILE.name}</span>
            <span className="footer-separator">•</span>
            <span className="footer-sub">{PROFILE.title}</span>
          </div>
          <div className="footer-right">
            <span>© {new Date().getFullYear()} • High-Retention Video Editing</span>
          </div>
        </div>
      </footer>

      {/* Cinema Theater Modal (if active) */}
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
