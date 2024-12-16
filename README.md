===

# Prisma cheat sheet
```bash

# create postgres SERVER in docker container
# /!\ set a custom port to avoid connexion problem => 5433:5432
# the default port has to be set in second position
$ docker run --name nl-solution -e POSTGRES_PASSWORD=postgres -d -p 5433:5432 postgres

# create your database on server
$ docker exec -it nl-solution psql -U postgres -c 'CREATE DATABASE flashCarder;'

# see pid of running port 5432
$ sudo lsof -i :5432
$ sudo kill [pid]

# Prisma
$ npm i prisma
$ npx prisma init --datasource-provider postgresql

# migrate new version of the db
$ npx prisma migrate dev --name init

# install the prisma client
$ npm i @prisma/client

# (re)generate the client
$ npx prisma generate
```