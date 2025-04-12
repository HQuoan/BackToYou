using Auth.API.Models;
using BuildingBlocks.Utilities;
using Microsoft.AspNetCore.Identity;

namespace Auth.API.Data;

public class RoleInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        string[] roles = { SD.CustomerRole, SD.AdminRole };

        foreach (var role in roles)
        {
            // Kiểm tra xem role đã tồn tại chưa
            if (!await roleManager.RoleExistsAsync(role))
            {
                // Tạo role nếu chưa tồn tại
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // Create default admin user
        var adminEmail = "admin@gmail.com";


        var adminUserFromDb = await userManager.FindByEmailAsync(adminEmail);
        if (adminUserFromDb == null)
        {
            ApplicationUser adminUser = new()
            {
                Id = "4986f53c-a2db-4b71-80df-404bcad5413a",
                UserName = adminEmail,
                FullName = "Admin",
                Email = adminEmail,
                Avatar = null,
                NormalizedEmail = adminEmail.ToUpper(),
                Sex = SD.Male,
                DateOfBirth = DateTime.UtcNow,
                EmailConfirmed = true,
            };

            var result = await userManager.CreateAsync(adminUser, "Admin@123");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, SD.AdminRole);
            }
            else
            {
                throw new Exception("Failed to create admin user.");
            }
        }
    }
}
