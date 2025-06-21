using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospital.Model
{
    public class Doctor
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }

        public string UserName { get; set;}
        public string Email { get; set;}
        public string Role { get; set;}
        public string PhoneNo { get; set;}
        public string Qualification { get; set;}
        public string Address { get; set; }
        public bool status { get; set; } = true;
        public int Experience { get; set; }
        public User User { get; set; }
        public string Availability { get; set; } = "unavailable";



        public Department Department { get; set; }
        [ForeignKey("Department")]
        public int? DepartmentId { get; set; }
    }
}
