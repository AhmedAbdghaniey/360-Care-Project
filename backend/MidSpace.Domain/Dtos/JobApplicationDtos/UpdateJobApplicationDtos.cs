using System.ComponentModel.DataAnnotations;
using MidSpace.Data.Models;

namespace MidSpace.Domain.Dtos.JobApplicationDtos
{
    public class UpdateJobApplicationDtos
    {
        [Url, StringLength(500)]
        public string? CVFileUrl { get; set; }

        [StringLength(2000)]
        public string? CoverLetterText { get; set; }
        public JobApplicationStatus JobApplicationStatus { get; set; }
    }
}
