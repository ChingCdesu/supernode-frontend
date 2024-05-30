# Supernode - A simple N2N supernode with web interface

This is a simple N2N supernode with a web interface. It is based on the [n2n](https://github.com/ntop/n2n) project by ntop.

## Features
* Manage communities of supernode
* Manage devices in communities
* View online devices
* Support encrypted community
* Support public (unencrypted) community

## Installation
### Deploy with Docker
1. Copy `deploy/docker-compose.yaml` into a empty directory
2. Change environment variables in `docker-compose.yaml`
   * `<your database password>`: The password of the database, generate a random password and copy to here
   * `<your admin password>`: The admin password of the web interface, generate a random password and copy to here
   * `<your server name>`: The server name of the web interface, e.g. `supernode.example.com`, make sure you updated dns record of your domain.
3. Run `docker-compose up -d` to start the supernode
4. Visit `http://<your server name>:8080` to access the web interface
PS: If you cannot access the web interface, please check the firewall settings of your server.
