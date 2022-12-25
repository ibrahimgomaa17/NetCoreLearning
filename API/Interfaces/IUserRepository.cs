using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entites;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void update (AppUser user); 
        Task<bool> saveAllAsync();
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string username);
        Task<MemberDto> GetMemberAsync(string username);
        Task<IEnumerable<MemberDto>> GetMembersAsync();
    }
}