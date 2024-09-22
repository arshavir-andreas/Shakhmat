using Oracle.ManagedDataAccess.Client;
using Server.Data.Entitie;
using Server.Data.Entities;

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

        public async Task<UserDetails?> GetUserDetailsByUsernameOrEmail(string usernameOrEmail) {
            using var conn = new OracleConnection(_connectionString);

            await conn.OpenAsync();

            using var cmd = new OracleCommand(@"
                SELECT u.id, u.username, u.password
                FROM users u
                WHERE u.username = :username
                OR u.email = :email
            ", conn);

            cmd.Parameters.Add(new OracleParameter(":username", usernameOrEmail));
            cmd.Parameters.Add(new OracleParameter(":email", usernameOrEmail));

            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync()) {
                return new UserDetails {
                    Id = Convert.ToInt64(reader["id"]),
                    Username = reader["username"].ToString()!,
                    Password = reader["password"].ToString()!,
                };
            }

            return null;
        }

        public async Task PostUserSession(long id, int duration, long userId) {
            using var conn = new OracleConnection(_connectionString);

            await conn.OpenAsync();

            using var cmd = new OracleCommand(@"
                INSERT INTO users_sessions (id, duration, user_id)
                VALUES (:id, :duration, :user_id)
            ", conn);

            cmd.Parameters.Add(new OracleParameter(":id", id));
            cmd.Parameters.Add(new OracleParameter(":duration", duration));
            cmd.Parameters.Add(new OracleParameter(":user_id", userId));

            await cmd.ExecuteNonQueryAsync();
        }

        public async Task<long?> GetUserIdBySessionId(long sessionId) {
            using var conn = new OracleConnection(_connectionString);

            await conn.OpenAsync();

            using var cmd = new OracleCommand(@"
                SELECT us.id
                FROM users_sessions us
                INNER JOIN users u ON us.user_id = u.id
                WHERE us.id = :session_id
                AND (us.created_at + numToDSInterval(us.duration, 'second')) >= CURRENT_TIMESTAMP
            ", conn);

            cmd.Parameters.Add(new OracleParameter(":session_id", sessionId));

            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync()) {
                return Convert.ToInt64(reader["id"]);
            }

            return null;
        }
    }
}
