/**
 * Hero artwork for the prize showcase — a self-contained SVG illustration.
 *
 * The hero deliberately does NOT use a campaign photo. Remote prize images can
 * be slow or fail (the seeded Unsplash URLs time out), and a broken-image glyph
 * sitting in the middle of the hero undoes the trust the section is there to
 * build. Real prize photography still appears in the Featured Prize block and
 * on every campaign card, where a loading state is acceptable.
 */
export function PrizeIllustration({
  className,
  label = "Gift box with a prize device",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 420 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
      className={className}
    >
      <defs>
        <linearGradient id="pa-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="45%" stopColor="#5B8DEF" />
          <stop offset="100%" stopColor="#22D3A7" />
        </linearGradient>
        <linearGradient id="pa-box" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#25A96B" />
          <stop offset="100%" stopColor="#12784A" />
        </linearGradient>
        <linearGradient id="pa-lid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2FBE79" />
          <stop offset="100%" stopColor="#14804F" />
        </linearGradient>
        <linearGradient id="pa-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E9F0EC" />
        </linearGradient>
        <linearGradient id="pa-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="pa-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#16A34A" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
        </radialGradient>
        <clipPath id="pa-screen-clip">
          <rect x="165" y="80" width="90" height="188" rx="9" />
        </clipPath>
      </defs>

      {/* Ambient glow behind the device */}
      <ellipse cx="210" cy="200" rx="150" ry="150" fill="url(#pa-glow)" />

      {/* ---------- Device ---------- */}
      <g transform="rotate(-5 210 175)">
        <rect x="157" y="72" width="106" height="204" rx="16" fill="#0F1A17" />
        <rect x="165" y="80" width="90" height="188" rx="9" fill="url(#pa-screen)" />
        <g clipPath="url(#pa-screen-clip)">
          <ellipse cx="196" cy="150" rx="58" ry="70" fill="#FFFFFF" opacity="0.16" />
          <ellipse cx="242" cy="212" rx="46" ry="52" fill="#0EA5E9" opacity="0.3" />
          <ellipse cx="232" cy="106" rx="34" ry="38" fill="#A78BFA" opacity="0.4" />
        </g>
        <rect x="165" y="80" width="90" height="188" rx="9" fill="url(#pa-sheen)" />
        <circle cx="210" cy="88" r="2.6" fill="#0F1A17" opacity="0.75" />
      </g>

      {/* ---------- Box back rim ---------- */}
      <path d="M124 258 H296 L308 284 H112 Z" fill="#D9E5DE" />

      {/* ---------- Box front ---------- */}
      <path
        d="M112 282 H308 L299 352 A11 11 0 0 1 288 362 H132 A11 11 0 0 1 121 352 Z"
        fill="url(#pa-paper)"
      />
      {/* Ribbon down the front */}
      <path d="M195 282 H225 L222 362 H198 Z" fill="url(#pa-box)" />
      {/* Front lip */}
      <rect x="106" y="272" width="208" height="18" rx="9" fill="#FFFFFF" />
      <rect x="106" y="272" width="208" height="18" rx="9" fill="url(#pa-sheen)" />
      <rect x="196" y="272" width="28" height="18" rx="6" fill="url(#pa-lid)" />

      {/* ---------- Flying lid ---------- */}
      <g transform="rotate(16 344 96)">
        <rect x="292" y="72" width="104" height="26" rx="9" fill="url(#pa-lid)" />
        <rect x="288" y="92" width="112" height="16" rx="8" fill="#0F7A4A" />
        {/* Bow */}
        <path d="M330 72c-12-4-22-12-18-20 3-7 14-5 19 3l5 9z" fill="#2FBE79" />
        <path d="M356 72c12-4 22-12 18-20-3-7-14-5-19 3l-5 9z" fill="#2FBE79" />
        <circle cx="343" cy="68" r="7" fill="#14804F" />
      </g>

      {/* ---------- Confetti ---------- */}
      <g opacity="0.9">
        <rect x="70" y="96" width="13" height="13" rx="3" fill="#F5B32B" transform="rotate(-18 76 102)" />
        <rect x="332" y="186" width="11" height="11" rx="3" fill="#2FBE79" transform="rotate(24 337 191)" />
        <rect x="96" y="196" width="18" height="7" rx="3.5" fill="#F5B32B" opacity="0.85" transform="rotate(-28 105 199)" />
        <rect x="312" y="292" width="15" height="7" rx="3.5" fill="#2FBE79" opacity="0.75" transform="rotate(18 319 295)" />
        <circle cx="356" cy="128" r="5.5" fill="#F5B32B" opacity="0.85" />
        <circle cx="62" cy="248" r="4.5" fill="#2FBE79" opacity="0.8" />
        <circle cx="288" cy="52" r="4" fill="#5B8DEF" opacity="0.7" />
      </g>

      {/* ---------- Sparkles ---------- */}
      <g fill="#F5B32B">
        <path d="M96 46l3.6 8.4L108 58l-8.4 3.6L96 70l-3.6-8.4L84 58l8.4-3.6z" />
        <path
          d="M330 234l2.7 6.3 6.3 2.7-6.3 2.7-2.7 6.3-2.7-6.3-6.3-2.7 6.3-2.7z"
          opacity="0.8"
        />
      </g>

      {/* ---------- Ground shadow ---------- */}
      <ellipse cx="210" cy="368" rx="118" ry="13" fill="#0F1A17" opacity="0.08" />
    </svg>
  );
}
