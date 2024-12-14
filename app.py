# -*- coding: utf-8 -*-

from flask import Flask, render_template, send_from_directory, request, jsonify
import os
import requests

app = Flask(__name__)

# URL del webhook de Make.com
WEBHOOK_URL = 'https://hook.us2.make.com/8qetulx1rrm4hnqe19ht67ewez0qy1kk'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/catalogo')
def catalogo():
    catalog = request.args.get('catalog', '')
    return render_template('catalogo.html', catalog=catalog)

@app.route('/carrito')
def carrito():
    return render_template('carrito.html')

@app.route('/factura')
def factura():
    return render_template('factura.html')

@app.route('/confirmacion')
def confirmacion():
    return render_template('confirmacion.html')

@app.route('/images/<path:catalog>/<path:filename>')
def serve_image(catalog, filename):
    return send_from_directory(os.path.join('static', 'images', catalog), filename)

@app.route('/submit-order', methods=['POST'])
def submit_order():
    try:
        # Obtener los datos del pedido
        order_data = request.json
        
        # Enviar el pedido a Make.com
        response = requests.post(WEBHOOK_URL, json=order_data)
        
        if response.status_code == 200:
            return jsonify({"status": "success", "message": "Pedido enviado correctamente"})
        else:
            return jsonify({"status": "error", "message": "Error al enviar el pedido"}), 500
            
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    # Obtener el puerto del ambiente (Render lo proporcionará) o usar 5001 por defecto
    port = int(os.environ.get("PORT", 5001))
    # En producción, debug debe estar en False
    app.run(host='0.0.0.0', port=port, debug=False)
