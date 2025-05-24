using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hospital.Migrations
{
    /// <inheritdoc />
    public partial class add : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NurseId",
                table: "appointments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_appointments_NurseId",
                table: "appointments",
                column: "NurseId");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_Nurses_NurseId",
                table: "appointments",
                column: "NurseId",
                principalTable: "Nurses",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_Nurses_NurseId",
                table: "appointments");

            migrationBuilder.DropIndex(
                name: "IX_appointments_NurseId",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "NurseId",
                table: "appointments");
        }
    }
}
