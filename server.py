from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

# Cambiar al directorio public
os.chdir('public')

# Configuración del servidor
HOST = 'localhost'
PORT = 8082

print('Servidor iniciado en http://{}:{}'.format(HOST, PORT))
server_address = (HOST, PORT)
httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
httpd.serve_forever()
