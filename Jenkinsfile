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
                //Working with all the properties in the command
                stage('test1') {
                    steps {
                        script {
                            scannerHome = tool 'SonarQubeScanner'
                        }
                        withSonarQubeEnv('SonarQube') { 
                            sh "${scannerHome}/bin/sonar-scanner -Dsonar.host.url=http://40.121.23.48:8100/  -Dsonar.login=93165dcba9ba70911fa482089e4d7429d3981b13 -Dsonar.projectName=sonarqubeTest -Dsonar.projectVersion=1 -Dsonar.projectKey=sonarqubeTest -Dsonar.sources=."
                        }
                    }
                }
                //To test this simpler version when we are going to have more code
                stage('test2') {
                    steps {
                        script {
                            scannerHome = tool 'SonarQubeScanner'
                        }
                        withSonarQubeEnv('SonarQube') {
                            sh "${scannerHome}/bin/sonar-scanner"
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