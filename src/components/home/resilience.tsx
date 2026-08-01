'use client';

import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { entrance, entranceDelayed, Section, SectionBody, SectionTitle } from './primitives';

type Stat = {
  value: string;
  label: string;
};

type ResilienceCopy = {
  title: string;
  body: string;
  stats: Stat[];
  note: string;
  noteLink: string;
  noteLinkHref: string;
};

export function Resilience({ copy }: { copy: ResilienceCopy }) {
  return (
    <Section className="border-t border-edge">
      <motion.div {...entrance}>
        <SectionTitle>{copy.title}</SectionTitle>
        <SectionBody className="mt-5">{copy.body}</SectionBody>
      </motion.div>

      <motion.dl
        {...entranceDelayed}
        className="mt-14 grid gap-px overflow-hidden rounded-xl border border-edge bg-edge sm:grid-cols-3"
      >
        {copy.stats.map((stat) => (
          <div key={stat.label} className="bg-ground px-6 py-8">
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="block font-mono text-4xl font-medium tracking-tight text-accent tabular-nums sm:text-5xl">
                {stat.value}
              </span>
              <span className="mt-3 block max-w-[24ch] text-sm leading-relaxed text-ink-muted">
                {stat.label}
              </span>
            </dd>
          </div>
        ))}
      </motion.dl>

      <motion.p
        {...entranceDelayed}
        className="mt-8 max-w-[64ch] text-sm leading-relaxed text-ink-faint"
      >
        {copy.note}{' '}
        <a
          href={copy.noteLinkHref}
          className="inline-flex items-center gap-0.5 font-medium text-accent underline-offset-4 hover:underline"
        >
          {copy.noteLink}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </motion.p>
    </Section>
  );
}
