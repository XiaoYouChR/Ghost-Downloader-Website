import type { en } from './en';

/** Every copy key on the site. Derived from the English table. */
type CopyKey = keyof typeof en;

/**
 * A complete translation. Adding a language means copying `en.ts` and
 * translating the values — TypeScript reports any key that was missed or
 * invented along the way.
 */
export type CopyTable = Record<CopyKey, string>;

/** Reads a single string out of a translation table. */
export type Translate = (key: CopyKey) => string;
