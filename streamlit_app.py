import streamlit as st
import json
import os

# Set page configuration
st.set_page_config(
    page_title="Antigravity MCQ Bank",
    layout="centered",
    initial_sidebar_state="collapsed",
)

def load_file(filename):
    with open(filename, "r", encoding="utf-8") as f:
        return f.read()

def load_json(filename):
    with open(filename, "r", encoding="utf-8") as f:
        return json.load(f)

# Load existing files
try:
    index_html = load_file("index.html")
    styles_css = load_file("styles.css")
    script_js = load_file("script.js")
    
    # Get all JSON files in current directory
    json_files = [f for f in os.listdir(".") if f.endswith(".json")]
    
    # Read all question banks into a dictionary
    banks_data = {}
    for jf in json_files:
        try:
            banks_data[jf] = load_json(jf)
        except Exception as e:
            print(f"Error loading {jf}: {e}")
            
    banks_json = json.dumps(banks_data)
    
    # Inject data into JS
    script_js = f"window.availableBanks = {banks_json};\n" + script_js

    # Combine into a single HTML string
    # We inject CSS into <head> and JS at the end of <body>
    full_html = index_html.replace(
        '<link rel="stylesheet" href="styles.css">',
        f"<style>{styles_css}</style>"
    ).replace(
        '<script src="script.js"></script>',
        f"<script>{script_js}</script>"
    )

    # Render the HTML
    st.components.v1.html(full_html, height=800, scrolling=True)

except FileNotFoundError as e:
    st.error(f"Error loading required files: {e}")
    st.stop()
