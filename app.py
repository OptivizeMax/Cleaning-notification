import os, sqlite3, smtplib, ssl, secrets
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import Flask, request, redirect, url_for, session, send_from_directory
from markupsafe import Markup
from flask import render_template_string
from werkzeug.utils import secure_filename

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

DB_PATH = "data.sqlite3"
UPLOAD_DIR = os.path.join("static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

with db() as conn:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            image_path TEXT,
            created_at TEXT NOT NULL
        )""")
    conn.commit()

STYLE = """
<style>
:root { --bg:#0f172a; --card:#111827; --text:#e5e7eb; --muted:#9ca3af; --accent:#38bdf8; }
*{box-sizing:border-box} body{margin:0;font-family:system-ui,Segoe UI,Roboto,Inter,Arial;
background:radial-gradient(1200px 600px at 20% -10%, #1f2937 0%, var(--bg) 60%); color:var(--text)}
header,main,footer{max-width:820px;margin:0 auto;padding:16px}
header{display:flex;align-items:center;justify-content:space-between;gap:12px}
a{color:var(--accent);text-decoration:none}
.card{background:linear-gradient(180deg,rgba(17,24,39,.9),rgba(17,24,39,.6));
border:1px solid rgba(148,163,184,.12); border-radius:14px; padding:16px; margin:12px 0; backdrop-filter:blur(8px)}
.title{font-size:1.15rem;font-weight:650;margin-bottom:6px}
.meta{color:var(--muted);font-size:.9rem;margin-bottom:8px}
.post img{width:100%;height:auto;border-radius:10px;margin-top:12px}
.btn{background:var(--accent);border:none;color:#001018;padding:10px 14px;border-radius:10px;font-weight:700;cursor:pointer}
input[type=text],input[type=password],textarea,input[type=file]{width:100%;padding:10px 12px;border-radius:10px;border:1px solid rgba(148,163,184,.25);background:#0b1220;color:var(--text)}
textarea{min-height:120px}
.sep{height:1px;background:rgba(148,163,184,.15);margin:8px 0 14px}
.muted{color:var(--muted)}
</style>
"""

BASE = """<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{{ site_name }}</title>""" + STYLE + """</head><body>
<header><div style="font-weight:700">{{ site_name }}</div>
<nav><a href="{{ url_for('index') }}">Feed</a> • <a href="{{ url_for('admin') }}">Admin</a></nav></header>
<main>{% block content %}{% endblock %}</main>
<footer><div class="muted">© {{ year }} • {{ site_name }}</div></footer></body></html>"""

INDEX = """{% extends base %}{% block content %}
<div class="card"><div class="title">Latest updates</div>
<div class="muted">Share this link with your client.</div></div>
{% for p in posts %}
<article class="card post">
  <div class="meta">{{ p['created_at'] }}</div>
  <div class="title">{{ p['title'] }}</div>
  <div class="body">{{ p['body']|safe }}</div>
  {% if p['image_path'] %}<img src="{{ url_for('static', filename=p['image_path']) }}" alt="photo">{% endif %}
</article>
{% else %}<div class="card">No posts yet.</div>{% endfor %}
{% endblock %}"""

ADMIN = """{% extends base %}{% block content %}
{% if not authed %}
<div class="card">
  <div class="title">Admin Login</div>
  <form method="post">
    <label>Password</label>
    <input type="password" name="password" required>
    <div class="sep"></div><button class="btn">Login</button>
  </form>
</div>
{% else %}
<div class="card">
  <div class="title">New Cleaning Update</div>
  <form method="post" action="{{ url_for('post') }}" enctype="multipart/form-data">
    <label>Title</label><input type="text" name="title" placeholder="Microwave deep-cleaned" required>
    <div class="sep"></div>
    <label>Optional Photo</label><input type="file" name="photo" accept="image/*">
    <div class="sep"></div>
    <label>Details</label><textarea name="body" placeholder="What did you clean? Notes?" required></textarea>
    <div class="sep"></div><button class="btn">Publish & Notify</button>
  </form>
</div>
<div class="card">
  <div class="title">Recent Posts</div>
  {% for p in posts %}<div class="muted">{{ p['created_at'] }} — {{ p['title'] }}</div>
  {% else %}<div class="muted">No posts yet.</div>{% endfor %}
  <div class="sep"></div>
  <form method="post" action="{{ url_for('logout') }}"><button class="btn" style="background:#fda4af">Logout</button></form>
</div>
{% endif %}
{% endblock %}"""

def notify_clients(title, body, link):
    if not CLIENT_EMAILS or not SMTP_HOST or not SMTP_USER or not SMTP_PASS:
        return False, "Email not configured"
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"{SITE_NAME}: {title}"
        msg["From"] = FROM_EMAIL or SMTP_USER
        msg["To"] = ", ".join(CLIENT_EMAILS)
        text = f"New cleaning update:\\n{title}\\n\\n{body}\\n\\nView all updates: {link}"
        html = f'<p>New cleaning update:</p><h3>{title}</h3><p>{body.replace("\\n","<br>")}</p><p><a href="{link}">View all updates</a></p>'
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

@app.route("/")
def index():
    with db() as conn:
        rows = conn.execute("SELECT * FROM posts ORDER BY id DESC").fetchall()
    posts = []
    for r in rows:
        body_html = Markup((r["body"] or "").replace("\n", "<br>"))
        posts.append({"id": r["id"], "title": r["title"], "body": body_html,
                      "image_path": r["image_path"], "created_at": r["created_at"]})
    return render_template_string(INDEX, base=BASE, posts=posts, site_name=SITE_NAME, year=datetime.now().year)

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
    return render_template_string(ADMIN, base=BASE, authed=authed, posts=posts, site_name=SITE_NAME, year=datetime.now().year)

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
        if ext.lower() not in [".jpg",".jpeg",".png",".gif"]:
            ext = ".jpg"
        newname = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{secrets.token_hex(4)}{ext}"
        save_path = os.path.join(UPLOAD_DIR, newname)
        f.save(save_path)
        image_path = os.path.join("uploads", newname).replace("\\","/")

    with db() as conn:
        conn.execute("INSERT INTO posts (title, body, image_path, created_at) VALUES (?,?,?,?)",
                     (title, body, image_path, created_at))
        conn.commit()

    notify_clients(title, body, BASE_URL)
    return redirect(url_for("admin"))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
