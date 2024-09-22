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

            group.MapPost("/best-move", async (EngineService engineService, PositionToEvaluate positionToEvaluate) => {
                var bestMove = await engineService.GetBestMoveFromFenPosition(positionToEvaluate);

                if (bestMove == null) {
                    throw new CustomException("No best move found!", System.Net.HttpStatusCode.BadRequest);
                }

                return Results.Ok(bestMove);
            });

            return group;
        }
    }
}
