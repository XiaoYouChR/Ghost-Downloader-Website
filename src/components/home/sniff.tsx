'use client';

import { motion } from 'motion/react';
import { entrance, entranceDelayed, Section, SectionBody, SectionTitle } from './primitives';
import { Shot } from './shot';

type Beat = {
  step: string;
  shotId: string;
  shotLabel: string;
  title: string;
  body: string;
  alt: string;
  srcLight?: string;
  srcDark?: string;
};

type SniffCopy = {
  title: string;
  body: string;
  beats: Beat[];
};

export function Sniff({ copy }: { copy: SniffCopy }) {
  return (
    <Section className="border-t border-edge bg-surface">
      <motion.div {...entrance}>
        <SectionTitle>{copy.title}</SectionTitle>
        <SectionBody className="mt-5">{copy.body}</SectionBody>
      </motion.div>

      <motion.ol
        {...entranceDelayed}
        className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8"
      >
        {copy.beats.map((beat) => (
          <li key={beat.step} className="flex flex-col gap-5">
            <Shot
              id={beat.shotId}
              label={beat.shotLabel}
              alt={beat.alt}
              srcLight={beat.srcLight}
              srcDark={beat.srcDark}
              aspect="4 / 3"
              className="shadow-[0_4px_12px_rgba(0,0,0,0.12),0_20px_48px_-8px_rgba(0,0,0,0.25)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5),0_24px_56px_-8px_rgba(0,0,0,0.7)]"
            />
            <div>
              <h3 className="flex items-baseline gap-2.5 font-display text-lg font-semibold tracking-[-0.015em] text-ink">
                <span
                  aria-hidden="true"
                  className="font-mono text-xs font-medium text-accent tabular-nums"
                >
                  {beat.step}
                </span>
                {beat.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {beat.body}
              </p>
            </div>
          </li>
        ))}
      </motion.ol>
    </Section>
  );
}
