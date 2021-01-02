# 📥 Lightweight node.js backup service for Ghost CMS

This repository is the finished project for by blog entry on [How to make automated backups of your Ghost blog with node.js](https://q-bit.me/how-to-make-backups-of-your-ghost-blog-with-node-js).

This repos differs from the presented blogpost insofar as

- It does not have all the configuration stored in the /config/config.js, but uses an environment file and the dotenv package
- It uses pm2 process manager to run the index file and for monitoring


## Setup

If you want to use this version, you will need to install pm2 processmanager globally

```
$ npm i -g pm2
```

Then, follow these steps to setup your own environment

```sh
# Clone the repos
$ git clone https://github.com/tq-bit/ghost-backups.git

# Install npm dependencies
$ npm i

# Move into the directory and create a .env file
$ cd ghost-backups
$ touch .env

# Fill the .env file with live
```

## Dotenv content

```sh
# Inside the .env file, add these variables
ghostApiUrl=https://<your ghost domain>/ghost/api/v3/admin
ghostAdminKey=<your Ghost Admin key (you receive this1 inside the admin interface->integrations)>
backupDirPath=<path on your local machine you would like to store the backups in>
```

## Start the service

```sh
# Startup the service
$ npm start

# Reload the service
$ npm reload

# If you don't want to use pm2
$ node index
```