import os, sqlite3, smtplib, ssl, secrets
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import Flask, request, redirect, url_for, session, render_template
from werkzeug.utils import secure_filename

# --------------------------
# Config
# --------------------------
SITE_NAME = os.getenv("SITE_NAME", "Daily Cleaning Log")
BASE_URL  = os.getenv("BASE_URL", "http://localhost:5000")

SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER or "")
CLIENT_EMAILS = [e.strip() for e in os.getenv("CLIENT_EMAIL", "").split(",") if e.strip()]

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "changeme")
FLASK_SECRET = os.getenv("FLASK_SECRET", secrets.token_hex(16))

app = Flask(__name__)
app.secret_key = FLASK_SECRET

# Limit uploads (10 MB) to be safe
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

DB_PATH = "data.sqlite3"
UPLOAD_DIR = os.path.join("static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --------------------------
# DB helpers
# --------------------------
def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                image_path TEXT,
                created_at TEXT NOT NULL
            )
        """)
        conn.commit()

# Initialize at import time (works on Render)
init_db()

# --------------------------
# Email notify
# --------------------------
def notify_clients(title, body, link):
    if not CLIENT_EMAILS or not SMTP_HOST or not SMTP_USER or not SMTP_PASS:
        return False, "Email not configured"
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"{SITE_NAME}: {title}"
        msg["From"] = FROM_EMAIL or SMTP_USER
        msg["To"] = ", ".join(CLIENT_EMAILS)

        text = f"New cleaning update:\n{title}\n\n{body}\n\nView all updates: {link}"
        html = f'<p>New cleaning update:</p><h3>{title}</h3><p>{body.replace("\n","<br>")}</p><p><a href="{link}">View all updates</a></p>'
        msg.attach(MIMEText(text, "plain"))
        msg.attach(MIMEText(html, "html"))

        context = ssl.create_default_context()
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(msg["From"], CLIENT_EMAILS, msg.as_string())
        return True, "Sent"
    except Exception as e:
        return False, str(e)

# --------------------------
# Health check
# --------------------------
@app.route("/health")
def health():
    return "ok", 200

# --------------------------
# Routes
# --------------------------
@app.route("/")
def index():
    with db() as conn:
        rows = conn.execute("SELECT * FROM posts ORDER BY id DESC").fetchall()
    posts = [dict(r) for r in rows]
    return render_template(
        "index.html",
        posts=posts,
        site_name=SITE_NAME,
        year=datetime.now().year,
    )

@app.route("/admin", methods=["GET", "POST"])
def admin():
    if request.method == "POST" and not session.get("authed"):
        if request.form.get("password") == ADMIN_PASSWORD:
            session["authed"] = True
            return redirect(url_for("admin"))

    authed = bool(session.get("authed"))
    with db() as conn:
        rows = conn.execute("SELECT * FROM posts ORDER BY id DESC LIMIT 10").fetchall()
    posts = [dict(r) for r in rows]

    return render_template(
        "admin.html",
        authed=authed,
        posts=posts,
        site_name=SITE_NAME,
        year=datetime.now().year,
    )

@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return redirect(url_for("admin"))

@app.route("/post", methods=["POST"])
def post():
    if not session.get("authed"):
        return redirect(url_for("admin"))

    title = (request.form.get("title","").strip())
    body  = (request.form.get("body","").strip())
    if not title or not body:
        return redirect(url_for("admin"))

    created_at = datetime.now().strftime("%b %d, %Y • %I:%M %p")
    image_path = None

    f = request.files.get("photo")
    if f and f.filename:
        fname = secure_filename(f.filename)
        root, ext = os.path.splitext(fname)
        if ext.lower() not in [".jpg", ".jpeg", ".png", ".gif"]:
            ext = ".jpg"
        newname = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{secrets.token_hex(4)}{ext}"
        save_path = os.path.join(UPLOAD_DIR, newname)
        f.save(save_path)
        image_path = os.path.join("uploads", newname).replace("\\", "/")

    with db() as conn:
        conn.execute(
            "INSERT INTO posts (title, body, image_path, created_at) VALUES (?, ?, ?, ?)",
            (title, body, image_path, created_at),
        )
        conn.commit()

    notify_clients(title, body, BASE_URL)
    return redirect(url_for("admin"))

@app.route("/delete/<int:post_id>", methods=["POST"])
def delete(post_id):
    if not session.get("authed"):
        return redirect(url_for("admin"))

    # Look up image path to optionally remove file
    with db() as conn:
        row = conn.execute("SELECT image_path FROM posts WHERE id = ?", (post_id,)).fetchone()
        if row and row["image_path"]:
            file_path = os.path.join("static", row["image_path"])
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except Exception:
                    pass
        conn.execute("DELETE FROM posts WHERE id = ?", (post_id,))
        conn.commit()

    return redirect(url_for("admin"))

# --------------------------
# Local run
# --------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))