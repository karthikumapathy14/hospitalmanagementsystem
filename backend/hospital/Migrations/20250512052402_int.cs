using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hospital.Migrations
{
    /// <inheritdoc />
    public partial class @int : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "appointments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_appointments_DepartmentId",
                table: "appointments",
                column: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_Departments_DepartmentId",
                table: "appointments",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_Departments_DepartmentId",
                table: "appointments");

            migrationBuilder.DropIndex(
                name: "IX_appointments_DepartmentId",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "appointments");
        }
    }
}
