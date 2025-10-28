def calculate_hard_score(parsed_data: dict) -> dict:
    """
    Calculate hard/quantitative scores based on objective metrics
    """
    score_breakdown = {
        "contact_completeness": 0,
        "education_score": 0,
        "experience_score": 0,
        "skills_count": 0,
        "certification_score": 0,
        "total_score": 0
    }
    
    # Contact information (10 points)
    contact = parsed_data.get("contact", {})
    if contact.get("email"):
        score_breakdown["contact_completeness"] += 5
    if contact.get("phone"):
        score_breakdown["contact_completeness"] += 5
    
    # Education (25 points)
    education = parsed_data.get("education", [])
    if len(education) > 0:
        score_breakdown["education_score"] = min(len(education) * 10, 25)
    
    # Experience (30 points)
    experience = parsed_data.get("experience", [])
    if len(experience) >= 3:
        score_breakdown["experience_score"] = 30
    elif len(experience) == 2:
        score_breakdown["experience_score"] = 20
    elif len(experience) == 1:
        score_breakdown["experience_score"] = 10
    
    # Skills (25 points)
    skills = parsed_data.get("skills", [])
    score_breakdown["skills_count"] = len(skills)
    score_breakdown["skills_score"] = min(len(skills) * 2, 25)
    
    # Certifications (10 points)
    certifications = parsed_data.get("certifications", [])
    score_breakdown["certification_score"] = min(len(certifications) * 5, 10)
    
    # Calculate total (out of 100)
    score_breakdown["total_score"] = (
        score_breakdown["contact_completeness"] +
        score_breakdown["education_score"] +
        score_breakdown["experience_score"] +
        score_breakdown["skills_score"] +
        score_breakdown["certification_score"]
    )
    
    return score_breakdown
