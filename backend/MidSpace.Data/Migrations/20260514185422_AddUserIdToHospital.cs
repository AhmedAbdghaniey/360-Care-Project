using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MidSpace.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIdToHospital : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Hospitals",
                type: "int",
                nullable: true,
                defaultValue: null);

            migrationBuilder.CreateIndex(
                name: "IX_Hospitals_UserId",
                table: "Hospitals",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Hospitals_Users_UserId",
                table: "Hospitals",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Hospitals_Users_UserId",
                table: "Hospitals");

            migrationBuilder.DropIndex(
                name: "IX_Hospitals_UserId",
                table: "Hospitals");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Hospitals");
        }
    }
}
