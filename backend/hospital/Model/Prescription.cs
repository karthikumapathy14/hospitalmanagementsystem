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

       
        
        [ForeignKey("Doctor")]
        public int Prescribedby { get; set; }

        public Doctor Doctor { get; set; }
        public Appointment Appointment { get; set; }
        public ICollection<PrescriptionDay> PrescriptionDays { get; set; }
    }
}
