namespace Server.Data.Entities {
    public class LoginCredentials {
        public required string UsernameOrEmail { get; set; }
        public required string Password { get; set; }
    }
}
