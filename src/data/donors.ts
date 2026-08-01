export type DonationChannel = 'alipay' | 'wechat';

export interface Donor {
  name: string;
  amount: number;
  at: string;
  channel: DonationChannel;
  message?: string;
  anonymous?: boolean;
}

export const donors: Donor[] = [];
