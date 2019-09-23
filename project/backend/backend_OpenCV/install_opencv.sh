#!/bin/bash
# Change file different character between windows and VM
sudo sed -i -e 's/\r$//' install_opencv.sh

# Update repository
sudo apt update

# Install pip3
sudo apt -y install python3-pip

# Install opencv
sudo pip3 install opencv-python
