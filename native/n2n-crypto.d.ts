export interface N2nCrypto {
  generate_user_token(user_id: string, user_password: string): string;
}

export default function init(): Promise<N2nCrypto>;
