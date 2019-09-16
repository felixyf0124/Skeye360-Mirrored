#!/usr/bin/env bash

###############################################################################
# Given the name of a pipeline jenkins job, and the name of a pipeline script
# file, updates the jenkins job with the content of the pipeline script file
# and then runs the job.
###############################################################################
source libjenkins.sh

JOB_NAME=$1
PIPELINE_SCRIPT_FILE=$2

SERVER=http://localhost:$(get_server_port)

[[ ! -z "${JOB_NAME}" ]] || die "Please specify job name"
[[ -f ${PIPELINE_SCRIPT_FILE} ]] || die "Invalid pipeline script file"

download_ci_cli ${SERVER}
jenkins-cli ${SERVER} get-job "${JOB_NAME}" | replace_script ${PIPELINE_SCRIPT_FILE} | jenkins-cli ${SERVER} update-job "${JOB_NAME}"
jenkins-cli ${SERVER} build "${JOB_NAME}" -s -v
