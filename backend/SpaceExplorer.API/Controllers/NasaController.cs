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
    public class NasaController : ControllerBase
    {
        private readonly INasaService _nasaService;

        public NasaController(INasaService nasaService)
        {
            _nasaService = nasaService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] NasaSearchQuery query)
        {
            try
            {
                var data = await _nasaService.SearchAsync(query);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al conectar con los servicios de la NASA.", details = ex.Message });
            }
        }
    }
}