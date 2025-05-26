using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospital.Model
{
    public class Admin
    {
        [Key]
        public int Id { get; set; }
        [ ForeignKey("User")]
        public string UserId { get; set; }

        [ForeignKey("Doctor")]
        public int? DoctorId { get; set; }
        public Doctor Doctor { get; set; }

        [ForeignKey("Patient")]
        public int? PatientId { get; set; }
        public Patient Patient { get; set; }

        [ForeignKey("Receptionist")]
        public int? ReceptionistId { get; set; }
        public Receptionist Receptionist { get; set; }

        [ForeignKey("Nurse")]
        public int? NurseId { get; set; }
        public Nurse Nurse { get; set; }
     
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }

        public string PhoneNo { get; set; }
        public string Address { get; set; }

       
        public User User { get; set; }

     



 


    }
}
