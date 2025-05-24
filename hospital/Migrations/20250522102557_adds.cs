using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hospital.Migrations
{
    /// <inheritdoc />
    public partial class adds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Prescribedby",
                table: "Prescription",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Prescription_Prescribedby",
                table: "Prescription",
                column: "Prescribedby");

            migrationBuilder.AddForeignKey(
                name: "FK_Prescription_Doctors_Prescribedby",
                table: "Prescription",
                column: "Prescribedby",
                principalTable: "Doctors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Prescription_Doctors_Prescribedby",
                table: "Prescription");

            migrationBuilder.DropIndex(
                name: "IX_Prescription_Prescribedby",
                table: "Prescription");

            migrationBuilder.AlterColumn<string>(
                name: "Prescribedby",
                table: "Prescription",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
