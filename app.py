from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='frontend')
CORS(app)

# Configuración
CATALOG_FOLDER = 'catalogs'
ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return send_from_directory('frontend', 'index.html')

@app.route('/styles.css')
def styles():
    return send_from_directory('frontend', 'styles.css')

@app.route('/app.js')
def app_js():
    return send_from_directory('frontend', 'app.js')

@app.route('/api/catalogs', methods=['GET'])
def get_catalogs():
    catalogs = []
    for filename in os.listdir(CATALOG_FOLDER):
        if allowed_file(filename):
            catalog_name = filename.rsplit('.', 1)[0]
            catalogs.append({
                'id': len(catalogs) + 1,
                'name': catalog_name,
                'filename': filename,
                'url': f'/api/pdf/{filename}'
            })
    return jsonify(catalogs)

@app.route('/api/pdf/<filename>')
def serve_pdf(filename):
    return send_from_directory(CATALOG_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
