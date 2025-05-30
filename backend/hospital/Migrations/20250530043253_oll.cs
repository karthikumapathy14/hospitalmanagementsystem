using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hospital.Migrations
{
    /// <inheritdoc />
    public partial class oll : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BillStatus",
                table: "appointments");

            migrationBuilder.AddColumn<string>(
                name: "billstatus",
                table: "bill",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "billstatus",
                table: "bill");

            migrationBuilder.AddColumn<string>(
                name: "BillStatus",
                table: "appointments",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
