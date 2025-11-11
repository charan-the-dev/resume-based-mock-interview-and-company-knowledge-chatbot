import os
import json
import base64
import datetime
import traceback
from typing import Dict

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# NOTE: Firebase imports are performed inside a guarded initialization block below
# so that this module can run even if firebase_admin is not installed or misconfigured.

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

# ---------------- Robust Firebase initialization (safe, won't raise) ----------------
# We deliberately avoid top-level imports of firebase_admin so the module can be
# imported and run in environments where firebase_admin isn't available.

db = None
_firestore = None
_firebase_admin = None
try:
    try:
        # Import here so ImportError can be handled gracefully
        import firebase_admin as _fb
        from firebase_admin import credentials as _credentials
        from firebase_admin import firestore as _firestore
        _firebase_admin = _fb
        _firestore = _firestore
        # Keep credentials reference for use below
        credentials_module = _credentials
    except ImportError:
        print("Info: firebase_admin package not installed — Firestore integration disabled.")
        _firebase_admin = None
        _firestore = None
        credentials_module = None

    initialized = False

    if _firebase_admin and credentials_module and _firestore:
        # Support either:
        # 1) FIREBASE_SERVICE_ACCOUNT_PATH -> path to JSON file
        # 2) FIREBASE_SERVICE_ACCOUNT -> raw JSON string
        sa_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
        sa_json = os.getenv("FIREBASE_SERVICE_ACCOUNT")

        # Helper to check whether firebase_app initialized in a safe way
        def _is_initialized(fb_mod):
            # use getattr to avoid AttributeError if internals change
            apps = getattr(fb_mod, "_apps", None)
            if apps is None:
                # Newer firebase_admin versions expose `apps` instead of `_apps`
                apps = getattr(fb_mod, "apps", None)
            return bool(apps)

        try:
            # 1) Try path if provided and exists
            if sa_path:
                if os.path.exists(sa_path):
                    try:
                        if not _is_initialized(_firebase_admin):
                            cred = credentials_module.Certificate(sa_path)
                            _firebase_admin.initialize_app(cred)
                        db = _firestore.client()
                        initialized = True
                        print(f"Firebase Admin initialized using service account file: {sa_path}")
                    except Exception as e:
                        print(f"Warning: Error initializing Firebase from path {sa_path}: {e}")
                        traceback.print_exc()
                else:
                    print(f"FIREBASE_SERVICE_ACCOUNT_PATH set but file not found at: {sa_path}")

            # 2) Try JSON string in env var
            if not initialized and sa_json:
                try:
                    sa_obj = json.loads(sa_json)
                    if not _is_initialized(_firebase_admin):
                        cred = credentials_module.Certificate(sa_obj)
                        _firebase_admin.initialize_app(cred)
                    db = _firestore.client()
                    initialized = True
                    print("Firebase Admin initialized using FIREBASE_SERVICE_ACCOUNT JSON env var.")
                except json.JSONDecodeError:
                    print("FIREBASE_SERVICE_ACCOUNT is set but not valid JSON.")
                except Exception as e:
                    print(f"Warning: Error initializing Firebase from JSON env var: {e}")
                    traceback.print_exc()

            # 3) Fallback to Application Default Credentials (useful on GCP)
            if not initialized:
                try:
                    if not _is_initialized(_firebase_admin):
                        _firebase_admin.initialize_app()
                    db = _firestore.client()
                    initialized = True
                    print("Firebase Admin initialized using default application credentials.")
                except Exception as e:
                    print("Info: Could not initialize Firebase Admin using default credentials:", e)
                    # Don't print traceback for expected environment errors
                    db = None

            if db is None:
                print("Info: Firestore client not initialized; Firestore writes will be skipped.")

        except Exception as e:
            print(f"❌ Unexpected error during Firebase initialization: {e}")
            traceback.print_exc()
            db = None
    else:
        # firebase_admin not available — make sure db remains None
        db = None
except Exception as e:
    # Catch any other weirdness — the app should still start without Firebase
    print(f"❌ Unhandled exception in Firebase init: {e}")
    traceback.print_exc()
    db = None
# ------------------------------------------------------------------------------


@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)) -> Dict:
    """
    Main endpoint for resume analysis.
    Expects file (PDF, DOCX, DOC). Returns parsed data, scores, LLM suggestions, and
    attempts to save a compact summary + full analysis to Firestore if configured.
    """
    try:
        # Validate file type
        allowed_extensions = ['.pdf', '.docx', '.doc']
        file_extension = os.path.splitext(file.filename)[1].lower()

        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail="File type not supported. Use PDF or DOCX."
            )

        # Read file content
        file_content = await file.read()

        if len(file_content) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded")

        print(f"\n=== Processing: {file.filename} ===")
        print(f"File size: {len(file_content)} bytes")

        # Deferred imports to show import errors clearly
        from parsers.resume_parser import parse_resume
        from analyzers.hard_scoring import calculate_hard_score
        from analyzers.soft_scoring import calculate_soft_score
        from utils.llm_client import get_llm_suggestions

        # Step 1: Parse resume content
        print("Step 1: Parsing resume...")
        parsed_data = await parse_resume(file_content, file.filename)
        name_found = parsed_data.get('personal_info', {}).get('name', 'N/A')
        print(f"✓ Parsed. Name found: {name_found}")
        print(f"✓ Skills found: {len(parsed_data.get('skills', []))}")

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

        # ---------------- Save concise summary + full analysis to Firestore ----------------
        try:
            # If Firestore not configured, skip gracefully (no exception)
            if db is None:
                print("Info: Firestore client not initialized; skipping save (no error).")
                result["firebase_save_skipped"] = True
            else:
                # Ensure we have firestore client available and guard all firestore calls
                try:
                    # Basic metadata we already know
                    file_size = len(file_content)
                    file_type = file_extension

                    # Extract small subset of important fields (simple JSON-friendly types)
                    summary_data = {
                        "name": parsed_data.get("personal_info", {}).get("name", "Unknown"),
                        "overall_score": overall,
                        "hard_score": hard_score.get("total_score", 0),
                        "soft_score": soft_score.get("total_score", 0),
                        "filename": file.filename,
                        "uploaded_at": datetime.datetime.utcnow().isoformat()
                    }

                    # Create a new document with an auto-generated ID and set summary (structured)
                    doc_ref = db.collection("resumes").document()
                    doc_ref.set(summary_data)
                    firebase_doc_id = doc_ref.id
                    print(f"✓ Saved compact resume summary to Firestore (doc id = {firebase_doc_id})")

                    # Helper to sanitize objects so everything is JSON/Firestore friendly
                    def sanitize(obj):
                        # Primitive types pass through
                        if obj is None or isinstance(obj, (bool, int, float, str)):
                            return obj
                        # Datetime -> ISO string
                        if isinstance(obj, datetime.datetime):
                            return obj.isoformat()
                        # Bytes -> decode if possible, otherwise base64
                        if isinstance(obj, (bytes, bytearray)):
                            try:
                                return obj.decode("utf-8", errors="ignore")
                            except Exception:
                                return base64.b64encode(bytes(obj)).decode("utf-8")
                        # Dict -> sanitize recursively
                        if isinstance(obj, dict):
                            return {str(k): sanitize(v) for k, v in obj.items()}
                        # Iterable (lists, tuples, sets) -> list of sanitized items
                        if isinstance(obj, (list, tuple, set)):
                            return [sanitize(v) for v in obj]
                        # Fallback: convert to string
                        return str(obj)

                    # Build analysis_data using the in-memory variables (parsed_data, hard_score, etc.)
                    analysis_data = {
                        "firebase_doc_id": firebase_doc_id,
                        "filename": file.filename,
                        "uploaded_at": datetime.datetime.utcnow().isoformat(),
                        "personal_info": sanitize(parsed_data.get("personal_info", {})),
                        "education": sanitize(parsed_data.get("education", [])),
                        "experience": sanitize(parsed_data.get("experience", [])),
                        "skills": sanitize(parsed_data.get("skills", [])),
                        "projects": sanitize(parsed_data.get("projects", [])),
                        "certifications": sanitize(parsed_data.get("certifications", [])),
                        "achievements": sanitize(parsed_data.get("achievements", [])),
                        "scores": {
                            "overall_score": overall,
                            "hard_skills": sanitize(hard_score),
                            "soft_skills": sanitize(soft_score),
                        },
                        "recommendations": sanitize(llm_suggestions),
                        "parsed_content": sanitize(parsed_data),
                        "metadata": {
                            "processing_timestamp": datetime.datetime.utcnow().isoformat(),
                            "file_size": file_size,
                            "file_type": file_type,
                        }
                    }

                    # Save the structured analysis to Firestore using the same document ID
                    db.collection("analysis").document(firebase_doc_id).set(analysis_data)
                    print(f"✓ Saved structured analysis to Firestore (analysis/{firebase_doc_id})")

                    # Include Firebase ID in API response
                    result["firebase_doc_id"] = firebase_doc_id

                except Exception as firebase_err:
                    # Catch and log Firestore-specific exceptions but don't fail the request
                    print(f"❌ Error saving to Firestore: {firebase_err}")
                    traceback.print_exc()
                    result["firebase_save_error"] = str(firebase_err)
        except Exception as firebase_err_outer:
            # Defensive catch-all for any unexpected error in the save block
            print(f"❌ Unexpected error in Firestore save block: {firebase_err_outer}")
            traceback.print_exc()
            result["firebase_save_error"] = str(firebase_err_outer)
        # ------------------------------------------------------------------------------

        return result

    except ImportError as e:
        print(f"❌ Import Error: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Module import error: {str(e)}")
    except HTTPException:
        # re-raise FastAPI HTTPExceptions as-is
        raise
    except Exception as e:
        print(f"❌ Error processing resume: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    print("Starting Resume Analyzer API...")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
