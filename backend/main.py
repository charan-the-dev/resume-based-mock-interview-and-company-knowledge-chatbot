from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
import os

app = FastAPI(title="Resume Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Resume Analyzer API is running",
        "status": "active",
        "version": "1.0.0"
    }

@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)) -> Dict:
    """
    Main endpoint for resume analysis - Uses REAL parsing
    """
    try:
        # Validate file type
        allowed_extensions = ['.pdf', '.docx', '.doc']
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"File type not supported. Use PDF or DOCX."
            )
        
        # Read file content
        file_content = await file.read()
        
        if len(file_content) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        print(f"\n=== Processing: {file.filename} ===")
        print(f"File size: {len(file_content)} bytes")
        
        # Import analysis modules
        from parsers.resume_parser import parse_resume
        from analyzers.hard_scoring import calculate_hard_score
        from analyzers.soft_scoring import calculate_soft_score
        from utils.llm_client import get_llm_suggestions
        
        # Step 1: Parse resume content
        print("Step 1: Parsing resume...")
        parsed_data = await parse_resume(file_content, file.filename)
        print(f"✓ Parsed. Name found: {parsed_data.get('personal_info', {}).get('name', 'N/A')}")
        print(f"✓ Skills found: {len(parsed_data.get('skills', []))} skills")
        
        # Step 2: Calculate hard score (quantitative)
        print("Step 2: Calculating hard score...")
        hard_score = calculate_hard_score(parsed_data)
        print(f"✓ Hard score: {hard_score.get('total_score', 0)}/100")
        
        # Step 3: Calculate soft score (qualitative)
        print("Step 3: Calculating soft score...")
        soft_score = calculate_soft_score(parsed_data)
        print(f"✓ Soft score: {soft_score.get('total_score', 0)}/100")
        
        # Step 4: Get AI suggestions
        print("Step 4: Getting AI suggestions...")
        llm_suggestions = await get_llm_suggestions(parsed_data, hard_score, soft_score)
        print("✓ AI suggestions generated")
        
        # Calculate overall score
        overall = (hard_score.get("total_score", 0) + soft_score.get("total_score", 0)) / 2
        print(f"\n=== Overall Score: {overall}/100 ===\n")
        
        # Prepare final result
        result = {
            "parsed_content": parsed_data,
            "hard_score": hard_score,
            "soft_score": soft_score,
            "overall_score": overall,
            "llm_suggestions": llm_suggestions,
            "status": "success"
        }
        
        return result
        
    except ImportError as e:
        print(f"❌ Import Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Module import error: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error processing resume: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("Starting Resume Analyzer API...")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
