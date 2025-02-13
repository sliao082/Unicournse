import json

def get_gpa_data():
    with open('/Users/yixuan/Desktop/Unjuanable/Github/Unicournse/backend/dataScript/uiuc-gpa-dataset-2020-current.json', 'r') as file:
        return json.load(file)

def calculate_gpa(professor, gpa_data):
    professor_data = gpa_data.get(professor, {})
    avg_gpa = professor_data.get("avg_gpa", 'N/A')
    last_semester_gpa = professor_data.get("last_semester_gpa", 'N/A')
    return avg_gpa, last_semester_gpa

def process_professors(file_path):
    with open(file_path, 'r') as file:
        courses = json.load(file)
    
    gpa_data = get_gpa_data()
    
    for course in courses:
        subj = course['subj']
        code = course['code']
        name = course['name']
        sections = course.get('sections', {})
        
        for professor, section_list in sections.items():
            avg_gpa, last_semester_gpa = calculate_gpa(professor, gpa_data)
            professor_info = {
                "avg_gpa": avg_gpa,
                "sectionList": section_list
            }
            sections[professor] = professor_info

    with open(file_path, 'w') as file:
        json.dump(courses, file, indent=2)

if __name__ == "__main__":
    process_professors('/Users/yixuan/Desktop/Unjuanable/Github/Unicournse/backend/dataScript/courses.json')
