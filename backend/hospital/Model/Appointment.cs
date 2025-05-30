using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace hospital.Model
{
    public class Appointment
    {

        [Key]
        public int AppointmentId { get; set; }

        
        [ForeignKey("Patient")]
        public int? PatientId { get; set; }
        [ForeignKey("Nurse")]
        public int? NurseId { get; set; }

        
        [ForeignKey("Doctor")]
        public int? DoctorId { get; set; }

        [ForeignKey("Department")]
        public int? DepartmentId { get; set; }

        public DateOnly AppointmentDate { get; set; }
        public TimeOnly AppointmentTime { get; set; } 

        [MaxLength(255)]
        public string Reason { get; set; }


        [MaxLength(50)]
        public string Status { get; set; } = "Schedule";

        public string BillStatus { get; set; }


        public DateTime CreatedAt { get; set; } = DateTime.Now;

       

        // Navigation properties
        public virtual Department Department { get; set; }
        public virtual Patient Patient { get; set; }
        public virtual Doctor Doctor { get; set; }
        public virtual Nurse Nurse { get; set; }
    }
}
