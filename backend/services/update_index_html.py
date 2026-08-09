import json
import os
import re

print("Syncing all 800 items directly into index.html...")

with open(os.path.join(os.path.dirname(__file__), "all_800_data.json"), "r", encoding="utf-8") as f:
    data = json.load(f)

items = data["items"]

# Category slug mapping in index.html:
# 1 -> billionaires
# 2 -> supercars
# 3 -> smartphones
# 4 -> universities
# 5 -> airlines
# 6 -> tech-companies
# 7 -> luxury-hotels
# 8 -> football-clubs

cat_map = {
    1: "billionaires",
    2: "supercars",
    3: "smartphones",
    4: "universities",
    5: "airlines",
    6: "tech-companies",
    7: "luxury-hotels",
    8: "football-clubs"
}

html_items = []
for item in items:
    cat_slug = cat_map[item["category_id"]]
    cv = item["custom_values"]
    
    specs = {}
    if cat_slug == "billionaires":
        specs = {
            "Net Worth ($B)": f"${cv.get('net_worth')} Billion",
            "Source of Wealth": cv.get("source_of_income"),
            "Country": cv.get("country"),
            "Age": cv.get("age"),
            "Official Website": cv.get("website")
        }
    elif cat_slug == "supercars":
        specs = {
            "Price ($)": cv.get("price"),
            "Horsepower (HP)": f"{cv.get('horsepower')} HP",
            "Top Speed (km/h)": f"{cv.get('top_speed')} km/h",
            "Engine": cv.get("engine"),
            "Official Website": cv.get("website")
        }
    elif cat_slug == "smartphones":
        specs = {
            "Price ($)": cv.get("price"),
            "Processor / Silicon": cv.get("processor"),
            "Camera Optics": cv.get("camera"),
            "Battery & Charging": cv.get("battery"),
            "RAM & Storage": f"{cv.get('ram')} | {cv.get('storage')}",
            "Official Website": cv.get("website")
        }
    elif cat_slug == "universities":
        specs = {
            "Country": cv.get("country"),
            "Founded": cv.get("founded"),
            "Acceptance Rate": cv.get("acceptance_rate"),
            "Enrollment": f"{cv.get('students')} Students",
            "Official Website": cv.get("website")
        }
    elif cat_slug == "airlines":
        specs = {
            "Hub Country": cv.get("country"),
            "Fleet Size": cv.get("fleet_size"),
            "Flagship Cabin": cv.get("luxury_cabin"),
            "Safety Rating": cv.get("safety_rating", "7/7 Skytrax 5-Star"),
            "Official Website": cv.get("website")
        }
    elif cat_slug == "tech-companies":
        specs = {
            "Market Cap ($B)": cv.get("market_cap"),
            "Country": cv.get("country"),
            "Core Technology": cv.get("core_technology"),
            "Headquarters": cv.get("headquarters"),
            "Official Website": cv.get("website")
        }
    elif cat_slug == "luxury-hotels":
        specs = {
            "Nightly Rate": cv.get("nightly_rate"),
            "Country": cv.get("country"),
            "Signature Suite": cv.get("signature_suite"),
            "Gastronomy Rating": cv.get("michelin_distinction"),
            "Official Website": cv.get("website")
        }
    elif cat_slug == "football-clubs":
        specs = {
            "Valuation ($B)": cv.get("valuation"),
            "European & League Titles": cv.get("ucl_titles"),
            "Home Stadium": cv.get("stadium"),
            "Country": cv.get("country"),
            "Official Website": cv.get("website")
        }
    
    html_items.append({
        "id": item["id"],
        "category_id": cat_slug,
        "rank": item["rank"],
        "title": item["title"],
        "country": item["country"],
        "views": item["views_count"],
        "image_url": item["image_url"],
        "description": item["description"],
        "website": cv.get("website", "https://www.google.com"),
        "specs": specs
    })

index_html_path = r"e:\100online\index.html"
with open(index_html_path, "r", encoding="utf-8") as f:
    html_content = f.read()

# Replace generateFull800Dataset function
new_function = f"""    function generateFull800Dataset() {{
      return {json.dumps(html_items, indent=6)};
    }}"""

start_marker = "    function generateFull800Dataset() {"
end_marker = "    const localItems = generateFull800Dataset();"

start_idx = html_content.find(start_marker)
end_idx = html_content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    updated_html = html_content[:start_idx] + new_function + "\n\n" + html_content[end_idx:]
    with open(index_html_path, "w", encoding="utf-8") as f:
        f.write(updated_html)
    print("SUCCESS: index.html updated with all 800 authentic items!")
else:
    print("Error finding markers in index.html")
