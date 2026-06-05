using System.Threading.Tasks;
using SpaceExplorer.Core.DTOs;

namespace SpaceExplorer.Core.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
    }
}