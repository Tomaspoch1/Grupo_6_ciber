from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os

app = Flask(__name__)
CORS(app)

DATABASE_URL = os.environ.get("DATABASE_URL")

def get_connection():
    return psycopg2.connect(DATABASE_URL)

def init_db():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email TEXT NOT NULL,
            password TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    cur.close()
    conn.close()

init_db()


@app.route("/")
def home():
    return jsonify({"status": "API funcionando correctamente ✅"})


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
        cur.execute(
            "INSERT INTO users (email, password) VALUES (%s, %s) RETURNING id;",
            (email, password)
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"status": "ok", "id": new_id}), 201
    except Exception as e:
        print("ERROR EN /submit >>>", e)
        return jsonify({"error": str(e)}), 500


@app.route("/users", methods=["GET"])
def get_users():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, email, password, created_at FROM users ORDER BY created_at DESC;")
        rows = cur.fetchall()
        users = [
            {"id": r[0], "email": r[1], "password": r[2], "created_at": str(r[3])}
            for r in rows
        ]
        cur.close()
        conn.close()
        return jsonify({"users": users}), 200
    except Exception as e:
        print("ERROR EN /users >>>", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5050))
    app.run(host="0.0.0.0", port=port)
