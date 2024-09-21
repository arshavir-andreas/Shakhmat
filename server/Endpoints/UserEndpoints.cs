using Server.Data.Entities;
using Server.Services;

namespace Server.Endpoints {
    public static class UserEndpoints {
        public static RouteGroupBuilder MapUserEndpoints(this RouteGroupBuilder group) {
            group.MapPost("/", async (UserService userService, UserToAdd userToAdd) => {
                await userService.PostUser(userToAdd: userToAdd);

                return Results.Ok();
            });

            return group;
        }
    }
}
