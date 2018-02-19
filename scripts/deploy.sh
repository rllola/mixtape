#!/usr/bin/env bash

echo "===== DEPLOY ====="
cd ZeroNet-master
python zeronet.py peerPing 51.15.214.168
python zeronet.py help

echo "===== EXIT ====="
exit 0
