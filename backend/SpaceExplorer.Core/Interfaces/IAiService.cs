using System.Threading.Tasks;
using SpaceExplorer.Core.DTOs;

namespace SpaceExplorer.Core.Interfaces
{
    public interface IAiService
    {
        Task<AiEnrichmentResultDto> EnrichMediaAsync(string title, string baseDescription);
        Task<ImageComparisonResponse> CompareImagesAsync(ImageComparisonRequest request);
    }
}