using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hospital.Migrations
{
    /// <inheritdoc />
    public partial class table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {


            migrationBuilder.CreateTable(
         name: "DoctorAvailability",
         columns: table => new
         {
             Id = table.Column<int>(type: "int", nullable: false)
                 .Annotation("SqlServer:Identity", "1, 1"),
             StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
             EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
             StartTime = table.Column<TimeSpan>(type: "time", nullable: false),
             EndTime = table.Column<TimeSpan>(type: "time", nullable: false),
             BufferBefor = table.Column<int>(type: "int", nullable: false),
             BufferAfter = table.Column<int>(type: "int", nullable: false),
             DoctorId = table.Column<int>(type: "int", nullable: false)
         },
         constraints: table =>
         {
             table.PrimaryKey("PK_DoctorAvailability", x => x.Id);
             table.ForeignKey(
                 name: "FK_DoctorAvailability_Doctors_DoctorId",
                 column: x => x.DoctorId,
                 principalTable: "Doctors",
                 principalColumn: "Id",
                 onDelete: ReferentialAction.Cascade);
         });

            migrationBuilder.CreateIndex(
                name: "IX_DoctorAvailability_DoctorId",
                table: "DoctorAvailability",
                column: "DoctorId");

            migrationBuilder.CreateTable(
                name: "PrescriptionDays",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DayNumber = table.Column<int>(type: "int", nullable: false),
                    Diagnosis = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Medications = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    PrescriptionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrescriptionDays", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PrescriptionDays_Prescription_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescription",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionDays_PrescriptionId",
                table: "PrescriptionDays",
                column: "PrescriptionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PrescriptionDays");

            migrationBuilder.DropTable(
         name: "DoctorAvailability");

            

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "appointments");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "appointments",
                newName: "AppointmentTime");

            migrationBuilder.AddColumn<string>(
                name: "Diagnosis",
                table: "Prescription",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Medications",
                table: "Prescription",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Prescription",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "Date",
                table: "DoctorAvailability",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AlterColumn<DateOnly>(
                name: "AppointmentDate",
                table: "appointments",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.CreateTable(
                name: "AvailableSlots",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DoctoravailabilityId = table.Column<int>(type: "int", nullable: false),
                    IsBooked = table.Column<bool>(type: "bit", nullable: false),
                    SlotTime = table.Column<TimeOnly>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AvailableSlots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AvailableSlots_DoctorAvailability_DoctoravailabilityId",
                        column: x => x.DoctoravailabilityId,
                        principalTable: "DoctorAvailability",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AvailableSlots_DoctoravailabilityId",
                table: "AvailableSlots",
                column: "DoctoravailabilityId");
        }
    }
}
