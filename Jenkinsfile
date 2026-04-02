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
                    # Stop and remove the named container (ignore errors)
                    docker stop ${CONTAINER_NAME} || true
                    docker rm -f ${CONTAINER_NAME} || true

                    # Stop any other Docker container holding port ${APP_PORT}
                    CONFLICT=\$(docker ps -q --filter "publish=${APP_PORT}")
                    if [ -n "\$CONFLICT" ]; then
                        echo "Stopping conflicting Docker container(s): \$CONFLICT"
                        docker stop \$CONFLICT || true
                        docker rm -f \$CONFLICT || true
                    fi

                    # Kill any non-Docker host process holding port ${APP_PORT} (e.g. nginx, apache)
                    if command -v fuser >/dev/null 2>&1; then
                        fuser -k ${APP_PORT}/tcp || true
                    elif command -v ss >/dev/null 2>&1; then
                        PID=\$(ss -tlnp "sport = :${APP_PORT}" | awk 'NR>1 {match(\$0,/pid=([0-9]+)/,a); if(a[1]) print a[1]}' | head -1)
                        [ -n "\$PID" ] && kill -9 "\$PID" || true
                    fi

                    # Brief pause to let the port release
                    sleep 2

                    # Create named volume for uploads if it doesn't exist yet
                    docker volume create beawar_school_uploads || true

                    # Sync uploads from build workspace into the volume
                    docker run --rm \\
                        -v beawar_school_uploads:/dest \\
                        -v \$(pwd)/uploads:/src:ro \\
                        alpine sh -c "cp -rn /src/. /dest/"

                    # Run new container
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
