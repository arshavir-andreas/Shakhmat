using Server.Data;
using Server.Data.Entities;
using Server.Services;

namespace Server.Endpoints {
    public static class UserEndpoints {
        public static RouteGroupBuilder MapUserEndpoints(this RouteGroupBuilder group) {
            group.MapPost("/", async (UserService userService, UserToAdd userToAdd) => {
                await userService.PostUser(userToAdd: userToAdd);

                return Results.Ok();
            });

            group.MapPost("/login", async (HttpContext httpContext, UserService userService, LoginCredentials loginCredentials) => {
                var sessionDuration = 60 * 60 * 24;

                var userCredentials = await userService.Login(loginCredentials: loginCredentials, sessionDuration: sessionDuration);

                if (userCredentials == null) {
                    throw new CustomException("Incorrect credentials! Try again! ", System.Net.HttpStatusCode.Forbidden);
                }

                httpContext.Response.Cookies.Append("j3jYR3gGUX7", userCredentials.SessionId, new CookieOptions {
                    HttpOnly = true,
                    MaxAge = TimeSpan.FromSeconds(sessionDuration),
                    Secure = false,
                    SameSite = SameSiteMode.Lax,
                });

                return Results.Ok(userCredentials);
            });

            return group;
        }
    }
}
