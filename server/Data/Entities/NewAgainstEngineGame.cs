namespace Server.Data.Entities {
    public class NewAgainstEngineGame {
        public required string EngineId { get; set; }
        public required bool IsTheEngineWhite { get; set; }
        public required ushort EngineELO { get; set; }
    }
}
