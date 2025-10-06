pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'ravi420'
        IMAGE_NAME = "${DOCKERHUB_USER}/devops-node-gke"
        GKE_CLUSTER = 'autopilot-cluster-1'
        GKE_ZONE = 'us-central1-a'
        PROJECT_ID = 'plexiform-being-467710-g0'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/shankerasdfg-max/awspracticepub.git'
            }
        }

        stage('Install & Test') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                    sh 'docker push $IMAGE_NAME:$BUILD_NUMBER'
                    sh 'docker tag $IMAGE_NAME:$BUILD_NUMBER $IMAGE_NAME:latest'
                    sh 'docker push $IMAGE_NAME:latest'
                }
            }
        }

        stage('Deploy to GKE') {
            steps {
                withCredentials([file(credentialsId: 'gcp-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    sh '''
                        gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                        gcloud config set project $PROJECT_ID
                        gcloud container clusters get-credentials $GKE_CLUSTER --zone $GKE_ZONE --project $PROJECT_ID

                        kubectl set image deployment/node-app node-app=$IMAGE_NAME:$BUILD_NUMBER --record
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment to GKE Successful!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
