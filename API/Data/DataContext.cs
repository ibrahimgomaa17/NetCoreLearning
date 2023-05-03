using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entites;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<AppUser> Users { get; set; }
        public DbSet<UserLike> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<UserLike>().HasKey(k => new { k.SourceUserId, k.LikedUserId });
            builder.Entity<UserLike>().HasOne(s => s.SourceUser).WithMany(x => x.LikedUsers).HasForeignKey(l => l.SourceUserId).OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserLike>().HasOne(s => s.LikedUser).WithMany(x => x.LikedByUsers).HasForeignKey(l => l.LikedUserId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Message>().HasOne(x=> x.Recipient).WithMany(x=> x.MessagesReceived).OnDelete(DeleteBehavior.Restrict);
              builder.Entity<Message>().HasOne(x=> x.Sender).WithMany(x=> x.MessagesSent).OnDelete(DeleteBehavior.Restrict);
        }

    }
}