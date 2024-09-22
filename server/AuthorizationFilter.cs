using Server.Data;
using Server.Repositories;

namespace Server {
    public class AuthorizationFilter(UserRepository userRepository) : IEndpointFilter {
        private readonly UserRepository _userRepository = userRepository;

        public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next) {
            var result = await next(context);

            var authCookieKey = context.HttpContext.Request.Cookies.FirstOrDefault((cookie) => cookie.Key == "j3jYR3gGUX7");

            if (authCookieKey.Key == "") {
                throw new CustomException("User not logged in! ", System.Net.HttpStatusCode.Unauthorized);
            }

            var userId = await _userRepository.GetUserIdBySessionId(Convert.ToInt64(authCookieKey.Value));

            if (userId == null) {
                throw new CustomException("User not logged in! ", System.Net.HttpStatusCode.Unauthorized);
            }

            return result;
        }
    }
}
