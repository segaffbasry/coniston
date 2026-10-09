"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui";
import { hero } from "@/lib/content";
import { getLenis } from "@/lib/scroll";

/* The whole showreel with sound, played in place behind "Watch the showreel" (the live site links its Vimeo player;
   that player is not reachable everywhere, so the reel is served from this site). A native <dialog>: it traps focus,
   closes on Esc and hands focus back to the button that opened it. Smooth scroll stops while it is open. */
export function FilmDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const d = dialog.current, v = video.current; if (!d || !v) return;
    if (open && !d.open) {
      wasOpen.current = true;
      d.showModal();
      getLenis()?.stop();
      if (!v.src) v.src = hero.film.full;
      v.currentTime = 0;
      v.play().catch(() => {});
    } else if (!open && wasOpen.current) {
      wasOpen.current = false;
      // Also reached after Esc, when the browser has already closed the dialog.
      v.pause();
      if (d.open) d.close();
      getLenis()?.start();
    }
  }, [open]);

  return (
    <dialog className="film-dialog" ref={dialog} aria-label="Coniston showreel" onClose={onClose}
      onClick={(e) => { if (e.target === dialog.current) onClose(); }}>
      <div className="film-dialog-frame">
        <video ref={video} controls playsInline preload="none" poster={hero.film.poster} />
        <button type="button" className="film-dialog-close" onClick={onClose} aria-label="Close the showreel"><Icon name="close" /></button>
      </div>
    </dialog>
  );
}
