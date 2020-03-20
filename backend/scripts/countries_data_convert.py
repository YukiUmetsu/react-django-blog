import csv
import json
data = []

with open('../countries/fixtures/countries_data.csv', mode='r') as csv_file:
    csv_reader = csv.reader(csv_file)
    line_count = 0

    for row in csv_reader:
        numeric_code = row[0]
        two_code = row[1]
        three_code = row[2]
        desc = row[3]
        data.append({
            "model": "countries.countries",
            "pk": line_count+1,
            "fields": {
                "numeric_code": int(numeric_code),
                "two_code": f'{two_code}',
                "three_code": f'{three_code}',
                "description": f'{desc}'
            }
        })
        line_count += 1

    with open('../countries/fixtures/countries_fixtures.json', 'w') as outfile:
        json.dump(data, outfile)