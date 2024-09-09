using System.Diagnostics;
using Server.Data.Entities;

namespace Server.Services {
    public class EngineMovesService {
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
