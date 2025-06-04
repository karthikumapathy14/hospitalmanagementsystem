using hospital.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace hospital.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IEmailService _emailService;

        public AccountController(UserManager<IdentityUser> userManager, IEmailService emailService)
        {
            _userManager = userManager;
            _emailService = emailService;
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotpasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return BadRequest("User not found");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = Uri.EscapeDataString(token);

            // 👇 Correct reset URL generation
            var resetUrl = $"{model.ClientURL}?token={encodedToken}&email={Uri.EscapeDataString(user.Email)}";
            var emailBody = $"Click <a href='{resetUrl}'>here</a> to reset your password.";

            await _emailService.SendEmailAsync(user.Email, "Reset Your Password", emailBody);
            return Ok("Reset password link sent.");
        }


        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return BadRequest("User not found");

            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
            return result.Succeeded ? Ok("Password reset successful") : BadRequest("Reset failed");
        }
    }
}
