import type { CSSProperties, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { photoUrl } from "../lib/photos";
import "./ui.css";

type PhotoProps = {
  name: string;
  /** Used when `name` hasn't been generated yet (e.g. an existing workspace shot). */
  fallbackName?: string;
  alt?: string;
  className?: string;
  position?: string;
  eager?: boolean;
  /** Rendered when no image exists — a designed placeholder, never a broken image. */
  children?: ReactNode;
};

export function Photo({ name, fallbackName, alt = "", className = "", position, eager, children }: PhotoProps) {
  const url = photoUrl(name) ?? (fallbackName ? photoUrl(fallbackName) : undefined);
  const style: CSSProperties | undefined = position ? { objectPosition: position } : undefined;
  return (
    <div className={`photo ${url ? "" : "photo--empty"} ${className}`}>
      {url ? (
        <img src={url} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" style={style} />
      ) : (
        <div className="photo__fallback" aria-hidden="true">
          {children}
        </div>
      )}
    </div>
  );
}

export function Avatar({
  name,
  initials,
  tone = "teal",
  className = "",
}: {
  name: string;
  initials: string;
  tone?: "teal" | "bronze" | "dark";
  className?: string;
}) {
  const url = photoUrl(`avatar-${name}`);
  return (
    <span className={`avatar avatar--${tone} ${className}`}>
      {url ? <img src={url} alt="" loading="lazy" decoding="async" /> : initials}
    </span>
  );
}

/** Hand-drawn underline that draws itself in (via the headline split animation). */
export function Scribble({ className = "" }: { className?: string }) {
  return (
    <svg className={`scribble ${className}`} viewBox="0 0 300 30" preserveAspectRatio="none" aria-hidden="true">
      <path d="M6 20 C 70 9, 168 6, 294 13" />
      <path d="M40 26 C 110 19, 190 18, 262 22" />
    </svg>
  );
}

export function BtnArrow({ size = 18 }: { size?: number }) {
  return (
    <span className="btn__arrow" aria-hidden="true">
      <ArrowUpRight size={size} />
    </span>
  );
}

/** Simplified brand marks for the email platforms MailPilot supports */
export function PlatformIcon({ name, size = 18 }: { name: string; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": true, className: "pf-icon" } as const;
  switch (name) {
    case "Gmail":
      return (
        <svg {...p}>
          <path fill="#4285F4" d="M1.5 6.2V18.5A1.5 1.5 0 0 0 3 20h3.5V9.9z" />
          <path fill="#34A853" d="M22.5 6.2V18.5A1.5 1.5 0 0 1 21 20h-3.5V9.9z" />
          <path fill="#EA4335" d="M6.5 9.9 12 14l5.5-4.1V5.6L12 9.7 6.5 5.6z" />
          <path fill="#C5221F" d="M1.5 6.2 6.5 9.9V5.6L4.6 4.2A2 2 0 0 0 1.5 6.2z" />
          <path fill="#FBBC04" d="M22.5 6.2 17.5 9.9V5.6l1.9-1.4a2 2 0 0 1 3.1 2z" />
        </svg>
      );
    case "Google Workspace":
      return (
        <svg {...p}>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.6 10.6 0 0 0 12 1 11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
        </svg>
      );
    case "Outlook":
      return (
        <svg {...p}>
          <rect x="8.5" y="4.5" width="14" height="15" rx="1.6" fill="#28A8EA" />
          <path d="m8.5 8 7 4.6 7-4.6" fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="1.3" />
          <rect x="1.5" y="6" width="12" height="12" rx="1.6" fill="#0A64AD" />
          <ellipse cx="7.5" cy="12" rx="2.7" ry="3.2" fill="none" stroke="#fff" strokeWidth="1.8" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <path fill="#D83B01" d="M3 5.6 14.4 2l6.6 2.1v15.8L14.4 22 3 18.4l11.4 1.5V6.3L7.2 8v8.6L3 18.4z" />
        </svg>
      );
  }
}
