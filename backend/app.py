from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app)

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASS = os.getenv("DB_PASS", "1234")
DB_NAME = os.getenv("DB_NAME", "login_demo")
DB_PORT = int(os.getenv("DB_PORT", 3306))

print("Intentando conectar a:", DB_HOST, DB_PORT)

def get_connection():
    return mysql.connector.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME,
        autocommit=True,
        connection_timeout=5,
        ssl_disabled=True
    )

@app.route("/submit", methods=["POST"])
def submit():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password", "")

    if not email:
        return jsonify({"error": "email requerido"}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, password))
        inserted_id = cur.lastrowid
        cur.close()
        conn.close()
        return jsonify({"status": "ok", "id": inserted_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/users", methods=["GET"])
def get_users():
    try:
        conn = get_connection()
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT id, email, password, created_at FROM users ORDER BY created_at DESC")
        users = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify({"users": users}), 200
    except Exception as e:
        print("ERROR REAL >>>", e)  # 👈 importante
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5050))
    app.run(host="0.0.0.0", port=port)

