#!/usr/bin/env bash

echo "===== DEPLOY ====="
pwd
cd ../
ls
python zeronet.py peerPing 51.15.214.168
python zeronet.py siteSign --ppublish 1MzSDy3x8cFrt3P2YkXNN7ogYDFfKX6hnP $ZERONET_KEY_STAGING

echo "===== EXIT ====="
exit 0
