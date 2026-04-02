pipeline {
    agent any

    environment {
        IMAGE_NAME     = "${env.DOCKER_IMAGE_NAME ?: 'beawar-school-app'}"
        IMAGE_TAG      = "${env.BUILD_NUMBER}"
        CONTAINER_NAME = "beawar-school-app"
        APP_PORT       = "5000"
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

        // ── 2. Deploy with docker-compose (builds + starts app + nginx) ──────
        stage('Deploy') {
            steps {
                sh """
                    # Bring down old stack gracefully
                    docker-compose down --remove-orphans || true

                    # Build fresh images
                    docker-compose build --no-cache

                    # Start all services (app + nginx), volume is created automatically
                    docker-compose up -d
                """
            }
        }

        // ── 3. Health check ──────────────────────────────────────────────────
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

        // ── 4. Cleanup old images ────────────────────────────────────────────
        stage('Cleanup') {
            steps {
                sh "docker image prune -f"
            }
        }
    }

    post {
        success {
            echo "Deployment successful!"
        }
        failure {
            echo "Pipeline failed. Check logs and redeploy."
        }
        always {
            cleanWs()
        }
    }
}
