import PyPDF2
import pdfplumber
from docx import Document
import re
import spacy
from io import BytesIO

nlp = spacy.load("en_core_web_sm")

async def parse_resume(file_content: bytes, filename: str) -> dict:
    """
    Parse resume and extract structured information
    """
    # Extract text based on file type
    if filename.endswith('.pdf'):
        text = extract_text_from_pdf(file_content)
    elif filename.endswith('.docx'):
        text = extract_text_from_docx(file_content)
    else:
        raise ValueError("Unsupported file format")
    
    # Extract structured sections
    parsed_data = {
        "raw_text": text,
        "personal_info": extract_personal_info(text),
        "contact": extract_contact_info(text),
        "education": extract_education(text),
        "experience": extract_experience(text),
        "skills": extract_skills(text),
        "certifications": extract_certifications(text),
        "summary": extract_summary(text)
    }
    
    return parsed_data

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF using pdfplumber"""
    text = ""
    with pdfplumber.open(BytesIO(file_content)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX"""
    doc = Document(BytesIO(file_content))
    text = "\n".join([para.text for para in doc.paragraphs])
    return text

def extract_personal_info(text: str) -> dict:
    """Extract name using NLP"""
    doc = nlp(text[:500])  # Process first 500 chars
    name = ""
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            name = ent.text
            break
    return {"name": name}

def extract_contact_info(text: str) -> dict:
    """Extract email and phone"""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    
    emails = re.findall(email_pattern, text)
    phones = re.findall(phone_pattern, text)
    
    return {
        "email": emails[0] if emails else "",
        "phone": phones[0] if phones else ""
    }

def extract_education(text: str) -> list:
    """Extract education details"""
    education_keywords = [
        "Bachelor", "Master", "PhD", "B.Tech", "M.Tech", 
        "BCA", "MCA", "B.Sc", "M.Sc", "MBA"
    ]
    
    education = []
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        for keyword in education_keywords:
            if keyword.lower() in line.lower():
                education.append({
                    "degree": line.strip(),
                    "year": extract_year(line)
                })
                break
    
    return education

def extract_experience(text: str) -> list:
    """Extract work experience"""
    experience_keywords = ["experience", "work history", "employment"]
    experience = []
    
    # Simple extraction - can be enhanced
    lines = text.split('\n')
    in_experience_section = False
    
    for line in lines:
        if any(keyword in line.lower() for keyword in experience_keywords):
            in_experience_section = True
            continue
        
        if in_experience_section and line.strip():
            year = extract_year(line)
            if year:
                experience.append({
                    "position": line.strip(),
                    "duration": year
                })
    
    return experience

def extract_skills(text: str) -> list:
    """Extract technical skills"""
    # Common technical skills database
    common_skills = [
        "python", "java", "javascript", "react", "node.js", "fastapi",
        "django", "flask", "sql", "mongodb", "aws", "docker", "kubernetes",
        "machine learning", "deep learning", "nlp", "computer vision",
        "git", "html", "css", "typescript", "postgresql", "mysql"
    ]
    
    text_lower = text.lower()
    found_skills = []
    
    for skill in common_skills:
        if skill in text_lower:
            found_skills.append(skill)
    
    return list(set(found_skills))

def extract_certifications(text: str) -> list:
    """Extract certifications"""
    cert_keywords = ["certification", "certified", "certificate"]
    certifications = []
    
    lines = text.split('\n')
    for line in lines:
        if any(keyword in line.lower() for keyword in cert_keywords):
            certifications.append(line.strip())
    
    return certifications

def extract_summary(text: str) -> str:
    """Extract professional summary"""
    summary_keywords = ["summary", "objective", "profile"]
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        if any(keyword in line.lower() for keyword in summary_keywords):
            # Return next 3-5 lines as summary
            summary_lines = lines[i+1:i+6]
            return ' '.join([l.strip() for l in summary_lines if l.strip()])
    
    return text[:300]  # First 300 chars as fallback

def extract_year(text: str) -> str:
    """Extract year from text"""
    year_pattern = r'\b(19|20)\d{2}\b'
    years = re.findall(year_pattern, text)
    return years[0] if years else ""
