using SpaceExplorer.Core.Interfaces;
using BCryptNet = BCrypt.Net.BCrypt;

namespace SpaceExplorer.Infrastructure.Services
{
    public class PasswordHasher : IPasswordHasher
    {
        public string HashPassword(string password) => 
            BCryptNet.HashPassword(password, workFactor: 11);

        public bool VerifyPassword(string password, string passwordHash) => 
            BCryptNet.Verify(password, passwordHash);
    }
}