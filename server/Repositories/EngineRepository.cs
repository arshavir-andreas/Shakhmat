using Oracle.ManagedDataAccess.Client;
using Server.Data.Entities;

namespace Server.Repositories {
    public class EngineRepository(string connectionString) {
        private readonly string _connectionString = connectionString;

        public async Task<List<Engine>> GetEngines() {
            using var conn = new OracleConnection(_connectionString);

            await conn.OpenAsync();

            using var cmd = new OracleCommand(@"
                SELECT e.id, e.binary_path, e.name, e.min_elo, e.max_elo
                FROM engines e
            ", conn);

            using var reader = await cmd.ExecuteReaderAsync();

            var res = new List<Engine>();

            while (await reader.ReadAsync()) {
                res.Add(new Engine {
                    Id = reader["id"].ToString()!,
                    BinaryPath = reader["binary_path"].ToString()!,
                    Name = reader["name"].ToString()!,
                    MinELO = Convert.ToUInt16(reader["min_elo"]),
                    MaxELO = Convert.ToUInt16(reader["max_elo"]),
                });
            }

            return res;
        }

        public async Task PostAgainstEngineGame(long id, int isTheEngineWhite, short engineELO, long engineId, long userId) {
            using var conn = new OracleConnection(_connectionString);

            await conn.OpenAsync();

            using var cmd = new OracleCommand(@"
                INSERT INTO against_engine_games (id, is_the_engine_white, engine_elo, engine_id, user_id)
                VALUES (:id, :is_the_engine_white, :engine_elo, :engine_id, :user_id)
            ", conn);

            cmd.Parameters.Add(new OracleParameter(":id", id));
            cmd.Parameters.Add(new OracleParameter(":is_the_engine_white", isTheEngineWhite));
            cmd.Parameters.Add(new OracleParameter(":engine_elo", engineELO));
            cmd.Parameters.Add(new OracleParameter(":engine_id", engineId));
            cmd.Parameters.Add(new OracleParameter(":user_id", userId));

            await cmd.ExecuteNonQueryAsync();
        }

        public async Task<AgainstEngineGame?> GetAgainstEngineGame(long gameId) {
            using var conn = new OracleConnection(_connectionString);

            await conn.OpenAsync();

            using var cmd = new OracleCommand(@"
                SELECT aeg.engine_id, e.name AS engine_name, aeg.engine_elo, aeg.is_the_engine_white, aeg.pgn, aeg.result, aeg.created_at, aeg.user_id
                FROM against_engine_games aeg
                INNER JOIN engines e ON aeg.engine_id = e.id
                WHERE aeg.id = :game_id
            ", conn);

            cmd.Parameters.Add(new OracleParameter(":game_id", gameId));

            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync()) {
                return new AgainstEngineGame {
                    Engine = new EngineDetails {
                        Id = reader["engine_id"].ToString()!,
                        Name = reader["engine_name"].ToString()!,
                        ELO = Convert.ToUInt16(reader["engine_elo"]),
                        IsWhite = Convert.ToBoolean(reader["is_the_engine_white"]),
                    },
                    PGN = reader["pgn"].ToString()!,
                    Result = reader["result"].ToString()!,
                    CreatedAt = Convert.ToDateTime(reader["created_at"]),
                    UserId = Convert.ToInt64(reader["user_id"]),
                };
            }

            return null;
        }
    }
}
