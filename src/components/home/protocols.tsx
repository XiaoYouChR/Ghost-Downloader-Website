'use client';

import { motion } from 'motion/react';
import { entrance, entranceDelayed, Section, SectionBody, SectionTitle } from './primitives';
import { Shot } from './shot';

type Protocol = {
  name: string;
  note: string;
};

type ProtocolsCopy = {
  title: string;
  body: string;
  protocols: Protocol[];
  live: { title: string; body: string; alt: string };
  parsers: { title: string; body: string; alt: string };
  android: { title: string; body: string; alts: [string, string, string] };
};

export function Protocols({ copy }: { copy: ProtocolsCopy }) {
  return (
    <Section className="overflow-hidden border-t border-edge">
      <motion.div {...entrance}>
        <SectionTitle>{copy.title}</SectionTitle>
        <SectionBody className="mt-5">{copy.body}</SectionBody>
      </motion.div>

      <motion.ul
        {...entranceDelayed}
        className="mt-14 grid gap-px overflow-hidden rounded-xl border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-3"
      >
        {copy.protocols.map((p) => (
          <li key={p.name} className="bg-ground px-6 py-5">
            <span className="block font-mono text-base font-medium tracking-tight text-ink">
              {p.name}
            </span>
            <span className="mt-1 block text-sm text-ink-faint">
              {p.note}
            </span>
          </li>
        ))}
      </motion.ul>

      <motion.div
        {...entranceDelayed}
        className="mt-8 grid gap-8 md:grid-cols-2"
      >
        <article className="flex h-full flex-col gap-5">
          <Shot
            id="06"
            label="Live M3U8 stream being recorded"
            alt={copy.live.alt}
            srcLight="/shots/light/shot-06.webp"
            srcDark="/shots/dark/shot-06.webp"
            aspect="16 / 10"
          />
          <div>
            <h3 className="font-display text-lg font-semibold tracking-[-0.015em] text-ink">
              {copy.live.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {copy.live.body}
            </p>
          </div>
        </article>

        <article className="flex h-full flex-col gap-5">
          <Shot
            id="07"
            label="Quality picker showing 4K and HDR options"
            alt={copy.parsers.alt}
            srcLight="/shots/light/shot-07.webp"
            srcDark="/shots/dark/shot-07.webp"
            aspect="16 / 10"
          />
          <div>
            <h3 className="font-display text-lg font-semibold tracking-[-0.015em] text-ink">
              {copy.parsers.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {copy.parsers.body}
            </p>
          </div>
        </article>
      </motion.div>

      <motion.div
        {...entranceDelayed}
        className="mt-12 grid items-center gap-10 md:grid-cols-[1fr_22rem] md:gap-14"
      >
        <div>
          <h3 className="font-display text-2xl leading-[1.25] font-medium tracking-[-0.02em] text-balance text-ink sm:text-3xl">
            {copy.android.title}
          </h3>
          <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-ink-muted">
            {copy.android.body}
          </p>
        </div>
        <div className="relative mx-auto w-full max-w-[22rem]" style={{ aspectRatio: '4 / 5' }}>
          {([
            { id: '12', label: 'Android completion notification', alt: copy.android.alts[2], left: '0%', rotate: -7, z: 0, srcLight: '/shots/light/shot-12.webp', srcDark: '/shots/dark/shot-12.webp' },
            { id: '11', label: 'Android download list', alt: copy.android.alts[1], left: '50%', rotate: 7, z: 1, srcLight: '/shots/light/shot-11.webp', srcDark: '/shots/dark/shot-11.webp' },
            { id: '10', label: 'Android app recording a live stream', alt: copy.android.alts[0], left: '25%', rotate: 0, z: 2, srcLight: '/shots/light/shot-10.webp', srcDark: '/shots/dark/shot-10.webp' },
          ] as const).map((card) => (
            <div
              key={card.id}
              className="absolute top-[8%]"
              style={{
                left: card.left,
                width: '55%',
                transform: `rotate(${card.rotate}deg)`,
                transformOrigin: '50% 95%',
                zIndex: card.z,
              }}
            >
              <Shot id={card.id} label={card.label} alt={card.alt} srcLight={card.srcLight} srcDark={card.srcDark} aspect="9 / 16" />
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
