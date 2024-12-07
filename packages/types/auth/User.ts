export type UserType = {
  _id?: string;
  name?: string;
  phone: string;
  email: string;
  password: string;
  OTP?: string;
  promocode?: string;
  referId?: string;
  status?: string;
  cashBalance?: string;
  bonusBalance?: string;
  addedBy?: { _id: string; name: string };
};

export type AdminType = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  role: string;
  commission?: number;
  agentType?: string;
};
