using Oracle.ManagedDataAccess.Client;

namespace Server.Repositories {
    public class UserRepository(string connectionString) {
        private readonly string _connectionString = connectionString;

        public async Task<long?> GetUserId(string username, string email) {
            using var conn = new OracleConnection(_connectionString);

            await conn.OpenAsync();

            using var cmd = new OracleCommand(@"
                SELECT u.id
                FROM users u
                WHERE u.username = :username
                OR u.email = :email
            ", conn);

            cmd.Parameters.Add(new OracleParameter(":username", username));
            cmd.Parameters.Add(new OracleParameter(":email", email));

            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync()) {
                return Convert.ToInt64(reader["id"]);
            }

            return null;
        }

        public async Task PostUser(long id, string username, string email, string hashedPassword) {
            using var conn = new OracleConnection(_connectionString);

            await conn.OpenAsync();

            using var cmd = new OracleCommand(@"
                INSERT INTO users (id, username, email, password)
                VALUES (:id, :username, :email, :hashedPassword)
            ", conn);

            cmd.Parameters.Add(new OracleParameter(":id", id));
            cmd.Parameters.Add(new OracleParameter(":username", username));
            cmd.Parameters.Add(new OracleParameter(":email", email));
            cmd.Parameters.Add(new OracleParameter(":hashedPassword", hashedPassword));

            await cmd.ExecuteNonQueryAsync();
        }
    }
}
