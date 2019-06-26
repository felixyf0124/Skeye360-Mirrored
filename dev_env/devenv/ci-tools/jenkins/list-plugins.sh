#!/usr/bin/env bash

###############################################################################
# Prints the list of installed plugins and their version.
###############################################################################

source libjenkins.sh

SERVER=http://localhost:$(get_server_port)

download_ci_cli ${SERVER}
jenkins-cli ${SERVER} groovy = <<'EOF'
import jenkins.model.*

Jenkins.instance.pluginManager.plugins.each{
  plugin ->
    println ("${plugin.getShortName()}:${plugin.getVersion()}")
}
EOF
