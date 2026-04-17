#!/bin/bash
set -euxo pipefail

# Install Docker
dnf update -y
dnf install -y docker
systemctl enable docker
systemctl start docker
usermod -aG docker ec2-user

# Install Docker Compose plugin
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Install Nginx
dnf install -y nginx
systemctl enable nginx

# Configure Nginx as reverse proxy
cat > /etc/nginx/conf.d/gleider-dev.conf << 'NGINX'
server {
    listen 80 default_server;
    server_name ${domain} www.${domain};

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name api.${domain};

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name letreco.${domain};

    location /api/ {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

# Remove default nginx config
rm -f /etc/nginx/conf.d/default.conf
# Remove the default server block and any orphaned location blocks from nginx.conf
sed -i '/^        server {/,/^        }/d' /etc/nginx/nginx.conf 2>/dev/null || true
sed -i '/^        location /,/^        }/d' /etc/nginx/nginx.conf 2>/dev/null || true

systemctl restart nginx

# ECR login script
cat > /home/ec2-user/ecr-login.sh << 'ECRLOGIN'
#!/bin/bash
aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${account_id}.dkr.ecr.${region}.amazonaws.com
ECRLOGIN
chmod +x /home/ec2-user/ecr-login.sh

# Deploy script
cat > /home/ec2-user/deploy.sh << 'DEPLOY'
#!/bin/bash
set -euo pipefail

echo "Logging into ECR..."
/home/ec2-user/ecr-login.sh

echo "Deploy complete! Use CI/CD pipelines to deploy applications."
DEPLOY
chmod +x /home/ec2-user/deploy.sh

chown -R ec2-user:ec2-user /home/ec2-user/
