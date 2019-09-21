#!/bin/bash


# Change file different character between windows and VM
sudo sed -i -e 's/\r$//' install_opencv.sh

# Install dependencies
sudo bash install_opencv.sh

# Execute openCV
python3 video.py
