type LogoProps = {
  className?: string;
  /** "dark" = the logo sits on a teal surface, so "Mail" switches to paper. */
  tone?: "light" | "dark";
  href?: string;
};

export function Logo({ className = "", tone = "light", href = "#top" }: LogoProps) {
  return (
    <a className={`logo ${className}`} href={href} aria-label="MailPilot home">
      <img
        src={tone === "dark" ? "/mailpilot-logo-light.png" : "/mailpilot-logo.png"}
        alt="MailPilot"
        width={1536}
        height={313}
      />
    </a>
  );
}
