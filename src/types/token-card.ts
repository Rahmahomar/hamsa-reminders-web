export type TokenCardProps = {
  token: string;
  connected: boolean;
  onTokenChange: (token: string) => void;
  onConnect: () => void;
};
