import os, sys, subprocess, signal, time
from flask import Flask, jsonify
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
    liberar_porta(5000)
    app.run(port=5000, debug=True)
