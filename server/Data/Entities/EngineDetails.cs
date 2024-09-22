using System.Text.Json.Serialization;

namespace Server.Data.Entities {
    public class EngineDetails {
        public required string Id { get; set; }
        public required string Name { get; set; }
        
        [JsonPropertyName("ELO")]
        public required ushort ELO { get; set; }
        public required bool IsWhite { get; set; }
    }
}
