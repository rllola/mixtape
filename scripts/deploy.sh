#!/usr/bin/env bash

echo "===== DEPLOY ====="
cd ../ZeroNet-master
python zeronet.py siteSign 1MzSDy3x8cFrt3P2YkXNN7ogYDFfKX6hnP $ZERONET_KEY_STAGING
python zeronet.py sitePublish 1MzSDy3x8cFrt3P2YkXNN7ogYDFfKX6hnP 51.15.214.168

echo "===== EXIT ====="
exit 0
