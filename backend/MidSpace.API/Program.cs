
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MidSpace.Data.Data;
using MidSpace.Data.Repository.DoctorsRepo;
using MidSpace.Data.Repository.PatientRepo;
using MidSpace.Data.Repository.HospitalRepo;
using MidSpace.Data.Repository.JobOpportunityRepo;
using MidSpace.Data.Repository.JobApplicationRepo;
using MidSpace.Data.Repository.DoctorJobRecommendationRepo;
using MidSpace.Data.Repository.AppointmentRepository;
using MidSpace.Data.Repository.DrugRepo;
using MidSpace.Data.Repository.MedicalRepo;
using MidSpace.Data.Repository.PrescriptionRepo;
using MidSpace.Data.Repository.DoctorRecommendationRepo;
using MidSpace.Data.Repository.UserRepo;
using MidSpace.Domain.Managers.Doctors;
using MidSpace.Domain.Managers.Patients;
using MidSpace.Domain.Managers.Hospitals;
using MidSpace.Domain.Managers.JobOpportunities;
using MidSpace.Domain.Managers.JobApplications;
using MidSpace.Domain.Managers.DoctorJobRecommendations;
using MidSpace.Domain.Managers.Appointments;
using MidSpace.Domain.Managers.Drugs;
using MidSpace.Domain.Managers.MedicalRecords;
using MidSpace.Domain.Managers.Prescriptions;
using MidSpace.Domain.Managers.DoctorRecommendations;
using MidSpace.Domain.Managers.Auth;
using MidSpace.Domain.Managers.Admin;
using MidSpace.Domain.Managers.Dashboard;
using MidSpace.Domain.Managers.Messages;
using MidSpace.Domain.Managers.Posts;
using MidSpace.Domain.Managers.Comments;
using MidSpace.Domain.Managers.Follows;
using MidSpace.Domain.Managers.Feed;

namespace MidSpace.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                });
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            var connectionString = builder.Configuration.GetConnectionString("mid") ?? "Data Source = db47147.public.databaseasp.net;Initial Catalog = db47147; User Id = db47147; Password=7Qq_N@4o!eF2;Encrypt=False;";
            builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));

            // CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });
            // JWT Auth
            var jwtKey = builder.Configuration["Jwt:Key"] ?? "MidSpaceSuperSecretKey2024AtLeast32Chars!";
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "MidSpace.API",
                        ValidAudience = builder.Configuration["Jwt:Audience"] ?? "MidSpace.App",
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                        ClockSkew = TimeSpan.Zero
                    };
                });

            // DI Registrations
            builder.Services.AddScoped<IAuthManager, AuthManager>();
            builder.Services.AddScoped<IUserRepo, UserRepo>();
            builder.Services.AddScoped<IDoctorsManager, DoctorsManager>();
            builder.Services.AddScoped<IDoctorsRepo, DoctorsRepo>();
            builder.Services.AddScoped<IPatientsManager, PatientsManager>();
            builder.Services.AddScoped<IPatientRepo, PatientRepo>();
            builder.Services.AddScoped<IHospitalsManager, HospitalsManager>();
            builder.Services.AddScoped<IHospitalRepo, HospitalRepo>();
            builder.Services.AddScoped<IJobOpportunitiesManager, JobOpportunitiesManager>();
            builder.Services.AddScoped<IJobOpportunityRepo, JobOpportunityRepo>();
            builder.Services.AddScoped<IJobApplicationsManager, JobApplicationsManager>();
            builder.Services.AddScoped<IJobApplicationRepo, JobApplicationRepo>();
            builder.Services.AddScoped<IDoctorJobRecommendationsManager, DoctorJobRecommendationsManager>();
            builder.Services.AddScoped<IDoctorJobRecommendationRepo, DoctorJobRecommendationRepo>();
            builder.Services.AddScoped<IAppointmentsManager, AppointmentsManager>();
            builder.Services.AddScoped<IAppointmentRepo, AppointmentRepo>();
            builder.Services.AddScoped<IDrugsManager, DrugsManager>();
            builder.Services.AddScoped<IDrugRepo, DrugRepo>();
            builder.Services.AddScoped<IMedicalRecordsManager, MedicalRecordsManager>();
            builder.Services.AddScoped<IMedicalRecordRepo, MedicalRecordRepo>();
            builder.Services.AddScoped<IPrescriptionsManager, PrescriptionsManager>();
            builder.Services.AddScoped<IPrescriptionRepo, PrescriptionRepo>();
            builder.Services.AddScoped<IDoctorRecommendationsManager, DoctorRecommendationsManager>();
            builder.Services.AddScoped<IDoctorRecommendationRepo, DoctorRecommendationRepo>();
            builder.Services.AddScoped<IAdminManager, AdminManager>();
            builder.Services.AddScoped<IDashboardManager, DashboardManager>();
            builder.Services.AddScoped<IMessagesManager, MessagesManager>();
            builder.Services.AddScoped<IPostsManager, PostsManager>();
            builder.Services.AddScoped<ICommentsManager, CommentsManager>();
            builder.Services.AddScoped<IFollowsManager, FollowsManager>();
            builder.Services.AddScoped<IFeedManager, FeedManager>();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("AllowAll");
            if (!app.Environment.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
