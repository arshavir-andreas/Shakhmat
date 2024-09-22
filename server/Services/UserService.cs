using Server.Data;
using Server.Data.Entitie;
using Server.Data.Entities;
using Server.Repositories;
using Server.Utils;

namespace Server.Services {
    public class UserService(UserRepository userRepository) {
        private readonly UserRepository _userRepository = userRepository;

        public async Task PostUser(UserToAdd userToAdd) {
            var someUserId = await _userRepository.GetUserId(username: userToAdd.Username, email: userToAdd.Email);

            if (someUserId != null) {
                throw new CustomException("This user already exists!", System.Net.HttpStatusCode.BadRequest);
            }

            var id = ID.GenerateID();

            var hashedPassword = Password.HashPassword(userToAdd.Password);

            await _userRepository.PostUser(id: id, username: userToAdd.Username, email: userToAdd.Email, hashedPassword: hashedPassword);
        }

        public async Task<UserCredentials?> Login(LoginCredentials loginCredentials, int sessionDuration) {
            var userDetails = await _userRepository.GetUserDetailsByUsernameOrEmail(loginCredentials.UsernameOrEmail);

            if (userDetails == null) {
                return null;
            }

            if (!Password.VerifyPassword(plainPassword: loginCredentials.Password, hashedPassword: userDetails.Password)) {
                return null;
            }

            var sessionId = ID.GenerateID();

            await _userRepository.PostUserSession(id: sessionId, duration: sessionDuration, userId: userDetails.Id);

            return new UserCredentials {
                Id = userDetails.Id.ToString(),
                Username = userDetails.Username,
                SessionId = sessionId.ToString(),
            };
        }
    }
}
