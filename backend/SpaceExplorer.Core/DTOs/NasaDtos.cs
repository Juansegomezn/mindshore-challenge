using System.Collections.Generic;

namespace SpaceExplorer.Core.DTOs
{
    // DTO unificado que consumirá el Frontend
    public record NasaMediaDto(
        string Id,
        string Title,
        string Description,
        string Url,
        string MediaType,
        string? DateCreated,
        string? Center
    );

    // Parámetros de búsqueda avanzados que recibirá el controlador
    public record NasaSearchQuery(
        string? Q,
        string? YearStart,
        string? Rover,
        string? Camera,
        string? EarthDate
    );
}