using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpaceExplorer.Core.DTOs;
using SpaceExplorer.Core.Interfaces;

namespace SpaceExplorer.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly IAiService _aiService;

        public AiController(IAiService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("enrich")]
        public async Task<IActionResult> Enrich([ someBody ] FromBodyAttribute _, [FromQuery] string title, [FromQuery] string description)
        {
            try
            {
                var result = await _aiService.EnrichMediaAsync(title, description);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("compare")]
        public async Task<IActionResult> Compare([FromBody] ImageComparisonRequest request)
        {
            try
            {
                var result = await _aiService.CompareImagesAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}