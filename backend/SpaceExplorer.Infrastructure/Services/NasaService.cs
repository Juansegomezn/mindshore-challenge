using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SpaceExplorer.Core.DTOs;
using SpaceExplorer.Core.Interfaces;

namespace SpaceExplorer.Infrastructure.Services
{
    public class NasaService : INasaService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _libraryUrl;
        private readonly string _baseUrl;

        public NasaService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["NasaSettings:ApiKey"] ?? "DEMO_KEY";
            _baseUrl = configuration["NasaSettings:BaseUrl"] ?? "https://api.nasa.gov/";
            _libraryUrl = configuration["NasaSettings:LibraryUrl"] ?? "https://images-api.nasa.gov/";
        }

        public async Task<IEnumerable<NasaMediaDto>> SearchAsync(NasaSearchQuery query)
        {
            if (!string.IsNullOrEmpty(query.Rover))
            {
                return await FetchMarsRoverPhotosAsync(query);
            }

            return await FetchGeneralLibraryAsync(query);
        }

        private async Task<IEnumerable<NasaMediaDto>> FetchGeneralLibraryAsync(NasaSearchQuery query)
        {
            var results = new List<NasaMediaDto>();
            var url = $"{_libraryUrl}search?media_type=image";

            if (!string.IsNullOrEmpty(query.Q)) url += $"&q={Uri.EscapeDataString(query.Q)}";
            if (!string.IsNullOrEmpty(query.YearStart)) url += $"&year_start={query.YearStart}";

            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode) return results;

            var jsonString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(jsonString);
            var items = doc.RootElement.GetProperty("collection").GetProperty("items");

            foreach (var item in items.EnumerateArray())
            {
                try
                {
                    var data = item.GetProperty("data")[0];
                    var id = data.GetProperty("nasa_id").GetString() ?? Guid.NewGuid().ToString();
                    var title = data.GetProperty("title").GetString() ?? "Sin Título";
                    var description = data.TryGetProperty("description", out var descProp) ? descProp.GetString() ?? "" : "";
                    var dateCreated = data.TryGetProperty("date_created", out var dateProp) ? dateProp.GetString() : "";

                    var links = item.GetProperty("links");
                    var urlImage = links[0].GetProperty("href").GetString() ?? "";

                    results.Add(new NasaMediaDto(id, title, description, urlImage, "image", dateCreated, "NASA"));
                }
                catch {}
            }

            return results;
        }

        private async Task<IEnumerable<NasaMediaDto>> FetchMarsRoverPhotosAsync(NasaSearchQuery query)
        {
            var results = new List<NasaMediaDto>();
            var rover = query.Rover?.ToLower() ?? "curiosity";
            
            var dateFilter = !string.IsNullOrEmpty(query.EarthDate) ? $"&earth_date={query.EarthDate}" : "&sol=1000";
            var cameraFilter = !string.IsNullOrEmpty(query.Camera) ? $"&camera={query.Camera.ToLower()}" : "";
            
            var url = $"{_baseUrl}mars-photos/api/v1/rovers/{rover}/photos?api_key={_apiKey}{dateFilter}{cameraFilter}";

            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode) return results;

            var jsonString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(jsonString);
            var photos = doc.RootElement.GetProperty("photos");

            foreach (var photo in photos.EnumerateArray())
            {
                var id = photo.GetProperty("id").GetInt32().ToString();
                var imgSrc = photo.GetProperty("img_src").GetString() ?? "";
                var earthDate = photo.GetProperty("earth_date").GetString();
                
                var roverName = photo.GetProperty("rover").GetProperty("name").GetString();
                var cameraFullName = photo.GetProperty("camera").GetProperty("full_name").GetString();
                
                var title = $"{roverName} Rover - {cameraFullName}";
                var description = $"Fotografía espacial capturada por el rover {roverName} utilizando la cámara especializada {cameraFullName} en la fecha terrestre {earthDate}.";

                results.Add(new NasaMediaDto(id, title, description, imgSrc, "image", earthDate, "Mars Rover"));
            }

            return results;
        }
    }
}