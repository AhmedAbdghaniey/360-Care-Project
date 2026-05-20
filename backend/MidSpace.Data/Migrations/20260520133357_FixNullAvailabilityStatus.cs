using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MidSpace.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixNullAvailabilityStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE Doctors SET AvailabilityStatus = 'Available' WHERE AvailabilityStatus IS NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE Doctors SET AvailabilityStatus = NULL WHERE AvailabilityStatus = 'Available'");
        }
    }
}
