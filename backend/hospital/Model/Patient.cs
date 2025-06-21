using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospital.Model
{
    public class Patient
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }
        public string patientid { get; set; }

        public string UserName { get; set; }
    
        public string Email { get; set; }
        public string Age { get; set; }
        public string Gender { get; set; }
        public string Role { get; set; }
        public string PhoneNo { get; set; }
        public string Bloodgrp { get; set; }
        public string Address { get; set; }
        public bool status { get; set; }
        public string Availability { get; set; }



        public string Prescription { get; set; }


        public User User { get; set; }

        public Doctor Doctor { get; set; }

        [ForeignKey("Doctor")]
        public int? DoctorId { get; set; }
   
        public Nurse Nurse { get; set; }
        [ForeignKey("Nurse")]
        public int? NurseId { get; set; }
    }
}
