FROM jenkins/jenkins:2.89.2

USER root

ARG JENKINS_HOME=/var/jenkins_home
#ARG job_name_1="00-vafg-sandbox-source"
ARG job_name_2="01-RBT-sandbox-build"

ENV JENKINS_USER admin
ENV JENKINS_PASS admin
ENV JENKINS_HOME $JENKINS_HOME

# Skip initial setup
ENV JAVA_OPTS -Djenkins.install.runSetupWizard=false

# Useful to not have to specify -s option when running jenkins-cli.jar from inside the container
ENV JENKINS_URL http://localhost:8080

COPY ref/ /usr/share/jenkins/ref/
RUN /usr/local/bin/install-plugins.sh < /usr/share/jenkins/ref/plugins.txt

COPY /ref/config.xml "$JENKINS_HOME"/config.xml

#RUN mkdir -p "$JENKINS_HOME"/workspace/${job_name_1}
#RUN mkdir -p "$JENKINS_HOME"/jobs/${job_name_1}
#COPY /ref/${job_name_1}_config.xml "$JENKINS_HOME"/jobs/${job_name_1}/config.xml

RUN mkdir -p "$JENKINS_HOME"/workspace/${job_name_2}
RUN mkdir -p "$JENKINS_HOME"/jobs/${job_name_2}
COPY /ref/${job_name_2}_config.xml "$JENKINS_HOME"/jobs/${job_name_2}/config.xml
