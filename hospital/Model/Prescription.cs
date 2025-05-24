using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospital.Model
{
    public class Prescription
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Appointment")]
        public int AppointmentId { get; set; }
        [MaxLength(500)]
        public string Diagnosis { get; set; }
        [MaxLength(1000)]
        public string Medications { get; set; }
        [MaxLength(1000)]
        public string Notes { get; set; }
        public DateTime PrescribedDate { get; set; } =DateTime.MinValue;
        
        [ForeignKey("Doctor")]
        public int Prescribedby { get; set; }

        public Doctor Doctor { get; set; }
        public Appointment Appointment { get; set; }
    }
}
