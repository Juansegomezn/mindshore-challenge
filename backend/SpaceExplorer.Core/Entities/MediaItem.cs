using System;
using System.Collections.Generic;

namespace SpaceExplorer.Core.Entities
{
    public class MediaItem
    {
        public string Id { get; set; } = string.Empty; 
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string MediaType { get; set; } = string.Empty;
        
        public string? AiEnrichedDescription { get; set; }
        public string? AiFunFact { get; set; }

        public ICollection<CollectionMedia> CollectionMedias { get; set; } = new List<CollectionMedia>();
        public ICollection<MediaItemTag> MediaItemTags { get; set; } = new List<MediaItemTag>();
    }
}