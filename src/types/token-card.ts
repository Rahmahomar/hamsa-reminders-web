export type TokenCardProps = {
  token: string;
  connected: boolean;
  connecting?: boolean;
  onTokenChange: (token: string) => void;
  onConnect: () => void;
  onLogout: () => void;
};
