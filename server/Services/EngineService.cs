using System.Diagnostics;
using Server.Data.Entities;
using Server.Repositories;
using Server.Utils;

namespace Server.Services {
    public class EngineService(EngineRepository engineRepository) {
        private readonly EngineRepository _engineRepository = engineRepository;
        
        public async Task<List<Engine>> GetEngines() {
            return await _engineRepository.GetEngines();
        }

        public async Task<long> PostAgainstEngineGame(NewAgainstEngineGame newAgainstEngineGame, long userId) {
            var gameId = ID.GenerateID();

            await _engineRepository.PostAgainstEngineGame(
                id: gameId, 
                isTheEngineWhite: Convert.ToInt32(newAgainstEngineGame.IsTheEngineWhite), 
                engineELO: Convert.ToInt16(newAgainstEngineGame.EngineELO), 
                engineId: Convert.ToInt64(newAgainstEngineGame.EngineId),
                userId: userId
            );

            return gameId;
        }

        public async Task<AgainstEngineGame?> GetAgainstEngineGame(long gameId, long userId) {
            var againstEngineGame = await _engineRepository.GetAgainstEngineGame(gameId: gameId);

            if (againstEngineGame == null) {
                return null;
            }

            if (againstEngineGame.UserId != userId) {
                return null;
            }

            return againstEngineGame;
        }

        private static EngineResponse FormatEngineResponse(string bestMove) {
            return new EngineResponse {
                From = bestMove[..2],
                To = bestMove[2..4],
                Promotion = bestMove.Length == 5 ? bestMove[4] : null,
            };
        }

        public async Task<EngineResponse?> GetBestMoveFromFenPosition(PositionToEvaluate positionToEvaluate) {
            var enginePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "arasan/arasanx-64");
            
            using Process engineProcess = new();
            engineProcess.StartInfo.FileName = enginePath;
            engineProcess.StartInfo.UseShellExecute = false;
            engineProcess.StartInfo.RedirectStandardInput = true;
            engineProcess.StartInfo.RedirectStandardOutput = true;
            engineProcess.StartInfo.CreateNoWindow = true;

            engineProcess.Start();

            await engineProcess.StandardInput.WriteLineAsync("uci");
            await engineProcess.StandardInput.FlushAsync();

            if (positionToEvaluate.EngineELO != null) {
                await engineProcess.StandardInput.WriteLineAsync("setoption name UCI_LimitStrength value true");
                await engineProcess.StandardInput.FlushAsync();

                await engineProcess.StandardInput.WriteLineAsync($"setoption name UCI_Elo value {positionToEvaluate.EngineELO}");
                await engineProcess.StandardInput.FlushAsync();
            }

            await engineProcess.StandardInput.WriteLineAsync($"position fen {positionToEvaluate.FenPosition}");
            await engineProcess.StandardInput.FlushAsync();

            await engineProcess.StandardInput.WriteLineAsync("go");
            await engineProcess.StandardInput.FlushAsync();

            string bestMove = "";

            string? line;

            while ((line = await engineProcess.StandardOutput.ReadLineAsync()) != null) {
                if (line.StartsWith("bestmove")) {
                    bestMove = line.Split(" ")[1];

                    break;
                }
            }

            await engineProcess.StandardInput.WriteLineAsync("quit");
            await engineProcess.StandardInput.FlushAsync();

            await engineProcess.WaitForExitAsync();

            if (bestMove == "") {
                return null;
            }

            var formattedEngineResponse = FormatEngineResponse(bestMove);

            return formattedEngineResponse;
        }
    }
}
