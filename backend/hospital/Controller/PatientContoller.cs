using hospital.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hospital.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientContoller : ControllerBase
    {
        private readonly Applicationdbcontext _dbcontext;

        public PatientContoller(Applicationdbcontext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        [HttpGet("api/patient/appointments/my")]
        public async Task<IActionResult> GetAppointmentsForPatient()
        {
            var patientIdClaim = User.FindFirst("PatientId")?.Value;

            if (string.IsNullOrEmpty(patientIdClaim) || !int.TryParse(patientIdClaim, out int patientId))
                return Unauthorized("Invalid or missing PatientId claim.");

            var appointments = await _dbcontext.appointments
                .Include(a => a.Doctor)
                .Include(a => a.Department)
                .Where(a => a.PatientId == patientId)
                .Select(a => new
                {
                    a.AppointmentId,
                    a.AppointmentDate,
                    a.AppointmentTime,
                    a.Reason,
                    a.Status,
                    a.CreatedAt,
                    DoctorName = a.Doctor.UserName,
                    DepartmentName = a.Department.DepartmentName
                })
                .ToListAsync();

            return Ok(appointments);
        }

    }
}
