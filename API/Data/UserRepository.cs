using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entites;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            this.mapper = mapper;
            this._context = context;
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
         return await _context.Users.Where(x=> x.UserName == username)
         .ProjectTo<MemberDto>(mapper.ConfigurationProvider).SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<MemberDto>> GetMembersAsync()
        {
            return await _context.Users.ProjectTo<MemberDto>(mapper.ConfigurationProvider).ToListAsync();
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
            .Include(x=> x.Photos).SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
           return await _context.Users
           .Include(x=> x.Photos)
           .ToListAsync();
        }

        public async Task<bool> saveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void update(AppUser user)
        {
             _context.Entry(user).State = EntityState.Modified;
        }
    }
}