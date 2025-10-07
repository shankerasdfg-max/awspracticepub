pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'ravi420'
        IMAGE_NAME = "${DOCKERHUB_USER}/ravidocker"
        GKE_CLUSTER = 'autopilot-cluster-1'
        GKE_ZONE = 'us-central1'
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
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                    sh 'docker push $IMAGE_NAME:$BUILD_NUMBER'
                    sh 'docker tag $IMAGE_NAME:$BUILD_NUMBER $IMAGE_NAME:latest'
                    sh 'docker push $IMAGE_NAME:latest'
                }
            }
        }

        stage('Deploy to GKE') {
            steps {
                sh '''
            # Hardcoded credentials file path
            export GOOGLE_APPLICATION_CREDENTIALS=/var/lib/jenkins/gcp-key.json

            # Authenticate with GCP
            gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
            gcloud config set project my-gcp-project-id

            # Connect to the GKE cluster
            gcloud container clusters get-credentials my-gke-cluster \
                --zone us-central1-a --project my-gcp-project-id

            # Deploy the new image to Kubernetes
            kubectl set image deployment/node-app node-app=ravi420/node-app:${BUILD_NUMBER} --record
            kubectl rollout status deployment/node-app
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
