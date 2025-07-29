export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("doctorID");
  localStorage.removeItem("nurseID");
  localStorage.removeItem("patientID");
  window.location.href = "/"; 
}
