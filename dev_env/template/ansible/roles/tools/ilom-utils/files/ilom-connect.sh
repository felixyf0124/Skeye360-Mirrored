#!/bin/bash

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
ilom_node=$1
java_exception_sites=~/.java/deployment/security/exception.sites

if [ -z ${ilom_node} ]
then
    echo "Please specify ilom node to which to connect"
    exit 1
fi

site_present=$(grep -w ${ilom_node} ${java_exception_sites} > /dev/null 2>&1; echo $?)

if [ "${site_present}" != "0" ]
then
    cat<<EOF >> ${java_exception_sites}
http://${ilom_node}
https://${ilom_node}:443
EOF
fi

# In case another version of java cached the same app, the ilom jre will
# not be able to run it.  So clear the cache.
rm -rf ~/.java/deployment/cache/

${SCRIPT_DIR}/jre1.8.0_73/bin/javaws ${SCRIPT_DIR}/${ilom_node}.jnlp
