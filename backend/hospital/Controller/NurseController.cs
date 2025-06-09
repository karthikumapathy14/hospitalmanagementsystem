using hospital.Data;
using hospital.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hospital.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Nurse")]
    public class NurseController : ControllerBase
    {
        private readonly Applicationdbcontext _dbcontext;

        public NurseController(Applicationdbcontext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        [HttpGet("Patientlist")]
        public async Task<IActionResult> GetPatientlist()
        {
            var getall = await _dbcontext.Patients.ToListAsync();

            return Ok(getall);
        }

        [HttpGet("appointmentnurse")]
        public async Task<IActionResult> GetAppointmentfornurse()
        {
            var nurseIdClaim = User.FindFirst("NurseId")?.Value;

            if (string.IsNullOrEmpty(nurseIdClaim) || !int.TryParse(nurseIdClaim, out int nurseId))
                return Unauthorized("Invalid or missing DoctorId claim.");

            var appointment = await _dbcontext.appointments
               .Include(a=>a.Patient)
               .ThenInclude(a=>a.Doctor)
               .OrderByDescending(a=>a.AppointmentDate)
               .Where(a=>a.NurseId == nurseId)
                .Select(a => new
                {  
                 a.AppointmentId,
                    a.DoctorId,
                    a.AppointmentDate,
                    a.StartTime,
                    a.Reason,
                    a.PatientId,
                    DoctorName=a.Doctor.UserName,
                    Patientid = a.Patient.patientid,
                    PatientName = a.Patient.UserName,
                    a.Status
                }).ToListAsync();
            return Ok(appointment);
        }

        [HttpGet("getbyidprescibe/{id}")]
        public async Task<IActionResult> getPrescriptionbyid(int id)
        {
            var prescribe = await _dbcontext.Prescription.FirstOrDefaultAsync(a=>a.AppointmentId==id);
            if (prescribe == null)
                return NotFound();
            return Ok(prescribe);
        }

        [HttpPut("updateprescription/{id}")]
        public async Task<IActionResult> updatePrescription(int id,Prescription prescription)
        {
            var existing =  _dbcontext.Prescription.FirstOrDefault(a=>a.AppointmentId==id);
            if (existing == null) return NotFound();

            existing.Diagnosis = prescription.Diagnosis;
            existing.Notes = prescription.Notes;
            existing.Medications = prescription.Medications;

            await _dbcontext.SaveChangesAsync();

            return Ok("Prescription Updated Successfully");

        }


    }
}
