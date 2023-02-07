using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Entites;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository userRepository;
        private readonly IPhotoService photoService;
        private readonly IMapper mapper;

        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            this.mapper = mapper;
            this.userRepository = userRepository;
            this.photoService = photoService;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            return Ok(await userRepository.GetMembersAsync());
        }

        [HttpGet("{username}", Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await userRepository.GetMemberAsync(username);
        }
        [HttpPut()]
        public async Task<ActionResult> updateUser(MemberUpdateDto memberUpdateDto)
        {
            var username = User.GetUsername();
            var user = await userRepository.GetUserByUsernameAsync(username);
            mapper.Map(memberUpdateDto, user);
            userRepository.update(user);
            if (await userRepository.saveAllAsync())
                return NoContent();
            return BadRequest("failed to update user");
        }
        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
            var result = await photoService.AddPhotoAsync(file);
            if (result.Error != null) return BadRequest(result.Error.Message);
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };
            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }
            user.Photos.Add(photo);
            if (await userRepository.saveAllAsync())
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName }, mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Error in saving the photo");
        }
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
            if (currentMain.IsMain)
                currentMain.IsMain = false;
            var mainPhoto = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if (!mainPhoto.IsMain)
            {
                mainPhoto.IsMain = true;
            }
            else return BadRequest("this is already the main photo");
            if (await userRepository.saveAllAsync())
                return NoContent();

            return BadRequest("unable to add main photo");

        }
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo != null)
            {
                user.Photos.Remove(photo);
                if (await userRepository.saveAllAsync())
                    return NoContent();
            }
             return BadRequest("Photo does not exit!");
        }
    }
}