SET SQLBLANKLINES ON;
SET SERVEROUTPUT ON;

CREATE OR REPLACE PROCEDURE create_table_if_not_exists(input_table_name IN VARCHAR2, input_table_columns IN VARCHAR2)
IS
    sql_stmt VARCHAR2(4000);
    table_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM user_tables
    WHERE UPPER(table_name) = UPPER(input_table_name);

    IF table_count = 0 THEN
        sql_stmt := 'CREATE TABLE ' || input_table_name || ' (' || input_table_columns || ')';

        EXECUTE IMMEDIATE sql_stmt;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/

CREATE OR REPLACE PROCEDURE insert_engine_if_not_exists(
    input_id IN NUMBER, input_name IN VARCHAR2, input_min_elo IN NUMBER, input_max_elo IN NUMBER, input_binary_path IN VARCHAR2
) IS
BEGIN
    INSERT INTO engines (id, name, min_elo, max_elo, binary_path)
    VALUES (input_id, input_name, input_min_elo, input_max_elo, input_binary_path);

    EXCEPTION
        WHEN dup_val_on_index THEN
            UPDATE engines SET 
                name = input_name,
                min_elo = input_min_elo,
                max_elo = input_max_elo,
                binary_path = input_binary_path
            WHERE id = input_id;
END;
/

BEGIN
    create_table_if_not_exists('users', q'[
        id NUMBER(20) PRIMARY KEY,
        username VARCHAR2(32) NOT NULL,
        email VARCHAR2(64) NOT NULL,
        password VARCHAR2(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    ]');

    create_table_if_not_exists('users_sessions', q'[
        id NUMBER(20) PRIMARY KEY,
        duration NUMBER(8) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        user_id NUMBER(20) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    ]');

    create_table_if_not_exists('engines', q'[
        id NUMBER(20) PRIMARY KEY,
        name VARCHAR2(16) NOT NULL,
        min_elo NUMBER(4) NOT NULL,
        max_elo NUMBER(4) NOT NULL,
        binary_path VARCHAR2(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    ]');

    insert_engine_if_not_exists(0, 'Arasan', 1000, 3450, 'arasan/arasanx-64');
    insert_engine_if_not_exists(1, 'Stockfish', 1320, 3190, 'stockfish/stockfish-x86-64');
END;
/
