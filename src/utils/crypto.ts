import init, { type N2nCrypto } from "@native/n2n-crypto";

let _crypto: N2nCrypto | undefined = undefined;

export async function generate_user_token(
  user_id: string,
  user_password: string
) {
  if (!_crypto) {
    _crypto = await init();
  }
  return _crypto.generate_user_token(user_id, user_password);
}
