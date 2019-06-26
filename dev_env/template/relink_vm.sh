#!/bin/bash
###############################################################################
# Use this script to relink vagrant with its VM in Virtualbox, in cases
# where the .vagrant control directory is deleted by mistake.
#
# Run this script from the subdirectory of the VM.  For example:
#
# cd veme
# ../template/relink_vm.sh
###############################################################################

VM_NAME=$(basename $(pwd))
VM_ID=$(vboxmanage list vms | grep ${VM_NAME} | cut -d" " -f 2 | sed -e 's/{\(.*\)}/\1/')

if [ -z ${VM_ID} ]
then
    echo "Can't find VM ID for ${VM_NAME}."
    exit 1
fi

VAGRANT_DIR=".vagrant/machines/default/virtualbox"

mkdir -p ${VAGRANT_DIR}

echo "1.5:${VM_ID}" > "${VAGRANT_DIR}/action_provision"
echo "${VM_ID}" > "${VAGRANT_DIR}/id"

if [ ! -f "${VAGRANT_DIR}/private_key" ]
then
    cat <<EOF
Your vagrant setup for this VM is missing the ssh
private key file.  Start the VM manually in
the Virtualbox GUI, then issue the following terminal
command inside the VM:

sudo curl -L https://raw.githubusercontent.com/mitchellh/vagrant/master/keys/vagrant.pub -o /home/vagrant/.ssh/authorized_keys; sudo chmod 0600 /home/vagrant/.ssh/authorized_keys

Then shutdown the VM and try:

vagrant up
EOF
else
   cat <<EOF
Vagrant is relinked with VM ${VM_NAME}.
Try:

vagrant up

If vagrant complains that it can't connect with ssh,
then do the following:

1. On the host, do:

rm ${VAGRANT_DIR}/private_key

2. From inside the VM, issue this command:

sudo curl -L https://raw.githubusercontent.com/mitchellh/vagrant/master/keys/vagrant.pub -o /home/vagrant/.ssh/authorized_keys; sudo chmod 0600 /home/vagrant/.ssh/authorized_keys

Then shutdown the VM and try again:

vagrant up
EOF
fi
