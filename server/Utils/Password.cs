using BCrypt.Net;

namespace Server.Utils {
    public class Password {
        public static string HashPassword(string plainPassword) {
            return BCrypt.Net.BCrypt.EnhancedHashPassword(plainPassword, HashType.SHA512);
        }

        public static bool VerifyPassword(string plainPassword, string hashedPassword) {
            return BCrypt.Net.BCrypt.EnhancedVerify(plainPassword, hashedPassword, HashType.SHA512);
        }
    }
}
