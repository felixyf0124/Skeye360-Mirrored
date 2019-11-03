pipeline {
    agent any
    stages {
        stage("Parallel") {
            parallel {
                stage('build') {
                    steps {
                        echo "Building!"
                    }
                }
                // //Working with all the properties in the command
                stage('test_sonarqube') {
                    steps {
                        script {
                            scannerHome = tool 'SonarQubeScanner'
                        }
                        withSonarQubeEnv('SonarQube') { 
                            sh "${scannerHome}/bin/sonar-scanner -Dsonar.host.url=http://40.121.23.48:8100/  -Dsonar.login=93165dcba9ba70911fa482089e4d7429d3981b13 -Dsonar.projectName=sonarqubeTest -Dsonar.projectVersion=1 -Dsonar.projectKey=sonarqubeTest -Dsonar.sources=."
                        }
                    }
                }
                //Testing frontend
                stage('test_frontend') {
                    agent {
                        docker "project_360_dashboard"
                    }
                    steps {
                        dir("project/frontend/360_dashboard") {
                            sh "ls"
                            sh "yarn run test ."
                        }
                    }
                }
                //Testing django api
                stage('test_djangoapi') {
                    agent {
                        docker "project_360_django"
                    }
                    steps {
                        script {
                            dir("project/backend/360_django/djangosite") {
                                sh "ls"
                                sh "python3 manage.py test ."
                            }
                        }
                    }
                }
                // //Testing django server
                stage('test_djangoserver') {
                    steps {
                        script {
                            dir("project/backend/backend_django/camera") {
                                sh "ls"
                                sh "python3 manage.py test ."
                            }
                        }
                    }
                }
            }
        }
    }
    triggers {
        pollSCM('* * * * *')
    }
}