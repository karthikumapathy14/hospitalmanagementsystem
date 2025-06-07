using System.Net.Mail;
using System.Net;

namespace hospital
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
        Task SendBulkEmailAsync(List<string> toEmails, string subject, string message);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var smtpSettings = _config.GetSection("SmtpSettings");
            var smtp = new SmtpClient
            {
                Host = smtpSettings["Host"],
                Port = int.Parse(smtpSettings["Port"]),
                EnableSsl = bool.Parse(smtpSettings["EnableSsl"]),
                Credentials = new NetworkCredential(smtpSettings["SenderEmail"], smtpSettings["SenderPassword"])
            };

            using var message = new MailMessage(smtpSettings["SenderEmail"], toEmail, subject, body)
            {
                IsBodyHtml = true
            };

            await smtp.SendMailAsync(message);
        }

        public async Task SendBulkEmailAsync(List<string> toEmails, string subject, string message)
        {
            var smtpSettings = _config.GetSection("SmtpSettings");
            var smtp = new SmtpClient
            {
                Host = smtpSettings["Host"],
                Port = int.Parse(smtpSettings["Port"]),
                EnableSsl = bool.Parse(smtpSettings["EnableSsl"]),
                Credentials = new NetworkCredential(smtpSettings["SenderEmail"], smtpSettings["SenderPassword"])
            };

            using var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpSettings["SenderEmail"]),
                Subject = subject,
                Body = message,
                IsBodyHtml = true
            };

            foreach (var toEmail in toEmails)
            {
                mailMessage.Bcc.Add(toEmail);
            }

            await smtp.SendMailAsync(mailMessage);
        }
    }

}

