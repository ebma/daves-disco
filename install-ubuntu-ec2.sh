#! /bin/bash
# certbot
echo "Starting certbot installation..."
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo snap set certbot trust-plugin-with-root=ok
sudo snap install certbot-dns-cloudflare
echo "Enter Cloudflare DNS api token for certbot:"
read -s CLOUDFLARE_CREDENTIALS
echo "dns_cloudflare_api_token = $CLOUDFLARE_CREDENTIALS" > .cloudflare
sudo certbot certonly --dns-cloudflare --dns-cloudflare-credentials .cloudflare \
  -d *.marcel-ebert.de -d *.marcelebert.com

sudo chown $(whoami) /etc/letsencrypt/live/ -R
sudo chown $(whoami) /etc/letsencrypt/archive/ -R

# install node
echo "Installing node..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 14
node -e "console.log('Running Node.js ' + process.version)"

# allow non-root node to use ports 80 and 443
sudo setcap 'cap_net_bind_service=+ep' $(which node)

# install required packages
sudo apt-get install build-essential libtool -y
# npm install
echo "Installing npm dependencies..."
npm i --also=dev

# if .env does not exist or is empty add env vars
test -s .env || echo "PORT=443" && \ 
  echo "KEY_PATH=/etc/letsencrypt/live/daves-disco.marcel-ebert.de/privkey.pem" >> .env && \
  echo "CERT_PATH=/etc/letsencrypt/live/daves-disco.marcel-ebert.de/fullchain.pem" >> .env 

npm install pm2 -g
# setup startup script
sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v14.16.0/bin /home/ubuntu/.nvm/versions/node/v14.16.0/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
NODE_ENV=production pm2 start --name='daves-disco' npm -- run start
pm2 save
