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

        //[HttpGet("docGetAll")]
        //public async Task<IActionResult> Getall()
        //{
        //    var getall = await _dbcontext.Doctors.ToListAsync();

        //    return Ok(getall);
        //}
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
                    d.Address,
                    d.status,
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



        //[HttpPost("doccreate-doc")]
        //public async Task<IActionResult> Create(Doctor doctor)
        //{
        //    var create = await _dbcontext.Doctors.AddAsync(doctor);
        //    _dbcontext.SaveChanges();
        //    return Ok(create);

        //}

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

        //[HttpPost("create-nurse")]
        //public async Task<IActionResult> createNurse(Nurse nurse)
        //{
        //    await _dbcontext.Nurses.AddAsync(nurse);
        //    await _dbcontext.SaveChangesAsync();
        //    return Ok();
        //}

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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      
=======
            
>>>>>>> Stashed changes
=======
            
>>>>>>> Stashed changes
=======

>>>>>>> Stashed changes
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
    }
}
