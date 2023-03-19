using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entites;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>().ForMember(dest => dest.PhotoUrl, opt =>
            opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url)).ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<AppUser, MemberWithLikesDto>().ForMember(dest => dest.LikedUsers, options => options.MapFrom(src => src.LikedUsers.Select(x => new LikeDto
            {
                Username = x.LikedUser.UserName,
                Age = x.LikedUser.DateOfBirth.CalculateAge(),
                Id = x.LikedUser.Id,
                PhotoUrl = x.LikedUser.Photos.FirstOrDefault(x => x.IsMain).Url,
                City = x.LikedUser.City,
                KnownAs = x.LikedUser.KnownAs
            })));
        }
    }
}