
from flask import Flask, jsonify
import json

app = Flask(__name__)

@app.route('/schema')
def get_schema():
    with open('cigarmaestro.json', 'r') as f:
        schema = json.load(f)
    return jsonify(schema)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
