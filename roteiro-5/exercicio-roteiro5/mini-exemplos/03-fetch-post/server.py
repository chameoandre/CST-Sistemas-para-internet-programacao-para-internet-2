import os, sys, subprocess, signal, time
from flask import Flask, jsonify, request
from flask_cors import CORS

def liberar_porta(porta=5000):
    """Encerra instâncias anteriores do Python ouvindo na mesma porta."""
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        return
    meu_pid, meu_pai = os.getpid(), os.getppid()
    try:
        if sys.platform == "win32":
            saida = subprocess.check_output(f"netstat -ano | findstr :{porta}", shell=True, text=True)
            for linha in saida.strip().split("\n"):
                partes = linha.split()
                if len(partes) >= 5 and "LISTENING" in partes:
                    pid = int(partes[-1])
                    if pid not in (meu_pid, meu_pai, 0):
                        subprocess.run(f"taskkill /F /PID {pid}", shell=True, capture_output=True)
                        print(f"[AUTO-CLEANUP] Servidor anterior na porta {porta} encerrado (PID {pid}).")
        else:
            cmd = ["lsof", "-ti", f":{porta}"]
            res = subprocess.run(cmd, capture_output=True, text=True)
            for pid_str in res.stdout.strip().split():
                pid = int(pid_str)
                if pid not in (meu_pid, meu_pai):
                    proc = subprocess.run(["ps", "-p", str(pid), "-o", "comm="], capture_output=True, text=True)
                    if "python" in proc.stdout.lower():
                        print(f"[AUTO-CLEANUP] Encerrando servidor Python anterior (PID {pid}) na porta {porta}...")
                        os.kill(pid, signal.SIGTERM)
                        time.sleep(0.5)
    except Exception:
        pass

app = Flask(__name__)
CORS(app)

# Lista em memória simulando armazenamento temporário
servicos_cadastrados = []

@app.route('/api/cadastrar', methods=['POST'])
def cadastrar_servico():
    # Obtém o corpo da requisição decodificado a partir do formato JSON
    dados = request.get_json()
    
    if not dados or 'nome' not in dados or 'preco' not in dados:
        return jsonify({"erro": "Campos obrigatórios ausentes."}), 400

    novo_id = len(servicos_cadastrados) + 1
    registro = {
        "id": novo_id,
        "nome": dados['nome'],
        "preco": float(dados['preco'])
    }
    servicos_cadastrados.append(registro)

    print(f"[API FLASK] Novo serviço cadastrado: {registro}")

    # Retorna o registro criado com status HTTP 201 Created
    return jsonify({
        "mensagem": "Serviço cadastrado com sucesso no servidor!",
        "registro": registro,
        "total": len(servicos_cadastrados)
    }), 201

if __name__ == '__main__':
    liberar_porta(5000)
    app.run(port=5000, debug=True)
