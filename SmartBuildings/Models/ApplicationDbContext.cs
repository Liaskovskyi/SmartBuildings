using Microsoft.EntityFrameworkCore;

namespace SmartBuildings.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Owner>? Owners { get; set; }
        public DbSet<Entrance>? Entrances { get; set; }
        public DbSet<Apartment>? Apartments { get; set; }
        public DbSet<WaterMeter>? WaterMeters { get; set; }
        public DbSet<ElectricityMeter>? ElectricityMeters { get; set; }
        public DbSet<HeatingMeter>? HeatingMeters { get; set; }
        public DbSet<User>? Users { get; set; }
        public DbSet<Device>? Devices { get; set; }

    }

}
