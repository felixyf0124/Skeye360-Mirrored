pipeline {
    agent any
    stages {
        stage('build') {
            steps {
                echo "Maybe working!"
            }
        }
    }
    triggers {
        pollSCM('* * * * *')
    }
}