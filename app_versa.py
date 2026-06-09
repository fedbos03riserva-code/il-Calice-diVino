"""
╔══════════════════════════════════════════════════════════════════╗
║         IL CALICE DI VINO — MVP v2.0                            ║
║         AI Sommelier + Ecommerce Dropshipping                   ║
║                                                                  ║
║  Stack: Streamlit · Anthropic Claude API · SQLite · Pandas      ║
║                                                                  ║
║  SETUP:                                                          ║
║    pip install streamlit anthropic pandas                        ║
║    export ANTHROPIC_API_KEY="sk-ant-..."                         ║
║    streamlit run calice_di_vino_mvp.py                          ║
╚══════════════════════════════════════════════════════════════════╝
"""

import streamlit as st
import anthropic
import sqlite3
import json
import hashlib
import os
import time
from datetime import datetime
from typing import Optional

# ─────────────────────────────────────────────
# CONFIGURAZIONE PAGINA
# ─────────────────────────────────────────────
st.set_page_config(
    page_title="diVino — L'AI del Vino",
    page_icon="🍷",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ─────────────────────────────────────────────
# CSS GLOBALE
# ─────────────────────────────────────────────
st.markdown("""
<style>
/* ── Base ── */
.main { background-color: #faf7f5; }

/* ── Header ── */
.hero {
    background: linear-gradient(135deg, #3d0a10 0%, #5c1d24 60%, #7a2d36 100%);
    padding: 32px 28px; border-radius: 14px;
    text-align: center; color: white; margin-bottom: 28px;
    border: 1px solid rgba(255,255,255,0.08);
}
.hero h1 { margin: 0; font-size: 2.6em; letter-spacing: -0.5px; }
.hero p  { margin: 8px 0 0; color: #e8c5c8; font-style: italic; font-size: 1.05em; }

/* ── Score badge ── */
.score-bar {
    background: #f0e8e9; border-radius: 8px; height: 8px;
    overflow: hidden; margin: 6px 0 12px;
}
.score-fill {
    height: 100%; border-radius: 8px;
    background: linear-gradient(90deg, #7a2d36, #c0444f);
    transition: width 0.5s ease;
}

/* ── Scheda vino ── */
.wine-card {
    background: white; border-radius: 12px;
    border-left: 5px solid #5c1d24;
    padding: 20px 24px; margin: 14px 0;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.wine-card h3 { margin: 0 0 10px; color: #3d0a10; font-size: 1.3em; }

/* ── Badge ── */
.badge {
    display: inline-block; padding: 3px 10px;
    border-radius: 20px; font-size: 0.78em; font-weight: 600;
    margin: 2px 4px 2px 0;
}
.badge-price   { background: #d1e7dd; color: #0a3d1f; }
.badge-geo     { background: #cff4fc; color: #063242; }
.badge-type    { background: #f3d9fa; color: #4a0a5c; }
.badge-score   { background: #fff3cd; color: #5c3d00; }
.badge-match   { background: #fde8e8; color: #5c0a10; }

/* ── Molecole ── */
.molecule-row {
    display: flex; flex-wrap: wrap; gap: 8px;
    margin: 10px 0; padding: 10px;
    background: #faf7f5; border-radius: 8px;
}
.molecule-pill {
    background: #3d0a10; color: white;
    padding: 3px 10px; border-radius: 20px;
    font-size: 0.75em; font-weight: 500;
}

/* ── Bottone acquisto ── */
.buy-btn {
    display: block; width: 100%;
    background: #5c1d24; color: white !important;
    text-align: center; padding: 11px;
    border-radius: 8px; font-weight: 700;
    text-decoration: none; font-size: 0.95em;
    margin-top: 12px; transition: background 0.2s;
    border: none; cursor: pointer;
}
.buy-btn:hover { background: #8a2832; color: white !important; }

/* ── Profilo sidebar ── */
.profile-card {
    background: white; border-radius: 10px;
    padding: 14px; margin-bottom: 12px;
    border: 1px solid #f0e8e9;
}
.profile-stat { font-size: 0.8em; color: #888; margin: 3px 0; }
.profile-val  { font-size: 1.1em; font-weight: 600; color: #3d0a10; }

/* ── Storico ── */
.history-item {
    border-left: 3px solid #e8c5c8;
    padding: 8px 12px; margin: 6px 0;
    background: #faf7f5; border-radius: 0 6px 6px 0;
    font-size: 0.85em;
}

/* ── Tab personalizzata ── */
.stTabs [data-baseweb="tab"] { font-size: 0.9em; }

/* ── Input ── */
.stTextInput input, .stSelectbox select {
    border-radius: 8px !important;
    border-color: #e0d0d2 !important;
}
.stButton > button {
    background: #5c1d24 !important; color: white !important;
    border-radius: 8px !important; border: none !important;
    font-weight: 600 !important; width: 100% !important;
    padding: 10px !important;
}
.stButton > button:hover { background: #8a2832 !important; }
</style>
""", unsafe_allow_html=True)


# ─────────────────────────────────────────────
# DATABASE SQLite (locale, zero infrastruttura)
# ─────────────────────────────────────────────
DB_PATH = "calice_vino.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            nome TEXT,
            password_hash TEXT,
            preferenze TEXT DEFAULT '{}',
            created_at TEXT
        )
    """)
    c.execute("""
        CREATE TABLE IF NOT EXISTS searches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            piatto TEXT,
            regione TEXT,
            risultati TEXT,
            feedback_score INTEGER,
            created_at TEXT
        )
    """)
    c.execute("""
        CREATE TABLE IF NOT EXISTS wine_feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            wine_name TEXT,
            piatto TEXT,
            rating INTEGER,
            note TEXT,
            created_at TEXT
        )
    """)
    conn.commit()
    conn.close()

def hash_password(pwd: str) -> str:
    return hashlib.sha256(pwd.encode()).hexdigest()

def register_user(email: str, nome: str, password: str) -> bool:
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute(
            "INSERT INTO users (email, nome, password_hash, created_at) VALUES (?,?,?,?)",
            (email.lower(), nome, hash_password(password), datetime.now().isoformat())
        )
        conn.commit()
        conn.close()
        return True
    except sqlite3.IntegrityError:
        return False

def login_user(email: str, password: str) -> Optional[dict]:
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "SELECT id, nome, email, preferenze FROM users WHERE email=? AND password_hash=?",
        (email.lower(), hash_password(password))
    )
    row = c.fetchone()
    conn.close()
    if row:
        return {"id": row[0], "nome": row[1], "email": row[2], "preferenze": json.loads(row[3])}
    return None

def save_search(user_id: Optional[int], piatto: str, regione: str, risultati: list):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "INSERT INTO searches (user_id, piatto, regione, risultati, created_at) VALUES (?,?,?,?,?)",
        (user_id, piatto, regione, json.dumps(risultati, ensure_ascii=False), datetime.now().isoformat())
    )
    conn.commit()
    conn.close()

def get_user_history(user_id: int, limit: int = 10) -> list:
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "SELECT piatto, regione, created_at FROM searches WHERE user_id=? ORDER BY created_at DESC LIMIT ?",
        (user_id, limit)
    )
    rows = c.fetchall()
    conn.close()
    return rows

def save_wine_feedback(user_id: int, wine_name: str, piatto: str, rating: int, note: str = ""):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "INSERT INTO wine_feedback (user_id, wine_name, piatto, rating, note, created_at) VALUES (?,?,?,?,?,?)",
        (user_id, wine_name, piatto, rating, note, datetime.now().isoformat())
    )
    conn.commit()
    conn.close()

def get_user_stats(user_id: int) -> dict:
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM searches WHERE user_id=?", (user_id,))
    n_searches = c.fetchone()[0]
    c.execute("SELECT COUNT(*), AVG(rating) FROM wine_feedback WHERE user_id=?", (user_id,))
    row = c.fetchone()
    n_ratings = row[0]
    avg_rating = round(row[1], 1) if row[1] else 0
    conn.close()
    return {"searches": n_searches, "ratings": n_ratings, "avg_rating": avg_rating}


# ─────────────────────────────────────────────
# CATALOGO VINI ESTESO
# (in produzione: PostgreSQL + 10.000+ etichette)
# ─────────────────────────────────────────────
WINE_CATALOG = [
    # ── BIANCHI ITALIANI ──
    {"id": "LUG001", "nome": "Lugana DOC Zenato",           "regione": "Lombardia",  "tipo": "Bianco",    "fascia": "standard",  "prezzo": 14.90, "uva": "Trebbiano di Lugana", "alcol": 13.0, "acidita": "alta",      "tannini": "assenti",  "residuo_zuccherino": 2.1, "tag": ["minerale","pesca bianca","strutturato"],      "fornitore": "Tannico",    "url": "https://www.tannico.it/lugana-zenato",               "foto": "https://images.vivino.com/thumbs/p939ZY8rDzjIXI91-mTHKA_pb_x600.png"},
    {"id": "GAV001", "nome": "Gavi di Gavi DOCG La Scolca", "regione": "Piemonte",   "tipo": "Bianco",    "fascia": "premium",   "prezzo": 22.00, "uva": "Cortese",             "alcol": 12.5, "acidita": "alta",      "tannini": "assenti",  "residuo_zuccherino": 1.8, "tag": ["mandorla","minerale","elegante"],              "fornitore": "Callmewine", "url": "https://www.callmewine.com/gavi-la-scolca",          "foto": "https://images.vivino.com/thumbs/A9L3fqTcFKBjFhMlS9lTJA_pb_x600.png"},
    {"id": "VER001", "nome": "Vermentino di Gallura DOCG",  "regione": "Sardegna",   "tipo": "Bianco",    "fascia": "standard",  "prezzo": 16.50, "uva": "Vermentino",          "alcol": 13.5, "acidita": "media",     "tannini": "assenti",  "residuo_zuccherino": 3.0, "tag": ["macchia med","mandorla","caldo"],              "fornitore": "Tannico",    "url": "https://www.tannico.it/vermentino-gallura",          "foto": "https://images.vivino.com/thumbs/wlCuNvjb6d-8UmHq6mI5XA_pb_x600.png"},
    {"id": "FIA001", "nome": "Fiano di Avellino DOCG",      "regione": "Campania",   "tipo": "Bianco",    "fascia": "premium",   "prezzo": 18.00, "uva": "Fiano",               "alcol": 13.0, "acidita": "alta",      "tannini": "assenti",  "residuo_zuccherino": 1.5, "tag": ["nocciola","miele","minerale profondo"],        "fornitore": "Callmewine", "url": "https://www.callmewine.com/fiano-avellino",          "foto": "https://images.vivino.com/thumbs/3yd-JCFVsoCFD3fNdMclrA_pb_x600.png"},
    {"id": "SOA001", "nome": "Soave Classico DOC Pieropan", "regione": "Veneto",     "tipo": "Bianco",    "fascia": "economico", "prezzo": 10.50, "uva": "Garganega",           "alcol": 12.0, "acidita": "media",     "tannini": "assenti",  "residuo_zuccherino": 2.5, "tag": ["mandorla","floreale","minerale"],              "fornitore": "Tannico",    "url": "https://www.tannico.it/soave-pieropan",              "foto": "https://images.vivino.com/thumbs/6Q0pLXC1UyiSVNMFqVa3Vw_pb_x600.png"},
    {"id": "ETB001", "nome": "Etna Bianco DOC Benanti",     "regione": "Sicilia",    "tipo": "Bianco",    "fascia": "premium",   "prezzo": 21.00, "uva": "Carricante",          "alcol": 13.0, "acidita": "altissima", "tannini": "assenti",  "residuo_zuccherino": 1.2, "tag": ["vulcanico","agrumi","verticale"],              "fornitore": "Callmewine", "url": "https://www.callmewine.com/etna-bianco-benanti",     "foto": "https://images.vivino.com/thumbs/3QP-bpb6dXtpGIBWjOmIQw_pb_x600.png"},
    {"id": "FRI001", "nome": "Friulano DOC Livio Felluga",  "regione": "Friuli-Venezia Giulia","tipo":"Bianco","fascia":"standard","prezzo":17.00,"uva":"Tocai Friulano",    "alcol": 13.5, "acidita": "media",     "tannini": "assenti",  "residuo_zuccherino": 2.0, "tag": ["mandorla amara","minerale","morbido"],         "fornitore": "Tannico",    "url": "https://www.tannico.it/friulano-felluga",            "foto": "https://images.vivino.com/thumbs/K6nfDpA_RBBjcMIMVVIVYw_pb_x600.png"},
    {"id": "VRD001", "nome": "Verdicchio dei Castelli di Jesi Classico Superiore", "regione": "Umbria", "tipo": "Bianco", "fascia": "economico", "prezzo": 9.50, "uva": "Verdicchio", "alcol": 13.0, "acidita": "alta", "tannini": "assenti", "residuo_zuccherino": 1.8, "tag": ["erbe aromatiche","mandorla verde","fresco"], "fornitore": "Tannico", "url": "https://www.tannico.it/verdicchio-jesi", "foto": "https://images.vivino.com/thumbs/X1eTmB7cMKENAw7pChavGQ_pb_x600.png"},
    {"id": "GEW001", "nome": "Gewürztraminer Alto Adige DOC Tramin", "regione": "Trentino-Alto Adige", "tipo": "Bianco", "fascia": "standard", "prezzo": 18.50, "uva": "Gewürztraminer", "alcol": 13.5, "acidita": "bassa", "tannini": "assenti", "residuo_zuccherino": 8.0, "tag": ["rosa","litchi","speziato intenso"], "fornitore": "Callmewine", "url": "https://www.callmewine.com/gewurztraminer-tramin", "foto": "https://images.vivino.com/thumbs/9lKnpA1qBFhH46JFPbMgSw_pb_x600.png"},
    {"id": "PIN001", "nome": "Pinot Grigio Ramato DOC Livon", "regione": "Friuli-Venezia Giulia", "tipo": "Bianco", "fascia": "standard", "prezzo": 15.00, "uva": "Pinot Grigio", "alcol": 13.0, "acidita": "media", "tannini": "leggeri", "residuo_zuccherino": 2.0, "tag": ["pesca","rame","speziato delicato"], "fornitore": "Tannico", "url": "https://www.tannico.it/pinot-grigio-ramato-livon", "foto": "https://images.vivino.com/thumbs/Hw-HFXOQ4A_7YYGFKlQ2Kg_pb_x600.png"},
    # ── ROSSI ITALIANI ──
    {"id": "BAR001", "nome": "Barolo DOCG Borgogno",         "regione": "Piemonte",   "tipo": "Rosso",     "fascia": "premium",   "prezzo": 42.00, "uva": "Nebbiolo",            "alcol": 14.5, "acidita": "alta",      "tannini": "potenti",  "residuo_zuccherino": 0.8, "tag": ["rosa appassita","cuoio","tabacco"],            "fornitore": "Tannico",    "url": "https://www.tannico.it/barolo-borgogno",             "foto": "https://images.vivino.com/thumbs/pIizY_-apAAAAARmWOVKIA_pb_x600.png"},
    {"id": "CHI001", "nome": "Chianti Classico DOCG Riserva","regione": "Toscana",    "tipo": "Rosso",     "fascia": "standard",  "prezzo": 19.00, "uva": "Sangiovese",          "alcol": 13.5, "acidita": "alta",      "tannini": "medi",     "residuo_zuccherino": 1.0, "tag": ["marasca","viola","spezie fini"],               "fornitore": "Callmewine", "url": "https://www.callmewine.com/chianti-classico-riserva","foto": "https://images.vivino.com/thumbs/bkTO_HHQjZOvXEMxjy5QVg_pb_x600.png"},
    {"id": "AMA001", "nome": "Amarone DOCG Allegrini",       "regione": "Veneto",     "tipo": "Rosso",     "fascia": "lusso",     "prezzo": 55.00, "uva": "Corvina",             "alcol": 15.5, "acidita": "media",     "tannini": "vellutati","residuo_zuccherino": 5.0, "tag": ["prugna secca","cacao","tabacco"],              "fornitore": "Tannico",    "url": "https://www.tannico.it/amarone-allegrini",           "foto": "https://images.vivino.com/thumbs/4v-JGVqCBYCLKDxMhS8JWA_pb_x600.png"},
    {"id": "AGL001", "nome": "Taurasi DOCG Mastroberardino", "regione": "Campania",   "tipo": "Rosso",     "fascia": "premium",   "prezzo": 36.00, "uva": "Aglianico",           "alcol": 14.0, "acidita": "alta",      "tannini": "potenti",  "residuo_zuccherino": 0.9, "tag": ["marasca","caffè","polvere da sparo"],          "fornitore": "Callmewine", "url": "https://www.callmewine.com/taurasi",                 "foto": "https://images.vivino.com/thumbs/bFOcXS08KD1EvDYQvAZpLg_pb_x600.png"},
    {"id": "BRU001", "nome": "Brunello di Montalcino DOCG",  "regione": "Toscana",    "tipo": "Rosso",     "fascia": "lusso",     "prezzo": 62.00, "uva": "Sangiovese Grosso",   "alcol": 14.5, "acidita": "alta",      "tannini": "seta",     "residuo_zuccherino": 0.5, "tag": ["frutta scura","vaniglia","eterno"],            "fornitore": "Tannico",    "url": "https://www.tannico.it/brunello-montalcino",         "foto": "https://images.vivino.com/thumbs/wlCuNvjb6d-8UmHq6mI5XA_pb_x600.png"},
    {"id": "ETR001", "nome": "Etna Rosso DOC Cornelissen",   "regione": "Sicilia",    "tipo": "Rosso",     "fascia": "premium",   "prezzo": 24.00, "uva": "Nerello Mascalese",   "alcol": 13.0, "acidita": "altissima", "tannini": "fini",     "residuo_zuccherino": 0.8, "tag": ["lampone","cenere","elegante"],                 "fornitore": "Callmewine", "url": "https://www.callmewine.com/etna-rosso",              "foto": "https://images.vivino.com/thumbs/DXNAuLGQ5oO-j5pKILBmQw_pb_x600.png"},
    {"id": "CAN001", "nome": "Cannonau di Sardegna DOC",     "regione": "Sardegna",   "tipo": "Rosso",     "fascia": "economico", "prezzo": 11.00, "uva": "Cannonau",            "alcol": 14.0, "acidita": "media",     "tannini": "morbidi",  "residuo_zuccherino": 2.0, "tag": ["spezie","prugna","macchia med"],               "fornitore": "Tannico",    "url": "https://www.tannico.it/cannonau",                    "foto": "https://images.vivino.com/thumbs/oR_gHr_5K1s8VKb-gfQMGg_pb_x600.png"},
    {"id": "SAG001", "nome": "Sagrantino DOCG Montefalco",   "regione": "Umbria",     "tipo": "Rosso",     "fascia": "premium",   "prezzo": 38.00, "uva": "Sagrantino",          "alcol": 14.5, "acidita": "media",     "tannini": "titanici", "residuo_zuccherino": 1.0, "tag": ["more","tabacco","spezie scure"],               "fornitore": "Callmewine", "url": "https://www.callmewine.com/sagrantino",              "foto": "https://images.vivino.com/thumbs/AkQM1w2vRca4J7bpOkGbqA_pb_x600.png"},
    {"id": "NEB001", "nome": "Nebbiolo d'Alba DOC Prunotto", "regione": "Piemonte",   "tipo": "Rosso",     "fascia": "standard",  "prezzo": 17.50, "uva": "Nebbiolo",            "alcol": 13.5, "acidita": "alta",      "tannini": "medi",     "residuo_zuccherino": 1.0, "tag": ["viola","rosa","ciliegia selvatica"],           "fornitore": "Tannico",    "url": "https://www.tannico.it/nebbiolo-alba-prunotto",      "foto": "https://images.vivino.com/thumbs/ApnIiXjcT5Kc33OHgNHROQ_pb_x600.png"},
    {"id": "MON001", "nome": "Montepulciano d'Abruzzo DOC Masciarelli", "regione": "Abruzzo", "tipo": "Rosso", "fascia": "economico", "prezzo": 9.90, "uva": "Montepulciano", "alcol": 13.5, "acidita": "media", "tannini": "morbidi", "residuo_zuccherino": 2.5, "tag": ["more","ciliegia nera","cioccolato"], "fornitore": "Tannico", "url": "https://www.tannico.it/montepulciano-masciarelli", "foto": "https://images.vivino.com/thumbs/u1UrPLJEzXzM0v8HVCi8tQ_pb_x600.png"},
    {"id": "NEA001", "nome": "Nero d'Avola DOC Cusumano",    "regione": "Sicilia",    "tipo": "Rosso",     "fascia": "economico", "prezzo": 10.00, "uva": "Nero d'Avola",        "alcol": 14.0, "acidita": "media",     "tannini": "morbidi",  "residuo_zuccherino": 3.0, "tag": ["frutti rossi maturi","cacao","spezie calde"],  "fornitore": "Callmewine", "url": "https://www.callmewine.com/nero-avola-cusumano",     "foto": "https://images.vivino.com/thumbs/oR_gHr_5K1s8VKb-gfQMGg_pb_x600.png"},
    {"id": "VPN001", "nome": "Valpolicella Ripasso DOC Zenato", "regione": "Veneto",  "tipo": "Rosso",     "fascia": "standard",  "prezzo": 18.00, "uva": "Corvina + Molinara",  "alcol": 13.5, "acidita": "media",     "tannini": "vellutati","residuo_zuccherino": 3.5, "tag": ["ciliegia sottospirito","cacao","rotondo"],     "fornitore": "Tannico",    "url": "https://www.tannico.it/valpolicella-ripasso-zenato", "foto": "https://images.vivino.com/thumbs/Y94ARFxUB_BKBO7cJolKLA_pb_x600.png"},
    # ── BOLLICINE ──
    {"id": "FRA001", "nome": "Franciacorta Satèn DOCG",      "regione": "Lombardia",  "tipo": "Spumante",  "fascia": "premium",   "prezzo": 32.00, "uva": "Chardonnay",          "alcol": 12.5, "acidita": "alta",      "tannini": "assenti",  "residuo_zuccherino": 6.0, "tag": ["crosta pane","burro","setoso"],                "fornitore": "Tannico",    "url": "https://www.tannico.it/franciacorta-saten",          "foto": "https://images.vivino.com/thumbs/iFqSNjaHkILUDysBqOsUcA_pb_x600.png"},
    {"id": "PRO001", "nome": "Prosecco Superiore DOCG Ruggeri","regione": "Veneto",   "tipo": "Spumante",  "fascia": "economico", "prezzo": 12.50, "uva": "Glera",               "alcol": 11.5, "acidita": "media",     "tannini": "assenti",  "residuo_zuccherino": 12.0,"tag": ["mela","pera","fresco"],                        "fornitore": "Callmewine", "url": "https://www.callmewine.com/prosecco-ruggeri",        "foto": "https://images.vivino.com/thumbs/Y0B-YlzBSr2rHj4cBCZNyQ_pb_x600.png"},
    {"id": "TRE001", "nome": "Trento DOC Ferrari Brut",      "regione": "Trentino-Alto Adige","tipo":"Spumante","fascia":"premium","prezzo":24.00,"uva":"Chardonnay + Pinot Nero","alcol":12.5,"acidita":"alta",     "tannini": "assenti",  "residuo_zuccherino": 5.0, "tag": ["lievito","agrumi","strutturato"],               "fornitore": "Tannico",    "url": "https://www.tannico.it/trento-ferrari",              "foto": "https://images.vivino.com/thumbs/iFqSNjaHkILUDysBqOsUcA_pb_x600.png"},
    # ── ESTERI ──
    {"id": "CHA001", "nome": "Chablis Premier Cru",          "regione": "Francia",    "tipo": "Bianco",    "fascia": "premium",   "prezzo": 32.00, "uva": "Chardonnay",          "alcol": 12.5, "acidita": "altissima", "tannini": "assenti",  "residuo_zuccherino": 1.0, "tag": ["iodio","pietra focaia","gesso"],               "fornitore": "Tannico",    "url": "https://www.tannico.it/chablis",                     "foto": "https://images.vivino.com/thumbs/oSBvr2f4K4v0cZ6EqeRbAg_pb_x600.png"},
    {"id": "ALB001", "nome": "Albariño Rías Baixas DO",      "regione": "Spagna",     "tipo": "Bianco",    "fascia": "standard",  "prezzo": 16.00, "uva": "Albariño",            "alcol": 12.5, "acidita": "alta",      "tannini": "assenti",  "residuo_zuccherino": 2.0, "tag": ["albicocca","salino","atlantico"],               "fornitore": "Callmewine", "url": "https://www.callmewine.com/albarino",                "foto": "https://images.vivino.com/thumbs/A9L3fqTcFKBjFhMlS9lTJA_pb_x600.png"},
    {"id": "RIO001", "nome": "Rioja Gran Reserva Muga",      "regione": "Spagna",     "tipo": "Rosso",     "fascia": "premium",   "prezzo": 38.00, "uva": "Tempranillo",         "alcol": 14.0, "acidita": "media",     "tannini": "vellutati","residuo_zuccherino": 1.5, "tag": ["vaniglia","cocco","frutta matura"],            "fornitore": "Tannico",    "url": "https://www.tannico.it/rioja-muga",                  "foto": "https://images.vivino.com/thumbs/oR_gHr_5K1s8VKb-gfQMGg_pb_x600.png"},
    {"id": "SAU001", "nome": "Sauternes Château Rieussec",   "regione": "Francia",    "tipo": "Dolce",     "fascia": "lusso",     "prezzo": 75.00, "uva": "Sémillon + Sauvignon","alcol":13.5,  "acidita": "alta",      "tannini": "assenti",  "residuo_zuccherino": 120.0,"tag": ["miele","zafferano","albicocca secca"],         "fornitore": "Callmewine", "url": "https://www.callmewine.com/sauternes",               "foto": "https://images.vivino.com/thumbs/Hw-HFXOQ4A_7YYGFKlQ2Kg_pb_x600.png"},
    {"id": "CHP001", "nome": "Champagne Brut Billecart-Salmon","regione": "Francia",  "tipo": "Spumante",  "fascia": "lusso",     "prezzo": 62.00, "uva": "PN + PM + Chardonnay","alcol":12.0,  "acidita": "alta",      "tannini": "assenti",  "residuo_zuccherino": 6.0, "tag": ["brioche","agrumi","perlage fine"],              "fornitore": "Tannico",    "url": "https://www.tannico.it/champagne-billecart",         "foto": "https://images.vivino.com/thumbs/iFqSNjaHkILUDysBqOsUcA_pb_x600.png"},
    {"id": "RIB001", "nome": "Ribera del Duero Reserva Pesquera", "regione": "Spagna","tipo": "Rosso",     "fascia": "premium",   "prezzo": 34.00, "uva": "Tempranillo",         "alcol": 14.0, "acidita": "media",     "tannini": "strutturati","residuo_zuccherino": 1.8, "tag": ["frutti neri","tostato","spezie dolci"],       "fornitore": "Callmewine", "url": "https://www.callmewine.com/ribera-pesquera",         "foto": "https://images.vivino.com/thumbs/oR_gHr_5K1s8VKb-gfQMGg_pb_x600.png"},
    {"id": "GRU001", "nome": "Grüner Veltliner Smaragd Knoll", "regione": "Austria", "tipo": "Bianco",    "fascia": "premium",   "prezzo": 28.00, "uva": "Grüner Veltliner",    "alcol": 13.5, "acidita": "alta",      "tannini": "assenti",  "residuo_zuccherino": 1.5, "tag": ["pepe bianco","erbe alpine","minerale"], "fornitore": "Tannico", "url": "https://www.tannico.it/gruner-veltliner-knoll", "foto": "https://images.vivino.com/thumbs/K6nfDpA_RBBjcMIMVVIVYw_pb_x600.png"},
    {"id": "PNG001", "nome": "Pinot Noir Bourgogne AOC Jadot","regione": "Francia",   "tipo": "Rosso",     "fascia": "premium",   "prezzo": 29.00, "uva": "Pinot Noir",          "alcol": 13.0, "acidita": "alta",      "tannini": "fini",     "residuo_zuccherino": 1.0, "tag": ["lampone","foglia secca","elegante"], "fornitore": "Callmewine", "url": "https://www.callmewine.com/pinot-noir-jadot", "foto": "https://images.vivino.com/thumbs/DXNAuLGQ5oO-j5pKILBmQw_pb_x600.png"},
]


# ─────────────────────────────────────────────
# PROMPT AI — IL CERVELLO CHIMICO
# ─────────────────────────────────────────────
SYSTEM_PROMPT_SOMMELIER = """
Sei MolecolarSommelier, il motore AI de "Il Calice di Vino".
Il tuo ruolo è analizzare la chimica di un piatto e abbinare vini dal catalogo fornito.

## METODOLOGIA DI ANALISI (segui SEMPRE questo ordine)

### STEP 1 — Scomposizione molecolare del piatto
Identifica i macro-composti del piatto:
- **Grassi** (saturi, insaturi, fosfolipidi): da carni, pesci, formaggi, oli
- **Proteine** (catene peptidiche, umami/glutammato): da carne, pesce, legumi
- **Carboidrati** (amidi, zuccheri semplici): da pasta, riso, pane, verdure
- **Acidi organici** (citrico, acetico, lattico, ossalico): da pomodoro, vino in cottura, aceto
- **Composti volatili aromatici** (terpeni, pirazine, tioli, esteri): da spezie, erbe, affumicatura
- **Capsaicina/piccantezza**: da peperoncino e spezie piccanti
- **Tannini vegetali**: da funghi, carciofi, spinaci
- **Tendenza dolce** (zuccheri liberi)
- **Sapidità** (cloruro di sodio, glutammato)
- **Amaro** (caffeina, polifenoli vegetali)

### STEP 2 — Principi di abbinamento
Applica questi principi chimici:
- **Per contrasto**: acidità del vino vs grassi del piatto (acido tartarico disgrega i lipidi)
- **Per concordanza**: aromi terziari del vino che rispecchiano spezie del piatto
- **Tannini vs proteine**: i tannini si legano alle proteine (ottimo con carne rossa succulenta)
- **CO₂/bollicine vs frittura/grassi**: rimuove meccanicamente i lipidi dalle papille
- **Residuo zuccherino vs piccantezza**: il dolce attenua la capsaicina
- **Mineralità vs iodio/mare**: amplifica l'umami del pesce
- **Alcol vs grassi**: etanolo come solvente naturale dei lipidi

### STEP 3 — Selezione dal catalogo
Scegli SOLO dai vini del catalogo fornito. Per ogni vino scelto, spiega:
1. Quale composto del piatto incontra quale caratteristica del vino
2. Il meccanismo chimico dell'interazione
3. Il risultato sensoriale in bocca

### STEP 4 — Ranking e spiegazione

## FORMATO OUTPUT (JSON PURO, NESSUN TESTO FUORI)
Rispondi SOLO con questo JSON, senza backtick markdown:
{
  "analisi_piatto": {
    "grassi": "descrizione e quantità percepita",
    "proteine": "descrizione",
    "carboidrati": "descrizione",
    "acidi": "descrizione",
    "volatili_aromatici": ["composto1", "composto2"],
    "tendenza_dolce": "alta|media|bassa|assente",
    "sapidita": "alta|media|bassa",
    "piccantezza": "alta|media|bassa|assente",
    "umami": "alto|medio|basso",
    "complessita_complessiva": "alta|media|bassa"
  },
  "abbinamenti": [
    {
      "wine_id": "ID dal catalogo",
      "score": 95,
      "principio": "contrasto|concordanza|complementare",
      "meccanismo_chimico": "Spiegazione tecnica in 2-3 frasi del meccanismo molecolare",
      "interazione_chiave": "La reazione chimica principale in termini semplici",
      "sensazione_in_bocca": "Cosa sente l'utente in bocca grazie a questo abbinamento",
      "molecole_protagoniste": ["acido tartarico", "tannini polimerizzati", "ecc"],
      "avvertenza": "Solo se c'è un possibile contrasto negativo da sapere"
    }
  ],
  "consiglio_del_sommelier": "Un paragrafo narrativo elegante che spiega l'abbinamento ideale come farebbe un vero sommelier"
}
"""

def get_ai_pairing(piatto: str, filtri: dict, catalogo: list) -> dict:
    """Chiama Claude API per l'abbinamento chimico reale."""
    
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        api_key = st.secrets.get("ANTHROPIC_API_KEY", "")
    
    if not api_key:
        return {"error": "API_KEY_MISSING"}
    
    # Prepara il catalogo filtrato da mandare all'AI
    catalogo_str = json.dumps([
        {
            "id": v["id"], "nome": v["nome"], "regione": v["regione"],
            "tipo": v["tipo"], "fascia": v["fascia"], "prezzo": v["prezzo"],
            "uva": v["uva"], "alcol": v["alcol"], "acidita": v["acidita"],
            "tannini": v["tannini"], "residuo_zuccherino": v["residuo_zuccherino"],
            "tag": v["tag"]
        }
        for v in catalogo
    ], ensure_ascii=False, indent=2)
    
    filtri_str = f"""
Filtri attivi dell'utente:
- Regione/Paese preferita: {filtri.get('regione', 'qualsiasi')}
- Fascia di prezzo: {filtri.get('fascia', 'qualsiasi')}
- Tipo di vino: {filtri.get('tipo', 'qualsiasi')}
- Budget massimo: {filtri.get('budget_max', 'nessun limite')}€
- Preferenze personali: {filtri.get('note_personali', 'nessuna')}
"""
    
    user_message = f"""
Piatto da abbinare: "{piatto}"

{filtri_str}

Catalogo vini disponibile:
{catalogo_str}

Analizza il piatto, applica la metodologia chimica e scegli i migliori 3 abbinamenti dal catalogo.
Rispondi SOLO con il JSON richiesto, nessun testo fuori.
"""
    
    try:
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            system=SYSTEM_PROMPT_SOMMELIER,
            messages=[{"role": "user", "content": user_message}]
        )
        raw = message.content[0].text.strip()
        # Pulizia robusta del JSON
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()
        return json.loads(raw)
    
    except json.JSONDecodeError as e:
        return {"error": f"JSON_PARSE_ERROR: {str(e)}", "raw": raw[:500]}
    except Exception as e:
        return {"error": str(e)}


# ─────────────────────────────────────────────
# HELPERS UI
# ─────────────────────────────────────────────
def get_wine_by_id(wine_id: str) -> Optional[dict]:
    return next((w for w in WINE_CATALOG if w["id"] == wine_id), None)

def fascia_label(fascia: str) -> str:
    return {
        "economico": "Economico (<12€)",
        "standard":  "Standard (12–25€)",
        "premium":   "Premium (25–50€)",
        "lusso":     "Lusso (>50€)"
    }.get(fascia, fascia)

def score_color(score: int) -> str:
    if score >= 90: return "#2d7d32"
    if score >= 75: return "#c07b00"
    return "#9e3a3a"

def render_wine_card(wine: dict, abbinamento: dict, piatto: str, user_id: Optional[int], idx: int):
    score = abbinamento.get("score", 0)
    molecole = abbinamento.get("molecole_protagoniste", [])
    mol_pills = "".join([f'<span class="molecule-pill">{m}</span>' for m in molecole])
    
    avv = abbinamento.get("avvertenza", "")
    avv_html = f'<p style="color:#9e3a3a;font-size:0.82em;margin-top:8px">⚠️ {avv}</p>' if avv else ""
    
    st.markdown(f"""
    <div class="wine-card">
        <h3>🍷 {wine['nome']}</h3>
        <p>
            <span class="badge badge-score">Match {score}/100</span>
            <span class="badge badge-price">{fascia_label(wine['fascia'])} — {wine['prezzo']:.2f}€</span>
            <span class="badge badge-type">{wine['tipo']}</span>
            <span class="badge badge-geo">{wine['regione']}</span>
            <span class="badge badge-match">{abbinamento.get('principio','').upper()}</span>
        </p>
        <div style="margin: 6px 0 14px;">
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:0.75em;color:#888;width:60px">Compatibilità</span>
                <div class="score-bar" style="flex:1">
                    <div class="score-fill" style="width:{score}%; background:linear-gradient(90deg,#3d0a10,{score_color(score)})"></div>
                </div>
                <span style="font-size:0.8em;font-weight:700;color:{score_color(score)}">{score}%</span>
            </div>
        </div>
        <p style="font-size:0.85em;color:#555"><strong>🔬 Chimica in bocca:</strong><br>{abbinamento.get('meccanismo_chimico','')}</p>
        <p style="font-size:0.85em;color:#333"><strong>👅 Sensazione:</strong> {abbinamento.get('sensazione_in_bocca','')}</p>
        <div class="molecule-row">{mol_pills if mol_pills else '<span style="color:#888;font-size:0.8em">—</span>'}</div>
        {avv_html}
        <p style="font-size:0.8em;color:#888;margin:6px 0">
            Uva: {wine['uva']} · Alcol: {wine['alcol']}% · Acidità: {wine['acidita']} · Tannini: {wine['tannini']}
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    col_buy, col_rate = st.columns([3, 1])
    with col_buy:
        st.markdown(f'<a href="{wine["url"]}" target="_blank" class="buy-btn">🛒 Acquista su {wine["fornitore"]} — {wine["prezzo"]:.2f}€</a>', unsafe_allow_html=True)
    with col_rate:
        if user_id and st.button(f"⭐ Valuta", key=f"rate_{idx}_{wine['id']}"):
            st.session_state[f"rating_open_{wine['id']}"] = True
    
    if user_id and st.session_state.get(f"rating_open_{wine['id']}", False):
        with st.container():
            r = st.slider(f"Il tuo voto per {wine['nome']}", 1, 10, 7, key=f"slider_{idx}_{wine['id']}")
            nota = st.text_input("Nota opzionale", key=f"nota_{idx}_{wine['id']}", placeholder="Es: ottimo con la pasta, un po' tannico...")
            if st.button("💾 Salva feedback", key=f"save_{idx}_{wine['id']}"):
                save_wine_feedback(user_id, wine["nome"], piatto, r, nota)
                st.session_state[f"rating_open_{wine['id']}"] = False
                st.success("Grazie! Il tuo feedback migliora l'AI.")


# ─────────────────────────────────────────────
# SIDEBAR — AUTH + PROFILO
# ─────────────────────────────────────────────
def render_sidebar():
    with st.sidebar:
        st.markdown("### 🍷 diVino")
        st.markdown("---")
        
        if "user" not in st.session_state:
            st.session_state.user = None
        
        # ── Login / Register ──
        if not st.session_state.user:
            tab_login, tab_reg = st.tabs(["Accedi", "Registrati"])
            
            with tab_login:
                email_l = st.text_input("Email", key="login_email")
                pwd_l   = st.text_input("Password", type="password", key="login_pwd")
                if st.button("Accedi", key="btn_login"):
                    u = login_user(email_l, pwd_l)
                    if u:
                        st.session_state.user = u
                        st.success(f"Benvenuto, {u['nome']}!")
                        st.rerun()
                    else:
                        st.error("Credenziali errate.")
                st.caption("Demo: usa email e password che hai registrato.")
            
            with tab_reg:
                nome_r  = st.text_input("Nome", key="reg_nome")
                email_r = st.text_input("Email", key="reg_email")
                pwd_r   = st.text_input("Password", type="password", key="reg_pwd")
                if st.button("Crea account", key="btn_reg"):
                    if nome_r and email_r and pwd_r:
                        ok = register_user(email_r, nome_r, pwd_r)
                        if ok:
                            st.success("Account creato! Ora accedi.")
                        else:
                            st.warning("Email già registrata.")
                    else:
                        st.warning("Compila tutti i campi.")
        
        # ── Profilo loggato ──
        else:
            u = st.session_state.user
            stats = get_user_stats(u["id"])
            
            st.markdown(f"""
            <div class="profile-card">
                <div class="profile-val">👤 {u['nome']}</div>
                <div class="profile-stat">{u['email']}</div>
            </div>
            <div class="profile-card">
                <div class="profile-stat">Ricerche effettuate</div>
                <div class="profile-val">{stats['searches']}</div>
                <div class="profile-stat">Vini valutati</div>
                <div class="profile-val">{stats['ratings']}</div>
                <div class="profile-stat">Voto medio dato</div>
                <div class="profile-val">{'⭐ ' + str(stats['avg_rating']) if stats['avg_rating'] else '—'}</div>
            </div>
            """, unsafe_allow_html=True)
            
            # Storico
            st.markdown("**📜 Ultime ricerche**")
            history = get_user_history(u["id"], 5)
            if history:
                for h in history:
                    data = h[2][:10] if h[2] else ""
                    st.markdown(f"""
                    <div class="history-item">
                        🍽️ <b>{h[0]}</b><br>
                        <span style="color:#888">{h[1]} · {data}</span>
                    </div>
                    """, unsafe_allow_html=True)
            else:
                st.caption("Nessuna ricerca ancora.")
            
            if st.button("🚪 Esci"):
                st.session_state.user = None
                st.rerun()
        
        st.markdown("---")
        st.caption("MVP v3.0 · diVino · Motore AI: Claude claude-sonnet-4-20250514")
        st.caption("Dati affiliazione: Tannico · Callmewine")


# ─────────────────────────────────────────────
# PAGINA PRINCIPALE
# ─────────────────────────────────────────────
def main():
    init_db()
    render_sidebar()
    
    user = st.session_state.get("user")
    user_id = user["id"] if user else None
    
    # ── HERO ──
    st.markdown("""
    <div class="hero">
        <h1>🍷 di<span style="font-style:italic;font-weight:300">Vino</span></h1>
        <p>Il motore AI che conosce la chimica del tuo piatto · Trova · Abbina · Acquista</p>
        <p style="font-size:0.82em;color:#c8a0a4;margin-top:4px">Perché il vino giusto è sempre… diVino.</p>
    </div>
    """, unsafe_allow_html=True)
    
    # ── CHECK API KEY ──
    api_key = os.environ.get("ANTHROPIC_API_KEY", "") or st.secrets.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        st.warning("""
        **🔑 API Key mancante.**  
        Aggiungi `ANTHROPIC_API_KEY` come variabile d'ambiente:  
        ```
        export ANTHROPIC_API_KEY="sk-ant-..."
        streamlit run calice_di_vino_mvp.py
        ```
        Oppure crealo in `.streamlit/secrets.toml`:
        ```toml
        ANTHROPIC_API_KEY = "sk-ant-..."
        ```
        """)
    
    # ── INPUT PRINCIPALE ──
    st.markdown("### 🍽️ Cosa mangi stasera?")
    
    col_input, col_btn = st.columns([4, 1])
    with col_input:
        piatto = st.text_input(
            "", 
            placeholder="Es: Fiorentina al sangue · Spaghetti alle vongole · Sushi di tonno · Pasta al tartufo nero...",
            label_visibility="collapsed"
        )
    with col_btn:
        cerca = st.button("🍷 Trova l'abbinamento", key="main_search")
    
    # ── FILTRI ──
    with st.expander("⚙️ Filtri avanzati", expanded=False):
        col1, col2, col3, col4, col5 = st.columns(5)
        
        with col1:
            area = st.selectbox("🌍 Area", ["Italia", "Estero", "Qualsiasi"])
        
        with col2:
            regioni_italia = ["Qualsiasi","Lombardia","Piemonte","Toscana","Veneto","Campania",
                              "Sardegna","Sicilia","Friuli-Venezia Giulia","Umbria","Trentino-Alto Adige"]
            paesi_estero   = ["Qualsiasi","Francia","Spagna"]
            regione_opts   = regioni_italia if area == "Italia" else (paesi_estero if area == "Estero" else ["Qualsiasi"])
            regione        = st.selectbox("🗺️ Regione", regione_opts)
        
        with col3:
            fascia = st.selectbox("💰 Fascia prezzo", ["Qualsiasi","Economico (<12€)","Standard (12-25€)","Premium (25-50€)","Lusso (>50€)"])
        
        with col4:
            tipo = st.selectbox("🍾 Tipo vino", ["Qualsiasi","Bianco","Rosso","Spumante","Dolce"])
        
        with col5:
            budget_max = st.number_input("💶 Budget max (€)", min_value=0, max_value=500, value=0, step=5)
    
    # ── ESECUZIONE RICERCA ──
    if cerca and piatto:
        
        # Costruisci filtri
        fascia_map = {
            "Economico (<12€)": "economico",
            "Standard (12-25€)": "standard",
            "Premium (25-50€)": "premium",
            "Lusso (>50€)": "lusso"
        }
        tipo_map = {"Bianco":"Bianco","Rosso":"Rosso","Spumante":"Spumante","Dolce":"Dolce"}
        
        filtri = {
            "regione": regione if regione != "Qualsiasi" else "qualsiasi",
            "fascia":  fascia_map.get(fascia, "qualsiasi"),
            "tipo":    tipo_map.get(tipo, "qualsiasi"),
            "budget_max": budget_max if budget_max > 0 else None
        }
        
        # Filtra catalogo lato client prima di mandare all'AI
        catalogo_filtrato = WINE_CATALOG.copy()
        if filtri["regione"] != "qualsiasi":
            catalogo_filtrato = [w for w in catalogo_filtrato if w["regione"] == filtri["regione"]]
        if filtri["fascia"] != "qualsiasi":
            catalogo_filtrato = [w for w in catalogo_filtrato if w["fascia"] == filtri["fascia"]]
        if filtri["tipo"] != "qualsiasi":
            catalogo_filtrato = [w for w in catalogo_filtrato if w["tipo"] == filtri["tipo"]]
        if filtri["budget_max"]:
            catalogo_filtrato = [w for w in catalogo_filtrato if w["prezzo"] <= filtri["budget_max"]]
        
        if not catalogo_filtrato:
            st.warning("Nessun vino nel catalogo soddisfa questi filtri. Prova ad allargarli.")
            return
        
        # Chiamata AI
        with st.spinner("🧪 Analisi molecolare del piatto in corso..."):
            risultato = get_ai_pairing(piatto, filtri, catalogo_filtrato)
        
        if "error" in risultato:
            if risultato["error"] == "API_KEY_MISSING":
                st.error("❌ API Key Anthropic non configurata. Vedi istruzioni in alto.")
            else:
                st.error(f"Errore AI: {risultato['error']}")
            return
        
        # ── OUTPUT ──
        analisi = risultato.get("analisi_piatto", {})
        abbinamenti = risultato.get("abbinamenti", [])
        consiglio = risultato.get("consiglio_del_sommelier", "")
        
        # Salva nel DB
        save_search(user_id, piatto, filtri["regione"], abbinamenti)
        
        st.markdown("---")
        
        # Analisi chimica del piatto
        with st.expander("🔬 Analisi molecolare del piatto", expanded=True):
            col_a, col_b, col_c, col_d = st.columns(4)
            
            kpi = [
                ("Grassi",     analisi.get("grassi","—")[:60],          "🧈"),
                ("Proteine",   analisi.get("proteine","—")[:60],         "🥩"),
                ("Acidità",    analisi.get("acidi","—")[:60],            "🍋"),
                ("Aromi vol.", ", ".join(analisi.get("volatili_aromatici",[])[:3]) or "—", "🌿"),
            ]
            for col, (label, val, ico) in zip([col_a,col_b,col_c,col_d], kpi):
                with col:
                    st.metric(f"{ico} {label}", val)
            
            col_e, col_f, col_g = st.columns(3)
            with col_e: st.metric("Tendenza dolce", analisi.get("tendenza_dolce","—"))
            with col_f: st.metric("Umami",          analisi.get("umami","—"))
            with col_g: st.metric("Complessità",    analisi.get("complessita_complessiva","—"))
        
        # Consiglio sommelier
        if consiglio:
            st.info(f"🍷 **diVino consiglia:** {consiglio}")
        
        # Schede vini
        st.markdown(f"### ✨ {len(abbinamenti)} abbinamenti trovati per: *{piatto}*")
        
        for idx, abb in enumerate(abbinamenti):
            wine = get_wine_by_id(abb.get("wine_id",""))
            if wine:
                render_wine_card(wine, abb, piatto, user_id, idx)
            else:
                st.warning(f"Vino ID {abb.get('wine_id')} non trovato nel catalogo.")
        
        # Sezione feedback finale
        if user_id:
            st.markdown("---")
            st.caption("🙏 I tuoi feedback migliorano il motore AI. Valuta i vini che provi per personalizzare i prossimi abbinamenti.")
        else:
            st.info("💡 **Registrati gratis** per salvare lo storico delle tue ricerche e migliorare i consigli con i tuoi feedback personali.")
    
    elif cerca and not piatto:
        st.warning("Scrivi il piatto per ricevere i consigli del sommelier AI!")
    
    # ── SEZIONE CATALOGO (quando non si sta cercando) ──
    if not cerca:
        st.markdown("---")
        st.markdown("### 📚 Esplora il catalogo")
        
        col_f1, col_f2 = st.columns(2)
        with col_f1:
            filter_tipo = st.selectbox("Filtra per tipo", ["Tutti","Bianco","Rosso","Spumante","Dolce"], key="cat_tipo")
        with col_f2:
            filter_reg = st.selectbox("Filtra per regione", ["Tutte"] + sorted(list(set(w["regione"] for w in WINE_CATALOG))), key="cat_reg")
        
        cat_view = WINE_CATALOG.copy()
        if filter_tipo != "Tutti":
            cat_view = [w for w in cat_view if w["tipo"] == filter_tipo]
        if filter_reg != "Tutte":
            cat_view = [w for w in cat_view if w["regione"] == filter_reg]
        
        cols = st.columns(3)
        for i, w in enumerate(cat_view[:12]):
            with cols[i % 3]:
                tags = " ".join([f'<span class="molecule-pill">{t}</span>' for t in w["tag"][:2]])
                st.markdown(f"""
                <div class="wine-card" style="min-height:140px">
                    <h3 style="font-size:1em">{w['nome']}</h3>
                    <p style="font-size:0.78em;color:#888;margin:2px 0">{w['regione']} · {w['tipo']} · {w['prezzo']:.2f}€</p>
                    <div class="molecule-row" style="padding:4px 6px">{tags}</div>
                    <a href="{w['url']}" target="_blank" class="buy-btn" style="font-size:0.8em;padding:7px">
                        🛒 {w['fornitore']}
                    </a>
                </div>
                """, unsafe_allow_html=True)


if __name__ == "__main__":
    main()
