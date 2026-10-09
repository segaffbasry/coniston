import { Logo } from "@/components/Logo";
import { Icon, external } from "@/components/ui";
import { footer, menu } from "@/lib/content";

/* Links and company details only (the live footer's legal row, plus the menu's pages so the footer can be used to
   get anywhere). No scroll reveals here: they fire in the last pixels and read as a jump at the bottom. */
export function Footer() {
  const groups = menu.filter((m) => m.children);
  const singles = menu.filter((m) => !m.children && !m.href.startsWith("#"));
  return (
    <footer className="site-footer on-dark" data-tone="dark">
      <div className="wrap">
        <div className="footer-top">
          <a href="#top" className="footer-logo" aria-label="Coniston, back to the top"><Logo id="ft" title="" /></a>
          <nav className="footer-nav" aria-label="Footer">
            {groups.map((g) => (
              <div key={g.label}>
                <a className="footer-head" href={g.href} {...external(g.href)}>{g.label}</a>
                <ul>{g.children!.map((c) => <li key={c.href}><a className="uline" href={c.href} {...external(c.href)}>{c.label}</a></li>)}</ul>
              </div>
            ))}
            <div>
              <ul className="footer-singles">
                {singles.map((s) => <li key={s.href}><a className="footer-head" href={s.href} {...external(s.href)}>{s.label}</a></li>)}
              </ul>
            </div>
          </nav>
        </div>
        <div className="footer-bottom">
          <ul className="footer-legal">
            {footer.legal.map((l) => <li key={l.href}><a className="uline" href={l.href} {...external(l.href)}>{l.label}</a></li>)}
          </ul>
          <a className="footer-social" href={footer.linkedin} aria-label="Coniston on LinkedIn" {...external(footer.linkedin)}><Icon name="linkedin" /></a>
        </div>
      </div>
    </footer>
  );
}
