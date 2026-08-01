import { type Donor, donors } from '@/data/donors';

const i18n = {
  en: {
    count: (n: number) => `${n} supporter${n === 1 ? '' : 's'} total`,
    empty: 'The donor list is being compiled.',
    anonymous: 'Anonymous',
    alipay: 'Alipay',
    wechat: 'WeChat Pay',
  },
  zh: {
    count: (n: number) => `共 ${n} 位支持者`,
    empty: '名单整理中。',
    anonymous: '匿名支持者',
    alipay: '支付宝',
    wechat: '微信支付',
  },
} as const;

function cmpDate(a: Donor, b: Donor) {
  return b.at.localeCompare(a.at);
}

export function Donors({ lang = 'en' }: { lang?: string }) {
  const t = lang === 'zh' ? i18n.zh : i18n.en;
  const sorted = [...donors].sort(cmpDate);

  if (sorted.length === 0) {
    return <p className="text-fd-muted-foreground my-6 text-sm">{t.empty}</p>;
  }

  return (
    <div className="not-prose my-6">
      <p className="text-fd-muted-foreground mb-3 text-sm font-medium">
        {t.count(sorted.length)}
      </p>
      <ul className="divide-fd-border border-fd-border divide-y rounded-lg border">
        {sorted.map((d, i) => (
          <li
            key={`${d.at}-${i}`}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3"
          >
            <span className="text-fd-foreground text-sm font-medium">
              {d.anonymous ? t.anonymous : d.name}
            </span>
            <span className="text-fd-foreground font-mono text-sm tabular-nums">
              ¥{d.amount}
            </span>
            <span className="text-fd-muted-foreground basis-full font-mono text-xs">
              {d.at} · {t[d.channel]}
            </span>
            {d.message && (
              <p className="text-fd-muted-foreground basis-full text-sm">
                {d.message}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
