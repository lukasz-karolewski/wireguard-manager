# wireguard-manager

Helps to setup multi-way site-to-site and manage client configs. Works well for single site too.

## roadmap

- check for ip conflicts, right now clients start getting assigned with a x.x.x.1 address which is the same as for the site server

- ipv6 subnets
  - https://simpledns.plus/private-ipv6
  - https://computering.tastytea.de/posts/wireguard-vpn-with-2-or-more-subnets/

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

This is done by creating dedicated user, ssh keys to remote sites and allowing that user to scp new wg config

1. Create a new user account:

```
sudo adduser <username>
```

2. Switch to the new user account:

```
su - <username>
```

3. Generate an SSH key pair:

```
ssh-keygen -t rsa
```

4. Copy the public key to the server:

```
ssh-copy-id <username>@<server>
```

5. Test the SSH connection:

```
ssh <username>@<server>
```

#### Option 1 - Allow only SCP to overwrite wg0.conf

6. Edit the `/etc/ssh/sshd_config` file:

```
sudo nano /etc/ssh/sshd_config
```

7. Add the following lines to the end of the file:

```
Match User <username>
    ForceCommand scp /etc/wireguard/wg0.conf
```

8. Save and close the file.

9. Restart the SSH service:

```
sudo systemctl restart sshd
```

Now the user can SSH into the server without a password and can only use SCP to overwrite `/etc/wireguard/wg0.conf`.

#### Option 2 - Allow user to run specific commands without password

        # On the remote host, edit sudoers file
        sudo visudo

        # Add this line (replace 'username' with actual SSH user):
        username ALL=(ALL) NOPASSWD: /bin/cp /etc/wireguard/* /etc/wireguard/*.bak, /bin/cp /tmp/wg-remote-config.conf /etc/wireguard/*, /bin/chmod 600 /etc/wireguard/*

## Persistance/backup

sql lite db is stored in prod.db file

# status

https://github.com/vx3r/wg-gen-web
https://github.com/jamescun/wg-api
