using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hospital.Migrations
{
    /// <inheritdoc />
    public partial class mig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AppointmentTime",
                table: "appointments",
                newName: "StartTime");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "appointments");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "appointments",
                newName: "AppointmentTime");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "AppointmentDate",
                table: "appointments",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");
        }
    }
}
