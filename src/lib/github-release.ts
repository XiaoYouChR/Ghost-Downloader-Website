const projectUrl = 'https://github.com/XiaoYouChR/Ghost-Downloader-3';
export const releasesUrl = `${projectUrl}/releases`;
const latestReleaseApiUrl =
  'https://api.github.com/repos/XiaoYouChR/Ghost-Downloader-3/releases/latest';

type ReleaseAsset = {
  browser_download_url?: string;
  name?: string;
};

type LatestReleaseResponse = {
  assets?: ReleaseAsset[];
  tag_name?: string;
};

export type DownloadAsset = {
  fileName: string;
  url: string;
};

export type DownloadPlatform = 'windows' | 'macos' | 'linux';
export type DownloadArchitecture = 'x64' | 'arm64';

export type DownloadReleaseData = {
  latestVersion: string | null;
  releaseUrl: string;
  windows: {
    exe: Partial<Record<DownloadArchitecture, DownloadAsset>>;
    zip: Partial<Record<DownloadArchitecture, DownloadAsset>>;
  };
  macos: Partial<Record<DownloadArchitecture, DownloadAsset>>;
  linux: Record<
    DownloadArchitecture,
    {
      appImage?: DownloadAsset;
      deb?: DownloadAsset;
      tarXz?: DownloadAsset;
    }
  >;
};

export type DownloadReleaseState = {
  data: DownloadReleaseData;
  hasAnyPlatformAsset: boolean;
  isFallback: boolean;
};

const emptyReleaseData: DownloadReleaseData = {
  latestVersion: null,
  linux: {
    arm64: {},
    x64: {},
  },
  macos: {},
  releaseUrl: releasesUrl,
  windows: {
    exe: {},
    zip: {},
  },
};

function createAsset(asset: ReleaseAsset): DownloadAsset | null {
  if (!asset.name || !asset.browser_download_url) {
    return null;
  }

  return {
    fileName: asset.name,
    url: asset.browser_download_url,
  };
}

function getArchitecture(name: string): DownloadArchitecture | null {
  if (name.includes('x86_64')) {
    return 'x64';
  }

  if (name.includes('arm64')) {
    return 'arm64';
  }

  return null;
}

function parseLatestRelease(payload: LatestReleaseResponse): DownloadReleaseData {
  const data: DownloadReleaseData = {
    latestVersion: payload.tag_name ?? null,
    linux: {
      arm64: {},
      x64: {},
    },
    macos: {},
    releaseUrl: releasesUrl,
    windows: {
      exe: {},
      zip: {},
    },
  };

  for (const asset of payload.assets ?? []) {
    if (!asset.name) {
      continue;
    }

    const parsedAsset = createAsset(asset);
    if (!parsedAsset) {
      continue;
    }

    const architecture = getArchitecture(asset.name);
    if (!architecture) {
      continue;
    }

    if (asset.name.includes('-Windows-')) {
      if (asset.name.endsWith('-Setup.exe')) {
        data.windows.exe[architecture] = parsedAsset;
      } else if (asset.name.endsWith('.zip')) {
        data.windows.zip[architecture] = parsedAsset;
      }
      continue;
    }

    if (asset.name.includes('-macOS-') && asset.name.endsWith('.dmg')) {
      data.macos[architecture] = parsedAsset;
      continue;
    }

    if (asset.name.includes('-Linux-')) {
      if (asset.name.endsWith('.AppImage')) {
        data.linux[architecture].appImage = parsedAsset;
      } else if (asset.name.endsWith('.deb')) {
        data.linux[architecture].deb = parsedAsset;
      } else if (asset.name.endsWith('.tar.xz')) {
        data.linux[architecture].tarXz = parsedAsset;
      }
    }
  }

  return data;
}

function hasAnyAsset(data: DownloadReleaseData) {
  return Boolean(
    data.windows.exe.x64 ||
      data.windows.exe.arm64 ||
      data.windows.zip.x64 ||
      data.windows.zip.arm64 ||
      data.macos.x64 ||
      data.macos.arm64 ||
      data.linux.x64.appImage ||
      data.linux.x64.deb ||
      data.linux.x64.tarXz ||
      data.linux.arm64.appImage ||
      data.linux.arm64.deb ||
      data.linux.arm64.tarXz,
  );
}

export async function getLatestDownloadRelease(): Promise<DownloadReleaseState> {
  try {
    const response = await fetch(latestReleaseApiUrl, {
      headers: {
        Accept: 'application/vnd.github+json',
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub latest release request failed: ${response.status}`);
    }

    const payload = (await response.json()) as LatestReleaseResponse;
    const data = parseLatestRelease(payload);

    return {
      data,
      hasAnyPlatformAsset: hasAnyAsset(data),
      isFallback: false,
    };
  } catch {
    return {
      data: emptyReleaseData,
      hasAnyPlatformAsset: false,
      isFallback: true,
    };
  }
}
