using System.Text.Json;

namespace Server.Data {
    public class ErrorDetails {
        public required int StatusCode { get; set; }
        public required string Message { get; set; }
        private readonly JsonSerializerOptions _jsonSerializerOptions;

        public ErrorDetails() {
            _jsonSerializerOptions = new JsonSerializerOptions {
                PropertyNameCaseInsensitive = false,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            };
        }

        public override string ToString() {
            return JsonSerializer.Serialize(this, _jsonSerializerOptions);
        }
    }
}
