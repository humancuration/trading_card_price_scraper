from typing import List, Dict, Optional
from pydantic import BaseModel
import re

class CardVariant(BaseModel):
    type: str
    name: str
    id: str
    img_link: str
    final_link: str
    price_modifier: float

def get_base_set_variants(card_name: str, card_id: str) -> List[CardVariant]:
    """Special handling for Base Set cards which can have shadowless variants"""
    variants = []
    
    # Only certain cards from Base Set can be shadowless
    shadowless_eligible = [
        "Alakazam", "Blastoise", "Chansey", "Charizard", "Clefairy",
        "Gyarados", "Hitmonchan", "Machamp", "Magneton", "Mewtwo",
        "Nidoking", "Ninetales", "Poliwrath", "Raichu", "Venusaur",
        "Zapdos"
    ]
    
    if any(name.lower() in card_name.lower() for name in shadowless_eligible):
        # Modify the card ID for shadowless variant
        shadowless_id = f"{card_id}_shadowless"
        
        variants.append(CardVariant(
            type="shadowless",
            name=f"{card_name} (Shadowless)",
            id=shadowless_id,
            img_link=f"https://your-image-cdn.com/cards/{shadowless_id}.jpg",
            final_link=f"https://your-site.com/cards/{shadowless_id}",
            price_modifier=2.5  # Shadowless typically commands a premium
        ))
    
    return variants

def get_symbol_variants(card_name: str, card_id: str) -> List[CardVariant]:
    """Handle cards that can have symbol/no symbol variants"""
    variants = []
    
    # Check if the card is from sets that had symbol variations
    set_pattern = r"(Jungle|Fossil|Team Rocket|Gym Heroes|Gym Challenge)"
    if re.search(set_pattern, card_id, re.IGNORECASE):
        no_symbol_id = f"{card_id}_no_symbol"
        
        variants.append(CardVariant(
            type="no_symbol",
            name=f"{card_name} (No Symbol)",
            id=no_symbol_id,
            img_link=f"https://your-image-cdn.com/cards/{no_symbol_id}.jpg",
            final_link=f"https://your-site.com/cards/{no_symbol_id}",
            price_modifier=1.5  # No symbol variants typically command a premium
        ))
    
    return variants

def get_artwork_variants(card_name: str, card_id: str) -> List[CardVariant]:
    """Handle cards with alternate artworks"""
    variants = []
    
    # Define cards with known alternate artworks
    artwork_variants = {
        "pikachu": [
            ("yellow_cheeks", "Yellow Cheeks", 1.2),
            ("red_cheeks", "Red Cheeks", 1.5),
            ("e3_stamp", "E3 Stamp", 3.0)
        ],
        "mewtwo": [
            ("galaxy", "Galaxy Foil", 2.0),
            ("gold_stamp", "Gold Stamp", 1.8)
        ]
        # Add more cards and their variants as needed
    }
    
    # Check if this card has known artwork variants
    card_key = next((k for k in artwork_variants.keys() if k in card_name.lower()), None)
    if card_key:
        for variant_id, variant_name, price_mod in artwork_variants[card_key]:
            variant_full_id = f"{card_id}_{variant_id}"
            variants.append(CardVariant(
                type="artwork_variant",
                name=f"{card_name} ({variant_name})",
                id=variant_full_id,
                img_link=f"https://your-image-cdn.com/cards/{variant_full_id}.jpg",
                final_link=f"https://your-site.com/cards/{variant_full_id}",
                price_modifier=price_mod
            ))
    
    return variants

def get_card_variants(card_name: str, card_id: str) -> List[CardVariant]:
    """Main function to get all variants for a given card"""
    variants = []
    
    # Check for Base Set variants (shadowless)
    variants.extend(get_base_set_variants(card_name, card_id))
    
    # Check for symbol/no symbol variants
    variants.extend(get_symbol_variants(card_name, card_id))
    
    # Check for artwork variants
    variants.extend(get_artwork_variants(card_name, card_id))
    
    return variants
