using System.Net;

namespace Data {
    public class CustomException : Exception {
        public HttpStatusCode StatusCode { get; }

        public CustomException(string message, HttpStatusCode statusCode) : base(message) {
            StatusCode = statusCode;
        }
    }
}
