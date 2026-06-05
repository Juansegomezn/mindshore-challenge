using System;
using System.Collections.Generic;

namespace SpaceExplorer.Core.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Collection> Collections { get; set; } = new List<Collection>();
    }
}