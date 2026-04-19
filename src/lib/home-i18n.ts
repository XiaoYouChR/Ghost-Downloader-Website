export type HomeCopy = {
  hero: {
    badge: string;
    title: {
      line1: string;
      line2: string;
    };
    description: string;
    primaryCta: string;
    secondaryCta: string;
    flowLabels: {
      extension: string;
      media: string;
      tabs: string;
      storage: string;
      assets: string;
      tasks: string;
    };
  };
  browserShowcase: {
    badge: string;
    title: {
      prefix: string;
      highlight: string;
      suffix: string;
    };
    description: string;
    deepScan: {
      title: string;
      badge: string;
      description: string;
    };
    compactWidgets: {
      mobileSim: {
        title: string;
        description: string;
      };
      mediaLab: {
        title: string;
        description: string;
      };
      bridgeSync: {
        title: string;
        description: string;
        status: string;
      };
    };
    panel: {
      tabs: {
        downloads: string;
        sniffer: string;
        advanced: string;
      };
      connected: string;
      interceptDownloads: string;
      taskList: string;
      bridgeAction: string;
      autoMerge: string;
      syncComplete: string;
      completed: string;
      openFile: string;
      revealFolder: string;
      downloading: string;
      pause: string;
    };
    floatingCards: {
      snap: {
        title: string;
        description: string;
      };
      storage: {
        title: string;
        description: string;
      };
      edgeSim: {
        title: string;
        description: string;
      };
    };
  };
  features: {
    badge: string;
    title: {
      line1: string;
      highlight: string;
    };
    items: {
      sniffer: {
        title: string;
        description: string;
      };
      bilibiliEngine: {
        title: string;
        description: string;
      };
      hlsDash: {
        title: string;
        description: string;
      };
      httpSmartWrite: {
        title: string;
        description: string;
      };
      ftpFtps: {
        title: string;
        description: string;
      };
      githubAccel: {
        title: string;
        description: string;
      };
    };
  };
  protocols: {
    badge: string;
    title: {
      line1: string;
      highlight: string;
    };
    description: string;
    coreCard: {
      title: string;
      badge: string;
      description: string;
    };
    capabilities: {
      smartWrite: {
        title: string;
        badge: string;
      };
      identity: {
        title: string;
        badge: string;
      };
      scheduler: {
        title: string;
        badge: string;
      };
      remote: {
        title: string;
        badge: string;
      };
    };
    taskCompleted: string;
  };
  download: {
    title: {
      line1: string;
      highlight: string;
    };
    description: string;
    latest: string;
    installer: string;
    portable: string;
    appleSilicon: string;
    intel: string;
    x64: string;
    arm64: string;
    viewAllReleases: string;
    recommended: string;
    appImage: string;
    deb: string;
    tarXz: string;
    downloads: {
      windows: {
        label: string;
        version: string;
      };
      macos: {
        label: string;
        version: string;
      };
      linux: {
        label: string;
        version: string;
      };
    };
    alsoAvailableAs: string;
    browsers: {
      chrome: string;
      edge: string;
      firefox: string;
      addonSuffix: string;
    };
    footer: {
      copyright: string;
      githubSource: string;
      documentation: string;
      privacy: string;
    };
  };
};

const englishHomeCopy: HomeCopy = {
  hero: {
    badge: 'The Future of Resource Orchestration',
    title: {
      line1: 'Resources, brought',
      line2: 'back to life.',
    },
    description:
      'Ghost Downloader is an invisible, intelligent hub that bridges the chasm between the web and your desktop. Multi-protocol, cross-platform, and purely discreet.',
    primaryCta: 'Download Hub',
    secondaryCta: 'View Docs',
    flowLabels: {
      extension: 'Extension',
      media: 'Media',
      tabs: 'Tabs',
      storage: 'Storage',
      assets: 'Assets',
      tasks: 'Tasks',
    },
  },
  browserShowcase: {
    badge: 'Browser Outpost',
    title: {
      prefix: 'The',
      highlight: 'Outpost',
      suffix: 'of discovery.',
    },
    description:
      'Command your browser. Discover and route any web resource directly to your desktop.',
    deepScan: {
      title: 'Deep Scan Outpost',
      badge: 'Core',
      description:
        'Sniff memory, cache and HLS/Dash streams before they even buffer.',
    },
    compactWidgets: {
      mobileSim: {
        title: 'Mobile Sim',
        description: 'iOS/Android spoofing.',
      },
      mediaLab: {
        title: 'Media Lab',
        description: 'WebRTC recording.',
      },
      bridgeSync: {
        title: 'Bridge Sync',
        description: 'Direct pipe to your desktop.',
        status: 'Connected',
      },
    },
    panel: {
      tabs: {
        downloads: 'Downloads',
        sniffer: 'Sniffer',
        advanced: 'Advanced',
      },
      connected: 'Connected',
      interceptDownloads: 'Intercept Downloads',
      taskList: 'Task List (1)',
      bridgeAction: 'Bridge All to Desktop',
      autoMerge: 'Auto-Merge Audio/Video',
      syncComplete: 'Sync Complete',
      completed: 'Completed',
      openFile: 'Open File',
      revealFolder: 'Open Folder',
      downloading: 'Actived',
      pause: 'Pause',
    },
    floatingCards: {
      snap: {
        title: 'Snap',
        description: 'Screen Region',
      },
      storage: {
        title: 'Storage',
        description: 'Real-time Sync',
      },
      edgeSim: {
        title: 'Edge Sim',
        description: 'iPhone 15 Pro',
      },
    },
  },
  features: {
    badge: 'Engineered for Perfection',
    title: {
      line1: 'Invisible Infrastructure.',
      highlight: 'Visible Performance.',
    },
    items: {
      sniffer: {
        title: 'The Sniffer',
        description:
          'Intelligent resource detection across all active tabs, identifying HLS, DASH, and dynamic streams.',
      },
      bilibiliEngine: {
        title: 'Bilibili Engine',
        description: 'Direct video & audio parsing.',
      },
      hlsDash: {
        title: 'HLS / DASH / m3u8',
        description: 'Live stream segment parallelization.',
      },
      httpSmartWrite: {
        title: 'HTTP Smart Write',
        description:
          'Direct-to-disk chunk writing to save memory and SSD lifespan.',
      },
      ftpFtps: {
        title: 'FTP / FTPS',
        description: 'Secure legacy file transfers.',
      },
      githubAccel: {
        title: 'GitHub Accel',
        description: 'Bypass regional blockades for release downloads.',
      },
    },
  },
  protocols: {
    badge: 'Desktop Core',
    title: {
      line1: 'A Native experience,',
      highlight: 'Perfectly at home.',
    },
    description:
      "Ghost Downloader isn't just a background service. It's a high-performance desktop hub designed for clarity and absolute performance.",
    coreCard: {
      title: 'Multi-Thread Engine',
      badge: 'Core',
      description:
        'Dynamic thread allocation for up to 256 parallel chunks per resource.',
    },
    capabilities: {
      smartWrite: {
        title: 'Smart Write',
        badge: 'H-Disk',
      },
      identity: {
        title: 'Identity',
        badge: 'SSL',
      },
      scheduler: {
        title: 'Scheduler',
        badge: 'Tasks',
      },
      remote: {
        title: 'Remote',
        badge: 'API',
      },
    },
    taskCompleted: 'Task Completed',
  },
  download: {
    title: {
      line1: 'Perfect Capture.',
      highlight: 'Purely Discreet.',
    },
    description:
      'Quiet, multi-platform, and free forever. The modern resource hub for the open web.',
    latest: 'Latest',
    installer: 'Installer',
    portable: 'Portable',
    appleSilicon: 'Apple Silicon',
    intel: 'Intel',
    x64: 'x64',
    arm64: 'ARM64',
    viewAllReleases: 'View all releases',
    recommended: 'Recommended',
    appImage: 'AppImage',
    deb: 'Deb',
    tarXz: 'Tar.xz',
    downloads: {
      windows: {
        label: 'Windows',
        version: 'Exe / Zip',
      },
      macos: {
        label: 'macOS',
        version: 'Apple Silicon / Intel',
      },
      linux: {
        label: 'Linux',
        version: 'AppImage / Deb / Tar.xz',
      },
    },
    alsoAvailableAs: 'Also available as',
    browsers: {
      chrome: 'Chrome',
      edge: 'Edge',
      firefox: 'Firefox',
      addonSuffix: 'Add-on',
    },
    footer: {
      copyright: '© 2026 晓游. All Rights Reserved.',
      githubSource: 'Source',
      documentation: 'Documentation',
      privacy: '湘ICP备2026012876号-1',
    },
  },
};

const homeCopies = {
  en: englishHomeCopy,
  zh: {
    hero: {
      badge: '新一代资源调度中枢',
      title: {
        line1: '资源',
        line2: '随心而至',
      },
      description:
        'Ghost Downloader 是一款静默智能的下载中枢，让网页资源直达桌面。多协议、跨平台，无感运行',
      primaryCta: '免费下载',
      secondaryCta: '查看文档',
      flowLabels: {
        extension: '扩展',
        media: '媒体',
        tabs: '标签页',
        storage: '存储',
        assets: '资源',
        tasks: '任务',
      },
    },
    browserShowcase: {
      badge: '浏览器前哨站',
      title: {
        prefix: '',
        highlight: '前哨站',
        suffix: '掌控全局',
      },
      description: '不只是发送链接，它是浏览器里的资源控制台。发现、接管并整理网页资源，无缝桥接至桌面端。',
      deepScan: {
        title: '深度嗅探',
        badge: '核心',
        description: '在视频缓冲前，精准拦截页面缓存与 HLS/DASH 流媒体。',
      },
      compactWidgets: {
        mobileSim: {
          title: '移动端模拟',
          description: '模拟手机端访问',
        },
        mediaLab: {
          title: '媒体录制',
          description: '视频与 WebRTC 录制',
        },
        bridgeSync: {
          title: '桥接同步',
          description: '桌面任务实时同步',
          status: '已连接',
        },
      },
      panel: {
        tabs: {
          downloads: '下载任务',
          sniffer: '资源嗅探',
          advanced: '高级功能',
        },
        connected: '已连接',
        interceptDownloads: '接管浏览器下载',
        taskList: '任务列表 (1)',
        bridgeAction: '一键桥接至桌面',
        autoMerge: '音视频自动合并',
        syncComplete: '同步完成',
        completed: '已完成',
        openFile: '打开文件',
        revealFolder: '打开文件夹',
        downloading: '下载中',
        pause: '暂停',
      },
      floatingCards: {
        snap: {
          title: '屏幕捕捉',
          description: '自定义区域截图',
        },
        storage: {
          title: '缓存捕捉',
          description: '深度挖掘网页资源',
        },
        edgeSim: {
          title: '设备伪装',
          description: '模拟 iPhone 15 Pro',
        },
      },
    },
    features: {
      badge: '极致匠心',
      title: {
        line1: '隐于无形',
        highlight: '性能尽显',
      },
      items: {
        sniffer: {
          title: '智能嗅探',
          description:
            '跨越所有标签页，精准识别 HLS、DASH 及动态流媒体资源。',
        },
        bilibiliEngine: {
          title: '哔哩哔哩专属引擎',
          description: '直接解析 B站 视频与音频。',
        },
        hlsDash: {
          title: 'HLS / DASH / m3u8',
          description: '直播流分片并行下载。',
        },
        httpSmartWrite: {
          title: 'HTTP 智能写入',
          description: '分块直写磁盘，告别合并步骤，节省内存与硬盘寿命。',
        },
        ftpFtps: {
          title: 'FTP / FTPS',
          description: '安全稳定的传统文件传输。',
        },
        githubAccel: {
          title: 'GitHub 加速',
          description: '突破区域限制，极速下载 Release 资源。',
        },
      },
    },
    protocols: {
      badge: '桌面枢纽',
      title: {
        line1: '原生体验',
        highlight: '无缝契合',
      },
      description:
        'Ghost Downloader 不仅是后台服务，它更是一个为极致清晰与绝对性能而生的桌面枢纽。',
      coreCard: {
        title: '多线程引擎',
        badge: '核心',
        description: '智能动态线程调度，单资源最高 256 并发分块。',
      },
      capabilities: {
        smartWrite: {
          title: '智能写入',
          badge: '直写硬盘',
        },
        identity: {
          title: '身份伪装',
          badge: 'SSL',
        },
        scheduler: {
          title: '调度器',
          badge: '任务',
        },
        remote: {
          title: '远程控制',
          badge: 'API',
        },
      },
      taskCompleted: '任务完成',
    },
    download: {
      title: {
        line1: '精准获取',
        highlight: '安静无感',
      },
      description:
        '安静、跨平台、永久免费。属于开放网络的现代资源枢纽。',
      latest: '最新版本',
      installer: '安装版',
      portable: '便携版',
      appleSilicon: 'Apple Silicon',
      intel: 'Intel',
      x64: 'x64',
      arm64: 'ARM64',
      viewAllReleases: '查看全部版本',
      recommended: '推荐',
      appImage: 'AppImage',
      deb: 'Deb',
      tarXz: 'Tar.xz',
      downloads: {
        windows: {
          label: 'Windows',
          version: 'Exe / Zip',
        },
        macos: {
          label: 'macOS',
          version: 'Apple Silicon / Intel',
        },
        linux: {
          label: 'Linux',
          version: 'AppImage / Deb / Tar.xz',
        },
      },
      alsoAvailableAs: '同时支持',
      browsers: {
        chrome: 'Chrome',
        edge: 'Edge',
        firefox: 'Firefox',
        addonSuffix: '扩展',
      },
      footer: {
        copyright: '© 2026 晓游. All Rights Reserved.',
        githubSource: '源码',
        documentation: '文档',
        privacy: '湘ICP备2026012876号-1',
      },
    },
  },
} satisfies Record<'en' | 'zh', HomeCopy>;

export function getHomeCopy(locale: string): HomeCopy {
  return homeCopies[locale === 'zh' ? 'zh' : 'en'];
}
