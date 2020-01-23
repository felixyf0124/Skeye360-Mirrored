
# Skeye 360 Backend for Detection and Tracking on Linux Ubuntu 18.04

## How to setup the Project
1. Install nvidia driver:
    * sudo apt-get update
    * sudo apt install ubuntu-drivers-common
    * sudo ubuntu-drivers autoinstall
    * sudo nvidia-smi
    
2. Install nvidia CUDA:
    * download deb from https://developer.nvidia.com/cuda-10.1-download-archive-base?target_os=Linux&target_arch=x86_64&target_distro=Ubuntu&target_version=1804&target_type=debnetwork
    * sudo dpkg -i cuda-repo-ubuntu1804_10.1.105-1_amd64.deb
    * sudo apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/7fa2af80.pub
    * sudo apt-get update
    * sudo apt-get install cuda
    
3. Install python3:
    * sudo apt install python3-pip
    * sudo apt-get install libopencv-highgui-dev
    
4. Install project dependencies:
    * cd /home/Soen490/Soen490/project/backend/backend_django/camera/
    * sudo pip3 install -r requirements.txt
    
5. Configure:
    * upload yolov3.weights to /home/Soen490/Soen490/project/backend/backend_django/darknet/
    * upload video file 20191117_1600.mp4 to /home/Soen490/Soen490/project/backend/backend_django/camera/
    * modify /home/Soen490/Soen490/project/backend/backend_django/darknet/cfg/coco.data 'names = /home/Soen490/Soen490/project/backend/backend_django/darknet/data/coco.names'

## How to start the Project

1. cd to /home/Soen490/Soen490/project/backend/backend_django/camera

2. Open terminal

3. Enter: python3 manage.py runserver 0.0.0.0:8000
