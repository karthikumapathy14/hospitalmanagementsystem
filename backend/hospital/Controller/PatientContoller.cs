using hospital.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hospital.Controller
{
    [Route("api/[controller]")]
    //[Authorize(Roles ="Patient")]
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

        [HttpGet("BillView/getbyid/{id}")]
        public async Task<IActionResult> GetBillWithFullDetails(int id)
        {
            var bill = await _dbcontext.bill
                .Where(b => b.AppointmentId == id)
                .Include(b => b.Appointment)
                    .ThenInclude(a => a.Patient)
                        .ThenInclude(p => p.User)
                .Include(b => b.Appointment)
                    .ThenInclude(a => a.Doctor)
                        .ThenInclude(d => d.Department)
                .Select(b => new
                {
                    // Bill Info
                    b.BillId,
                    b.ConsultationFee,
                    b.TreatmentCharges,
                    b.MedicationCharges,
                    b.OtherCharges,
                    b.TotalAmount,
                    b.BillDate,

                    // Appointment Info
                    AppointmentId = b.Appointment.AppointmentId,
                    b.Appointment.AppointmentDate,
                    b.Appointment.AppointmentTime,
                    b.Appointment.Reason,

                    // Patient Info
                    PatientId = b.Appointment.Patient.patientid,
                    PatientName = b.Appointment.Patient.UserName,
                    PatientEmail = b.Appointment.Patient.Email,
                    PatientPhone = b.Appointment.Patient.PhoneNo,
                    Age = b.Appointment.Patient.Age,
                    Gender=b.Appointment.Patient.Gender,
                    BloodGroup = b.Appointment.Patient.Bloodgrp,
                    PatientAddress = b.Appointment.Patient.Address,

                    // Doctor Info
                    DoctorName = b.Appointment.Doctor.UserName,
            
           
       

                    // Department
                    DepartmentName = b.Appointment.Doctor.Department.DepartmentName
                })
                .FirstOrDefaultAsync();

            if (bill == null)
            {
                return NotFound("Bill not found");
            }

            return Ok(bill);
        }

    }
}
