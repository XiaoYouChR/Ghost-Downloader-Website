export const appName = 'Ghost Downloader';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

export const gitConfig = {
  user: 'XiaoYouChR',
  repo: 'Ghost-Downloader-3',
  branch: 'main',
};

export const repoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

/** Off-site destinations, shared by the top bar and the footer so they cannot drift. */
export const externalLinks = {
  github: repoUrl,
  discord: 'https://discord.gg/fKfhkPumEM',
  qq: 'https://qm.qq.com/q/gPk6FR1Hby',
  blog: 'https://xychr.com/',
};

/** Docs pages linked from site chrome. Hardcoded paths — see CONTEXT.md. */
export const docsLinks = {
  donate: '/docs/support/donate',
};
