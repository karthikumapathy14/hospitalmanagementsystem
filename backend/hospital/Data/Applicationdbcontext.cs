
using hospital.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Runtime.InteropServices;

namespace hospital.Data
{
    public class Applicationdbcontext : IdentityDbContext<IdentityUser>
    {
        public Applicationdbcontext(DbContextOptions<Applicationdbcontext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Nurse> Nurses { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Receptionist> Receptionists { get; set; }
        public DbSet<Prescription> Prescription { get; set; }
        public DbSet<Appointment> appointments { get; set; }
        public DbSet<DoctorAvailability> DoctorAvailability { get; set; }

        public DbSet<AvailableSlots> AvailableSlots { get; set; }

        public DbSet<Bill> bill { get; set; }
    }

}
