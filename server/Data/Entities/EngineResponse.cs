namespace Server.Data.Entities {
    public class EngineResponse {
        public required string From { get; set; }
        public required string To { get; set; }
        public char? Promotion { get; set; }
    }
}
