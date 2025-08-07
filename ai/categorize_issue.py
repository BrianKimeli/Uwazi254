# ai/categorize_issue.py

import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

# Fetch the Gemini API key
api_key = os.getenv("GOOGLE_API_KEY")

# Validate the API key
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in environment. Please set it in your .env file.")

# Configure the Gemini API client
genai.configure(api_key=api_key)

# Use a lightweight model with better quota handling
model = genai.GenerativeModel("gemini-1.5-flash")

# Define issue categorization function
def categorize_issue(issue_description: str) -> str:
    """
    Categorizes a citizen-reported issue into a major category and severity level.

    Args:
        issue_description (str): A plain text description of the issue.

    Returns:
        str: JSON-formatted string with 'category' and 'severity' keys.
    """
    prompt = f"""
You are an AI assistant categorizing citizen issues in Kenya.
Classify the following report into one of these categories: 
["Water", "Roads", "Electricity", "Health", "Education", "Security", "Waste Management", "Housing", "Employment", "Corruption"]

Also assign a severity level: "High", "Medium", or "Low", based on urgency and community impact.

Issue:
\"{issue_description}\"

Return only a JSON object like this:
{{
  "category": "...",
  "severity": "..."
}}
"""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error: {e}"
