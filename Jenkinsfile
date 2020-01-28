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
                //Ref: https://hackernoon.com/continuous-delivery-of-react-app-with-jenkins-and-docker-8a1ae1511b86
                stage('test_frontend') 
                {
                   steps
                   {
                    script 
                       {
                           dir("project/frontend/360_dashboard")
                           {
                                sh 'docker build -t react-test -f Dockerfile.test --no-cache .'
                                // Do tests
                                sh 'docker run --rm react-test'
                                // remove image
                                sh 'docker rmi react-test'
                           }
                       }
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
                            sh "pytest --cov=. real_time/test/ recognition/test/"
                        }
                    }
                }

                //Testing data_analytics
                 stage('test_djangoserver') 
                {
                    agent {
                        docker "project_360_django"
                    }
                    steps {
                        dir("project/data_analytics/360_data_analytics/") {
                            sh "pytest --cov=. tests/"
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
        failure{
            echo 'pipeline failed, at least one step failed'
            sh 'docker images -q |xargs docker rmi'
        }
    }

}