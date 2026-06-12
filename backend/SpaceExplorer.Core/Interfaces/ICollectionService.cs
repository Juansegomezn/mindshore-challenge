using SpaceExplorer.Core.DTOs;

namespace SpaceExplorer.Core.Interfaces
{
    public interface ICollectionService
    {
        Task<CollectionResponseDto> CreateCollectionAsync(Guid userId, CreateCollectionRequest request);
        Task<IEnumerable<CollectionResponseDto>> GetUserCollectionsAsync(Guid userId);
        Task<bool> DeleteCollectionAsync(Guid userId, Guid collectionId);
        Task<bool> AddMediaToCollectionAsync(Guid userId, Guid collectionId, AddMediaToCollectionRequest request);
        Task<bool> AddTagToMediaAsync(string mediaId, AddTagRequest request);
        Task<bool> RemoveMediaFromCollectionAsync(Guid collectionId, string mediaId);
    }
}