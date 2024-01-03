using GreenTunnel.Application.Avion.Queries;
using GreenTunnel.Application.Test.Queries;
using GreenTunnel.Core.Entities;
using GreenTunnel.Core.Interfaces.Uow;
using GreenTunnel.Infrastructure.ViewModels.Response.Avion;
using GreenTunnel.Infrastructure.ViewModels.Response.Test;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace GreenTunnel.Api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AvionController : ControllerBase
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;
        private readonly IMediator _mediator;
        private readonly UserManager<ApplicationUser> _userManager;

        public AvionController(IUnitOfWork unitOfWork,

IMediator mediator, UserManager<ApplicationUser> userManager)
        {

            _unitOfWork = unitOfWork;
           
            _mediator = mediator;
            _userManager = userManager;

        }

        [HttpGet("Allavions")]
        public async Task<IActionResult> GetAvions(int pageNumber, int pageSize, [FromQuery] string? searchTerm = null, [FromQuery] string? sortColumn = null, [FromQuery] string? sortOrder = null)
        {
            var result = await _mediator.Send(new GetAllAvionQuery { SortColumn = sortColumn, SortOrder = sortOrder, SearchTerm = searchTerm, PageNumber = pageNumber, PageSize = pageSize });
            return Ok(result);
        }



        [HttpGet("avions")]
        //[Authorize(Policies.ViewAllUsersPolicy)]
        [ProducesResponseType(200, Type = typeof(List<GetAvionListReponseModel>))]
        public async Task<IActionResult> GetAvionsList()
        {
            var result = await _mediator.Send(new GetAvionListQuery());
            return Ok(result);
        }

        [HttpGet("VolByPiloteByAvion")]
        //[Authorize(Policies.ViewAllUsersPolicy)]
        [ProducesResponseType(200, Type = typeof(List<GetAvionListReponseModel>))]
        public async Task<IActionResult> getVolsByAvionAndPilote([FromQuery] string? avionId=null, [FromQuery] string? piloteId = null)
        {
            var result = await _mediator.Send(new GetVolByAvionByPiloteListQuery{ piloteId=piloteId,avionId=avionId});
            return Ok(result);
        }
    }
}
