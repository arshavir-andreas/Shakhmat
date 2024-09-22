namespace Server.Data.Entities {
    public class CurrentUserDetails {
        public required long Id { get; set; } = -1;
        public required string Username { get; set; } = "";
        public required long SessionId { get; set; } = -1;
    }
}
