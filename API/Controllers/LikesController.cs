using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.DTOs;
using API.Entites;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    [Authorize]
    public class LikesController : BaseApiController
    {
        private readonly ILikesRepository _likeRepository;
        private readonly IMapper mapper;
        private readonly IUserRepository _userRepository;

        public LikesController(IUserRepository userRepository, ILikesRepository likeRepository, IMapper mapper)
        {
            this._userRepository = userRepository;
            this._likeRepository = likeRepository;
            this.mapper = mapper;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var user = await _likeRepository.GetUserWithLikes(sourceUserId);
            var likedUser = await _userRepository.GetUserByUsernameAsync(username);
            if (likedUser == null) return NotFound();
            var likedUserId = likedUser.Id;
            if (sourceUserId == likedUserId)
                return BadRequest("You cann't like yourself");
            var userLike = await _likeRepository.GetUserLike(sourceUserId, likedUserId);
            if (userLike != null)
                return BadRequest("alreay liked");
            user.LikedUsers.Add(new UserLike
            {
                SourceUserId = sourceUserId,
                LikedUserId = likedUserId
            });

            if (await _userRepository.saveAllAsync())
                return Ok();
            else return BadRequest("Failed to like user");


        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery] LikeParams likeParams)
        {
            var users = await _likeRepository.GetUserLikes(likeParams, User.GetUserId());
            Response.AddPaginationHeader(users.CurrentPage,users.PageSize,users.TotalCount, users.TotalPages);
            return Ok(users);
        }
        [HttpGet("user/{userId}")]
        public async Task<ActionResult> GetUserWithLikes(int userId)
        {
            var user = await _likeRepository.GetGivenUserWithLikes(userId);
            if (user != null)
                return Ok(user);
            return BadRequest("Unable to find such user");
        }
    }


}



