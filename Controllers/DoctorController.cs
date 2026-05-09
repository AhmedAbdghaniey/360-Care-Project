using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Data.Models.user;
using MidSpace.Domain.Dtos.DoctorDtos;
using MidSpace.Domain.Managers.Doctors;


namespace MidSpace.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorsManager _manager;
        public DoctorController(IDoctorsManager manager)
        {
            _manager = manager;
        }
        [HttpPost]
        public async Task<IActionResult> Add(AddDoctorDtos dto)
        {
            await _manager.AddDoctorAsync(dto);
            return Ok("Doctor added successfully");
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var doctors = await _manager.GetAllDoctorsAsync();

            if (doctors == null || !doctors.Any())
            {
                return NotFound(new { message = "No doctors found" });
            }

            return Ok(doctors);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateDoctorDtos dto)
        {
            await _manager.UpdateDoctorAsync(id, dto);
            return Ok("Doctor updated successfully");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var doctors = await _manager.GetAllDoctorsAsync();

            if (doctors == null)
            {
                return NotFound(new { message = "No doctors found" });
            }
            await _manager.DeleteDoctorAsync(id);
            return Ok("Doctor deleted successfully");
        }

        //private readonly ApplicationDbContext _context;

        //public DoctorController(ApplicationDbContext context)
        //{
        //    _context = context;
        //}
        //[HttpPost]
        //public async Task<IActionResult> AddDoctorDtos(AddDoctorDtos dto)
        //{
        //    var doctor = new Doctor
        //    {
        //        Specialization = dto.Specialization,
        //        LicenseNumber = dto.LicenseNumber,
        //        ExperienceYears = dto.ExperienceYears,
        //        Bio = dto.Bio,
        //        ConsultationFee = dto.ConsultationFee
        //    };

        //    await _context.Doctors.AddAsync(doctor);
        //    await _context.SaveChangesAsync();

        //    return Ok(doctor);
        //}

    }
}
