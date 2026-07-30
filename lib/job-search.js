import { PROFILE } from './profile-data.js';

/**
 * Build the AI prompt for job searching based on Venu's profile.
 * The AI model uses its knowledge to find and curate relevant job listings.
 */
export function buildJobSearchPrompt() {
  const today = new Date();
  const month = today.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const dateStr = today.toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return `You are an AI job search assistant. Find and curate REAL job openings posted in the last 24 hours that match this profile.

**Candidate Profile:**
- Name: ${PROFILE.name}
- Title: ${PROFILE.title}
- Current Role: ${PROFILE.currentRole} at ${PROFILE.company}
- Location: ${PROFILE.location}
- Years of Experience: ${PROFILE.yearsExperience}+ years
- Domains: ${PROFILE.domains.join(', ')}
- Certifications: ${PROFILE.certifications.join(', ')}
- Key Skills: ${PROFILE.skills.join(', ')}
- Target Roles: ${PROFILE.targetRoles.join(', ')}

**Experience Summary:**
${PROFILE.experience.map((e) => `- ${e.title} at ${e.company} (${e.period})`).join('\n')}

**Instructions:**
1. ONLY include jobs posted within the last 24 hours (between ${yesterday} and ${dateStr}). Do NOT include older postings.
2. Focus on these locations in this priority order:
   a. Remote / Work from Home
   b. Hyderabad, Telangana, India
   c. If not enough jobs found in the above, expand to ANY location in India (Bangalore, Pune, Chennai, Mumbai, Delhi NCR, etc.)
   Do NOT include UK, US, or any other country.
3. Match roles based on: PMP/PRINCE2/CSM certifications, rail transport/automotive experience, 18+ years project management seniority.
4. **CRITICAL SENIORITY & SALARY REQUIREMENT**: ONLY include Senior, Lead, Manager, or Director level positions with salary cap minimum of **₹40 Lakhs INR (₹40 LPA+)** or equivalent (£60k+). STRICTLY EXCLUDE associate, entry-level, junior, analyst, or low-seniority positions.
5. Target roles include: Project Delivery Manager, Project Delivery Lead, Senior Project Leader, PMO Manager, Project Manager Scrum Master, Engineering Delivery Lead.
6. Include a mix of strong matches (Tier 1) and good matches (Tier 2)
7. For each job, calculate a match_score (0-100) based on skill overlap
8. Include at least 10 jobs, up to 20
9. Prioritize rail, transport infrastructure, and automotive project management roles
8. **CRITICAL: Apply URLs must be REAL, WORKING links.** Use actual URLs from these sources:
   - LinkedIn job postings (e.g. https://www.linkedin.com/jobs/view/JOBID)
   - Indeed India (e.g. https://www.indeed.co.in/viewjob?jk=JOBID)
   - Naukri.com (e.g. https://www.naukri.com/job-listings-SLUG)
   - Company career pages (e.g. https://careers.company.com/job/ID)
   - TimesJobs, Shine, Foundit, or other Indian job boards
   Do NOT fabricate or guess URLs. If you cannot find a real URL, use the company's careers page homepage.

**Output Format:**
Return ONLY a valid JSON object with this structure:
{
  "month": "${month}",
  "generated_date": "${dateStr}",
  "profile_summary": "Senior Project Leader | 18+ yrs | PMP® PRINCE2® CSM® | Rail Transport & Automotive",
  "jobs": [
    {
      "id": "company-role-slug",
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State, India or Remote",
      "salary": "₹X-Y LPA or blank if unknown",
      "match_score": 85,
      "tier": 1,
      "tags": ["Rail", "PMP", "PRINCE2"],
      "why_match": "Brief reason why this matches the profile",
      "apply_url": "https://actual-verified-job-posting-url.com",
      "source": "LinkedIn|Indeed|Naukri|Company|Other",
      "posted": "YYYY-MM-DD publication date from search result",
      "status": "new"
    }
  ]
}

Return valid JSON only, no markdown code fences, no extra text.`;
}
