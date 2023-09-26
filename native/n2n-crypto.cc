#include <emscripten/bind.h>
extern "C"
{
#include "thirdparty/n2n/include/n2n.h"
}

using namespace emscripten;

std::string generate_user_token(const std::string &user_id, const std::string &user_secret)
{
  n2n_private_public_key_t prv; /* 32 bytes private key                        */
  n2n_private_public_key_t bin; /* 32 bytes public key binary output buffer    */
  char asc[44];                 /* 43 bytes + 0-terminator ascii string output */

  generate_private_key(prv, const_cast<char*>(user_secret.c_str()));

  bind_private_key_to_username(prv, const_cast<char*>(user_id.c_str()));

  // calculate the public key into binary output buffer
  generate_public_key(bin, prv);

  // clear out the private key
  memset(prv, 0, sizeof(prv));

  // convert binary output to 6-bit-ascii string output
  bin_to_ascii(asc, bin, sizeof(bin));

  return std::string(asc);
}

EMSCRIPTEN_BINDINGS(n2n_crypto)
{
  emscripten::function("generate_user_token", &generate_user_token);
}
