using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace hospital.Model
{
    public class Bill
    {
        [Key]
        public int BillId { get; set; }

      
        [ForeignKey("Appointment")]
        public int AppointmentId { get; set; }

        public decimal ConsultationFee { get; set; }

        public decimal TreatmentCharges { get; set; }

        public decimal MedicationCharges { get; set; }

        public decimal OtherCharges { get; set; }

        public decimal TotalAmount
        {
            get
            {
                return ConsultationFee + TreatmentCharges + MedicationCharges + OtherCharges;
            }
            private set 
        }
        public string billstatus { get; set; } = "Pending";

        public DateTime BillDate { get; set; } = DateTime.Now;

        // Navigation property
        public virtual Appointment Appointment { get; set; }
    }
}
