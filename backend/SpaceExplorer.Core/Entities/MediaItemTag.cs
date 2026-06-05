using System;

namespace SpaceExplorer.Core.Entities
{
    public class MediaItemTag
    {
        public string MediaItemId { get; set; } = string.Empty;
        public MediaItem MediaItem { get; set; } = null!;

        public Guid TagId { get; set; }
        public Tag Tag { get; set; } = null!;
    }
}