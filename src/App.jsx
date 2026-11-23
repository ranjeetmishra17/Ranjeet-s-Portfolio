import { useState, useEffect, useRef, useMemo } from "react";
import {
  PROFILE,
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

const ArrowDown = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
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
      tabIndex={0}
      aria-label={`${project.category} reel, duration ${project.duration}`}
    >
      <div className="card-stage-ratio">
        {isPlaying ? (
          <div className="player-viewport">
            {isLoading && (
              <div className="player-shimmer-loader" aria-hidden="true">
                <span className="loader-pulse-dot" />
                <span className="loader-mono-label">INITIALIZING STREAM</span>
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

            {/* Top Slates / Meta Tags (NO Names) */}
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
              <span className="play-glass-label">WATCH</span>
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

/* ---------- Main Editorial Portfolio ---------- */
export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("All Work");
  const [activeTheaterProject, setActiveTheaterProject] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="portfolio-editorial-root">
      {/* Background Architectural Canvas & Subtle Ambient Texture */}
      <div className="canvas-atmosphere" aria-hidden="true">
        <div className="ambient-radial-glow top" />
        <div className="ambient-radial-glow bottom" />
        <div className="hairline-grid" />
      </div>

      {/* Floating Minimalist Header */}
      <header className="editorial-nav-header">
        <div className="nav-inner-container">
          <a href="#" className="nav-signature">
            <div className="avatar-dot-wrap">
              <img
                src={PROFILE.avatar || `${import.meta.env.BASE_URL}avatar.png`}
                alt={PROFILE.name}
                className="nav-avatar-circle"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className="signature-info">
              <span className="signature-name">{PROFILE.name}</span>
              <span className="signature-sub">Film & Video Editor</span>
            </div>
          </a>

          {/* Availability Beacon Pill */}
          <div className="nav-availability-chip">
            <span className="beacon-emerald-dot" />
            <span className="beacon-text-mono">AVAILABLE FOR SELECT COMMISSIONS</span>
          </div>

          {/* Desktop Links */}
          <nav className="nav-links-wrap" aria-label="Main Navigation">
            <a href="#work" className="nav-link-anchor">Repertoire</a>
            <a href="#stack" className="nav-link-anchor">Specifications</a>
            <a href="#contact" className="nav-contact-button">
              <span>Initiate Project</span>
              <ArrowUpRight size={13} />
            </a>
          </nav>

          {/* Mobile Menu Button */}
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

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <nav className="mobile-curtain-menu" aria-label="Mobile Navigation">
            <a href="#work" onClick={() => setMobileMenuOpen(false)}>Repertoire ({PROJECTS.length})</a>
            <a href="#stack" onClick={() => setMobileMenuOpen(false)}>Specifications & Tools</a>
            <a href="#contact" className="mobile-curtain-cta" onClick={() => setMobileMenuOpen(false)}>
              Initiate Project ↗
            </a>
          </nav>
        )}
      </header>

      {/* ========================================================
          HERO SECTION: Monumental Typography & High-Fashion Layout
          ======================================================== */}
      <section className="editorial-hero-section">
        <div className="hero-monument-box">
          <div className="hero-metadata-line">
            <span className="meta-pill-outline">MUMBAI, IN [IST]</span>
            <span className="meta-divider">•</span>
            <span className="meta-text-muted">COMMERCIAL • SHORT-FORM • PODCAST SYSTEMS</span>
          </div>

          <h1 className="hero-editorial-headline">
            <span className="headline-block">RHYTHM & FORM.</span>
            <span className="headline-block serif-italic">
              Editing with Purpose.
            </span>
          </h1>

          <p className="hero-editorial-lead">
            Specializing in high-retention short-form Reels, documentary founder films, and multi-cam podcast workflows. Built on frame economy, calibrated sound architecture, and organic DaVinci color grading.
          </p>

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

          {/* Action Links */}
          <div className="hero-action-row">
            <a href="#work" className="action-pill-primary">
              <span>View Selected Work</span>
              <span className="pill-arrow-circle">
                <ArrowDown size={13} />
              </span>
            </a>
            <a href="#contact" className="action-pill-secondary">
              <span>Initiate Inquiry</span>
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================
          SELECTED WORK SECTION: Gallery of Films & Reels
          ======================================================== */}
      <section className="editorial-work-section" id="work">
        <div className="work-section-header">
          <div className="work-title-wrap">
            <span className="work-eyebrow-mono">INDEX OF WORKS (2024—2025)</span>
            <h2 className="work-display-heading">Selected Repertoire</h2>
          </div>

          {/* Minimalist Filter Tabs */}
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

        {/* Video Grid */}
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
      </section>

      {/* ========================================================
          SPECIFICATIONS & TOOLS SECTION
          ======================================================== */}
      <section className="editorial-spec-section" id="stack">
        <div className="spec-sheet-container">
          <div className="spec-sheet-header">
            <span className="work-eyebrow-mono">STUDIO SPECIFICATIONS</span>
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
                    <p>Rapid assembly and story locking so your publishing pipeline never stalls.</p>
                  </div>
                </li>
                <li>
                  <span className="benchmark-idx">02</span>
                  <div className="benchmark-body">
                    <strong>Lossless Multi-Format Masters</strong>
                    <p>Full 4K ProRes 422 & optimized H.264 exports formatted for 9:16 and 16:9.</p>
                  </div>
                </li>
                <li>
                  <span className="benchmark-idx">03</span>
                  <div className="benchmark-body">
                    <strong>DaVinci Resolve Grade & Sound Design</strong>
                    <p>Skin tone preservation, film emulation curves, and layered SFX dynamics.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CONTACT & INQUIRY SECTION
          ======================================================== */}
      <section className="editorial-contact-section" id="contact">
        <div className="contact-editorial-frame">
          <span className="work-eyebrow-mono">COMMISSIONS & COLLABORATIONS</span>
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

      {/* ========================================================
          FOOTER
          ======================================================== */}
      <footer className="editorial-footer">
        <div className="footer-wrap">
          <div className="footer-credits">
            <span className="footer-name">{PROFILE.name}</span>
            <span className="footer-sep">/</span>
            <span className="footer-role">Video Editor & Motion Designer</span>
          </div>
          <div className="footer-stamp">
            <span>© {new Date().getFullYear()} ALL RIGHTS RESERVED</span>
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
