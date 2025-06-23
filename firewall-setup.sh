#!/bin/bash
# /home/$USER/firewall-setup.sh
# UFW Firewall configuration script

set -e

echo "🔒 Configuring UFW Firewall..."

# Reset UFW to defaults
ufw --force reset

# Set default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (be careful with this!)
ufw allow ssh
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 'Nginx Full'
ufw allow 80/tcp
ufw allow 443/tcp

# Allow application port (for direct access if needed)
ufw allow 3000/tcp

# Allow specific IPs for admin access (optional)
# ufw allow from YOUR_ADMIN_IP to any port 22
# ufw allow from YOUR_ADMIN_IP to any port 3000

# Rate limiting for SSH
ufw limit ssh

# Enable UFW
ufw --force enable

# Show status
ufw status verbose

echo "✅ Firewall configuration completed!"
echo "⚠️  Make sure you can still access your server via SSH before closing this session!"
