using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Migrations;
using MidSpace.Data.Models;
using MidSpace.Data.Models.Appointments_Medical;
using MidSpace.Data.Models.Social;
using MidSpace.Data.Models.user;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MidSpace.Data.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<DoctorCertificate> DoctorCertificates { get; set; }
        public DbSet<DoctorAvailability> DoctorAvailabilities { get; set; }
        public DbSet<PatientAllergy> PatientAllergies { get; set; }
        public DbSet<PatientChronicDisease> PatientChronicDiseases { get; set; }
        public DbSet<UserPhone> UserPhones { get; set; }
        public DbSet<Admin> Admins { get; set; }
      
        public DbSet<Hospital> Hospitals { get; set; }
        public DbSet<JobOpportunity> jobOpportunities { get; set; }
        public DbSet<JobApplication> JobApplications { get; set; }
        public DbSet<DoctorJobRecommendation> DoctorJobRecommendations { get; set; }
      
        public DbSet<Drug> Drugs { get; set; }
       
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<MedicalAttachment> MedicalAttachments { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<PrescriptionItem> PrescriptionItems { get; set; }

        public DbSet<DoctorRecommendation> DoctorRecommendations { get; set; }
        public DbSet<Message> Messages { get; set; }

        public DbSet<Post> Posts { get; set; }
        public DbSet<PostLike> PostLikes { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Follow> Follows { get; set; }

        public ApplicationDbContext(DbContextOptions <ApplicationDbContext> options):base(options)
        {

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Data Source = db47147.public.databaseasp.net;Initial Catalog = db47147; User Id = db47147; Password=7Qq_N@4o!eF2;Encrypt=False;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Follow>(entity =>
            {
                entity.HasOne(f => f.Follower)
                    .WithMany()
                    .HasForeignKey(f => f.FollowerId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(f => f.Followee)
                    .WithMany()
                    .HasForeignKey(f => f.FolloweeId)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.HasOne(c => c.User)
                    .WithMany()
                    .HasForeignKey(c => c.UserId)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<PostLike>(entity =>
            {
                entity.HasOne(pl => pl.User)
                    .WithMany()
                    .HasForeignKey(pl => pl.UserId)
                    .OnDelete(DeleteBehavior.NoAction);
            });
        }
    }
}
