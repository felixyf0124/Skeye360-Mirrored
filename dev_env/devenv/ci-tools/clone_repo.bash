#!/bin/bash
cd /home/${USER}/git/

git clone -b afg_rbt ssh://${USER}@gerritmirror-ha.rnd.ki.sw.ericsson.se:29418/msp/rbt

cd rbt
git checkout -b afg_rbt_test
