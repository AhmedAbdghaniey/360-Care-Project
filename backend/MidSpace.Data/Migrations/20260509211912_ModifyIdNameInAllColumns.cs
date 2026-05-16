using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MidSpace.Data.Migrations
{
    /// <inheritdoc />
    public partial class ModifyIdNameInAllColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Admins_Users_AdminId",
                table: "Admins");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalAttachments_MedicalRecords_MedicalRecordRecordId",
                table: "MedicalAttachments");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "PhoneId",
                table: "UserPhones",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "RoleID",
                table: "Roles",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "PrescriptionId",
                table: "Prescriptions",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "ItemId",
                table: "PrescriptionItems",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "PatientID",
                table: "Patients",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "DiseaseID",
                table: "PatientChronicDiseases",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "AllergyID",
                table: "PatientAllergies",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "RecordId",
                table: "MedicalRecords",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "MedicalRecordRecordId",
                table: "MedicalAttachments",
                newName: "MedicalRecordId");

            migrationBuilder.RenameColumn(
                name: "AttachmentId",
                table: "MedicalAttachments",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_MedicalAttachments_MedicalRecordRecordId",
                table: "MedicalAttachments",
                newName: "IX_MedicalAttachments_MedicalRecordId");

            migrationBuilder.RenameColumn(
                name: "JobOpportunityId",
                table: "jobOpportunities",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "JobApplicationId",
                table: "JobApplications",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "HospitalId",
                table: "Hospitals",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "DrugId",
                table: "Drugs",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "DoctorId",
                table: "Doctors",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "RecommendationId",
                table: "DoctorRecommendations",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "DoctorJobRecommendationId",
                table: "DoctorJobRecommendations",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "CertificateID",
                table: "DoctorCertificates",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "AvailabilityID",
                table: "DoctorAvailabilities",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "AppointmentId",
                table: "Appointments",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "AdminId",
                table: "Admins",
                newName: "Id");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "UserPhones",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Roles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Prescriptions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "MedicalRecordId",
                table: "Prescriptions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "PrescriptionItems",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Patients",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "PatientChronicDiseases",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "PatientAllergies",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "MedicalRecords",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "MedicalAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "jobOpportunities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "JobApplications",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Hospitals",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Drugs",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Doctors",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "DoctorRecommendations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "DoctorJobRecommendations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "DoctorCertificates",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "DoctorAvailabilities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Appointments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Admins",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Prescriptions_MedicalRecordId",
                table: "Prescriptions",
                column: "MedicalRecordId");

            migrationBuilder.AddForeignKey(
                name: "FK_Admins_Users_Id",
                table: "Admins",
                column: "Id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalAttachments_MedicalRecords_MedicalRecordId",
                table: "MedicalAttachments",
                column: "MedicalRecordId",
                principalTable: "MedicalRecords",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Prescriptions_MedicalRecords_MedicalRecordId",
                table: "Prescriptions",
                column: "MedicalRecordId",
                principalTable: "MedicalRecords",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Admins_Users_Id",
                table: "Admins");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalAttachments_MedicalRecords_MedicalRecordId",
                table: "MedicalAttachments");

            migrationBuilder.DropForeignKey(
                name: "FK_Prescriptions_MedicalRecords_MedicalRecordId",
                table: "Prescriptions");

            migrationBuilder.DropIndex(
                name: "IX_Prescriptions_MedicalRecordId",
                table: "Prescriptions");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "UserPhones");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Prescriptions");

            migrationBuilder.DropColumn(
                name: "MedicalRecordId",
                table: "Prescriptions");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "PrescriptionItems");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "PatientChronicDiseases");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "PatientAllergies");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "MedicalRecords");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "MedicalAttachments");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "jobOpportunities");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "JobApplications");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Hospitals");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Drugs");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "DoctorRecommendations");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "DoctorJobRecommendations");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "DoctorCertificates");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "DoctorAvailabilities");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Admins");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Users",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "UserPhones",
                newName: "PhoneId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Roles",
                newName: "RoleID");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Prescriptions",
                newName: "PrescriptionId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "PrescriptionItems",
                newName: "ItemId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Patients",
                newName: "PatientID");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "PatientChronicDiseases",
                newName: "DiseaseID");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "PatientAllergies",
                newName: "AllergyID");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "MedicalRecords",
                newName: "RecordId");

            migrationBuilder.RenameColumn(
                name: "MedicalRecordId",
                table: "MedicalAttachments",
                newName: "MedicalRecordRecordId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "MedicalAttachments",
                newName: "AttachmentId");

            migrationBuilder.RenameIndex(
                name: "IX_MedicalAttachments_MedicalRecordId",
                table: "MedicalAttachments",
                newName: "IX_MedicalAttachments_MedicalRecordRecordId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "jobOpportunities",
                newName: "JobOpportunityId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "JobApplications",
                newName: "JobApplicationId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Hospitals",
                newName: "HospitalId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Drugs",
                newName: "DrugId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Doctors",
                newName: "DoctorId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "DoctorRecommendations",
                newName: "RecommendationId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "DoctorJobRecommendations",
                newName: "DoctorJobRecommendationId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "DoctorCertificates",
                newName: "CertificateID");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "DoctorAvailabilities",
                newName: "AvailabilityID");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Appointments",
                newName: "AppointmentId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Admins",
                newName: "AdminId");

            migrationBuilder.AddForeignKey(
                name: "FK_Admins_Users_AdminId",
                table: "Admins",
                column: "AdminId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalAttachments_MedicalRecords_MedicalRecordRecordId",
                table: "MedicalAttachments",
                column: "MedicalRecordRecordId",
                principalTable: "MedicalRecords",
                principalColumn: "RecordId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
