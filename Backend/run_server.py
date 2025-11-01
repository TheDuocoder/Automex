#!/usr/bin/env python
"""Simple script to run the FastAPI server"""
import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

if __name__ == "__main__":
    import uvicorn
    
    print("\n" + "="*60)
    print("   AUTOMEX BACKEND SERVER")
    print("="*60)
    print("\nStarting server on http://localhost:8000")
    print("API Docs: http://localhost:8000/api/docs")
    print("\nPress Ctrl+C to stop")
    print("="*60 + "\n")
    
    uvicorn.run(
        "automex_backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

