pipeline {
    agent any
    stages {
                stage('build') {
                    steps {
                        echo "Building!"
                    }
                }
                //Working with all the properties in the command
                // stage('test_sonarqube') {
                //     steps {
                //         script {
                //             scannerHome = tool 'SonarQubeScanner'
                //         }
                //         withSonarQubeEnv('SonarQube') { 
                //             sh "${scannerHome}/bin/sonar-scanner -Dsonar.host.url=http://40.121.23.48:8100/  -Dsonar.login=93165dcba9ba70911fa482089e4d7429d3981b13 -Dsonar.projectName=sonarqubeTest -Dsonar.projectVersion=1 -Dsonar.projectKey=sonarqubeTest -Dsonar.sources=."
                //         }
                //     }
                // }
                //Testing frontend
                stage('test_frontend') {
                   sh 'pwd'
                   sh 'docker build -t react-test -f Dockerfile.test --no-cache'
                }
                //Testing django api
                stage('test_djangoapi') {
                    agent {
                        docker {
                            image 'project_360_django'
                            args '--network=app_net'
                        }
                    }
                    steps {
                        script {
                            dir("project/backend/360_django/djangosite") {
                                sh "python3 manage.py test -k"
                                sh "pytest --cov=djangosite_api tests/"
                            }
                        }
                    }
                }
                //Testing django server
                //Running unit tests only
                stage('test_djangoserver') {
                    agent {
                        docker "project_360_django"
                    }
                    steps {
                        dir("project/backend/backend_django/camera/") {
                            sh "python3 test.py"
                            sh "pytest --cov=recognition recognition/test/test_functions.py"
                        }
                    }
                }
    }

    post {
        always {
            cleanWs()
            deleteDir()
        }
    }

}