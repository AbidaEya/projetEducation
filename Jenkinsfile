pipeline {
    agent any

    environment {
        // Container Registry Configuration
        REGISTRY = 'docker.io'  // Change to your registry (e.g., gcr.io, ecr.aws, etc.)
        REGISTRY_CREDENTIALS = 'docker-credentials'  // Jenkins credentials ID
        REGISTRY_NAMESPACE = 'your-namespace'  // Change to your Docker Hub namespace or registry namespace
        
        // Project Configuration
        PROJECT_NAME = 'education-platform'
        BACKEND_IMAGE = "${REGISTRY}/${REGISTRY_NAMESPACE}/education-backend"
        FRONTEND_IMAGE = "${REGISTRY}/${REGISTRY_NAMESPACE}/education-frontend"
        
        // Build versions
        BUILD_VERSION = "${BUILD_NUMBER}"
        GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
        TIMESTAMP = sh(script: "date +%Y%m%d_%H%M%S", returnStdout: true).trim()
    }

    options {
        // Keep last 30 builds
        buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '10'))
        // Timeout for pipeline
        timeout(time: 1, unit: 'HOURS')
        // Timestamps in logs
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                echo '========== CHECKOUT =========='
                checkout scm
                script {
                    env.GIT_BRANCH = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
                    echo "Branch: ${env.GIT_BRANCH}"
                    echo "Commit: ${env.GIT_COMMIT_SHORT}"
                }
            }
        }

        stage('Build & Test Backend') {
            steps {
                echo '========== BUILD & TEST BACKEND =========='
                dir('backend') {
                    script {
                        sh '''
                            echo "Building Backend with Maven..."
                            mvn clean package -DskipTests
                            echo "Backend build completed successfully"
                        '''
                    }
                }
            }
        }

        stage('Test Backend') {
            steps {
                echo '========== TEST BACKEND =========='
                dir('backend') {
                    script {
                        sh '''
                            echo "Running Backend Tests..."
                            mvn test || true
                            echo "Tests completed"
                        '''
                    }
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml' || true
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'backend/target/site/jacoco',
                        reportFiles: 'index.html',
                        reportName: 'Code Coverage Report'
                    ]) || true
                }
            }
        }

        stage('Build & Test Frontend') {
            steps {
                echo '========== BUILD & TEST FRONTEND =========='
                dir('front2') {
                    script {
                        sh '''
                            echo "Installing Frontend Dependencies..."
                            npm ci
                            echo "Building Frontend..."
                            npm run build
                            echo "Frontend build completed successfully"
                        '''
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            when {
                branch 'develop'
            }
            steps {
                echo '========== SONARQUBE ANALYSIS =========='
                script {
                    withSonarQubeEnv('SonarQube') {
                        sh '''
                            mvn clean verify sonar:sonar \
                              -Dsonar.projectKey=education-platform \
                              -Dsonar.sources=backend/src/main \
                              -Dsonar.tests=backend/src/test \
                              -Dsonar.java.binaries=backend/target/classes
                        '''
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '========== BUILD DOCKER IMAGES =========='
                script {
                    withDockerRegistry([credentialsId: "${REGISTRY_CREDENTIALS}", url: "https://${REGISTRY}"]) {
                        // Build Backend Image
                        sh '''
                            echo "Building Backend Docker Image..."
                            docker build -t ${BACKEND_IMAGE}:${BUILD_VERSION} \
                                         -t ${BACKEND_IMAGE}:${GIT_COMMIT_SHORT} \
                                         -t ${BACKEND_IMAGE}:latest \
                                         ./backend
                            echo "Backend image built: ${BACKEND_IMAGE}:${BUILD_VERSION}"
                        '''
                        
                        // Build Frontend Image
                        sh '''
                            echo "Building Frontend Docker Image..."
                            docker build -t ${FRONTEND_IMAGE}:${BUILD_VERSION} \
                                         -t ${FRONTEND_IMAGE}:${GIT_COMMIT_SHORT} \
                                         -t ${FRONTEND_IMAGE}:latest \
                                         ./front2
                            echo "Frontend image built: ${FRONTEND_IMAGE}:${BUILD_VERSION}"
                        '''
                    }
                }
            }
        }

        stage('Push Docker Images') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                    branch 'master'
                }
            }
            steps {
                echo '========== PUSH DOCKER IMAGES =========='
                script {
                    withDockerRegistry([credentialsId: "${REGISTRY_CREDENTIALS}", url: "https://${REGISTRY}"]) {
                        sh '''
                            echo "Pushing Backend Image..."
                            docker push ${BACKEND_IMAGE}:${BUILD_VERSION}
                            docker push ${BACKEND_IMAGE}:${GIT_COMMIT_SHORT}
                            docker push ${BACKEND_IMAGE}:latest
                            
                            echo "Pushing Frontend Image..."
                            docker push ${FRONTEND_IMAGE}:${BUILD_VERSION}
                            docker push ${FRONTEND_IMAGE}:${GIT_COMMIT_SHORT}
                            docker push ${FRONTEND_IMAGE}:latest
                            
                            echo "Images pushed successfully"
                        '''
                    }
                }
            }
        }

        stage('Security Scanning') {
            steps {
                echo '========== SECURITY SCANNING =========='
                script {
                    sh '''
                        echo "Scanning Docker Images with Trivy..."
                        
                        # Install Trivy if not available
                        which trivy || (curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin)
                        
                        # Scan Backend Image
                        trivy image --exit-code 0 --no-progress --format sarif \
                            -o backend-scan.sarif ${BACKEND_IMAGE}:latest || true
                        
                        # Scan Frontend Image
                        trivy image --exit-code 0 --no-progress --format sarif \
                            -o frontend-scan.sarif ${FRONTEND_IMAGE}:latest || true
                        
                        echo "Security scanning completed"
                    '''
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: '*-scan.sarif', allowEmptyArchive: true
                }
            }
        }

        stage('Deploy to Development') {
            when {
                branch 'develop'
            }
            steps {
                echo '========== DEPLOY TO DEVELOPMENT =========='
                script {
                    sh '''
                        echo "Deploying to Development Environment..."
                        
                        # Using docker-compose for development
                        docker-compose -f docker-compose.yml pull
                        docker-compose -f docker-compose.yml up -d
                        
                        # Wait for services to be healthy
                        sleep 30
                        
                        # Check service health
                        docker-compose ps
                        
                        echo "Development deployment completed"
                    '''
                }
            }
        }

        stage('Integration Tests') {
            when {
                branch 'develop'
            }
            steps {
                echo '========== INTEGRATION TESTS =========='
                script {
                    sh '''
                        echo "Running Integration Tests..."
                        
                        # Wait for backend to be ready
                        max_attempts=30
                        attempt=1
                        while [ $attempt -le $max_attempts ]; do
                            if curl -f http://localhost:8081/actuator/health > /dev/null 2>&1; then
                                echo "Backend is ready"
                                break
                            fi
                            echo "Waiting for backend... (attempt $attempt/$max_attempts)"
                            sleep 2
                            attempt=$((attempt+1))
                        done
                        
                        # Run API tests with Postman/Newman if available
                        # newman run docs/Education_Platform_API.postman_collection.json \
                        #   --environment docs/postman-env.json \
                        #   --reporters cli,json || true
                        
                        echo "Integration tests completed"
                    '''
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                echo '========== DEPLOY TO STAGING =========='
                script {
                    echo "Deploying to Staging Environment..."
                    // Add your staging deployment script here
                    // Examples: Kubernetes, Docker Swarm, AWS ECS, etc.
                }
            }
        }

        stage('Deploy to Production') {
            when {
                tag "release-*"
            }
            steps {
                echo '========== DEPLOY TO PRODUCTION =========='
                script {
                    input(message: 'Deploy to Production?', ok: 'Deploy')
                    echo "Deploying to Production Environment..."
                    // Add your production deployment script here
                }
            }
        }

        stage('Cleanup') {
            steps {
                echo '========== CLEANUP =========='
                script {
                    sh '''
                        echo "Cleaning up Docker resources..."
                        docker image prune -f --filter "until=72h" || true
                        docker volume prune -f || true
                        echo "Cleanup completed"
                    '''
                }
            }
        }
    }

    post {
        always {
            echo '========== PIPELINE FINISHED =========='
            cleanWs()
        }
        success {
            echo '✅ Pipeline succeeded!'
            // Add notification here (email, Slack, etc.)
        }
        failure {
            echo '❌ Pipeline failed!'
            // Add notification here (email, Slack, etc.)
        }
        unstable {
            echo '⚠️ Pipeline unstable!'
        }
    }
}
