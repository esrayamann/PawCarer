// ─── PawCarer Jenkins CI/CD Pipeline ───
// GitHub repo: https://github.com/esrayamann/PawCarer

pipeline {
    // Node.js gerektiren stage'ler için Docker agent kullan
    // Jenkins container'ında node kurulu olmak zorunda değil
    agent {
        docker {
            image 'node:20-alpine'
            args '-v /var/run/docker.sock:/var/run/docker.sock -u root'
            reuseNode true
        }
    }

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
        NEXT_TELEMETRY_DISABLED = '1'
    }

    stages {

        // ─── Stage 1: Kod Al ───
        stage('📥 Checkout') {
            steps {
                echo '📥 Kaynak kod hazırlanıyor...'
                echo "✅ Branch: ${env.BRANCH_NAME ?: 'manual'}"
                sh 'node --version && npm --version'
            }
        }

        // ─── Stage 2: Backend Bağımlılıkları ───
        stage('📦 Backend - Install') {
            steps {
                dir('backend') {
                    echo '📦 npm bağımlılıkları yükleniyor...'
                    sh 'npm ci'
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
                        'RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672',
                        'REDIS_URL=redis://redis:6379',
                        'DATABASE_URL=postgresql://placeholder',
                        'DIRECT_URL=postgresql://placeholder',
                        'JWT_SECRET=ci-build-secret'
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
