using System;

namespace SpaceExplorer.Core.Entities
{
    public class CollectionMedia
    {
        public Guid CollectionId { get; set; }
        public Collection Collection { get; set; } = null!;

        public string MediaItemId { get; set; } = string.Empty;
        public MediaItem MediaItem { get; set; } = null!;
        
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }
}