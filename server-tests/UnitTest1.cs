using Oracle.ManagedDataAccess.Client;

namespace Tests {
    public class UnitTest1 {
        [Fact]
        public async Task OracleDatabaseConnectionShouldBeSuccessful() {
            string connectionString = "User Id=shakhmat; Password=UkcREWFel0jWpbnA; Data Source=localhost:1521; Persist Security Info=True; Pooling=True; ";

            using var conn = new OracleConnection(connectionString);

            await conn.OpenAsync();

            Assert.Equal(1, 1);
        }

        [Fact]
        public async Task UsersTableShouldExist() {
            string connectionString = "User Id=shakhmat; Password=UkcREWFel0jWpbnA; Data Source=localhost:1521; Persist Security Info=True; Pooling=True; ";

            using var conn = new OracleConnection(connectionString);

            await conn.OpenAsync();

            using var cmd = new OracleCommand(@"
                SELECT COUNT(*) as user_count
                FROM user_tables
            ", conn);

            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync()) {
                Assert.Equal(1, (decimal)reader["user_count"]);

                return;
            }

            Assert.Fail("");
        }
    }
}
