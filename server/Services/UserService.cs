using Server.Data;
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
    }
}
