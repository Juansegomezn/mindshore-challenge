using System;
using System.Collections.Generic;

namespace SpaceExplorer.Core.DTOs
{
    public record CreateCollectionRequest(string Name, string Description);
    
    public record AddMediaToCollectionRequest(
        string MediaId,
        string Title,
        string Description,
        string Url,
        string MediaType
    );

    public record AddTagRequest(string TagName);

    public record TagDto(Guid Id, string Name);

    public record MediaItemResponseDto(
        string Id,
        string Title,
        string Description,
        string Url,
        string MediaType,
        string? AiEnrichedDescription,
        string? AiFunFact,
        List<TagDto> Tags
    );

    public record CollectionResponseDto(
        Guid Id,
        string Name,
        string Description,
        DateTime CreatedAt,
        List<MediaItemResponseDto> Items
    );
}