using hospital.Data;
using hospital.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations.Operations;

namespace hospital.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly Applicationdbcontext _dbcontext;

        public AdminController(Applicationdbcontext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        [HttpGet("docGetAll")]
        public async Task<IActionResult> GetAllDoctors()
        {
            var doctors = await _dbcontext.Doctors
                .Include(d => d.Department) // Join Department table
                .Select(d => new
                {
                    d.Id,
                    d.UserName,
                    d.Email,
                    d.Role,
                    d.PhoneNo,
                    d.Qualification,
                    d.Experience,
                    d.Address,
                    d.status,
                    d.Availability,
                    d.DepartmentId,
                    DepartmentName = d.Department != null ? d.Department.DepartmentName : "Not Provided"
                })
                .ToListAsync();

            return Ok(doctors);
        }



        [HttpGet("docGetbyid/{id}")]
        public async Task<IActionResult> Getid(int id)
        {
            var docid = await _dbcontext.Doctors.FindAsync(id);
            if (docid == null) return BadRequest("Doctor Not Found");
            return Ok(docid);
        }



     

        [HttpPut("docedit/{id}")]
        public async Task<IActionResult> Edit(int id, Doctor doctor)
        {
            var docid = await _dbcontext.Doctors.FindAsync(id);
            if (docid == null) return BadRequest("invalid id");

            if (!string.IsNullOrWhiteSpace(doctor.UserName) && doctor.UserName != "string")
                docid.UserName = doctor.UserName;

            if (!string.IsNullOrWhiteSpace(doctor.Email) && doctor.Email != "string")
                docid.Email = doctor.Email;

            if (!string.IsNullOrWhiteSpace(doctor.Role) && doctor.Role != "string")
                docid.Role = doctor.Role;

            if (!string.IsNullOrWhiteSpace(doctor.PhoneNo) && doctor.PhoneNo != "string")
                docid.PhoneNo = doctor.PhoneNo;

            if (!string.IsNullOrWhiteSpace(doctor.Qualification) && doctor.Qualification != "string")
                docid.Qualification = doctor.Qualification;

            if (!string.IsNullOrWhiteSpace(doctor.Address) && doctor.Address != "string")
                docid.Address = doctor.Address;
           

            docid.status = doctor.status;
            docid.Experience = doctor.Experience;

            if (doctor.DepartmentId != null)
                docid.DepartmentId = doctor.DepartmentId.Value;
            

            await _dbcontext.SaveChangesAsync();
            return Ok(" Updated successfully");
        }

        [HttpDelete("docdelete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var docid = await _dbcontext.Doctors.FindAsync(id);

            if (docid == null) return NotFound();

            _dbcontext.Doctors.Remove(docid);
            _dbcontext.SaveChanges();

            return Ok();
        }

        [HttpPost("create-dept")]
        public async Task<IActionResult> Department(Department department)
        {
            await _dbcontext.Departments.AddAsync(department);
            await _dbcontext.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("get-dept")]
        public async Task<IActionResult> Departmentget()
        {
            var dep = await _dbcontext.Departments.ToListAsync();
       
            return Ok(dep);
        }

        [HttpGet("getdeptbyid/{id}")]
        public async Task<IActionResult> Departmentid(int id)
        {
            var depid = await _dbcontext.Departments.FindAsync(id);
            if (depid == null) return BadRequest("No Department Found");
            return Ok(depid);
        }

        //nurse

        [HttpGet("getnurse")]
        public async Task<IActionResult> getNurse()
        {
           var  getNurse = await _dbcontext.Nurses.ToListAsync();

            return Ok(getNurse);
        }

      
        [HttpGet("getbyid-nurse/{id}")]
        public async Task<IActionResult> GetidNurse(int id)
        {
            var nurseid=await _dbcontext.Nurses.FindAsync(id);
            if(nurseid==null) return BadRequest("Nurse Not Found");
            return Ok(nurseid);
        }

        [HttpPut("edit-Nurse/{id}")]
        public async Task<IActionResult> EditNurse(int id, Nurse nurse)
        {
            var nurseid = await _dbcontext.Nurses.FindAsync(id);
            if (nurseid == null) return BadRequest("Nurse Not Found");

            if(!string.IsNullOrWhiteSpace(nurse.Email) && nurse.Email!="string")
                nurseid.Email = nurse.Email;
            if(!string.IsNullOrWhiteSpace(nurse.UserName)&& nurse.UserName!="string")
                nurseid.UserName = nurse.UserName;
            if(!string.IsNullOrWhiteSpace(nurse.Address)&& nurse.Address!="string")
                nurseid.Address = nurse.Address;
            if(!string.IsNullOrWhiteSpace(nurse.PhoneNo)&& nurse.PhoneNo!="string")
                nurseid.PhoneNo = nurse.PhoneNo;
           
                nurseid.status = nurse.status;
            nurseid.Experience = nurse.Experience;

            if (!string.IsNullOrWhiteSpace(nurse.Role) && nurse.Role != "string")
                nurseid.Role = nurse.Role;

            await _dbcontext.SaveChangesAsync();
            return Ok("Updated Successfully");
        }

        [HttpDelete("delete-nurse/{id}")]
        public async Task<IActionResult> DeleteNurse(int id)
        {
            var nurseid = await _dbcontext.Nurses.FindAsync(id);
             _dbcontext.Nurses.Remove(nurseid);
            await _dbcontext.SaveChangesAsync();
            return Ok("Deleted Successfully");
        }

        //Receptionist
        [HttpGet("get-receptionist")]
        public async Task<IActionResult> GetReceptionist()
        {
           var nurse =  await _dbcontext.Receptionists.ToListAsync();
            return Ok(nurse);
        }

        [HttpGet("getbyid-receptionist/{id}")]
        public async Task<IActionResult> GetReception(int id)
        {
            var receptionid = await _dbcontext.Receptionists.FindAsync(id);
            if (receptionid == null) return BadRequest("Receptionist not found");
            return Ok(receptionid);
        }
        [HttpPut("edit-repceptionist/{id}")]
        public async Task<IActionResult> EditReceptionits(int id,Receptionist receptionist)
        {
            var rid = await _dbcontext.Receptionists.FindAsync(id);
            if (rid == null) return BadRequest("invalid id");
            if (!string.IsNullOrWhiteSpace(receptionist.UserName) && receptionist.UserName != "string")
                rid.UserName = receptionist.UserName;
            if (!string.IsNullOrWhiteSpace(receptionist.Email) && receptionist.Email != "string")
                rid.Email = receptionist.Email;
            if (!string.IsNullOrWhiteSpace(receptionist.PhoneNo) && receptionist.PhoneNo != "string")
                rid.PhoneNo = receptionist.PhoneNo;
            if (!string.IsNullOrWhiteSpace(receptionist.Address) && receptionist.Address != "string")
                rid.Address = receptionist.Address;
            rid.status = receptionist.status;
            rid.Experience = receptionist.Experience;

            await _dbcontext.SaveChangesAsync();
            return Ok("Updated Successfully");
        }

        [HttpDelete("delete-receptionist/{id}")]
        public async Task<IActionResult> DeleteReceptionist(int id)
        {
            var rid = await _dbcontext.Receptionists.FindAsync(id);
            if (rid == null) return BadRequest("invalid id");
            _dbcontext.Receptionists.Remove(rid);
            _dbcontext.SaveChanges();

            return Ok("Delete successfully");
        }


        //dashboard

        [HttpGet("totaldoctors")]
        public IActionResult GetTotalDoctors()
        {
            int count = _dbcontext.Doctors.Count();
            return Ok(count);
        }

        [HttpGet("totalpatients")]
        public IActionResult GetTotalPatients()
        {
            int count = _dbcontext.Patients.Count();
            return Ok(count);
        }
        [HttpGet("totalnurses")]
        public IActionResult GetTotalNurses()
        {
            int count = _dbcontext.Nurses.Count();
            return Ok(count);
        }
        [HttpGet("totalreceptionist")]
        public IActionResult GetTotalReceptionist()
        {
            int count = _dbcontext.Receptionists.Count();
            return Ok(count);
        }

        [HttpGet("totalappointments")]
        public IActionResult GetTotalAppointments()
        {
            int count = _dbcontext.appointments.Count();
            return Ok(count);
        }
        [HttpGet("today-appointments")]
        public IActionResult GettodayAppointment()
        {
            DateOnly today = DateOnly.FromDateTime(DateTime.Today);

            int count = _dbcontext.appointments
                .Count(a => DateOnly.FromDateTime(a.AppointmentDate) == today);

            return Ok(count);
        }

        [HttpGet("getdaywisereport")]
        public IActionResult GetDaywiseReport()
        {
            var result = _dbcontext.appointments
         .GroupBy(a => a.AppointmentDate)
         .Select(g => new {
             Date = g.Key,
             Count = g.Count()
         }).OrderBy(x => x.Date).ToList();

            return Ok(result);
        }

        [HttpGet("gettodaystatusreport")]
        public IActionResult GetTodayStatusReport()
        {
           

            DateTime today = DateTime.Today;
            var statusCounts = _dbcontext.appointments
                .Where(a => a.AppointmentDate == today) 
                .GroupBy(a => a.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToList();

            var result = new
            {
                Complete = statusCounts.FirstOrDefault(s => s.Status == "Complete")?.Count ?? 0,
                Pending = statusCounts.FirstOrDefault(s => s.Status == "Pending")?.Count ?? 0,
                Scheduled = statusCounts.FirstOrDefault(s => s.Status == "Scheduled")?.Count ?? 0
            };

            return Ok(result);
        }

        [HttpGet("getdocavailablecount")]
        public async Task<IActionResult> getdocavailablecount()
        {
           var getdocavailablecount = await _dbcontext.Doctors.Where(d => d.Availability == "Available").CountAsync();

            return Ok(getdocavailablecount);
        }

        [HttpGet("getnurseavailablecount")]
        public async Task<IActionResult> getnurseavailablecount()
        {
            var getnurseavailablecount = await _dbcontext.Nurses.Where(d=>d.Availability=="Available").CountAsync();

            return Ok(getnurseavailablecount);
        }

        [HttpGet("getrecavailablecount")]
        public async Task<IActionResult> getrecavailablecount()
        {
            var getrecavailablecount = await _dbcontext.Receptionists.Where(d => d.Availability == "Available").CountAsync();

            return Ok(getrecavailablecount);
        }

      

[HttpGet("getdocavailabledetails")]
    public async Task<IActionResult> GetDocAvailableDetails()
    {
        var doctorDetails = await _dbcontext.Doctors
            .Include(d => d.Department) 
            .ToListAsync();

        return Ok(doctorDetails);
    }


    [HttpGet("getnurseavailabledetials")]

        public async Task<IActionResult> getnurseavailabledetials()
        {
            var getnurseavailabledetials = await _dbcontext.Nurses.ToListAsync();

            return Ok(getnurseavailabledetials);
        }

        [HttpGet("getrecavailabledetials")]

        public async Task<IActionResult> getrecavailabledetials ()
        {
            var getrecavailabledetials = await _dbcontext.Receptionists.ToListAsync();

            return Ok(getrecavailabledetials);
        }
    
        [HttpGet("departments")]
        public async Task<ActionResult<IEnumerable<object>>> GetDepartments()
        {
            var departments = await _dbcontext.Departments
                .Where(d => !string.IsNullOrEmpty(d.DepartmentName))
                .Select(d => new { d.Id, d.DepartmentName }) 
                .Distinct()
                .ToListAsync();

            return Ok(departments);
        }


        [HttpGet("emailsbydepartment")]
        public async Task<ActionResult<IEnumerable<string>>> GetEmailsByDepartment([FromQuery] int department)
        {
           
            var emails = await _dbcontext.Doctors
                .Include(d => d.Department) // ensure this line is present!
                .Where(d => d.Department != null &&
                            d.Department.Id == department &&
                            !string.IsNullOrEmpty(d.Email))
                .Select(d => d.Email)
                .ToListAsync();

            return Ok(emails);
        }


        [HttpGet("GetStaffDetailsByRoleAndId/{role}/{id}")]
        public async Task<IActionResult> GetStaffDetailsByRoleAndId(string role, int id)
        {
            if (string.IsNullOrEmpty(role))
                return BadRequest("Role is required.");

            role = role.ToLower();

            switch (role)
            {
                case "doctor":
                    var doctor = await _dbcontext.Doctors
                        .Include(d => d.Department)
                        .FirstOrDefaultAsync(d => d.Id == id);
                    if (doctor == null) return NotFound("Doctor not found");
                    return Ok(doctor);

                case "nurse":
                    var nurse = await _dbcontext.Nurses
                        .FirstOrDefaultAsync(n => n.Id == id);
                    if (nurse == null) return NotFound("Nurse not found");
                    return Ok(nurse);

                case "receptionist":
                    var receptionist = await _dbcontext.Receptionists
                        .FirstOrDefaultAsync(r => r.Id == id);
                    if (receptionist == null) return NotFound("Receptionist not found");
                    return Ok(receptionist);

                default:
                    return BadRequest("Invalid role provided.");
            }
        }
    }
}
