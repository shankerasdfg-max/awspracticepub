pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'ravi420'
        IMAGE_NAME = "${DOCKERHUB_USER}/ravidocker"
        GKE_CLUSTER = 'autopilot-cluster-1'
        GKE_ZONE = 'us-central1'
        PROJECT_ID = 'plexiform-being-467710-g0'
        GCP_KEY_PATH = '/var/lib/jenkins/gcp-key.json'   // Hardcoded GCP key file path
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

        stage('Setup GCP Tools') {
            steps {
                sh '''
                    echo "🔧 Checking and Installing GCP SDK dependencies..."
                    
                    # Ensure the GCP apt repo is added
                    if [ ! -f /usr/share/keyrings/cloud.google.gpg ]; then
                        echo "Adding Google Cloud SDK repository..."
                        sudo mkdir -p /usr/share/keyrings
                        curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg
                        echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee /etc/apt/sources.list.d/google-cloud-sdk.list
                    fi

                    # Install kubectl and gke-gcloud-auth-plugin if not present
                    sudo apt-get update -y
                    sudo apt-get install -y google-cloud-sdk kubectl google-cloud-sdk-gke-gcloud-auth-plugin

                    echo "✅ GCP tools are ready."
                '''
            }
        }

        stage('Deploy to GKE') {
            steps {
                sh '''
                    echo "🔑 Authenticating with GCP..."
                    gcloud auth activate-service-account --key-file=$GCP_KEY_PATH
                    gcloud config set project $PROJECT_ID

                    echo "☁️ Fetching GKE credentials..."
                    gcloud container clusters get-credentials $GKE_CLUSTER --zone $GKE_ZONE --project $PROJECT_ID

                    echo "🚀 Deploying updated image to GKE..."
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
