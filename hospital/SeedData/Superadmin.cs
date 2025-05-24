using Microsoft.AspNetCore.Identity;

namespace hospital.SeedData
{
    public class Superadmin
    {
        public static async Task SeedSuperAdminAsync(IServiceProvider serviceProvider)
        {
            var rolemanager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var usermanager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();


            var roleExists = await rolemanager.RoleExistsAsync("SuperAdmin");
            if (!roleExists)
            {
                await rolemanager.CreateAsync(new IdentityRole("SuperAdmin"));
            }
            var adminuser = await usermanager.FindByEmailAsync("admin@hospital.com");
            if (adminuser == null)
            {
                var user = new IdentityUser
                {
                    UserName = "admin@hospital.com",
                    Email = "admin@hospital.com",
                    EmailConfirmed = true
                };

                var result = await usermanager.CreateAsync(user,"Admin@123");

                if (result.Succeeded)
                {
                    await usermanager.AddToRoleAsync(user,"SuperAdmin");
                }
            }

        }


    }
}
