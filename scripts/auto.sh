#!/bin/bash

set -e

home="/app/dist/"

cd $home 

echo "Waiting for database..."

echo DB_NAME: ${DB_NAME}
echo DB_HOST: ${DB_HOST}
echo DB_PORT: ${DB_PORT}
echo HOST_NAME: ${HOST_NAME}
echo HOST_PORT: ${HOST_PORT}


npm run check_db
echo "RUN DB MIGRATION"
echo "================"
npx sequelize-cli db:migrate

echo "================================="
echo "YOUR SERVER IS UP AND RUNNING NOW"
echo "================================="

npm run start

# failed to connect database | db not started yet
# failed to connect port 3000