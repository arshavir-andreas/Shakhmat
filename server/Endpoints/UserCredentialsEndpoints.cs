using Server.Data.Entities;

namespace Server.Endpoints {
    public static class UserCredentialsEndpoints {
        public static RouteGroupBuilder MapUserCredentialsEndpoints(this RouteGroupBuilder group) {
            group.MapGet("/", (HttpContext httpContext) => {
                var currentUserDetails = httpContext.Items["CurrentUserDetails"] as CurrentUserDetails;

                return Results.Ok(currentUserDetails);
            });

            return group;
        }
    }
}
