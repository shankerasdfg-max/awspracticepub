pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'ravi420'
        IMAGE_NAME = "${DOCKERHUB_USER}/ravidocker"
        GKE_CLUSTER = 'autopilot-cluster-1'
        GKE_ZONE = 'us-central1'
        PROJECT_ID = 'plexiform-being-467710-g0'
        GCP_KEY_PATH = '/var/lib/jenkins/gcp-key.json'   // 👈 Hardcoded path to your service account key file
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
                    sh '''
                        echo $PASS | docker login -u $USER --password-stdin
                        docker push $IMAGE_NAME:$BUILD_NUMBER
                        docker tag $IMAGE_NAME:$BUILD_NUMBER $IMAGE_NAME:latest
                        docker push $IMAGE_NAME:latest
                    '''
                }
            }
        }

        stage('Deploy to GKE') {
            steps {
                sh '''
                    echo "Activating GCP service account..."
                    gcloud auth activate-service-account --key-file=$GCP_KEY_PATH
                    gcloud config set project $PROJECT_ID

                    echo "Fetching GKE credentials..."
                    gcloud container clusters get-credentials $GKE_CLUSTER --zone $GKE_ZONE --project $PROJECT_ID

                    echo "Deploying updated image to GKE..."
                    kubectl set image deployment/node-app node-app=$IMAGE_NAME:$BUILD_NUMBER --record
                    kubectl rollout status deployment/node-app
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment to GKE Successful!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
