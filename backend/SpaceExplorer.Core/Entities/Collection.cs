using System;
using System.Collections.Generic;

namespace SpaceExplorer.Core.Entities
{
    public class Collection
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
        public ICollection<CollectionMedia> CollectionMedias { get; set; } = new List<CollectionMedia>();
    }
}