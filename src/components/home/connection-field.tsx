import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { GHOST_PATH } from '@/components/ghost-mark';

/**
 * The connection field.
 *
 * One picture that runs blockade → passage → speed, top to bottom — the order
 * the product actually works in, and the direction the visitor scrolls.
 *
 * Upper band: even, unbroken, static lines. A blockade.
 * Lower band: the same columns broken into uneven segments drifting downward —
 * a chunked download progress bar stood on end.
 * Between them: the ghost, whose own height *is* the crossfade, so the field
 * changes character over its span instead of across a hard seam.
 *
 * Rendered on the server. Every column is static SVG; only CSS transforms move,
 * so nothing here depends on JavaScript and no copy is ever hidden by it.
 */

/** Deterministic, so server and client agree and the field never reshuffles. */
function seeded(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

type Column = {
  x: number;
  /** Entrance stagger, in seconds. */
  delay: number;
  /** Vertical repeat of the segment pattern, in viewBox units. */
  period: number;
  /** One drift cycle, in seconds. Uneven across columns on purpose. */
  duration: number;
  accent: boolean;
  /** Accent columns only: one crawl-breakthrough-run cycle, in seconds. */
  pulseDuration: number;
  /** Accent columns only: when this column's first pulse sets off. */
  pulseDelay: number;
  segments: { y: number; height: number }[];
};

function buildColumns(count: number, width: number, seed: number): Column[] {
  const random = seeded(seed);
  const columns: Column[] = [];

  for (let i = 0; i < count; i += 1) {
    const period = 11 + random() * 16;
    const gap = 0.22 + random() * 0.24;
    const offset = random() * period;
    const segments: { y: number; height: number }[] = [];

    // Cover one period beyond each edge so the drift loop has no visible seam:
    // translating by exactly one period lands the pattern back on itself.
    for (let y = -period; y < 100 + period; y += period) {
      segments.push({ y: y + offset, height: period * (1 - gap) });
    }

    columns.push({
      x: ((i + 0.5) / count) * 100 - width / 2,
      delay: random() * 0.26,
      period,
      duration: 16 + random() * 22,
      accent: false,
      pulseDuration: 0,
      pulseDelay: 0,
      segments,
    });
  }

  // A handful of live connections, spread out rather than clustered. Only these
  // carry pulses: six columns out of seventy-eight is the whole reason the
  // field can have events at all without turning into a screensaver.
  const stride = Math.max(5, Math.round(count / 10));
  const accents = [];
  for (let i = 2; i < count; i += stride) accents.push(i);

  accents.forEach((i, nth) => {
    columns[i].accent = true;
    // Long, uneven cycles so the six never fall into step. The crawl holds a
    // steady ~30px/s through a 25% blockade (~8s), then runs at ~350px/s (12×).
    // The rest is dwell.
    columns[i].pulseDuration = 22 + random() * 8;

    // A negative delay starts a column part-way through its cycle, so the field
    // is alive at load instead of standing empty for fourteen seconds. The
    // phases are spread *evenly* rather than randomly: an earlier version drew
    // them from the crawl window alone, which put all six in step — six dim
    // marks creeping together, then a cluster of breakthroughs, then nothing.
    // Even spacing staggers the breakthroughs to roughly one every five seconds.
    // The run window is skipped so no pulse is mid-breakthrough while the
    // entrance is still playing. Durations still vary, so they drift apart.
    const span = RUN_TO - RUN_FROM;
    let phase = ((nth + 0.5) / accents.length) * (1 - span);
    if (phase >= RUN_FROM) phase += span;
    columns[i].pulseDelay = -phase * columns[i].pulseDuration;
  });

  return columns;
}

type Variant = 'hero' | 'trail';

type ConnectionFieldProps = {
  /**
   * `hero` carries the full argument: blockade above, ghost cutout, speed below.
   * `trail` is the speed band alone, for the bands that reprise it further down
   * the page.
   */
  variant?: Variant;
  className?: string;
};

/**
 * Two densities, swapped at the `md` breakpoint. Vertical lines survive most
 * things, but not a 3.7× change in viewport width — at one fixed spacing the
 * field is either a picket fence on desktop or a barcode on a phone.
 */
const DENSITIES = [
  { key: 'wide', count: 78, width: 0.075, seed: 20260731 },
  { key: 'narrow', count: 22, width: 0.26, seed: 424242 },
] as const;

/**
 * Where the crossfade starts and ends, as a fraction of the field's height.
 *
 * 0.25–0.35 sits inside the silhouette's span (0.155–0.845), so no hard seam
 * ever crosses open field. The wall occupies the top 25%, the transition is a
 * fast 10% band, and speed fills the remaining 65%.
 */
const CROSSFADE = { hero: [0.25, 0.35], trail: [0, 0] } as const;

/**
 * Pulse tail length in viewBox units, and how much thicker than a field line
 * its stroke runs. At 2× a pulse was just a slightly bluer hairline among a
 * hundred hairlines; the eye needs the width difference to tell an object
 * moving through the field from the field itself flickering.
 */
const PULSE_TAIL = 16;
const PULSE_WEIGHT = 3.2;

/**
 * The breakthrough window, as a fraction of one pulse cycle. Must match the
 * `gd-pulse-travel` keyframes in `global.css` — this is the only stretch where
 * a pulse is bright and moving fast, and it is the part that has to stay rare.
 */
const RUN_FROM = 0.30;
const RUN_TO = 0.38;

export function ConnectionField({
  variant = 'hero',
  className,
}: ConnectionFieldProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'gd-field pointer-events-none absolute inset-0 overflow-hidden',
        variant === 'hero' && 'gd-field--hero',
        className,
      )}
    >
      {DENSITIES.map(({ key, count, width, seed }) => {
        const columns = buildColumns(count, width, seed);
        const [fadeStart, fadeEnd] = CROSSFADE[variant];
        const barrierMask = `gd-barrier-${variant}-${key}`;
        const speedMask = `gd-speed-${variant}-${key}`;
        const dimTail = `gd-tail-dim-${variant}-${key}`;
        const litTail = `gd-tail-lit-${variant}-${key}`;

        return (
          <svg
            key={key}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className={cn(
              'gd-field__lines absolute inset-0 h-full w-full',
              key === 'wide' ? 'hidden md:block' : 'md:hidden',
            )}
          >
            {variant === 'hero' && (
              <defs>
                <linearGradient id={`${barrierMask}-grad`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset={fadeStart} stopColor="#fff" />
                  <stop offset={fadeEnd} stopColor="#000" />
                </linearGradient>
                <linearGradient id={`${speedMask}-grad`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset={fadeStart} stopColor="#000" />
                  <stop offset={fadeEnd} stopColor="#fff" />
                </linearGradient>
                <mask id={barrierMask}>
                  <rect
                    width="100"
                    height="100"
                    fill={`url(#${barrierMask}-grad)`}
                  />
                </mask>
                <mask id={speedMask}>
                  <rect width="100" height="100" fill={`url(#${speedMask}-grad)`} />
                </mask>

                {/* A pulse is a comet, not a tick: the tail runs from y -10 up
                    to the head at y 0, in user space, so it travels with the
                    element's transform instead of staying put. A bounding-box
                    gradient could not do this — a vertical line's box has zero
                    width, which disables objectBoundingBox gradients. */}
                {([
                  [dimTail, 'var(--gd-pulse-dim)'],
                  [litTail, 'var(--gd-accent)'],
                ] as const).map(([id, color]) => (
                  <linearGradient
                    key={id}
                    id={id}
                    gradientUnits="userSpaceOnUse"
                    x1="0"
                    y1={-PULSE_TAIL}
                    x2="0"
                    y2="0"
                  >
                    <stop offset="0" style={{ stopColor: color, stopOpacity: 0 }} />
                    <stop offset="0.55" style={{ stopColor: color, stopOpacity: 0.22 }} />
                    <stop offset="0.88" style={{ stopColor: color, stopOpacity: 0.75 }} />
                    <stop offset="1" style={{ stopColor: color, stopOpacity: 1 }} />
                  </linearGradient>
                ))}
              </defs>
            )}

            {/* Blockade: even, unbroken, still. The problem the page opens on. */}
            {variant === 'hero' && (
              <g
                className="gd-field__barrier"
                strokeWidth={width}
                mask={`url(#${barrierMask})`}
              >
                {/* A custom property, not `animation-delay` — the speed layer
                    adds its own act offset on top of this stagger, and an
                    inline delay would beat any rule that tried. */}
                {columns.map((column) => (
                  <path
                    key={column.x}
                    className="gd-col"
                    style={
                      {
                        '--gd-stagger': `${column.delay.toFixed(3)}s`,
                      } as CSSProperties
                    }
                    d={`M${column.x.toFixed(3)} 0v100`}
                  />
                ))}
              </g>
            )}

            {/* Speed: the same columns, broken into chunks, running downward. */}
            <g
              className="gd-field__speed"
              strokeWidth={width}
              mask={variant === 'hero' ? `url(#${speedMask})` : undefined}
            >
              {columns.map((column) => (
                <g
                  key={column.x}
                  className={cn('gd-col', column.accent && 'gd-col--accent')}
                  style={
                    { '--gd-stagger': `${column.delay.toFixed(3)}s` } as CSSProperties
                  }
                >
                  <path
                    className="gd-drift"
                    style={{
                      '--gd-period': `${column.period.toFixed(2)}px`,
                      animationDuration: `${column.duration.toFixed(1)}s`,
                    } as CSSProperties}
                    d={column.segments
                      .map(
                        (segment) =>
                          `M${column.x.toFixed(3)} ${segment.y.toFixed(2)}v${segment.height.toFixed(2)}`,
                      )
                      .join('')}
                  />
                </g>
              ))}
            </g>

            {/* Live connections. One dim point creeps down through the blockade,
                turns cobalt where the field changes character, and runs. The
                whole product claim — held up, through, gone — in about three
                seconds, on six columns out of seventy-eight.

                Deliberately outside the crossfade masks: the pulse has to be
                visible up in the blockade, which is exactly where the speed
                mask is busy hiding things. Its two children share one transform
                from the parent and only cross-fade against each other, so the
                colour can never drift out of step with the position. */}
            {variant === 'hero' && (
              <g
                className="gd-field__pulse"
                strokeWidth={width * PULSE_WEIGHT}
                fill="none"
              >
                {columns
                  .filter((column) => column.accent)
                  .map((column) => {
                    const d = `M${column.x.toFixed(3)} ${-PULSE_TAIL}v${PULSE_TAIL}`;

                    return (
                      <g
                        key={column.x}
                        className="gd-pulse"
                        style={
                          {
                            '--gd-pulse-dur': `${column.pulseDuration.toFixed(1)}s`,
                            '--gd-pulse-delay': `${column.pulseDelay.toFixed(2)}s`,
                          } as CSSProperties
                        }
                      >
                        {/* Inline `stroke`, because the sheet's
                            `stroke: currentColor` would otherwise beat a
                            presentation attribute. */}
                        <path
                          className="gd-pulse__held"
                          style={{ stroke: `url(#${dimTail})` }}
                          d={d}
                        />
                        <path
                          className="gd-pulse__through"
                          style={{ stroke: `url(#${litTail})` }}
                          d={d}
                        />
                      </g>
                    );
                  })}
              </g>
            )}
          </svg>
        );
      })}
    </div>
  );
}

/**
 * The ghost's contour, drawn over the field rather than cut from it.
 *
 * The field fades out at the silhouette's edge; this hairline is what keeps the
 * shape certain anyway. Geometry is locked to the same custom properties that
 * position the mask, so the outline and the cutout can never drift apart.
 */
export function GhostContour({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={cn('gd-contour pointer-events-none absolute', className)}
    >
      {/* `pathLength` normalises the outline to 1 so the entrance can draw it
          with a dash offset without anyone measuring the geometry. */}
      <path
        className="gd-contour__path"
        d={GHOST_PATH}
        fillRule="evenodd"
        clipRule="evenodd"
        stroke="currentColor"
        strokeWidth="1"
        pathLength="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
