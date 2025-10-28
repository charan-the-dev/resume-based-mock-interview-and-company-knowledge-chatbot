import textstat
import re

def calculate_soft_score(parsed_data: dict) -> dict:
    """
    Calculate soft/qualitative scores based on content quality
    """
    score_breakdown = {
        "readability_score": 0,
        "keyword_density": 0,
        "formatting_score": 0,
        "length_score": 0,
        "total_score": 0
    }
    
    raw_text = parsed_data.get("raw_text", "")
    
    # Readability (25 points)
    # Flesch Reading Ease: 0-100 scale
    try:
        readability = textstat.flesch_reading_ease(raw_text)
        # Normalize to 25 points
        score_breakdown["readability_score"] = min((readability / 100) * 25, 25)
    except:
        score_breakdown["readability_score"] = 10
    
    # Keyword density (25 points)
    action_verbs = [
        "achieved", "developed", "managed", "led", "created",
        "implemented", "designed", "improved", "increased",
        "reduced", "optimized", "coordinated"
    ]
    
    text_lower = raw_text.lower()
    verb_count = sum(1 for verb in action_verbs if verb in text_lower)
    score_breakdown["keyword_density"] = min(verb_count * 2, 25)
    
    # Formatting quality (25 points)
    formatting_score = 0
    if parsed_data.get("contact", {}).get("email"):
        formatting_score += 8
    if len(parsed_data.get("education", [])) > 0:
        formatting_score += 8
    if len(parsed_data.get("experience", [])) > 0:
        formatting_score += 9
    
    score_breakdown["formatting_score"] = formatting_score
    
    # Length appropriateness (25 points)
    word_count = len(raw_text.split())
    if 300 <= word_count <= 800:
        score_breakdown["length_score"] = 25
    elif 200 <= word_count < 300 or 800 < word_count <= 1000:
        score_breakdown["length_score"] = 15
    else:
        score_breakdown["length_score"] = 5
    
    # Calculate total
    score_breakdown["total_score"] = (
        score_breakdown["readability_score"] +
        score_breakdown["keyword_density"] +
        score_breakdown["formatting_score"] +
        score_breakdown["length_score"]
    )
    
    return score_breakdown
