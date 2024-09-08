using System.Net;
using Data;

namespace Middlewares {
    public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger) {
        private readonly RequestDelegate _next = next;
        private readonly ILogger<ExceptionMiddleware> _logger = logger;

        private static Task HandleExceptionAsync(HttpContext context, Exception exception) {
            context.Response.ContentType = "application/json";

            var response = context.Response;
            var statusCode = HttpStatusCode.InternalServerError;
            var message = "Internal Server Error";

            if (exception is CustomException customException) {
                statusCode = customException.StatusCode;
                
                message = customException.Message;
            }

            response.StatusCode = (int)statusCode;

            return context.Response.WriteAsync(new ErrorDetails {
                StatusCode = response.StatusCode,
                Message = message,
            }.ToString());
        }

        public async Task InvokeAsync(HttpContext context) {
            try {
                var endpoint = context.GetEndpoint();

                if (endpoint == null) {
                    return;
                }

                await _next(context);
            } catch (Exception ex) {
                _logger.LogError("Something went wrong: {message}", ex.Message);

                await HandleExceptionAsync(context, ex);
            }
        }
    }
}
