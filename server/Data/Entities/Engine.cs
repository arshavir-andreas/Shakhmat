namespace Server.Data.Entities {
    public class Engine {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required ushort MinELO { get; set; }
        public required ushort MaxELO { get; set; }
    }
}
