// ─── PawCarer Jenkins CI/CD Pipeline ───
// GitHub repo: https://github.com/esrayamann/PawCarer

pipeline {
    agent any

    options {
        // Aynı anda sadece 1 build çalışsın
        disableConcurrentBuilds()
        // 30 dakikadan uzun süren build'ı iptal et
        timeout(time: 30, unit: 'MINUTES')
        // Son 10 build'ı sakla
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        NODE_VERSION = '20'
    }

    stages {

        // ─── Stage 1: Kod Al ───
        stage('📥 Checkout') {
            steps {
                echo '📥 GitHub\'dan kod alınıyor...'
                checkout scm
                echo "✅ Branch: ${env.BRANCH_NAME ?: 'manual'}"
            }
        }

        // ─── Stage 2: Backend Bağımlılıkları ───
        stage('📦 Backend - Install') {
            steps {
                dir('backend') {
                    echo '📦 npm bağımlılıkları yükleniyor...'
                    sh '''
                        node --version
                        npm --version
                        npm ci
                    '''
                }
            }
        }

        // ─── Stage 3: Lint ───
        stage('🔍 Backend - Lint') {
            steps {
                dir('backend') {
                    echo '🔍 ESLint kodu analiz ediyor...'
                    sh 'npm run lint || true'
                }
            }
        }

        // ─── Stage 4: Next.js Build ───
        stage('🔨 Backend - Build') {
            steps {
                dir('backend') {
                    echo '🔨 Next.js production build alınıyor...'
                    withEnv([
                        "RABBITMQ_URL=amqp://guest:guest@localhost:5672",
                        "REDIS_URL=redis://localhost:6379"
                    ]) {
                        sh 'npm run build'
                    }
                }
            }
        }

        // ─── Stage 5: Mobile TypeScript Kontrol ───
        stage('📱 Mobile - Type Check') {
            steps {
                dir('mobile') {
                    echo '📱 Mobile TypeScript kontrol ediliyor...'
                    sh '''
                        npm install --legacy-peer-deps
                        npx tsc --noEmit || true
                    '''
                }
            }
        }

        // ─── Stage 6: Docker Build ───
        stage('🐳 Docker Build') {
            steps {
                echo '🐳 Docker Compose yapılandırması doğrulanıyor...'
                sh 'docker compose config'
                echo '🐳 Backend Docker image build ediliyor...'
                sh 'docker compose build backend'
            }
        }
    }

    // ─── Post Actions ───
    post {
        success {
            echo '''
            ╔══════════════════════════════════╗
            ║  ✅ Pipeline başarıyla tamamlandı ║
            ╚══════════════════════════════════╝
            '''
        }
        failure {
            echo '''
            ╔══════════════════════════════════╗
            ║  ❌ Pipeline başarısız!           ║
            ╚══════════════════════════════════╝
            '''
        }
        always {
            echo '🧹 Workspace temizleniyor...'
            cleanWs()
        }
    }
}
