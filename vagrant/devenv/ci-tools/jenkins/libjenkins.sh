#!/usr/bin/env bash

###############################################################################
# A bash include file of library functions to access jenkins
###############################################################################

function die {
    echo $@
    exit 1
}

function jenkins-cli {
    local server=$1
    java -jar jenkins-cli.jar -auth admin:admin -s ${server} "${@:2}"
}

function replace_script {
    local script_file=$1

    read -r -d '' GROOVY_SCRIPT <<-'EOF'
    /*
     * Reads the XML of a jenkins pipeline job from stdin, and injects the content of the given pipeline script file
     * into the <script> section of the XML.  The resulting pipeline job XML is output to stdout.
     *
     */
    import groovy.xml.*

    def pipelineScriptFile = new File(args[0])

    def xml = new XmlParser().parse(System.in)
    xml.definition[0].script[0].value = pipelineScriptFile.text.trim()

    println XmlUtil.serialize(xml)
EOF

    groovy -cp jenkins-cli.jar -e "${GROOVY_SCRIPT}" "${script_file}"
}

function get_server_port() {
    docker-compose port server 8080 | sed -e 's/^.*://'
}

function download_ci_cli() {
    local server=$1
    if [ ! -f jenkins-cli.jar ]
    then
        curl -O ${server}/jnlpJars/jenkins-cli.jar
    fi

}
