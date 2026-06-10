import streamlit as st
import anthropic
import sqlite3
import json
import hashlib
import os
import re
from datetime import datetime
from typing import Optional

st.set_page_config(
    page_title="diVino — AI Wine Pairing",
    page_icon="🍷",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ─────────────────────────────────────────────
# TRADUZIONI
# ─────────────────────────────────────────────
LANG = {
    "it": {
        "hero_title": "diVino",
        "hero_sub": "Il motore che abbina cibo e vino tramite la chimica molecolare dei tuoi piatti",
        "hero_tagline": "Perché il vino giusto è sempre… diVino.",
        "describe_dish": "🍽️ Descrivi il tuo piatto",
        "dish_caption": "Più dettagli dai (ingredienti, cottura, salse), più precisi saranno gli abbinamenti",
        "dish_placeholder": "Es: pollo con asparagi e burro · spaghetti alle vongole · fiorentina al sangue con porcini...",
        "pair_btn": "🍷 Abbina",
        "filters": "⚙️ Filtri",
        "area": "🌍 Area",
        "any": "Qualsiasi",
        "italy": "Italia",
        "abroad": "Estero",
        "region": "🗺️ Regione / Paese",
        "price_band": "💰 Fascia",
        "wine_type": "🍾 Tipo",
        "price_range": "💶 Range prezzo (€)",
        "min": "Min",
        "max": "Max",
        "analyzing": "🧪 Analisi molecolare di '{}' in corso…",
        "no_filters": "⚠️ Nessun vino soddisfa questi filtri. Prova ad allargarli.",
        "molecular_analysis": "🔬 Analisi molecolare del piatto",
        "fats": "🧈 Grassi",
        "proteins": "🥩 Proteine",
        "acidity": "🍋 Acidità",
        "volatiles": "🌿 Volatili",
        "spice": "🌶️ Piccantezza",
        "umami": "🫧 Umami",
        "sweetness": "🍬 Dolcezza",
        "complexity": "⚗️ Complessità",
        "challenge": "🎯 **Sfida chimica:**",
        "ingredients_found": "**Ingredienti:**",
        "divino_suggests": "🍷 **diVino consiglia:**",
        "catalog_title": "📚 Catalogo Vini",
        "catalog": "Catalogo",
        "pairing": "Abbinamento",
        "chemistry": "🔬 Chimica:",
        "in_mouth": "👅 In bocca:",
        "why_works": "💡 Perché funziona:",
        "buy": "🛒 Acquista — {:.2f}€",
        "rate": "⭐ Valuta",
        "save": "💾 Salva",
        "feedback_thanks": "Grazie! Il feedback migliora il motore AI.",
        "login": "Accedi",
        "register": "Registrati",
        "email": "Email",
        "password": "Password",
        "name": "Nome",
        "create_account": "Crea account",
        "welcome": "Benvenuto, {}!",
        "wrong_credentials": "Credenziali errate.",
        "account_created": "Account creato! Ora accedi.",
        "email_exists": "Email già registrata.",
        "fill_fields": "Compila tutti i campi.",
        "searches": "Ricerche",
        "rated_wines": "Vini valutati",
        "avg_rating": "Voto medio",
        "last_searches": "**📜 Ultime ricerche**",
        "logout": "🚪 Esci",
        "sidebar_caption": "diVino v6.0 · Motore AI chimico",
        "api_missing": "🔑 API Key Anthropic mancante.",
        "grape": "Uva",
        "alcohol": "Alcol",
        "body": "Corpo",
        "tannins": "Tannini",
        "acidity_label": "Acidità",
        "match": "Match",
        "types_all": "Tutti",
        "types_cat": ["Tutti","Bianco","Rosso","Spumante","Rosato","Dolce"],
        "fascia_all": "Tutte",
        "fascia_cat": ["Tutte","economico","standard","premium","lusso"],
        "bands": {"Economico (<12€)":"economico","Standard (12–25€)":"standard","Premium (25–50€)":"premium","Lusso (>50€)":"lusso"},
        "bands_display": ["Qualsiasi","Economico (<12€)","Standard (12–25€)","Premium (25–50€)","Lusso (>50€)"],
        "bands_labels": {"economico":"Economico <12€","standard":"Standard 12–25€","premium":"Premium 25–50€","lusso":"Lusso >50€"},
        "showing": "Mostrando 30 di {}. Usa i filtri.",
        "showing_n": "{} vini",
        "write_dish": "✏️ Scrivi il piatto per ricevere gli abbinamenti!",
        "register_cta": "💡 **Registrati gratis** per salvare le tue ricerche.",
        "continent_europe": "Europa",
        "continent_americas": "Americhe",
        "continent_oceania": "Oceania",
        "continent_southamerica": "Sud America",
        "continent_asia": "Asia",
        "language": "🌐 Lingua / Language",
        "ai_explanation_title": "🤖 Come funziona l'AI",
        "ai_explanation": "L'AI analizza i composti molecolari del piatto (lipidi, proteine, acidi, terpeni…) e calcola uno score chimico 0–100 per ogni vino del catalogo. Vengono mostrati tutti i vini con score ≥ 55.",
        "newsletter_title": "🍷 Ricevi abbinamenti esclusivi",
        "newsletter_sub": "Ogni settimana: 3 abbinamenti stagionali + offerte riservate ai membri diVino.",
        "newsletter_btn": "Iscriviti gratis",
        "newsletter_placeholder": "La tua email",
        "newsletter_ok": "✅ Iscritto! Controlla la tua email.",
        "premium_title": "🏆 diVino Premium",
        "premium_sub": "Abbinamenti illimitati, accesso ai vini rari, consulenza sommelier AI.",
        "premium_btn": "Scopri Premium — 4.90€/mese",
        "quiz_title": "🍾 Qual è il tuo vino ideale?",
        "quiz_sub": "3 domande per scoprire il tuo stile enologico",
        "quiz_btn": "Inizia il quiz",
    },
    "en": {
        "hero_title": "diVino",
        "hero_sub": "AI-powered molecular chemistry wine pairing engine",
        "hero_tagline": "Because the right wine is always… diVino.",
        "describe_dish": "🍽️ Describe your dish",
        "dish_caption": "More details (ingredients, cooking method, sauces) = more precise pairings",
        "dish_placeholder": "E.g.: chicken with asparagus and butter · spaghetti with clams · Florentine steak with porcini...",
        "pair_btn": "🍷 Find Pairings",
        "filters": "⚙️ Filters",
        "area": "🌍 Area",
        "any": "Any",
        "italy": "Italy",
        "abroad": "International",
        "region": "🗺️ Region / Country",
        "price_band": "💰 Price Band",
        "wine_type": "🍾 Type",
        "price_range": "💶 Price Range (€)",
        "min": "Min",
        "max": "Max",
        "analyzing": "🧪 Molecular analysis of '{}' in progress…",
        "no_filters": "⚠️ No wines match these filters. Try widening them.",
        "molecular_analysis": "🔬 Molecular analysis of the dish",
        "fats": "🧈 Fats",
        "proteins": "🥩 Proteins",
        "acidity": "🍋 Acidity",
        "volatiles": "🌿 Volatiles",
        "spice": "🌶️ Spiciness",
        "umami": "🫧 Umami",
        "sweetness": "🍬 Sweetness",
        "complexity": "⚗️ Complexity",
        "challenge": "🎯 **Pairing challenge:**",
        "ingredients_found": "**Ingredients:**",
        "divino_suggests": "🍷 **diVino recommends:**",
        "catalog_title": "📚 Wine Catalog",
        "catalog": "Catalog",
        "pairing": "Pairing",
        "chemistry": "🔬 Chemistry:",
        "in_mouth": "👅 On the palate:",
        "why_works": "💡 Why it works:",
        "buy": "🛒 Buy — {:.2f}€",
        "rate": "⭐ Rate",
        "save": "💾 Save",
        "feedback_thanks": "Thanks! Your feedback improves the AI engine.",
        "login": "Log In",
        "register": "Register",
        "email": "Email",
        "password": "Password",
        "name": "Name",
        "create_account": "Create Account",
        "welcome": "Welcome, {}!",
        "wrong_credentials": "Wrong credentials.",
        "account_created": "Account created! Now log in.",
        "email_exists": "Email already registered.",
        "fill_fields": "Please fill all fields.",
        "searches": "Searches",
        "rated_wines": "Rated wines",
        "avg_rating": "Avg rating",
        "last_searches": "**📜 Recent searches**",
        "logout": "🚪 Log Out",
        "sidebar_caption": "diVino v6.0 · AI Chemical Engine",
        "api_missing": "🔑 Anthropic API Key missing.",
        "grape": "Grape",
        "alcohol": "Alcohol",
        "body": "Body",
        "tannins": "Tannins",
        "acidity_label": "Acidity",
        "match": "Match",
        "types_all": "All",
        "types_cat": ["All","White","Red","Sparkling","Rosé","Sweet"],
        "fascia_all": "All",
        "fascia_cat": ["All","economico","standard","premium","lusso"],
        "bands": {"Budget (<12€)":"economico","Standard (12–25€)":"standard","Premium (25–50€)":"premium","Luxury (>50€)":"lusso"},
        "bands_display": ["Any","Budget (<12€)","Standard (12–25€)","Premium (25–50€)","Luxury (>50€)"],
        "bands_labels": {"economico":"Budget <12€","standard":"Standard 12–25€","premium":"Premium 25–50€","lusso":"Luxury >50€"},
        "showing": "Showing 30 of {}. Use filters to refine.",
        "showing_n": "{} wines",
        "write_dish": "✏️ Enter a dish to receive pairings!",
        "register_cta": "💡 **Register free** to save your searches.",
        "continent_europe": "Europe",
        "continent_americas": "Americas",
        "continent_oceania": "Oceania",
        "continent_southamerica": "South America",
        "continent_asia": "Asia",
        "language": "🌐 Language / Lingua",
        "ai_explanation_title": "🤖 How the AI works",
        "ai_explanation": "The AI breaks down each dish into molecular compounds (lipids, proteins, acids, terpenes…) and computes a 0–100 chemical score for every wine. All wines scoring ≥ 55 are shown.",
        "newsletter_title": "🍷 Get exclusive pairings",
        "newsletter_sub": "Weekly: 3 seasonal pairings + member-only offers.",
        "newsletter_btn": "Subscribe free",
        "newsletter_placeholder": "Your email",
        "newsletter_ok": "✅ Subscribed! Check your inbox.",
        "premium_title": "🏆 diVino Premium",
        "premium_sub": "Unlimited pairings, rare wines, AI sommelier advice.",
        "premium_btn": "Discover Premium — €4.90/month",
        "quiz_title": "🍾 What's your ideal wine?",
        "quiz_sub": "3 questions to find your wine style",
        "quiz_btn": "Start the quiz",
    },
    "es": {
        "hero_title": "diVino",
        "hero_sub": "Motor de maridaje basado en química molecular con IA",
        "hero_tagline": "Porque el vino correcto siempre es… diVino.",
        "describe_dish": "🍽️ Describe tu plato",
        "dish_caption": "Más detalles = maridajes más precisos",
        "dish_placeholder": "Ej: pollo con espárragos · espagueti con almejas · chuletón con boletus...",
        "pair_btn": "🍷 Maridar",
        "filters": "⚙️ Filtros",
        "area": "🌍 Área",
        "any": "Cualquiera",
        "italy": "Italia",
        "abroad": "Internacional",
        "region": "🗺️ Región / País",
        "price_band": "💰 Gama",
        "wine_type": "🍾 Tipo",
        "price_range": "💶 Rango (€)",
        "min": "Mín",
        "max": "Máx",
        "analyzing": "🧪 Análisis molecular de '{}' en curso…",
        "no_filters": "⚠️ Ningún vino cumple estos filtros.",
        "molecular_analysis": "🔬 Análisis molecular del plato",
        "fats": "🧈 Grasas",
        "proteins": "🥩 Proteínas",
        "acidity": "🍋 Acidez",
        "volatiles": "🌿 Volátiles",
        "spice": "🌶️ Picante",
        "umami": "🫧 Umami",
        "sweetness": "🍬 Dulzura",
        "complexity": "⚗️ Complejidad",
        "challenge": "🎯 **Reto de maridaje:**",
        "ingredients_found": "**Ingredientes:**",
        "divino_suggests": "🍷 **diVino recomienda:**",
        "catalog_title": "📚 Catálogo",
        "catalog": "Catálogo",
        "pairing": "Maridaje",
        "chemistry": "🔬 Química:",
        "in_mouth": "👅 En boca:",
        "why_works": "💡 Por qué funciona:",
        "buy": "🛒 Comprar — {:.2f}€",
        "rate": "⭐ Valorar",
        "save": "💾 Guardar",
        "feedback_thanks": "¡Gracias!",
        "login": "Iniciar sesión",
        "register": "Registrarse",
        "email": "Email",
        "password": "Contraseña",
        "name": "Nombre",
        "create_account": "Crear cuenta",
        "welcome": "¡Bienvenido, {}!",
        "wrong_credentials": "Credenciales incorrectas.",
        "account_created": "¡Cuenta creada!",
        "email_exists": "Email ya registrado.",
        "fill_fields": "Rellena todos los campos.",
        "searches": "Búsquedas",
        "rated_wines": "Vinos valorados",
        "avg_rating": "Valoración media",
        "last_searches": "**📜 Últimas búsquedas**",
        "logout": "🚪 Salir",
        "sidebar_caption": "diVino v6.0 · Motor AI Químico",
        "api_missing": "🔑 Falta la API Key.",
        "grape": "Uva",
        "alcohol": "Alcohol",
        "body": "Cuerpo",
        "tannins": "Taninos",
        "acidity_label": "Acidez",
        "match": "Compatibilidad",
        "types_all": "Todos",
        "types_cat": ["Todos","Blanco","Tinto","Espumoso","Rosado","Dulce"],
        "fascia_all": "Todos",
        "fascia_cat": ["Todos","economico","standard","premium","lusso"],
        "bands": {"Económico (<12€)":"economico","Estándar (12–25€)":"standard","Premium (25–50€)":"premium","Lujo (>50€)":"lusso"},
        "bands_display": ["Cualquiera","Económico (<12€)","Estándar (12–25€)","Premium (25–50€)","Lujo (>50€)"],
        "bands_labels": {"economico":"Económico <12€","standard":"Estándar 12–25€","premium":"Premium 25–50€","lusso":"Lujo >50€"},
        "showing": "Mostrando 30 de {}.",
        "showing_n": "{} vinos",
        "write_dish": "✏️ ¡Escribe el plato!",
        "register_cta": "💡 **Regístrate gratis** para guardar búsquedas.",
        "continent_europe": "Europa",
        "continent_americas": "Américas",
        "continent_oceania": "Oceanía",
        "continent_southamerica": "Sudamérica",
        "continent_asia": "Asia",
        "language": "🌐 Idioma",
        "ai_explanation_title": "🤖 Cómo funciona",
        "ai_explanation": "La IA descompone el plato en compuestos moleculares y calcula un score químico 0–100 para cada vino. Se muestran todos los vinos con score ≥ 55.",
        "newsletter_title": "🍷 Maridajes exclusivos",
        "newsletter_sub": "Cada semana: 3 maridajes + ofertas solo para miembros.",
        "newsletter_btn": "Suscríbete gratis",
        "newsletter_placeholder": "Tu email",
        "newsletter_ok": "✅ ¡Suscrito!",
        "premium_title": "🏆 diVino Premium",
        "premium_sub": "Maridajes ilimitados, vinos raros, sommelier AI.",
        "premium_btn": "Descubre Premium — 4,90€/mes",
        "quiz_title": "🍾 ¿Cuál es tu vino ideal?",
        "quiz_sub": "3 preguntas para descubrir tu estilo",
        "quiz_btn": "Empezar el quiz",
    }
}

def T(key, *args):
    lang = st.session_state.get("lang", "it")
    txt = LANG.get(lang, LANG["it"]).get(key, LANG["it"].get(key, key))
    if args:
        try: return txt.format(*args)
        except: return txt
    return txt

# ─────────────────────────────────────────────
# CSS
# ─────────────────────────────────────────────
st.markdown("""
<style>
.main { background-color: #faf7f5; }
.hero {
    background: linear-gradient(135deg, #2a0608 0%, #4a1018 50%, #6b2030 100%);
    padding: 36px 28px; border-radius: 16px;
    text-align: center; color: white; margin-bottom: 28px;
    border: 1px solid rgba(255,255,255,0.07);
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}
.hero h1 { margin: 0; font-size: 3em; letter-spacing: -1px; font-weight: 800; }
.hero p  { margin: 10px 0 0; color: #e0b0b8; font-style: italic; font-size: 1.08em; }
.hero-sub { font-size: 0.82em !important; color: #b07880 !important; margin-top: 6px !important; }
.score-bar { background: #f0e8e9; border-radius: 8px; height: 9px; overflow: hidden; margin: 4px 0 10px; }
.score-fill { height: 100%; border-radius: 8px; }
.wine-card {
    background: white; border-radius: 14px;
    border-left: 5px solid #5c1d24;
    padding: 0 0 18px 0; margin: 16px 0;
    box-shadow: 0 3px 16px rgba(0,0,0,0.07);
    overflow: hidden;
}
.wine-card-body { padding: 16px 22px 0 22px; }
.wine-card h3 { margin: 0 0 8px; color: #3d0a10; font-size: 1.18em; }
.badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.74em; font-weight: 600; margin: 2px 3px 2px 0; }
.badge-price  { background: #d1e7dd; color: #0a3d1f; }
.badge-geo    { background: #cff4fc; color: #063242; }
.badge-type   { background: #f3d9fa; color: #4a0a5c; }
.badge-score  { background: #fff3cd; color: #5c3d00; }
.badge-match  { background: #fde8e8; color: #5c0a10; }
.molecule-row { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0; padding: 8px 10px; background: #faf7f5; border-radius: 8px; }
.molecule-pill { background: #3d0a10; color: white; padding: 2px 9px; border-radius: 20px; font-size: 0.72em; font-weight: 500; }
.buy-btn {
    display: block; width: 100%;
    background: linear-gradient(135deg, #5c1d24, #8a2832);
    color: white !important; text-align: center; padding: 12px;
    border-radius: 8px; font-weight: 700; text-decoration: none;
    font-size: 0.92em; margin-top: 10px; transition: all 0.2s;
    border: none; cursor: pointer; letter-spacing: 0.3px;
}
.buy-btn:hover { background: linear-gradient(135deg,#8a2832,#b03040); color: white !important; box-shadow: 0 4px 12px rgba(92,29,36,0.35); }
.profile-card { background: white; border-radius: 10px; padding: 14px; margin-bottom: 10px; border: 1px solid #f0e8e9; }
.profile-stat { font-size: 0.8em; color: #888; margin: 3px 0; }
.profile-val  { font-size: 1.1em; font-weight: 600; color: #3d0a10; }
.history-item { border-left: 3px solid #e8c5c8; padding: 8px 12px; margin: 6px 0; background: #faf7f5; border-radius: 0 6px 6px 0; font-size: 0.84em; }
.stButton > button { background: #5c1d24 !important; color: white !important; border-radius: 8px !important; border: none !important; font-weight: 600 !important; width: 100% !important; padding: 10px !important; }
.stButton > button:hover { background: #8a2832 !important; }
.stTextInput input { border-radius: 8px !important; border-color: #e0d0d2 !important; }
.continent-header { background: linear-gradient(90deg,#3d0a10,#6b2030); color:white; padding:8px 16px; border-radius:8px; font-weight:700; margin:20px 0 8px; font-size:0.95em; letter-spacing:0.5px; }
/* Gauge mini per categorie */
.cat-gauge-wrap { display:flex; align-items:center; gap:6px; margin:3px 0; }
.cat-gauge-label { font-size:0.7em; color:#888; width:72px; flex-shrink:0; }
.cat-gauge-bar { flex:1; background:#f0e8e9; border-radius:6px; height:7px; overflow:hidden; }
.cat-gauge-fill { height:100%; border-radius:6px; }
.cat-gauge-pct { font-size:0.7em; font-weight:700; color:#5c1d24; width:28px; text-align:right; }
/* Monetization cards */
.cta-card {
    background: linear-gradient(135deg, #2a0608, #4a1018);
    color: white; border-radius: 14px; padding: 22px 24px;
    margin: 10px 0; text-align: center;
}
.cta-card h4 { margin:0 0 6px; font-size:1.1em; }
.cta-card p { margin:0 0 14px; font-size:0.86em; color:#e0b0b8; }
.cta-btn {
    display:inline-block; background: white; color:#5c1d24 !important;
    padding:10px 22px; border-radius:8px; font-weight:700;
    text-decoration:none; font-size:0.88em; cursor:pointer;
}
.quiz-card {
    background: linear-gradient(135deg, #0a3d2a, #1a6b47);
    color:white; border-radius:14px; padding:20px 24px; margin:10px 0; text-align:center;
}
.quiz-card h4 { margin:0 0 6px; font-size:1.05em; }
.quiz-card p { margin:0 0 12px; font-size:0.84em; color:#a0e0c8; }
</style>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────
# DATABASE
# ─────────────────────────────────────────────
DB_PATH = "divino.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE,
        nome TEXT, password_hash TEXT, preferenze TEXT DEFAULT '{}', created_at TEXT)""")
    c.execute("""CREATE TABLE IF NOT EXISTS searches (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER,
        piatto TEXT, filtri TEXT, risultati TEXT, created_at TEXT)""")
    c.execute("""CREATE TABLE IF NOT EXISTS wine_feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER,
        wine_name TEXT, piatto TEXT, rating INTEGER, note TEXT, created_at TEXT)""")
    conn.commit(); conn.close()

def hash_pwd(p): return hashlib.sha256(p.encode()).hexdigest()

def register_user(email, nome, password):
    try:
        conn = sqlite3.connect(DB_PATH); c = conn.cursor()
        c.execute("INSERT INTO users (email,nome,password_hash,created_at) VALUES (?,?,?,?)",
                  (email.lower(), nome, hash_pwd(password), datetime.now().isoformat()))
        conn.commit(); conn.close(); return True
    except sqlite3.IntegrityError: return False

def login_user(email, password):
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("SELECT id,nome,email,preferenze FROM users WHERE email=? AND password_hash=?",
              (email.lower(), hash_pwd(password)))
    row = c.fetchone(); conn.close()
    if row: return {"id":row[0],"nome":row[1],"email":row[2],"preferenze":json.loads(row[3])}
    return None

def save_search(user_id, piatto, filtri, risultati):
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("INSERT INTO searches (user_id,piatto,filtri,risultati,created_at) VALUES (?,?,?,?,?)",
              (user_id, piatto, json.dumps(filtri,ensure_ascii=False),
               json.dumps(risultati,ensure_ascii=False), datetime.now().isoformat()))
    conn.commit(); conn.close()

def get_history(user_id, limit=8):
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("SELECT piatto,created_at FROM searches WHERE user_id=? ORDER BY created_at DESC LIMIT ?", (user_id,limit))
    rows = c.fetchall(); conn.close(); return rows

def save_feedback(user_id, wine_name, piatto, rating, note=""):
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("INSERT INTO wine_feedback (user_id,wine_name,piatto,rating,note,created_at) VALUES (?,?,?,?,?,?)",
              (user_id, wine_name, piatto, rating, note, datetime.now().isoformat()))
    conn.commit(); conn.close()

def get_stats(user_id):
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM searches WHERE user_id=?", (user_id,)); ns = c.fetchone()[0]
    c.execute("SELECT COUNT(*),AVG(rating) FROM wine_feedback WHERE user_id=?", (user_id,))
    row = c.fetchone(); conn.close()
    return {"searches":ns, "ratings":row[0], "avg_rating":round(row[1],1) if row[1] else 0}

# ─────────────────────────────────────────────
# CATALOGO VINI
# ─────────────────────────────────────────────
BASE_SHOP = "https://www.divino-shop.it/vini"

FOTO = {
    "rosso_piemonte":   "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80",
    "rosso_toscana":    "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=400&q=80",
    "rosso_sicilia":    "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&q=80",
    "rosso_veneto":     "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&q=80",
    "rosso_campania":   "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80",
    "rosso_sardegna":   "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&q=80",
    "rosso_umbria":     "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=400&q=80",
    "rosso_estero":     "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    "bianco_nord":      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80",
    "bianco_sud":       "https://images.unsplash.com/photo-1573062066186-9e03c1f7f2c6?w=400&q=80",
    "bianco_estero":    "https://images.unsplash.com/photo-1600298882525-0e3b34a37a58?w=400&q=80",
    "spumante":         "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&q=80",
    "dolce":            "https://images.unsplash.com/photo-1574096079513-d8259312b785?w=400&q=80",
    "rosato":           "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&q=80",
}

def W(id,nome,regione,continente,tipo,fascia,prezzo,uva,alcol,acidita,tannini,corpo,rz,profilo,abbina,non_abbina,slug,foto_key):
    return {
        "id":id,"nome":nome,"regione":regione,"continente":continente,"tipo":tipo,
        "fascia":fascia,"prezzo":prezzo,"uva":uva,"alcol":alcol,"acidita":acidita,
        "tannini":tannini,"corpo":corpo,"residuo_zuccherino":rz,
        "profilo_aromatico":profilo,"abbina_bene_con":abbina,"non_abbina_con":non_abbina,
        "slug":slug,"foto":FOTO.get(foto_key, FOTO["rosso_estero"])
    }

WINE_CATALOG = [
    # ══════════════════════════════════
    # ITALIA — PIEMONTE
    # ══════════════════════════════════
    W("BAR001","Barolo DOCG Borgogno 2018","Piemonte","Italia","Rosso","premium",42.00,"Nebbiolo",14.5,"alta","potenti","pieno",0.8,["rosa appassita","cuoio","tabacco","catrame","liquirizia"],["selvaggina","brasati","tartufo","formaggi stagionati"],["pesce","frutti di mare","dolci"],"barolo-borgogno-2018","rosso_piemonte"),
    W("BAR002","Barolo DOCG Pio Cesare Ornato 2017","Piemonte","Italia","Rosso","lusso",78.00,"Nebbiolo",14.0,"alta","seta","pieno",0.6,["violetta","prugna","spezie orientali","muschio","vaniglia"],["filetto","porcini","tartufo bianco","cacciagione"],["frittura","acidità elevata"],"barolo-pio-cesare-ornato","rosso_piemonte"),
    W("BAR003","Barbaresco DOCG Gaja 2019","Piemonte","Italia","Rosso","lusso",155.00,"Nebbiolo",13.5,"altissima","fini","pieno",0.5,["rosa","lampone","tabacco","cuoio nobile","spezie fini"],["fagiano","petto d'anatra","risotto al tartufo","formaggi erborinati"],["piatti dolci","frittura"],"barbaresco-gaja-2019","rosso_piemonte"),
    W("OVE001","Ovello Barbaresco Riserva DOCG Produttori","Piemonte","Italia","Rosso","premium",45.00,"Nebbiolo",14.0,"alta","seta","pieno",0.6,["rosa essiccata","tabacco Virginia","cuoio nobile","spezie fini","rabarbaro"],["filetto di manzo","tartufo bianco","risotto al tartufo","capriolo","formaggi stagionati 36 mesi"],["pesce","crostacei","piatti delicati"],"ovello-barbaresco-produttori","rosso_piemonte"),
    W("NEB001","Nebbiolo d'Alba DOC Prunotto","Piemonte","Italia","Rosso","standard",17.50,"Nebbiolo",13.5,"alta","medi","medio-pieno",1.0,["viola","ciliegia selvatica","spezie dolci","erbe alpine"],["pasta al ragù","stracotto","salumi stagionati"],["pesce","crostacei"],"nebbiolo-alba-prunotto","rosso_piemonte"),
    W("DOL001","Dolcetto d'Alba DOC Vietti","Piemonte","Italia","Rosso","economico",10.50,"Dolcetto",13.0,"bassa","morbidi","medio",1.5,["mora","mandorla","prugna fresca","liquirizia"],["pizza","salumi","pasta al sugo","cotoletta"],["pesce crudo","ostriche"],"dolcetto-alba-vietti","rosso_piemonte"),
    W("BAR004","Barbera d'Asti Superiore DOCG La Morandina","Piemonte","Italia","Rosso","standard",13.00,"Barbera",14.0,"altissima","bassi","medio",0.8,["ciliegia","prugna","spezie","vaniglia"],["pasta al pomodoro","pizza","salumi grassi","formaggi semi-stagionati"],["ostriche","pesce delicato"],"barbera-asti-morandina","rosso_piemonte"),
    W("BAR005","Barbera d'Alba DOC Giacomo Conterno","Piemonte","Italia","Rosso","premium",28.00,"Barbera",14.0,"altissima","bassi","pieno",0.8,["ciliegia croccante","viola","spezie dolci","legno fine"],["brasato al Barolo","pasta al ragù","pizza gourmet","salumi"],["pesce","ostriche"],"barbera-alba-conterno","rosso_piemonte"),
    W("GAV001","Gavi di Gavi DOCG La Scolca Etichetta Nera","Piemonte","Italia","Bianco","premium",24.00,"Cortese",12.5,"alta","assenti","leggero-medio",1.8,["mandorla","pietra bagnata","fiori bianchi","agrumi","mela verde"],["pesce al vapore","spaghetti alle vongole","frittura mista","risotto allo zafferano","antipasti di pesce"],["carne rossa","formaggi piccanti","piatti grassi"],"gavi-la-scolca","bianco_nord"),
    W("GAV002","Gavi DOCG Broglia La Meirana","Piemonte","Italia","Bianco","standard",16.00,"Cortese",12.5,"alta","assenti","leggero",2.0,["mandorla fresca","agrumi","fiori bianchi","minerale"],["pesce al forno","risotto alle verdure","insalate di mare","frittura"],["carne rossa","formaggi stagionati"],"gavi-broglia-meirana","bianco_nord"),
    W("MOS001","Moscato d'Asti DOCG Ceretto","Piemonte","Italia","Dolce","economico",11.50,"Moscato Bianco",5.5,"media","assenti","leggero",110.0,["pesca","albicocca","fiori d'arancio","muschio bianco","miele"],["crostate di frutta","panettone","formaggi erborinati dolci","torta di mele"],["carne rossa","piatti salati","formaggi piccanti"],"moscato-asti-ceretto","dolce"),
    W("AST001","Asti Spumante DOCG Contratto","Piemonte","Italia","Spumante","economico",11.00,"Moscato",7.0,"media","assenti","leggero",80.0,["pesca","fiori d'arancio","albicocca","muschio","miele"],["pandoro","panettone","crostate di frutta","formaggi erborinati dolci"],["carne rossa","pesce crudo","piatti salati"],"asti-spumante-contratto","spumante"),
    W("LAS001","Alta Langa DOCG Enrico Serafino Zero Dosage","Piemonte","Italia","Spumante","standard",18.00,"Pinot Nero + Chardonnay",12.0,"alta","assenti","medio",0.0,["agrumi","lievito","crosta di pane","mela verde","mineralità"],["ostriche","tartare di tonno","sushi","crudités","formaggi freschi"],["dolci","piatti piccanti","brasati"],"alta-langa-serafino-zero","spumante"),
    W("RUC001","Ruchè di Castagnole Monferrato DOCG Dacapo","Piemonte","Italia","Rosso","standard",18.00,"Ruchè",13.5,"alta","medi","medio",1.0,["rosa","geranio","spezie orientali","ciliegia","fragola"],["salumi","pasta al ragù leggero","pollo arrosto","formaggi freschi"],["pesce","ostriche"],"ruche-dacapo","rosso_piemonte"),
    W("TIM001","Timorasso Colli Tortonesi DOC Walter Massa Derthona","Piemonte","Italia","Bianco","premium",32.00,"Timorasso",13.5,"alta","assenti","pieno",2.0,["pietra pomice","agrumi","miele","cera d'api","frutta a polpa bianca"],["risotto ai funghi porcini","pesce al forno","vitello tonnato","formaggi semistagionati"],["carne rossa pesante","formaggi molto stagionati"],"timorasso-massa-derthona","bianco_nord"),
    W("BRA001","Brachetto d'Acqui DOCG Braida","Piemonte","Italia","Spumante","economico",12.00,"Brachetto",5.5,"media","assenti","leggero",75.0,["fragola","lampone","rosa","frutti rossi freschi"],["formaggi erborinati dolci","torte alla fragola","mousse al cioccolato al latte","macarons"],["carne rossa","piatti salati"],"brachetto-braida","spumante"),
    # ══════════════════════════════════
    # ITALIA — TOSCANA
    # ══════════════════════════════════
    W("CHI001","Chianti Classico DOCG Riserva Fonterutoli","Toscana","Italia","Rosso","standard",22.00,"Sangiovese",13.5,"alta","medi","medio-pieno",1.0,["marasca","viola","spezie fini","cuoio leggero"],["bistecca fiorentina","cinghiale","pasta al tartufo","pecorino stagionato"],["crostacei","dessert al cioccolato"],"chianti-classico-riserva-fonterutoli","rosso_toscana"),
    W("CHI003","Chianti Classico DOCG Castello di Ama","Toscana","Italia","Rosso","premium",28.00,"Sangiovese",13.5,"alta","medi","medio-pieno",1.0,["viola","ciliegia","spezie fini","tabacco","cuoio"],["bistecca fiorentina","pappardelle al cinghiale","formaggi pecorino","arrosto di maiale"],["pesce crudo","dolci"],"chianti-classico-ama","rosso_toscana"),
    W("BRU001","Brunello di Montalcino DOCG Biondi-Santi 2016","Toscana","Italia","Rosso","lusso",185.00,"Sangiovese Grosso",14.0,"alta","seta","pieno",0.5,["frutta scura","vaniglia","tabacco","spezie nobili","terra umida"],["selvaggina nobile","tartufo nero","filetto al pepe","formaggi affilati"],["pesce","frittura","piatti leggeri"],"brunello-biondi-santi-2016","rosso_toscana"),
    W("BRU002","Brunello di Montalcino DOCG Casanova di Neri","Toscana","Italia","Rosso","lusso",65.00,"Sangiovese Grosso",14.5,"alta","potenti","pieno",0.6,["ciliegia nera","prugna secca","moka","spezie","cuoio"],["cinghiale","arrosto di manzo","formaggi erborinati"],["pesce","verdure delicate"],"brunello-casanova-di-neri","rosso_toscana"),
    W("VIN001","Vino Nobile di Montepulciano DOCG Avignonesi","Toscana","Italia","Rosso","premium",28.00,"Prugnolo Gentile",13.5,"alta","medi","medio-pieno",0.9,["ciliegia","spezie dolci","muschio","viola"],["bistecca","agnello","pasta al ragù di cinghiale"],["pesce crudo","dolci delicati"],"vino-nobile-avignonesi","rosso_toscana"),
    W("BOR001","Morellino di Scansano DOCG Poggio Argentiera","Toscana","Italia","Rosso","standard",15.00,"Sangiovese",13.5,"media","morbidi","medio",1.5,["mora","maremma","macchia","spezie marine"],["cinghiale","pasta al ragù","cacciucco","formaggi toscani"],["crudi di mare","dessert"],"morellino-scansano-argentiera","rosso_toscana"),
    W("BOL001","Bolgheri Sassicaia DOC 2019","Toscana","Italia","Rosso","lusso",198.00,"Cabernet Sauvignon + Cabernet Franc",13.5,"media","strutturati","pieno",0.8,["ribes nero","cedro","peperone","spezie internazionali","tabacco Virginia"],["filetto di manzo","agnello al forno","formaggi stagionati duri"],["pesce delicato","dolci","piatti piccanti"],"bolgheri-sassicaia-2019","rosso_toscana"),
    W("SUP001","Supertuscan IGT Ornellaia 2018","Toscana","Italia","Rosso","lusso",210.00,"Merlot + Cab.Sauvignon + Cab.Franc + Petit Verdot",14.0,"media","vellutati","pieno",1.0,["ribes nero","mirtillo","cedro","spezie dolci","tabacco premium","cioccolato fondente"],["filetto Wagyu","agnello rack","selvaggina nobile","formaggi stagionati premium"],["pesce","piatti leggeri"],"ornellaia-2018","rosso_toscana"),
    W("VIN002","Vin Santo del Chianti DOC Isole e Olena","Toscana","Italia","Dolce","premium",36.00,"Trebbiano + Malvasia",16.0,"alta","assenti","pieno",100.0,["nocciola","miele","fico secco","mandorla tostata","vaniglia","spezie"],["cantucci","crostate","formaggi stagionati duri","dolci secchi","torta della nonna"],["carne","pesce","piatti salati"],"vin-santo-isole-olena","dolce"),
    W("ROS001","Rosso di Montalcino DOC Col d'Orcia","Toscana","Italia","Rosso","standard",18.00,"Sangiovese",13.5,"alta","medi","medio",1.0,["ciliegia","spezie","terra toscana","viola"],["pasta al ragù","arista toscana","bistecca","formaggi pecorino"],["pesce","crostacei"],"rosso-montalcino-orcia","rosso_toscana"),
    W("VER003","Vernaccia di San Gimignano DOCG Teruzzi","Toscana","Italia","Bianco","standard",14.00,"Vernaccia",13.0,"alta","assenti","leggero-medio",1.5,["mandorla amara","minerale","fiori bianchi","agrumi","leggero speziato"],["pesce alla griglia","frittura mista","zuppe di pesce","risotto delicato","formaggi freschi"],["carne rossa","brasati","formaggi stagionati"],"vernaccia-san-gimignano-teruzzi","bianco_nord"),
    # ══════════════════════════════════
    # ITALIA — VENETO
    # ══════════════════════════════════
    W("AMA001","Amarone DOCG Allegrini 2017","Veneto","Italia","Rosso","lusso",58.00,"Corvina + Corvinone + Rondinella",15.5,"media","vellutati","pieno",5.0,["prugna secca","cacao","tabacco","marmellata di more","cannella"],["selvaggina","stufati","formaggi affinati lungamente","brasato all'Amarone"],["pesce","piatti leggeri","frittura"],"amarone-allegrini-2017","rosso_veneto"),
    W("AMA002","Amarone DOCG Dal Forno Romano 2015","Veneto","Italia","Rosso","lusso",220.00,"Corvina + Corvinone + Rondinella + Oseleta",15.5,"media","vellutati","pieno",4.0,["cioccolato fondente","prugna nera","spezie esotiche","cuoio premium","tabacco"],["brasato all'Amarone","selvaggina nobile","formaggi stagionati 48 mesi","cinghiale"],["pesce","piatti leggeri"],"amarone-dal-forno","rosso_veneto"),
    W("VPN001","Valpolicella Ripasso DOC Zenato","Veneto","Italia","Rosso","standard",18.00,"Corvina + Molinara",13.5,"media","vellutati","medio-pieno",3.5,["ciliegia sottospirito","cacao","rotondo","spezie dolci"],["pasta al ragù","salsiccia","pizza gourmet","risotto al radicchio"],["ostriche","tartare di pesce"],"valpolicella-ripasso-zenato","rosso_veneto"),
    W("VAL001","Valpolicella Classico DOC Masi","Veneto","Italia","Rosso","economico",10.00,"Corvina",12.5,"media","leggeri","leggero-medio",2.0,["ciliegia fresca","mandorla","erbe aromatiche"],["pizza","pasta al pomodoro","salumi","antipasti"],["selvaggina","formaggi molto stagionati"],"valpolicella-classico-masi","rosso_veneto"),
    W("SOA001","Soave Classico DOC Pieropan Calvarino","Veneto","Italia","Bianco","standard",12.50,"Garganega + Trebbiano",12.5,"media","assenti","leggero-medio",2.5,["mandorla","fiori bianchi","pesca","minerale","mela"],["risotto agli asparagi","pesce al vapore","formaggi freschi","prosciutto crudo","insalate"],["brasati","selvaggina","carne rossa"],"soave-pieropan-calvarino","bianco_nord"),
    W("SOA002","Soave Superiore DOCG Inama Vigneti di Foscarino","Veneto","Italia","Bianco","premium",22.00,"Garganega",13.0,"alta","assenti","medio-pieno",2.0,["mandorla tostata","pesca bianca","minerale vulcanico","fiori di campo"],["capesante","scampi","risotto al pesce","formaggi Asiago fresco"],["carne rossa","brasati"],"soave-inama-foscarino","bianco_nord"),
    W("PRO001","Prosecco Superiore DOCG Valdobbiadene Ruggeri","Veneto","Italia","Spumante","standard",14.00,"Glera",11.5,"media","assenti","leggero",12.0,["mela golden","pera Williams","pesco","fiori di acacia","note lattee"],["aperitivo","pizza bianca","prosciutto crudo","frittura leggera","frutti di mare"],["selvaggina","formaggi stagionati pesanti","cioccolato fondente"],"prosecco-ruggeri","spumante"),
    W("REC001","Recioto di Soave DOCG Anselmi","Veneto","Italia","Dolce","premium",28.00,"Garganega",12.0,"alta","assenti","pieno",120.0,["mela cotogna","mandorla","miele","fiori bianchi appassiti","albicocca"],["crostate di frutta","formaggi erborinati dolci","panettone","biscotti","pasta di mandorle"],["piatti salati","carne rossa"],"recioto-soave-anselmi","dolce"),
    # ══════════════════════════════════
    # ITALIA — LOMBARDIA
    # ══════════════════════════════════
    W("FRA001","Franciacorta Satèn DOCG Ca' del Bosco","Lombardia","Italia","Spumante","premium",34.00,"Chardonnay",12.5,"alta","assenti","medio",6.0,["crosta di pane","burro noisette","mela cotogna","lievito","tostato delicato"],["frittura mista","risotto allo zafferano","ostriche","salmone affumicato","capesante","formaggi freschi"],["selvaggina","salumi molto grassi","cioccolato amaro"],"franciacorta-saten-ca-del-bosco","spumante"),
    W("FRA002","Franciacorta Brut DOCG Bellavista Alma","Lombardia","Italia","Spumante","premium",28.00,"Chardonnay + Pinot Nero",12.5,"alta","assenti","leggero-medio",5.0,["agrumi","fiori bianchi","lievito fresco","perlage finissimo"],["aperitivo","tartine","pesce crudo","antipasti delicati","sushi"],["selvaggina","carne rossa","dolci molto dolci"],"franciacorta-bellavista-alma","spumante"),
    W("FRA003","Franciacorta Dosage Zéro DOCG Bellavista Vittorio Moretti","Lombardia","Italia","Spumante","lusso",65.00,"Chardonnay + Pinot Nero + Pinot Bianco",12.5,"alta","assenti","pieno",0.0,["gesso","agrumi secchi","lievito nobile","crosta di pane minerale"],["ostriche Belon","caviale","capesante crude","sashimi premium"],["dolci","piatti dolci","frutta"],"franciacorta-bellavista-moretti","spumante"),
    W("SFO001","Sforzato di Valtellina DOCG Nino Negri 5 Stelle","Lombardia","Italia","Rosso","lusso",52.00,"Nebbiolo (Chiavennasca)",14.5,"alta","potenti","pieno",1.5,["prugna secca","rosa appassita","tabacco","cuoio","spezie nobili"],["brasato","stinco","formaggi Bitto e Casera stagionati","selvaggina di montagna"],["pesce","piatti leggeri"],"sforzato-valtellina-negri","rosso_piemonte"),
    W("LUG001","Lugana DOC Zenato Sergio Zenato","Lombardia","Italia","Bianco","standard",14.90,"Trebbiano di Lugana",13.0,"alta","assenti","medio",2.1,["pesca bianca","mandorla","minerale","fiori di campo","glicerina"],["risotto al pesce","spaghetti alle vongole","frittura di lago","pesce di lago","formaggi freschi"],["carne rossa","selvaggina","formaggi molto piccanti"],"lugana-zenato","bianco_nord"),
    W("LUG002","Lugana Superiore DOC Ca' dei Frati I Frati","Lombardia","Italia","Bianco","premium",24.00,"Trebbiano di Lugana",13.5,"alta","assenti","medio-pieno",1.8,["pesca matura","mandorla tostata","minerale gessoso","fiori alpini"],["lavarello","trota in carpione","risotto ai funghi","branzino al forno"],["carne rossa","formaggi stagionati"],"lugana-ca-dei-frati","bianco_nord"),
    W("CHI002","Chiaretto del Garda DOC Cà dei Frati","Lombardia","Italia","Rosato","standard",13.00,"Groppello + Barbera",12.0,"alta","leggeri","leggero-medio",2.0,["fragola","lampone","petali di rosa","arancia sanguinella"],["pizza","pasta al pomodoro","frittura","aperitivi","formaggi freschi","insalate"],["carne rossa pesante","selvaggina"],"chiaretto-garda-ca-dei-frati","rosato"),
    W("VAL002","Valtellina Superiore Sassella DOCG Ar.Pe.Pe","Lombardia","Italia","Rosso","premium",36.00,"Nebbiolo (Chiavennasca)",13.0,"alta","fini","medio-pieno",0.8,["rosa alpina","lampone","spezie montane","cuoio fine","rabarbaro"],["cervo","capriolo","pizzoccheri","formaggi Casera","selvaggina"],["pesce","piatti leggeri"],"valtellina-superiore-arpepe","rosso_piemonte"),
    # ══════════════════════════════════
    # ITALIA — TRENTINO-ALTO ADIGE
    # ══════════════════════════════════
    W("TRE001","Trento DOC Ferrari Giulio Ferrari Riserva del Fondatore","Trentino-Alto Adige","Italia","Spumante","lusso",55.00,"Chardonnay",12.5,"alta","assenti","pieno",5.0,["nocciola tostata","burro","agrumi canditi","mineralità alpina","lievito complesso"],["crostacei","risotto al tartufo bianco","ostriche","salmone selvaggio","formaggi di alpeggio"],["brasati","formaggi molto piccanti"],"trento-ferrari-giulio","spumante"),
    W("GEW001","Gewürztraminer Alto Adige DOC Tramin Nussbaumer","Trentino-Alto Adige","Italia","Bianco","premium",22.00,"Gewürztraminer",13.5,"bassa","assenti","pieno",8.0,["rosa","litchi","speziato intenso","petali di fiori","mango"],["cucina thai","curry di pollo","foie gras","formaggi erborinati","salmone affumicato","formaggi al pepe"],["carne rossa secca","pesce molto delicato"],"gewurztraminer-tramin-nussbaumer","bianco_nord"),
    W("LAG001","Lagrein Alto Adige DOC Cantina Bolzano Taber","Trentino-Alto Adige","Italia","Rosso","premium",26.00,"Lagrein",13.5,"media","morbidi","pieno",1.5,["more","mirtillo","cacao","spezie dolci","viola"],["canederli","strangolapreti","arrosto di maiale","formaggi Graukäse","selvaggina alpina"],["pesce delicato","ostriche"],"lagrein-bolzano-taber","rosso_veneto"),
    W("PIN002","Pinot Nero Alto Adige DOC Elena Walch","Trentino-Alto Adige","Italia","Rosso","premium",29.00,"Pinot Nero",13.0,"alta","fini","medio",0.8,["lampone","fragola alpina","viola","spezie alpine","humus"],["salmone al forno","petto d'anatra","funghi porcini","cervo","tagliatelle al ragù"],["carne rossa pesante","formaggi piccanti"],"pinot-nero-elena-walch","rosso_veneto"),
    W("PIN005","Pinot Bianco Alto Adige DOC Cantina Terlan Vorberg","Trentino-Alto Adige","Italia","Bianco","premium",38.00,"Pinot Bianco",13.0,"alta","assenti","pieno",1.5,["mela cotogna","mandorla","minerale alpino","fiori bianchi","crema"],["astice","capesante","risotto al tartufo bianco","formaggi di malga","pollo in crosta di erbe"],["carne rossa","formaggi stagionati pesanti"],"pinot-bianco-terlan-vorberg","bianco_nord"),
    W("MUL001","Müller Thurgau Alto Adige DOC Tiefenbrunner Feldmarschall","Trentino-Alto Adige","Italia","Bianco","premium",36.00,"Müller Thurgau",12.5,"alta","assenti","leggero-medio",2.0,["fiori alpini","salvia","pepe bianco","lime","mineralità di quota"],["antipasti di pesce","sushi","carpaccio di pesce","formaggi freschi","verdure grigliate"],["carne rossa","formaggi stagionati pesanti"],"muller-thurgau-feldmarschall","bianco_nord"),
    # ══════════════════════════════════
    # ITALIA — FRIULI-VENEZIA GIULIA
    # ══════════════════════════════════
    W("PIN001","Pinot Grigio Ramato DOC Livon","Friuli-Venezia Giulia","Italia","Bianco","standard",15.00,"Pinot Grigio",13.0,"media","leggeri","medio",2.0,["pesca gialla","speziato delicato","rame","miele","noce"],["salmone","prosciutto cotto","pasta al salmone","risotto al radicchio","formaggi medio stagionati"],["carne rossa","selvaggina"],"pinot-grigio-ramato-livon","bianco_nord"),
    W("SCH001","Schiopettino di Prepotto DOC Ronchi di Cialla","Friuli-Venezia Giulia","Italia","Rosso","premium",34.00,"Schiopettino",13.0,"alta","fini","medio",0.8,["pepe nero","mirtillo","violetta","spezie alpine","muschio"],["cervo in salmi","porcini","capriolo","frico al formaggio","carne affumicata"],["pesce","crostacei","piatti dolci"],"schiopettino-ronchi-cialla","rosso_umbria"),
    W("RIB002","Ribolla Gialla Collio DOC Schiopetto","Friuli-Venezia Giulia","Italia","Bianco","standard",19.00,"Ribolla Gialla",13.0,"alta","assenti","medio",1.5,["agrumi","mela acida","fiori bianchi","minerale","erbe fresche"],["carpaccio di salmone","prosciutto San Daniele","formaggi Montasio fresco","insalate","ceviche leggero"],["carne rossa","formaggi molto stagionati"],"ribolla-gialla-schiopetto","bianco_nord"),
    W("TOC001","Tocai Friulano Collio DOC Zuani Vigne","Friuli-Venezia Giulia","Italia","Bianco","premium",26.00,"Friulano",13.0,"alta","assenti","medio-pieno",1.5,["mandorla","fiori di campo","pesca bianca","minerale","erbe fresche"],["prosciutto San Daniele","frico","formaggi Montasio","capesante","pesce bianco al forno"],["carne rossa","formaggi molto stagionati","piatti piccanti"],"tocai-zuani-vigne","bianco_nord"),
    # ══════════════════════════════════
    # ITALIA — CAMPANIA
    # ══════════════════════════════════
    W("AGL001","Taurasi DOCG Mastroberardino Radici","Campania","Italia","Rosso","premium",36.00,"Aglianico",14.0,"alta","potenti","pieno",0.9,["marasca","caffè","polvere da sparo","spezie scure","cioccolato fondente"],["agnello al forno","cacciagione","pasta al ragù di cinghiale","formaggi piccanti"],["pesce crudo","frutti di mare","dolci"],"taurasi-mastroberardino-radici","rosso_campania"),
    W("AGL002","Taurasi DOCG Antonio Caggiano Vigna Macchia dei Goti","Campania","Italia","Rosso","lusso",55.00,"Aglianico",14.0,"alta","potenti","pieno",0.8,["ciliegia nera","spezie vulcaniche","cuoio nobile","tabacco","cioccolato"],["capretto al forno","agnello","pasta al ragù nobile","formaggi stagionati campani"],["pesce","crostacei"],"taurasi-caggiano-macchia-goti","rosso_campania"),
    W("FIA001","Fiano di Avellino DOCG Feudi di San Gregorio","Campania","Italia","Bianco","premium",20.00,"Fiano",13.0,"alta","assenti","medio-pieno",1.5,["nocciola tostata","miele di acacia","minerale profondo","frutto della passione","spezie delicate"],["astice","dentice al forno","risotto ai porcini","pollo al forno con erbe","formaggi semistagionati"],["carne rossa","salumi grassi"],"fiano-avellino-feudi","bianco_sud"),
    W("GRE001","Greco di Tufo DOCG Mastroberardino","Campania","Italia","Bianco","premium",19.00,"Greco",13.0,"alta","assenti","medio-pieno",1.8,["pesca bianca","agrumi","minerale sulfureo","fiori di pesco","nocciola"],["frittura di pesce","pasta ai frutti di mare","risotto allo zafferano","cozze gratinate","formaggi provola"],["carne rossa","salumi grassi"],"greco-tufo-mastroberardino","bianco_sud"),
    W("FIA002","Fiano di Avellino DOCG Ciro Picariello","Campania","Italia","Bianco","premium",24.00,"Fiano",13.5,"alta","assenti","pieno",1.5,["nocciola","zafferano","minerale profondo","pesca matura","spezie di montagna"],["spaghetti alle vongole","frittura di paranza","formaggi Provolone del Monaco","astice"],["carne rossa","salumi"],"fiano-picariello","bianco_sud"),
    W("AGR001","Aglianico del Vulture DOC Grifalco","Basilicata","Italia","Rosso","premium",24.00,"Aglianico",13.5,"alta","potenti","pieno",1.0,["more selvatiche","humus","spezie vulcaniche","vaniglia"],["agnello","salsiccia lucana","pasta al ragù"],["pesce","crostacei"],"aglianico-vulture-grifalco","rosso_campania"),
    W("AGR002","Aglianico del Vulture Superiore DOCG Elena Fucci Titolo","Basilicata","Italia","Rosso","premium",38.00,"Aglianico",14.0,"alta","strutturati","pieno",1.0,["ciliegia nera","violetta","pepe nero","cuoio","mineralità vulcanica"],["agnello al forno","capretto","pasta al ragù con salsiccia","formaggi stagionati lucani"],["pesce","frutti di mare"],"aglianico-vulture-elena-fucci","rosso_campania"),
    # ══════════════════════════════════
    # ITALIA — SICILIA
    # ══════════════════════════════════
    W("ETR001","Etna Rosso DOC Cornelissen Susucaru","Sicilia","Italia","Rosso","premium",26.00,"Nerello Mascalese",13.0,"altissima","fini","medio",0.8,["lampone","fragola alpina","cenere vulcanica","spezie fini","geranio"],["pesce al forno","tonno alla siciliana","pasta alla norma","formaggi freschi"],["brasati grassi","formaggi molto stagionati"],"etna-rosso-cornelissen","rosso_sicilia"),
    W("ETR002","Etna Rosso DOC Benanti Serra della Contessa","Sicilia","Italia","Rosso","premium",38.00,"Nerello Mascalese",13.5,"altissima","fini","medio",0.8,["lampone","ciliegia acida","minerale vulcanico","cenere","erbe aromatiche"],["tonno rosso","salmone","pesce spada","pasta ai frutti di mare","formaggi pecorino giovane"],["brasati","carne rossa pesante"],"etna-rosso-benanti-serra","rosso_sicilia"),
    W("NEA001","Nero d'Avola DOC Cusumano Benuara","Sicilia","Italia","Rosso","economico",10.00,"Nero d'Avola",14.0,"media","morbidi","pieno",3.0,["frutti rossi maturi","cacao","spezie calde","confettura"],["pasta alla norma","arancine","carne alla griglia","pizza","caponata"],["pesce crudo","carpacci"],"nero-avola-cusumano","rosso_sicilia"),
    W("ETB001","Etna Bianco DOC Benanti Pietra Marina","Sicilia","Italia","Bianco","premium",23.00,"Carricante",13.0,"altissima","assenti","pieno",1.2,["agrumi canditi","vulcanico","iodio","pompelmo","pietra focaia"],["crostacei","pesce alla griglia","pasta ai ricci","spaghetti alle vongole","formaggi pecorino giovane"],["carni rosse","dessert"],"etna-bianco-benanti","bianco_sud"),
    W("CAT001","Cataratto Siciliano DOC Tasca d'Almerita","Sicilia","Italia","Bianco","economico",9.00,"Cataratto",13.0,"media","assenti","medio",2.5,["fiori bianchi","pesca","mandorla","agrumi siciliani"],["pasta con le sarde","frittura di pesce","pesce spada","cous cous siciliano"],["carne rossa","formaggi piccanti"],"cataratto-tasca-almerita","bianco_sud"),
    W("PAS001","Passito di Pantelleria DOC Donnafugata Ben Ryé","Sicilia","Italia","Dolce","premium",38.00,"Zibibbo",14.5,"alta","assenti","pieno",150.0,["albicocca secca","dattero","fichi","miele di zagara","agrumi canditi","iodio"],["formaggi erborinati","foie gras","crostate di frutta secca","dessert alla frutta","biscotti secchi"],["pesce crudo","carne rossa","piatti salati"],"passito-pantelleria-donnafugata","dolce"),
    W("MAL002","Malvasia delle Lipari DOC Hauner","Sicilia","Italia","Dolce","premium",28.00,"Malvasia di Lipari",13.5,"media","assenti","pieno",90.0,["albicocca confitta","arancio","miele","spezie dolci","vaniglia"],["formaggi erborinati","crostate","biscotti di mandorle","frutta secca","cantucci"],["pesce crudo","carne rossa"],"malvasia-lipari-hauner","dolce"),
    W("NEH001","Nero d'Avola Rosato IGT Abele","Sicilia","Italia","Rosato","economico",9.50,"Nero d'Avola",13.0,"media","assenti","leggero-medio",2.5,["fragola","pesca","fiori di arancio","corallo"],["arancine","pasta al pomodoro fresco","caponata","pesce alla griglia","antipasti siciliani"],["selvaggina","formaggi molto stagionati"],"nero-avola-rosato-abele","rosato"),
    # ══════════════════════════════════
    # ITALIA — SUD, SARDEGNA, UMBRIA
    # ══════════════════════════════════
    W("CAN001","Cannonau di Sardegna DOC Sella&Mosca","Sardegna","Italia","Rosso","economico",11.00,"Cannonau",14.0,"media","morbidi","medio-pieno",2.0,["spezie","prugna","macchia mediterranea","tostato"],["agnello","maiale","formaggi sardi","pasta con salsiccia"],["ostriche","pesce molto delicato"],"cannonau-sella-mosca","rosso_sardegna"),
    W("CAN002","Cannonau di Sardegna DOC Riserva Argiolas Costera","Sardegna","Italia","Rosso","standard",16.00,"Cannonau",14.5,"media","morbidi","pieno",2.0,["macchia mediterranea","more","vaniglia","cuoio","tostato nobile"],["agnello al forno","capretto","formaggi Pecorino Sardo stagionato","pasta alla salsiccia"],["pesce crudo","ostriche"],"cannonau-argiolas-costera","rosso_sardegna"),
    W("VER001","Vermentino di Gallura DOCG Piero Mancini","Sardegna","Italia","Bianco","standard",16.50,"Vermentino",13.5,"media","assenti","medio",3.0,["macchia mediterranea","mandorla","fiori di ginestra","albicocca","agrumi"],["aragosta","gamberi","pesce alla sarda","pasta con bottarga","frittura"],["carne rossa","selvaggina"],"vermentino-gallura-mancini","bianco_sud"),
    W("VER004","Vermentino di Sardegna DOC Argiolas Costamolino","Sardegna","Italia","Bianco","economico",10.00,"Vermentino",13.0,"media","assenti","leggero-medio",3.0,["fiori di campo","mandorla","agrumi","pesca delicata"],["antipasti di mare","frittura","pesce alla griglia","insalate"],["carne rossa","selvaggina"],"vermentino-argiolas-costamolino","bianco_sud"),
    W("SAG001","Sagrantino DOCG Montefalco Caprai 25 Anni","Umbria","Italia","Rosso","premium",45.00,"Sagrantino",14.5,"media","titanici","pieno",1.0,["more","tabacco","spezie scure","cioccolato","mirtillo selvatico"],["cinghiale","selvaggina pesante","pasta al tartufo nero","formaggi molto stagionati"],["pesce","piatti leggeri","crostacei"],"sagrantino-caprai-25anni","rosso_umbria"),
    W("ORV001","Orvieto Classico Superiore DOC Palazzone Campo del Guardiano","Umbria","Italia","Bianco","premium",28.00,"Grechetto + Trebbiano + Verdello",13.0,"alta","assenti","medio-pieno",1.5,["miele","camomilla","minerale gessoso","pesca bianca","mandorla"],["pasta al tartufo bianco","carne bianca","formaggi semi-stagionati","torta al testo"],["carne rossa","selvaggina"],"orvieto-palazzone-guardiano","bianco_nord"),
    W("MON001","Montepulciano d'Abruzzo DOC Masciarelli Marina Cvetic","Abruzzo","Italia","Rosso","standard",16.00,"Montepulciano",13.5,"media","morbidi","pieno",2.5,["more","ciliegia nera","cioccolato","spezie dolci"],["arrosticini","pizza","pasta al ragù","lamb chops","porchetta"],["pesce","antipasti di mare"],"montepulciano-masciarelli","rosso_campania"),
    W("TRE002","Trebbiano d'Abruzzo DOC Valentini","Abruzzo","Italia","Bianco","premium",38.00,"Trebbiano d'Abruzzo",13.5,"alta","assenti","pieno",1.0,["camomilla","mandorla","miele","minerale profondo","idrocarburi nobili"],["brodetto","dentice","pasta con le sarde","formaggi semi-stagionati","pollo arrosto"],["carne rossa","selvaggina"],"trebbiano-abruzzo-valentini","bianco_sud"),
    W("CER001","Cerasuolo d'Abruzzo DOC Valentini","Abruzzo","Italia","Rosato","premium",32.00,"Montepulciano",13.5,"media","leggeri","medio",1.5,["ciliegia fresca","melograno","spezie leggere","rosa","fragola"],["pasta alla chitarra con ragù","arrosticini","pizza","formaggi semi-stagionati","salmone"],["selvaggina pesante","dolci"],"cerasuolo-abruzzo-valentini","rosato"),
    W("CIR001","Cirò Rosso Classico DOC Librandi Duca Sanfelice","Calabria","Italia","Rosso","standard",14.00,"Gaglioppo",13.5,"media","medi","medio-pieno",1.5,["ciliegia nera","spezie meridionali","arancia sanguinella","cuoio leggero"],["nduja","pasta al ragù calabrese","formaggi Caciocavallo","pesce spada alla ghiotta"],["pesce delicato","ostriche"],"ciro-rosso-librandi","rosso_campania"),
    W("PRO002","Primitivo di Manduria DOC ES Gianfranco Fino","Puglia","Italia","Rosso","premium",32.00,"Primitivo",16.0,"media","vellutati","pieno",6.0,["confettura di more","cioccolato","spezie dolci","tabacco","fico secco"],["agnello alla pugliese","orecchiette al ragù","formaggi stagionati pugliesi","carne brasata","BBQ"],["pesce delicato","piatti leggeri"],"primitivo-manduria-es-fino","rosso_campania"),
    W("NEG001","Negroamaro Salento IGT Taurino Patriglione","Puglia","Italia","Rosso","standard",16.00,"Negroamaro",14.0,"media","morbidi","pieno",2.5,["mora","spezie di gariga","tabacco dolce","cioccolato al latte"],["orecchiette con cime di rapa","agnello","pizza al forno a legna","formaggi pecorino"],["pesce crudo","crostacei"],"negroamaro-taurino","rosso_campania"),
    W("NEG002","Nero di Troia Puglia IGT Tormaresca Bocca di Lupo","Puglia","Italia","Rosso","premium",29.00,"Nero di Troia",14.5,"alta","potenti","pieno",1.0,["prugna","mirtillo selvatico","pepe","rabarbaro","spezie orientali"],["agnello al forno","carne alla brace","formaggi Canestrato Pugliese","pasta al ragù"],["pesce","crostacei","piatti leggeri"],"nero-troia-tormaresca","rosso_campania"),
    # ══════════════════════════════════
    # EUROPA — FRANCIA
    # ══════════════════════════════════
    W("CHA001","Chablis Premier Cru Raveneau","Francia","Europa","Bianco","lusso",72.00,"Chardonnay",12.5,"altissima","assenti","pieno",1.0,["iodio","pietra focaia","gesso","limone candito","ostrica"],["ostriche","crostacei","pesce alla piastra","sushi di tonno","tartar di salmone"],["carne rossa","formaggi stagionati","brasati"],"chablis-raveneau","bianco_estero"),
    W("CHA002","Chablis AOC William Fèvre","Francia","Europa","Bianco","standard",19.00,"Chardonnay",12.0,"alta","assenti","leggero-medio",1.5,["pietra focaia","agrumi verdi","fiori bianchi","gesso","leggermente iodato"],["frutti di mare","ostriche","salmone","sashimi","risotto leggero"],["carne rossa","formaggi molto stagionati"],"chablis-william-fevre","bianco_estero"),
    W("BUR001","Meursault Premier Cru Coche-Dury","Francia","Europa","Bianco","lusso",320.00,"Chardonnay",13.5,"alta","assenti","pieno",1.0,["burro noisette","nocciola tostata","agrumi canditi","pietra focaia","miele di tiglio"],["aragosta alla crema","capesante al burro","foie gras di anatra","tartufo bianco","formaggi Époisses"],["carne rossa","formaggi molto piccanti"],"meursault-coche-dury","bianco_estero"),
    W("PNG001","Pinot Noir Beaune Jadot","Francia","Europa","Rosso","lusso",95.00,"Pinot Noir",13.0,"alta","fini","medio",1.0,["lampone","fragola selvatica","violetta","foglia di tè","terra di Borgogna","pepe bianco"],["petto d'anatra","fagiano","funghi porcini","piccione","salmone al forno","formaggi Époisses"],["carne rossa pesante","piatti piccanti","selvaggina muschiata"],"pinot-noir-jadot-beaune","rosso_estero"),
    W("CHP001","Champagne Brut Billecart-Salmon Blanc de Blancs","Francia","Europa","Spumante","lusso",72.00,"Chardonnay",12.0,"alta","assenti","leggero-medio",6.0,["brioche","limone confit","agrumi fini","fiori bianchi","gesso"],["ostriche","caviale","scampi","sashimi","formaggi freschi erborinati","capesante"],["carne rossa","formaggi molto stagionati","cioccolato fondente"],"champagne-billecart-blanc-blancs","spumante"),
    W("CHP002","Champagne Brut Krug Grande Cuvée","Francia","Europa","Spumante","lusso",195.00,"Pinot Noir + Chardonnay + Pinot Meunier",12.0,"alta","assenti","pieno",6.0,["brioche tostata","noci","mele dorate","crosta di pane","agrumi canditi","miele"],["caviale Beluga","astice al burro","tartufo bianco","formaggi Comté stagionato","salmone selvaggio affumicato"],["piatti molto dolci","carne rossa pesante"],"champagne-krug-grande-cuvee","spumante"),
    W("SAU001","Sauternes Château Rieussec 2015","Francia","Europa","Dolce","lusso",85.00,"Sémillon + Sauvignon Blanc + Muscadelle",13.5,"alta","assenti","pieno",120.0,["miele d'acacia","zafferano","albicocca confitta","ananas","vaniglina","noce moscata"],["foie gras d'anatra","formaggi erborinati Roquefort","tarte tatin","crostate","salmone affumicato con miele"],["carne rossa secca","pesce crudo","piatti piccanti"],"sauternes-rieussec-2015","dolce"),
    W("CDR001","Côtes du Rhône Rouge Château Rayas Pignan","Francia","Europa","Rosso","premium",32.00,"Grenache",14.5,"media","morbidi","pieno",2.0,["frutti rossi maturi","spezie meridionali","garrigue","lavanda","pepe"],["agnello provenzale","ratatouille","pizza gourmet","formaggi erborinati","pasta al ragù"],["pesce delicato","ostriche"],"cotes-rhone-rayas-pignan","rosso_estero"),
    W("GEW002","Riesling Alsace Grand Cru Trimbach Clos Sainte Hune","Francia","Europa","Bianco","lusso",95.00,"Riesling",13.0,"alta","assenti","pieno",3.0,["idrocarburi nobili","miele","lime","pietra bagnata","zafferano","datteri"],["choucroute garnie","foie gras","munster affinato","aragoste","salmone in crosta"],["carne rossa pesante","piatti molto dolci"],"trimbach-clos-sainte-hune","bianco_estero"),
    W("CAB001","Chinon AOC Cabernet Franc Charles Joguet","Francia","Europa","Rosso","premium",36.00,"Cabernet Franc",12.5,"alta","fini","medio",0.8,["ribes rosso","violetta","grafite","peperone verde","humus","spezie fini"],["coniglio in umido","pollo al forno","funghi trifolati","pasta al ragù delicato","formaggi semistagionati"],["pesce crudo","dessert","brasati molto pesanti"],"chinon-joguet-clos-chene","rosso_estero"),
    W("MOU001","Mouton Rothschild Pauillac AOC 2015","Francia","Europa","Rosso","lusso",380.00,"Cabernet Sauvignon + Merlot + Cab.Franc",13.5,"media","strutturati","pieno",0.5,["ribes nero","cedro","sigaro","pepe","spezie nobili","grafite"],["filetto di manzo Wagyu","agnello rack","selvaggina nobile","formaggi Comté 36 mesi"],["pesce","piatti leggeri","dolci"],"mouton-rothschild-2015","rosso_estero"),
    W("ROS002","Rosé de Provence AOC Château Miraval","Francia","Europa","Rosato","standard",21.00,"Cinsault + Grenache + Syrah",13.0,"alta","assenti","leggero-medio",1.5,["fragola","fiori di campo","agrumi","petali di rosa","note marine"],["bouillabaisse","salade niçoise","pizza","tapas","griglia leggera","caprese"],["carne rossa pesante","formaggi molto stagionati"],"rose-miraval","rosato"),
    W("CRE001","Crépy AOC Savoie Domaine Dupasquier","Francia","Europa","Bianco","economico",12.00,"Chasselas",11.5,"alta","assenti","leggero",2.0,["mela verde","fiori alpini","minerale","leggermente frizzante","citrus"],["fonduta","raclette","formaggi alpini","pesce di lago","sushi leggero","tartare"],["carne rossa","formaggi molto stagionati","piatti piccanti"],"crepy-dupasquier","bianco_estero"),
    W("GRE002","Grenache Blanc Roussillon AOC Domaine Gauby","Francia","Europa","Bianco","premium",28.00,"Grenache Blanc",14.0,"media","leggeri","pieno",2.5,["pesca bianca","fiori di mandorlo","spezie provenzali","anice","mandorla"],["bouillabaisse","pesce alla provenzale","ratatouille","poulet rôti","formaggi chèvre"],["carne rossa pesante","formaggi molto stagionati"],"grenache-blanc-gauby","bianco_estero"),
    W("MER001","Pomerol Château Pétrus 2016","Francia","Europa","Rosso","lusso",2500.00,"Merlot",13.5,"media","vellutati","pieno",1.0,["prugna matura","tartufo","cioccolato fondente","viole","spezie dolci"],["filetto Wagyu","agnello rack","tartufo nero","piccione","formaggi Comté 48 mesi"],["pesce","piatti leggeri"],"petrus-2016","rosso_estero"),
    W("SYR004","Crozes-Hermitage Syrah M.Chapoutier","Francia","Europa","Rosso","standard",22.00,"Syrah",13.0,"alta","medi","medio-pieno",1.0,["olive nere","pepe bianco","more","viola","spezie del Rodano"],["agnello rosticciana","cassoulet","formaggi semiduri","pasta al ragù"],["pesce delicato","ostriche"],"crozes-hermitage-chapoutier","rosso_estero"),
    W("VIO001","Viognier Condrieu AOC Guigal","Francia","Europa","Bianco","lusso",75.00,"Viognier",14.0,"bassa","assenti","pieno",3.0,["albicocca fresca","pesca nettarina","fiori d'arancio","mandorla","spezie floreali"],["aragosta al burro","foie gras","cucina thai","curry di pollo","capesante al vapore"],["carne rossa secca","pesce crudo delicato"],"condrieu-guigal","bianco_estero"),
    # ══════════════════════════════════
    # EUROPA — SPAGNA
    # ══════════════════════════════════
    W("RIO001","Rioja Gran Reserva Muga Prado Enea 2015","Spagna","Europa","Rosso","premium",42.00,"Tempranillo + Garnacha",14.0,"media","vellutati","pieno",1.5,["vaniglia","cocco","frutta matura","cuoio","spezie dolci","tabacco"],["cordero asado","cochinillo","pasta al ragù","formaggi Manchego stagionati","prosciutto iberico"],["pesce crudo","ostriche","piatti leggeri"],"rioja-muga-prado-enea","rosso_estero"),
    W("RIB001","Ribera del Duero Reserva Pesquera Janus 2016","Spagna","Europa","Rosso","premium",38.00,"Tempranillo",14.0,"media","strutturati","pieno",1.8,["frutti neri","tostato","spezie dolci","cioccolato","vaniglia americana"],["agnello lechal","carne alla brace","formaggi stagionati","pasta al ragù pesante"],["pesce","crostacei","piatti molto leggeri"],"ribera-pesquera-janus","rosso_estero"),
    W("ALB001","Albariño Rías Baixas DO Pazo San Mauro","Spagna","Europa","Bianco","standard",16.00,"Albariño",12.5,"alta","assenti","leggero-medio",2.0,["albicocca","salino oceanico","pesca","citrus atlantico","fiori bianchi"],["polpo alla gallega","gambas al ajillo","salmone","frutos del mar","spaghetti alle vongole","pesce alla griglia"],["carne rossa","formaggi stagionati","piatti piccanti"],"albarino-pazo-san-mauro","bianco_estero"),
    W("VER002","Verdejo Rueda DO Belondrade y Lurton","Spagna","Europa","Bianco","standard",18.00,"Verdejo",13.0,"alta","assenti","medio",1.5,["erba fresca","pompelmo","fico","note erbacee","agrumi"],["insalate","ceviche","caprese","pesce al limone","verdure grigliate","pollo leggero"],["carne rossa","formaggi molto stagionati"],"verdejo-belondrade","bianco_estero"),
    W("TEM001","Tempranillo Ribera del Duero Jóven Pago de los Capellanes","Spagna","Europa","Rosso","economico",11.00,"Tempranillo",13.5,"media","leggeri","medio",2.0,["ciliegia fresca","lampone","floreale","spezie leggere"],["pizza","pasta al pomodoro","chorizo","hamburger","pincho moruno"],["pesce crudo","ostriche"],"tempranillo-joven-capellanes","rosso_estero"),
    W("RIO002","Rioja Blanco Reserva López de Heredia Viña Gravonia","Spagna","Europa","Bianco","premium",26.00,"Viura",12.5,"alta","leggeri","medio-pieno",1.0,["nocciola ossidativa","miele","camomilla","mela cotogna","tostato antico"],["bacalà","patatas bravas","carne bianca","formaggi semi-stagionati","uova"],["pesce crudo delicato","carne rossa","frutti di mare"],"rioja-blanco-lopez-heredia","bianco_estero"),
    W("PRI001","Priorat DOC Alvaro Palacios L'Ermita 2018","Spagna","Europa","Rosso","lusso",320.00,"Garnacha + Cabernet Sauvignon",15.0,"media","vellutati","pieno",2.5,["more concentrate","minerale di ardesia","kirsch","spezie orientali","cioccolato fondente","lavanda"],["agnello rack","cinghiale","carne alla brace premium","formaggi stagionati iberici"],["pesce delicato","piatti leggeri"],"ermita-alvaro-palacios","rosso_estero"),
    W("JER001","Jerez Fino En Rama Tio Pepe Gonzalez Byass","Spagna","Europa","Bianco","standard",14.00,"Palomino",15.0,"alta","assenti","leggero",0.0,["mandorla ossidativa","salino","fieno secco","lievito di flor","agrumi secchi"],["jamón ibérico","gambas al ajillo","tapas","ostriche","pesce fritto","aceitunas"],["carne rossa pesante","dolci molto dolci"],"fino-tio-pepe","bianco_estero"),
    W("CAV001","Cava Brut Nature Gramona Imperial","Spagna","Europa","Spumante","premium",32.00,"Macabeo + Xarel·lo + Parellada",11.5,"alta","assenti","medio",0.0,["mela verde","agrumi","lievito fresco","fiori bianchi","mineralità"],["tapas","gambas","pesce alla griglia","formaggi freschi","jamón serrano"],["carne rossa pesante","dolci"],"cava-gramona-imperial","spumante"),
    W("MEN001","Mencia Ribeira Sacra DO Descendientes de J. Palacios","Spagna","Europa","Rosso","premium",34.00,"Mencía",13.0,"alta","fini","medio",0.8,["lampone","violetta","spezie galiziane","minerale di granito","fiori"],["polpo alla galiziana","carne bianca","formaggi semi-stagionati","funghi"],["carne rossa pesante","piatti molto grassi"],"mencia-palacios","rosso_estero"),
    W("GAR001","Garnacha Vieja Campo de Borja DO Borsao Berola","Spagna","Europa","Rosso","economico",9.50,"Garnacha",14.5,"bassa","morbidi","pieno",3.0,["mora matura","spezie dolci","prugna","cioccolato al latte"],["tapas","pizza","pasta al sugo","salsiccia","paella"],["pesce crudo","piatti delicati"],"garnacha-borsao-berola","rosso_estero"),
    # ══════════════════════════════════
    # EUROPA — GERMANIA
    # ══════════════════════════════════
    W("RIE001","Riesling Spätlese Mosel Joh. Jos. Prüm Wehlener Sonnenuhr","Germania","Europa","Bianco","premium",35.00,"Riesling",8.0,"altissima","assenti","leggero",50.0,["pesca bianca","albicocca","idrocarburi nobili","pietra","lime","miele leggero"],["cucina cinese","foie gras","formaggi erborinati","sushi","tempura","maiale al vapore"],["carne rossa secca","selvaggina","piatti aggressivi"],"riesling-prum-wehlener","bianco_estero"),
    W("RIE002","Riesling Trocken Mosel Egon Müller Scharzhofberger","Germania","Europa","Bianco","lusso",85.00,"Riesling",11.5,"altissima","assenti","medio",5.0,["petrol nobile","agrumi cangianti","pietra focaia","miele di bosco","fiori bianchi"],["sushi premium","capesante","ceviche","pesce crudo","tartare di tonno","formaggi freschi alpini"],["carne rossa","brasati pesanti"],"riesling-egon-muller","bianco_estero"),
    W("SPB001","Spätburgunder Pinot Noir Baden Bernhard Huber","Germania","Europa","Rosso","premium",42.00,"Spätburgunder (Pinot Noir)",13.5,"alta","fini","medio",1.0,["lampone","ciliegia","violetta","spezie delicate","sottobosco"],["salmone al forno","petto d'anatra","funghi porcini","Wiener Schnitzel","selvaggina delicata"],["carne rossa pesante","piatti molto grassi"],"spatburgunder-huber","rosso_estero"),
    W("RIE003","Riesling Kabinett Rheingau Schloss Johannisberg","Germania","Europa","Bianco","standard",22.00,"Riesling",10.0,"altissima","assenti","leggero",35.0,["lime","albicocca","mela verde","minerale","leggero floreale"],["sushi","insalate di mare","formaggi freschi","cucina asiatica","capesante"],["carne rossa","piatti molto grassi"],"riesling-schloss-johannisberg","bianco_estero"),
    W("GEW003","Gewürztraminer Pfalz Bürklin-Wolf","Germania","Europa","Bianco","standard",18.00,"Gewürztraminer",13.0,"bassa","assenti","pieno",6.0,["rosa intensa","litchi","spezie tedesche","zenzero","petali di gelsomino"],["cucina indiana","curry","salmone affumicato","formaggi a crosta fiorita","asparagi bianchi"],["carne rossa secca","piatti iodati delicati"],"gewurztraminer-burklin-wolf","bianco_estero"),
    # ══════════════════════════════════
    # EUROPA — AUSTRIA
    # ══════════════════════════════════
    W("GRU001","Grüner Veltliner Smaragd Wachau Knoll Loibenberg","Austria","Europa","Bianco","premium",32.00,"Grüner Veltliner",13.5,"alta","assenti","pieno",1.5,["pepe bianco","erbe alpine","minerale","lime","pompelmo","prezzemolo"],["asparagi","Wiener Schnitzel","salmone","formaggi alpini giovani","verdure grigliate","pollo in crosta di erbe"],["carne rossa pesante","formaggi molto stagionati","piatti dolci"],"gruner-veltliner-knoll","bianco_estero"),
    W("GRU002","Grüner Veltliner Federspiel Wachau Domäne Wachau","Austria","Europa","Bianco","standard",16.00,"Grüner Veltliner",12.5,"alta","assenti","leggero-medio",2.0,["pepe verde","mela","citrus","erbe fresche","minerale"],["insalate","pollo leggero","asparagi","pesce bianco","verdure al vapore"],["carne rossa","selvaggina"],"gruner-federspiel-wachau","bianco_estero"),
    W("BLF001","Blaufränkisch Reserve Burgenland Moric","Austria","Europa","Rosso","premium",34.00,"Blaufränkisch",13.0,"alta","fini","medio-pieno",0.8,["mirtillo","spezie nere","pimento","violetta","grafite"],["Tafelspitz","manzo brasato","funghi","gulasch","formaggi alpini stagionati"],["pesce delicato","piatti molto dolci"],"blaufrankisch-moric","rosso_estero"),
    W("ZWE001","Zweigelt Burgenland Classic Umathum","Austria","Europa","Rosso","standard",18.00,"Zweigelt",13.0,"alta","medi","medio",1.0,["ciliegia nera","spezie viennesi","violetta","cioccolato leggero"],["Wiener Schnitzel","salsiccia Viennese","formaggi alpini","pasta al ragù"],["pesce crudo","ostriche"],"zweigelt-umathum","rosso_estero"),
    W("GRU003","Grüner Veltliner Steinfeder Wachau Hirtzberger","Austria","Europa","Bianco","standard",20.00,"Grüner Veltliner",11.5,"alta","assenti","leggero",1.5,["pompelmo","erbe di campo","pietra bagnata","lime"],["aperitivo","vegetariano","pesce leggero","insalate di primavera"],["carne rossa","formaggi stagionati"],"gruner-steinfeder-hirtzberger","bianco_estero"),
    # ══════════════════════════════════
    # EUROPA — PORTOGALLO & GRECIA
    # ══════════════════════════════════
    W("POR001","Vintage Port Graham's 2016","Portogallo","Europa","Dolce","lusso",68.00,"Touriga Nacional blend",20.0,"media","potenti","pieno",90.0,["frutti neri confettati","cioccolato","spezie esotiche","tabacco","noci"],["stilton","formaggi erborinati","cioccolato fondente 70%","noci","dessert al cioccolato"],["pesce","crostacei","piatti salati delicati"],"port-grahams-2016","dolce"),
    W("VIN003","Vinho Verde DOC Quinta do Ameal Escolha","Portogallo","Europa","Bianco","economico",10.00,"Loureiro + Arinto",11.0,"alta","assenti","leggero",3.5,["lime","fiori bianchi","mela verde","leggermente frizzante","erbe fresche"],["polvo à lagareiro","baccalà","pesce fritto","gamberi","insalate","sushi"],["carne rossa","formaggi stagionati","piatti molto ricchi"],"vinho-verde-quinta-ameal","bianco_estero"),
    W("DOC001","Douro Reserva Quinta do Crasto","Portogallo","Europa","Rosso","standard",18.00,"Touriga Franca + Touriga Nacional",14.0,"alta","strutturati","pieno",1.5,["frutti neri","violetta","spezie lusitane","grafite","tabacco"],["bacalhau","agnello alla portoghese","pasta al ragù","carne alla griglia"],["pesce delicato","ostriche"],"douro-crasto","rosso_estero"),
    W("TOA001","Touriga Nacional Alentejo DOC Esporão Reserva","Portogallo","Europa","Rosso","premium",28.00,"Touriga Nacional + Aragonez",14.0,"alta","strutturati","pieno",1.5,["ribes nero","violetta","menta","spezie meridionali","cuoio"],["agnello al forno","carne alla brace","formaggi Queijo Serpa","pasta al ragù"],["pesce delicato","ostriche"],"esporao-reserva","rosso_estero"),
    W("XIN001","Xinomavro Naoussa PDO Kir-Yianni Diaporos","Grecia","Europa","Rosso","premium",28.00,"Xinomavro",13.5,"alta","potenti","pieno",0.8,["pomodoro essiccato","olive nere","spezie greche","ciliegia acida","tabacco"],["moussaka","agnello al forno con origano","stifado","pasta al forno","formaggi feta stagionata"],["pesce delicato","piatti leggeri"],"xinomavro-kir-yianni","rosso_estero"),
    W("ASS001","Assyrtiko Santorini PDO Sigalas","Grecia","Europa","Bianco","premium",25.00,"Assyrtiko",13.5,"altissima","assenti","pieno",1.0,["vulcanico","iodio","agrumi secchi","pietra pomice","sale marino","lime"],["octopus grigliato","ceviche","sushi di tonno","crostacei crudi","lavraki al forno","calamari"],["carne rossa","dolci","formaggi stagionati pesanti"],"assyrtiko-santorini-sigalas","bianco_estero"),
    W("MAV001","Mavrodaphne of Patras PDO Achaia Clauss","Grecia","Europa","Dolce","standard",16.00,"Mavrodaphne",15.0,"media","morbidi","pieno",120.0,["uvetta","cioccolato","spezie greche","fico","cannella"],["formaggi erborinati","dolci al cioccolato","biscotti al sesamo","dessert alla frutta secca"],["pesce","piatti salati"],"mavrodaphne-achaia-clauss","dolce"),
    W("MOS002","Moschofilero Mantineia PDO Tselepos","Grecia","Europa","Bianco","standard",15.00,"Moschofilero",12.0,"alta","assenti","leggero-medio",2.5,["rosa fresca","agrumi","note floreali delicate","erbe greche"],["insalata greca","frutti di mare","salmone","pesce bianco alla griglia"],["carne rossa","formaggi stagionati"],"moschofilero-tselepos","bianco_estero"),
    # ══════════════════════════════════
    # SUD AMERICA — ARGENTINA & CILE
    # ══════════════════════════════════
    W("MAL001","Malbec Reserva Achaval Ferrer Mendoza","Argentina","Sud America","Rosso","standard",19.00,"Malbec",14.5,"media","morbidi","pieno",2.5,["mora","prugna","cioccolato fondente","violetta","spezie dolci"],["asado","churrasco","hamburger","pasta al ragù","formaggi semiduri","empanadas"],["pesce crudo","ostriche","dessert delicati"],"malbec-achaval-ferrer","rosso_estero"),
    W("MAL003","Malbec Gran Reserva Catena Zapata Adrianna Vineyard","Argentina","Sud America","Rosso","lusso",95.00,"Malbec",14.0,"alta","seta","pieno",1.5,["more di alta quota","violetta","spezie andine","cacao fine","grafite"],["asado premium","filetto di manzo","agnello","pasta al ragù nobile","formaggi stagionati"],["pesce","piatti leggeri"],"malbec-catena-adrianna","rosso_estero"),
    W("CAB003","Cabernet Sauvignon Maipo Valley Concha y Toro Don Melchor","Cile","Sud America","Rosso","premium",55.00,"Cabernet Sauvignon",14.0,"media","strutturati","pieno",1.5,["ribes nero","eucalipto","menta","spezie dolci","cedro","pepe"],["carne alla brace cilena","agnello","hamburger gourmet","pasta al ragù","formaggi stagionati"],["pesce delicato","ostriche"],"don-melchor-concha-toro","rosso_estero"),
    W("CAR002","Carménère Rapel Valley Montes Purple Angel","Cile","Sud America","Rosso","premium",42.00,"Carménère + Petit Verdot",14.5,"media","vellutati","pieno",2.0,["paprika","peperone rosso","cioccolato","caffè","spezie cilene"],["empanadas","carne alla brace","pasta al ragù piccante","formaggi semi-stagionati"],["pesce","piatti molto delicati"],"carmenere-montes-purple-angel","rosso_estero"),
    W("SAU004","Sauvignon Blanc Casablanca Valley Concha y Toro Terrunyo","Cile","Sud America","Bianco","standard",18.00,"Sauvignon Blanc",13.5,"alta","assenti","medio",2.0,["pompelmo","erba tagliata","agrumi","frutto della passione","fiori bianchi"],["ceviche","sushi","pesce al limone","insalate","capra fresca","gamberi"],["carne rossa","formaggi stagionati"],"sauvignon-terrunyo","bianco_estero"),
    W("MAL002a","Malbec Uco Valley Clos de los Siete Michel Rolland","Argentina","Sud America","Rosso","premium",32.00,"Malbec + Merlot + Cabernet Sauvignon",14.5,"media","vellutati","pieno",2.0,["prugna","violetta","cioccolato","spezie morbide","cassis"],["asado","hamburger gourmet","agnello","pasta al ragù","formaggi semiduri"],["pesce","piatti delicati"],"malbec-clos-siete","rosso_estero"),
    W("TOR001","Torrontés Salta Valle Calcháquí Clos de los Siete","Argentina","Sud America","Bianco","standard",15.00,"Torrontés",13.5,"alta","assenti","leggero-medio",3.5,["gelsomino","rosa","albicocca fresca","agrumi andini","frutto della passione"],["ceviche andino","pesce bianco","insalate di frutta","cucina speziata leggera","formaggi freschi"],["carne rossa pesante","formaggi molto stagionati"],"torrontes-clos-siete","bianco_estero"),
    W("CAR003","Carménère Reserva Valle del Maipo Concha y Toro","Cile","Sud America","Rosso","economico",10.00,"Carménère",13.5,"media","morbidi","medio-pieno",2.5,["peperone rosso","more","cioccolato al latte","spezie leggere"],["pasta al ragù","pizza","salsiccia","hamburger","anticuchos"],["pesce crudo","piatti delicati"],"carmenere-reserva-concha-toro","rosso_estero"),
    # ══════════════════════════════════
    # AMERICHE — USA
    # ══════════════════════════════════
    W("ZIN001","Zinfandel Old Vines Ridge Vineyards Lodi","California","Americhe","Rosso","standard",18.00,"Zinfandel",15.0,"media","morbidi","pieno",4.0,["mora jam","pepe nero","vaniglia americana","mirtillo","cioccolato al latte"],["barbecue","pulled pork","hamburger gourmet","pizza al salame","pasta al ragù piccante"],["pesce delicato","ostriche","piatti leggeri"],"zinfandel-ridge-lodi","rosso_estero"),
    W("CHI003a","Chardonnay Napa Valley Rombauer Vineyards","California","Americhe","Bianco","premium",42.00,"Chardonnay",14.5,"media","assenti","pieno",4.0,["burro fuso","vaniglia","ananas","mango","rovere dolce","burro di nocciola"],["aragosta al burro","pollo alla crema","pasta al salmone","risotto ai funghi","formaggi brie"],["pesce crudo iodato","piatti piccanti"],"chardonnay-rombauer","bianco_estero"),
    W("CAB002","Cabernet Sauvignon Napa Valley Opus One 2019","California","Americhe","Rosso","lusso",310.00,"Cabernet Sauvignon + Merlot + Cab.Franc + Malbec + Petit Verdot",14.5,"media","strutturati","pieno",1.5,["ribes nero","cedro","tabacco","spezie dolci","vaniglia di rovere","cioccolato premium"],["filetto Wellington","agnello al rosmarino","selvaggina nobile","formaggi stagionati premium"],["pesce","piatti leggeri"],"opus-one-2019","rosso_estero"),
    W("PIN003","Pinot Noir Willamette Valley Domaine Drouhin Oregon","Oregon","Americhe","Rosso","premium",48.00,"Pinot Noir",13.5,"alta","fini","medio",1.0,["fragola","ciliegia acida","violetta","sottobosco pacifico","pepe rosa"],["salmone del Pacifico","petto d'anatra","funghi selvatici","piccione","brie stagionato"],["carne rossa pesante","piatti molto grassi"],"pinot-noir-drouhin-oregon","rosso_estero"),
    W("SAU003","Sauvignon Blanc Napa Valley Honig","California","Americhe","Bianco","standard",22.00,"Sauvignon Blanc",14.0,"alta","assenti","medio",2.5,["agrumi","erba tagliata","melone","pompelmo","fiori bianchi"],["capra fresca","insalate","sushi","ceviche","gamberi","asparagi"],["carne rossa","formaggi stagionati","brasati"],"sauvignon-honig","bianco_estero"),
    W("CAB004","Cabernet Sauvignon Napa Valley Stag's Leap Cask 23","California","Americhe","Rosso","lusso",180.00,"Cabernet Sauvignon",14.5,"media","vellutati","pieno",1.5,["ribes nero","cioccolato","cedro americano","spezie morbide","vaniglia"],["filetto di manzo","agnello","costata","formaggi stagionati americani"],["pesce","piatti leggeri"],"cab-stags-leap-cask23","rosso_estero"),
    W("ZIN002","Zinfandel Dry Creek Valley Ravenswood","California","Americhe","Rosso","standard",20.00,"Zinfandel",14.5,"media","morbidi","pieno",3.5,["mora","pepe","spezie tostate","cioccolato al latte","mora essiccata"],["ribs BBQ","salsiccia piccante","pizza americana","hamburger","pasta al ragù speziato"],["pesce","piatti leggeri"],"zinfandel-ravenswood","rosso_estero"),
    # ══════════════════════════════════
    # OCEANIA — AUSTRALIA & NZ
    # ══════════════════════════════════
    W("SYR001","Shiraz Penfolds Grange Hermitage","Australia","Oceania","Rosso","lusso",180.00,"Shiraz",14.5,"media","strutturati","pieno",2.0,["more selvatiche","pepe","spezie orientali","eucalipto","cuoio","fumo"],["agnello al forno","carne alla brace","formaggi stagionati robusti","brasato"],["pesce delicato","piatti leggeri","crostacei"],"penfolds-grange","rosso_estero"),
    W("SYR002","Shiraz Barossa Valley Torbreck RunRig","Australia","Oceania","Rosso","lusso",120.00,"Shiraz + Viognier",15.0,"media","vellutati","pieno",3.0,["more nere","violetta","pepe bianco","cioccolato fondente","spezie esotiche","eucalipto"],["agnello Barossa","BBQ gourmet","formaggi robusti stagionati","brasati"],["pesce","piatti delicati"],"runrig-torbreck","rosso_estero"),
    W("SAU002","Sauvignon Blanc Marlborough Cloudy Bay","Nuova Zelanda","Oceania","Bianco","standard",20.00,"Sauvignon Blanc",13.0,"alta","assenti","leggero-medio",2.0,["pompelmo","erba tagliata","asparago","passion fruit","note erbacee pungenti"],["capra fresca","insalate primaverili","sushi","pesce al lime","asparagi","ceviche"],["carne rossa","formaggi stagionati","brasati"],"sauvignon-cloudy-bay","bianco_estero"),
    W("PIN004","Pinot Noir Central Otago Felton Road Block 3","Nuova Zelanda","Oceania","Rosso","premium",52.00,"Pinot Noir",14.0,"alta","fini","medio",0.8,["ciliegia nera","spezie speziate","mirtillo","violetta","terra di scisto"],["agnello neozelandese","salmone del Pacifico","funghi tartufo","anatra","formaggi freschi"],["carne rossa pesante","piatti grassi"],"pinot-felton-road","rosso_estero"),
    W("CHA003","Chardonnay Margaret River Leeuwin Estate Art Series","Australia","Oceania","Bianco","premium",58.00,"Chardonnay",13.5,"alta","assenti","pieno",2.0,["melone bianco","noci tostate","burro noisette","pesca matura","mineralità calcarea"],["aragosta","capesante","salmone in crosta","risotto ai funghi","pollo alla crema"],["carne rossa","formaggi piccanti"],"chardonnay-leeuwin","bianco_estero"),
    W("SYR003","Shiraz McLaren Vale d'Arenberg The Dead Arm","Australia","Oceania","Rosso","premium",45.00,"Shiraz",14.5,"media","strutturati","pieno",2.5,["mora","cuoio","eucalipto","pepe","spezie scure","cioccolato"],["agnello alla brace","BBQ australiano","carne rossa","formaggi stagionati duri"],["pesce","piatti leggeri"],"shiraz-darenberg-dead-arm","rosso_estero"),
    W("RIE004","Riesling Clare Valley Jim Barry The Armagh","Australia","Oceania","Bianco","premium",42.00,"Riesling",13.0,"altissima","assenti","medio",3.0,["lime","agrumi secchi","petrolio nobile","minerale","mela verde"],["sushi","tempura","cucina asiatica","capesante","pesce bianco"],["carne rossa","formaggi stagionati pesanti"],"riesling-jim-barry","bianco_estero"),
    W("GRE003","Grenache Barossa Valley Yalumba Bush Vine","Australia","Oceania","Rosso","standard",22.00,"Grenache",14.5,"bassa","morbidi","pieno",3.5,["mora matura","lampone caldo","spezie australiane","pepe rosa"],["agnello alla brace","pizza BBQ","salsiccia kangaroo","formaggi semi-stagionati"],["pesce crudo","ostriche"],"grenache-yalumba-barossa","rosso_estero"),
    # ══════════════════════════════════
    # ASIA — GIAPPONE & CINA
    # ══════════════════════════════════
    W("KOS001","Koshu Chateau Mercian Kikyogahara","Giappone","Asia","Bianco","premium",32.00,"Koshu",11.5,"alta","assenti","leggero",1.5,["pesca bianca delicata","yuzu","fiori di ciliegio","mineralità giapponese","note umami"],["sushi","sashimi","tempura","ramen al brodo chiaro","tofu","edamame"],["carne rossa pesante","formaggi stagionati","piatti piccanti"],"koshu-chateau-mercian","bianco_estero"),
    W("KOS002","Koshu Lumière Sparkling","Giappone","Asia","Spumante","premium",38.00,"Koshu",11.0,"alta","assenti","leggero",4.0,["yuzu effervescente","pesca fresca","fiori di pesco","mineralità vulcanica"],["sushi premium","sashimi di ricciola","tempura di gamberi","gyoza al vapore"],["carne rossa","formaggi stagionati"],"koshu-lumiere-sparkling","spumante"),
]

# ─────────────────────────────────────────────
# SYSTEM PROMPT AI (ottimizzato per velocità)
# ─────────────────────────────────────────────
SYSTEM_PROMPT_DIVINO = """Sei il Motore Chimico di diVino — abbinamento cibo-vino basato su CHIMICA MOLECOLARE.
NON usare regole empiriche. Ragiona su composti e interazioni fisico-chimiche.

ANALISI: Identifica lipidi, proteine/umami, acidi organici, terpeni, tioli, capsaicinoidi, volatili aromatici.

PRINCIPI CHIMICI:
• LIPIDI: acidi disgregano micelle → pulizia palatale; CO₂ rimuove film lipidico
• PROTEINE: tannini + proteine cotte → vellutati; tannini + proteine crude → metallico
• CAPSAICINA: alcol >13.5% amplifica TRPV1; residuo zuccherino >5g/L attenua piccante
• ACIDI: vino acido + piatto grasso = contrasto pulente; vino piatto + piatto acido = piattezza
• UMAMI: minerali vulcanici/marini + iodio = amplificazione umami

SCORING per ogni vino (0-100): interazioni primarie 40pt, aromi 25pt, struttura 20pt, no-conflitti 15pt.
INCLUDI tutti ≥55. Se nessuno supera 55, includi top 3.

OUTPUT — JSON PURO, ZERO TESTO FUORI:
{"analisi_piatto":{"ingredienti_identificati":[],"grassi":"","proteine":"","acidi":"","volatili_aromatici":[],"piccantezza":"","umami":"","tendenza_dolce":"","complessita":"","sfida_abbinamento":""},"abbinamenti":[{"wine_id":"","score":0,"principio":"","interazione_primaria":"","meccanismo_chimico":"2 frasi max","sensazione_in_bocca":"1 frase","molecole_protagoniste":[],"perche_funziona":"1 frase"}],"consiglio_divino":"3 righe max"}"""

# ─────────────────────────────────────────────
# ESTRAZIONE JSON ROBUSTA
# ─────────────────────────────────────────────
def extract_json_robust(text: str) -> dict:
    text_clean = re.sub(r"```(?:json)?", "", text).strip()
    try:
        return json.loads(text_clean)
    except Exception:
        pass
    start_idx = text_clean.find("{")
    if start_idx != -1:
        text_clean = text_clean[start_idx:]
    try:
        return json.loads(text_clean)
    except Exception:
        pass
    brackets_stack, repaired_chars = [], []
    in_string, escape_char = False, False
    for char in text_clean:
        if escape_char:
            repaired_chars.append(char); escape_char = False; continue
        if char == '\\':
            repaired_chars.append(char); escape_char = True; continue
        if char == '"':
            in_string = not in_string; repaired_chars.append(char); continue
        if not in_string:
            if char in ['{', '[']: brackets_stack.append(char)
            elif char in ['}', ']']:
                if brackets_stack:
                    last_open = brackets_stack[-1]
                    if (char == '}' and last_open == '{') or (char == ']' and last_open == '['):
                        brackets_stack.pop()
                    else:
                        break
        repaired_chars.append(char)
    repaired = "".join(repaired_chars)
    if in_string: repaired += '"'
    while brackets_stack:
        repaired += '}' if brackets_stack.pop() == '{' else ']'
    try:
        return json.loads(repaired)
    except Exception as e:
        return {"error": "JSON_PARSE_ERROR", "raw": text[:500], "details": str(e)}

# ─────────────────────────────────────────────
# AI PAIRING
# ─────────────────────────────────────────────
@st.cache_data(ttl=3600, show_spinner=False)
def get_ai_pairing_cached(piatto: str, filtri_str: str, catalogo_json: str, lang: str) -> dict:
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        try: api_key = st.secrets.get("ANTHROPIC_API_KEY", "")
        except: pass
    if not api_key:
        return {"error": "API_KEY_MISSING"}

    lang_instruction = {"en": "Respond in English.", "es": "Responde en español."}.get(lang, "")
    user_message = f"""PIATTO: "{piatto}"
{lang_instruction}
FILTRI: {filtri_str}
CATALOGO:
{catalogo_json}
Analisi molecolare → score chimico → JSON puro."""

    try:
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=3000,
            system=SYSTEM_PROMPT_DIVINO,
            messages=[{"role": "user", "content": user_message}]
        )
        return extract_json_robust(message.content[0].text)
    except Exception as e:
        return {"error": str(e)}

def get_ai_pairing(piatto: str, filtri: dict, catalogo: list) -> dict:
    catalogo_ai = json.dumps([
        {"id": v["id"], "nome": v["nome"], "tipo": v["tipo"], "regione": v["regione"],
         "fascia": v["fascia"], "prezzo": v["prezzo"], "uva": v["uva"],
         "alcol": v["alcol"], "acidita": v["acidita"], "tannini": v["tannini"],
         "corpo": v.get("corpo","medio"), "residuo_zuccherino": v["residuo_zuccherino"],
         "profilo_aromatico": v.get("profilo_aromatico", [])[:4],
         "abbina_bene_con": v.get("abbina_bene_con", [])[:3],
         "non_abbina_con": v.get("non_abbina_con", [])[:2]}
        for v in catalogo
    ], ensure_ascii=False)

    filtri_attivi = []
    if filtri.get("regione") and filtri["regione"] != "qualsiasi":
        filtri_attivi.append(f"Regione: {filtri['regione']}")
    if filtri.get("fascia") and filtri["fascia"] != "qualsiasi":
        filtri_attivi.append(f"Fascia: {filtri['fascia']}")
    if filtri.get("tipo") and filtri["tipo"] != "qualsiasi":
        filtri_attivi.append(f"Tipo: {filtri['tipo']}")
    if filtri.get("budget_min") and filtri.get("budget_max"):
        filtri_attivi.append(f"Prezzo: {filtri['budget_min']}–{filtri['budget_max']}€")
    filtri_str = " | ".join(filtri_attivi) if filtri_attivi else "Nessun filtro"
    lang = st.session_state.get("lang", "it")
    return get_ai_pairing_cached(piatto, filtri_str, catalogo_ai, lang)

# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────
def get_wine_by_id(wine_id: str) -> Optional[dict]:
    return next((w for w in WINE_CATALOG if w["id"] == wine_id), None)

def fascia_label(fascia: str) -> str:
    return T("bands_labels").get(fascia, fascia)

def score_color(score: int) -> str:
    if score >= 90: return "#1a7a2e"
    if score >= 75: return "#b07000"
    if score >= 60: return "#c07000"
    return "#9e3a3a"

def score_emoji(score: int) -> str:
    if score >= 90: return "🏆"
    if score >= 80: return "⭐"
    if score >= 70: return "👍"
    return "✓"

def gauge_html(label: str, value_text: str) -> str:
    """Genera una mini barra gauge per una caratteristica del vino."""
    mapping = {
        "altissima": 95, "alta": 75, "media": 50, "bassa": 25, "assenti": 5,
        "potenti": 90, "strutturati": 75, "vellutati": 60, "medi": 50,
        "fini": 40, "morbidi": 35, "leggeri": 25, "bassi": 15, "titanici": 100,
        "seta": 55,
        "pieno": 85, "medio-pieno": 65, "medio": 45, "leggero-medio": 30, "leggero": 15,
        "molto alta": 95, "molto alto": 95, "alto": 80, "molto basso": 10,
        "assente": 5,
    }
    pct = mapping.get(str(value_text).lower().strip(), 50)
    color = "#1a7a2e" if pct >= 70 else "#b07000" if pct >= 40 else "#5c8a3a"
    return f"""<div class="cat-gauge-wrap">
        <span class="cat-gauge-label">{label}</span>
        <div class="cat-gauge-bar"><div class="cat-gauge-fill" style="width:{pct}%;background:{color}"></div></div>
        <span class="cat-gauge-pct">{pct}%</span>
    </div>"""

# ─────────────────────────────────────────────
# RENDER WINE CARD
# ─────────────────────────────────────────────
def render_wine_card(wine: dict, abb: dict, piatto: str, user_id: Optional[int], idx: int):
    score = abb.get("score", 0)
    molecole = abb.get("molecole_protagoniste", [])
    avv = abb.get("avvertenza", "")
    avv_html = f'<p style="color:#9e3a3a;font-size:0.82em;margin-top:8px;padding:8px;background:#fff5f5;border-radius:6px">⚠️ {avv}</p>' if avv else ""
    foto = wine.get("foto", "")
    shop_url = f"{BASE_SHOP}/{wine.get('slug', wine['id'].lower())}"

    # Indicatori vino semplificati e leggibili
    def indicator_bar(label, val_text, icon, tooltip):
        mapping = {
            "altissima":95,"alta":75,"media":50,"bassa":25,"assenti":5,"assente":5,
            "potenti":90,"strutturati":75,"vellutati":60,"medi":50,"fini":40,
            "morbidi":35,"leggeri":25,"bassi":15,"titanici":100,"seta":55,
            "pieno":85,"medio-pieno":65,"medio":45,"leggero-medio":30,"leggero":15,
        }
        pct = mapping.get(str(val_text).lower().strip(), 50)
        if pct >= 75: col, lev = "#c0392b", "Alto"
        elif pct >= 45: col, lev = "#e67e22", "Medio"
        else: col, lev = "#27ae60", "Basso"
        return f"""<div style="margin:4px 0">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px">
            <span style="font-size:0.78em;color:#555;font-weight:600">{icon} {label}</span>
            <span style="font-size:0.74em;color:{col};font-weight:700">{lev}</span>
          </div>
          <div style="background:#f0e8e9;border-radius:6px;height:7px;overflow:hidden" title="{tooltip}">
            <div style="width:{pct}%;height:100%;background:{col};border-radius:6px"></div>
          </div>
        </div>"""

    rz = wine.get("residuo_zuccherino", 0)
    dolc_txt = "alta" if rz >= 30 else "media" if rz >= 5 else "bassa"

    gauges = (
        indicator_bar("Acidità", wine.get("acidita","media"), "🍋",
                      "Quanto è fresco e vivace il vino — alta acidità = più pulizia in bocca") +
        indicator_bar("Tannini", wine.get("tannini","medi"), "🍇",
                      "Sensazione asciugante — alti con carne rossa, bassi con pesce e piatti delicati") +
        indicator_bar("Corpo", wine.get("corpo","medio"), "⚖️",
                      "Quanto è 'pesante' il vino in bocca — pieno = vini robusti, leggero = vini delicati") +
        indicator_bar("Dolcezza", dolc_txt, "🍬",
                      f"Zucchero residuo: {rz:.1f} g/L — secco sotto 4 g/L, abboccato oltre 12 g/L")
    )

    # Molecole protagoniste con tooltip esplicativo
    mol_tooltips = {
        "acido malico": "Acido fruttato croccante (mela verde) — dà freschezza al vino",
        "procianidine": "Polifenoli dei tannini — proteggono il cuore, danno struttura",
        "resveratrolo": "Antiossidante naturale dell'uva rossa — effetti benefici",
        "pirazine": "Composti erbacei (peperone, erba) — tipici di Sauvignon Blanc e Cab. Franc",
        "nebbiolo": "Uva piemontese — ricca di tannini e acidità, base di Barolo e Barbaresco",
        "alcol": "Etanolo — scalda in bocca, amplifica spezie e piccantezza",
        "antociani": "Pigmenti rossi — antiossidanti, danno colore ai vini rossi",
        "terpeni": "Composti aromatici floreali e fruttati (rosa, litchi, lavanda)",
        "acido tartarico": "Acido principale del vino — dona freschezza e conservazione",
        "linalolo": "Terpene floreale — profumo di rose e agrumi nei vini aromatici",
        "geraniol": "Terpene floreale — nota di rosa e geranio, tipico di Gewürztraminer",
        "vanillina": "Composto della vaniglia — rilasciato dal rovere durante l'affinamento",
        "capsaicina": "Molecola piccante del peperoncino — amplificata dall'alcol nel vino",
        "tioli": "Composti sulfurei — aroma di pompelmo e frutto della passione nel Sauvignon",
        "acetaldeid": "Aldeide dell'ossidazione — note di mela matura e sherry nello Champagne",
        "solfiti": "Conservanti naturali — proteggono il vino dall'ossidazione",
        "malolattical": "Fermentazione che trasforma acido malico in lattico — vino più morbido",
        "brettanomyces": "Lievito selvatico — note di cuoio, stalla, spezie in certi vini rossi",
        "diacetile": "Composto del burro — prodotto dalla fermentazione malolattica in Chardonnay",
        "rotundone": "Molecola del pepe nero — aroma speziato in Syrah e alcuni rossi",
    }
    mol_pills_html = ""
    for m in molecole:
        m_lower = m.lower()
        tip = next((v for k,v in mol_tooltips.items() if k in m_lower), f"Composto chimico che influenza l'abbinamento con {piatto}")
        mol_pills_html += f'<span class="molecule-pill" title="{tip}" style="cursor:help">{m}</span>'

    col_foto, col_info = st.columns([1, 3])
    with col_foto:
        if foto:
            st.image(foto, use_container_width=True)
        else:
            st.markdown('<div style="height:120px;display:flex;align-items:center;justify-content:center;font-size:3em;background:#faf7f5;border-radius:10px;">🍷</div>', unsafe_allow_html=True)

    with col_info:
        st.markdown(f"""
        <div class="wine-card" style="margin-top:0;box-shadow:none;border:none;padding:0;">
            <div class="wine-card-body">
                <h3>{score_emoji(score)} {wine['nome']}</h3>
                <p style="margin:4px 0 8px">
                    <span class="badge badge-score">{T('match')} {score}/100</span>
                    <span class="badge badge-price">{fascia_label(wine['fascia'])} · {wine['prezzo']:.0f}€</span>
                    <span class="badge badge-type">{wine['tipo']}</span>
                    <span class="badge badge-geo">{wine['regione']}</span>
                    <span class="badge badge-match">{abb.get('principio','').upper()}</span>
                </p>
                <div style="margin:4px 0 10px">
                    <div style="display:flex;align-items:center;gap:8px">
                        <div class="score-bar" style="flex:1">
                            <div class="score-fill" style="width:{score}%;background:linear-gradient(90deg,#3d0a10,{score_color(score)})"></div>
                        </div>
                        <span style="font-size:0.9em;font-weight:700;color:{score_color(score)}">{score}%</span>
                    </div>
                </div>
                <div style="margin:0 0 10px">{gauges}</div>
                <p style="font-size:0.83em;color:#444;margin:0 0 5px"><strong>{T('chemistry')}</strong> {abb.get('meccanismo_chimico','')}</p>
                <p style="font-size:0.83em;color:#333;margin:0 0 5px"><strong>{T('in_mouth')}</strong> {abb.get('sensazione_in_bocca','')}</p>
                <p style="font-size:0.83em;color:#5c1d24;margin:0 0 8px"><strong>{T('why_works')}</strong> {abb.get('perche_funziona','')}</p>
                <div class="molecule-row" title="Le molecole protagoniste sono i composti chimici chiave che creano l'abbinamento. Passa il mouse su ognuna per saperne di più.">{mol_pills_html if mol_pills_html else '<span style="color:#aaa;font-size:0.78em">—</span>'}</div>
                <p style="font-size:0.72em;color:#888;margin:4px 0 8px;font-style:italic">💡 Passa il mouse sulle pillole rosse per scoprire cosa sono le molecole protagoniste</p>
                {avv_html}
            </div>
        </div>
        """, unsafe_allow_html=True)

        # Bottone acquisto come elemento Streamlit nativo (non HTML stampato)
        st.link_button(T('buy', wine['prezzo']), shop_url, use_container_width=True)

        if user_id:
            if st.button(f"{T('rate')} {wine['nome'][:30]}…", key=f"rate_{idx}_{wine['id']}"):
                st.session_state[f"rating_open_{wine['id']}"] = True
            if st.session_state.get(f"rating_open_{wine['id']}", False):
                r = st.slider(f"{T('rate')} — {wine['nome']}", 1, 10, 7, key=f"sl_{idx}_{wine['id']}")
                nota = st.text_input("Note", key=f"nota_{idx}_{wine['id']}")
                if st.button(T("save"), key=f"sv_{idx}_{wine['id']}"):
                    save_feedback(user_id, wine["nome"], piatto, r, nota)
                    st.session_state[f"rating_open_{wine['id']}"] = False
                    st.success(T("feedback_thanks"))

# ─────────────────────────────────────────────
# SEZIONE MONETIZZAZIONE (in fondo alla pagina)
# ─────────────────────────────────────────────
def render_monetization_footer(user_id: Optional[int]):
    st.markdown("---")
    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown(f"""
        <div class="cta-card">
            <h4>{T('newsletter_title')}</h4>
            <p>{T('newsletter_sub')}</p>
        </div>
        """, unsafe_allow_html=True)
        nl_email = st.text_input("", placeholder=T("newsletter_placeholder"), key="nl_email", label_visibility="collapsed")
        if st.button(T("newsletter_btn"), key="nl_btn"):
            if nl_email and "@" in nl_email:
                st.success(T("newsletter_ok"))
            else:
                st.warning("Inserisci un'email valida.")

    with col2:
        st.markdown(f"""
        <div class="cta-card">
            <h4>{T('premium_title')}</h4>
            <p>{T('premium_sub')}</p>
            <a href="https://www.divino-shop.it/premium" target="_blank" class="cta-btn">{T('premium_btn')}</a>
        </div>
        """, unsafe_allow_html=True)

    with col3:
        st.markdown(f"""
        <div class="quiz-card">
            <h4>{T('quiz_title')}</h4>
            <p>{T('quiz_sub')}</p>
        </div>
        """, unsafe_allow_html=True)
        if st.button(T("quiz_btn"), key="quiz_btn"):
            st.session_state["show_quiz"] = True

    # Quiz modale semplice
    if st.session_state.get("show_quiz", False):
        with st.expander("🍾 Quiz del tuo vino ideale", expanded=True):
            q1 = st.radio("Preferisci vini:", ["Rossi corposi 🍷", "Bianchi freschi 🥂", "Bollicine 🫧", "Dolci 🍯"])
            q2 = st.radio("Cucini spesso:", ["Carne & selvaggina 🥩", "Pesce & frutti di mare 🐟", "Pasta & pizza 🍕", "Cucina etnica 🌏"])
            q3 = st.radio("Budget per bottiglia:", ["<15€", "15–35€", "35–80€", ">80€"])
            if st.button("Scopri il tuo vino! 🍷"):
                # Logica semplice di matching
                if "Rossi" in q1:
                    rec = "Barolo DOCG o Brunello di Montalcino" if ">80" in q3 else "Chianti Classico Riserva"
                elif "Bianchi" in q1:
                    rec = "Chablis Premier Cru o Gavi di Gavi DOCG" if ">" in q3 else "Vermentino di Gallura"
                elif "Bollicine" in q1:
                    rec = "Franciacorta Satèn o Champagne Krug" if ">80" in q3 else "Prosecco Superiore DOCG"
                else:
                    rec = "Passito di Pantelleria o Sauternes"
                st.success(f"🍷 Il tuo vino ideale: **{rec}**")
                st.info("Cerca questo vino nel tab Abbinamento o sfoglialo nel Catalogo!")
                if st.button("✕ Chiudi quiz"):
                    st.session_state["show_quiz"] = False

# ─────────────────────────────────────────────
# SIDEBAR
# ─────────────────────────────────────────────
def render_sidebar():
    with st.sidebar:
        lang_opts = {"🇮🇹 Italiano": "it", "🇬🇧 English": "en", "🇪🇸 Español": "es"}
        current_lang = st.session_state.get("lang", "it")
        chosen = st.selectbox(T("language"), list(lang_opts.keys()),
                              index=list(lang_opts.values()).index(current_lang))
        new_lang = lang_opts[chosen]
        if new_lang != current_lang:
            st.session_state.lang = new_lang
            st.rerun()

        st.markdown("### 🍷 diVino")
        st.markdown(f"*{T('hero_sub')[:60]}…*")
        st.markdown("---")

        if "user" not in st.session_state:
            st.session_state.user = None

        if not st.session_state.user:
            tab_login, tab_reg = st.tabs([T("login"), T("register")])
            with tab_login:
                em = st.text_input(T("email"), key="login_email")
                pw = st.text_input(T("password"), type="password", key="login_pwd")
                if st.button(T("login"), key="btn_login"):
                    u = login_user(em, pw)
                    if u: st.session_state.user = u; st.success(T("welcome", u["nome"])); st.rerun()
                    else: st.error(T("wrong_credentials"))
            with tab_reg:
                nm = st.text_input(T("name"), key="reg_nome")
                em2 = st.text_input(T("email"), key="reg_email")
                pw2 = st.text_input(T("password"), type="password", key="reg_pwd")
                if st.button(T("create_account"), key="btn_reg"):
                    if nm and em2 and pw2:
                        ok = register_user(em2, nm, pw2)
                        st.success(T("account_created")) if ok else st.warning(T("email_exists"))
                    else: st.warning(T("fill_fields"))
        else:
            u = st.session_state.user
            stats = get_stats(u["id"])
            st.markdown(f"""
            <div class="profile-card">
                <div class="profile-val">👤 {u['nome']}</div>
                <div class="profile-stat">{u['email']}</div>
            </div>
            <div class="profile-card">
                <div class="profile-stat">{T('searches')}</div><div class="profile-val">{stats['searches']}</div>
                <div class="profile-stat">{T('rated_wines')}</div><div class="profile-val">{stats['ratings']}</div>
                <div class="profile-stat">{T('avg_rating')}</div>
                <div class="profile-val">{'⭐ ' + str(stats['avg_rating']) if stats['avg_rating'] else '—'}</div>
            </div>
            """, unsafe_allow_html=True)
            st.markdown(T("last_searches"))
            for h in get_history(u["id"], 6):
                data = h[1][:10] if h[1] else ""
                st.markdown(f'<div class="history-item">🍽️ <b>{h[0]}</b><br><span style="color:#888">{data}</span></div>', unsafe_allow_html=True)
            if st.button(T("logout")): st.session_state.user = None; st.rerun()

        st.markdown("---")
        st.caption(T("sidebar_caption"))
        with st.expander(T("ai_explanation_title"), expanded=False):
            st.markdown(T("ai_explanation"))

# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
def main():
    if "lang" not in st.session_state:
        st.session_state.lang = "it"
    if "show_quiz" not in st.session_state:
        st.session_state.show_quiz = False

    init_db()
    render_sidebar()

    user = st.session_state.get("user")
    user_id = user["id"] if user else None

    # HERO
    st.markdown(f"""
    <div class="hero">
        <h1>🍷 di<span style="font-style:italic;font-weight:300">Vino</span></h1>
        <p>{T('hero_sub')}</p>
        <p class="hero-sub">{T('hero_tagline')}</p>
    </div>
    """, unsafe_allow_html=True)

    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        try: api_key = st.secrets.get("ANTHROPIC_API_KEY", "")
        except: pass
    if not api_key:
        st.warning(f"**{T('api_missing')}** · Imposta `ANTHROPIC_API_KEY` nei Secrets di Streamlit.")

    # TABS
    tab_pair, tab_cat = st.tabs([f"🍷 {T('pairing')}", f"📚 {T('catalog')}"])

    # ── TAB ABBINAMENTO ──
    with tab_pair:
        st.markdown(f"### {T('describe_dish')}")
        st.caption(T("dish_caption"))
        col_input, col_btn = st.columns([4, 1])
        with col_input:
            piatto = st.text_input("", placeholder=T("dish_placeholder"), label_visibility="collapsed")
        with col_btn:
            cerca = st.button(T("pair_btn"), key="main_search")

        with st.expander(T("filters"), expanded=False):
            col1, col2, col3, col4, col5 = st.columns(5)
            with col1:
                continente_opts = {
                    T("any"): None,
                    "🇮🇹 Italia": "Italia",
                    "🌍 Europa": "Europa",
                    "🌎 Sud America": "Sud America",
                    "🌎 Americhe (USA)": "Americhe",
                    "🌏 Oceania": "Oceania",
                    "🌏 Asia": "Asia",
                }
                cont_label = st.selectbox("🌍 Continente / Area", list(continente_opts.keys()))
                area = continente_opts[cont_label] or T("any")

            with col2:
                # Regioni Italia suddivise in modo pulito, paesi esteri separati
                if area == "Italia":
                    it_regions = [
                        "── Nord Ovest ──",
                        "Piemonte","Lombardia","Liguria","Valle d'Aosta",
                        "── Nord Est ──",
                        "Veneto","Trentino-Alto Adige","Friuli-Venezia Giulia",
                        "── Centro ──",
                        "Toscana","Umbria","Marche","Lazio","Abruzzo",
                        "── Sud ──",
                        "Campania","Puglia","Calabria","Basilicata",
                        "── Isole ──",
                        "Sicilia","Sardegna",
                    ]
                    # mostra solo le regioni che hanno vini nel catalogo
                    reg_nel_cat = set(w["regione"] for w in WINE_CATALOG if w["continente"] == "Italia")
                    it_display = [T("any")] + [r for r in it_regions if r.startswith("──") or r in reg_nel_cat]
                    regione_raw = st.selectbox("🗺️ Regione italiana", it_display)
                    regione = T("any") if regione_raw.startswith("──") else regione_raw
                elif area == "Europa":
                    eu_countries = sorted(set(w["regione"] for w in WINE_CATALOG if w["continente"] == "Europa"))
                    regione = st.selectbox("🗺️ Paese europeo", [T("any")] + eu_countries)
                elif area == "Sud America":
                    sa_countries = sorted(set(w["regione"] for w in WINE_CATALOG if w["continente"] == "Sud America"))
                    regione = st.selectbox("🗺️ Paese", [T("any")] + sa_countries)
                elif area == "Americhe":
                    am_states = sorted(set(w["regione"] for w in WINE_CATALOG if w["continente"] == "Americhe"))
                    regione = st.selectbox("🗺️ Stato / Regione", [T("any")] + am_states)
                elif area == "Oceania":
                    oc_countries = sorted(set(w["regione"] for w in WINE_CATALOG if w["continente"] == "Oceania"))
                    regione = st.selectbox("🗺️ Paese", [T("any")] + oc_countries)
                elif area == "Asia":
                    as_countries = sorted(set(w["regione"] for w in WINE_CATALOG if w["continente"] == "Asia"))
                    regione = st.selectbox("🗺️ Paese", [T("any")] + as_countries)
                else:
                    regione = st.selectbox("🗺️ Regione / Paese", [T("any")])

            with col3:
                fascia_display_it = T("bands_display")
                fascia = st.selectbox(T("price_band"), fascia_display_it)
            with col4:
                tipo_opts = T("types_cat")
                tipo = st.selectbox(T("wine_type"), tipo_opts)
            with col5:
                st.markdown(f"**{T('price_range')}**")
                bc1, bc2 = st.columns(2)
                with bc1: bmin = st.number_input(T("min"), min_value=0, max_value=500, value=0, step=5)
                with bc2: bmax = st.number_input(T("max"), min_value=0, max_value=500, value=0, step=5)

        if cerca and piatto:
            fascia_map = T("bands")
            tipo_map_it = {
                "Bianco":"Bianco","Rosso":"Rosso","Spumante":"Spumante","Rosato":"Rosato","Dolce":"Dolce",
                "White":"Bianco","Red":"Rosso","Sparkling":"Spumante","Rosé":"Rosato","Sweet":"Dolce",
                "Blanco":"Bianco","Tinto":"Rosso","Espumoso":"Spumante","Rosado":"Rosato","Dulce":"Dolce"
            }
            filtri = {
                "regione": regione if regione not in [T("any")] else "qualsiasi",
                "area": area if area not in [T("any")] else "qualsiasi",
                "fascia": fascia_map.get(fascia, "qualsiasi"),
                "tipo": tipo_map_it.get(tipo, "qualsiasi"),
                "budget_min": bmin if bmin > 0 else None,
                "budget_max": bmax if bmax > 0 else None,
            }

            cat = WINE_CATALOG.copy()
            area_to_continente = {
                "Italia": "Italia", "Europa": "Europa", "Sud America": "Sud America",
                "Americhe": "Americhe", "Oceania": "Oceania", "Asia": "Asia"
            }
            if filtri["area"] in area_to_continente:
                target_cont = area_to_continente[filtri["area"]]
                cat = [w for w in cat if w["continente"] == target_cont]
            if filtri["regione"] != "qualsiasi":
                cat = [w for w in cat if w["regione"] == filtri["regione"]]
            if filtri["fascia"] != "qualsiasi":
                cat = [w for w in cat if w["fascia"] == filtri["fascia"]]
            if filtri["tipo"] != "qualsiasi":
                cat = [w for w in cat if w["tipo"] == filtri["tipo"]]
            if filtri["budget_min"]:
                cat = [w for w in cat if w["prezzo"] >= filtri["budget_min"]]
            if filtri["budget_max"]:
                cat = [w for w in cat if w["prezzo"] <= filtri["budget_max"]]

            if not cat:
                st.warning(T("no_filters"))
            else:
                with st.spinner(T("analyzing", piatto)):
                    risultato = get_ai_pairing(piatto, filtri, cat)

                if "error" in risultato:
                    if risultato["error"] == "API_KEY_MISSING":
                        st.error(f"❌ {T('api_missing')}")
                    else:
                        st.error(f"Errore AI: {risultato['error']}")
                        if "raw" in risultato:
                            with st.expander("Debug"): st.code(risultato["raw"])
                else:
                    analisi = risultato.get("analisi_piatto", {})
                    abbinamenti = risultato.get("abbinamenti", [])
                    consiglio = risultato.get("consiglio_divino", "")

                    save_search(user_id, piatto, filtri, abbinamenti)

                    with st.expander(T("molecular_analysis"), expanded=True):
                        ingredienti = analisi.get("ingredienti_identificati", [])
                        if ingredienti:
                            st.markdown(f"{T('ingredients_found')} " + " · ".join([f"`{i}`" for i in ingredienti]))

                        # Mappa valori → percentuale per le barre
                        def val_to_pct(v):
                            v = str(v).lower().strip()
                            scale = {"molto alto":95,"altissima":95,"alto":80,"alta":75,"elevata":75,
                                     "medio-alta":65,"media":50,"bassa":25,"basso":20,"molto bassa":10,
                                     "assente":5,"assenti":5,"nullo":5}
                            for k,p in scale.items():
                                if k in v: return p
                            try: return int(float(v))
                            except: return 50

                        def bar_color(pct):
                            if pct >= 75: return "#c0392b"
                            if pct >= 50: return "#e67e22"
                            if pct >= 25: return "#27ae60"
                            return "#2980b9"

                        mol_rows = [
                            ("🧈", T("fats"),      analisi.get("grassi","—")),
                            ("🥩", T("proteins"),   analisi.get("proteine","—")),
                            ("🍋", T("acidity"),    analisi.get("acidi","—")),
                            ("🌶️", T("spice"),      analisi.get("piccantezza","—")),
                            ("🫧", T("umami"),      analisi.get("umami","—")),
                            ("🍬", T("sweetness"),  analisi.get("tendenza_dolce","—")),
                            ("⚗️", T("complexity"), analisi.get("complessita","—")),
                        ]
                        rows_html = ""
                        for emoji, label, val in mol_rows:
                            pct = val_to_pct(val)
                            col = bar_color(pct)
                            val_short = str(val)[:40] if len(str(val)) > 40 else str(val)
                            rows_html += f"""
                            <tr>
                              <td style="padding:7px 10px;font-size:1.1em;width:32px">{emoji}</td>
                              <td style="padding:7px 4px;font-weight:600;color:#3d0a10;font-size:0.88em;width:110px">{label}</td>
                              <td style="padding:7px 10px;width:180px">
                                <div style="background:#f0e8e9;border-radius:8px;height:10px;overflow:hidden">
                                  <div style="width:{pct}%;height:100%;background:{col};border-radius:8px;transition:width 0.4s"></div>
                                </div>
                              </td>
                              <td style="padding:7px 6px;font-size:0.83em;color:#555">{val_short}</td>
                            </tr>"""

                        volatili = ", ".join(analisi.get("volatili_aromatici",[])[:4]) or "—"
                        st.markdown(f"""
                        <table style="width:100%;border-collapse:collapse;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.07)">
                          <thead>
                            <tr style="background:linear-gradient(90deg,#3d0a10,#6b2030);color:white">
                              <th colspan="4" style="padding:10px 14px;text-align:left;font-size:0.9em;font-weight:700;letter-spacing:0.5px">
                                🔬 Profilo molecolare del piatto
                              </th>
                            </tr>
                          </thead>
                          <tbody>{rows_html}
                            <tr style="background:#faf7f5">
                              <td style="padding:7px 10px;font-size:1.1em">🌿</td>
                              <td style="padding:7px 4px;font-weight:600;color:#3d0a10;font-size:0.88em">{T('volatiles')}</td>
                              <td colspan="2" style="padding:7px 10px;font-size:0.83em;color:#555;font-style:italic">{volatili}</td>
                            </tr>
                          </tbody>
                        </table>
                        """, unsafe_allow_html=True)

                        sfida = analisi.get("sfida_abbinamento","")
                        if sfida: st.info(f"{T('challenge')} {sfida}")

                    if consiglio:
                        st.info(f"{T('divino_suggests')} {consiglio}")

                    n = len(abbinamenti)
                    st.markdown(f"### ✨ {n} abbinament{'o' if n==1 else 'i'} per *{piatto}*")

                    for idx, abb in enumerate(abbinamenti):
                        wine = get_wine_by_id(abb.get("wine_id",""))
                        if wine:
                            render_wine_card(wine, abb, piatto, user_id, idx)

                    if not user_id:
                        st.info(T("register_cta"))

        elif cerca and not piatto:
            st.warning(T("write_dish"))

        # Footer monetizzazione nel tab abbinamento
        render_monetization_footer(user_id)

    # ── TAB CATALOGO ──
    with tab_cat:
        st.markdown(f"### {T('catalog_title')}")

        col_f1, col_f2, col_f3, col_f4 = st.columns(4)
        with col_f1:
            ft = st.selectbox(T("wine_type"), T("types_cat"), key="ct")
        with col_f2:
            cont_opts = [T("any"), "Italia", "Europa", "Sud America", "Americhe", "Oceania", "Asia"]
            fc = st.selectbox("🌍 Area", cont_opts, key="cc")
        with col_f3:
            regioni_uniche = sorted(set(w["regione"] for w in WINE_CATALOG))
            fr = st.selectbox(T("region"), [T("any")] + regioni_uniche, key="cr")
        with col_f4:
            ff = st.selectbox(T("price_band"), [T("fascia_all"),"economico","standard","premium","lusso"], key="cf")

        cv = WINE_CATALOG.copy()
        tipo_map_inv = {
            "Bianco":"Bianco","Rosso":"Rosso","Spumante":"Spumante","Rosato":"Rosato","Dolce":"Dolce",
            "White":"Bianco","Red":"Rosso","Sparkling":"Spumante","Rosé":"Rosato","Sweet":"Dolce",
        }
        if ft and ft not in [T("types_all"), "Tutti", "All", "Todos"]:
            ft_it = tipo_map_inv.get(ft, ft)
            cv = [w for w in cv if w["tipo"] == ft_it]
        if fc and fc != T("any"):
            cv = [w for w in cv if w["continente"] == fc]
        if fr and fr != T("any"): cv = [w for w in cv if w["regione"] == fr]
        if ff and ff not in [T("fascia_all"), "Tutte", "All"]: cv = [w for w in cv if w["fascia"] == ff]

        st.caption(T("showing_n", len(cv)))

        continenti_presenti = list(dict.fromkeys(w["continente"] for w in cv))

        for cont in continenti_presenti:
            wines_cont = [w for w in cv if w["continente"] == cont]
            st.markdown(f'<div class="continent-header">🍷 {cont} · {len(wines_cont)} vini</div>', unsafe_allow_html=True)
            cols = st.columns(3)
            for i, w in enumerate(wines_cont[:30]):
                with cols[i % 3]:
                    foto = w.get("foto","")
                    shop_url = f"{BASE_SHOP}/{w.get('slug', w['id'].lower())}"
                    tags = "".join([f'<span class="molecule-pill">{t}</span>' for t in w.get("profilo_aromatico",[])[:2]])
                    if foto:
                        st.image(foto, use_container_width=True)
                    else:
                        st.markdown('<div style="height:80px;text-align:center;font-size:2.5em;">🍷</div>', unsafe_allow_html=True)
                    # Mini gauge acidità e corpo
                    acid_pct = {"altissima":95,"alta":75,"media":50,"bassa":25}.get(w.get("acidita","media"),50)
                    corpo_pct = {"pieno":85,"medio-pieno":65,"medio":45,"leggero-medio":30,"leggero":15}.get(w.get("corpo","medio"),45)
                    st.markdown(f"""
                    <div style="background:white;border-radius:0 0 10px 10px;padding:10px 12px 14px;border:1px solid #f0e5e6;border-top:none;margin-bottom:16px;">
                        <strong style="font-size:0.87em;color:#3d0a10">{w['nome']}</strong>
                        <p style="font-size:0.74em;color:#888;margin:3px 0">{w['regione']} · {w['tipo']} · {w['prezzo']:.0f}€ <span style="background:#d1e7dd;color:#0a3d1f;padding:1px 6px;border-radius:10px;font-size:0.85em">{fascia_label(w['fascia'])}</span></p>
                        <div style="display:flex;flex-wrap:wrap;gap:4px;margin:5px 0">{tags}</div>
                        <div style="font-size:0.68em;color:#888;margin:4px 0 2px">Acidità <b>{acid_pct}%</b> · Corpo <b>{corpo_pct}%</b></div>
                        <a href="{shop_url}" target="_blank" class="buy-btn" style="font-size:0.76em;padding:8px;margin-top:6px;">🛒 {T('buy', w['prezzo'])}</a>
                    </div>
                    """, unsafe_allow_html=True)
            if len(wines_cont) > 30:
                st.caption(T("showing", len(wines_cont)))


if __name__ == "__main__":
    main()
