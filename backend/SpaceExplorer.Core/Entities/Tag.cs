using System;
using System.Collections.Generic;

namespace SpaceExplorer.Core.Entities
{
    public class Tag
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public ICollection<MediaItemTag> MediaItemTags { get; set; } = new List<MediaItemTag>();
    }
}