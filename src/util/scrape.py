import requests
import json
import os
import xml.etree.ElementTree as ET

def scrape_subjects(url):
    response = requests.get(url)
    response.raise_for_status()
    
    root = ET.fromstring(response.content)
    subjects = []
    
    for subject in root.findall('.//subject'):
        subject_id = subject.get('id')
        subject_name = subject.text
        subject_url = subject.get('href')
        
        # Fetch additional data from the subject URL
        subject_response = requests.get(subject_url)
        subject_response.raise_for_status()
        subject_root = ET.fromstring(subject_response.content)
        
        college_code = subject_root.find('.//collegeCode').text
        
        subjects.append({
            'code': subject_id,
            'name': subject_name,
            'college': college_code
        })
    
    return subjects

def save_data_to_json(subjects, filepath):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(subjects, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    url = "https://courses.illinois.edu/cisapp/explorer/schedule/2025/spring.xml"
    subjects = scrape_subjects(url)
    save_data_to_json(subjects, "./src/content/subject.json")