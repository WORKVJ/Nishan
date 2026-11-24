"use client";

import { useRef, useState } from "react";
import { gsap, SplitText, useGsap } from "@/lib/gsap";
import { contact } from "@/data/content";
import { Button, SectionLabel } from "./ui";
import Icon from "./Icon";

const fields = [
  { name: "name", label: "Your name", type: "text", required: true, autoComplete: "name" },
  { name: "company", label: "Band / production company", type: "text", autoComplete: "organization" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "phone", label: "Phone / WhatsApp", type: "tel", autoComplete: "tel" },
];

function buildMessage(d) {
  return [
    "🔥 *New Sound Engineering Inquiry*",
    "",
    `*Name:* ${d.name}`,
    d.company ? `*Band / Company:* ${d.company}` : null,
    `*Email:* ${d.email}`,
    d.phone ? `*Phone / WhatsApp:* ${d.phone}` : null,
    "",
    "*Project Requirements:*",
    d.message,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export default function Contact() {
  const root = useRef(null);
  const [data, setData] = useState({ name: "", company: "", email: "", phone: "", message: "" });
  const [sentUrl, setSentUrl] = useState("");

  useGsap(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        SplitText.create(".contact__title", {
          type: "chars,lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.chars, {
              yPercent: 120,
              rotate: 8,
              duration: 1.3,
              stagger: 0.025,
              ease: "expo.out",
              scrollTrigger: { trigger: ".contact__title", start: "top 85%", once: true },
            });
          },
        });
        gsap.from(".contact [data-fade]", {
          y: 50,
          opacity: 0,
          duration: 1.2,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: ".contact__grid", start: "top 80%" },
        });
      });
    },
    [],
    root
  );

  const update = (e) => setData((d) => ({ ...d, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const url = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(buildMessage(data))}`;
    setSentUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const channels = [
    { label: "WhatsApp", value: "Fastest response", href: contact.whatsappHref, icon: "whatsapp", external: true },
    { label: "Email", value: contact.email, href: contact.emailHref, icon: "mail" },
    { label: "Phone", value: contact.phone, href: contact.phoneHref, icon: "phone" },
    { label: "LinkedIn", value: "Professional profile", href: contact.linkedin, icon: "linkedin", external: true },
  ];

  return (
    <section id="contact" className="contact section" ref={root}>
      <div className="contact__glow" aria-hidden="true" />
      <div className="container">
        <SectionLabel index="08">Contact</SectionLabel>
        <h2 className="contact__title">
          Let&apos;s talk <em className="serif accent">sound.</em>
        </h2>
        <p className="contact__intro" data-fade>
          Planning a stadium show, festival production or tour — or looking for an AVID Venue S6L FOH / monitor
          engineer? Tell me about it and let&apos;s bring sonic excellence to your stage.
        </p>

        <div className="contact__grid">
          <form className="form" onSubmit={submit} data-fade>
            {sentUrl && (
              <div className="form__notice" role="status">
                <Icon name="check" size={18} strokeWidth={2.2} />
                <p>
                  <strong>Opening WhatsApp…</strong> Your details are pre-filled. If nothing opened,{" "}
                  <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="link">
                    send it from here
                  </a>
                  .
                </p>
              </div>
            )}

            <div className="form__grid">
              {fields.map((f) => (
                <div className="field" key={f.name}>
                  <input
                    id={`f-${f.name}`}
                    name={f.name}
                    type={f.type}
                    placeholder=" "
                    required={f.required}
                    autoComplete={f.autoComplete}
                    value={data[f.name]}
                    onChange={update}
                  />
                  <label htmlFor={`f-${f.name}`}>
                    {f.label}
                    {f.required && <span className="accent"> *</span>}
                  </label>
                  <span className="field__line" aria-hidden="true" />
                </div>
              ))}
              <div className="field field--full">
                <textarea
                  id="f-message"
                  name="message"
                  placeholder=" "
                  rows={4}
                  required
                  value={data.message}
                  onChange={update}
                />
                <label htmlFor="f-message">
                  Tell me about your tour, festival or sound requirements<span className="accent"> *</span>
                </label>
                <span className="field__line" aria-hidden="true" />
              </div>
            </div>

            <div className="form__foot">
              <p className="mono muted form__hint">Sends a pre-filled message on WhatsApp</p>
              <Button as="button" type="submit" icon="whatsapp">
                Send via WhatsApp
              </Button>
            </div>
          </form>

          <aside className="contact__aside">
            <ul className="channels">
              {channels.map((c) => (
                <li key={c.label} data-fade>
                  <a
                    className="channel"
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <span className="channel__icon">
                      <Icon name={c.icon} size={20} />
                    </span>
                    <span className="channel__text">
                      <span className="mono channel__label">{c.label}</span>
                      <span className="channel__value">{c.value}</span>
                    </span>
                    <span className="channel__arrow">
                      <Icon name="arrowUpRight" size={18} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="availability" data-fade>
              <p className="mono">
                <span className="status__dot" aria-hidden="true" /> Available for bookings
              </p>
              <p>India, UAE &amp; international tours</p>
              <p className="muted">
                <Icon name="pin" size={14} /> {contact.location}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
