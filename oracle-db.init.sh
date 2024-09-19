docker exec oracle_db resetPassword $1

docker exec oracle_db sh -c "sqlplus SYSTEM/$1@localhost:1521 @/container-entrypoint-initdb.d/script.sql"
