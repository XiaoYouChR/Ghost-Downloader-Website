export type DonationChannel = 'alipay' | 'wechat';

export interface Donor {
  name: string;
  amount: number;
  at: string;
  channel: DonationChannel;
  message?: string;
  anonymous?: boolean;
}

export const donors: Donor[] = [
  { name: '白板', amount: NaN, at: '2026-08-14', channel: 'wechat', message: '原道耳机: 早知道, 还是原道'},
  { name: '', amount: 100, at: '2026-08-14', channel: 'alipay', anonymous: true},
  { name: 'XUESHENG', amount: 20, at: '2026-08-13', channel: 'alipay' },
  { name: 'XUESHENG', amount: 20, at: '2026-08-04', channel: 'alipay' },
  { name: '嗨购', amount: 18.88, at: '2026-08-02', channel: 'alipay' },
  { name: '随心而哘', amount: 25, at: '2026-07-28', channel: 'alipay', message: '喝杯咖啡' },
  { name: 'K.MOHIT', amount: 3, at: '2026-07-26', channel: 'alipay' },
  { name: 'XUESHENG', amount: 50, at: '2026-07-11', channel: 'alipay' },
  { name: 'XUESHENG', amount: 10, at: '2026-06-20', channel: 'alipay' },
  { name: 'XUESHENG', amount: 29, at: '2026-05-01', channel: 'alipay' },
  { name: 'XUESHENG', amount: 6, at: '2026-04-21', channel: 'alipay' },
  { name: '', amount: 16, at: '2026-07-29', channel: 'wechat', anonymous: true, message: '喝杯沪上阿姨' },
  { name: '', amount: 10, at: '2026-07-28', channel: 'wechat', anonymous: true, message: 'gd好用, 期待新作品' },
  { name: 'makotown', amount: 50, at: '2026-06-05', channel: 'wechat', message: '支持下 Ghost Downloader' },
];
