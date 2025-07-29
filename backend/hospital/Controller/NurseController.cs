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

                    PrescriptionId = _dbcontext.Prescription
                        .Where(p => p.AppointmentId == a.AppointmentId)
                        .Select(p => p.Id)
                        .FirstOrDefault(),
                    PrescribedBy=_dbcontext.Prescription.Where(p=>p.AppointmentId==a.AppointmentId)
                        .Select(p=>p.Prescribedby)
                        .FirstOrDefault(),

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

        [HttpPost("updateprescription")]
        public async Task<IActionResult> UpdatePrescription([FromBody] Prescription prescription)
        {

            if (prescription.Id <= 0)
            {
                return BadRequest("New prescriptions cannot be created by this endpoint.");
            }

          
            var existingPrescription = await _dbcontext.Prescription
                .Include(p => p.PrescriptionDays)
                .FirstOrDefaultAsync(p => p.Id == prescription.Id);

            if (existingPrescription == null)
                return NotFound("Prescription not found");

          
            existingPrescription.Prescribedby = prescription.Prescribedby;


            _dbcontext.PrescriptionDays.RemoveRange(existingPrescription.PrescriptionDays);
            await _dbcontext.SaveChangesAsync();

            foreach (var day in prescription.PrescriptionDays)
            {
                day.Id = 0;
                day.PrescriptionId = existingPrescription.Id;
                day.Prescription = null;
                _dbcontext.PrescriptionDays.Add(day);
            }

            await _dbcontext.SaveChangesAsync();

            return Ok(new
            {
                Message = "Prescription updated successfully",
                PrescriptionId = existingPrescription.Id
            });
        }


        [HttpGet("getprescriptionbyprescription/{prescriptionId}")]
        public async Task<IActionResult> GetPrescriptionByAppointmentId(int prescriptionId)
        {
            var prescription = await _dbcontext.Prescription
                .Where(p => p.Id == prescriptionId)
                .Include(p => p.PrescriptionDays)
                .Include(p => p.Doctor)
                .Include(p => p.Appointment)
                    .ThenInclude(a => a.Patient)
                    .ThenInclude(p => p.User)
                .FirstOrDefaultAsync();

            if (prescription == null)
            {
                return Ok(null);
            }

            return Ok(new
            {
                prescription.Id,
                prescription.AppointmentId,
                prescription.Prescribedby,
                PrescribedDate = prescription.PrescriptionDays.FirstOrDefault()?.PrescribedDate,

                PrescriptionDays = prescription.PrescriptionDays.Select(d => new
                {
                    d.PrescribedDate,
                    d.Id,
                    d.DayNumber,
                    d.Diagnosis,
                    d.Medications,
                    d.Notes
                }).ToList()
            });
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Nurse>> GetNurse(int id)
        {
            var nurse = await _dbcontext.Nurses.FindAsync(id);
            if (nurse == null)
            {
                return NotFound();
            }
            return nurse;
        }

        [HttpPut("availabilitystatus/{nurseId}")]
        public async Task<IActionResult> UpdateAvailabilityStatus(int nurseId, [FromBody] Nurse request)
        {
            if (request == null || string.IsNullOrEmpty(request.Availability))
                return BadRequest("Invalid status.");

            var nurse = await _dbcontext.Nurses.FindAsync(nurseId);
            if (nurse == null)
                return NotFound("Nurse not found.");

            nurse.Availability = request.Availability;
            await _dbcontext.SaveChangesAsync();

            return Ok(new { message = "Availability status updated successfully." });
        }


    }
}
