pipeline {
    agent any
    stages {
        stage('build') {
            steps {
                echo "Building!"
            }
        }
    }
    triggers {
        pollSCM('* * * * *')
    }
}