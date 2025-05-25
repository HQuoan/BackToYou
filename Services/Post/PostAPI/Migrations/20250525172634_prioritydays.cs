using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PostAPI.Migrations
{
    /// <inheritdoc />
    public partial class prioritydays : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PriorityDays",
                table: "Posts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PriorityStartAt",
                table: "Posts",
                type: "datetime2",
                nullable: true);

            migrationBuilder.InsertData(
                table: "PostSettings",
                columns: new[] { "PostSettingId", "Name", "Value" },
                values: new object[] { new Guid("0cd8b6b5-f668-4bc8-8508-073e71734f72"), "Priority_Days", "7" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "PostSettings",
                keyColumn: "PostSettingId",
                keyValue: new Guid("0cd8b6b5-f668-4bc8-8508-073e71734f72"));

            migrationBuilder.DropColumn(
                name: "PriorityDays",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "PriorityStartAt",
                table: "Posts");
        }
    }
}
