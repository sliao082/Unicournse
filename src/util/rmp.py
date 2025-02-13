from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

def scrape_professor(professor_name):
    url = f"https://www.ratemyprofessors.com/search/professors/1112?q={professor_name}"
    print(url)
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    professors = []
    for prof in soup.find_all('a', class_='TeacherCard__StyledTeacherCard-syjs0d-0'):
        name_tag = prof.find('div', class_='CardName__StyledCardName-sc-1gyrgim-0')
        if name_tag:
            name = ' '.join(name_tag.stripped_strings)
            if len(professor_name.split()) == 2 and professor_name.split()[0].lower() == name.split()[0][0].lower() and professor_name.split()[1].lower() == name.split()[1].lower():
                rating_tag = prof.find('div', class_='CardNumRating__CardNumRatingNumber-sc-17t4b9u-2')
                rating = rating_tag.text if rating_tag else 'N/A'
                professors.append({'name': name, 'rating': rating})

    return professors

@app.route('/api/professor', methods=['GET'])
def get_professor():
    professor_name = request.args.get('name')
    if not professor_name:
        return jsonify({'error': 'Professor name is required'}), 400
    if ',' in professor_name:
        last_name, first_initial = professor_name.split(',')
        professor_name = f"{first_initial.strip()} {last_name.strip()}"
    results = scrape_professor(professor_name)
    print(results)
    return jsonify(results)

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000)