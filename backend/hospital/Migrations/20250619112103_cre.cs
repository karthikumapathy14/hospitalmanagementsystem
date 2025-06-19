using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hospital.Migrations
{
    /// <inheritdoc />
    public partial class cre : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorAvailability_Doctors_DoctorId",
                table: "DoctorAvailability");


            migrationBuilder.DropPrimaryKey(
                name: "PK_DoctorAvailability",
                table: "DoctorAvailability");

          

            migrationBuilder.RenameTable(
                name: "DoctorAvailability",
                newName: "DoctorAvailabilities");

            migrationBuilder.RenameColumn(
                name: "AppointmentTime",
                table: "appointments",
                newName: "StartTime");

            migrationBuilder.RenameIndex(
                name: "IX_DoctorAvailability_DoctorId",
                table: "DoctorAvailabilities",
                newName: "IX_DoctorAvailabilities_DoctorId");

            migrationBuilder.AddColumn<string>(
                name: "Experience",
                table: "Receptionists",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Experience",
                table: "Nurses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Experience",
                table: "Doctors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "AppointmentDate",
                table: "appointments",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "EndTime",
                table: "appointments",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<int>(
                name: "BufferAfter",
                table: "DoctorAvailabilities",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "BufferBefor",
                table: "DoctorAvailabilities",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "DoctorAvailabilities",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "DoctorAvailabilities",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorAvailabilities_Doctors_DoctorId",
                table: "DoctorAvailabilities");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DoctorAvailabilities",
                table: "DoctorAvailabilities");

            migrationBuilder.DropColumn(
                name: "Experience",
                table: "Receptionists");

            migrationBuilder.DropColumn(
                name: "Experience",
                table: "Nurses");

            migrationBuilder.DropColumn(
                name: "Experience",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "BufferAfter",
                table: "DoctorAvailabilities");

            migrationBuilder.DropColumn(
                name: "BufferBefor",
                table: "DoctorAvailabilities");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "DoctorAvailabilities");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "DoctorAvailabilities");

            migrationBuilder.RenameTable(
                name: "DoctorAvailabilities",
                newName: "DoctorAvailability");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "appointments",
                newName: "AppointmentTime");

            migrationBuilder.RenameIndex(
                name: "IX_DoctorAvailabilities_DoctorId",
                table: "DoctorAvailability",
                newName: "IX_DoctorAvailability_DoctorId");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "AppointmentDate",
                table: "appointments",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<DateOnly>(
                name: "Date",
                table: "DoctorAvailability",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddPrimaryKey(
                name: "PK_DoctorAvailability",
                table: "DoctorAvailability",
                column: "Id");

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

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorAvailability_Doctors_DoctorId",
                table: "DoctorAvailability",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
