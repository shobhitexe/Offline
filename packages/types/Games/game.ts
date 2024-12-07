export type GameType = {
  game_id: string;
  game_name: string;
  category: string;
  provider_name: string;
  sub_provider_name: string;
  status: string;
  url_thumb: string;
  game_code: string;
};

export type gameSessionType = {
  userId: string;
  token: string;
  url: string;
  providerId: string;
  providerName: string;
  status: string;
  errorDescripion: string;
};
