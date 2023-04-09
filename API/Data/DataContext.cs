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
        public DbSet<UserMessage> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<UserLike>().HasKey(k => new { k.SourceUserId, k.LikedUserId });
            builder.Entity<UserLike>().HasOne(s => s.SourceUser).WithMany(x => x.LikedUsers).HasForeignKey(l => l.SourceUserId).OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserLike>().HasOne(s => s.LikedUser).WithMany(x => x.LikedByUsers).HasForeignKey(l => l.LikedUserId).OnDelete(DeleteBehavior.Cascade);
           
            builder.Entity<UserMessage>().HasOne(x=> x.Reciever).WithMany(x=> x.RecievedMessages).HasForeignKey(x=> x.RecieverId).OnDelete(DeleteBehavior.Cascade);
             builder.Entity<UserMessage>().HasOne(x=> x.Sender).WithMany(x=> x.SentMessages).HasForeignKey(x=> x.SenderId).OnDelete(DeleteBehavior.Cascade);
        }

    }
}