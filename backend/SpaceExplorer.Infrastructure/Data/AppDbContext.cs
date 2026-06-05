using Microsoft.EntityFrameworkCore;
using SpaceExplorer.Core.Entities;

namespace SpaceExplorer.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Collection> Collections => Set<Collection>();
        public DbSet<MediaItem> MediaItems => Set<MediaItem>();
        public DbSet<Tag> Tags => Set<Tag>();
        public DbSet<CollectionMedia> CollectionMedias => Set<CollectionMedia>();
        public DbSet<MediaItemTag> MediaItemTags => Set<MediaItemTag>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.PasswordHash).IsRequired();
            });

            modelBuilder.Entity<Collection>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(500);

                entity.HasOne(c => c.User)
                      .WithMany(u => u.Collections)
                      .HasForeignKey(c => c.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<MediaItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Url).IsRequired();
                entity.Property(e => e.MediaType).IsRequired().HasMaxLength(50);
            });

            modelBuilder.Entity<Tag>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Name).IsUnique();
                entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
            });

            modelBuilder.Entity<CollectionMedia>(entity =>
            {
                entity.HasKey(cm => new { cm.CollectionId, cm.MediaItemId });

                entity.HasOne(cm => cm.Collection)
                      .WithMany(c => c.CollectionMedias)
                      .HasForeignKey(cm => cm.CollectionId);

                entity.HasOne(cm => cm.MediaItem)
                      .WithMany(m => m.CollectionMedias)
                      .HasForeignKey(cm => cm.MediaItemId);
            });

            modelBuilder.Entity<MediaItemTag>(entity =>
            {
                entity.HasKey(mt => new { mt.MediaItemId, mt.TagId });

                entity.HasOne(mt => mt.MediaItem)
                      .WithMany(m => m.MediaItemTags)
                      .HasForeignKey(mt => mt.MediaItemId);

                entity.HasOne(mt => mt.Tag)
                      .WithMany(t => t.MediaItemTags)
                      .HasForeignKey(mt => mt.TagId);
            });
        }
    }
}