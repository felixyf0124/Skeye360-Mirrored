# Soen490 development enviroment

## Introduction

This dev_env provides a framework to create reproducible development environments.

More specifically, it creates VirtualBox virtual machines that contain all the development tools required to work on a given programming project. In addition, it sets optimal VM settings for the created VM, such as turning on hardware acceleration, enabling some VM features that are hidden from the GUI and only available on the VirtualBox CLI, and setting up shared folders to the host automatically (a task not that easy in an Ubuntu VM).

A developer only has to provide some user-specific information, and issue one command to get a customized VM ready for use, complete with its own user account. The developer can then keep up-to-date with any important changes to the development environment by using another simple command.

## Getting Started

### Prerequisites

Note that this procedure has been tested from a Windows host only, but should work equally well from a Linux or Mac OS host.   

1.	**Ensure that Hyper-V is off:**
  
    * Click on Search Window (magnifier glass) and type "windows features". Allow the changes.
  
    * Click on Turn Windows features on or off.
  
    * If the Turn Windows features on or off, if not already so, untick Hyper-V.
    
      or 
    
    * in PowerShell run the command:
    
    ```
    Disable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All
    ```
    
2.	**Install Oracle [VM VirtualBox Manager](https://download.virtualbox.org/virtualbox/6.0.2/VirtualBox-6.0.2-128162-Win.exe) (preferably v  6.0.2).**

3.	**Install [VirtualBox Extension Pack](https://download.virtualbox.org/virtualbox/6.0.2/Oracle_VM_VirtualBox_Extension_Pack-6.0.2.vbox-extpack) (preferably v  6.0.2).**

    * If the aboved links does not working, check the [virtualbox v 6.0.2](https://www.google.com/search?q=virtualbox+6.0.2&oq=vi&aqs=chrome.1.69i59l2j69i57j69i60l3.4687j0j1&sourceid=chrome&ie=UTF-8) from google and download it on your local machine.

4.  `vboxmanage` **must be in your PATH. Add the virtualbox installation directory to your PATH. By default on Windows this is `c:\program files\oracle\virtualbox\`**

5.  **Install latest [Vagrant](https://www.vagrantup.com/downloads.html).**

6. **```vagrant``` must be in your PATH. Add the virtualbox installation directory to your PATH.**

7. **Install the following vagrant plugins:**

    * vagrant-vbguest, a Vagrant plugin which automatically installs the host's VirtualBox Guest Additions on the guest system.
    
    ```vagrant plugin install vagrant-vbguest```
    
    Reference: https://github.com/dotless-de/vagrant-vbguest

    * vagrant-disksize: a Vagrant plugin to resize disks in VirtualBox.
    
    ```vagrant plugin install vagrant-disksize```
    
    Reference: https://github.com/sprotheroe/vagrant-disksize
   

### Before start

1.  **Setup your ssh key**

    * open vagrant.yml file which is under devenv folder(\soen490_dev_env\vagrant\devenv), and change user, email and ssh directory
    
    For the ssh directory, use forward slashes For example: c:/Users/vince/.ssh  (you can find it in your windows machine)

### Start

1.  **First time start VM machine**
      
     `vagrant up --provision-with ansible_local`
    
    **If you stuck during installing ansible, close the Virtualbox VM and launch it again(do manually). Login VM use username:vagrant and password:vagrant. After you login, type `sudo dpkg --configure -a` in your VirtualBox VM(manually). Choosing Yes then closing VM after you finsh installation. Go back to terminal, use `vagrant reload --provision-with ansible_local`**
    
     
2.  **After first time start VM machine**
      
      `vagrant up`
  
### Solutions for some common issues 

* How can I handle alphabet issues between host machine and vm machine?

    Before you clone any repo in your local machine(Window), Please using the following command to configure git to handle line endings issues:
   
   ```git config --global core.autocrlf input```

* How can I stop my vagrant machine?

  `vagrant halt`

* How can I destroy vagrant machine?

  `vagrant destroy`

* How can I ssh to my vm machine from local machine?

  `vagrant ssh`
  
* How can I update my new machine setting without destory it?
  
  `vagrant reload`

* How can I solve `A VirtualBox machine with the name 'devenv' already exists.` ?
  
  1. Go to VirtualBox VM(manually) delete devenv machine
  2. Go to C:\Users\{username}\VirtualBox VMs delete devenv folder

## More reference

   [vagrant documentation](https://www.vagrantup.com/docs/index.html)

## Authors

* Li Sun - *1st version*
