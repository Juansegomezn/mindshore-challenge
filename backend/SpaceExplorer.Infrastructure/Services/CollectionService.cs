using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SpaceExplorer.Core.DTOs;
using SpaceExplorer.Core.Entities;
using SpaceExplorer.Core.Interfaces;
using SpaceExplorer.Infrastructure.Data;

namespace SpaceExplorer.Infrastructure.Services
{
    public class CollectionService : ICollectionService
    {
        private readonly AppDbContext _context;

        public CollectionService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CollectionResponseDto> CreateCollectionAsync(Guid userId, CreateCollectionRequest request)
        {
            var collection = new Collection
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = request.Name,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow
            };

            _context.Collections.Add(collection);
            await _context.SaveChangesAsync();

            return new CollectionResponseDto(collection.Id, collection.Name, collection.Description, collection.CreatedAt, new List<MediaItemResponseDto>());
        }

        public async Task<IEnumerable<CollectionResponseDto>> GetUserCollectionsAsync(Guid userId)
        {
            var collections = await _context.Collections
                .Where(c => c.UserId == userId)
                .Include(c => c.CollectionMedias)
                    .ThenInclude(cm => cm.MediaItem)
                        .ThenInclude(m => m.MediaItemTags)
                            .ThenInclude(mt => mt.Tag)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return collections.Select(c => new CollectionResponseDto(
                c.Id,
                c.Name,
                c.Description,
                c.CreatedAt,
                c.CollectionMedias.Select(cm => new MediaItemResponseDto(
                    cm.MediaItem.Id,
                    cm.MediaItem.Title,
                    cm.MediaItem.Description,
                    cm.MediaItem.Url,
                    cm.MediaItem.MediaType,
                    cm.MediaItem.AiEnrichedDescription,
                    cm.MediaItem.AiFunFact,
                    cm.MediaItem.MediaItemTags.Select(mt => new TagDto(mt.Tag.Id, mt.Tag.Name)).ToList()
                )).ToList()
            ));
        }

        public async Task<bool> DeleteCollectionAsync(Guid userId, Guid collectionId)
        {
            var collection = await _context.Collections
                .FirstOrDefaultAsync(c => c.Id == collectionId && c.UserId == userId);

            if (collection == null) return false;

            _context.Collections.Remove(collection);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddMediaToCollectionAsync(Guid userId, Guid collectionId, AddMediaToCollectionRequest request)
        {
            var collection = await _context.Collections
                .AnyAsync(c => c.Id == collectionId && c.UserId == userId);
            
            if (!collection) return false;

            var mediaItem = await _context.MediaItems.FindAsync(request.MediaId);
            if (mediaItem == null)
            {
                mediaItem = new MediaItem
                {
                    Id = request.MediaId,
                    Title = request.Title,
                    Description = request.Description,
                    Url = request.Url,
                    MediaType = request.MediaType
                };
                _context.MediaItems.Add(mediaItem);
                await _context.SaveChangesAsync();
            }

            var alreadyAssociated = await _context.CollectionMedias
                .AnyAsync(cm => cm.CollectionId == collectionId && cm.MediaItemId == request.MediaId);

            if (alreadyAssociated) return true;

            var relation = new CollectionMedia
            {
                CollectionId = collectionId,
                MediaItemId = request.MediaId,
                AddedAt = DateTime.UtcNow
            };

            _context.CollectionMedias.Add(relation);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddTagToMediaAsync(string mediaId, AddTagRequest request)
        {
            var mediaItem = await _context.MediaItems.FindAsync(mediaId);
            if (mediaItem == null) return false;

            var normalizedTagName = request.TagName.Trim().ToLower();

            var tag = await _context.Tags.FirstOrDefaultAsync(t => t.Name.ToLower() == normalizedTagName);
            if (tag == null)
            {
                tag = new Tag { Id = Guid.NewGuid(), Name = request.TagName.Trim() };
                _context.Tags.Add(tag);
                await _context.SaveChangesAsync();
            }

            var alreadyTagged = await _context.MediaItemTags
                .AnyAsync(mt => mt.MediaItemId == mediaId && mt.TagId == tag.Id);

            if (alreadyTagged) return true;

            var itemTag = new MediaItemTag { MediaItemId = mediaId, TagId = tag.Id };
            _context.MediaItemTags.Add(itemTag);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}