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
  { name: '', amount: 30, at: '2026-10-26', channel: 'alipay', anonymous: true, message: '加油' },
  { name: '', amount: 10, at: '2026-10-25', channel: 'alipay', anonymous: true, message: '你爱我，我爱你，买杯蜜雪冰城甜蜜蜜🥰' },
  { name: '', amount: 10, at: '2026-10-21', channel: 'alipay', anonymous: true },
  { name: '', amount: 19, at: '2026-10-19', channel: 'alipay', anonymous: true },
  { name: '', amount: 10, at: '2026-09-30', channel: 'alipay', anonymous: true },
  { name: '', amount: 50, at: '2026-09-09', channel: 'alipay', anonymous: true },
  { name: '91gameVIP', amount: 50, at: '2026-10-26', channel: 'wechat' },
  { name: '语', amount: 1, at: '2026-10-25', channel: 'wechat' },
  { name: 'DeDe', amount: 1, at: '2026-10-24', channel: 'wechat', message: '打倒那些不要脸的' },
  { name: '钦乾', amount: 1, at: '2026-10-23', channel: 'wechat', message: '钦乾——一只貔貅对你的小小感谢' },
  { name: 'UNION HOUDINI NO.1', amount: 1, at: '2026-10-23', channel: 'wechat' },
  { name: '龍5', amount: 10, at: '2026-10-23', channel: 'wechat', message: '非常棒的下载工具🎉' },
  { name: '404', amount: 1, at: '2026-10-22', channel: 'wechat', message: '赞👍' },
  { name: '沉默之殇', amount: 20, at: '2026-10-21', channel: 'wechat' },
  { name: 'rachael', amount: 2.88, at: '2026-10-20', channel: 'wechat' },
  { name: '酥芯鎏煌', amount: 1, at: '2026-10-18', channel: 'wechat', message: 'Very excellent' },
  { name: '🐾', amount: 2, at: '2026-10-16', channel: 'wechat', message: '好用 喜欢' },
  { name: '87℃水煮鱼', amount: 5, at: '2026-10-16', channel: 'wechat', message: '感谢' },
  { name: '0x34Hz', amount: 10, at: '2026-10-10', channel: 'wechat', message: '加油' },
  { name: '', amount: 3, at: '2026-09-24', channel: 'wechat', anonymous: true },
  { name: '飞啊飞', amount: 9.9, at: '2026-09-07', channel: 'wechat', message: '谢谢加油' },
  { name: 'Asris Ren | 任岸柯', amount: 1, at: '2026-08-27', channel: 'wechat' },
  { name: '', amount: 10, at: '2026-08-20', channel: 'wechat', anonymous: true, message: '喝杯蜜雪'},
  { name: '缘', amount: 50, at: '2026-08-20', channel: 'wechat'},
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
