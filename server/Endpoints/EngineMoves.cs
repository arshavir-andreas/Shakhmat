using Server.Data;
using Server.Data.Entities;
using Server.Services;

namespace Server.Endpoints {
    public static class EngineMoves {
        public static RouteGroupBuilder MapEngineMovesEndpoints(this RouteGroupBuilder group) {
            group.MapPost("/best-move", async (EngineMovesService engineMovesService, PositionToEvaluate positionToEvaluate) => {
                var bestMove = await engineMovesService.GetBestMoveFromFenPosition(positionToEvaluate);

                if (bestMove == null) {
                    throw new CustomException("No best move found!", System.Net.HttpStatusCode.BadRequest);
                }

                return Results.Ok(bestMove);
            });

            return group;
        }
    }
}
