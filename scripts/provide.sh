#!/usr/bin/env bash

echo "===== INSTALL DEPENDENCIES ====="
sudo apt install msgpack-python python-gevent wget

echo "===== INSTALL ZERONET ====="
cd ..
wget https://github.com/HelloZeroNet/ZeroNet/archive/master.tar.gz
tar xvpfz master.tar.gz

echo "==== COPY FILES ===="
mkdir ZeroNet-master/data/15t2dFCcxamJnPkp5yTFfxGReeFphvmnE4
mv mixtape/ ZeroNet-master/data/15t2dFCcxamJnPkp5yTFfxGReeFphvmnE4/
cd ZeroNet-master/data/15t2dFCcxamJnPkp5yTFfxGReeFphvmnE4/
ls
