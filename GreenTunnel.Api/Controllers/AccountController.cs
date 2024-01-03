

using AutoMapper;
using GreenTunnel.Application.Role.Commands.CreateRole;
using GreenTunnel.Application.Role.Commands.DeleteRole;
using GreenTunnel.Application.Role.Commands.UpdateRole;
using GreenTunnel.Application.Role.Queries;
using GreenTunnel.Application.User.Commands.CreateUser;
using GreenTunnel.Application.User.Commands.DeleteUser;
using GreenTunnel.Application.User.Commands.ResetPassword;
using GreenTunnel.Application.User.Commands.UpdateUser;
using GreenTunnel.Application.User.Queries;
using GreenTunnel.Core;
using GreenTunnel.Core.EmailConfiguration;
using GreenTunnel.Core.Entities;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.Authorization;
using GreenTunnel.Infrastructure.Helpers;
using GreenTunnel.Infrastructure.ViewModels;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace GreenTunnel.Api.Controllers;

[Route("api/[controller]")]
[ApiController]

public class AccountController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IAccountManager _accountManager;
    private readonly IAuthorizationService _authorizationService;
    private readonly ILogger<AccountController> _logger;
    private readonly IMediator _mediator;
    private readonly IEmailSender _emailSender;
    private readonly UserManager<ApplicationUser> _userManager;
    private const string GetUserByIdActionName = "GetUserById";
    private const string GetRoleByIdActionName = "GetRoleById";

    public AccountController(IMapper mapper, IAccountManager accountManager, IAuthorizationService authorizationService,
        ILogger<AccountController> logger, IMediator mediator, IEmailSender emailSender, UserManager<ApplicationUser> userManager)
    {
        _mapper = mapper;
        _accountManager = accountManager;
        _authorizationService = authorizationService;
        _logger = logger;
        _mediator = mediator;
        _emailSender = emailSender;
        _userManager = userManager;
    }
    [Authorize]
    [HttpGet("users/me")]
    [ProducesResponseType(200, Type = typeof(UserViewModel))]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userVM = await _mediator.Send(new GetCurrentUserQuery() { User = User, Id = Utilities.GetUserId(User) });
        if (userVM != null)
            return Ok(userVM);
        else
            return NotFound(Utilities.GetUserId(User));
    }
    [Authorize]
    [HttpGet("users/{id}", Name = GetUserByIdActionName)]
    [ProducesResponseType(200, Type = typeof(UserViewModel))]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetUserById(string id)
    {
        var userVM = await _mediator.Send(new GetUserByIdQuery() { User = User, Id = Utilities.GetUserId(User) });

        if (userVM != null)
            return Ok(userVM);
        else
            return NotFound(id);
    }
    [Authorize]
    [HttpGet("users/username/{userName}")]
    [ProducesResponseType(200, Type = typeof(UserViewModel))]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetUserByUserName(string userName)
    {
        var appUser = await _mediator.Send(new GetUserByUserNameQuery() { User = User, UserName = userName });

        if (appUser != null)
            return Ok(appUser);
        else
            return NotFound(userName);
    }
    [Authorize]
    [HttpGet("users")]
    [Authorize(Policies.ViewAllUsersPolicy)]
    [ProducesResponseType(200, Type = typeof(List<UserViewModel>))]
    public async Task<IActionResult> GetUsers()
    {
        var result = await _mediator.Send(new GetUsersQuery { PageNumber = -1, PageSize = -1 });
        return Ok(result);
    }
    [Authorize]
    [HttpGet("users/Allusers")]
    [Authorize(Policies.ViewAllUsersPolicy)]
    [ProducesResponseType(200, Type = typeof(List<UserViewModel>))]
    public async Task<IActionResult> GetUsers(int pageNumber, int pageSize, [FromQuery] string? searchTerm = null, [FromQuery] string? sortColumn = null, [FromQuery] string? sortOrder = null)
    {
        var result = await _mediator.Send(new GetUsersQuery { SortColumn = sortColumn, SortOrder = sortOrder, SearchTerm = searchTerm, PageNumber = pageNumber, PageSize = pageSize });
        return Ok(result);
    }
    [Authorize]
    [HttpPut("users/me")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(403)]
    public async Task<IActionResult> UpdateCurrentUser([FromBody] UserEditViewModel user)
    {
        return await UpdateUser(Utilities.GetUserId(User), user);
    }
    [Authorize]
    [HttpPut("users/{id}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UserEditViewModel user)
    {
        var appUser = await _mediator.Send(new GetUserDetailsByIdQuery() { Id = id });
        var currentRoles = appUser != null ? (await _mediator.Send(new GetUserRolesQuery() { ApplicationUser = appUser })).ToArray() : null;

        var manageUsersPolicy = _authorizationService.AuthorizeAsync(User, id, AccountManagementOperations.Update);
        var assignRolePolicy = _authorizationService.AuthorizeAsync(User, (user.Roles, currentRoles), Policies.AssignAllowedRolesPolicy);

        if ((await Task.WhenAll(manageUsersPolicy, assignRolePolicy)).Any(r => !r.Succeeded))
            return new ChallengeResult();

        if (ModelState.IsValid)
        {
            if (user == null)
                return BadRequest($"{nameof(user)} cannot be null");

            if (!string.IsNullOrWhiteSpace(user.Id) && id != user.Id)
                return BadRequest("Conflicting user id in parameter and model data");

            if (appUser == null)
                return NotFound(id);

            var isPasswordChanged = !string.IsNullOrWhiteSpace(user.NewPassword);
            var isUserNameChanged = !appUser.UserName.Equals(user.UserName, StringComparison.OrdinalIgnoreCase);

            if (Utilities.GetUserId(User) == id)
            {
                if (string.IsNullOrWhiteSpace(user.CurrentPassword))
                {
                    if (isPasswordChanged)
                        AddError("Current password is required when changing your own password", "Password");

                    if (isUserNameChanged)
                        AddError("Current password is required when changing your own username", "Username");
                }
                else if (isPasswordChanged || isUserNameChanged)
                {
                    if (!await _mediator.Send(new CheckPasswordQuery() { User = appUser, CurrentPassword = user.CurrentPassword }))
                        AddError("The username/password couple is invalid.");
                }
            }

            if (ModelState.IsValid)
            {
                _mapper.Map(user, appUser);

                var result = await _mediator.Send(new UpdateUserCommand(appUser, user.Roles));
                if (result.Succeeded)
                {
                    if (isPasswordChanged)
                    {
                        if (!string.IsNullOrWhiteSpace(user.CurrentPassword))
                            result = await _mediator.Send(new UpdateUserPasswordCommand(appUser, user.CurrentPassword, user.NewPassword));
                        else
                            result = await _mediator.Send(new ResetPasswordCommands() { User = appUser, NewPassword = user.NewPassword });
                    }

                    if (result.Succeeded)
                        return NoContent();
                }

                AddError(result.Errors);
            }
        }

        return BadRequest(ModelState);
    }
    [Authorize]
    [HttpPatch("users/me")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> UpdateCurrentUser([FromBody] JsonPatchDocument<UserPatchViewModel> patch)
    {
        return await UpdateUser(Utilities.GetUserId(User), patch);
    }
    [Authorize]
    [HttpPatch("users/{id}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] JsonPatchDocument<UserPatchViewModel> patch)
    {
        if (!(await _authorizationService.AuthorizeAsync(User, id, AccountManagementOperations.Update)).Succeeded)
            return new ChallengeResult();

        if (ModelState.IsValid)
        {
            if (patch == null)
                return BadRequest($"{nameof(patch)} cannot be null");

            var appUser = await _mediator.Send(new GetUserDetailsByIdQuery() { Id = id });

            if (appUser == null)
                return NotFound(id);

            var userPVM = _mapper.Map<UserPatchViewModel>(appUser);
            patch.ApplyTo(userPVM, (e) => AddError(e.ErrorMessage));

            if (ModelState.IsValid)
            {
                _mapper.Map<UserPatchViewModel, ApplicationUser>(userPVM, appUser);

                var result = await _mediator.Send(new UpdateUserCommand(appUser, null));
                if (result.Succeeded)
                    return NoContent();

                AddError(result.Errors);
            }
        }

        return BadRequest(ModelState);
    }
    [Authorize]
    [HttpPost("users")]
    [Authorize(Policies.ManageAllUsersPolicy)]
    [ProducesResponseType(201, Type = typeof(UserViewModel))]
    [ProducesResponseType(400)]
    [ProducesResponseType(403)]
    public async Task<IActionResult> Register([FromBody] UserEditViewModel user)
    {
        if (!(await _authorizationService.AuthorizeAsync(User, (user.Roles, new string[] { }), Policies.AssignAllowedRolesPolicy)).Succeeded)
            return new ChallengeResult();

        if (ModelState.IsValid)
        {
            if (user == null)
                return BadRequest($"{nameof(user)} cannot be null");

            var appUser = _mapper.Map<ApplicationUser>(user);

            var result = await _mediator.Send(new CreateUserCommand() { User = appUser, Roles = user.Roles, NewPassword = user.NewPassword });
            if (result.Succeeded)
            {
                var userVM = await GetUserViewModelHelper(appUser.Id);
                return CreatedAtAction(GetUserByIdActionName, new { id = userVM.Id }, userVM);
            }

            AddError(result.Errors);
        }

        return BadRequest(ModelState);
    }
    [Authorize]
    [HttpDelete("users/{id}")]
    [ProducesResponseType(200, Type = typeof(UserViewModel))]
    [ProducesResponseType(400)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> DeleteUser(string id)
    {
        if (!(await _authorizationService.AuthorizeAsync(User, id, AccountManagementOperations.Delete)).Succeeded)
            return new ChallengeResult();

        var appUser = await _mediator.Send(new GetUserDetailsByIdQuery() { Id = id });

        if (appUser == null)
            return NotFound(id);


        var userVM = await GetUserViewModelHelper(appUser.Id);

        var result = await _mediator.Send(new DeleteUserCommand() { User = appUser });
        if (!result.Succeeded)
            throw new Exception($"The following errors occurred whilst deleting user: {string.Join(", ", result.Errors)}");

        return Ok(userVM);
    }
    [Authorize]
    [HttpPut("users/unblock/{id}")]
    [Authorize(Policies.ManageAllUsersPolicy)]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> UnblockUser(string id)
    {
        var appUser = await _mediator.Send(new GetUserDetailsByIdQuery() { Id = id });

        if (appUser == null)
            return NotFound(id);

        appUser.LockoutEnd = null;
        var result = await _mediator.Send(new UpdateUserCommand(appUser, null));
        if (!result.Succeeded)
            throw new Exception($"The following errors occurred whilst unblocking user: {string.Join(", ", result.Errors)}");

        return NoContent();
    }
    [Authorize]
    [HttpGet("users/me/preferences")]
    [ProducesResponseType(200, Type = typeof(string))]
    public async Task<IActionResult> UserPreferences()
    {
        var userId = Utilities.GetUserId(User);
        var appUser = await _mediator.Send(new GetUserDetailsByIdQuery() { Id = userId });

        return Ok(appUser.Configuration);
    }
    [Authorize]
    [HttpPut("users/me/preferences")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> UserPreferences([FromBody] string data)
    {
        var userId = Utilities.GetUserId(User);
        var appUser = await _mediator.Send(new GetUserDetailsByIdQuery() { Id = userId });

        appUser.Configuration = data;

        var result = await _mediator.Send(new UpdateUserCommand(appUser, null));
        if (!result.Succeeded)
            throw new Exception($"The following errors occurred whilst updating User Configurations: {string.Join(", ", result.Errors)}");

        return NoContent();
    }
    [Authorize]
    [HttpGet("roles/{id}", Name = GetRoleByIdActionName)]
    [ProducesResponseType(200, Type = typeof(RoleViewModel))]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetRoleById(string id)
    {
        var appRole = await _mediator.Send(new GetRoleByIdQuery() { RoleId = id });

        if (!(await _authorizationService.AuthorizeAsync(User, appRole?.Name ?? string.Empty, Policies.ViewRoleByRoleNamePolicy)).Succeeded)
            return new ChallengeResult();

        if (appRole == null)
            return NotFound(id);

        return await GetRoleByName(appRole.Name);
    }
    [Authorize]
    [HttpGet("roles/name/{name}")]
    [ProducesResponseType(200, Type = typeof(RoleViewModel))]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetRoleByName(string name)
    {
        if (!(await _authorizationService.AuthorizeAsync(User, name, Policies.ViewRoleByRoleNamePolicy)).Succeeded)
            return new ChallengeResult();

        var roleVM = await GetRoleViewModelHelper(name);

        if (roleVM == null)
            return NotFound(name);

        return Ok(roleVM);
    }
    [Authorize]
    [HttpGet("roles")]
    [Authorize(Policies.ViewAllRolesPolicy)]
    [ProducesResponseType(200, Type = typeof(List<RoleViewModel>))]
    public async Task<IActionResult> GetRoles()
    {
        return await GetRoles(1, 500);
    }
    [Authorize]
    [HttpGet("roles/Allroles")]
    [Authorize(Policies.ViewAllRolesPolicy)]
    [ProducesResponseType(200, Type = typeof(List<RoleViewModel>))]
    public async Task<IActionResult> GetRoles(int pageNumber, int pageSize, [FromQuery] string? searchTerm = null, [FromQuery] string? sortColumn = null, [FromQuery] string? sortOrder = null)
    {
        var roles = await _mediator.Send(new GetRolesLoadRelatedQuery() { SortColumn = sortColumn, SortOrder = sortOrder, SearchTerm = searchTerm, Page = pageNumber, PageSize = pageSize });
        return Ok(roles);
    }
    [Authorize]
    [HttpPut("roles/{id}")]
    [Authorize(Policies.ManageAllRolesPolicy)]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> UpdateRole(string id, [FromBody] RoleViewModel role)
    {
        if (ModelState.IsValid)
        {
            if (role == null)
                return BadRequest($"{nameof(role)} cannot be null");

            if (!string.IsNullOrWhiteSpace(role.Id) && id != role.Id)
                return BadRequest("Conflicting role id in parameter and model data");

            var appRole = await _mediator.Send(new GetRoleByIdQuery() { RoleId = id });

            if (appRole == null)
                return NotFound(id);

            _mapper.Map(role, appRole);

            var result = await _mediator.Send(new UpdateRoleCommand(appRole, role));
            if (result.Succeeded)
                return NoContent();

            AddError(result.Errors);

        }

        return BadRequest(ModelState);
    }
    [Authorize]
    [HttpPost("roles")]
    [Authorize(Policies.ManageAllRolesPolicy)]
    [ProducesResponseType(201, Type = typeof(RoleViewModel))]
    [ProducesResponseType(400)]
    public async Task<IActionResult> CreateRole([FromBody] RoleViewModel role)
    {
        if (ModelState.IsValid)
        {
            if (role == null)
                return BadRequest($"{nameof(role)} cannot be null");

            var appRole = _mapper.Map<ApplicationRole>(role);

            var result = await _mediator.Send(new CreateRoleCommand(appRole, role));
            if (result.Succeeded)
            {
                var roleVM = await GetRoleViewModelHelper(appRole.Name);
                return CreatedAtAction(GetRoleByIdActionName, new { id = roleVM.Id }, roleVM);
            }

            AddError(result.Errors);
        }

        return BadRequest(ModelState);
    }
    [Authorize]
    [HttpDelete("roles/{id}")]
    [Authorize(Policies.ManageAllRolesPolicy)]
    [ProducesResponseType(200, Type = typeof(RoleViewModel))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> DeleteRole(string id)
    {
        var appRole = await _mediator.Send(new GetRoleByIdQuery() { RoleId = id });

        if (appRole == null)
            return NotFound(id);

        if (!await _accountManager.TestCanDeleteRoleAsync(id))
            return BadRequest("Role cannot be deleted. Remove all users from this role and try again");

        var roleVM = await GetRoleViewModelHelper(appRole.Name);

        var result = await _mediator.Send(new DeleteRoleCommand() { Role = appRole });
        if (!result.Succeeded)
            throw new Exception($"The following errors occurred whilst deleting role: {string.Join(", ", result.Errors)}");

        return Ok(roleVM);
    }
    [Authorize]
    [HttpGet("permissions")]
    [Authorize(Policies.ViewAllRolesPolicy)]
    [ProducesResponseType(200, Type = typeof(List<PermissionViewModel>))]
    public IActionResult GetAllPermissions()
    {
        return Ok(_mapper.Map<List<PermissionViewModel>>(ApplicationPermissions.AllPermissions));
    }

    private async Task<UserViewModel> GetUserViewModelHelper(string userId)
    {
        var userAndRoles = await _mediator.Send(new GetUserAndRolesQuery() { UserId = userId });
        if (userAndRoles == null)
            return null;

        var userVM = _mapper.Map<UserViewModel>(userAndRoles.Value.User);
        userVM.Roles = userAndRoles.Value.Roles;

        return userVM;
    }

    private async Task<RoleViewModel> GetRoleViewModelHelper(string roleName)
    {
        var role = await _mediator.Send(new GetRoleLoadRelatedQuery() { RoleName = roleName });
        if (role != null)
            return _mapper.Map<RoleViewModel>(role);

        return null;
    }
    [Authorize]
    [HttpGet]
    public IActionResult Get()
    {

        _emailSender.SendEmailAsync("Omair", "omairaslam817@gmail.com", "No", "test");
        return Ok();

    }
    [HttpPost("ForgotPassword")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);
        if (user == null)
            return BadRequest("Invalid Request");

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var param = new Dictionary<string, string?>
        {
            {"token", token },
            {"email", forgotPasswordDto.Email }
        };

        var callback = QueryHelpers.AddQueryString(forgotPasswordDto.ClientURI, param);
        var message = new Message(new string[] { user.Email }, "Green Tunnel Reset password Link", callback, null);
        //var message = new Message(new string[] { "qvfordek@mailosaur.net" }, "Test email async", "This is the content from our async email.",null);

        await _emailSender.SendEmailAsync(message);

        return Ok();
    }
    [HttpPost("ResetPassword")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
        if (user == null)
            return BadRequest("Invalid Request");

        var resetPassResult = await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.Password);
        if (!resetPassResult.Succeeded)
        {
            var errors = resetPassResult.Errors.Select(e => e.Description);

            AddError(errors);

        }

        return Ok();
    }
    private void AddError(IEnumerable<string> errors, string key = "")
    {
        foreach (var error in errors)
        {
            AddError(error, key);
        }
    }

    private void AddError(string error, string key = "")
    {
        ModelState.AddModelError(key, error);
    }
}