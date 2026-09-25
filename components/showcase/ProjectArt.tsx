import type { ArtVariant } from "@/lib/data";

/** Generative, per-project cover art. Pure SVG in the world's accent colour. */
export default function ProjectArt({ variant, seed = 1 }: { variant: ArtVariant; seed?: number }) {
  const rand = mulberry32(seed * 9973);
  return (
    <svg
      viewBox="0 0 400 220"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full text-accent transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      aria-hidden
    >
      <defs>
        <radialGradient id={`g-${variant}-${seed}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="220" fill={`url(#g-${variant}-${seed})`} />
      {variant === "radar" && <Radar rand={rand} />}
      {variant === "hex" && <Hex rand={rand} />}
      {variant === "nodes" && <Nodes rand={rand} />}
      {variant === "orbit" && <Orbit rand={rand} />}
      {variant === "wave" && <Wave />}
      {variant === "grid" && <Grid rand={rand} />}
    </svg>
  );
}

type R = { rand: () => number };

function Radar({ rand }: R) {
  const blips = Array.from({ length: 7 }, () => {
    const a = rand() * Math.PI * 2;
    const r = 20 + rand() * 70;
    return { x: 200 + Math.cos(a) * r, y: 110 + Math.sin(a) * r };
  });
  return (
    <g fill="none" stroke="currentColor">
      {[25, 50, 75, 100].map((r) => (
        <circle key={r} cx="200" cy="110" r={r} strokeOpacity="0.25" />
      ))}
      <line x1="100" y1="110" x2="300" y2="110" strokeOpacity="0.15" />
      <line x1="200" y1="10" x2="200" y2="210" strokeOpacity="0.15" />
      <g className="art-spin">
        <path d="M200 110 L200 10 A100 100 0 0 1 286 60 Z" fill="currentColor" fillOpacity="0.14" stroke="none" />
        <line x1="200" y1="110" x2="200" y2="10" strokeOpacity="0.9" />
      </g>
      {blips.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r={i % 3 === 0 ? 3 : 2} fill="currentColor" stroke="none" opacity={i % 3 === 0 ? 1 : 0.5} />
      ))}
    </g>
  );
}

function Hex({ rand }: R) {
  const cells: { x: number; y: number; on: boolean }[] = [];
  for (let row = 0; row < 7; row++)
    for (let col = 0; col < 13; col++)
      cells.push({ x: col * 34 + (row % 2) * 17 - 10, y: row * 30 - 2, on: rand() > 0.84 });
  const hex = (x: number, y: number) => {
    const r = 15;
    return Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`;
    }).join(" ");
  };
  return (
    <g stroke="currentColor">
      {cells.map((c, i) => (
        <polygon
          key={i}
          points={hex(c.x, c.y)}
          fill="currentColor"
          fillOpacity={c.on ? 0.35 : 0}
          strokeOpacity={c.on ? 0.9 : 0.14}
        />
      ))}
      <g transform="translate(200 110)">
        <rect x="-14" y="-4" width="28" height="22" rx="4" fill="#000" fillOpacity="0.6" strokeOpacity="0.9" />
        <path d="M-8 -4 v-6 a8 8 0 0 1 16 0 v6" fill="none" strokeOpacity="0.9" />
      </g>
    </g>
  );
}

function Nodes({ rand }: R) {
  const pts = Array.from({ length: 16 }, () => ({ x: 30 + rand() * 340, y: 20 + rand() * 180 }));
  const edges: [number, number][] = [];
  pts.forEach((p, i) =>
    pts.forEach((q, j) => {
      if (j > i && Math.hypot(p.x - q.x, p.y - q.y) < 105) edges.push([i, j]);
    }),
  );
  return (
    <g stroke="currentColor">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={pts[a].x}
          y1={pts[a].y}
          x2={pts[b].x}
          y2={pts[b].y}
          strokeOpacity="0.3"
          className={i % 4 === 0 ? "art-dash" : undefined}
        />
      ))}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i % 5 === 0 ? 4.5 : 2.5} fill="currentColor" fillOpacity={i % 5 === 0 ? 1 : 0.6} stroke="none" />
      ))}
    </g>
  );
}

function Orbit({ rand }: R) {
  const pings = Array.from({ length: 9 }, () => ({ a: rand() * Math.PI * 2, b: rand() * 0.9 - 0.45 }));
  return (
    <g fill="none" stroke="currentColor">
      <circle cx="200" cy="110" r="78" strokeOpacity="0.5" />
      {[-50, -25, 0, 25, 50].map((dy) => (
        <ellipse key={dy} cx="200" cy={110 + dy} rx={Math.sqrt(78 * 78 - dy * dy)} ry="10" strokeOpacity="0.18" />
      ))}
      {[20, 45, 70].map((rx) => (
        <ellipse key={rx} cx="200" cy="110" rx={rx} ry="78" strokeOpacity="0.18" />
      ))}
      <ellipse cx="200" cy="110" rx="150" ry="36" strokeOpacity="0.35" strokeDasharray="2 6" transform="rotate(-14 200 110)" />
      {pings.map((p, i) => (
        <circle
          key={i}
          cx={200 + Math.cos(p.a) * 70 * Math.cos(p.b)}
          cy={110 + Math.sin(p.b) * 70 + Math.sin(p.a) * 12}
          r="2.5"
          fill="currentColor"
          stroke="none"
        />
      ))}
    </g>
  );
}

function Wave() {
  const line = (amp: number, freq: number, phase: number, y0: number) => {
    let d = "";
    for (let x = 0; x <= 400; x += 4) {
      const y = y0 + Math.sin(x * freq + phase) * amp * Math.sin((x / 400) * Math.PI) + Math.sin(x * freq * 3.1 + phase) * amp * 0.25;
      d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)} `;
    }
    return d;
  };
  return (
    <g fill="none" stroke="currentColor">
      <path d={line(34, 0.035, 0, 110)} strokeOpacity="0.95" strokeWidth="1.6" />
      <path d={line(24, 0.05, 1.3, 110)} strokeOpacity="0.45" />
      <path d={line(16, 0.07, 2.4, 110)} strokeOpacity="0.25" className="art-dash" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={40 + i * 40} y1="30" x2={40 + i * 40} y2="190" strokeOpacity="0.08" />
      ))}
      <rect x="150" y="40" width="100" height="140" fill="currentColor" fillOpacity="0.06" strokeOpacity="0.5" strokeDasharray="3 4" />
    </g>
  );
}

function Grid({ rand }: R) {
  const cols = 8;
  return (
    <g stroke="currentColor">
      {Array.from({ length: cols }, (_, i) => {
        const h = 30 + rand() * 110;
        const x = 60 + i * 38;
        return (
          <g key={i}>
            <rect x={x} y={180 - h} width="24" height={h} fill="currentColor" fillOpacity={0.08 + (h / 140) * 0.3} strokeOpacity="0.6" />
            <rect x={x} y={180 - h} width="24" height="3" fill="currentColor" stroke="none" />
          </g>
        );
      })}
      <line x1="40" y1="180" x2="360" y2="180" strokeOpacity="0.4" />
      <path d="M40 150 C 120 60, 220 150, 360 50" fill="none" strokeOpacity="0.9" className="art-dash" />
    </g>
  );
}

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
