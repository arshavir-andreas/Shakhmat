namespace Server.Data.Entities {
    public class PositionToEvaluate {
        public int? engineELO { get; set; }
        public required string FenPosition { get; set; }
    }
}
