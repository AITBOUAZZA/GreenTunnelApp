using Newtonsoft.Json;
using System.Net;

namespace GreenTunnel.Infrastructure.ViewModels.Response;

public class CqrsResponseViewModel
{
    [JsonProperty("statusCode")]
    public HttpStatusCode StatusCode { get; set; } = HttpStatusCode.OK;
    [JsonProperty("errorMessage")]
    public string ErrorMessage { get; set; }
}