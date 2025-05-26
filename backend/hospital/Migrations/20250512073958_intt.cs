using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hospital.Migrations
{
    /// <inheritdoc />
    public partial class intt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_Departments_DepartmentId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_appointments_Doctors_DoctorId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_appointments_Patients_PatientId",
                table: "appointments");

            migrationBuilder.AlterColumn<int>(
                name: "PatientId",
                table: "appointments",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "DoctorId",
                table: "appointments",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "DepartmentId",
                table: "appointments",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_Departments_DepartmentId",
                table: "appointments",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_Doctors_DoctorId",
                table: "appointments",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_Patients_PatientId",
                table: "appointments",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_Departments_DepartmentId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_appointments_Doctors_DoctorId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_appointments_Patients_PatientId",
                table: "appointments");

            migrationBuilder.AlterColumn<int>(
                name: "PatientId",
                table: "appointments",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DoctorId",
                table: "appointments",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DepartmentId",
                table: "appointments",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_Departments_DepartmentId",
                table: "appointments",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_Doctors_DoctorId",
                table: "appointments",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_Patients_PatientId",
                table: "appointments",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
