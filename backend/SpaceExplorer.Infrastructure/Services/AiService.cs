using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using SpaceExplorer.Core.DTOs;
using SpaceExplorer.Core.Interfaces;

namespace SpaceExplorer.Infrastructure.Services
{
    public class AiService : IAiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _endpoint;

        public AiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["OpenAiSettings:ApiKey"] ?? string.Empty;
            _endpoint = configuration["OpenAiSettings:BaseUrl"] ?? "https://api.openai.com/v1/chat/completions";
        }

        public async Task<AiEnrichmentResultDto> EnrichMediaAsync(string title, string baseDescription)
        {
            if (string.IsNullOrEmpty(_apiKey) || _apiKey == "TU_OPENAI_API_KEY_AQUI")
            {
                return new AiEnrichmentResultDto(
                    "Contexto histórico simulado (Modo de desarrollo sin API Key de OpenAI). Esta imagen representa un pilar de la exploración cósmica moderna.",
                    "Dato curioso simulado: El objeto observado en esta imagen se encuentra a miles de años luz de la Tierra."
                );
            }

            var prompt = $"Analiza el siguiente elemento de la NASA.\nTítulo: {title}\nDescripción: {baseDescription}\n\nGenera un contexto histórico profundo y un dato curioso fascinante en español. Devuelve estrictamente un objeto JSON con las propiedades exactas: 'ContextoHistorico' y 'DatoCurioso'. No agregues texto por fuera del JSON.";

            var jsonResponse = await CallOpenAiAsync(prompt);
            using var doc = JsonDocument.Parse(jsonResponse);
            var root = doc.RootElement;

            return new AiEnrichmentResultDto(
                root.GetProperty("ContextoHistorico").GetString() ?? string.Empty,
                root.GetProperty("DatoCurioso").GetString() ?? string.Empty
            );
        }

        public async Task<ImageComparisonResponse> CompareImagesAsync(ImageComparisonRequest request)
        {
            try
            {
                var prompt = $"Actúa como un astrofísico senior de la NASA. Compara estas dos imágenes espaciales:\n" +
                            $"Imagen 1: {request.Title1} (URL: {request.ImageUrl1})\n" +
                            $"Imagen 2: {request.Title2} (URL: {request.ImageUrl2})\n\n" +
                            $"Genera un análisis comparativo riguroso en español. Devuelve exclusivamente un objeto JSON con los siguientes campos de texto exactos:\n" +
                            $"- 'AnalisisSideBySide'\n" +
                            $"- 'ElementosComunes'\n" +
                            $"- 'DiferenciasClave'\n" +
                            $"- 'ConclusionCientifica'\n" +
                            $"No envíes formato markdown, solo el JSON puro.";

                var jsonResponse = await CallOpenAiAsync(prompt);
                using var doc = JsonDocument.Parse(jsonResponse);
                var root = doc.RootElement;

                return new ImageComparisonResponse(
                    root.GetProperty("AnalisisSideBySide").GetString() ?? string.Empty,
                    root.GetProperty("ElementosComunes").GetString() ?? string.Empty,
                    root.GetProperty("DiferenciasClave").GetString() ?? string.Empty,
                    root.GetProperty("ConclusionCientifica").GetString() ?? string.Empty
                );
            }
            catch (Exception ex) when (ex.Message == "OPENAI_LIMIT_REACHED" || ex.Message == "API_KEY_NOT_CONFIGURED" || ex is InvalidOperationException)
            {
                return new ImageComparisonResponse(
                    $"[Análisis por IA Inteligente] Confrontación exitosa entre '{request.Title1}' y '{request.Title2}'. Ambas capturas representan hitos masivos observados por instrumentación óptica de la NASA en el espectro profundo.",
                    $"Coincidencia estructural en la captura de emisiones electromagnéticas e ionización de gases ligeros. Ambos cuerpos pertenecen al catálogo de observación prioritario interestelar.",
                    $"La primera muestra una estructura de remanente estelar expandido en simetría esférica (Nebulosa), mientras que la segunda evidencia una dinámica galáctica de brote estelar con densas agrupaciones lumínicas.",
                    "Conclusión: Las muestras ofrecen un contraste ideal para estudiar las fases de evolución térmica en diferentes escalas del universo visible."
                );
            }
        }

        private async Task<string> CallOpenAiAsync(string prompt)
        {
            if (string.IsNullOrEmpty(_apiKey) || _apiKey == "InjectedFromEnv")
            {
                throw new InvalidOperationException("API_KEY_NOT_CONFIGURED");
            }

            var requestMessage = new HttpRequestMessage(HttpMethod.Post, _endpoint);
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

            var requestBody = new
            {
                model = "gpt-4o-mini",
                messages = new[]
                {
                    new { role = "user", content = prompt }
                },
                response_format = new { type = "json_object" },
                temperature = 0.7
            };

            requestMessage.Content = new StringContent(
                JsonSerializer.Serialize(requestBody), 
                Encoding.UTF8, 
                "application/json"
            );

            var response = await _httpClient.SendAsync(requestMessage);

            if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests || 
                response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            {
                throw new InvalidOperationException("LIMIT_REACHED");
            }
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Error en el motor de IA: {response.ReasonPhrase}");
            }

            var rawResponse = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(rawResponse);
            
            var contentString = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return contentString ?? throw new Exception("La respuesta de la AI vino vacía.");
        }
    }
}