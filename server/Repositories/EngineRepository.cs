using Oracle.ManagedDataAccess.Client;
using Server.Data.Entities;

namespace Server.Repositories {
    public class EngineRepository(string connectionString) {
        private readonly string _connectionString = connectionString;

        public async Task<List<Engine>> GetEngines() {
            using var conn = new OracleConnection(_connectionString);

            await conn.OpenAsync();

            using var cmd = new OracleCommand(@"
                SELECT e.id, e.name, e.min_elo, e.max_elo
                FROM engines e
            ", conn);

            using var reader = await cmd.ExecuteReaderAsync();

            var res = new List<Engine>();

            while (await reader.ReadAsync()) {
                res.Add(new Engine {
                    Id = reader["id"].ToString()!,
                    Name = reader["name"].ToString()!,
                    MinELO = Convert.ToUInt16(reader["min_elo"]),
                    MaxELO = Convert.ToUInt16(reader["max_elo"]),
                });
            }

            return res;
        }
    }
}
