/** The platforms we ship a build for. */
export type Platform = 'windows' | 'macos' | 'linux' | 'android';

type UADataNavigator = Navigator & {
  userAgentData?: { platform?: string };
};

/**
 * Best-effort OS detection, client-side only.
 *
 * The site is a static export (`output: 'export'`), so there is no request-time
 * `User-Agent` to read — this cannot run before hydration. Returns `null` when
 * the visitor is on something we ship no build for, or when the string is
 * unrecognisable; callers fall back to a generic label.
 */
export function detectPlatform(): Platform | null {
  if (typeof navigator === 'undefined') return null;

  const hint = (navigator as UADataNavigator).userAgentData?.platform ?? '';
  const haystack = `${hint} ${navigator.userAgent ?? ''}`.toLowerCase();

  // Android before Linux: every Android user agent also contains "Linux".
  if (haystack.includes('android')) return 'android';
  // iOS and iPadOS get no build, so they must not fall through to macOS.
  if (/iphone|ipad|ipod/.test(haystack)) return null;
  if (haystack.includes('win')) return 'windows';
  if (haystack.includes('mac')) return 'macos';
  if (haystack.includes('linux') || haystack.includes('x11')) return 'linux';

  return null;
}
