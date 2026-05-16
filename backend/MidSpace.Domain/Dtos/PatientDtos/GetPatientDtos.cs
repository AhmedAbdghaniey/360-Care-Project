namespace MidSpace.Domain.Dtos.PatientDtos
{
    public class GetPatientDtos
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime DOB { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string BloodType { get; set; } = string.Empty;
        public string EmergencyContact { get; set; } = string.Empty;
        public List<string> Allergies { get; set; } = new();
        public List<string> ChronicDiseases { get; set; } = new();
    }
}
