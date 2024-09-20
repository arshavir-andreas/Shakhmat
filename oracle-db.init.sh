docker exec oracle_db resetPassword $1 && \
    docker exec oracle_db sh -c "sqlplus SYSTEM/\"$1\"@localhost:1521 @/usr/src/schema.sql" && \
    docker exec oracle_db sh -c "sqlplus shakhmat/\"UkcREWFel0jWpbnA\"@localhost:1521 @/usr/src/tables.sql"
