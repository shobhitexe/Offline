export type WalletDetails = {
  name: string;
  accountType: string;
  accountNumber: string;
  IFSCcode: string;
  user: string;
};

export type InputWalletDetailsType = WalletDetails & {
  otp: string;
  phone: string;
  email: string;
  data?: boolean;
};

export type RequestWithdrawalType = {
  user: string;
  phone: string;
  otp: string;
  method: string;
  amount: number;
  status?: string;
  createdAt?: string;
};
