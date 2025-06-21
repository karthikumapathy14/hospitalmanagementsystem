using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hospital.Migrations
{
    /// <inheritdoc />
    public partial class ins : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Experience",
                table: "Receptionists",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Experience",
                table: "Nurses",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Experience",
                table: "Doctors",
                newName: "Name");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Receptionists",
                newName: "Experience");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Nurses",
                newName: "Experience");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Doctors",
                newName: "Experience");
        }
    }
}
