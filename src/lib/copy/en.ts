/**
 * Source of truth for site copy. Every other locale is type-checked against
 * this key set, so a missing or stray translation key fails the build.
 */
export const en = {
  'nav.docs': 'Docs',
  'nav.blog': 'Blog',
  'nav.download': 'Download',
  'nav.community': 'Community',
  'nav.community.github': 'GitHub',
  'nav.community.githubBody': 'Source, issues and releases.',
  'nav.community.discord': 'Discord',
  'nav.community.discordBody': 'Ask questions and follow development.',
  'nav.community.qq': 'QQ group',
  'nav.community.qqBody': 'Chinese-speaking community.',
  'nav.stars': 'stars on GitHub',
  'nav.menu': 'Open menu',

  'hero.title': 'The only downloader you need.',
    'hero.subtitle':
    'A downloader that sniffs page media, records live streams, and replaces five tools. Fast, free, and open source.',
  // `ctaPrimary` is the static-HTML fallback and must stand alone as a CTA; the
  // `cta.*` labels replace it once the client can see the platform.
  'hero.ctaPrimary': 'Download',
  'hero.cta.windows': 'Download for Windows',
  'hero.cta.macos': 'Download for macOS',
  'hero.cta.linux': 'Download for Linux',
  'hero.cta.android': 'Download for Android',
  'hero.ctaSecondary': 'Documentation',
  'hero.shotAlt': 'Ghost Downloader running several downloads at once',

  'resilience.title': 'Fast where it matters.',
  'resilience.body':
    'Every downloader is fast on a good connection. Throttled, congested, half-broken — where others stall, we pull away.',
  'resilience.stat1.value': '2.5×',
  'resilience.stat1.label': 'faster on constrained networks',
  'resilience.stat2.value': '100%',
  'resilience.stat2.label': 'of test downloads completed',
  'resilience.stat3.value': '0',
  'resilience.stat3.label': 'downloads lost to anti-bot checks',
  'resilience.note':
    'Measured across six real-world downloads at matched connection counts. Ghost Downloader finished every one, and finished first in five.',
  'resilience.noteLink': 'Read the benchmark',

  'sniff.title': 'See it. Sniff it. Download it.',
  'sniff.body':
    'The extension watches the page, finds the stream behind the player, hands it to the desktop app, and gets out of the way.',
  'sniff.beat1.title': 'A button where you are already looking',
  'sniff.beat1.body':
    'A download control sits on the video itself. No quality cap, no 720p ceiling.',
  'sniff.beat1.alt': 'Download button shown on a video page',
  'sniff.beat2.title': 'Everything on the page, listed',
  'sniff.beat2.body':
    'Video, audio, images, HLS and DASH streams. Open the popup and take what you want.',
  'sniff.beat2.alt': 'Extension popup listing sniffed media resources',
  'sniff.beat3.title': 'Straight into the desktop app',
  'sniff.beat3.body':
    'No copying links between windows. The extension scouts, the desktop engine does the work.',
  'sniff.beat3.alt': 'A sniffed task appearing in the desktop app',

  'protocols.title': 'One app instead of five.',
  'protocols.body':
    'Most people juggle a download manager, a torrent client, a stream ripper, a video parser, and a command-line tool. Ghost Downloader replaces all of them.',
  'protocols.http.name': 'HTTP',
  'protocols.http.note': 'Smart chunking, no merge step',
  'protocols.torrent.name': 'BitTorrent',
  'protocols.torrent.note': 'Magnet links and .torrent files',
  'protocols.ftp.name': 'FTP',
  'protocols.ftp.note': 'Plain and over TLS',
  'protocols.m3u8.name': 'M3U8',
  'protocols.m3u8.note': 'On demand and live',
  'protocols.dash.name': 'MPEG-DASH',
  'protocols.dash.note': 'Adaptive streams',
  'protocols.ed2k.name': 'eD2k',
  'protocols.ed2k.note': 'The old network, still served',
  'protocols.live.title': 'Record live streams as they air',
  'protocols.live.body':
    'M3U8 capture with real-time decryption — on the desktop and on Android.',
  'protocols.live.alt': 'Ghost Downloader recording a live M3U8 stream',
  'protocols.parsers.title': 'Purpose-built parsers',
  'protocols.parsers.body':
    'YouTube and Bilibili up to 4K HDR, with subtitles and playlists. GitHub releases and HuggingFace models with mirror acceleration.',
  'protocols.parsers.alt':
    'Quality selection dialog showing 4K and HDR options',

  'protocols.android.title': 'Same engine on your phone',
  'protocols.android.body':
    'Live M3U8 recording and background downloads. Everything the desktop does, your phone does too.',
  'protocols.android.alt1': 'Ghost Downloader recording a live stream on Android',
  'protocols.android.alt2': 'Ghost Downloader download list on Android',
  'protocols.android.alt3': 'Ghost Downloader completion notification on Android',

  'download.windows.subtitle': 'Exe / Zip · x64 · arm64',
  'download.macos.subtitle': 'Apple Silicon / Intel · macOS 13+',
  'download.linux.subtitle': 'AppImage / Deb / Tar.xz · x64 · arm64',
  'download.android.subtitle': 'APK · Android 10+',
  'download.title.prefix': 'Get',
  'download.title.brand': 'Ghost Downloader',
  'download.subtitle': 'Five tools in one. Free and open source.',
  'download.unavailable': 'Release assets are loading — open GitHub releases.',
  'download.viewReleases': 'All releases',
  'download.installer': 'Installer',
  'download.portable': 'Portable',
  'download.appImage': 'AppImage',
  'download.deb': 'Debian package',
  'download.tarXz': 'Tar archive',
  'download.appleSilicon': 'Apple silicon',
  'download.intel': 'Intel',
  'download.x64': 'x64',
  'download.arm64': 'arm64',
  'download.recommended': 'Recommended',
  'download.app.title': 'App',
  'download.extension.title': 'Browser extension',
  'download.chrome.subtitle': 'Chrome Web Store',
  'download.edge.subtitle': 'Edge Add-ons',
  'download.firefox.subtitle': 'Firefox Add-ons',

  'footer.copyright': '© 2026 晓游. All Rights Reserved.',
  'footer.icp': '湘ICP备2026012876号-1',
  'footer.publicSecurity': '湘公网安备43072402000246号',
  'footer.docs': 'Documentation',
  'footer.github': 'GitHub',
  'footer.discord': 'Discord',
  'footer.qq': 'QQ group',
  'footer.donate': 'Donate',
} as const;
