emcc n2n-crypto.cc \
  thirdparty/n2n/src/n2n.c thirdparty/n2n/src/aes.c thirdparty/n2n/src/curve25519.c \
  thirdparty/n2n/src/auth.c thirdparty/n2n/src/pearson.c \
  -lembind \
  -O2 \
  -s WASM=1 \
  -s MODULARIZE=1 \
  -s ENVIRONMENT=web \
  -s EXPORTED_FUNCTIONS=_free \
  -I thirdparty/n2n/include \
  -s NO_DISABLE_EXCEPTION_CATCHING=1 \
  -o n2n-crypto.mjs \
  --no-entry
