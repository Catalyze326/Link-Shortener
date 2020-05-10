# Link Shortener

I wanted to learn nodejs and this seemed like something moderately interesting and useful. You have no idea what tracking is in the mainstream ones. This only has whatever tracking you put in it.

### Deployment Instructions

I have my dynamic dns hard coded in which you are going to want to change to what you are using. You are also going to want to comment out the ssl certs and make it run over http till you get your ssl certs and your dynamic dns working. Comment out all the redirectPort stuff and uncomment app.listen and put in the port you want.

##### Windows
Why would you do that to yourself? Use linux.

##### RHEL based distros
```
curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -
```
```
sudo yum install nodejs
```
```
git clone https://github.com/Catalyze326/Link-Shortener.git
```
```
cd Link-Shortener
```
```
npm install
```
```
sudo node server.js
```
if you want to run without root change the ports to something other than 80 and 443. You can remove 80 and 8080 is a good one to switch to.
```
node server.js
```
If you want it exposed outside your network I sugest using a dynamic dns and port fowarding or an aws server

For dynamic dns duckdns.org is good, but if you want a more custamized link google domains have a nice feature where you can use a sub domain as a dynamic dns. This is a good article on how to make that easier.

https://medium.com/@jeremygale/how-to-set-up-a-free-dynamic-hostname-with-ssl-cert-using-google-domains-58929fdfbb7a

To generate ssl use this
```
sudo certbot certonly --dry-run  --standalone -d YOUR.DYNAMIC.DNS
```