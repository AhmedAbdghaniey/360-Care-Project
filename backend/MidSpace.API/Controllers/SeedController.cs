using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Data.Models;
using MidSpace.Data.Models.user;
using MidSpace.Data.Models.Social;
using MidSpace.Data.Models.Appointments_Medical;

namespace MidSpace.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SeedController(ApplicationDbContext context)
        {
            _context = context;
        }

        private static async Task<int> EnsureRole(ApplicationDbContext ctx, string name)
        {
            var role = await ctx.Roles.FirstOrDefaultAsync(r => r.RoleName == name);
            if (role == null) { role = new Role { RoleName = name }; ctx.Roles.Add(role); await ctx.SaveChangesAsync(); }
            return role.Id;
        }

        [HttpPost("all")]
        public async Task<IActionResult> SeedAll()
        {
            var rng = new Random();

            // Roles
            var doctorRoleId = await EnsureRole(_context, "doctor");
            var patientRoleId = await EnsureRole(_context, "patient");
            var hospitalRoleId = await EnsureRole(_context, "hospital");
            var adminRoleId = await EnsureRole(_context, "admin");

            var pw = BCrypt.Net.BCrypt.HashPassword("Test123!");

            // Helper: upsert user -> return user id
            async Task<int> UpsertUser(string email, string name, int roleId)
            {
                var u = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
                if (u != null)
                {
                    u.PasswordHash = pw;
                    u.RoleId = roleId;
                    u.FullName = name;
                    u.IsActive = true;
                    return u.Id;
                }
                u = new User
                {
                    FullName = name, Email = email, PasswordHash = pw,
                    RoleId = roleId, IsActive = true, CreatedAt = DateTime.UtcNow.AddDays(-rng.Next(30, 365))
                };
                _context.Users.Add(u);
                await _context.SaveChangesAsync();
                return u.Id;
            }

            // --- Admin ---
            var adminId = await UpsertUser("admin@test.com", "System Admin", adminRoleId);

            // --- Doctors (8) ---
            var doctorData = new[]
            {
                new { Name = "Prof. Ahmed Hassan", Email = "ahmed.hassan@gmail.com", Spec = "Cardiology", Exp = 18, Fee = 450m, Bio = "Professor of Cardiology at Cairo University with 18+ years of experience. Specializes in interventional cardiology, cardiac catheterization, and echocardiography. Published over 30 research papers in international medical journals." },
                new { Name = "Dr. Sara Mohamed", Email = "sara.mohamed@yahoo.com", Spec = "Pediatrics", Exp = 10, Fee = 300m, Bio = "Senior pediatrician with 10 years of experience in neonatology and child development. Dedicated to providing comprehensive care for children from infancy through adolescence." },
                new { Name = "Dr. Mostafa Ibrahim", Email = "mostafa.ibrahim@gmail.com", Spec = "Neurology", Exp = 15, Fee = 500m, Bio = "Consultant neurologist specializing in stroke management, epilepsy treatment, and movement disorders. Head of the Neurology Department at Alexandria Medical Center." },
                new { Name = "Dr. Nour El-Din Mahmoud", Email = "nour.mahmoud@hotmail.com", Spec = "Dermatology", Exp = 8, Fee = 350m, Bio = "Expert dermatologist focusing on medical and cosmetic dermatology. Specializes in acne treatment, psoriasis management, skin cancer screening, and laser procedures." },
                new { Name = "Dr. Omar Khaled", Email = "omar.khaled@gmail.com", Spec = "Orthopedics", Exp = 14, Fee = 400m, Bio = "Orthopedic surgeon with expertise in joint replacement surgery, sports medicine, and minimally invasive arthroscopy. Performed over 500 successful knee and hip replacements." },
                new { Name = "Dr. Hana Youssef", Email = "hana.youssef@yahoo.com", Spec = "Internal Medicine", Exp = 11, Fee = 320m, Bio = "Internal medicine specialist focused on preventive care, diabetes management, and hypertension treatment. Certified in advanced cardiac life support (ACLS)." },
                new { Name = "Dr. Khaled Abdel-Rahman", Email = "khaled.rahman@gmail.com", Spec = "Ophthalmology", Exp = 9, Fee = 380m, Bio = "Ophthalmologist specializing in cataract surgery, glaucoma management, and retinal disorders. Experienced in modern phacoemulsification techniques and laser eye surgery." },
                new { Name = "Dr. Mariam Samir", Email = "mariam.samir@gmail.com", Spec = "Psychiatry", Exp = 7, Fee = 280m, Bio = "Consultant psychiatrist providing comprehensive mental health services. Specializes in anxiety disorders, depression, and cognitive behavioral therapy (CBT)." },
            };

            var doctorIds = new List<int>();
            foreach (var d in doctorData)
            {
                var uid = await UpsertUser(d.Email, d.Name, doctorRoleId);
                var doc = await _context.Doctors.FirstOrDefaultAsync(x => x.UserId == uid);
                if (doc == null)
                {
                    doc = new Doctor { UserId = uid, Specialization = d.Spec, LicenseNumber = $"LIC-{uid:D4}", ExperienceYears = d.Exp, ConsultationFee = d.Fee, Bio = d.Bio, DoctorScore = Math.Round(4.0 + rng.NextDouble(), 1), AvailabilityStatus = "Available" };
                    _context.Doctors.Add(doc);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    doc.Specialization = d.Spec; doc.ExperienceYears = d.Exp; doc.ConsultationFee = d.Fee; doc.Bio = d.Bio;
                    if (doc.LicenseNumber == null) doc.LicenseNumber = $"LIC-{uid:D4}";
                    if (doc.DoctorScore == 0) doc.DoctorScore = Math.Round(4.0 + rng.NextDouble(), 1);
                    if (doc.AvailabilityStatus == null) doc.AvailabilityStatus = "Available";
                }
                doctorIds.Add(doc.Id);
            }
            await _context.SaveChangesAsync();

            // --- Certificates for doctors ---
            var certNames = new[] {
                new[] { "Board Certified Cardiology", "Advanced Cardiac Life Support", "Echocardiography Certification" },
                new[] { "Board Certified Pediatrics", "Neonatal Resuscitation Program", "Child Development Specialist" },
                new[] { "Board Certified Neurology", "Stroke Management Certification", "EEG Interpretation" },
                new[] { "Board Certified Dermatology", "Cosmetic Dermatology Fellowship", "Laser Surgery Certification" },
                new[] { "Board Certified Orthopedics", "Joint Replacement Surgery", "Sports Medicine Fellowship" },
                new[] { "Board Certified Internal Medicine", "Diabetes Management", "Advanced Cardiac Life Support" },
                new[] { "Board Certified Ophthalmology", "Cataract Surgery Fellowship", "Laser Vision Correction" },
                new[] { "Board Certified Psychiatry", "Cognitive Behavioral Therapy", "Addiction Medicine" },
            };
            var issuers = new[] { "Egyptian Medical Board", "Cairo University", "Harvard Medical School", "Johns Hopkins Medicine" };

            for (int i = 0; i < doctorIds.Count; i++)
            {
                var did = doctorIds[i];
                var existingCerts = await _context.DoctorCertificates.Where(c => c.DoctorID == did).Select(c => c.CertificateName).ToListAsync();
                foreach (var cert in certNames[i])
                {
                    if (!existingCerts.Contains(cert))
                        _context.DoctorCertificates.Add(new DoctorCertificate { DoctorID = did, CertificateName = cert, IssuingOrganization = issuers[rng.Next(issuers.Length)], IssueDate = DateTime.UtcNow.AddYears(-rng.Next(1, 10)) });
                }
            }
            await _context.SaveChangesAsync();

            // --- Availabilities for doctors ---
            var days = new[] { DayOfWeek.Sunday, DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday };
            foreach (var did in doctorIds)
            {
                var existingDays = await _context.DoctorAvailabilities.Where(a => a.DoctorID == did).Select(a => a.DayOfWeek).ToListAsync();
                foreach (var day in days)
                {
                    if (!existingDays.Contains(day))
                        _context.DoctorAvailabilities.Add(new DoctorAvailability { DoctorID = did, DayOfWeek = day, StartTime = new TimeSpan(9, 0, 0), EndTime = new TimeSpan(17, 0, 0), IsAvailable = true });
                }
            }
            await _context.SaveChangesAsync();

            // --- Patients (3) ---
            var patientData = new[]
            {
                new { Name = "Mona Ahmed", Email = "mona@test.com", Gender = "Female", Blood = "A+", DOB = new DateTime(1990, 5, 15), Address = "12 Tahrir St, Cairo", Phone = "+20 100 123 4567", Allergies = new[] { "Penicillin", "Peanuts" }, Diseases = new[] { "Asthma" } },
                new { Name = "Khaled Mahmoud", Email = "khaled@test.com", Gender = "Male", Blood = "O+", DOB = new DateTime(1985, 8, 22), Address = "45 Nile Ave, Giza", Phone = "+20 100 987 6543", Allergies = new[] { "Sulfa Drugs" }, Diseases = new[] { "Hypertension", "Type 2 Diabetes" } },
                new { Name = "Laila Ibrahim", Email = "laila@test.com", Gender = "Female", Blood = "B-", DOB = new DateTime(1995, 12, 3), Address = "7 Zamalek St, Cairo", Phone = "+20 100 555 1234", Allergies = Array.Empty<string>(), Diseases = new[] { "Migraine" } },
            };

            var patientIds = new List<int>();
            foreach (var p in patientData)
            {
                var uid = await UpsertUser(p.Email, p.Name, patientRoleId);
                var pat = await _context.Patients.FirstOrDefaultAsync(x => x.UserId == uid);
                if (pat == null)
                {
                    pat = new Patient { UserId = uid, DOB = p.DOB, Gender = p.Gender, Address = p.Address, BloodType = p.Blood, EmergencyContact = p.Phone };
                    _context.Patients.Add(pat);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    pat.DOB = p.DOB; pat.Gender = p.Gender; pat.Address = p.Address; pat.BloodType = p.Blood; pat.EmergencyContact = p.Phone;
                }
                patientIds.Add(pat.Id);

                var existingAllergies = await _context.PatientAllergies.Where(a => a.PatientID == pat.Id).Select(a => a.AllergyName).ToListAsync();
                foreach (var a in p.Allergies) { if (!existingAllergies.Contains(a)) _context.PatientAllergies.Add(new PatientAllergy { PatientID = pat.Id, AllergyName = a }); }

                var existingDiseases = await _context.PatientChronicDiseases.Where(d => d.PatientID == pat.Id).Select(d => d.DiseaseName).ToListAsync();
                foreach (var d in p.Diseases) { if (!existingDiseases.Contains(d)) _context.PatientChronicDiseases.Add(new PatientChronicDisease { PatientID = pat.Id, DiseaseName = d }); }
            }
            await _context.SaveChangesAsync();

            // --- Hospitals ---
            var hospitalData = new[]
            {
                new {
                    Email = "info@cairo-medical.com", Name = "Cairo Medical Center",
                    Address = "15 Kasr Al-Aini St, Cairo, Egypt",
                    Phone = "+20 2 12345678", Website = "https://www.cairo-medical.com",
                    Desc = "Cairo Medical Center is a leading healthcare facility in Egypt, offering comprehensive medical services across multiple specialties with state-of-the-art equipment and experienced physicians."
                },
                new {
                    Email = "hr@alex-health.com", Name = "Alexandria Health Hospital",
                    Address = "22 El-Gaish Rd, Alexandria, Egypt",
                    Phone = "+20 3 9876543", Website = "https://www.alex-health.com",
                    Desc = "Alexandria Health Hospital is a modern medical facility serving the Alexandria region with a focus on patient-centered care and innovative treatments."
                },
                new {
                    Email = "careers@sharm-medical.com", Name = "Sharm El-Sheikh International Medical Center",
                    Address = "5 Peace Rd, Sharm El-Sheikh, South Sinai, Egypt",
                    Phone = "+20 69 3661234", Website = "https://www.sharm-medical.com",
                    Desc = "Sharm El-Sheikh International Medical Center is a world-class healthcare facility located in the heart of South Sinai. Specializing in medical tourism, sports medicine, and tropical diseases, we serve both local and international patients with the highest standards of care."
                },
            };

            var allJobs = new List<(string Title, string Desc, string Loc, string Spec, decimal Min, decimal Max, int HospIdx)>
            {
                // --- Cairo Medical Center (idx 0) ---
                ("Senior Cardiologist", "We are seeking an experienced cardiologist to join our heart center. The ideal candidate has 5+ years of experience in interventional cardiology, echocardiography, and cardiac catheterization. Board certification required. Opportunity to lead a team of 4 junior cardiologists.", "Cairo", "Cardiology", 35000m, 55000m, 0),
                ("Pediatrician", "Full-time pediatrician needed for our children's hospital wing. Must have experience in neonatal care, growth assessment, and common childhood illnesses. Well-child visits, vaccinations, and developmental screenings are core responsibilities.", "Cairo", "Pediatrics", 22000m, 38000m, 0),
                ("Neurology Consultant", "Seeking a senior neurology consultant for our neuroscience department. Experience with stroke management, EEG interpretation, and movement disorders required. Teaching hospital affiliation available.", "Cairo", "Neurology", 42000m, 62000m, 0),
                ("Orthopedic Surgeon", "Looking for an orthopedic surgeon specializing in joint replacement and sports medicine. Arthroscopy and minimally invasive technique experience preferred. On-call rotation shared with 3 other surgeons.", "Giza", "Orthopedics", 35000m, 58000m, 0),
                ("Dermatologist", "Join our dermatology department with a focus on medical dermatology. Experience in psoriasis management, eczema treatment, and skin cancer screening required. Cosmetic dermatology training is a plus.", "Cairo", "Dermatology", 25000m, 42000m, 0),
                ("Oncologist", "We are looking for a medical oncologist to join our cancer center. Experience with chemotherapy protocols, immunotherapy, and clinical trials preferred. Multidisciplinary team environment.", "Cairo", "Oncology", 45000m, 65000m, 0),
                ("Psychiatrist", "Board-certified psychiatrist needed for our mental health department. Provide outpatient care, medication management, and therapy for a diverse patient population. Telepsychiatry options available.", "Cairo", "Psychiatry", 30000m, 50000m, 0),
                ("Ophthalmologist", "Experienced ophthalmologist needed for our eye care center. Cataract surgery, glaucoma management, and retinal exams are core services. Modern diagnostic equipment available.", "Cairo", "Ophthalmology", 32000m, 52000m, 0),
                ("Radiology Tech Lead", "We need a senior radiology technician to lead our imaging department. Experience with MRI, CT, and digital X-ray systems required. Will train and supervise a team of 6 technicians.", "Cairo", "Radiology", 18000m, 30000m, 0),
                ("ICU Specialist", "Intensive care specialist needed for our 20-bed ICU. Must be proficient in ventilator management, central line placement, and critical care protocols. Night rotation every 4th weekend.", "Cairo", "Emergency Medicine", 38000m, 55000m, 0),
                // --- Alexandria Health Hospital (idx 1) ---
                ("General Surgeon", "Experienced general surgeon needed for our surgical department. Must have 3+ years of experience in laparoscopic and open procedures. Emergency surgery call rotation required. Competitive benefits package.", "Alexandria", "Surgery", 28000m, 45000m, 1),
                ("Radiologist", "Seeking a skilled radiologist to join our imaging department. Experience with MRI, CT, ultrasound, and X-ray interpretation required. Teleradiology support available for after-hours coverage.", "Alexandria", "Radiology", 32000m, 50000m, 1),
                ("Emergency Medicine Physician", "Full-time emergency medicine physician needed for our 24/7 emergency department. Must be comfortable with acute care, trauma management, and rapid diagnosis. 12-hour shifts, 3-4 days per week.", "Alexandria", "Emergency Medicine", 34000m, 52000m, 1),
                ("ENT Specialist", "We are looking for an ear, nose, and throat specialist to join our growing department. Experience in sinus surgery, hearing assessment, and pediatric ENT procedures preferred. Fully equipped clinic.", "Alexandria", "ENT", 26000m, 42000m, 1),
                ("Anesthesiologist", "Experienced anesthesiologist needed for our surgical team. General anesthesia, regional blocks, and sedation for various procedures. On-call rotation required. CRNA supervision experience valued.", "Alexandria", "Anesthesiology", 38000m, 58000m, 1),
                ("Pulmonologist", "Seeking a pulmonologist for our respiratory medicine department. Experience in bronchoscopy, sleep medicine, and critical care required. Pulmonary function test lab available on site.", "Alexandria", "Pulmonology", 33000m, 53000m, 1),
                ("Gastroenterologist", "Join our digestive health team. Experience in endoscopy, colonoscopy, and hepatology required. Modern endoscopy suite with latest equipment. Part-time academic appointment possible.", "Alexandria", "Gastroenterology", 36000m, 56000m, 1),
                ("Urologist", "Board-certified urologist needed for our surgical services. Minimally invasive surgery, stone management, and prostate health are key focus areas. Robotic surgery training available.", "Alexandria", "Urology", 34000m, 54000m, 1),
                ("Pediatric Surgeon", "Join our pediatric surgery team. Experience in neonatal surgery, pediatric oncology surgery, and minimally invasive techniques in children required. Family-centered care approach.", "Alexandria", "Pediatrics", 30000m, 48000m, 1),
                ("Clinical Pathologist", "We are looking for a clinical pathologist to oversee our laboratory services. Experience in histopathology, clinical chemistry, and laboratory management. Will lead a team of 8 lab technicians.", "Alexandria", "Pathology", 28000m, 45000m, 1),
                // --- Sharm El-Sheikh International Medical Center (idx 2) ---
                ("Sports Medicine Physician", "Seeking a sports medicine specialist to join our renowned sports medicine center. Experience with athletic injuries, rehabilitation protocols, and ultrasound-guided injections required. Work with professional athletes and tourism cases.", "Sharm El-Sheikh", "Orthopedics", 30000m, 50000m, 2),
                ("Tropical Disease Specialist", "We need an infectious disease specialist focusing on tropical and travel medicine. Experience with malaria, dengue, schistosomiasis and other region-specific diseases. WHO collaboration opportunities available.", "Sharm El-Sheikh", "Internal Medicine", 35000m, 55000m, 2),
                ("Diving & Hyperbaric Medicine Physician", "Unique opportunity for a physician trained in hyperbaric oxygen therapy and diving medicine. Manage decompression sickness cases, wound care, and provide medical support for diving tourism.", "Sharm El-Sheikh", "Emergency Medicine", 40000m, 60000m, 2),
                ("Medical Tourism Coordinator Doctor", "Bilingual physician needed to coordinate care for international patients. Must speak English and Arabic fluently. Experience in patient liaison, treatment planning, and follow-up care for medical tourists.", "Sharm El-Sheikh", "Internal Medicine", 25000m, 40000m, 2),
                ("Family Medicine Practitioner", "Join our primary care team serving the local community and expatriates. Full-spectrum family medicine including preventive care, chronic disease management, and minor procedures. Outpatient clinic hours.", "Sharm El-Sheikh", "Internal Medicine", 20000m, 35000m, 2),
                ("Emergency Room Director", "Lead our 24/7 emergency department serving both local residents and tourists. Must have 8+ years of emergency medicine experience and 3+ years in a leadership role. ACLS/ATLS instructor certification preferred.", "Sharm El-Sheikh", "Emergency Medicine", 45000m, 65000m, 2),
                ("Dermatologist (Cosmetic Focus)", "Experienced dermatologist with a focus on cosmetic dermatology for our medical tourism wing. Laser therapy, Botox, fillers, and skin rejuvenation procedures. International clientele.", "Sharm El-Sheikh", "Dermatology", 30000m, 50000m, 2),
            };

            var hospitalIds = new List<int>();
            foreach (var (hd, idx) in hospitalData.Select((h, i) => (h, i)))
            {
                var uid = await UpsertUser(hd.Email, hd.Name, hospitalRoleId);
                var hosp = await _context.Hospitals.FirstOrDefaultAsync(h => h.UserId == uid);
                if (hosp == null)
                {
                    hosp = new Hospital
                    {
                        UserId = uid, HospitalName = hd.Name, HospitalAddress = hd.Address,
                        ContactEmail = hd.Email, ContactPhoneNumber = hd.Phone,
                        OfficialWebsiteUrl = hd.Website, HospitalDescription = hd.Desc
                    };
                    _context.Hospitals.Add(hosp);
                    await _context.SaveChangesAsync();
                }
                hospitalIds.Add(hosp.Id);

                var existingJobTitles = await _context.jobOpportunities.Where(j => j.HospitalId == hosp.Id).Select(j => j.JobTitle).ToListAsync();
                foreach (var j in allJobs.Where(j => j.HospIdx == idx))
                {
                    if (!existingJobTitles.Contains(j.Title))
                        _context.jobOpportunities.Add(new JobOpportunity { JobTitle = j.Title, JobDescription = j.Desc, JobLocation = j.Loc, RequiredSpecialization = j.Spec, MinimumSalary = j.Min, MaximumSalary = j.Max, PostedDate = DateTime.UtcNow.AddDays(-rng.Next(1, 30)), ApplicationDeadline = DateTime.UtcNow.AddDays(30 + rng.Next(1, 15)), JobOpportunityStatus = JobOpportunityStatus.Open, HospitalId = hosp.Id });
                }
            }
            await _context.SaveChangesAsync();

            // --- Appointments ---
            var docList = await _context.Doctors.ToListAsync();
            var patList = await _context.Patients.ToListAsync();
            var appointmentTypes = new[]
            {
                new { Status = "Completed", Notes = "Regular checkup - blood pressure is normal" },
                new { Status = "Completed", Notes = "Child vaccination follow-up" },
                new { Status = "Scheduled", Notes = "MRI results consultation" },
                new { Status = "Scheduled", Notes = "Skin rash evaluation" },
                new { Status = "Scheduled", Notes = "Knee pain assessment" },
            };

            for (int i = 0; i < Math.Min(3, patList.Count); i++)
            {
                var pat = patList[i];
                var doc = docList[i % docList.Count];
                var apt = appointmentTypes[i];
                if (!await _context.Appointments.AnyAsync(a => a.PatientId == pat.Id && a.DoctorId == doc.Id && a.Notes == apt.Notes))
                {
                    _context.Appointments.Add(new Appointment
                    {
                        PatientId = pat.Id, DoctorId = doc.Id,
                        AppointmentDate = DateTime.UtcNow.AddDays(i == 4 ? 10 : i == 3 ? 7 : i == 2 ? -1 : i == 1 ? -3 : -5),
                        Status = apt.Status, Notes = apt.Notes,
                        ConsultationFeeAtBooking = doc.ConsultationFee, CreatedAt = DateTime.UtcNow.AddDays(-10)
                    });
                }
            }
            await _context.SaveChangesAsync();

            // --- Medical Records for completed appointments ---
            var completedAppts = await _context.Appointments.Where(a => a.Status == "Completed").ToListAsync();
            foreach (var appt in completedAppts)
            {
                if (!await _context.MedicalRecords.AnyAsync(r => r.AppointmentId == appt.Id))
                    _context.MedicalRecords.Add(new MedicalRecord { PatientId = appt.PatientId, DoctorId = appt.DoctorId, AppointmentId = appt.Id, Diagnosis = "Routine examination - no major concerns", TreatmentPlan = "Follow-up in 6 months. Maintain healthy diet and exercise.", Symptoms = "Patient reported feeling well overall.", CreatedAt = appt.AppointmentDate });
            }
            await _context.SaveChangesAsync();

            // --- Doctor Recommendations ---
            foreach (var patId in patientIds)
            {
                foreach (var doc in docList.Take(3))
                {
                    if (!await _context.DoctorRecommendations.AnyAsync(r => r.PatientId == patId && r.DoctorId == doc.Id))
                        _context.DoctorRecommendations.Add(new DoctorRecommendation { PatientId = patId, DoctorId = doc.Id, RankOrder = rng.Next(1, 6), Reason = rng.Next(2) == 0 ? "Excellent doctor, highly recommended!" : "Very professional and caring. Great experience.", RecommendationSource = "Patient" });
                }
            }
            await _context.SaveChangesAsync();

            // --- Follows ---
            foreach (var patId in patientIds)
            {
                var pat = await _context.Patients.Include(p => p.User).FirstAsync(p => p.Id == patId);
                foreach (var doc in docList)
                {
                    if (!await _context.Follows.AnyAsync(f => f.FollowerId == pat.UserId && f.FolloweeId == doc.UserId))
                        _context.Follows.Add(new Follow { FollowerId = pat.UserId, FolloweeId = doc.UserId, CreatedAt = DateTime.UtcNow.AddDays(-rng.Next(1, 30)) });
                }
            }
            await _context.SaveChangesAsync();

            // --- Posts ---
            var postContents = new[] {
                "Regular health check-ups are essential for early detection of diseases. Schedule yours today!",
                "Heart health tip: 30 minutes of moderate exercise daily can reduce cardiovascular risk by 40%.",
                "Vaccination is the most effective way to prevent infectious diseases. Stay up to date with your vaccines.",
                "Mental health matters! Take time to relax and practice mindfulness every day.",
                "A balanced diet rich in fruits, vegetables, and whole grains is key to good health.",
            };
            foreach (var content in postContents)
            {
                if (!await _context.Posts.AnyAsync(p => p.Content == content))
                    _context.Posts.Add(new Post { UserId = adminId, Content = content, CreatedAt = DateTime.UtcNow.AddDays(-rng.Next(1, 14)) });
            }
            await _context.SaveChangesAsync();

            // --- Drugs ---
            var drugNames = new[] { "Amoxicillin", "Paracetamol", "Ibuprofen", "Omeprazole", "Atorvastatin", "Lisinopril", "Metformin", "Aspirin", "Cetirizine", "Amoxicillin-Clavulanate" };
            foreach (var name in drugNames)
            {
                if (!await _context.Drugs.AnyAsync(d => d.DrugName == name))
                    _context.Drugs.Add(new Drug { DrugName = name });
            }
            await _context.SaveChangesAsync();

            return Ok(new { message = "All seed data created/updated successfully!" });
        }
    }
}
