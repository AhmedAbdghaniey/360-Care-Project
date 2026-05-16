using System.ComponentModel.DataAnnotations;

namespace MidSpace.Domain.Dtos.DrugDtos
{
    public class AddDrugDtos
    {
        [Required, StringLength(200)]
        public string DrugName { get; set; } = string.Empty;
    }
}
