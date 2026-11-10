import { useState, useEffect, useMemo, useRef } from "react";
import {
  PROFILE,
  SERVICES,
  WORKFLOW,
  TOOLS,
  CATEGORIES,
  PROJECTS,
} from "./data.js";

/* ---------- Icons ---------- */
const PlayIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.14v13.72a1 1 0 001.52.85l11-6.86a1 1 0 000-1.7l-11-6.86A1 1 0 008 5.14z" />
  </svg>
);

const ArrowUpRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M7 7h10v10" />
  </svg>
);

const CloseIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ---------- Running Animated Stat Counter ---------- */
function CountUpStat({ target, decimals = 0, suffix = "", fallback = "" }) {
  const [displayValue, setDisplayValue] = useState(
    (0).toFixed(decimals) + suffix
  );
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const runCounter = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const duration = 2000; // 2s smooth running animation
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out expo for natural deceleration
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = target * ease;

        setDisplayValue(currentVal.toFixed(decimals) + suffix);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setDisplayValue(target.toFixed(decimals) + suffix);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          runCounter();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    // Initial kick-off fallback
    const timer = setTimeout(runCounter, 250);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [target, decimals, suffix]);

  return (
    <span ref={ref} className="stat-number tabular-nums">
      {displayValue}
    </span>
  );
}

/* ---------- Left Column: 40% Editorial Panel (Desktop) ---------- */
const DESKTOP_TABS = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "workflow", label: "Workflow" },
  { id: "tools", label: "Tools" },
  { id: "contact", label: "Contact" },
];

/* ---------- Root Shell with Unified Desktop/Mobile Responsive System ---------- */
export default function App() {
  const [activeProject, setActiveProject] = useState(null);
  const [desktopTab, setDesktopTab] = useState("about");
  const [mobileSection, setMobileSection] = useState("work"); // "work" | "about" | "contact"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuTab, setMobileMenuTab] = useState("contact"); // "contact" | "services"
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(PROFILE.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  useEffect(() => {
    if (mobileMenuOpen || activeProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, activeProject]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setActiveProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return PROJECTS;
    return PROJECTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts = { All: PROJECTS.length };
    PROJECTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="portfolio-wrapper">
      {/* ========================================================
          MOBILE TOP NAVBAR (Only for Mobile View <= 1024px)
          ======================================================== */}
      <header className="mobile-top-navbar" aria-label="Mobile Navigation">
        <div className="mobile-nav-brand">
          <span className="mobile-nav-name">{PROFILE.name}</span>
          <span className="mobile-nav-role-bullet">•</span>
          <span className="mobile-nav-role">{PROFILE.title}</span>
        </div>

        <button
          className="mobile-hamburger-btn"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open contact and menu"}
          aria-expanded={mobileMenuOpen}
        >
          <span className="ham-menu-text">Menu</span>
          <span className="ham-equal-icon" aria-hidden="true">
            <span className="ham-line" />
            <span className="ham-line" />
          </span>
        </button>
      </header>

      {/* ========================================================
          LEFT COLUMN: 40% TEXT (Desktop Sticky / Mobile Top)
          ======================================================== */}
      <aside className="text-column" aria-label="Profile and information">
        <div className="column-inner">
          {/* Brand Header / Pure Hero Section */}
          <header className="brand-header hero-section">
            {/* Live Availability Badge */}
            <div className="hero-availability-badge">
              <span className="beacon-dot" aria-hidden="true" />
              <span className="beacon-text">Available for Q2 Projects</span>
            </div>

            {/* Identity Bar with Vector Art Avatar */}
            <div className="profile-identity-bar">
              <div className="avatar-frame" title={`${PROFILE.name} — Face Vector Art`}>
                <img
                  src={PROFILE.avatar || `${import.meta.env.BASE_URL}Ranjeet Vector.png`}
                  alt={`${PROFILE.name} vector portrait`}
                  className="avatar-img"
                  onError={(e) => {
                    const fallback = `${import.meta.env.BASE_URL}avatar.png`;
                    if (!e.currentTarget.src.includes("avatar.png")) {
                      e.currentTarget.src = fallback;
                    } else {
                      e.currentTarget.style.display = "none";
                    }
                  }}
                />
              </div>

              <div className="identity-text-col">
                <span className="brand-name">{PROFILE.name}</span>
                <span className="brand-role">{PROFILE.title}</span>
              </div>
            </div>

            <h1 className="hero-statement">
              <span className="hero-statement-line">Editing with purpose.</span>
              <span className="hero-statement-line">
                Exploring <span className="hero-art-of">art of</span>{" "}
                <span className="hero-highlight-pill">
                  <span className="pill-dot" aria-hidden="true">✦</span> motion.
                </span>
              </span>
            </h1>

            <p className="hero-intro">{PROFILE.bio}</p>

            {/* Stats Strip with Running Numbers */}
            <div className="stats-strip">
              {PROFILE.stats.map((s, idx) => (
                <div key={idx} className="stat-item">
                  <CountUpStat
                    target={s.target}
                    decimals={s.decimals}
                    suffix={s.suffix}
                    fallback={s.value}
                  />
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Dual Pill Call-to-Actions */}
            <div className="mobile-hero-actions">
              <a href="#work" className="mobile-hero-btn primary">
                <span>View Selected Work</span>
                <span className="hero-btn-arrow down" aria-hidden="true">↓</span>
              </a>
              <button
                type="button"
                className="mobile-hero-btn secondary"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span>Get in Touch</span>
                <span className="hero-btn-arrow up-right" aria-hidden="true">↗</span>
              </button>
            </div>
          </header>

          {/* ---------- DESKTOP ONLY: Navigation Tabs & Panes ---------- */}
          <div className="desktop-only-content">
            <nav className="tab-navigation" aria-label="Sections">
              {DESKTOP_TABS.map((t) => (
                <button
                  key={t.id}
                  className={`nav-tab-button ${desktopTab === t.id ? "active" : ""}`}
                  onClick={() => setDesktopTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            <div className="tab-body-container">
              {desktopTab === "about" && (
                <div className="tab-pane-content fade-in">
                  <p className="body-text">
                    Good editing is felt before it is noticed. Every cut is an intentional choice about pace, attention, and narrative weight.
                  </p>
                  <p className="body-text">
                    I collaborate directly with founders, marketing teams, and creators to transform raw footage into focused video assets that keep viewers engaged to the end.
                  </p>
                </div>
              )}

              {desktopTab === "services" && (
                <div className="tab-pane-content fade-in">
                  <div className="service-list">
                    {SERVICES.map((s) => (
                      <div key={s.num} className="service-item">
                        <span className="item-number">{s.num}</span>
                        <div className="item-info">
                          <h3 className="item-title">{s.title}</h3>
                          <p className="item-desc">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {desktopTab === "workflow" && (
                <div className="tab-pane-content fade-in">
                  <div className="workflow-list">
                    {WORKFLOW.map((w) => (
                      <div key={w.step} className="workflow-item">
                        <span className="item-number">{w.step}</span>
                        <div className="item-info">
                          <h3 className="item-title">{w.title}</h3>
                          <p className="item-desc">{w.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {desktopTab === "tools" && (
                <div className="tab-pane-content fade-in">
                  <p className="body-text">
                    Software calibrated for story assembly, color grading, and kinetic motion:
                  </p>
                  <div className="tools-cloud">
                    {TOOLS.map((tool) => (
                      <span key={tool} className="tool-tag">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {desktopTab === "contact" && (
                <div className="tab-pane-content fade-in">
                  <p className="body-text">
                    Have raw footage or an upcoming product launch? Let's discuss your timeline and scope.
                  </p>

                  <div className="contact-action-wrap">
                    <button
                      type="button"
                      className="copy-email-btn"
                      onClick={copyEmail}
                      aria-label="Copy email address"
                    >
                      <span className="email-label">{PROFILE.email}</span>
                      <span className="copy-badge">
                        {copied ? (
                          <>
                            <CheckIcon /> Copied
                          </>
                        ) : (
                          "Click to Copy"
                        )}
                      </span>
                    </button>

                    <a href={`mailto:${PROFILE.email}`} className="primary-email-btn">
                      <span>Send an Email</span>
                      <ArrowUpRight size={15} />
                    </a>
                  </div>

                  <div className="socials-list">
                    {PROFILE.socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="social-pill"
                      >
                        <span>{s.label}</span>
                        <ArrowUpRight size={12} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <footer className="column-footer">
              <span className="footer-copyright">
                © {new Date().getFullYear()} {PROFILE.name} • {PROFILE.title}
              </span>
            </footer>
          </div>

          {/* ---------- MOBILE ONLY: Segmented Selector (Work / About / Contact) ---------- */}
          <div className="mobile-only-segmented-bar" role="tablist" aria-label="Mobile sections">
            <button
              className={`mobile-seg-btn ${mobileSection === "work" ? "active" : ""}`}
              onClick={() => setMobileSection("work")}
              role="tab"
              aria-selected={mobileSection === "work"}
            >
              Selected Work ({PROJECTS.length})
            </button>
            <button
              className={`mobile-seg-btn ${mobileSection === "about" ? "active" : ""}`}
              onClick={() => setMobileSection("about")}
              role="tab"
              aria-selected={mobileSection === "about"}
            >
              Services & Tools
            </button>
            <button
              className={`mobile-seg-btn ${mobileSection === "contact" ? "active" : ""}`}
              onClick={() => setMobileSection("contact")}
              role="tab"
              aria-selected={mobileSection === "contact"}
            >
              Contact
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================
          RIGHT COLUMN: 60% WORK GALLERY (or Mobile Tab View)
          ======================================================== */}
      <main className="work-column" id="work" aria-label="Portfolio Content">
        {/* If Mobile Section is "work" OR viewing on Desktop, show Work Gallery */}
        <div className={`gallery-container-wrapper ${mobileSection !== "work" ? "mobile-hidden" : ""}`}>
          <div className="work-header">
            <div className="header-title-box">
              <h2 className="section-title">Selected Work</h2>
              <span className="project-tally">({filteredProjects.length})</span>
            </div>

            <div className="category-filters" role="group" aria-label="Filter projects">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span className="pill-text">{cat}</span>
                  {categoryCounts[cat] !== undefined && (
                    <span className="pill-count-badge">{categoryCounts[cat]}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="gallery-masonry">
            {filteredProjects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onClick={setActiveProject}
              />
            ))}
          </div>
        </div>

        {/* MOBILE ONLY: "about" / Capabilities View */}
        <div className={`mobile-tab-view ${mobileSection === "about" ? "active" : ""}`}>
          <div className="mobile-section-block">
            <h2 className="mobile-block-title">Core Disciplines</h2>
            <div className="service-list">
              {SERVICES.map((s) => (
                <div key={s.num} className="service-item">
                  <span className="item-number">{s.num}</span>
                  <div className="item-info">
                    <h3 className="item-title">{s.title}</h3>
                    <p className="item-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mobile-section-block">
            <h2 className="mobile-block-title">Editing Process</h2>
            <div className="workflow-list">
              {WORKFLOW.map((w) => (
                <div key={w.step} className="workflow-item">
                  <span className="item-number">{w.step}</span>
                  <div className="item-info">
                    <h3 className="item-title">{w.title}</h3>
                    <p className="item-desc">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mobile-section-block">
            <h2 className="mobile-block-title">Software Suite</h2>
            <div className="tools-cloud">
              {TOOLS.map((tool) => (
                <span key={tool} className="tool-tag">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* MOBILE ONLY: "contact" View */}
        <div className={`mobile-tab-view ${mobileSection === "contact" ? "active" : ""}`}>
          <div className="mobile-contact-card">
            <h2 className="mobile-block-title">Start a Project</h2>
            <p className="body-text">
              Have raw footage or an upcoming product campaign? Let's discuss your timeline, reference pace, and deliverables.
            </p>

            <div className="contact-action-wrap">
              <button
                type="button"
                className="copy-email-btn"
                onClick={copyEmail}
                aria-label="Copy email address"
              >
                <span className="email-label">{PROFILE.email}</span>
                <span className="copy-badge">
                  {copied ? (
                    <>
                      <CheckIcon /> Copied
                    </>
                  ) : (
                    "Tap to Copy"
                  )}
                </span>
              </button>

              <a href={`mailto:${PROFILE.email}`} className="primary-email-btn">
                <span>Compose Email</span>
                <ArrowUpRight size={15} />
              </a>
            </div>

            <div className="socials-list">
              {PROFILE.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="social-pill"
                >
                  <span>{s.label}</span>
                  <ArrowUpRight size={12} />
                </a>
              ))}
            </div>

            <p className="mobile-contact-sub">
              Open for select commissions and worldwide remote projects with 24h turnaround options.
            </p>
          </div>
        </div>

        {/* Mobile Closing Call-to-Action Section */}
        <section className="mobile-footer-cta-block" aria-label="Work with me">
          <div className="mobile-cta-card">
            <div className="mobile-cta-kicker-row">
              <span className="live-status-dot-mini" aria-hidden="true" />
              <span className="mobile-cta-kicker">Available for Q2 Commissions</span>
            </div>
            <h3 className="mobile-cta-heading">Have raw footage or an upcoming launch?</h3>
            <p className="mobile-cta-desc">
              Currently accepting commercial edits, founder stories, and podcast video retainers with 24h turnaround sprints.
            </p>

            <div className="mobile-cta-actions">
              <button
                type="button"
                className="mobile-cta-copy-btn"
                onClick={copyEmail}
                aria-label="Copy email address"
              >
                <span className="cta-email-label">{PROFILE.email}</span>
                <span className="cta-copy-badge">
                  {copied ? (
                    <>
                      <CheckIcon /> Copied
                    </>
                  ) : (
                    "Tap to Copy"
                  )}
                </span>
              </button>

              <a
                href={`mailto:${PROFILE.email}`}
                className="mobile-cta-send-btn"
              >
                <span>Send Email</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="mobile-footer-socials">
              {PROFILE.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mobile-footer-social-pill"
                >
                  <span>{s.label}</span>
                  <ArrowUpRight size={11} />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Clean Grounded Footer */}
        <footer className="work-footer">
          <span className="work-footer-note">
            Designed with intention • {PROFILE.name}
          </span>
          <button
            className="back-to-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll back to top"
          >
            Back to top ↑
          </button>
        </footer>
      </main>

      {/* Case Study Lightbox */}
      {activeProject && (
        <CaseStudyModal
          project={activeProject}
          allProjects={PROJECTS}
          onClose={() => setActiveProject(null)}
          onNavigate={setActiveProject}
        />
      )}

      {/* ========================================================
          MOBILE MENU DRAWER: CONTACT & ALL (Only for Mobile View)
          ======================================================== */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile contact and menu drawer"
        >
          <div
            className="mobile-drawer-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="drawer-header">
              <div className="drawer-identity">
                <div className="drawer-avatar">
                  <img
                    src={PROFILE.avatar || `${import.meta.env.BASE_URL}Ranjeet Vector.png`}
                    alt={PROFILE.name}
                    className="avatar-img"
                    onError={(e) => {
                      const fallback = `${import.meta.env.BASE_URL}avatar.png`;
                      if (!e.currentTarget.src.includes("avatar.png")) {
                        e.currentTarget.src = fallback;
                      } else {
                        e.currentTarget.style.display = "none";
                      }
                    }}
                  />
                </div>
                <div>
                  <h3 className="drawer-name">{PROFILE.name}</h3>
                  <span className="drawer-role">{PROFILE.title}</span>
                </div>
              </div>

              <button
                className="drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            {/* Drawer Tab Switcher: Contact vs Services */}
            <div className="drawer-tabs">
              <button
                className={`drawer-tab-btn ${mobileMenuTab === "contact" ? "active" : ""}`}
                onClick={() => setMobileMenuTab("contact")}
              >
                Contact & Inquiries
              </button>
              <button
                className={`drawer-tab-btn ${mobileMenuTab === "services" ? "active" : ""}`}
                onClick={() => setMobileMenuTab("services")}
              >
                Services & Skills
              </button>
            </div>

            {/* Drawer Content */}
            <div className="drawer-scroll-body">
              {mobileMenuTab === "contact" ? (
                <div className="drawer-contact-view">
                  <p className="drawer-lead">
                    Have raw footage or an upcoming product campaign? Let's discuss your timeline, reference pace, and deliverables.
                  </p>

                  <div className="drawer-email-box">
                    <span className="drawer-email-address">{PROFILE.email}</span>
                    <button
                      type="button"
                      className="drawer-copy-action"
                      onClick={copyEmail}
                      aria-label="Copy email address"
                    >
                      {copied ? (
                        <>
                          <CheckIcon /> Copied!
                        </>
                      ) : (
                        "Copy"
                      )}
                    </button>
                  </div>

                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="drawer-primary-cta"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Send an Email</span>
                    <ArrowUpRight size={15} />
                  </a>

                  <div className="drawer-socials-group">
                    <span className="drawer-socials-title">Direct Socials</span>
                    <div className="drawer-social-pills">
                      {PROFILE.socials.map((s) => (
                        <a
                          key={s.label}
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="social-pill"
                        >
                          <span>{s.label}</span>
                          <ArrowUpRight size={12} />
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="drawer-meta-list">
                    <div className="drawer-meta-item">
                      <span className="meta-item-label">Turnaround</span>
                      <span className="meta-item-value">24h Average First Cut</span>
                    </div>
                    <div className="drawer-meta-item">
                      <span className="meta-item-label">Location</span>
                      <span className="meta-item-value">Worldwide Remote</span>
                    </div>
                    <div className="drawer-meta-item">
                      <span className="meta-item-label">Projects</span>
                      <span className="meta-item-value">100+ Completed (1.5M+ Views)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="drawer-services-view">
                  <div className="drawer-services-list">
                    {SERVICES.map((s) => (
                      <div key={s.num} className="drawer-service-card">
                        <span className="service-number">{s.num}</span>
                        <div>
                          <h4 className="service-card-title">{s.title}</h4>
                          <p className="service-card-desc">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="drawer-tools-box">
                    <span className="drawer-socials-title">Software Suite</span>
                    <div className="tools-cloud">
                      {TOOLS.map((t) => (
                        <span key={t} className="tool-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Bottom Bar: Jump to Work */}
            <div className="drawer-footer-bar">
              <a
                href="#work"
                className="drawer-work-jump-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Browse Selected Work ({PROJECTS.length})</span>
                <span className="arrow-down">↓</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Project Card (Minimalist Video Slate, No Names) ---------- */
function ProjectCard({ project, onClick }) {
  return (
    <article
      className={`gallery-card ${project.shape}`}
      onClick={() => onClick(project)}
      tabIndex={0}
      role="button"
      aria-label={`${project.category} video, duration ${project.length}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(project);
        }
      }}
    >
      <div className="card-poster">
        <img
          src={project.image}
          alt={`${project.category} preview`}
          className="poster-img"
          loading="lazy"
        />
        <div className="poster-scrim" />

        <div className="poster-top-bar">
          <span className="poster-pill category-pill">{project.category}</span>
          <span className="poster-pill length-pill">{project.length}</span>
        </div>

        <div className="play-badge" aria-hidden="true">
          <PlayIcon size={22} />
        </div>
      </div>
    </article>
  );
}

/* ---------- Case Study Modal: Theater Video Player (No Names) ---------- */
function CaseStudyModal({ project, allProjects, onClose, onNavigate }) {
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(prevProject);
      if (e.key === "ArrowRight") onNavigate(nextProject);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [currentIndex, allProjects, onClose, onNavigate, prevProject, nextProject]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className={`modal-window theater-mode ${project.shape}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.category} video`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-sheet-handle" aria-hidden="true" />

        {/* Modal Top Bar */}
        <div className="modal-theater-header">
          <div className="modal-theater-tags">
            <span className="screen-tag category-tag">{project.category}</span>
            <span className="screen-tag length-tag">{project.length}</span>
            <span className="screen-tag aspect-tag">{project.aspect}</span>
          </div>

          <button
            ref={closeRef}
            className="modal-close-trigger"
            onClick={onClose}
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Video Player Stage */}
        <div className={`modal-player-wrapper ${project.shape}`}>
          <iframe
            src={`https://player.vimeo.com/video/${project.vimeoId}?h=${project.vimeoHash}&autoplay=1&title=0&byline=0&portrait=0&badge=0&autopause=0`}
            className="modal-vimeo-iframe"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Video player"
          />
        </div>

        {/* Pinned Sticky Bottom Action Bar */}
        <div className="modal-sticky-bottom-bar">
          <div className="modal-pager-controls">
            <button
              type="button"
              className="modal-pager-nav-btn"
              onClick={() => onNavigate(prevProject)}
              aria-label="Previous video"
            >
              ← Prev
            </button>
            <span className="modal-pager-counter">
              {currentIndex + 1} / {allProjects.length}
            </span>
            <button
              type="button"
              className="modal-pager-nav-btn"
              onClick={() => onNavigate(nextProject)}
              aria-label="Next video"
            >
              Next →
            </button>
          </div>

          <a
            href={project.vimeoUrl}
            target="_blank"
            rel="noreferrer"
            className="modal-sticky-watch-btn"
          >
            <span>Watch on Vimeo</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
