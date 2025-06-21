using hospital.Data;
using hospital.Migrations;
using hospital.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System;

namespace hospital.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Receptionist")]
    public class ReceptionistController : ControllerBase
    {
        private readonly Applicationdbcontext _dbcontext;
        private readonly UserManager<IdentityUser> _usermanager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public ReceptionistController(Applicationdbcontext dbcontext, UserManager<IdentityUser> usermanager, RoleManager<IdentityRole> roleManager)
        {
            _dbcontext = dbcontext;
            _usermanager = usermanager;
            _roleManager = roleManager;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> PatientReg(User model)
        {
            string generatedUserName;
            if (model.Role == "Patient")
            {
                generatedUserName = await GenerateUsernameAsync(model.UserName); // base name comes from model.UserName
            }
            else
            {
                generatedUserName = model.UserName; // fallback for non-patient users
            }

            var user = new User
            {
                UserName = model.UserName,
                Email = model.Email,
             
            };

            var result = await _usermanager.CreateAsync(user, model.PasswordHash);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Ensure role exists
            if (!await _roleManager.RoleExistsAsync(model.Role))
            {
                var roleResult = await _roleManager.CreateAsync(new IdentityRole(model.Role));
                if (!roleResult.Succeeded)
                {
                    return BadRequest(roleResult.Errors);
                }
            }

            // Assign role to user
            var addToRoleResult = await _usermanager.AddToRoleAsync(user, model.Role);
            if (!addToRoleResult.Succeeded)
            {
                return BadRequest(addToRoleResult.Errors);
            }

            // Save Patient
            if (model.Role == "Patient")
            {
                var patient = new Patient
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = "Patient",
                    patientid=generatedUserName
                };

                _dbcontext.Patients.Add(patient);
                await _dbcontext.SaveChangesAsync();
                
            }

            return Ok(new { message ="patient register successfully",PatientId= generatedUserName});

        }

        private async Task<string> GenerateUsernameAsync(string name)
        {
            var baseName = name.Replace(" ", "").ToLower();

            // Count existing patients
            int totalPatients = await _dbcontext.Patients.CountAsync();

            // Global patient number (incrementing)
            int nextNumber = totalPatients + 1;

            // Return formatted username like: karthik001, aravind002, etc.
            return $"{baseName}{nextNumber:D3}";
        }


        [HttpGet("Getallpatient")]
        public async Task<IActionResult> GetAllPatient()
        {
           var patient= await _dbcontext.Patients.ToListAsync();
            return Ok(patient);
        }

        [HttpGet("getbyid-patient/{id}")]
        public async Task<IActionResult> Getbyid(int id)
        {
            var patientid = await _dbcontext.Patients.FindAsync(id);
            if (patientid == null) return BadRequest("PatientId Not Found");
            return Ok(patientid);
        }

        [HttpPut("Editpatient/{id}")]
        public async Task<IActionResult> Editpatient(int id,Patient patient)
        {
            
            var patid = await _dbcontext.Patients.FindAsync(id);
            if (!string.IsNullOrWhiteSpace(patient.UserName) && patient.UserName != "string")
                patid.UserName = patient.UserName;
            if (!string.IsNullOrWhiteSpace(patient.Email) && patient.Email != "string")
                patid.Email = patient.Email;
            if (!string.IsNullOrWhiteSpace(patient.Role) && patient.Role != "string")
                patid.Role = patient.Role;
            if(!string.IsNullOrWhiteSpace(patient.Age )&& patient.Age!="string")
            patid.Age = patient.Age;
            if (!string.IsNullOrWhiteSpace(patient.PhoneNo) && patient.PhoneNo != "string")
            patid.PhoneNo = patient.PhoneNo;
            if (!string.IsNullOrWhiteSpace(patient.Bloodgrp) && patient.Bloodgrp != "string")
                patid.Bloodgrp = patient.Bloodgrp;
            if (!string.IsNullOrWhiteSpace(patient.Address) && patient.Address != "string")
                patid.Address = patient.Address;
            patid.Gender = patient.Gender;
            patid.DoctorId = patient.DoctorId;
            patid.NurseId = patient.NurseId;
                patid.status = patient.status;
           await _dbcontext.SaveChangesAsync();


            return Ok("Updated successfully");
            
        }


        [HttpPost("Create-appointment")]
        public async Task<IActionResult> CreateAppointment([FromBody] Appointment dto)
        {
            var availability = await _dbcontext.DoctorAvailability
                .FirstOrDefaultAsync(a =>
                    a.DoctorId == dto.DoctorId &&
                    dto.AppointmentDate.Date >= a.StartDate.Date &&
                    dto.AppointmentDate.Date <= a.EndDate.Date);

            if (availability == null)
                return BadRequest("Doctor is not available on this date.");

            // Use dto.StartTime directly
            if (dto.StartTime < availability.StartTime || dto.StartTime >= availability.EndTime)
                return BadRequest("Start time is outside the available window.");

            var existing = await _dbcontext.appointments.FirstOrDefaultAsync(a =>
                a.DoctorId == dto.DoctorId &&
                a.AppointmentDate == dto.AppointmentDate &&
                a.StartTime == dto.StartTime);

            if (existing != null)
                return Conflict("This time slot is already booked.");

            var appointment = new Appointment
            {
                DoctorId = dto.DoctorId,
                PatientId = dto.PatientId,
                DepartmentId = dto.DepartmentId,
                AppointmentDate = dto.AppointmentDate,
                StartTime = dto.StartTime,
                EndTime = dto.StartTime.Add(TimeSpan.FromMinutes(15)),
                Reason = dto.Reason,
                Status = dto.Status,
                CreatedAt = DateTime.UtcNow
            };

            var isBooked = _dbcontext.appointments.Any(a =>
    a.DoctorId == appointment.DoctorId &&
    a.AppointmentDate.Date == appointment.AppointmentDate.Date &&
    a.StartTime == appointment.StartTime &&
    a.Status != "Cancel");

            if (isBooked)
            {
                return Conflict("This slot is already booked.");
            }

            _dbcontext.appointments.Add(appointment);
            await _dbcontext.SaveChangesAsync();

            return Ok("Appointment booked successfully.");
        }



        [HttpPut("Edit-appointment/{id}")]
        public async Task<IActionResult> Editappointment(int id,Appointment dto)
        {
            var appid = await _dbcontext.appointments.FindAsync(id);
            if (appid == null)
                return NotFound();

            if (dto.PatientId.HasValue)
                appid.PatientId = dto.PatientId.Value;

            if (dto.DoctorId.HasValue)
                appid.DoctorId = dto.DoctorId.Value;

            if (dto.DepartmentId.HasValue)
                appid.DepartmentId = dto.DepartmentId.Value;

            if (dto.AppointmentDate >= DateTime.MinValue)
            {
                appid.AppointmentDate = dto.AppointmentDate;
            }


            appid.StartTime = dto.StartTime;
            appid.EndTime = dto.EndTime;

            if (!string.IsNullOrWhiteSpace(dto.Reason) && dto.Reason != "string")
                appid.Reason = dto.Reason;

            if (!string.IsNullOrWhiteSpace(dto.Status))
                appid.Status = dto.Status;

            await _dbcontext.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("getappointmentid/{id}")]
        public async Task<IActionResult> getappointmentid(int id)
        {
            var getid = await _dbcontext.appointments.FindAsync(id);
         
            if (getid == null) return BadRequest("invalid id");
            return Ok(getid);
        }



        [HttpGet("getappointment")]
        public async Task<IActionResult> getappointment()
        {
            var appointmentsWithRelations = await _dbcontext.appointments
                .Include(a => a.Doctor)
                .Include(a => a.Department)
                .Include(a => a.Patient)
                .ToListAsync();

            var result = (from a in appointmentsWithRelations
                          join b in _dbcontext.bill
                          on a.AppointmentId equals b.AppointmentId into ab
                          from b in ab.DefaultIfEmpty()
                          select new
                          {
                              a.AppointmentId,
                              a.PatientId,
                              a.DoctorId,
                              a.DepartmentId,
                              a.Reason,
                              a.Status,
                              a.CreatedAt,
                              a.AppointmentDate,
                              a.StartTime,
                              a.EndTime,
                              Patientid = a.Patient != null ? a.Patient.patientid : "Unknown",
                              DoctorName = a.Doctor != null ? a.Doctor.UserName : "Unknown",
                              DepartmentName = a.Department != null ? a.Department.DepartmentName : "Unknown",
                              BillStatus = b != null ? b.billstatus : "Pending",
                              BillId = b != null ? b.BillId : 0
                          })
                          .OrderByDescending(x => x.AppointmentDate)
                          .ThenByDescending(x => x.StartTime)
                          .ToList();

            return Ok(result);
        }




        //[HttpPost("Billgeneration")]
        //public async Task<IActionResult> CreateBill(Bill dto)
        //{
        //    var bills = new Bill
        //    {
        //        AppointmentId = dto.AppointmentId,
        //        ConsultationFee = dto.ConsultationFee,
        //        TreatmentCharges = dto.TreatmentCharges,
        //        MedicationCharges = dto.MedicationCharges,
        //        OtherCharges = dto.OtherCharges,
        //        BillDate = DateTime.Now
        //    };
        //     _dbcontext.bill.Add(bills);
        //    await _dbcontext.SaveChangesAsync();

        //    return Ok ("Bill Geneated");
        //}

        //[HttpGet("bill")]
        //public async Task<IActionResult> getbill()
        //{
        //    var detail = await _dbcontext.bill.ToListAsync();
        //    return Ok(detail);
        //}

        //[HttpGet("billbyid/{id}")]
        //public async Task<IActionResult> GetBillbyid(int id)
        //{
        //    var exists =  _dbcontext.bill.Any(b => b.AppointmentId == id);
        //    return Ok(new { billexists = exists });
        //}

        [HttpGet("bill")]
        public IActionResult GetAllBills()
        {
            return Ok(_dbcontext.bill.ToList());
        }

        [HttpGet("billbyid/{appointmentId}")]
        public IActionResult CheckBillExists(int appointmentId)
        {
            var billExists = _dbcontext.bill.Any(b => b.AppointmentId == appointmentId);
            return Ok(new { exists = billExists });
        }

        [HttpPost("create-bill")]
        public IActionResult CreateBill([FromBody] Bill bill)
        {
            if (_dbcontext.bill.Any(b => b.AppointmentId == bill.AppointmentId))
                return BadRequest("Bill already exists.");

            _dbcontext.bill.Add(bill);
            _dbcontext.SaveChanges();
            return Ok("Bill created.");
        }

        [HttpPut("update-bill-status/{id}")]
        public IActionResult UpdateBillStatus(int id, [FromBody] Bill updatedBill)
        {
            var bill = _dbcontext.bill.FirstOrDefault(b => b.AppointmentId == id);
            if (bill == null)
                return NotFound();

            bill.billstatus = updatedBill.billstatus;
            Console.WriteLine($"Updating AppointmentId {id} to status: {updatedBill.billstatus}");

            _dbcontext.SaveChanges();
            return Ok("Bill status updated.");
        }

        [HttpGet("get-bill/{appointmentId}")]
        public IActionResult GetBillByAppointmentId(int appointmentId)
        {
            var bill = _dbcontext.bill.FirstOrDefault(b => b.AppointmentId == appointmentId);
            if (bill == null) return NotFound();
            return Ok(bill);
        }




        //book appointment

        //[HttpPost("book")]
        //public async Task<IActionResult> BookAppointment([FromBody] BookAppointmentDto dto)
        //{
        //    var availability = await _dbcontext.DoctorAvailabilities
        //        .FirstOrDefaultAsync(a =>
        //            a.DoctorId == dto.DoctorId &&
        //            dto.AppointmentDate.Date >= a.StartDate.Date &&
        //            dto.AppointmentDate.Date <= a.EndDate.Date);

        //    if (availability == null)
        //        return BadRequest("Doctor is not available on this date.");

        //    if (dto.StartTime < availability.StartTime || dto.StartTime >= availability.EndTime)
        //        return BadRequest("Start time is outside the available window.");

        //    var existing = await _dbcontext.appointments.FirstOrDefaultAsync(a =>
        //        a.DoctorId == dto.DoctorId &&
        //        a.AppointmentDate == dto.AppointmentDate &&
        //        a.StartTime == dto.StartTime);

        //    if (existing != null)
        //        return Conflict("This time slot is already booked.");

        //    var appointment = new Appointment
        //    {
        //        DoctorId = dto.DoctorId,
        //        PatientId = dto.PatientId,
        //        AppointmentDate = dto.AppointmentDate,
        //        StartTime = dto.StartTime,
        //        EndTime = dto.StartTime.Add(TimeSpan.FromMinutes(15)) // default slot
        //    };

        //    _dbcontext.appointments.Add(appointment);
        //    await _dbcontext.SaveChangesAsync();

        //    return Ok("Appointment booked successfully.");
        //}


        //[HttpGet("slots")]
        //public async Task<IActionResult> GetAvailableSlots(int doctorId, DateTime date)
        //{
        //    // Find the doctor's availability for that day
        //    var availability = await _dbcontext.DoctorAvailabilities
        //        .FirstOrDefaultAsync(a =>
        //            a.DoctorId == doctorId &&
        //            date.Date >= a.StartDate.Date &&
        //            date.Date <= a.EndDate.Date);

        //    if (availability == null)
        //        return Ok(new List<string>()); // No availability

        //    // Generate all possible 15-min slots within availability range
        //    var start = availability.StartTime;
        //    var end = availability.EndTime;
        //    var slots = new List<string>();

        //    while (start + TimeSpan.FromMinutes(15) <= end)
        //    {
        //        slots.Add(start.ToString(@"hh\:mm")); // convert to "HH:mm" string
        //        start = start.Add(TimeSpan.FromMinutes(15 + availability.BufferAfter)); // include buffer
        //    }

        //    // Get existing appointments for that doctor on that day
        //    var bookedSlots = await _dbcontext.appointments
        //        .Where(a => a.DoctorId == doctorId && a.AppointmentDate.Date == date.Date)
        //        .Select(a => a.StartTime.ToString(@"hh\:mm"))
        //        .ToListAsync();

        //    // Filter out booked slots
        //    var availableSlots = slots.Except(bookedSlots).ToList();

        //    return Ok(availableSlots);
        //}

        [HttpGet("Get-available-slots/{doctorId}/{date}")]
        public IActionResult GetAvailableSlots(int doctorId, DateTime date)
        {
            var availability = _dbcontext.DoctorAvailability
                .FirstOrDefault(a =>
                    a.DoctorId == doctorId &&
                    a.StartDate.Date <= date.Date &&
                    a.EndDate.Date >= date.Date);

            if (availability == null)
            {
                return Ok(new List<object>());
            }

            var slots = new List<object>();
            var startTime = availability.StartTime;
            var endTime = availability.EndTime;
            var bufferAfter = availability.BufferAfter;
            var current = startTime;

            while (current < endTime)
            {
                // Check if this slot is already booked
                bool isBooked = _dbcontext.appointments.Any(a =>
                    a.DoctorId == doctorId &&
                    a.AppointmentDate.Date == date.Date &&
                    a.StartTime == current &&
                    a.Status != "Cancel" // exclude cancelled appointments
                );

                slots.Add(new
                {
                    time = current.ToString(@"hh\:mm"),
                    isBooked = isBooked
                });

                current = current + TimeSpan.FromMinutes(15 + bufferAfter);
            }

            return Ok(slots);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Receptionist>> GetReceptionist(int id)
        {
            var receptionist = await _dbcontext.Receptionists.FindAsync(id);
            if (receptionist == null)
            {
                return NotFound("Receptionist not found.");
            }
            return receptionist;
        }

        [HttpPut("availabilitystatus/{receptionistId}")]
        public async Task<IActionResult> UpdateAvailabilityStatus(int receptionistId, [FromBody] Receptionist request)
        {
            if (request == null || string.IsNullOrEmpty(request.Availability))
                return BadRequest("Invalid status.");

            var receptionist = await _dbcontext.Receptionists.FindAsync(receptionistId);
            if (receptionist == null)
                return NotFound("Receptionist not found.");

            receptionist.Availability = request.Availability;
            await _dbcontext.SaveChangesAsync();

            return Ok(new { message = "Availability status updated successfully." });
        }
    }
}

