using System.ComponentModel.DataAnnotations.Schema;

namespace hospital.Model
{
    public class DoctorAvailability
    {
        public int Id { get; set; }

        [ForeignKey("Doctor")]
        public int DoctorId {  get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        public int BufferBefor { get; set; }
        public int BufferAfter { get; set; }

        public Doctor Doctor {  get; set; }
    }
}
