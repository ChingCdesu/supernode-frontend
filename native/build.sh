#!/usr/bin/env bash

DIRNAME=$( dirname -- "$( readlink -f -- "$0"; )"; )

N2NDIR=$DIRNAME/thirdparty/n2n
SRCDIR=$N2NDIR/src
INCDIR=$N2NDIR/include

emcc $DIRNAME/n2n-crypto.cc \
  $SRCDIR/n2n.c $SRCDIR/aes.c $SRCDIR/curve25519.c \
  $SRCDIR/auth.c $SRCDIR/pearson.c \
  -lembind \
  -O2 \
  -s WASM=1 \
  -s MODULARIZE=1 \
  -s ENVIRONMENT=web \
  -s EXPORTED_FUNCTIONS=_free \
  -I $INCDIR \
  -s NO_DISABLE_EXCEPTION_CATCHING=1 \
  -o $DIRNAME/n2n-crypto.mjs \
  --no-entry
