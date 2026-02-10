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
    
    # Options for the dropdown
    options = ["Upload Your Own File"] + json_files
    
    # Let user select a file
    # We use index=0 to default to "Upload Your Own File"
    selected_option = st.selectbox("Choose Question Source:", options, index=0)
    
    if selected_option != "Upload Your Own File":
        # Load the selected question bank
        try:
            initial_data = load_json(selected_option)
            initial_data_json = json.dumps(initial_data)
            # Inject data into JS
            script_js = f"window.initial_data = {initial_data_json};\n" + script_js
        except Exception as e:
            st.error(f"Error loading {selected_option}: {e}")
            initial_data_json = "null"
    else:
        # User wants to upload manually via the App's UI
        initial_data_json = "null"

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
