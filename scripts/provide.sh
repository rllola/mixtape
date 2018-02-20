#!/usr/bin/env bash

echo "===== INSTALL DEPENDENCIES ====="
sudo apt install msgpack-python python-gevent wget

echo "===== INSTALL ZERONET ====="
cd ..
wget https://github.com/HelloZeroNet/ZeroNet/archive/master.tar.gz
tar xvpfz master.tar.gz

echo "==== COPY FILES ===="
mkdir ZeroNet-master/data
mkdir ZeroNet-master/data/1MzSDy3x8cFrt3P2YkXNN7ogYDFfKX6hnP

cd mixtape
ls -A
cd ..

mv mixtape/* ZeroNet-master/data/1MzSDy3x8cFrt3P2YkXNN7ogYDFfKX6hnP/

echo "==== BUILD DIST ===="
cd ZeroNet-master/data/1MzSDy3x8cFrt3P2YkXNN7ogYDFfKX6hnP/
npm install
ls -A
npm run build
