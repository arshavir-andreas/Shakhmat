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

BEGIN
    create_table_if_not_exists('users', q'[
        id NUMBER(20) PRIMARY KEY,
        username VARCHAR2(32) NOT NULL,
        email VARCHAR2(64) NOT NULL,
        password VARCHAR2(255) NOT NULL
    ]');
END;
/
