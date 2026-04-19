import { useState, useEffect, useRef, useCallback } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import heroImg from "./assets/hero.png";
import { t, apartments } from "./data";
import ApartmentPage from "./ApartmentPage";
import "./App.css";

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function ApartmentCard({ apt, lang, tr, delay }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`apt-card reveal reveal-delay-${delay}`}>
      <Link to={`/apartament/${apt.slug}`} className="apt-card-link">
        <div className="apt-card-img-wrap">
          <img className="apt-card-img" src={apt.img} alt={apt.name[lang]} loading="lazy" />
          <div className="apt-card-gradient" />
          <div className="apt-card-price">
            {tr.from} <strong>€{apt.price}</strong>
            <span className="night">{tr.night}</span>
          </div>
          {apt.popular && <div className="apt-card-popular">{tr.popular}</div>}
          <div className="apt-card-info">
            {tr.floor} {apt.floor} &nbsp;·&nbsp; {apt.sqm} {tr.sqm} &nbsp;·&nbsp; {apt.maxGuests} {tr.guests}
          </div>
        </div>
        <div className="apt-card-body">
          <h3 className="apt-card-name">{apt.name[lang]}</h3>
          <div className="apt-card-tags">
            {apt.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
          <span className="apt-card-btn">{tr.details}</span>
        </div>
      </Link>
    </div>
  );
}

function HomePage({ lang, tr }) {
  const featuresRef = useReveal();
  const sectionRef = useReveal();
  const contactRef = useReveal();
  const location = useLocation();

  // Handle hash scrolling on navigation
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location]);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${heroImg})` }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-tag">{tr.hero.tag}</p>
          <h2 className="hero-heading">{tr.hero.heading}</h2>
          <p className="hero-sub">{tr.hero.sub}</p>
          <div className="hero-buttons">
            <a href="#apartments" className="btn-primary">{tr.hero.cta}</a>
            <a href="#contact" className="btn-outline">{tr.nav.contact}</a>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-line" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-strip">
        <div ref={featuresRef} className="features-grid reveal">
          {tr.features.map((f, i) => (
            <div key={i} className="feature-item">
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION HEADER */}
      <div ref={sectionRef} className="section-header reveal">
        <p className="section-label">{tr.sectionLabel}</p>
        <h2 className="section-title">{tr.section}</h2>
        <p className="section-sub">{tr.sectionSub}</p>
        <div className="section-divider">
          <div className="section-divider-line" />
          <div className="section-divider-dot" />
          <div className="section-divider-line" />
        </div>
      </div>

      {/* APARTMENTS */}
      <section id="apartments" className="apartments-section">
        <div className="apartments-grid">
          {apartments.map((apt, i) => (
            <ApartmentCard
              key={apt.id}
              apt={apt}
              lang={lang}
              tr={tr.card}
              delay={Math.min((i % 3) + 1, 4)}
            />
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <div className="contact-circle-1" />
        <div className="contact-circle-2" />
        <div ref={contactRef} className="contact-inner reveal">
          <p className="contact-label">{tr.contact.label}</p>
          <h2 className="contact-heading">{tr.contact.heading}</h2>
          <p className="contact-sub">{tr.contact.sub}</p>
          <div className="contact-cards">
            {[
              { icon: "📞", label: "+40 740 000 000", href: "tel:+40740000000" },
              { icon: "✉️", label: "contact@casadinticau.ro", href: "mailto:contact@casadinticau.ro" },
              { icon: "📍", label: tr.contact.addr, href: "#" },
            ].map(({ icon, label, href }) => (
              <a key={label} href={href} className="contact-card">
                <span className="contact-card-icon">{icon}</span>
                <span>{label}</span>
              </a>
            ))}
          </div>
          <div className="contact-divider" />
          <p className="contact-copy">{tr.contact.copy}</p>
        </div>
      </section>
    </>
  );
}

export default function App() {
  const [lang, setLang] = useState("ro");
  const tr = t[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      {/* NAV */}
      <nav className={`site-nav${scrolled ? " scrolled" : ""}`}>
        <Link to="/" className="nav-logo">{tr.nav.title}</Link>
        <div className="nav-links">
          {isHome ? (
            <>
              <a href="#apartments" className="nav-link">{tr.nav.apts}</a>
              <a href="#contact" className="nav-link">{tr.nav.contact}</a>
            </>
          ) : (
            <>
              <Link to="/#apartments" className="nav-link">{tr.nav.apts}</Link>
              <Link to="/#contact" className="nav-link">{tr.nav.contact}</Link>
            </>
          )}
          <button className="lang-btn" onClick={() => setLang(l => l === "ro" ? "en" : "ro")}>
            {tr.nav.lang}
          </button>
        </div>
        <button
          className={`hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {isHome ? (
          <>
            <a href="#apartments" onClick={handleNavClick}>{tr.nav.apts}</a>
            <a href="#contact" onClick={handleNavClick}>{tr.nav.contact}</a>
          </>
        ) : (
          <>
            <Link to="/#apartments" onClick={handleNavClick}>{tr.nav.apts}</Link>
            <Link to="/#contact" onClick={handleNavClick}>{tr.nav.contact}</Link>
          </>
        )}
        <button className="lang-btn" onClick={() => { setLang(l => l === "ro" ? "en" : "ro"); setMenuOpen(false); }}>
          {tr.nav.lang}
        </button>
      </div>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<HomePage lang={lang} tr={tr} />} />
        <Route path="/apartament/:slug" element={<ApartmentPage lang={lang} />} />
      </Routes>
    </>
  );
}
