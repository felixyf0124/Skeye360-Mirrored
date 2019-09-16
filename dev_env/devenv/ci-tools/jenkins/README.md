Jenkins server in docker
========================

This project allows to spawn a docker network with a jenkins server
and a jenkins slave.

Useful to run pipelines locally during pipeline development.


Project vision
--------------

Jenkins configuration as code.  `docker-compose up` is all you need to have a working Jenins server
that can run any of our production pipelines.


Design
------

docker-compose is used to define a jenkins server and slave, both running in a docker network.

Each server and slave are defined using custom-built docker images available in this project.

The server is automatically configured through groovy initialization scripts and some setup in
the custom docker image.

The slave docker container is configured with the docker client and has access to the host's
docker daemon.  This way it can run docker images available on the host machine.

Design inspired from these projects:

* https://github.com/foxylion/docker-jenkins
* https://github.com/samrocketman/jenkins-bootstrap-shared
* https://github.com/peterjenkins1/jenkins-scripts

Also see [Jenkins in docker documentation](https://github.com/jenkinsci/docker/blob/master/README.md)


Project structure
-----------------

```
docker-compose.yml  - main docker-compose file that starts the server and slave
context/            - holds the docker contexts used by docker-compose
   server/          - the server's docker image build context
      ref/          - these files are meant to be copied as-is to the jenkins 'ref' folder
   slave/           - the jenkins slave's image build context
```

Initial setup
-------------

### Environment variables

The docker-compose file needs some variables defined in the environment.
The recommended setup is to create a `.env` file in the same directory
as the `docker-compose.yml` file, containing the variables and their values.

`JENKINS_CI_LIB_DIR`: Location of the `jenkins-ci-lib` git repository on the
host.  Relative paths are accepted and recommended.  The path is relative
to the directory containing the `docker-compose.yml` file. 

See here for all the other ways you can set these environment values:
https://docs.docker.com/compose/environment-variables/#configure-compose-using-environment-variables


### Allow jobs to send emails

This setup procedure might be automated one day...  Until then...

Once the server is running, go to the admin user configuration by clicking on the admin name in the
top-right.  In the e-mail field, enter your own email address.  Jobs started by user admin will
then send any emails to your account.


Server interaction
------------------

The following shows basic usage to interact with the server.  All the power of docker-compose
is available to manage the server and slave services.  Try ``docker-compose --help``.

### Start the server and slave

    docker-compose up -d

Docker volumes are created so the server and slave data is persistent
across runs.

If you have modified any of the files in this project, make sure you
force a rebuild of the docker images with:

    docker-compose up -d --build

To find out on which host port the server is running, do:

    docker-compose port server 8080
    
The server is at http://localhost:_port_, where _port_ is the value
returned by the above command.

The administrator user and password are in the server Dockerfile `context/server/Dockerfile`.


### Stop the server and slave

    docker-compose down

Data is persited in docker volumes.  To delete the data and start over from
scratch:

    docker-compose down -v

### Use the Jenkins CLI

Useful to programmatically send commands to the running server.

    docker-compose exec server java -jar /var/jenkins_home/war/WEB-INF/jenkins-cli.jar -auth admin:admin help
    
Don't forget that when executed this way, any input or output files are with paths inside
the server's docker container.

For more flexibility, you could copy the jar file to your host with:

    curl -O http://localhost:<port>/jnlpJars/jenkins-cli.jar
    
Then run it locally with:

    java -jar jenkins-cli.jar -s http://localhost:<port> -auth admin:admin 

<port> is the server's port as described in the section to start the server.

### See the Jenkins logs

    docker-compose logs server
    docker-compose logs slave


Pipeline development loops
--------------------------

This chapter shows how to use this local server for typical pipeline development work.

### Test code changes to the global shared library

This is the recommended development loop if you need to make changes to code
located in the global shared library `jenkins-ci-lib`.  This allows you to test
shared library code locally.

The server configures a system-wide shared library named `jenkins-ci-lib` and
will make it point to a git source code repository on the host.
The location of the git repository the host is specified with environment variable
`JENKINS_CI_LIB_DIR` (see Initial Setup).

The code in that git repository `jenkins-ci-lib` needs to be checked in for the
Jenkins pipeline to see it.  The recommended way of working is as follows:

1. In the `jenkins-ci-lib` git repo, create a working branch, for example
  `jenkins-local`.
2. Make you code changes and commit them to `jenkins-local`
3. In your pipeline's very first line, load the library with: \
   `@Library("jenkins-ci-lib@jenkins-local") _`
4. Run the pipeline
5. If changes are needed, go back to `jenkins-ci-lib`, make your changes,
   and `commit --amend` the change in the `jenkins-local` branch.
6. Go back to step 4 until the code change is satisfactory.

### Run a pipeline job with a local pipeline script

This development loop is useful to test any pipeline code available in a source
file on the host machine.

1. On the server, create a new Pipeline job (do not use multibranch pipeline).
   You do not need to change anything in its configuration.
   Assume we name this job `mmas`.
2. Make code changes to a pipeline script on the host.  For example, let's assume
   we made changes to the pipeline script `~/git/javacc/mmas/build-jenkinsfile`
3. Use `run-job.sh`  to inject that script's code into the `mmas` job, and start a build:\
   `run-job.sh mmas ~/git/javacc/mmas/build-jenkinsfile`
4. The job's console output will appear on the local console. If you stop the script with CTRL-C,
   the job on the server will be cancelled.  The script returns 0 on build success, >0 otherwise.
5. Go back to step 2 until the script works.

Hint: You may want to create a Run Configuration in your IDE to execute `run-job.sh` at
the push of a button, so you don't have to leave the IDE.

A manual alternative is to use the Jenkins GUI to edit the `mmas` job, and copy/paste
the pipeline script from your IDE, then hit the "Run" button and look at the console output.
 
The `run-job.sh` script does not work with multibranch pipelines yet.


Known limitations
-----------------

* Ericsson Eiffel plugin is not installed


Development tasks
-----------------

This chapter describes some typical development tasks to maintain or enhance the codebase.

### Upgrade the plugins to the latest version

The plugins installed on the server are listed in `context/server/ref/plugins.txt`

The easiest way to upgrade the plugins is as follows:

1. In the Jenkins GUI, go to `Manage Jenkins/Manage Plugins`
2. Click `Select All` at the bottom, then click on the button to install and
   update Jenkins.  Wait for installation finish and restart Jenkins.
3. Run the script `list-plugins.sh` as follows:
   `./list-plugins.sh > context/server/ref/plugins.txt`
4. Test that the server is now upgraded by force-recreating it from scratch:\
   `docker-compose down -v && docker-compose up --build`
5. Login to the server, go to `Manage Jenkins/Manage plugins` and make sure none
   of the plugins need upgrading.
6. You can now commit the change to `plugins.txt`.
