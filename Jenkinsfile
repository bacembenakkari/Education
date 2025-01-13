pipeline {
    agent any
    
    triggers {
        pollSCM('* * * * *')
    }
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        IMAGE_NAME_FRONTEND = 'bacem592/frontend-education:latest'
        IMAGE_NAME_BACKEND = 'bacem592/backend-education:latest'
        IMAGE_NAME_DATABASE = 'mysql:8.0'
    }
    
    stages {
        stage('Cleanup Workspace') {
            steps {
                cleanWs()
                sh 'docker ps -a'  // Verify existing containers
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/bacembenakkari/Education'
            }
        }
        
        stage('Build Frontend Image') {
            steps {
                dir('test-app') {
                    script {
                        dockerImageFrontend = docker.build("${IMAGE_NAME_FRONTEND}", "-f Dockerfile .")
                    }
                }
            }
        }
        
        stage('Build Backend Image') {
            steps {
                dir('test1') {
                    script {
                        dockerImageBackend = docker.build("${IMAGE_NAME_BACKEND}", "-f Dockerfile .")
                    }
                }
            }
        }
        
        stage('Docker Hub Login') {
            steps {
                script {
                    sh 'docker info'  // Verify Docker is running
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh "echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USERNAME --password-stdin"
                    }
                }
            }
        }
        
        stage('Push Images') {
            steps {
                script {
                    sh """
                        docker push ${IMAGE_NAME_FRONTEND}
                        docker push ${IMAGE_NAME_BACKEND}
                    """
                }
            }
        }
        
        stage('Remove Local Images') {
            steps {
                script {
                    sh """
                        docker rmi ${IMAGE_NAME_FRONTEND}
                        docker rmi ${IMAGE_NAME_BACKEND}
                    """
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    sh 'pwd'  // Verify working directory
                    sh 'ls -la'  // List files
                    sh 'docker-compose version'  // Check docker-compose version
                    sh """
                        docker-compose down || true
                        docker-compose up -d
                    """
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
            cleanWs()
            sh 'docker system prune -f || true'
        }
        success {
            echo 'Pipeline successfully executed!'
        }
        failure {
            echo 'Pipeline failed!'
            sh 'docker-compose logs'  // Display logs on failure
        }
    }
}
