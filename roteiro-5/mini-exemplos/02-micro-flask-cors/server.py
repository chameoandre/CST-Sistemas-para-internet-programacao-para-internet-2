from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Libera o acesso entre portas distintas (5500 e 5000)
CORS(app)

@app.route('/api/status', methods=['GET'])
def obter_status():
    return jsonify({
        "status": "online",
        "servidor": "Micro API Flask",
        "cidade": "Garopaba - SC"
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
