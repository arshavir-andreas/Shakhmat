namespace Server.Data.Entities {
    public class PositionToEvaluate {
        public required string EngineId { get; set; }
        public required int EngineELO { get; set; }
        public required string FenPosition { get; set; }
    }
}
