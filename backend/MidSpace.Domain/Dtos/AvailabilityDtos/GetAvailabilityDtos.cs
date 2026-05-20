namespace MidSpace.Domain.Dtos.AvailabilityDtos
{
    public class GetAvailabilityDtos
    {
        public int Id { get; set; }
        public string DayOfWeek { get; set; } = string.Empty;
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
    }
}
