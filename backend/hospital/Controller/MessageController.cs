using hospital.Data;
using hospital.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace hospital.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly Applicationdbcontext _context;

        public MessageController(IEmailService emailService, Applicationdbcontext context)
        {
            _emailService = emailService;
            _context = context;
        }

        [HttpGet("emails")]
        public IActionResult GetEmailsByRoles([FromQuery] List<string> role)
        {
            List<string> emails = new();

            foreach (var r in role)
            {
                switch (r.ToLower())
                {
                    case "doctor":
                        emails.AddRange(_context.Doctors.Select(d => d.Email).ToList());
                        break;

                    case "nurse":
                        emails.AddRange(_context.Nurses.Select(n => n.Email).ToList());
                        break;

                    case "patient":
                        emails.AddRange(_context.Patients.Select(p => p.Email).ToList());
                        break;

                    case "admin":
                        emails.AddRange(_context.Admins.Select(a => a.Email).ToList());
                        break;

                    case "receptionist":
                        emails.AddRange(_context.Receptionists.Select(rp => rp.Email).ToList());
                        break;
                }
            }

            return Ok(emails.Distinct().ToList()); // Avoid duplicates
        }



        [HttpPost("send")]
        public async Task<IActionResult> SendBulkEmail([FromBody] BulkEmailRequest request)
        {
            if (request == null)
                return BadRequest("Request body is missing or invalid.");

            if (request.Emails == null || !request.Emails.Any())
                return BadRequest("No recipients found.");

            await _emailService.SendBulkEmailAsync(request.Emails, request.Subject, request.Message);
            return Ok("Emails sent successfully.");
        }
    }
}
