using System.Text.Json.Serialization;

namespace Server.Data.Entities {
    public class AgainstEngineGame {
        public required EngineDetails Engine { get; set; }
        public required string Username { get; set; }

        [JsonPropertyName("PGN")]
        public required string PGN { get; set; }

        public required string Result { get; set; }
        public required DateTime CreatedAt { get; set; }

        [JsonIgnore]
        public long? UserId { get; set; }
    }
}
