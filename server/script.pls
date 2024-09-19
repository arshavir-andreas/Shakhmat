-- CREATE USER some_user IDENTIFIED BY password;

-- GRANT CONNECT, RESOURCE TO some_user;

-- GRANT DBA TO some_user;

CREATE TABLE users (
    id NUMBER(20) PRIMARY KEY,
    username VARCHAR(32) NOT NULL,
    email VARCHAR(64) NOT NULL,
    password VARCHAR(255) NOT NULL
);
