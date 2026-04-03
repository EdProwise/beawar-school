pipeline {
    agent any

    environment {
        IMAGE_NAME     = "${env.DOCKER_IMAGE_NAME ?: 'beawar-school-app'}"
        IMAGE_TAG      = "${env.BUILD_NUMBER}"
        CONTAINER_NAME = "beawar-school-app"
        APP_PORT       = "80"
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

        // ── 2. Build Docker image (.env is already in workspace from git) ───
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }

        // ── 4. Deploy on the same EC2 host ───────────────────────────────────
        stage('Deploy') {
            steps {
                sh """
                    # 1. Stop & remove the named container (if running or stopped)
                    docker stop ${CONTAINER_NAME} 2>/dev/null || true
                    docker rm -f ${CONTAINER_NAME} 2>/dev/null || true

                    # 2. Remove ALL containers in any state that were mapped to port ${APP_PORT}
                    docker ps -a --format '{{.ID}} {{.Ports}}' \
                        | grep ':${APP_PORT}->' \
                        | awk '{print \$1}' \
                        | xargs -r docker rm -f || true

                    # 3. Kill any non-Docker process holding port ${APP_PORT} (nginx, apache, etc.)
                    sudo fuser -k ${APP_PORT}/tcp 2>/dev/null || true
                    sleep 2

                    # 4. Restart the Docker daemon to flush any orphaned iptables/proxy state
                    sudo systemctl restart docker
                    sleep 5

                    # 5. Ensure the uploads folder exists on the host and sync from workspace
                    sudo mkdir -p /opt/beawar-school/uploads
                    sudo rsync -a --ignore-existing ${WORKSPACE}/uploads/ /opt/beawar-school/uploads/
                    sudo chmod -R 755 /opt/beawar-school/uploads

                    # 6. Start the new container with bind mount to host uploads folder
                    docker run -d \\
                        --name ${CONTAINER_NAME} \\
                        --restart unless-stopped \\
                        -p ${APP_PORT}:5000 \\
                        -v /opt/beawar-school/uploads:/app/uploads \\
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
