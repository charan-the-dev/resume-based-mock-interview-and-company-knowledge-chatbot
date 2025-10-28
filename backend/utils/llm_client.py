import os
from openai import OpenAI

# Try to initialize OpenAI client, but don't fail if no API key
try:
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        client = OpenAI(api_key=api_key)
        USE_OPENAI = True
    else:
        USE_OPENAI = False
        print("⚠️ Warning: OpenAI API key not found. Using mock suggestions.")
except Exception as e:
    USE_OPENAI = False
    print(f"⚠️ Warning: Could not initialize OpenAI: {e}")

async def get_llm_suggestions(parsed_data: dict, hard_score: dict, soft_score: dict) -> dict:
    """
    Get LLM-powered suggestions for resume improvement
    Falls back to mock suggestions if OpenAI is not available
    """
    
    # Always use mock for now (reliable and free)
    return generate_mock_suggestions(parsed_data, hard_score, soft_score)


def generate_mock_suggestions(parsed_data: dict, hard_score: dict, soft_score: dict) -> dict:
    """
    Generate intelligent mock suggestions based on actual resume analysis
    """
    skills = parsed_data.get('skills', [])
    contact = parsed_data.get('contact', {})
    education = parsed_data.get('education', [])
    experience = parsed_data.get('experience', [])
    
    hard_total = hard_score.get('total_score', 0)
    soft_total = soft_score.get('total_score', 0)
    overall = (hard_total + soft_total) / 2
    
    strengths = []
    improvements = []
    action_items = []
    
    # === STRENGTHS (Dynamic based on scores) ===
    
    if hard_score.get('contact_completeness', 0) >= 8:
        strengths.append("✓ Complete and professional contact information provided")
    
    if len(skills) >= 6:
        strengths.append(f"✓ Strong technical skills section with {len(skills)} relevant skills")
    
    if hard_score.get('education_score', 0) >= 15:
        strengths.append("✓ Well-documented educational background")
    
    if hard_score.get('experience_score', 0) >= 20:
        strengths.append("✓ Solid work experience section")
    
    if soft_score.get('readability_score', 0) >= 18:
        strengths.append("✓ Good readability and clear presentation")
    
    if soft_score.get('formatting_score', 0) >= 18:
        strengths.append("✓ Professional formatting and structure")
    
    # Default strengths if score is decent
    if overall >= 70 and len(strengths) == 0:
        strengths.append("✓ Well-structured resume with good overall content")
    
    if len(strengths) == 0:
        strengths.append("✓ Resume submitted and analyzed successfully")
    
    # === IMPROVEMENTS (Dynamic based on what's missing) ===
    
    if hard_score.get('contact_completeness', 0) < 8:
        improvements.append("⚠ Add missing contact details (email, phone number, LinkedIn profile)")
        action_items.append("→ Update contact section with complete information")
    
    if len(skills) < 5:
        improvements.append("⚠ Expand your skills section with more relevant technical and soft skills")
        action_items.append("→ Add 5-10 industry-specific skills relevant to target positions")
    
    if hard_score.get('education_score', 0) < 10:
        improvements.append("⚠ Provide more details about your education (degree, institution, year)")
    
    if hard_score.get('experience_score', 0) < 15:
        improvements.append("⚠ Add more detailed work experience with specific achievements")
        action_items.append("→ Use STAR method (Situation, Task, Action, Result) for experience bullets")
    
    if overall < 70:
        improvements.append("⚠ Include quantifiable achievements (numbers, percentages, metrics)")
        improvements.append("⚠ Use strong action verbs to start each bullet point (Led, Developed, Achieved)")
        action_items.append("→ Add metrics: 'Increased sales by 25%' instead of 'Improved sales'")
    
    if overall < 60:
        improvements.append("⚠ Improve overall resume structure and professional appearance")
        action_items.append("→ Use a professional resume template with clear sections")
    
    if soft_score.get('readability_score', 0) < 15:
        improvements.append("⚠ Simplify language for better readability and clarity")
    
    # Ensure we always have improvements
    if len(improvements) == 0:
        improvements.append("⚠ Continue to update and refine your resume regularly")
        improvements.append("⚠ Tailor resume content to specific job descriptions")
    
    # Ensure we have action items
    if len(action_items) == 0:
        action_items.append("→ Review and update resume every 3 months")
        action_items.append("→ Customize resume for each job application")
    
    # === ATS OPTIMIZATION TIPS (Always relevant) ===
    
    ats_tips = [
        "📄 Use standard section headings: Summary, Experience, Education, Skills",
        "🔑 Include keywords from the job description naturally in your content",
        "📝 Avoid using tables, text boxes, headers/footers, and images",
        "💾 Save and submit resume in both PDF and DOCX formats",
        "✏️ Use standard fonts (Arial, Calibri, Times New Roman) for better parsing",
        "📊 Keep formatting simple - use bullet points instead of complex layouts"
    ]
    
    # === OVERALL ASSESSMENT (Based on score ranges) ===
    
    if overall >= 85:
        assessment = "🌟 Excellent resume! Your resume demonstrates strong content quality with comprehensive information. Focus on fine-tuning specific details and ensuring perfect ATS compatibility. Minor optimizations in keyword placement and quantifiable metrics will make it outstanding."
    
    elif overall >= 75:
        assessment = "✅ Good resume with solid foundation! Your resume shows good structure and relevant content. The main areas for improvement are adding more quantifiable achievements and optimizing for Applicant Tracking Systems. Consider tailoring specific sections to match job requirements more closely."
    
    elif overall >= 65:
        assessment = "📈 Decent resume that needs refinement. Your resume has the basic elements but requires enhancement in several areas. Focus on expanding experience details, adding measurable achievements, and improving the skills section. Professional formatting improvements will significantly boost its effectiveness."
    
    elif overall >= 50:
        assessment = "⚠️ Resume needs significant improvements. While the basic structure exists, major enhancements are required in content completeness, achievement quantification, and professional presentation. Consider seeking feedback from mentors or using professional resume templates."
    
    else:
        assessment = "🔧 Resume requires major overhaul. Critical sections are incomplete or missing. Focus on adding comprehensive work experience, education details, and a strong skills section. Consider using resume writing resources or professional services for guidance on structure and content."
    
    # Add specific mention of what was found
    if parsed_data.get('personal_info', {}).get('name'):
        name = parsed_data['personal_info']['name']
        assessment = f"Resume for {name}: " + assessment
    
    return {
        "strengths": strengths,
        "improvements": improvements,
        "action_items": action_items,
        "ats_tips": ats_tips,
        "assessment": assessment
    }
