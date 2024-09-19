using Oracle.ManagedDataAccess.Client;

namespace Tests {
    public class UnitTest1 {
        [Fact]
        public async Task OracleDatabaseConnectionShouldBeSuccessful() {
            string connectionString = "User Id=some_user; Password=password; Data Source=localhost:1521; ";

            using var conn = new OracleConnection(connectionString);

            await conn.OpenAsync();

            Assert.Equal(1, 1);
        }
    }
}
