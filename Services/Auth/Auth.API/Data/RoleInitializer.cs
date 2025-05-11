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
                ShortName = "admin",
                Email = adminEmail,
                Avatar = null,
                NormalizedEmail = adminEmail.ToUpper(),
                Sex = SD.Male,
                DateOfBirth = DateTime.Now,
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

        // Create default customer user
        var customerEmail = "user@gmail.com";

        var customerUserFromDb = await userManager.FindByEmailAsync(customerEmail);
        if (customerUserFromDb == null)
        {
            ApplicationUser customerUser = new()
            {
                Id = "6a2e79a1-2bdf-4b9f-901b-8c9280de9e99",
                UserName = customerEmail,
                FullName = "Default User",
                ShortName = "user",
                Email = customerEmail,
                Avatar = null,
                NormalizedEmail = customerEmail.ToUpper(),
                Sex = SD.Male,
                DateOfBirth = DateTime.Now,
                EmailConfirmed = true,
            };

            var result = await userManager.CreateAsync(customerUser, "User@123");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(customerUser, SD.CustomerRole);
            }
            else
            {
                throw new Exception("Failed to create customer user.");
            }
        }

    }
}
