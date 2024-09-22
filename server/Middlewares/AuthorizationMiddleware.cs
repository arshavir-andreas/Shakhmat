using System.Text.Json;
using Server.Data;
using Server.Data.Entities;
using Server.Repositories;

namespace Server {
    public class AuthenticationMiddleware(RequestDelegate next, UserRepository userRepository) {
        private readonly RequestDelegate _next = next;
        private readonly UserRepository _userRepository = userRepository;

        public async Task InvokeAsync(HttpContext httpContext) {
            var metadata = httpContext.GetEndpoint()?.Metadata.GetMetadata<ProtectedRouteMetadata>();

            if (metadata is null) {
                await _next(httpContext);

                return;
            }

            var authCookieKey = httpContext.Request.Cookies.FirstOrDefault((cookie) => cookie.Key == "j3jYR3gGUX7");

            if (authCookieKey.Key == "") {
                throw new CustomException("User not logged in! ", System.Net.HttpStatusCode.Unauthorized);
            }

            var sessionId = Convert.ToInt64(authCookieKey.Value);

            var userDetails = await _userRepository.GetUserDetailsBySessionId(sessionId);

            if (userDetails == null) {
                throw new CustomException("User not logged in! ", System.Net.HttpStatusCode.Unauthorized);
            }

            httpContext.Items["CurrentUserDetails"] = new CurrentUserDetails {
                Id = userDetails.Id,
                Username = "Guest",
                SessionId = sessionId,
            };

            await _next(httpContext);
        }
    }
}
