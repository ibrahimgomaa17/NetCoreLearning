using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entites;
using API.Extensions;
using API.Helpers;
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
            return await _context.Users.Where(x => x.UserName == username)
            .ProjectTo<MemberDto>(mapper.ConfigurationProvider).SingleOrDefaultAsync();
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {

            var query = _context.Users.AsQueryable();
            query = query.Where(x => x.Gender == userParams.Gender && x.UserName != userParams.CurrentUserName);
            var minDate = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDate = DateTime.Today.AddYears(-userParams.MinAge);
            query = query.Where(x=> x.DateOfBirth >= minDate && x.DateOfBirth <= maxDate);
            query = userParams.OrderBy switch
            {
                "Created"=> query.OrderByDescending(x=> x.Created),
                _=> query.OrderByDescending(x=> x.LastActive)

            };
            var nQuery = query.ProjectTo<MemberDto>(mapper.ConfigurationProvider).AsNoTracking();
            return await PagedList<MemberDto>.CreateAsync(nQuery, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
            .Include(x => x.Photos).SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users
            .Include(x => x.Photos)
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