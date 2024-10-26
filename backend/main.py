import pandas as pd
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

import card_scraper
from .card_variants import get_card_variants, CardVariant


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RowData(BaseModel):
    card_name: str  # Keep camelCase for compatibility with your React app
    card_id: str    # Keep camelCase for compatibility with your React app
    holo: bool
    reverse_holo: bool
    first_edition: bool
    card_count: int
    estimated_grades: Optional[str] = None  # New field

class CardInput(BaseModel):
    cards: List[RowData]

def get_results_from_state(request: Request):
    return request.app.state.results

# @app.get("/")
# async def read_root():
#     return {"message": "Hello, World!"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/submit")
async def submit_cards(card_input: CardInput, request: Request):  # Accept card_input and request
    valid_rows = [row for row in card_input.cards if row.card_name.strip() and row.card_id.strip()]

    if not valid_rows:
        raise HTTPException(status_code=400, detail="No valid rows to submit")

    # Convert valid rows to a list of dictionaries
    data = []
    for row in valid_rows:
        # Create a dictionary for each valid row
        card_data = {
            "card": row.card_name,
            "id": row.card_id,
            "holo": row.holo,
            "reverse_holo": row.reverse_holo,
            "first_edition": row.first_edition,
            "card_count": row.card_count,
            "estimated_grades": row.estimated_grades.split(',') if row.estimated_grades else None
        }
        data.append(card_data)

    # Create a DataFrame
    df = pd.DataFrame(data)
    df['card_count'] = df['card_count'].astype(str)

    # Call the card finder and store the results in app state
    results = card_scraper.card_finder(df)
    request.app.state.results = results  # Store the results in app.state
    
    # Print the DataFrame to the console
    print(f"DataFrame:\n{df}", flush=True)

    return {"message": "Data submitted successfully", "valid_rows": df.to_dict(orient="records")}

@app.get("/results")
async def get_results(request: Request):
    results = get_results_from_state(request)
    # card_totals = get_card_totals_from_state(request)

    # Debugging: Log the results and card_totals
    print("Results from get_results_from_state:", results)  # Check what results contain
    # print("Original card_totals:", card_totals)

    if results is None or len(results) == 0:
        raise HTTPException(status_code=404, detail="No results found")

    # print("Final card_totals to return:", totals_dict)  # Log the final totals to be returned
    print("Final results to return:", results)  # Log the final results to be returned

    return {
        "results": results,
    }
    

@app.get("/variants", response_model=List[CardVariant])
async def get_variants(card: str, id: str):
    try:
        variants = get_card_variants(card, id)
        return variants
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
