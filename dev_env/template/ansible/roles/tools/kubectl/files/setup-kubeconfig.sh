# Picks up the default kubectl config in ~/.kube/config, plus any extra configs in
# ${KUBECONFIG_DIR} and sets up the KUBECONFIG environment variable accordingly.
#
# Source it in .bashrc:
#
# . kubeconfig_mgmt.sh
#
# To set another location for the config file directory:
#
# export KUBECONFIG_DIR=~/kubectl_config_dir/
# . kubeconfig_mgmt.sh
#
# $KUBECONFIG_DIR will be created if it doesn't exist.  The script picks up all files
# in that directory, so make sure they're all valid kubectl config files.
#
# After adding new files to KUBECONFIG_DIR, restart the shell for changes to take effect.
#
# Inspired from: https://medium.com/@jmarhee/managing-kubernetes-config-contexts-fbe710fa756a

export KUBECONFIG_DIR=${KUBECONFIG_DIR:-${HOME}/.kube/configs}

function join_str {
    local IFS="$1"
    shift
    echo "$*"
}

function initConfigVar () {
    local defaultconfig=""
    export KUBECONFIG=""

    if [[ -f ~/.kube/config ]]
    then
        defaultconfig=~/.kube/config
    fi

    if [[ $(ls ${defaultconfig} ${KUBECONFIG_DIR} | wc -l) != 0 ]]
    then
        export KUBECONFIG=$(join_str : $(find ${defaultconfig} ${KUBECONFIG_DIR} -type f) | sed -e 's/:$//')
    fi
}

if [[ -d ${KUBECONFIG_DIR} ]]
then
    initConfigVar
else
    mkdir -p ${KUBECONFIG_DIR} && echo "Put kubectl configs in ${KUBECONFIG_DIR}/ and restart this shell to apply changes."
fi
