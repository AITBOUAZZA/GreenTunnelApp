using GreenTunnel.Application.Test.Commands.CreateTest;
using GreenTunnel.Application.Test.Commands.DeleteTest;
using GreenTunnel.Application.Test.Commands.UpdateTest;
using GreenTunnel.Application.Test.Queries;

using GreenTunnel.Core.Entities;
using GreenTunnel.Core.Interfaces.Uow;
using GreenTunnel.Infrastructure;
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
    public class PiloteController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;
        private readonly IMediator _mediator;
        private readonly UserManager<ApplicationUser> _userManager;

        public PiloteController(IUnitOfWork unitOfWork,
  
    IMediator mediator,UserManager<ApplicationUser> userManager)
        {

            _unitOfWork = unitOfWork;
           
            _mediator = mediator;
            _userManager = userManager;

        }
        [HttpPost]
        public async Task<IActionResult> Create(CreatePiloteCommand command)
        {
            var user = await GetCurrentUserAsync();
           
            return Ok(await _mediator.Send(command));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _mediator.Send(new GetAllPiloteQuery()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _mediator.Send(new GetPiloteQuery { NumPilote = id }));
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody]  UpdatePiloteCommand command)
        {
            
            return Ok(await _mediator.Send(command));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            
            return Ok(await _mediator.Send(new DeletePiloteCommand { NumPilote = id }));
        }

        [HttpGet("Allpilotes")]
        public async Task<IActionResult> GetPilotes(int pageNumber, int pageSize, [FromQuery] string? searchTerm = null, [FromQuery] string? sortColumn = null, [FromQuery] string? sortOrder = null)
        {
            var result = await _mediator.Send(new GetAllPiloteQuery { SortColumn = sortColumn, SortOrder = sortOrder, SearchTerm = searchTerm, PageNumber = pageNumber, PageSize = pageSize });
            return Ok(result);
            }

        [HttpGet("pilotes")]
        //[Authorize(Policies.ViewAllUsersPolicy)]
        [ProducesResponseType(200, Type = typeof(List<GetPilotesListResponseModel>))]
        public async Task<IActionResult> GetPiloteList()
        {
            var result = await _mediator.Send(new GetPiloteListQuery());
            return Ok(result);
        }

        [HttpGet("validateDuplicateName/{name}/testId/{testId}")]
        public async Task<IActionResult> GetValidatedDuplicate(string name, int testId)
        {
            return Ok(await _mediator.Send(new GetDuplicatePiloteQuery { Name = name, TestId = testId }));
        }

        private async Task<ApplicationUser> GetCurrentUserAsync() => await _userManager.GetUserAsync(HttpContext.User);

    }
}

