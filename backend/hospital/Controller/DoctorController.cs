using System.Security.Claims;
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
    //[Authorize(Roles = "Doctor")]
    public class DoctorController : ControllerBase
    {
        public readonly Applicationdbcontext _dbcontext;

        public DoctorController(Applicationdbcontext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        [HttpGet("getAllPatient")]
        public async Task<IActionResult> getPatient()
        {
            var allpatient = await _dbcontext.Patients.ToListAsync();
            return Ok(allpatient);
        }



        [HttpGet("api/appointments/my")]
        public async Task<IActionResult> GetAppointmentsForDoctor()
        {
            var doctorIdClaim = User.FindFirst("DoctorId")?.Value;

            if (string.IsNullOrEmpty(doctorIdClaim) || !int.TryParse(doctorIdClaim, out int doctorId))
                return Unauthorized("Invalid or missing DoctorId claim.");

            var appointments = await _dbcontext.appointments
                .Include(a => a.Patient)
                .Where(a => a.DoctorId == doctorId)
                .OrderBy(a=>a.AppointmentDate)
               .Select(a => new
               {
                   a.AppointmentId,
                   a.DoctorId,
                   a.AppointmentDate,
                   a.AppointmentTime,
                   a.Reason,
                   a.NurseId,
                   a.PatientId,
                   Patientid = a.Patient.patientid,
                   PatientName = a.Patient.UserName,
                   a.Status,
                   PrescriptionAdded = _dbcontext.Prescription.Any(p => p.AppointmentId == a.AppointmentId)
               })
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpGet("api/appointments/{id}")]
        public IActionResult GetAppointmentById(int id)
        {
            var appointment = _dbcontext.appointments
                .Include(a => a.Patient) // Include related Patient entity
                .Where(a => a.AppointmentId == id)
                .Select(a => new
                {
                    a.AppointmentId,
                    a.DoctorId,
                    a.AppointmentDate,
                    a.AppointmentTime,
                    a.Reason,
                    a.Status,
                    a.NurseId,
                    PatientId = a.Patient.patientid,
                    PatientName = a.Patient.UserName 
                })
                .FirstOrDefault();

            if (appointment == null)
            {
                return NotFound(); 
            }

            return Ok(appointment); 
        }


        [HttpPut("api/Editappointments/{id}")]
        public IActionResult UpdateAppointment(int id, Appointment appointment)
        {
            var existing = _dbcontext.appointments.FirstOrDefault(a => a.AppointmentId == id);
            if (existing == null)
            {
                return NotFound();
            }

            existing.Status = appointment.Status;
            existing.NurseId = appointment.NurseId;
         
            _dbcontext.SaveChanges();

            return Ok(existing); 
        }

        [HttpGet("getPrescription")]
        public  IActionResult GetPrescription()
        {
            var name=  _dbcontext.Prescription.ToList();
            return Ok(name);
        }

        //[HttpPost("postprescription")]
        //public async Task<IActionResult> Createprescription(Prescription prescription)
        //{
        //     await _dbcontext.Prescription.AddAsync(prescription);
        //    await _dbcontext.SaveChangesAsync();
        //    return Ok(prescription);
        //}


        [HttpPost("postprescription")]
        public async Task<IActionResult> Createprescription([FromBody] Prescription prescription)
        {

            var appointment = await _dbcontext.appointments
                .Include(a => a.Patient)
                .ThenInclude(p => p.User)
                .FirstOrDefaultAsync(a => a.AppointmentId == prescription.AppointmentId);

            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }


            prescription.Appointment = appointment;

            _dbcontext.Prescription.Add(prescription);
            await _dbcontext.SaveChangesAsync();

            return Ok(prescription);
        }

        [HttpPut("appointments/{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] Appointment dto)
        {
            var appointment = await _dbcontext.appointments.FindAsync(id);
            if (appointment == null)
                return NotFound("Appointment not found");

            // Check if status is "Complete"
            if (dto.Status == "Complete")
            {
                // Check if a prescription exists for this appointment
                var hasPrescription = await _dbcontext.Prescription.AnyAsync(p => p.AppointmentId == id);
                if (!hasPrescription)
                    return BadRequest("Cannot mark appointment as complete without prescription.");
            }

            appointment.Status = dto.Status;
            await _dbcontext.SaveChangesAsync();

            return Ok("Status updated successfully");
        }



        [HttpGet("filterbyid/{id}")]
        public async Task<IActionResult> filterbyid(int id)
        {
            var appointment = await _dbcontext.appointments
                .Include(p => p.Patient)
                .Where(p => p.PatientId == id)
                .Select(p => new
                {
                    p.PatientId,
                    p.DoctorId,
                    Patientid = p.Patient.patientid
                }).FirstOrDefaultAsync();

            return Ok(appointment);
        }

        [HttpGet("history/{patientId}")]
        public async Task<IActionResult> GetPatientHistory(int patientId)
        {
            var history = await _dbcontext.appointments
                .Where(a => a.PatientId == patientId)
                .Include(a => a.Doctor)
                .Include(a => a.Doctor.Department)
                .Include(a => a.Patient) // ✅ include Patient
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new
                {
                    a.AppointmentId,
                    a.AppointmentDate,
                    a.Reason,
                    PatientId = a.PatientId,
                    PatientUniqueId = a.Patient.patientid, 

                    Doctor = new
                    {
                        a.Doctor.Id,
                        a.Doctor.UserName,
                        Department = new
                        {
                            a.Doctor.Department.DepartmentName
                        }
                    },

                    Prescription = _dbcontext.Prescription
                        .Where(p => p.AppointmentId == a.AppointmentId)
                        .Select(p => new
                        {
                            p.Diagnosis,
                            p.Medications,
                            p.Notes,
                            p.PrescribedDate,
                            p.Prescribedby
                        })
                        .FirstOrDefault()
                })
                .ToListAsync();

            if (!history.Any())
                return NotFound($"No history found for patient {patientId}.");

            return Ok(history);
        }
        [HttpGet("history")]
        public async Task<IActionResult> GetAllPatientHistories()
        {
            var history = await _dbcontext.appointments
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.Department)
                .Include(a => a.Patient)
                .OrderByDescending(a => a.AppointmentDate)
                .ToListAsync();

            var result = history.Select(a => new
            {
                a.AppointmentId,
                a.AppointmentDate,
                a.Reason,

                Patient = new
                {
                    id = a.Patient?.Id,
                    userName = a.Patient?.UserName,
                    patientid = a.Patient?.patientid
                },

                Doctor = new
                {
                    docid = a.Doctor?.Id,
                    docname = a.Doctor?.UserName,
                    Department = new
                    {
                        departmentName = a.Doctor?.Department?.DepartmentName
                    }
                },

                Prescription = _dbcontext.Prescription
                    .Where(p => p.AppointmentId == a.AppointmentId)
                    .Select(p => new
                    {
                        p.Diagnosis,
                        p.Medications,
                        p.Notes,
                        p.Prescribedby,
                        p.PrescribedDate
                    })
                    .FirstOrDefault() // ✅ returns a single object instead of list
            }).ToList();

            if (!result.Any())
                return NotFound("No patient histories found.");

            return Ok(result);
        }


        //dashboard

        [HttpGet("appointments/today-count")]
        public async Task<IActionResult> GetTodaysAppointmentCountForDoctor()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User ID not found in token");

            int doctorId = int.Parse(userIdClaim.Value);
            DateTime today = DateTime.Today;

            int todayCount = await _dbcontext.appointments
                .CountAsync(a => a.DoctorId == doctorId && a.AppointmentDate == DateOnly.FromDateTime(DateTime.Today)
);

            return Ok(todayCount);
        }


    }
}
