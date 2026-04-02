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
                    # Helper: forcibly free port ${APP_PORT} of ALL holders
                    free_port() {
                        # 1. Remove ALL Docker containers (running or created) that reference port ${APP_PORT}
                        for CID in \$(docker ps -aq --filter "publish=${APP_PORT}"); do
                            echo "Removing Docker container \$CID holding port ${APP_PORT}"
                            docker rm -f "\$CID" || true
                        done

                        # 2. Kill any non-Docker host process holding port ${APP_PORT}
                        fuser -k ${APP_PORT}/tcp 2>/dev/null || true

                        # 3. Wait up to 10 s for the port to be released
                        for i in \$(seq 1 10); do
                            fuser ${APP_PORT}/tcp >/dev/null 2>&1 || return 0
                            sleep 1
                        done
                        echo "WARNING: port ${APP_PORT} still occupied after 10 s"
                    }

                    # --- Stop & remove named container ---
                    docker stop ${CONTAINER_NAME} 2>/dev/null || true
                    docker rm -f ${CONTAINER_NAME} 2>/dev/null || true

                    # --- Clear anything else holding the port ---
                    free_port

                    # --- Uploads volume ---
                    docker volume create beawar_school_uploads || true
                    docker run --rm \\
                        -v beawar_school_uploads:/dest \\
                        -v \$(pwd)/uploads:/src:ro \\
                        alpine sh -c "cp -rn /src/. /dest/"

                    # --- Start new container (with one retry if port bind fails) ---
                    if ! docker run -d \\
                        --name ${CONTAINER_NAME} \\
                        --restart unless-stopped \\
                        -p ${APP_PORT}:5000 \\
                        -v beawar_school_uploads:/app/uploads \\
                        ${IMAGE_NAME}:${IMAGE_TAG}; then

                        echo "First attempt failed – freeing port and retrying..."
                        docker rm -f ${CONTAINER_NAME} 2>/dev/null || true
                        free_port

                        docker run -d \\
                            --name ${CONTAINER_NAME} \\
                            --restart unless-stopped \\
                            -p ${APP_PORT}:5000 \\
                            -v beawar_school_uploads:/app/uploads \\
                            ${IMAGE_NAME}:${IMAGE_TAG}
                    fi
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
