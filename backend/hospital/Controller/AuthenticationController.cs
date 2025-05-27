﻿using hospital.Data;
using hospital.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Numerics;
using System.Security.Claims;
using System.Text;

namespace hospital.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly Applicationdbcontext _dbcontext;
        private readonly IConfiguration _configuration;

        public AuthenticationController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, Applicationdbcontext dbcontext, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _dbcontext = dbcontext;
            _configuration = configuration;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(User model)
        {
            var user = new User { UserName = model.UserName, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.PasswordHash);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            //create role if its not there
            if (!await _roleManager.RoleExistsAsync(model.Role))
            {
                var roleResult = await _roleManager.CreateAsync(new IdentityRole(model.Role));
                if (!roleResult.Succeeded)
                {
                    return BadRequest(roleResult.Errors);
                }
            }

            var addToRoleResult = await _userManager.AddToRoleAsync(user, model.Role);

            if (!addToRoleResult.Succeeded)
            {
                return BadRequest(addToRoleResult.Errors);
            }

            if (model.Role == "Doctor")
            {
                var doctor = new Doctor
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = "Doctor"
                };
                _dbcontext.Doctors.Add(doctor);
                await _dbcontext.SaveChangesAsync();
            }
        
            else if (model.Role == "Nurse")
            {
                var nurse = new Nurse
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = "Nurse"
                };
                _dbcontext.Nurses.Add(nurse);
                await _dbcontext.SaveChangesAsync();
            }
            else if (model.Role == "Receptionist")
            {
                var receptionist = new Receptionist
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = "Receptionist"
                };
                _dbcontext.Receptionists.Add(receptionist);
                await _dbcontext.SaveChangesAsync();
            }
            else if (model.Role == "Admin")
            {
                var admin = new Admin
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = "Admin"
                };
                _dbcontext.Admins.Add(admin);
                await _dbcontext.SaveChangesAsync();
            }
            return Ok("User registered successfully!");
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                var roles = await _userManager.GetRolesAsync(user);

                // Initialize claims early
                var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, roles.FirstOrDefault() ?? "User")
        };
               

                // Add all roles
                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }

                // Doctor-specific logic
                if (roles.Contains("Doctor"))
                {
                    var doctor = await _dbcontext.Doctors.FirstOrDefaultAsync(d => d.Email == loginDto.Email);

                    if (doctor == null)
                        return Unauthorized("Doctor record not found.");

                    if (!doctor.status)
                        return BadRequest("Your account is inactive. Contact admin.");

                    // ✅ Add doctorId as custom claim
                    claims.Add(new Claim("DoctorId", doctor.Id.ToString()));
                }

                // Nurse check
                else if (roles.Contains("Nurse"))
                {
                    var nurse = await _dbcontext.Nurses.FirstOrDefaultAsync(n => n.Email == loginDto.Email);
                    if (nurse == null)
                        return Unauthorized("Nurse record not found.");
                    if (!nurse.status)
                        return BadRequest("Your account is inactive. Contact admin.");
                    claims.Add(new Claim("NurseId", nurse.Id.ToString()));
                }

                // Receptionist check
                else if (roles.Contains("Receptionist"))
                {
                    var receptionist = await _dbcontext.Receptionists.FirstOrDefaultAsync(r => r.Email == loginDto.Email);
                    if (receptionist == null)
                        return Unauthorized("Receptionist record not found.");
                    if (!receptionist.status)
                        return BadRequest("Your account is inactive. Contact admin.");
                }

                // Generate token
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secretkey"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.Now.AddHours(1),
                    signingCredentials: creds
                );

                // Extract doctorId if available
                string doctorId = claims.FirstOrDefault(c => c.Type == "DoctorId")?.Value;
                string nurseId = claims.FirstOrDefault(c => c.Type == "NurseId")?.Value;

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo,
                    nurseID=nurseId,
                    doctorID = doctorId // optional: frontend can store/use if needed
                });
            }
            return Unauthorized("Invalid email or password");
        }
    }
}