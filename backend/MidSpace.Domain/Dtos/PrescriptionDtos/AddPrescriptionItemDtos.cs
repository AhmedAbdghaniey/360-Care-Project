namespace MidSpace.Domain.Dtos.PrescriptionDtos
{
    public class AddPrescriptionItemDtos
    {
        public string? MedicationName { get; set; }
        public string? Dosage { get; set; }
        public string? Frequency { get; set; }
        public string? Duration { get; set; }
        public string? Instructions { get; set; }
    }
}
