namespace MidSpace.Domain.Dtos.AvailabilityDtos
{
    public class UpsertAvailabilityDtos
    {
        public string DayOfWeek { get; set; } = string.Empty;
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
    }
}
