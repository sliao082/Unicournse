import pandas as pd
import json

file_path = '/Users/yixuan/Desktop/scratchs/uiuc-gpa-dataset-2020-current.csv'
df = pd.read_csv(file_path)

def calculate_gpa(row):
    grades = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.67,
        'B+': 3.33, 'B': 3.0, 'B-': 2.67,
        'C+': 2.33, 'C': 2.0, 'C-': 1.67,
        'D+': 1.33, 'D': 1.0, 'D-': 0.67,
        'F': 0.0
    }
    total_points = 0
    total_students = 0
    for grade, points in grades.items():
        total_points += row[grade] * points
        total_students += row[grade]
    return total_points / total_students if total_students > 0 else None

df['GPA'] = df.apply(calculate_gpa, axis=1)
grouped = df.groupby(['Subject', 'Number', 'Course Title', 'Primary Instructor'])

data = {}
for (subject, number, title, instructor), group in grouped:
    class_name = f"{subject} {number} {title}"
    if class_name not in data:
        data[class_name] = {}
    if instructor not in data[class_name]:
        data[class_name][instructor] = {'avg_gpa': 0, 'last_semester_gpa': 0}
    
    avg_gpa = round(group['GPA'].mean(), 2)
    last_semester_gpa = round(group.iloc[-1]['GPA'], 2)
    
    data[class_name][instructor]['avg_gpa'] = avg_gpa
    data[class_name][instructor]['last_semester_gpa'] = last_semester_gpa

# Convert to JSON
json_data = json.dumps(data, indent=4)

# Save to a JSON file
output_file_path = '/Users/yixuan/Desktop/scratchs/uiuc-gpa-dataset-2020-current.json'
with open(output_file_path, 'w') as json_file:
    json_file.write(json_data)

print(f"Data saved to {output_file_path}")