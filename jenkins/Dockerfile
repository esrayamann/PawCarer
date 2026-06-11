# ─── PawCarer Custom Jenkins Image ───
# Docker CLI + Node.js + Gerekli Plugin'ler + JCasC Konfigürasyonu
FROM jenkins/jenkins:lts-jdk17

# Root olarak Docker CLI ve Node.js kur
USER root

# Docker CLI kurulumu
RUN apt-get update && \
    apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
        https://download.docker.com/linux/debian $(lsb_release -cs) stable" \
        > /etc/apt/sources.list.d/docker.list && \
    apt-get update && \
    apt-get install -y docker-ce-cli && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Node.js 20 kurulumu (pipeline'da npm/npx komutları için)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Jenkins kullanıcısını docker grubuna ekle
RUN groupadd -f docker && usermod -aG docker jenkins

# Jenkins kullanıcısına geri dön
USER jenkins

# Plugin'leri otomatik yükle
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt

# JCasC konfigürasyon dosyasını kopyala
ENV CASC_JENKINS_CONFIG=/var/jenkins_home/casc.yaml
COPY casc.yaml /usr/share/jenkins/ref/casc.yaml

# Setup wizard'ı devre dışı bırak (JCasC kullanılacak)
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"
