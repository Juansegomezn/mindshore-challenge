using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpaceExplorer.Core.DTOs;
using SpaceExplorer.Core.Interfaces;

namespace SpaceExplorer.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CollectionController : ControllerBase
    {
        private readonly ICollectionService _collectionService;

        public CollectionController(ICollectionService collectionService)
        {
            _collectionService = collectionService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCollectionRequest request)
        {
            var userId = GetUserId();
            var result = await _collectionService.CreateCollectionAsync(userId, request);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetUserId();
            var collections = await _collectionService.GetUserCollectionsAsync(userId);
            return Ok(collections);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = GetUserId();
            var success = await _collectionService.DeleteCollectionAsync(userId, id);
            if (!success) return NotFound(new { message = "Colección no encontrada o no autorizada." });
            return Ok(new { message = "Colección eliminada exitosamente." });
        }

        [HttpPost("{id}/media")]
        public async Task<IActionResult> AddMedia(Guid id, [FromBody] AddMediaToCollectionRequest request)
        {
            var userId = GetUserId();
            var success = await _collectionService.AddMediaToCollectionAsync(userId, id, request);
            if (!success) return BadRequest(new { message = "No se pudo añadir el elemento a la colección." });
            return Ok(new { message = "Elemento añadido con éxito." });
        }

        [HttpPost("media/{mediaId}/tags")]
        public async Task<IActionResult> AddTag(string mediaId, [FromBody] AddTagRequest request)
        {
            var success = await _collectionService.AddTagToMediaAsync(mediaId, request);
            if (!success) return NotFound(new { message = "Elemento multimedia no encontrado localmente." });
            return Ok(new { message = "Etiqueta asignada con éxito." });
        }

        private Guid GetUserId()
        {
            var claimValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(claimValue) || !Guid.TryParse(claimValue, out var userId))
            {
                throw new UnauthorizedAccessException("El token del usuario es inválido o no contiene el identificador correcto.");
            }
            return userId;
        }
        
        [HttpDelete("{collectionId:guid}/media/{mediaId}")]
        public async Task<IActionResult> RemoveMedia(Guid collectionId, string mediaId)
        {
            try
            {
                var result = await _collectionService.RemoveMediaFromCollectionAsync(collectionId, mediaId);
                
                if (!result)
                {
                    return NotFound(new { message = "No se encontró el registro de vinculación cósmica." });
                }

                return Ok(new { message = "Elemento removido del álbum correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Fallo interno al procesar la remoción.", error = ex.Message });
            }
        }
    }
}