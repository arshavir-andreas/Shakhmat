using Server.Data;
using Server.Data.Entities;
using Server.Services;

namespace Server.Endpoints {
    public static class EngineEndpoints {
        public static RouteGroupBuilder MapEngineEndpoints(this RouteGroupBuilder group) {
            group.MapGet("/", async (EngineService engineService) => {
                var engines = await engineService.GetEngines();

                return Results.Ok(engines);
            });

            group.MapPost("/new-game", async (HttpContext httpContext, EngineService engineService, NewAgainstEngineGame newAgainstEngineGame) => {
                var currentUserDetails = httpContext.Items["CurrentUserDetails"] as CurrentUserDetails;

                var gameId = await engineService.PostAgainstEngineGame(newAgainstEngineGame: newAgainstEngineGame, userId: currentUserDetails!.Id);

                return Results.Ok(gameId.ToString());
            });

            group.MapGet("/games/{gameId}", async (HttpContext httpContext, EngineService engineService, string gameId) => {
                var currentUserDetails = httpContext.Items["CurrentUserDetails"] as CurrentUserDetails;

                var againstEngineGame = await engineService.GetAgainstEngineGame(gameId: Convert.ToInt64(gameId), userId: currentUserDetails!.Id);

                if (againstEngineGame == null) {
                    throw new CustomException("Game not found!", System.Net.HttpStatusCode.NotFound);
                }

                return Results.Ok(againstEngineGame);
            });

            group.MapPost("/best-move", async (EngineService engineService, PositionToEvaluate positionToEvaluate) => {
                var bestMove = await engineService.GetBestMoveFromFenPosition(positionToEvaluate);

                if (bestMove == null) {
                    throw new CustomException("No best move found!", System.Net.HttpStatusCode.BadRequest);
                }

                return Results.Ok(bestMove);
            });

            group.MapPatch("/games/{gameId}", async (EngineService engineService, string gameId, GameToUpdate gameToUpdate) => {
                await engineService.UpdateGame(id: Convert.ToInt64(gameId), gameToUpdate: gameToUpdate);
                
                return Results.Ok();
            });

            return group;
        }
    }
}
