namespace hospital.Model
{
    public class BulkEmailRequest
    {
        public List<string> Emails { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }

    }
}
