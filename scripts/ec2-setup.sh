#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# ec2-setup.sh
# Run ONCE on a fresh Amazon Linux 2 / Ubuntu EC2 instance to install
# Docker, Docker Compose, Jenkins, and configure the firewall.
#
# Usage:
#   chmod +x ec2-setup.sh
#   sudo ./ec2-setup.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e

OS=$(. /etc/os-release && echo "$ID")

install_ubuntu() {
    apt-get update -y
    apt-get install -y ca-certificates curl gnupg lsb-release git

    # Docker
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
        gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
      https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Jenkins
    curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | \
        tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
    echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
        https://pkg.jenkins.io/debian-stable binary/" | \
        tee /etc/apt/sources.list.d/jenkins.list > /dev/null
    apt-get update -y
    apt-get install -y default-jdk jenkins
}

install_amazon_linux() {
    yum update -y
    yum install -y docker git java-17-amazon-corretto

    # Docker Compose v2 plugin
    mkdir -p /usr/local/lib/docker/cli-plugins
    curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" \
        -o /usr/local/lib/docker/cli-plugins/docker-compose
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

    # Jenkins
    wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
    rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
    yum install -y jenkins
}

if [[ "$OS" == "ubuntu" ]]; then
    install_ubuntu
elif [[ "$OS" == "amzn" ]]; then
    install_amazon_linux
else
    echo "Unsupported OS: $OS. Run the steps manually."
    exit 1
fi

# ── Enable & start services ───────────────────────────────────────────────────
systemctl enable docker  && systemctl start docker
systemctl enable jenkins && systemctl start jenkins

# ── Add jenkins user to docker group (so Jenkins can run docker commands) ────
usermod -aG docker jenkins
usermod -aG docker "$SUDO_USER" || true   # also add the current SSH user

# ── Open ports in iptables (if ufw/firewalld is active) ──────────────────────
# Port 8080 = Jenkins UI, Port 80/443 = app via nginx
if command -v ufw &>/dev/null; then
    ufw allow 22
    ufw allow 80
    ufw allow 443
    ufw allow 8080
fi
if command -v firewall-cmd &>/dev/null; then
    firewall-cmd --permanent --add-port=22/tcp
    firewall-cmd --permanent --add-port=80/tcp
    firewall-cmd --permanent --add-port=443/tcp
    firewall-cmd --permanent --add-port=8080/tcp
    firewall-cmd --reload
fi

echo ""
echo "============================================================"
echo " Setup complete!"
echo " Jenkins initial admin password:"
cat /var/lib/jenkins/secrets/initialAdminPassword 2>/dev/null || \
    echo "  (not yet generated — Jenkins may still be starting)"
echo ""
echo " Next steps:"
echo "  1. Open http://<EC2-PUBLIC-IP>:8080 to configure Jenkins"
echo "  2. Install suggested plugins + Pipeline plugin"
echo "  3. Add the following Jenkins credentials (Secret text):"
echo "       MONGODB_URI, VITE_SUPABASE_URL,"
echo "       VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY"
echo "  4. Create a Pipeline job pointing to this repo's Jenkinsfile"
echo "  5. Ensure EC2 Security Group allows ports 80, 443, 8080"
echo "============================================================"
