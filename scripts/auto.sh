#!/bin/bash

set -e

alias home="cd /app/dist/"
home && npx sequelize-cli db:migrate

echo "================================="
echo "YOUR SERVER IS UP AND RUNNING NOW"
echo "================================="

npm run start