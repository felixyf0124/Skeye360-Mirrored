pipeline {
    agent any
        stages 
        {
                stage('build') {
                    steps {
                        echo "Building!"
                    }
                }

                //Testing frontend
                stage('test_frontend') 
                {
                   steps
                   {
                       sh 'pwd'
                       sh 'cd project/360_dashboard'
                       sh 'docker build -t react-test -f Dockerfile.test --no-cache .'
                    }
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
                stage('test_djangoserver') 
                {
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

    // Clean up
    post 
    {
        always 
        {
            cleanWs()
            deleteDir()
        }
    }

}