import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apartments, t } from "./data";

export default function ApartmentPage({ lang }) {
  const { slug } = useParams();
  const tr = t[lang];
  const apt = apartments.find(a => a.slug === slug);
  const [activeImg, setActiveImg] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", checkin: "", checkout: "", guests: "1", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!apt) {
    return (
      <div className="apt-page-not-found">
        <h2>Apartamentul nu a fost găsit</h2>
        <Link to="/" className="btn-primary">Înapoi</Link>
      </div>
    );
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSend = () => {
    if (!form.name || !form.email || !form.checkin || !form.checkout) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", phone: "", checkin: "", checkout: "", guests: "1", message: "" });
    }, 3500);
  };

  return (
    <div className="apt-page">
      {/* Back link */}
      <div className="apt-page-back-wrap">
        <Link to="/#apartments" className="apt-page-back">
          <span className="apt-page-back-arrow">←</span> {tr.aptPage.back}
        </Link>
      </div>

      {/* Gallery */}
      <section className="apt-gallery">
        <div className="apt-gallery-main">
          <img
            src={apt.images[activeImg]}
            alt={apt.name[lang]}
            className="apt-gallery-main-img"
          />
          {apt.popular && <div className="apt-gallery-popular">{tr.card.popular}</div>}
        </div>
        <div className="apt-gallery-thumbs">
          {apt.images.map((img, i) => (
            <button
              key={i}
              className={`apt-gallery-thumb${i === activeImg ? " active" : ""}`}
              onClick={() => setActiveImg(i)}
            >
              <img src={img} alt={`${apt.name[lang]} ${i + 1}`} />
            </button>
          ))}
        </div>
      </section>

      {/* Content grid */}
      <section className="apt-detail-grid">
        {/* Left: info */}
        <div className="apt-detail-info">
          <h1 className="apt-detail-title">{apt.name[lang]}</h1>

          {/* Quick stats */}
          <div className="apt-detail-stats">
            <div className="apt-detail-stat">
              <span className="apt-detail-stat-label">{tr.aptPage.surface}</span>
              <span className="apt-detail-stat-value">{apt.sqm} {tr.card.sqm}</span>
            </div>
            <div className="apt-detail-stat">
              <span className="apt-detail-stat-label">{tr.aptPage.floor}</span>
              <span className="apt-detail-stat-value">{apt.floor}</span>
            </div>
            <div className="apt-detail-stat">
              <span className="apt-detail-stat-label">{tr.aptPage.guests}</span>
              <span className="apt-detail-stat-value">{apt.maxGuests}</span>
            </div>
            <div className="apt-detail-stat">
              <span className="apt-detail-stat-label">{tr.aptPage.priceFrom}</span>
              <span className="apt-detail-stat-value apt-detail-stat-price">€{apt.price}<small>{tr.aptPage.perNight}</small></span>
            </div>
          </div>

          {/* Description */}
          <div className="apt-detail-section">
            <h2 className="apt-detail-section-title">{tr.aptPage.description}</h2>
            <p className="apt-detail-desc">{apt.description[lang]}</p>
          </div>

          {/* Amenities */}
          <div className="apt-detail-section">
            <h2 className="apt-detail-section-title">{tr.aptPage.amenities}</h2>
            <div className="apt-detail-tags">
              {apt.tags.map(tag => (
                <span key={tag} className="apt-detail-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: reservation form */}
        <div className="apt-detail-booking">
          <div className="apt-booking-card">
            <div className="apt-booking-header">
              <div className="apt-booking-price">
                <span className="apt-booking-price-label">{tr.aptPage.priceFrom}</span>
                <span className="apt-booking-price-value">€{apt.price}</span>
                <span className="apt-booking-price-night">{tr.aptPage.perNight}</span>
              </div>
            </div>

            {sent ? (
              <div className="apt-booking-success">
                <div className="apt-booking-success-icon">✓</div>
                <h3>{tr.modal.success}</h3>
                <p>{tr.modal.successSub}</p>
              </div>
            ) : (
              <>
                <div className="apt-booking-fields">
                  <div className="apt-booking-field full">
                    <label>{tr.modal.name}</label>
                    <input type="text" value={form.name} onChange={set("name")} />
                  </div>
                  <div className="apt-booking-field full">
                    <label>{tr.modal.email}</label>
                    <input type="email" value={form.email} onChange={set("email")} />
                  </div>
                  <div className="apt-booking-field full">
                    <label>{tr.modal.phone}</label>
                    <input type="tel" value={form.phone} onChange={set("phone")} />
                  </div>
                  <div className="apt-booking-field half">
                    <label>{tr.modal.checkin}</label>
                    <input type="date" value={form.checkin} onChange={set("checkin")} />
                  </div>
                  <div className="apt-booking-field half">
                    <label>{tr.modal.checkout}</label>
                    <input type="date" value={form.checkout} onChange={set("checkout")} />
                  </div>
                  <div className="apt-booking-field full">
                    <label>{tr.modal.guests}</label>
                    <input type="number" min="1" max={apt.maxGuests} value={form.guests} onChange={set("guests")} />
                  </div>
                  <div className="apt-booking-field full">
                    <label>{tr.modal.message}</label>
                    <textarea rows={3} value={form.message} onChange={set("message")} />
                  </div>
                </div>
                <button className="apt-booking-btn" onClick={handleSend}>
                  {tr.aptPage.bookThis}
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
