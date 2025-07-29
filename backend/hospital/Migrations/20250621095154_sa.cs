using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hospital.Migrations
{
    /// <inheritdoc />
    public partial class sa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorAvailabilities_Doctors_DoctorId",
                table: "DoctorAvailabilities");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DoctorAvailabilities",
                table: "DoctorAvailabilities");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Receptionists");

            migrationBuilder.DropColumn(
                name: "Diagnosis",
                table: "Prescription");

            migrationBuilder.DropColumn(
                name: "Medications",
                table: "Prescription");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Prescription");

            migrationBuilder.DropColumn(
                name: "PrescribedDate",
                table: "Prescription");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Nurses");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "AspNetUsers");

            migrationBuilder.RenameTable(
                name: "DoctorAvailabilities",
                newName: "DoctorAvailability");

            migrationBuilder.RenameIndex(
                name: "IX_DoctorAvailabilities_DoctorId",
                table: "DoctorAvailability",
                newName: "IX_DoctorAvailability_DoctorId");

            migrationBuilder.AddColumn<int>(
                name: "Experience",
                table: "Receptionists",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Experience",
                table: "Nurses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Experience",
                table: "Doctors",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_DoctorAvailability",
                table: "DoctorAvailability",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "PrescriptionDays",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DayNumber = table.Column<int>(type: "int", nullable: false),
                    PrescribedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
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

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorAvailability_Doctors_DoctorId",
                table: "DoctorAvailability",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorAvailability_Doctors_DoctorId",
                table: "DoctorAvailability");

            migrationBuilder.DropTable(
                name: "PrescriptionDays");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DoctorAvailability",
                table: "DoctorAvailability");

            migrationBuilder.DropColumn(
                name: "Experience",
                table: "Receptionists");

            migrationBuilder.DropColumn(
                name: "Experience",
                table: "Nurses");

            migrationBuilder.DropColumn(
                name: "Experience",
                table: "Doctors");

            migrationBuilder.RenameTable(
                name: "DoctorAvailability",
                newName: "DoctorAvailabilities");

            migrationBuilder.RenameIndex(
                name: "IX_DoctorAvailability_DoctorId",
                table: "DoctorAvailabilities",
                newName: "IX_DoctorAvailabilities_DoctorId");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Receptionists",
                type: "nvarchar(max)",
                nullable: true);

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

            migrationBuilder.AddColumn<DateTime>(
                name: "PrescribedDate",
                table: "Prescription",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Nurses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Doctors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_DoctorAvailabilities",
                table: "DoctorAvailabilities",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorAvailabilities_Doctors_DoctorId",
                table: "DoctorAvailabilities",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
