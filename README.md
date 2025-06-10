# wireguard-manager

Helps to setup multi-way site-to-site and manage client configs. Works well for single site too.

## Network architecture

- each site has to have unique private address space ideally from 192.168.0.0/16 range
- VPN uses 172.16.0.0/16 network
- each site gets a /24 segment assigned, from 172.16.0.0/16 range
- clients get an address at each site, and couple of useful predefined configs:
  - local only
  - local only, pihole dns
  - redirect-all, vpn dns
  - redirect-all, pihole dns

## Deployment

Setup has 2 main steps:

1. deploy and configure wireguard-manager on local server using docker compose
2. configure routing (enable packet forwarding, adjust firewall, add static routes on router)
3. (optional) Configure remote sites (create user, setup sshd, configure routing, deploy config)

### Step 1 - deploy and configure wireguard-manager

#### Deploy in the main site using docker-compose.yaml

    version: '3'
    services:
        wireguard:
            image: lukasz-karolewski/wireguard-manager
            volumes:
            - /etc/wireguard:/config
            ports:
            - "80:80"
            - "443:443"
        # pihole:

#### Auto reload wireguard

You can configure Ubuntu to reload the WireGuard service whenever the wg0.conf configuration file gets updated by creating a systemd service that monitors the file for changes.

Here are the steps to create the systemd service:

1.  Create a new file named /etc/systemd/system/wireguard-reload.service with the following contents:

        [Unit]
        Description=Reload WireGuard when wg0.conf changes

        [Service]
        Type=oneshot
        ExecStart=/bin/systemctl reload wg-quick@wg0.service

        [Install]
        WantedBy=multi-user.target

    This service will reload the wg-quick@wg0.service service whenever the wg0.conf file changes.

2.  Create a new file named /etc/systemd/system/wireguard-reload.path with the following contents:

         [Unit]
         Description=Watch /etc/wireguard/wg0.conf for changes

         [Path]
         PathModified=/etc/wireguard/wg0.conf

         [Install]
         WantedBy=multi-user.target

    This file defines a path unit that monitors the wg0.conf file for changes.

3.  Reload the systemd daemon to pick up the new service and path units:

        sudo systemctl daemon-reload

4.  Start the path unit to begin monitoring the wg0.conf file:

        sudo systemctl start wireguard-reload.path

    This will start the path unit and begin monitoring the wg0.conf file for changes.

5.  Enable the path unit to start automatically at boot:

        sudo systemctl enable wireguard-reload.path

This will enable the path unit to start automatically at boot time.

That's it! Now whenever the wg0.conf file changes, the WireGuard service will be reloaded automatically.

### Step 2 - configure routing

### Step 3 - optional - Configure remote sites

Configure SSH access to remote sites to allow automatic WireGuard config deployment.

#### Option 1 - Use existing user with sudo permissions

1. Generate SSH key pair and copy to remote host:

```bash
ssh-keygen -t rsa
ssh-copy-id username@remote-host
```

2. On the remote host, edit sudoers file:

```bash
sudo visudo
```

3. Add this line (replace 'username' with actual SSH user):

```
username ALL=(ALL) NOPASSWD: /bin/cp /etc/wireguard/* /etc/wireguard/*.bak, /bin/cp /tmp/wg-remote-config.conf /etc/wireguard/*, /bin/chmod 600 /etc/wireguard/*
```

#### Option 2 - Create dedicated limited user

1. Create dedicated user for config deployment:

```bash
sudo adduser wg-deploy
su - wg-deploy
ssh-keygen -t rsa
ssh-copy-id wg-deploy@remote-host
```

2. On the remote host, restrict user to config deployment only:

```bash
sudo nano /etc/ssh/sshd_config
```

Add these lines:

```
Match User wg-deploy
    ForceCommand /bin/bash -c 'while read line; do eval "$line"; done'
    PermitTTY no
    X11Forwarding no
    AllowAgentForwarding no
    AllowTcpForwarding no
```

3. Restart SSH service:

```bash
sudo systemctl restart sshd
```

## Persistance/backup

sql lite db is stored in prod.db file

## roadmap

- check for ip conflicts, right now clients start getting assigned with a x.x.x.1 address which is the same as for the site server

- ipv6 subnets
  - https://simpledns.plus/private-ipv6
  - https://computering.tastytea.de/posts/wireguard-vpn-with-2-or-more-subnets/
- wg status integration
  https://github.com/vx3r/wg-gen-web
  https://github.com/jamescun/wg-api
