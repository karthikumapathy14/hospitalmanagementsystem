using Microsoft.AspNetCore.Identity;

namespace hospital.Model
{
    public class User:IdentityUser
    {

        public string? Role { get; set; }
    }
}
