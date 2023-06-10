using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entites;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> userManager;
        private readonly IMapper mapper;

        public AdminController(UserManager<AppUser> userManager, IMapper mapper)
        {
            this.userManager = userManager;
            this.mapper = mapper;
        }

        [Authorize(Policy = "AdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRolesAsync()
        {
            var users = await userManager.Users.Include(u => u.UserRoles).ThenInclude(x => x.Role).Select(x => new
            {
                x.Id,
                x.UserName,
                x.Email,
                roles = x.UserRoles.Select(m => m.Role.Name)
            }).ToListAsync();
            return Ok(users);
        }


        [Authorize(Policy = "ModeratorPhotoRole")]
        [HttpGet("photos-to-moderate")]
        public ActionResult GetPhotosToModerate()
        {
            return Ok("Admin or moderator can see photos to moderate");
        }

        [Authorize(Policy = "AdminRole")]
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
        {
            var selectedRoles = roles.Split(',').ToArray();
            var user = await userManager.FindByNameAsync(username);
            if (user == null)
                return NotFound("User not found");
            var userRoles = await userManager.GetRolesAsync(user);
            var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
            if (!result.Succeeded)
                return BadRequest("Failed to add to roles");
            var removedResult = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
            if (!removedResult.Succeeded)
                return BadRequest("Failed to remove from roles");
            return Ok(await userManager.GetRolesAsync(user));

        }

    }
}