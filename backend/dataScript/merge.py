import json

# Load courses.json
with open('courses.json', 'r') as f:
    courses_data = json.load(f)

# Load uiuc-gpa-dataset
with open('uiuc-gpa-dataset-2020-current.json', 'r') as f:
    gpa_data = json.load(f)

# Add data from courses.json to uiuc-gpa-dataset
for course in courses_data:
    course_code = f"{course['subj']} {course['code']}"
    for title in gpa_data.keys():
        if title.startswith(course_code):
            # print(f"Found {course_code} in {title}")
            # gpa_data[title]['course_name'] = course['name']
            gpa_data[title] = {
                'credits': course['credits'],
                **gpa_data[title]
            }
            
            # # Add sections for each professor
            for section in course['sections']:
                professors = set(section['prof'].replace('Prof. ', '').split(', '))
                for prof in professors:
                    prof_last_name = prof.split()[-1]
                    prof_initial = prof[0]
                    for gpa_prof in gpa_data[title].keys():
                        if gpa_prof.startswith(prof_last_name):
                            if 'sections' not in gpa_data[title][gpa_prof]:
                                gpa_data[title][gpa_prof]['sections'] = []
                            gpa_data[title][gpa_prof]['sections'].append({
                                'section_id': section['code'],
                                'term': section['time'],
                                'room': section['room'],
                                'pot': section['pot'],
                                'days': section['days'],
                                'type': section['type'],
                                'loc': section['loc'],
                            })
                            break
                    else:
                        new_prof_key = f"{prof_initial}, {prof_last_name}."
                        gpa_data[title][new_prof_key] = {
                            'avg_gpa': 0,
                            'last_semester_gpa': 0,
                            'sections': [{
                                'section_id': section['code'],
                                'term': section['time'],
                                'room': section['room'],
                                'pot': section['pot'],
                                'days': section['days'],
                                'type': section['type'],
                                'loc': section['loc'],
                            }]
                        }


# Save the updated uiuc-gpa-dataset
with open('uiuc-gpa-dataset-2020-current.json', 'w') as f:
    json.dump(gpa_data, f, indent=4)
