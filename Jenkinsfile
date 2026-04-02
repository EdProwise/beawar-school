pipeline {
    agent any

    environment {
        IMAGE_NAME     = "${env.DOCKER_IMAGE_NAME ?: 'beawar-school-app'}"
        IMAGE_TAG      = "${env.BUILD_NUMBER}"
        CONTAINER_NAME = "beawar-school-app"
        APP_PORT       = "5000"
        // Path to the .env file on the EC2 host (place it here once, never changes)
        ENV_FILE_PATH  = "/home/ec2-user/beawar-school/.env"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {

        // ── 1. Checkout ──────────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // ── 2. Copy .env from host into workspace ────────────────────────────
        stage('Prepare .env') {
            steps {
                sh "cp ${ENV_FILE_PATH} .env"
            }
        }

        // ── 3. Build Docker image (copies .env inside via COPY . .) ─────────
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }

        // ── 4. Deploy on the same EC2 host ───────────────────────────────────
        stage('Deploy') {
            steps {
                sh """
                    # Stop and remove old container (ignore error if not running)
                    docker stop ${CONTAINER_NAME} || true
                    docker rm   ${CONTAINER_NAME} || true

                    # Create named volume for uploads if it doesn't exist yet
                    docker volume create beawar_school_uploads || true

                    # Run new container — env vars come from the .env baked into the image
                    docker run -d \\
                        --name ${CONTAINER_NAME} \\
                        --restart unless-stopped \\
                        -p ${APP_PORT}:5000 \\
                        -v beawar_school_uploads:/app/uploads \\
                        ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }

        // ── 5. Health check ──────────────────────────────────────────────────
        stage('Health Check') {
            steps {
                sh """
                    echo "Waiting for application to start..."
                    sleep 15
                    curl -f http://localhost:${APP_PORT}/api/auth/admin-exists || exit 1
                    echo "Health check passed."
                """
            }
        }

        // ── 6. Cleanup old images ────────────────────────────────────────────
        stage('Cleanup') {
            steps {
                sh "docker image prune -f"
            }
        }
    }

    post {
        success {
            echo "Deployment successful! Image: ${IMAGE_NAME}:${IMAGE_TAG}"
        }
        failure {
            echo "Pipeline failed. Check logs and redeploy."
        }
        always {
            cleanWs()
        }
    }
}
