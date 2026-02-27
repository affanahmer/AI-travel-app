import re
from typing import Dict, Any

# spaCy is optional — regex fallback handles the core functionality
try:
    import spacy
    _nlp = spacy.load("en_core_web_sm")
    SPACY_AVAILABLE = True
except Exception:
    _nlp = None
    SPACY_AVAILABLE = False


def parse_travel_query(query: str) -> Dict[str, Any]:
    """
    Parses a natural language query like:
      "Plan a 3-day trip to northern Pakistan under 25,000 PKR"
    Returns: {"destination": str, "days": int, "budget": int}
    """
    result = {
        "destination": "",
        "days": 0,
        "budget": 0
    }

    if not query:
        return result

    lower_query = query.lower()

    # ── Budget parsing ──
    # Match patterns like "25,000 PKR", "under 25000", "budget 50k"
    budget_patterns = [
        (r'(?:under|below|around|within|max|budget\s*(?:of)?)\s*([\d,]+)\s*(?:pkr|rs|rupees)?', False),
        (r'([\d,]+)\s*(?:pkr|rs|rupees)', False),
        (r'([\d]+)\s*k\b', True),  # "50k" → multiply by 1000
    ]
    for pattern, is_k_suffix in budget_patterns:
        match = re.search(pattern, lower_query, re.IGNORECASE)
        if match:
            budget_str = match.group(1).replace(',', '')
            budget_val = int(budget_str)
            if is_k_suffix:
                budget_val *= 1000
            if budget_val > 500:  # Sanity check — must be a realistic amount
                result["budget"] = budget_val
                break

    # ── Days parsing ──
    days_match = re.search(r'(\d+)\s*[- ]*(?:day|days)', lower_query, re.IGNORECASE)
    if days_match:
        result["days"] = int(days_match.group(1))
    elif 'weekend' in lower_query:
        result["days"] = 2
    else:
        week_match = re.search(r'(\d+)\s*(?:week|weeks)', lower_query, re.IGNORECASE)
        if week_match:
            result["days"] = int(week_match.group(1)) * 7

    # ── Destination parsing (spaCy NER when available) ──
    if SPACY_AVAILABLE and _nlp is not None:
        doc = _nlp(query)
        locations = [ent.text for ent in doc.ents if ent.label_ in ("GPE", "LOC")]
        if locations:
            result["destination"] = " ".join(locations)

    # Regex fallback for destination
    if not result["destination"]:
        # Known Pakistan regions/destinations for direct matching
        known_places = [
            "hunza", "skardu", "murree", "naran", "kaghan", "lahore",
            "islamabad", "karachi", "peshawar", "quetta", "gwadar",
            "swat", "chitral", "gilgit", "fairy meadows", "neelum",
            "azad kashmir", "mohenjo-daro", "taxila", "multan",
            "northern pakistan", "north pakistan", "northern areas",
            "gilgit baltistan", "khyber pakhtunkhwa", "punjab",
            "sindh", "balochistan",
        ]
        for place in known_places:
            if place in lower_query:
                result["destination"] = place.title()
                break

        # Generic extraction: everything after "to" up to a stop word
        if not result["destination"]:
            to_match = re.search(r'\bto\s+([^,.]+)', query, re.IGNORECASE)
            if to_match:
                dest = to_match.group(1).strip()
                dest = re.split(r'\s+(?:under|for|with|within|below|around)\s+', dest, flags=re.IGNORECASE)[0]
                result["destination"] = dest.strip()

    return result
