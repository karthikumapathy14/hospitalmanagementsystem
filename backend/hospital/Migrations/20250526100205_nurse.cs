using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hospital.Migrations
{
    /// <inheritdoc />
    public partial class nurse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Nurses_Doctors_DoctorId",
                table: "Nurses");

            migrationBuilder.DropIndex(
                name: "IX_Prescription_AppointmentId",
                table: "Prescription");

            migrationBuilder.DropIndex(
                name: "IX_Nurses_DoctorId",
                table: "Nurses");

            migrationBuilder.DropColumn(
                name: "DoctorId",
                table: "Nurses");

            migrationBuilder.CreateIndex(
                name: "IX_Prescription_AppointmentId",
                table: "Prescription",
                column: "AppointmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Prescription_AppointmentId",
                table: "Prescription");

            migrationBuilder.AddColumn<int>(
                name: "DoctorId",
                table: "Nurses",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Prescription_AppointmentId",
                table: "Prescription",
                column: "AppointmentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nurses_DoctorId",
                table: "Nurses",
                column: "DoctorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Nurses_Doctors_DoctorId",
                table: "Nurses",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "Id");
        }
    }
}
