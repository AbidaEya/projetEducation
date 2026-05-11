# Jenkins Setup & Configuration Guide

## 📋 Prerequisites

- Jenkins 2.350+ (Java 11+)
- Docker & Docker Compose
- Git plugin
- Pipeline plugin
- Docker Pipeline plugin
- SonarQube plugin (optional)

## 🔧 Jenkins Installation

### Using Docker
```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

### Initial Setup
1. Open http://localhost:8080
2. Get initial password: `docker logs jenkins`
3. Install suggested plugins
4. Create admin user

## 🔐 Configure Credentials

### Docker Hub Credentials
1. Go to **Manage Jenkins** → **Manage Credentials**
2. Click **global** → **Add Credentials**
3. Select **Username with password**
4. Set credentials ID to: `docker-credentials`
5. Enter Docker Hub username/password (or access token)

### GitHub Credentials
1. Create Personal Access Token on GitHub
2. Go to **Manage Jenkins** → **Manage Credentials**
3. Add credentials with your GitHub token
4. Set credentials ID to: `github-credentials`

### SonarQube Token (optional)
1. Create token in SonarQube
2. Add as Jenkins credential
3. Set SonarQube server in Jenkins configuration

## 🚀 Create Pipeline Job

### Method 1: Jenkinsfile from SCM (Recommended)
1. **New Item** → Select **Pipeline**
2. Enter job name: `education-platform-ci-cd`
3. Under **Pipeline** section:
   - Select: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: Your Git repo URL
   - Credentials: Select GitHub credentials
   - Script Path: `Jenkinsfile`
4. Save and run

### Method 2: Blue Ocean (UI-based)
1. Click **New** → **Create a new pipeline**
2. Select Git repository
3. Select branch
4. Jenkins will auto-detect Jenkinsfile

## ⚙️ Configure Webhooks

### GitHub Webhook
1. Go to GitHub repository settings
2. **Webhooks** → **Add webhook**
3. Payload URL: `http://your-jenkins:8080/github-webhook/`
4. Content type: `application/json`
5. Events: **Push events** and **Pull requests**
6. Active: ✓

### GitLab Webhook (if using GitLab)
1. Go to GitLab project settings
2. **Integrations** → **Webhooks**
3. URL: `http://your-jenkins:8080/gitlab-webhook/`
4. Trigger: **Push events** and **Merge request events**

## 📊 Configure SonarQube (Optional)

### In SonarQube
1. Create project
2. Generate token
3. Copy project key

### In Jenkins
1. **Manage Jenkins** → **Configure System**
2. Scroll to **SonarQube servers**
3. Add SonarQube server:
   - Name: `SonarQube`
   - Server URL: `http://sonarqube:9000`
   - Server authentication token: Your token
4. Save

### Update Jenkinsfile
```groovy
withSonarQubeEnv('SonarQube') {
    sh 'mvn sonar:sonar ...'
}
```

## 🐳 Docker Registry Configuration

### Update Jenkinsfile
```groovy
environment {
    REGISTRY = 'docker.io'  // or your private registry
    REGISTRY_NAMESPACE = 'your-namespace'
}
```

### Test Docker Connection
```bash
# From Jenkins container
docker login -u username -p password
```

## 🔔 Email Notifications

### Configure Email
1. **Manage Jenkins** → **Configure System**
2. **Email Notification** section:
   - SMTP server: your-smtp-server
   - Default user email suffix: @example.com
3. Click **Test configuration**

### Update Jenkinsfile
```groovy
post {
    success {
        emailext(
            subject: 'Build Successful: ${PROJECT_NAME}',
            body: 'Build ${BUILD_NUMBER} completed successfully',
            to: '${DEFAULT_RECIPIENTS}'
        )
    }
    failure {
        emailext(
            subject: 'Build Failed: ${PROJECT_NAME}',
            body: 'Build ${BUILD_NUMBER} failed. Check console output',
            to: '${DEFAULT_RECIPIENTS}'
        )
    }
}
```

## 💬 Slack Notifications

### Install Slack Plugin
1. **Manage Jenkins** → **Manage Plugins**
2. Search for "Slack"
3. Install **Slack Notification** plugin

### Configure Slack
1. Create Slack webhook at https://api.slack.com/apps
2. **Manage Jenkins** → **Configure System**
3. **Slack** section:
   - Workspace: your-workspace
   - Credential: Add webhook token
   - Channel: #builds
4. Save

### Update Jenkinsfile
```groovy
post {
    always {
        slackSend(
            channel: '#builds',
            color: currentBuild.result == 'SUCCESS' ? 'good' : 'danger',
            message: "${PROJECT_NAME} - ${currentBuild.result}"
        )
    }
}
```

## 📈 View Pipeline Status

### Jenkins Dashboard
- Go to http://your-jenkins:8080
- Click on job: `education-platform-ci-cd`
- View build history and logs

### Blue Ocean View
- Go to http://your-jenkins:8080/blue
- Visual pipeline execution
- Real-time logs

## 🔄 Triggering Builds

### Automatic Triggers
- **Push to develop branch**: Triggers build automatically
- **Push to main branch**: Triggers full pipeline
- **Tag with release-***: Triggers production deployment

### Manual Trigger
1. Go to job page
2. Click **Build Now** (or **Build with Parameters**)
3. Monitor build progress in console

## 📊 Build Artifacts

### Archive Artifacts
The Jenkinsfile currently archives:
- Test reports: `**/target/surefire-reports/*.xml`
- Coverage reports: `**/target/site/jacoco/**`
- Security scans: `*-scan.sarif`

### View Artifacts
1. Go to build page
2. Click **Artifacts** section
3. Download or view reports

## 🧪 Testing the Pipeline

### Test with Sample Build
```groovy
// Minimal test stage
stage('Test') {
    steps {
        sh 'echo "Pipeline test successful"'
    }
}
```

### Validate Jenkinsfile
```bash
# Using Jenkins CLI
java -jar jenkins-cli.jar -s http://localhost:8080 \
    declarative-linter < Jenkinsfile
```

## ⚡ Performance Tuning

### Parallel Stages
```groovy
parallel {
    'Build Backend' { ... }
    'Build Frontend' { ... }
}
```

### Cache Management
- Docker layer caching
- Maven local repository caching
- npm cache optimization

### Build Discarder
```groovy
buildDiscarder(logRotator(
    numToKeepStr: '30',
    artifactNumToKeepStr: '10',
    daysToKeepStr: '90'
))
```

## 🔒 Security Best Practices

### Credentials Management
- ✅ Never hardcode credentials
- ✅ Use Jenkins credentials store
- ✅ Rotate tokens regularly
- ✅ Use service accounts for deployments

### Pipeline Security
- ✅ Validate input parameters
- ✅ Scan images for vulnerabilities
- ✅ Use read-only where possible
- ✅ Audit all deployments

### Network Security
- ✅ Use HTTPS for Jenkins
- ✅ Enable CSP headers
- ✅ Restrict webhook access
- ✅ Use VPN/firewall rules

## 📝 Maintenance

### Regular Tasks
- Monitor disk space (`/var/jenkins_home`)
- Update Jenkins and plugins monthly
- Review job logs for errors
- Clean old build artifacts
- Rotate credentials quarterly

### Backup
```bash
# Backup Jenkins home directory
tar -czf jenkins_backup.tar.gz /var/jenkins_home

# Restore
tar -xzf jenkins_backup.tar.gz -C /
```

## 🐛 Troubleshooting

### Build Fails with Docker Error
```bash
# Check Docker daemon
docker ps

# Verify Jenkins user permissions
groups jenkins

# Add Jenkins to docker group
sudo usermod -aG docker jenkins

# Restart Jenkins
sudo systemctl restart jenkins
```

### Pipeline Stage Timeout
```groovy
// Set stage timeout
options {
    timeout(time: 1, unit: 'HOURS')
}

// Or per stage
stage('Build') {
    options {
        timeout(time: 30, unit: 'MINUTES')
    }
}
```

### Out of Disk Space
```bash
# Clean Docker images
docker image prune -a

# Clean Jenkins workspace
rm -rf /var/jenkins_home/workspace/*

# Check disk usage
df -h /var/jenkins_home
```

## 🔗 Useful Links

- [Jenkins Official Documentation](https://www.jenkins.io/doc/)
- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Docker Pipeline Plugin](https://plugins.jenkins.io/docker-workflow/)
- [GitHub Plugin](https://plugins.jenkins.io/github/)
- [SonarQube Plugin](https://plugins.jenkins.io/sonarqube/)

## 📞 Support

For Jenkins-specific issues:
1. Check Jenkins logs: http://jenkins:8080/log/all
2. Review pipeline console output
3. Consult Jenkins documentation
4. Check plugin compatibility

---

**Last Updated**: May 11, 2026
