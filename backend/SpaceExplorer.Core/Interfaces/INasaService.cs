using System.Collections.Generic;
using System.Threading.Tasks;
using SpaceExplorer.Core.DTOs;

namespace SpaceExplorer.Core.Interfaces
{
    public interface INasaService
    {
        Task<IEnumerable<NasaMediaDto>> SearchAsync(NasaSearchQuery query);
    }
}