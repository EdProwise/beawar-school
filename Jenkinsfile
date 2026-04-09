pipeline {
    agent any

    environment {
        IMAGE_NAME     = "${env.DOCKER_IMAGE_NAME ?: 'beawar-school-app'}"
        IMAGE_TAG      = "${env.BUILD_NUMBER}"
        CONTAINER_NAME = "beawar-school-app"
        TEMP_CONTAINER = "beawar-school-app-new"
        APP_PORT       = "8081"
        TEMP_PORT      = "5001"
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

        // ── 2. Build Docker image ────────────────────────────────────────────
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }

        // ── 3. Sync uploads to host folder ───────────────────────────────────
        stage('Sync Uploads') {
            steps {
                sh """
                    sudo mkdir -p /opt/beawar-school/uploads
                    sudo rsync -a --ignore-existing ${WORKSPACE}/uploads/ /opt/beawar-school/uploads/
                    sudo chmod -R 755 /opt/beawar-school/uploads
                """
            }
        }

        // ── 4. Health check new image BEFORE replacing old container ─────────
        stage('Pre-Deploy Health Check') {
            steps {
                sh """
                    # Clean up any leftover temp container from previous run
                    docker rm -f ${TEMP_CONTAINER} 2>/dev/null || true

                    # Start new image on a temp port (old container still running on port 80)
                    docker run -d \\
                        --name ${TEMP_CONTAINER} \\
                        -p ${TEMP_PORT}:5000 \\
                        -v /opt/beawar-school/uploads:/app/uploads \\
                        ${IMAGE_NAME}:${IMAGE_TAG}

                    echo "Waiting for new container to start..."
                    sleep 15

                    # Health check the new container on temp port
                    curl -f http://localhost:${TEMP_PORT}/api/auth/admin-exists || (docker rm -f ${TEMP_CONTAINER} && exit 1)

                    echo "New image is healthy. Proceeding to swap."

                    # Stop and remove the temp container (will be re-started on port 80 below)
                    docker rm -f ${TEMP_CONTAINER}
                """
            }
        }

        // ── 5. Swap old container with new one ───────────────────────────────
        stage('Deploy') {
            steps {
                sh """
                    # Stop & remove the old named container
                    docker stop ${CONTAINER_NAME} 2>/dev/null || true
                    docker rm -f ${CONTAINER_NAME} 2>/dev/null || true

                    # Remove any other containers still holding port ${APP_PORT}
                    docker ps -a --format '{{.ID}} {{.Ports}}' \
                        | grep ':${APP_PORT}->' \
                        | awk '{print \$1}' \
                        | xargs -r docker rm -f || true

                    # Kill any non-Docker process on port ${APP_PORT}
                    sudo fuser -k ${APP_PORT}/tcp 2>/dev/null || true
                    sleep 2

                    # Restart Docker daemon to flush iptables/proxy state
                    sudo systemctl restart docker
                    sleep 5

                    # Start the new container on port 80
                    docker run -d \\
                        --name ${CONTAINER_NAME} \\
                        --restart unless-stopped \\
                        -p ${APP_PORT}:5000 \\
                        -v /opt/beawar-school/uploads:/app/uploads \\
                        ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }

        // ── 6. Post-deploy health check ──────────────────────────────────────
        stage('Health Check') {
            steps {
                sh """
                    echo "Waiting for application to start on port ${APP_PORT}..."
                    sleep 15
                    curl -f http://localhost:${APP_PORT}/api/auth/admin-exists || exit 1
                    echo "Health check passed."
                """
            }
        }

        // ── 7. Cleanup old images ─────────────────────────────────────────────
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
            echo "Pipeline failed. Old container was NOT replaced (if failure was before Deploy stage)."
        }
        always {
            cleanWs()
        }
    }
}
