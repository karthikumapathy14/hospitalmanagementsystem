using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospital.Model
{
    public class AvailableSlots
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("DoctorAvailability")]
        public int DoctoravailabilityId { get; set; }

        public TimeOnly SlotTime { get; set; }
        public bool IsBooked { get; set; }

        public DoctorAvailability doctorAvailability { get; set; }
    }
}
