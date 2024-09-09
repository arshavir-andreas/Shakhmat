namespace Server.Data.Entities {
    public class PositionToEvaluate {
        public int? EngineELO { get; set; }
        public required string FenPosition { get; set; }
    }
}
