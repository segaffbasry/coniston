import { Button, MoreLink, external } from "@/components/ui";
import { contact } from "@/lib/content";

/* The closing call from the live service pages, with the phone, email and both offices from /contact/. Its own
   section, kept apart from the footer. The live contact form is not rebuilt (it would not send); the button goes to
   the real contact page. */
export function Contact() {
  return (
    <section className="contact section on-dark" id="contact" data-tone="dark" aria-labelledby="contact-title" data-late>
      <div className="wrap contact-grid">
        <div>
          <h2 className="h2 contact-title" id="contact-title" data-reveal="head">{contact.title}</h2>
          <div data-reveal="label"><Button href={contact.cta.href} tone="white">{contact.cta.label}</Button></div>
        </div>
        <div className="contact-details" data-reveal="cards">
          <div className="contact-block">
            <a className="contact-big" href={contact.phone.href}>{contact.phone.label}</a>
            <a className="contact-big uline" href={contact.email.href}>{contact.email.label}</a>
          </div>
          {contact.offices.map((o) => (
            <div key={o.name} className="contact-block">
              <p className="contact-kind">{o.kind}</p>
              <p className="contact-office">{o.name}</p>
              <address>{o.lines.map((l) => <span key={l}>{l}</span>)}</address>
              {o.directions && <MoreLink href={o.directions} icon="out">Directions</MoreLink>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
