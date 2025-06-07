using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospital.Model
{
    public class DoctorAvailability
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Doctor")]
        public int DoctorId { get; set; }
        public DateOnly Date { get; set; }

        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }

        public Doctor Doctor { get; set; }

        public ICollection<AvailableSlots> Slots { get; set; }
    }
}
