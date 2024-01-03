using AutoMapper;
using GreenTunnel.Application.Vol.Commands;
using GreenTunnel.Application.Vol.Queries;

using GreenTunnel.Core.Entities;
using GreenTunnel.Core.Interfaces.Uow;
using GreenTunnel.Infrastructure.Helpers;
using GreenTunnel.Infrastructure.ViewModels;

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace GreenTunnel.Api.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]


public class VolController :  ControllerBase
{

    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger _logger;
    private readonly IEmailSender _emailSender;
    private readonly IMediator _mediator;
    private readonly UserManager<ApplicationUser> _userManager;


    public VolController(IMapper mapper, IUnitOfWork unitOfWork,
       ILogger<VolController> logger,
       IMediator mediator,
       UserManager<ApplicationUser> userManager)
    {
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _logger = logger;
        _mediator = mediator;
        _userManager = userManager;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateVolCommand command)
    {
        var user = await GetCurrentUserAsync();
        command.Model.UserId = user.Id;
        //command.Model.CreatedBy = user.FullName;
        return Ok(await _mediator.Send(command));
    }


    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _mediator.Send(new GetAllVolQuery()));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await _mediator.Send(new GetAllVolQuery { VolId = id }));
    }


    [HttpGet("Allworkspaces")]
   
    [ProducesResponseType(200, Type = typeof(List<VolViewModel>))]
    public async Task<IActionResult> GetVols(int pageNumber, int pageSize, [FromQuery] int? VolId = null, [FromQuery] string? searchTerm = null, [FromQuery] string? sortColumn = null, [FromQuery] string? sortOrder = null)
    {
        var result = await _mediator.Send(new GetAllVolQuery { SortColumn = sortColumn, SortOrder = sortOrder, SearchTerm = searchTerm, PageNumber = pageNumber, PageSize = pageSize, VolId = VolId });
        return Ok(result);
    }



    private async Task<ApplicationUser> GetCurrentUserAsync() => await _userManager.GetUserAsync(HttpContext.User);
}
