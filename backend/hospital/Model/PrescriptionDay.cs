using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace hospital.Model
{
    public class PrescriptionDay
    {
        [Key]
        public int Id { get; set; }
        public int DayNumber { get; set; }
        public DateTime PrescribedDate { get; set; } = DateTime.Now;

        [MaxLength(500)]
        public string Diagnosis { get; set; }
        [MaxLength(1000)]
        public string Medications { get; set; }
        [MaxLength(1000)]
        public string Notes { get; set; }

        [ForeignKey("Prescription")]
        public int PrescriptionId { get; set; }

        [JsonIgnore]
        public Prescription Prescription { get; set; }
    }
}
