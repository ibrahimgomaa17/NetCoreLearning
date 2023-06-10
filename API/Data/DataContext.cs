using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entites;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, int,
    IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
    IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<UserLike> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<AppUser>().HasMany(ur=> ur.UserRoles).WithOne(x=> x.User).HasForeignKey(x=> x.UserId).IsRequired();
            builder.Entity<AppRole>().HasMany(x=> x.UserRoles).WithOne(x=> x.Role).HasForeignKey(x=> x.RoleId).IsRequired(); 


            builder.Entity<UserLike>().HasKey(k => new { k.SourceUserId, k.LikedUserId });
            builder.Entity<UserLike>().HasOne(s => s.SourceUser).WithMany(x => x.LikedUsers).HasForeignKey(l => l.SourceUserId).OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserLike>().HasOne(s => s.LikedUser).WithMany(x => x.LikedByUsers).HasForeignKey(l => l.LikedUserId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Message>().HasOne(x => x.Recipient).WithMany(x => x.MessagesReceived).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Message>().HasOne(x => x.Sender).WithMany(x => x.MessagesSent).OnDelete(DeleteBehavior.Restrict);
        }

    }
}