export type AdminSettings = {
  depositBonusPercentage?: number;
  type: "depositbonus";
  rolling?: number;
  duration?: number;
};

export type BannerType = {
  _id: string;
  position: number;
  ctaName: string;
  ctaLink: string;
  banner: string;
  enabled: boolean;
};
