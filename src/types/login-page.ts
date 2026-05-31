export type LoginPageProps = {
  token: string;
  connecting?: boolean;
  onTokenChange: (token: string) => void;
  onConnect: () => void;
};
