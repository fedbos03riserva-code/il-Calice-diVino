bash

cat > /home/claude/divino_v4.py << 'PYEOF_MARKER'
"""
╔══════════════════════════════════════════════════════════════════╗
║         diVino — v4.0                                           ║
║         Motore AI Chimico + 200+ Vini + Multilingua             ║
║                                                                  ║
║  SETUP:                                                          ║
║    pip install streamlit anthropic                               ║
║    export ANTHROPIC_API_KEY="sk-ant-..."                         ║
║    streamlit run divino_v4.py                                   ║
╚══════════════════════════════════════════════════════════════════╝
"""

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
        "region": "🗺️ Regione",
        "price_band": "💰 Fascia",
        "wine_type": "🍾 Tipo",
        "price_range": "💶 Range prezzo (€)",
        "min": "Min",
        "max": "Max",
        "analyzing": "🧪 Analisi molecolare di '{}' in corso… ({} vini nel catalogo)",
        "no_filters": "⚠️ Nessun vino soddisfa questi filtri. Prova ad allargarli.",
        "molecular_analysis": "🔬 Analisi molecolare del piatto",
        "fats": "🧈 Grassi",
        "proteins": "🥩 Proteine/Umami",
        "acidity": "🍋 Acidità",
        "volatiles": "🌿 Volatili",
        "spice": "🌶️ Piccantezza",
        "umami": "🫧 Umami",
        "sweetness": "🍬 Dolcezza",
        "complexity": "⚗️ Complessità",
        "challenge": "🎯 **Sfida chimica da risolvere:**",
        "ingredients_found": "**Ingredienti identificati:**",
        "divino_suggests": "🍷 **diVino consiglia:**",
        "pairings_found": "✨ {} abbinament{} trovat{} per *{}*",
        "catalog_title": "📚 Catalogo · {} etichette",
        "catalog": "Catalogo",
        "pairing": "Abbinamento",
        "chemistry": "🔬 Interazione chimica:",
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
        "sidebar_caption": "diVino v4.0 · {} etichette · Motore AI chimico",
        "api_missing": "🔑 API Key Anthropic mancante.",
        "grape": "Uva",
        "alcohol": "Alcol",
        "body": "Corpo",
        "tannins": "Tannini",
        "match": "Match",
        "no_filter": "Nessun filtro — mostra tutti",
        "filter_geo": "Preferenza geografica:",
        "filter_band": "Fascia di prezzo:",
        "filter_type": "Tipo vino:",
        "filter_range": "Range prezzo:",
        "filter_max": "Budget max:",
        "types_all": "Tutti",
        "types_cat": ["Tutti","Bianco","Rosso","Spumante","Rosato","Dolce"],
        "fascia_all": "Tutte",
        "fascia_cat": ["Tutte","economico","standard","premium","lusso"],
        "bands": {"Economico (<12€)":"economico","Standard (12–25€)":"standard","Premium (25–50€)":"premium","Lusso (>50€)":"lusso"},
        "bands_display": ["Qualsiasi","Economico (<12€)","Standard (12–25€)","Premium (25–50€)","Lusso (>50€)"],
        "bands_labels": {"economico":"Economico (<12€)","standard":"Standard (12–25€)","premium":"Premium (25–50€)","lusso":"Lusso (>50€)"},
        "showing": "Mostrando 30 di {}. Usa i filtri.",
        "showing_n": "{} vini visualizzati",
        "write_dish": "✏️ Scrivi il piatto per ricevere gli abbinamenti!",
        "register_cta": "💡 **Registrati gratis** per salvare le tue ricerche.",
        "continent_europe": "🇪🇺 Europa",
        "continent_americas": "🌎 Americhe",
        "continent_oceania": "🌏 Oceania",
        "continent_africa": "🌍 Africa & Altro",
        "ai_explanation_title": "🤖 Come funziona l'Agente AI Chimico",
        "ai_explanation": """
L'agente AI di diVino **non usa regole empiriche** (tipo "pesce = bianco").

Invece, per ogni ricerca:
1. **Scompone il piatto** in composti molecolari: lipidi, proteine, acidi organici, terpeni, tioli, capsaicinoidi, prodotti di Maillard, ecc.
2. **Valuta ogni vino** del catalogo contro quei composti, calcolando score da 0-100 su 4 assi chimici: compatibilità delle interazioni, concordanza aromatica, equilibrio strutturale, assenza di conflitti.
3. **Restituisce tutti i vini con score ≥55**, non solo 3 — perché un piatto complesso può avere molti abbinamenti validi.

📌 *Chiesto a Claude:* "Come faccio affinché ci siano tutti gli abbinamenti possibili?" → Il sistema prompt istruisce il modello a includere ogni vino compatibile chimicamente, non a scegliere solo i "classici".
""",
        "language": "🌐 Lingua / Language",
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
        "region": "🗺️ Region",
        "price_band": "💰 Price Band",
        "wine_type": "🍾 Type",
        "price_range": "💶 Price Range (€)",
        "min": "Min",
        "max": "Max",
        "analyzing": "🧪 Molecular analysis of '{}' in progress… ({} wines in catalog)",
        "no_filters": "⚠️ No wines match these filters. Try widening them.",
        "molecular_analysis": "🔬 Molecular analysis of the dish",
        "fats": "🧈 Fats",
        "proteins": "🥩 Proteins/Umami",
        "acidity": "🍋 Acidity",
        "volatiles": "🌿 Volatiles",
        "spice": "🌶️ Spiciness",
        "umami": "🫧 Umami",
        "sweetness": "🍬 Sweetness",
        "complexity": "⚗️ Complexity",
        "challenge": "🎯 **Chemical pairing challenge:**",
        "ingredients_found": "**Identified ingredients:**",
        "divino_suggests": "🍷 **diVino recommends:**",
        "pairings_found": "✨ {} pairing{} found for *{}*",
        "catalog_title": "📚 Catalog · {} labels",
        "catalog": "Catalog",
        "pairing": "Pairing",
        "chemistry": "🔬 Chemical interaction:",
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
        "sidebar_caption": "diVino v4.0 · {} labels · AI Chemical Engine",
        "api_missing": "🔑 Anthropic API Key missing.",
        "grape": "Grape",
        "alcohol": "Alcohol",
        "body": "Body",
        "tannins": "Tannins",
        "match": "Match",
        "no_filter": "No filter — show all",
        "filter_geo": "Geographic preference:",
        "filter_band": "Price band:",
        "filter_type": "Wine type:",
        "filter_range": "Price range:",
        "filter_max": "Max budget:",
        "types_all": "All",
        "types_cat": ["All","White","Red","Sparkling","Rosé","Sweet"],
        "fascia_all": "All",
        "fascia_cat": ["All","economico","standard","premium","lusso"],
        "bands": {"Budget (<12€)":"economico","Standard (12–25€)":"standard","Premium (25–50€)":"premium","Luxury (>50€)":"lusso"},
        "bands_display": ["Any","Budget (<12€)","Standard (12–25€)","Premium (25–50€)","Luxury (>50€)"],
        "bands_labels": {"economico":"Budget (<12€)","standard":"Standard (12–25€)","premium":"Premium (25–50€)","lusso":"Luxury (>50€)"},
        "showing": "Showing 30 of {}. Use filters to refine.",
        "showing_n": "{} wines shown",
        "write_dish": "✏️ Enter a dish to receive pairings!",
        "register_cta": "💡 **Register free** to save your searches.",
        "continent_europe": "🇪🇺 Europe",
        "continent_americas": "🌎 Americas",
        "continent_oceania": "🌏 Oceania",
        "continent_africa": "🌍 Africa & Other",
        "ai_explanation_title": "🤖 How the AI Chemical Agent Works",
        "ai_explanation": """
diVino's AI agent **uses no empirical rules** (like "fish = white wine").

Instead, for each search:
1. **Decomposes the dish** into molecular compounds: lipids, proteins, organic acids, terpenes, thiols, capsaicinoids, Maillard products, etc.
2. **Evaluates every wine** in the catalog against those compounds, computing a 0-100 score on 4 chemical axes: interaction compatibility, aromatic concordance, structural balance, absence of conflicts.
3. **Returns all wines scoring ≥55** — not just 3 — because a complex dish can have many valid pairings.
""",
        "language": "🌐 Language / Lingua",
    },
    "es": {
        "hero_title": "diVino",
        "hero_sub": "Motor de maridaje basado en química molecular con IA",
        "hero_tagline": "Porque el vino correcto siempre es… diVino.",
        "describe_dish": "🍽️ Describe tu plato",
        "dish_caption": "Más detalles (ingredientes, cocción, salsas) = maridajes más precisos",
        "dish_placeholder": "Ej: pollo con espárragos y mantequilla · espagueti con almejas · chuletón con boletus...",
        "pair_btn": "🍷 Maridar",
        "filters": "⚙️ Filtros",
        "area": "🌍 Área",
        "any": "Cualquiera",
        "italy": "Italia",
        "abroad": "Internacional",
        "region": "🗺️ Región",
        "price_band": "💰 Gama de precio",
        "wine_type": "🍾 Tipo",
        "price_range": "💶 Rango de precio (€)",
        "min": "Mín",
        "max": "Máx",
        "analyzing": "🧪 Análisis molecular de '{}' en curso… ({} vinos en catálogo)",
        "no_filters": "⚠️ Ningún vino cumple estos filtros. Intenta ampliarlos.",
        "molecular_analysis": "🔬 Análisis molecular del plato",
        "fats": "🧈 Grasas",
        "proteins": "🥩 Proteínas/Umami",
        "acidity": "🍋 Acidez",
        "volatiles": "🌿 Volátiles",
        "spice": "🌶️ Picante",
        "umami": "🫧 Umami",
        "sweetness": "🍬 Dulzura",
        "complexity": "⚗️ Complejidad",
        "challenge": "🎯 **Reto químico de maridaje:**",
        "ingredients_found": "**Ingredientes identificados:**",
        "divino_suggests": "🍷 **diVino recomienda:**",
        "pairings_found": "✨ {} maridaje{} encontrado{} para *{}*",
        "catalog_title": "📚 Catálogo · {} etiquetas",
        "catalog": "Catálogo",
        "pairing": "Maridaje",
        "chemistry": "🔬 Interacción química:",
        "in_mouth": "👅 En boca:",
        "why_works": "💡 Por qué funciona:",
        "buy": "🛒 Comprar — {:.2f}€",
        "rate": "⭐ Valorar",
        "save": "💾 Guardar",
        "feedback_thanks": "¡Gracias! Tu feedback mejora el motor AI.",
        "login": "Iniciar sesión",
        "register": "Registrarse",
        "email": "Email",
        "password": "Contraseña",
        "name": "Nombre",
        "create_account": "Crear cuenta",
        "welcome": "¡Bienvenido, {}!",
        "wrong_credentials": "Credenciales incorrectas.",
        "account_created": "¡Cuenta creada! Ahora inicia sesión.",
        "email_exists": "Email ya registrado.",
        "fill_fields": "Por favor rellena todos los campos.",
        "searches": "Búsquedas",
        "rated_wines": "Vinos valorados",
        "avg_rating": "Valoración media",
        "last_searches": "**📜 Últimas búsquedas**",
        "logout": "🚪 Salir",
        "sidebar_caption": "diVino v4.0 · {} etiquetas · Motor AI Químico",
        "api_missing": "🔑 Falta la API Key de Anthropic.",
        "grape": "Uva",
        "alcohol": "Alcohol",
        "body": "Cuerpo",
        "tannins": "Taninos",
        "match": "Compatibilidad",
        "no_filter": "Sin filtro — mostrar todos",
        "filter_geo": "Preferencia geográfica:",
        "filter_band": "Gama de precio:",
        "filter_type": "Tipo de vino:",
        "filter_range": "Rango de precio:",
        "filter_max": "Presupuesto máx:",
        "types_all": "Todos",
        "types_cat": ["Todos","Blanco","Tinto","Espumoso","Rosado","Dulce"],
        "fascia_all": "Todos",
        "fascia_cat": ["Todos","economico","standard","premium","lusso"],
        "bands": {"Económico (<12€)":"economico","Estándar (12–25€)":"standard","Premium (25–50€)":"premium","Lujo (>50€)":"lusso"},
        "bands_display": ["Cualquiera","Económico (<12€)","Estándar (12–25€)","Premium (25–50€)","Lujo (>50€)"],
        "bands_labels": {"economico":"Económico (<12€)","standard":"Estándar (12–25€)","premium":"Premium (25–50€)","lusso":"Lujo (>50€)"},
        "showing": "Mostrando 30 de {}. Usa los filtros.",
        "showing_n": "{} vinos mostrados",
        "write_dish": "✏️ ¡Escribe el plato para recibir maridajes!",
        "register_cta": "💡 **Regístrate gratis** para guardar tus búsquedas.",
        "continent_europe": "🇪🇺 Europa",
        "continent_americas": "🌎 Américas",
        "continent_oceania": "🌏 Oceanía",
        "continent_africa": "🌍 África y otros",
        "ai_explanation_title": "🤖 Cómo funciona el Agente AI Químico",
        "ai_explanation": """
El agente AI de diVino **no usa reglas empíricas** (como "pescado = vino blanco").

En cambio, para cada búsqueda:
1. **Descompone el plato** en compuestos moleculares: lípidos, proteínas, ácidos orgánicos, terpenos, tioles, capsaicinoides, productos de Maillard, etc.
2. **Evalúa cada vino** del catálogo contra esos compuestos, calculando puntuaciones de 0-100 en 4 ejes químicos.
3. **Devuelve todos los vinos con puntuación ≥55** — no solo 3 — porque un plato complejo puede tener muchos maridajes válidos.
""",
        "language": "🌐 Idioma / Language",
    }
}

def T(key, *args):
    lang = st.session_state.get("lang", "it")
    txt = LANG.get(lang, LANG["it"]).get(key, LANG["it"].get(key, key))
    if args:
        try: return txt.format(*args)
        except: return txt
    return txt

# CSS
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
.score-bar { background: #f0e8e9; border-radius: 8px; height: 9px; overflow: hidden; margin: 6px 0 12px; }
.score-fill { height: 100%; border-radius: 8px; background: linear-gradient(90deg, #7a2d36, #c0444f); }
.wine-card {
    background: white; border-radius: 14px;
    border-left: 5px solid #5c1d24;
    padding: 0 0 18px 0; margin: 16px 0;
    box-shadow: 0 3px 16px rgba(0,0,0,0.07);
    overflow: hidden;
}
.wine-card-body { padding: 16px 22px 0 22px; }
.wine-card h3 { margin: 0 0 10px; color: #3d0a10; font-size: 1.22em; }
.wine-img { width: 100%; height: 200px; object-fit: cover; display: block; background: #f5eded; }
.wine-img-placeholder { width: 100%; height: 180px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg,#f5eded,#e8d5d7); font-size: 3em; }
.badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.76em; font-weight: 600; margin: 2px 3px 2px 0; }
.badge-price  { background: #d1e7dd; color: #0a3d1f; }
.badge-geo    { background: #cff4fc; color: #063242; }
.badge-type   { background: #f3d9fa; color: #4a0a5c; }
.badge-score  { background: #fff3cd; color: #5c3d00; }
.badge-match  { background: #fde8e8; color: #5c0a10; }
.molecule-row { display: flex; flex-wrap: wrap; gap: 7px; margin: 10px 0; padding: 10px; background: #faf7f5; border-radius: 8px; }
.molecule-pill { background: #3d0a10; color: white; padding: 3px 10px; border-radius: 20px; font-size: 0.74em; font-weight: 500; }
.buy-btn {
    display: block; width: 100%;
    background: linear-gradient(135deg, #5c1d24, #8a2832);
    color: white !important; text-align: center; padding: 12px;
    border-radius: 8px; font-weight: 700; text-decoration: none;
    font-size: 0.92em; margin-top: 12px; transition: all 0.2s;
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
.analisi-box { background: white; border-radius: 12px; padding: 20px; margin: 16px 0; border: 1px solid #f0e5e6; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.continent-header { background: linear-gradient(90deg,#3d0a10,#6b2030); color:white; padding:8px 16px; border-radius:8px; font-weight:700; margin:20px 0 8px; font-size:0.95em; letter-spacing:0.5px; }
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
# CATALOGO 200+ VINI
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

WINE_CATALOG = [
    # ══════════════════════════════════
    # ITALIA — PIEMONTE
    # ══════════════════════════════════
    {"id":"BAR001","nome":"Barolo DOCG Borgogno 2018","regione":"Piemonte","continente":"Italia","tipo":"Rosso","fascia":"premium","prezzo":42.00,"uva":"Nebbiolo","alcol":14.5,"acidita":"alta","tannini":"potenti","corpo":"pieno","residuo_zuccherino":0.8,"profilo_aromatico":["rosa appassita","cuoio","tabacco","catrame","liquirizia"],"abbina_bene_con":["selvaggina","brasati","tartufo","formaggi stagionati"],"non_abbina_con":["pesce","frutti di mare","dolci"],"slug":"barolo-borgogno-2018","foto":FOTO["rosso_piemonte"]},
    {"id":"BAR002","nome":"Barolo DOCG Pio Cesare Ornato 2017","regione":"Piemonte","continente":"Italia","tipo":"Rosso","fascia":"lusso","prezzo":78.00,"uva":"Nebbiolo","alcol":14.0,"acidita":"alta","tannini":"seta","corpo":"pieno","residuo_zuccherino":0.6,"profilo_aromatico":["violetta","prugna","spezie orientali","muschio","vaniglia"],"abbina_bene_con":["filetto","porcini","tartufo bianco","cacciagione"],"non_abbina_con":["frittura","acidità elevata"],"slug":"barolo-pio-cesare-ornato","foto":FOTO["rosso_piemonte"]},
    {"id":"BAR003","nome":"Barbaresco DOCG Gaja 2019","regione":"Piemonte","continente":"Italia","tipo":"Rosso","fascia":"lusso","prezzo":155.00,"uva":"Nebbiolo","alcol":13.5,"acidita":"altissima","tannini":"fini","corpo":"pieno","residuo_zuccherino":0.5,"profilo_aromatico":["rosa","lampone","tabacco","cuoio nobile","spezie fini"],"abbina_bene_con":["fagiano","petto d'anatra","risotto al tartufo","formaggi erborinati"],"non_abbina_con":["piatti dolci","frittura"],"slug":"barbaresco-gaja-2019","foto":FOTO["rosso_piemonte"]},
    {"id":"OVE001","nome":"Ovello Barbaresco Riserva DOCG Produttori del Barbaresco","regione":"Piemonte","continente":"Italia","tipo":"Rosso","fascia":"premium","prezzo":45.00,"uva":"Nebbiolo","alcol":14.0,"acidita":"alta","tannini":"seta","corpo":"pieno","residuo_zuccherino":0.6,"profilo_aromatico":["rosa essiccata","tabacco Virginia","cuoio nobile","spezie fini","rabarbaro"],"abbina_bene_con":["filetto di manzo","tartufo bianco","risotto al tartufo","capriolo","formaggi stagionati 36 mesi"],"non_abbina_con":["pesce","crostacei","piatti delicati"],"slug":"ovello-barbaresco-produttori","foto":FOTO["rosso_piemonte"]},
    {"id":"NEB001","nome":"Nebbiolo d'Alba DOC Prunotto","regione":"Piemonte","continente":"Italia","tipo":"Rosso","fascia":"standard","prezzo":17.50,"uva":"Nebbiolo","alcol":13.5,"acidita":"alta","tannini":"medi","corpo":"medio-pieno","residuo_zuccherino":1.0,"profilo_aromatico":["viola","ciliegia selvatica","spezie dolci","erbe alpine"],"abbina_bene_con":["pasta al ragù","stracotto","salumi stagionati"],"non_abbina_con":["pesce","crostacei"],"slug":"nebbiolo-alba-prunotto","foto":FOTO["rosso_piemonte"]},
    {"id":"DOL001","nome":"Dolcetto d'Alba DOC Vietti","regione":"Piemonte","continente":"Italia","tipo":"Rosso","fascia":"economico","prezzo":10.50,"uva":"Dolcetto","alcol":13.0,"acidita":"bassa","tannini":"morbidi","corpo":"medio","residuo_zuccherino":1.5,"profilo_aromatico":["mora","mandorla","prugna fresca","liquirizia"],"abbina_bene_con":["pizza","salumi","pasta al sugo","cotoletta"],"non_abbina_con":["pesce crudo","ostriche"],"slug":"dolcetto-alba-vietti","foto":FOTO["rosso_piemonte"]},
    {"id":"BAR004","nome":"Barbera d'Asti Superiore DOCG La Morandina","regione":"Piemonte","continente":"Italia","tipo":"Rosso","fascia":"standard","prezzo":13.00,"uva":"Barbera","alcol":14.0,"acidita":"altissima","tannini":"bassi","corpo":"medio","residuo_zuccherino":0.8,"profilo_aromatico":["ciliegia","prugna","spezie","vaniglia"],"abbina_bene_con":["pasta al pomodoro","pizza","salumi grassi","formaggi semi-stagionati"],"non_abbina_con":["ostriche","pesce delicato"],"slug":"barbera-asti-morandina","foto":FOTO["rosso_piemonte"]},
    {"id":"GAV001","nome":"Gavi di Gavi DOCG La Scolca Etichetta Nera","regione":"Piemonte","continente":"Italia","tipo":"Bianco","fascia":"premium","prezzo":24.00,"uva":"Cortese","alcol":12.5,"acidita":"alta","tannini":"assenti","corpo":"leggero-medio","residuo_zuccherino":1.8,"profilo_aromatico":["mandorla","pietra bagnata","fiori bianchi","agrumi","mela verde"],"abbina_bene_con":["pesce al vapore","spaghetti alle vongole","frittura mista","risotto allo zafferano","antipasti di pesce"],"non_abbina_con":["carne rossa","formaggi piccanti","piatti grassi"],"slug":"gavi-la-scolca","foto":FOTO["bianco_nord"]},
    {"id":"MOS001","nome":"Moscato d'Asti DOCG Ceretto","regione":"Piemonte","continente":"Italia","tipo":"Dolce","fascia":"economico","prezzo":11.50,"uva":"Moscato Bianco","alcol":5.5,"acidita":"media","tannini":"assenti","corpo":"leggero","residuo_zuccherino":110.0,"profilo_aromatico":["pesca","albicocca","fiori d'arancio","muschio bianco","miele"],"abbina_bene_con":["crostate di frutta","panettone","formaggi erborinati dolci","torta di mele","dessert leggeri"],"non_abbina_con":["carne rossa","piatti salati","formaggi piccanti"],"slug":"moscato-asti-ceretto","foto":FOTO["dolce"]},
    {"id":"AST001","nome":"Asti Spumante DOCG Contratto","regione":"Piemonte","continente":"Italia","tipo":"Spumante","fascia":"economico","prezzo":11.00,"uva":"Moscato","alcol":7.0,"acidita":"media","tannini":"assenti","corpo":"leggero","residuo_zuccherino":80.0,"profilo_aromatico":["pesca","fiori d'arancio","albicocca","muschio","miele"],"abbina_bene_con":["pandoro","panettone","crostate di frutta","formaggi erborinati dolci","dessert alla frutta"],"non_abbina_con":["carne rossa","pesce crudo","piatti salati"],"slug":"asti-spumante-contratto","foto":FOTO["spumante"]},
    {"id":"LAS001","nome":"Alta Langa DOCG Enrico Serafino Zero Dosage","regione":"Piemonte","continente":"Italia","tipo":"Spumante","fascia":"standard","prezzo":18.00,"uva":"Pinot Nero + Chardonnay","alcol":12.0,"acidita":"alta","tannini":"assenti","corpo":"medio","residuo_zuccherino":0.0,"profilo_aromatico":["agrumi","lievito","crosta di pane","mela verde","mineralità"],"abbina_bene_con":["ostriche","tartare di tonno","sushi","crudités","formaggi freschi"],"non_abbina_con":["dolci","piatti piccanti","brasati"],"slug":"alta-langa-serafino-zero","foto":FOTO["spumante"]},

    # ══════════════════════════════════
    # ITALIA — TOSCANA
    # ══════════════════════════════════
    {"id":"CHI001","nome":"Chianti Classico DOCG Riserva Fonterutoli","regione":"Toscana","continente":"Italia","tipo":"Rosso","fascia":"standard","prezzo":22.00,"uva":"Sangiovese","alcol":13.5,"acidita":"alta","tannini":"medi","corpo":"medio-pieno","residuo_zuccherino":1.0,"profilo_aromatico":["marasca","viola","spezie fini","cuoio leggero"],"abbina_bene_con":["bistecca fiorentina","cinghiale","pasta al tartufo","pecorino stagionato"],"non_abbina_con":["crostacei","dessert al cioccolato"],"slug":"chianti-classico-riserva-fonterutoli","foto":FOTO["rosso_toscana"]},
    {"id":"BRU001","nome":"Brunello di Montalcino DOCG Biondi-Santi 2016","regione":"Toscana","continente":"Italia","tipo":"Rosso","fascia":"lusso","prezzo":185.00,"uva":"Sangiovese Grosso","alcol":14.0,"acidita":"alta","tannini":"seta","corpo":"pieno","residuo_zuccherino":0.5,"profilo_aromatico":["frutta scura","vaniglia","tabacco","spezie nobili","terra umida"],"abbina_bene_con":["selvaggina nobile","tartufo nero","filetto al pepe","formaggi affilati"],"non_abbina_con":["pesce","frittura","piatti leggeri"],"slug":"brunello-biondi-santi-2016","foto":FOTO["rosso_toscana"]},
    {"id":"BRU002","nome":"Brunello di Montalcino DOCG Casanova di Neri","regione":"Toscana","continente":"Italia","tipo":"Rosso","fascia":"lusso","prezzo":65.00,"uva":"Sangiovese Grosso","alcol":14.5,"acidita":"alta","tannini":"potenti","corpo":"pieno","residuo_zuccherino":0.6,"profilo_aromatico":["ciliegia nera","prugna secca","moka","spezie","cuoio"],"abbina_bene_con":["cinghiale","arrosto di manzo","formaggi erborinati"],"non_abbina_con":["pesce","verdure delicate"],"slug":"brunello-casanova-di-neri","foto":FOTO["rosso_toscana"]},
    {"id":"VIN001","nome":"Vino Nobile di Montepulciano DOCG Avignonesi","regione":"Toscana","continente":"Italia","tipo":"Rosso","fascia":"premium","prezzo":28.00,"uva":"Prugnolo Gentile","alcol":13.5,"acidita":"alta","tannini":"medi","corpo":"medio-pieno","residuo_zuccherino":0.9,"profilo_aromatico":["ciliegia","spezie dolci","muschio","viola"],"abbina_bene_con":["bistecca","agnello","pasta al ragù di cinghiale"],"non_abbina_con":["pesce crudo","dolci delicati"],"slug":"vino-nobile-avignonesi","foto":FOTO["rosso_toscana"]},
    {"id":"BOR001","nome":"Morellino di Scansano DOCG Poggio Argentiera","regione":"Toscana","continente":"Italia","tipo":"Rosso","fascia":"standard","prezzo":15.00,"uva":"Sangiovese","alcol":13.5,"acidita":"media","tannini":"morbidi","corpo":"medio","residuo_zuccherino":1.5,"profilo_aromatico":["mora","maremma","macchia","spezie marine"],"abbina_bene_con":["cinghiale","pasta al ragù","cacciucco","formaggi toscani"],"non_abbina_con":["crudi di mare","dessert"],"slug":"morellino-scansano-argentiera","foto":FOTO["rosso_toscana"]},
    {"id":"BOL001","nome":"Bolgheri Sassicaia DOC 2019","regione":"Toscana","continente":"Italia","tipo":"Rosso","fascia":"lusso","prezzo":198.00,"uva":"Cabernet Sauvignon + Cabernet Franc","alcol":13.5,"acidita":"media","tannini":"strutturati","corpo":"pieno","residuo_zuccherino":0.8,"profilo_aromatico":["ribes nero","cedro","peperone","spezie internazionali","tabacco Virginia"],"abbina_bene_con":["filetto di manzo","agnello al forno","formaggi stagionati duri"],"non_abbina_con":["pesce delicato","dolci","piatti piccanti"],"slug":"bolgheri-sassicaia-2019","foto":FOTO["rosso_toscana"]},
    {"id":"VIN002","nome":"Vin Santo del Chianti DOC Isole e Olena","regione":"Toscana","continente":"Italia","tipo":"Dolce","fascia":"premium","prezzo":36.00,"uva":"Trebbiano + Malvasia","alcol":16.0,"acidita":"alta","tannini":"assenti","corpo":"pieno","residuo_zuccherino":100.0,"profilo_aromatico":["nocciola","miele","fico secco","mandorla tostata","vaniglia","spezie"],"abbina_bene_con":["cantucci","crostate","formaggi stagionati duri","dolci secchi","torta della nonna"],"non_abbina_con":["carne","pesce","piatti salati"],"slug":"vin-santo-isole-olena","foto":FOTO["dolce"]},
    {"id":"ROS001","nome":"Rosso di Montalcino DOC Col d'Orcia","regione":"Toscana","continente":"Italia","tipo":"Rosso","fascia":"standard","prezzo":18.00,"uva":"Sangiovese","alcol":13.5,"acidita":"alta","tannini":"medi","corpo":"medio","residuo_zuccherino":1.0,"profilo_aromatico":["ciliegia","spezie","terra toscana","viola"],"abbina_bene_con":["pasta al ragù","arista toscana","bistecca","formaggi pecorino"],"non_abbina_con":["pesce","crostacei"],"slug":"rosso-montalcino-orcia","foto":FOTO["rosso_toscana"]},
    {"id":"SUP001","nome":"Supertuscan IGT Ornellaia 2018","regione":"Toscana","continente":"Italia","tipo":"Rosso","fascia":"lusso","prezzo":210.00,"uva":"Merlot + Cab.Sauvignon + Cab.Franc + Petit Verdot","alcol":14.0,"acidita":"media","tannini":"vellutati","corpo":"pieno","residuo_zuccherino":1.0,"profilo_aromatico":["ribes nero","mirtillo","cedro","spezie dolci","tabacco premium","cioccolato fondente"],"abbina_bene_con":["filetto Wagyu","agnello rack","selvaggina nobile","formaggi stagionati premium"],"non_abbina_con":["pesce","piatti leggeri"],"slug":"ornellaia-2018","foto":FOTO["rosso_toscana"]},

    # ══════════════════════════════════
    # ITALIA — VENETO
    # ══════════════════════════════════
    {"id":"AMA001","nome":"Amarone DOCG Allegrini 2017","regione":"Veneto","continente":"Italia","tipo":"Rosso","fascia":"lusso","prezzo":58.00,"uva":"Corvina + Corvinone + Rondinella","alcol":15.5,"acidita":"media","tannini":"vellutati","corpo":"pieno","residuo_zuccherino":5.0,"profilo_aromatico":["prugna secca","cacao","tabacco","marmellata di more","cannella"],"abbina_bene_con":["selvaggina","stufati","formaggi affinati lungamente","brasato all'Amarone"],"non_abbina_con":["pesce","piatti leggeri","frittura"],"slug":"amarone-allegrini-2017","foto":FOTO["rosso_veneto"]},
    {"id":"VPN001","nome":"Valpolicella Ripasso DOC Zenato","regione":"Veneto","continente":"Italia","tipo":"Rosso","fascia":"standard","prezzo":18.00,"uva":"Corvina + Molinara","alcol":13.5,"acidita":"media","tannini":"vellutati","corpo":"medio-pieno","residuo_zuccherino":3.5,"profilo_aromatico":["ciliegia sottospirito","cacao","rotondo","spezie dolci"],"abbina_bene_con":["pasta al ragù","salsiccia","pizza gourmet","risotto al radicchio"],"non_abbina_con":["ostriche","tartare di pesce"],"slug":"valpolicella-ripasso-zenato","foto":FOTO["rosso_veneto"]},
    {"id":"VAL001","nome":"Valpolicella Classico DOC Masi","regione":"Veneto","continente":"Italia","tipo":"Rosso","fascia":"economico","prezzo":10.00,"uva":"Corvina","alcol":12.5,"acidita":"media","tannini":"leggeri","corpo":"leggero-medio","residuo_zuccherino":2.0,"profilo_aromatico":["ciliegia fresca","mandorla","erbe aromatiche"],"abbina_bene_con":["pizza","pasta al pomodoro","salumi","antipasti"],"non_abbina_con":["selvaggina","formaggi molto stagionati"],"slug":"valpolicella-classico-masi","foto":FOTO["rosso_veneto"]},
    {"id":"SOA001","nome":"Soave Classico DOC Pieropan Calvarino","regione":"Veneto","continente":"Italia","tipo":"Bianco","fascia":"standard","prezzo":12.50,"uva":"Garganega + Trebbiano","alcol":12.5,"acidita":"media","tannini":"assenti","corpo":"leggero-medio","residuo_zuccherino":2.5,"profilo_aromatico":["mandorla","fiori bianchi","pesca","minerale","mela"],"abbina_bene_con":["risotto agli asparagi","pesce al vapore","formaggi freschi","prosciutto crudo","insalate"],"non_abbina_con":["brasati","selvaggina","carne rossa"],"slug":"soave-pieropan-calvarino","foto":FOTO["bianco_nord"]},
    {"id":"PRO001","nome":"Prosecco Superiore DOCG Valdobbiadene Ruggeri","regione":"Veneto","continente":"Italia","tipo":"Spumante","fascia":"standard","prezzo":14.00,"uva":"Glera","alcol":11.5,"acidita":"media","tannini":"assenti","corpo":"leggero","residuo_zuccherino":12.0,"profilo_aromatico":["mela golden","pera Williams","pesco","fiori di acacia","note lattee"],"abbina_bene_con":["aperitivo","pizza bianca","prosciutto crudo","frittura leggera","frutti di mare"],"non_abbina_con":["selvaggina","formaggi stagionati pesanti","cioccolato fondente"],"slug":"prosecco-ruggeri","foto":FOTO["spumante"]},
    {"id":"REC001","nome":"Recioto di Soave DOCG Anselmi","regione":"Veneto","continente":"Italia","tipo":"Dolce","fascia":"premium","prezzo":28.00,"uva":"Garganega","alcol":12.0,"acidita":"alta","tannini":"assenti","corpo":"pieno","residuo_zuccherino":120.0,"profilo_aromatico":["mela cotogna","mandorla","miele","fiori bianchi appassiti","albicocca"],"abbina_bene_con":["crostate di frutta","formaggi erborinati dolci","panettone","biscotti","pasta di mandorle"],"non_abbina_con":["piatti salati","carne rossa"],"slug":"recioto-soave-anselmi","foto":FOTO["dolce"]},

    # ══════════════════════════════════
    # ITALIA — LOMBARDIA
    # ══════════════════════════════════
    {"id":"FRA001","nome":"Franciacorta Satèn DOCG Ca' del Bosco","regione":"Lombardia","continente":"Italia","tipo":"Spumante","fascia":"premium","prezzo":34.00,"uva":"Chardonnay","alcol":12.5,"acidita":"alta","tannini":"assenti","corpo":"medio","residuo_zuccherino":6.0,"profilo_aromatico":["crosta di pane","burro noisette","mela cotogna","lievito","tostato delicato"],"abbina_bene_con":["frittura mista","risotto allo zafferano","ostriche","salmone affumicato","capesante","formaggi freschi"],"non_abbina_con":["selvaggina","salumi molto grassi","cioccolato amaro"],"slug":"franciacorta-saten-ca-del-bosco","foto":FOTO["spumante"]},
    {"id":"FRA002","nome":"Franciacorta Brut DOCG Bellavista Alma","regione":"Lombardia","continente":"Italia","tipo":"Spumante","fascia":"premium","prezzo":28.00,"uva":"Chardonnay + Pinot Nero","alcol":12.5,"acidita":"alta","tannini":"assenti","corpo":"leggero-medio","residuo_zuccherino":5.0,"profilo_aromatico":["agrumi","fiori bianchi","lievito fresco","perlage finissimo"],"abbina_bene_con":["aperitivo","tartine","pesce crudo","antipasti delicati","sushi"],"non_abbina_con":["selvaggina","carne rossa","dolci molto dolci"],"slug":"franciacorta-bellavista-alma","foto":FOTO["spumante"]},
    {"id":"SFO001","nome":"Sforzato di Valtellina DOCG Nino Negri 5 Stelle","regione":"Lombardia","continente":"Italia","tipo":"Rosso","fascia":"lusso","prezzo":52.00,"uva":"Nebbiolo (Chiavennasca)","alcol":14.5,"acidita":"alta","tannini":"potenti","corpo":"pieno","residuo_zuccherino":1.5,"profilo_aromatico":["prugna secca","rosa appassita","tabacco","cuoio","spezie nobili"],"abbina_bene_con":["brasato","stinco","formaggi Bitto e Casera stagionati","selvaggina di montagna"],"non_abbina_con":["pesce","piatti leggeri"],"slug":"sforzato-valtellina-negri","foto":FOTO["rosso_piemonte"]},
    {"id":"LUG001","nome":"Lugana DOC Zenato Sergio Zenato","regione":"Lombardia","continente":"Italia","tipo":"Bianco","fascia":"standard","prezzo":14.90,"uva":"Trebbiano di Lugana","alcol":13.0,"acidita":"alta","tannini":"assenti","corpo":"medio","residuo_zuccherino":2.1,"profilo_aromatico":["pesca bianca","mandorla","minerale","fiori di campo","glicerina"],"abbina_bene_con":["risotto al pesce","spaghetti alle vongole","frittura di lago","pesce di lago","formaggi freschi"],"non_abbina_con":["carne rossa","selvaggina","formaggi molto piccanti"],"slug":"lugana-zenato","foto":FOTO["bianco_nord"]},
    {"id":"CHI002","nome":"Chiaretto del Garda DOC Cà dei Frati","regione":"Lombardia","continente":"Italia","tipo":"Rosato","fascia":"standard","prezzo":13.00,"uva":"Groppello + Barbera","alcol":12.0,"acidita":"alta","tannini":"leggeri","corpo":"leggero-medio","residuo_zuccherino":2.0,"profilo_aromatico":["fragola","lampone","petali di rosa","arancia sanguinella"],"abbina_bene_con":["pizza","pasta al pomodoro","frittura","aperitivi","formaggi freschi","insalate"],"non_abbina_con":["carne rossa pesante","selvaggina"],"slug":"chiaretto-garda-ca-dei-frati","foto":FOTO["rosato"]},

    # ══════════════════════════════════
    # ITALIA — TRENTINO-ALTO ADIGE
    # ══════════════════════════════════
    {"id":"TRE001","nome":"Trento DOC Ferrari Giulio Ferrari Riserva del Fondatore","regione":"Trentino-Alto Adige","continente":"Italia","tipo":"Spumante","fascia":"lusso","prezzo":55.00,"uva":"Chardonnay","alcol":12.5,"acidita":"alta","tannini":"assenti","corpo":"pieno","residuo_zuccherino":5.0,"profilo_aromatico":["nocciola tostata","burro","agrumi canditi","mineralità alpina","lievito complesso"],"abbina_bene_con":["crostacei","risotto al tartufo bianco","ostriche","salmone selvaggio","formaggi di alpeggio"],"non_abbina_con":["brasati","formaggi molto piccanti"],"slug":"trento-ferrari-giulio","foto":FOTO["spumante"]},
    {"id":"GEW001","nome":"Gewürztraminer Alto Adige DOC Tramin Nussbaumer","regione":"Trentino-Alto Adige","continente":"Italia","tipo":"Bianco","fascia":"premium","prezzo":22.00,"uva":"Gewürztraminer","alcol":13.5,"acidita":"bassa","tannini":"assenti","corpo":"pieno","residuo_zuccherino":8.0,"profilo_aromatico":["rosa","litchi","speziato intenso","petali di fiori","mango"],"abbina_bene_con":["cucina thai","curry di pollo","foie gras","formaggi erborinati","salmone affumicato","formaggi al pepe"],"non_abbina_con":["carne rossa secca","pesce molto delicato"],"slug":"gewurztraminer-tramin-nussbaumer","foto":FOTO["bianco_nord"]},
    {"id":"LAG001","nome":"Lagrein Alto Adige DOC Cantina Bolzano Taber","regione":"Trentino-Alto Adige","continente":"Italia","tipo":"Rosso","fascia":"premium","prezzo":26.00,"uva":"Lagrein","alcol":13.5,"acidita":"media","tannini":"morbidi","corpo":"pieno","residuo_zuccherino":1.5,"profilo_aromatico":["more","mirtillo","cacao","spezie dolci","viola"],"abbina_bene_con":["canederli","strangolapreti","arrosto di maiale","formaggi Graukäse","selvaggina alpina"],"non_abbina_con":["pesce delicato","ostriche"],"slug":"lagrein-bolzano-taber","foto":FOTO["rosso_veneto"]},
    {"id":"PIN002","nome":"Pinot Nero Alto Adige DOC Elena Walch","regione":"Trentino-Alto Adige","continente":"Italia","tipo":"Rosso","fascia":"premium","prezzo":29.00,"uva":"Pinot Nero","alcol":13.0,"acidita":"alta","tannini":"fini","corpo":"medio","residuo_zuccherino":0.8,"profilo_aromatico":["lampone","fragola alpina","viola","spezie alpine","humus"],"abbina_bene_con":["salmone al forno","petto d'anatra","funghi porcini","cervo","tagliatelle al ragù"],"non_abbina_con":["carne rossa pesante","formaggi piccanti"],"slug":"pinot-nero-elena-walch","foto":FOTO["rosso_veneto"]},

    # ══════════════════════════════════
    # ITALIA — FRIULI-VENEZIA GIULIA
    # ══════════════════════════════════
    {"id":"FRI001","nome":"Friulano DOC Livio Felluga","regione":"Friuli-Venezia Giulia","continente":"Italia","tipo":"Bianco","fascia":"standard","prezzo":17.00,"uva":"Tocai Friulano","alcol":13.5,"acidita":"media","tannini":"assenti","corpo":"medio","residuo_zuccherino":2.0,"profilo_aromatico":["mandorla amara","minerale","erbe","miele","fiori di campo"],"abbina_bene_con":["prosciutto di San Daniele","frico","risotto ai funghi","formaggi Montasio","trota"],"non_abbina_con":["carne rossa","selvaggina"],"slug":"friulano-felluga","foto":FOTO["bianco_nord"]},
    {"id":"PIN001","nome":"Pinot Grigio Ramato DOC Livon","regione":"Friuli-Venezia Giulia","continente":"Italia","tipo":"Bianco","fascia":"standard","prezzo":15.00,"uva":"Pinot Grigio","alcol":13.0,"acidita":"media","tannini":"leggeri","corpo":"medio","residuo_zuccherino":2.0,"profilo_aromatico":["pesca gialla","speziato delicato","rame","miele","noce"],"abbina_bene_con":["salmone","prosciutto cotto","pasta al salmone","risotto al radicchio","formaggi medio stagionati"],"non_abbina_con":["carne rossa","selvaggina"],"slug":"pinot-grigio-ramato-livon","foto":FOTO["bianco_nord"]},
    {"id":"SCH001","nome":"Schiopettino di Prepotto DOC Ronchi di Cialla","regione":"Friuli-Venezia Giulia","continente":"Italia","tipo":"Rosso","fascia":"premium","prezzo":34.00,"uva":"Schiopettino","alcol":13.0,"acidita":"alta","tannini":"fini","corpo":"medio","residuo_zuccherino":0.8,"profilo_aromatico":["pepe nero","mirtillo","violetta","spezie alpine","muschio"],"abbina_bene_con":["cervo in salmi","porcini","capriolo","frico al formaggio","carne affumicata"],"non_abbina_con":["pesce","crostacei","piatti dolci"],"slug":"schiopettino-ronchi-cialla","foto":FOTO["rosso_umbria"]},
    {"id":"RIB002","nome":"Ribolla Gialla Collio DOC Schiopetto","regione":"Friuli-Venezia Giulia","continente":"Italia","tipo":"Bianco","fascia":"standard","prezzo":19.00,"uva":"Ribolla Gialla","alcol":13.0,"acidita":"alta","tannini":"assenti","corpo":"medio","residuo_zuccherino":1.5,"profilo_aromatico":["agrumi","mela acida","fiori bianchi","minerale","erbe fresche"],"abbina_bene_con":["carpaccio di salmone","prosciutto San Daniele","formaggi Montasio fresco","insalate","ceviche leggero"],"non_abbina_con":["carne rossa","formaggi molto stagionati"],"slug":"ribolla-gialla-schiopetto","foto":FOTO["bianco_nord"]},

    # ══════════════════════════════════
    # ITALIA — CAMPANIA
    # ══════════════════════════════════
    {"id":"AGL001","nome":"Taurasi DOCG Mastroberardino Radici","regione":"Campania","continente":"Italia","tipo":"Rosso","fascia":"premium","prezzo":36.00,"uva":"Aglianico","alcol":14.0,"acidita":"alta","tannini":"potenti","corpo":"pieno","residuo_zuccherino":0.9,"profilo_aromatico":["marasca","caffè","polvere da sparo","spezie scure","cioccolato fondente"],"abbina_bene_con":["agnello al forno","cacciagione","pasta al ragù di cinghiale","formaggi piccanti"],"non_abbina_con":["pesce crudo","frutti di mare","dolci"],"slug":"taurasi-mastroberardino-radici","foto":FOTO["rosso_campania"]},
    {"id":"FIA001","nome":"Fiano di Avellino DOCG Feudi di San Gregorio","regione":"Campania","continente":"Italia","tipo":"Bianco","fascia":"premium","prezzo":20.00,"uva":"Fiano","alcol":13.0,"acidita":"alta","tannini":"assenti","corpo":"medio-pieno","residuo_zuccherino":1.5,"profilo_aromatico":["nocciola tostata","miele di acacia","minerale profondo","frutto della passione","spezie delicate"],"abbina_bene_con":["astice","dentice al forno","risotto ai porcini","pollo al forno con erbe","formaggi semistagionati"],"non_abbina_con":["carne rossa","salumi grassi"],"slug":"fiano-avellino-feudi","foto":FOTO["bianco_sud"]},
    {"id":"GRE001","nome":"Greco di Tufo DOCG Mastroberardino","regione":"Campania","continente":"Italia","tipo":"Bianco","fascia":"premium","prezzo":19.00,"uva":"Greco","alcol":13.0,"acidita":"alta","tannini":"assenti","corpo":"medio-pieno","residuo_zuccherino":1.8,"profilo_aromatico":["pesca bianca","agrumi","minerale sulfureo","fiori di pesco","nocciola"],"abbina_bene_con":["frittura di pesce","pasta ai frutti di mare","risotto allo zafferano","cozze gratinate","formaggi provola"],"non_abbina_con":["carne rossa","salumi grassi"],"slug":"greco-tufo-mastroberardino","foto":FOTO["bianco_sud"]},
    {"id":"AGR001","nome":"Aglianico del Vulture DOC Grifalco","regione":"Basilicata","continente":"Italia","tipo":"Rosso","fascia":"premium","prezzo":24.00,"uva":"Aglianico","alcol":13.5,"acidita":"alta","tannini":"potenti","corpo":"pieno","residuo_zuccherino":1.0,"profilo_aromatico":["more selvatiche","humus","spezie vulcaniche","vaniglia"],"abbina_bene_con":["agnello","salsiccia lucana","pasta al ragù"],"non_abbina_con":["pesce","crostacei"],"slug":"aglianico-vulture-grifalco","foto":FOTO["rosso_campania"]},

    # ══════════════════════════════════
    # ITALIA — SICILIA
    # ══════════════════════════════════
    {"id":"ETR001","nome":"Etna Rosso DOC Cornelissen Susucaru","regione":"Sicilia","continente":"Italia","tipo":"Rosso","fascia":"premium","prezzo":26.00,"uva":"Nerello Mascalese","alcol":13.0,"acidita":"altissima","tannini":"fini","corpo":"medio","residuo_zuccherino":0.8,"profilo_aromatico":["lampone","fragola alpina","cenere vulcanica","spezie fini","geranio"],"abbina_bene_con":["pesce al forno","tonno alla siciliana","pasta alla norma","formaggi freschi"],"non_abbina_con":["brasati grassi","formaggi molto stagionati"],"slug":"etna-rosso-cornelissen","foto":FOTO["rosso_sicilia"]},
    {"id":"NEA001","nome":"Nero d'Avola DOC Cusumano Benuara","regione":"Sicilia","continente":"Italia","tipo":"Rosso","fascia":"economico","prezzo":10.00,"uva":"Nero d'Avola","alcol":14.0,"acidita":"media","tannini":"morbidi","corpo":"pieno","residuo_zuccherino":3.0,"profilo_aromatico":["frutti rossi maturi","cacao","spezie calde","confettura"],"abbina_bene_con":["pasta alla norma","arancine","carne alla griglia","pizza","caponata"],"non_abbina_con":["pesce crudo","carpacci"],"slug":"nero-avola-cusumano","foto":FOTO["rosso_sicilia"]},
    {"id":"ETB001","nome":"Etna Bianco DOC Benanti Pietra Marina","regione":"Sicilia","continente":"Italia","tipo":"Bianco","fascia":"premium","prezzo":23.00,"uva":"Carricante","alcol":13.0,"acidita":"altissima","tannini":"assenti","corpo":"pieno","residuo_zuccherino":1.2,"profilo_aromatico":["agrumi canditi","vulcanico","iodio","pompelmo","pietra focaia"],"abbina_bene_con":["crostacei","pesce alla griglia","pasta ai ricci","spaghetti alle vongole","formaggi pecorino giovane"],"non_abbina_con":["carni rosse","dessert"],"slug":"etna-bianco-benanti","foto":FOTO["bianco_sud"]},
    {"id":"CAT001","nome":"Cataratto Siciliano DOC Tasca d'Almerita","regione":"Sicilia","continente":"Italia","tipo":"Bianco","fascia":"economico","prezzo":9.00,"uva":"Cataratto","alcol":13.0,"acidita":"media","tannini":"assenti","corpo":"medio","residuo_zuccherino":2.5,"profilo_aromatico":["fiori bianchi","pesca","mandorla","agrumi siciliani"],"abbina_bene_con":["pasta con le sarde","frittura di pesce","pesce spada","cous cous siciliano"],"non_abbina_con":["carne rossa","formaggi piccanti"],"slug":"cataratto-tasca-almerita","foto":FOTO["bianco_sud"]},
    {"id":"PAS001","nome":"Passito di Pantelleria DOC Donnafugata Ben Ryé","regione":"Sicilia","continente":"Italia","tipo":"Dolce","fascia":"premium","prezzo":38.00,"uva":"Zibibbo","alcol":14.5,"acidita":"alta","tannini":"assenti","corpo":"pieno","residuo_zuccherino":150.0,"profilo_aromatico":["albicocca secca","dattero","fichi","miele di zagara","agrumi canditi","iodio"],"abbina_bene_con":["formaggi erborinati","foie gras","crostate di frutta secca","dessert alla frutta","biscotti secchi"],"non_abbina_con":["pesce crudo","carne rossa","piatti salati"],"slug":"passito-pantelleria-donnafugata","foto":FOTO["dolce"]},
    {"id":"MAL002","nome":"Malvasia delle Lipari DOC Hauner","regione":"Sicilia","continente":"Italia","tipo":"Dolce","fascia":"premium","prezzo":28.00,"uva":"Malvasia di Lipari","alcol":13.5,"acidita":"media","tannini":"assenti","corpo":"pieno","residuo_zuccherino":90.0,"profilo_aromatico":["albicocca confitta","arancio","miele","spezie dolci","vaniglia"],"abbina_bene_con":["formaggi erborinati","crostate","biscotti di mandorle","frutta secca","cantucci"],"non_abbina_con":["pesce crudo","carne rossa"],"slug":"malvasia-lipari-hauner","foto":FOTO["dolce"]},
    {"id":"NEH001","nome":"Nero d'Avola Rosato IGT Abele","regione":"Sicilia","continente":"Italia","tipo":"Rosato","fascia":"economico","prezzo":9.50,"uva":"Nero d'Avola","alcol":13.0,"acidita":"media","tannini":"assenti","corpo":"leggero-medio","residuo_zuccherino":2.5,"profilo_aromatico":["fragola","pesca","fiori di arancio","corallo"],"abbina_bene_con":["arancine","pasta al pomodoro fresco","caponata","pesce alla griglia","antipasti siciliani"],"non_abbina_con":["selvaggina","formaggi molto stagionati"],"slug":"nero-avola-rosato-abele","foto":FOTO["rosato"]},

    # ══════════════════════════════════
    # ITALIA — SUD E ISOLE VARIE
    # ══════════════════════════════════
    {"id":"CAN001","nome":"Cannonau di Sardegna DOC Sella&Mosca","regione":"Sardegna","continente":"Italia","tipo":"Rosso","fascia":"economico","prezzo":11.00,"uva":"Cannonau","alcol":14.0,"acidita":"media","tannini":"morbidi","corpo":"medio-pieno","residuo_zuccherino":2.0,"profilo_aromatico":["spezie","prugna","macchia mediterranea","tostato"],"abbina_bene_con":["agnello","maiale","formaggi sardi","pasta con salsiccia"],"non_abbina_con":["ostriche","pesce molto delicato"],"slug":"cannonau-sella-mosca","foto":FOTO["rosso_sardegna"]},
    {"id":"VER001","nome":"Vermentino di Gallura DOCG Piero Mancini","regione":"Sardegna","continente":"Italia","tipo":"Bianco","fascia":"standard","prezzo":16.50,"uva":"Vermentino","alcol":13.5,"acidita":"media","tannini":"assenti","corpo":"medio","residuo_zuccherino":3.0,"profilo_aromatico":["macchia mediterranea","mandorla","fiori di ginestra","albicocca","agrumi"],"abbina_bene_con":["aragosta","gamberi","pesce alla sarda","pasta con bottarga","frittura"],"non_abbina_con":["carne rossa","selvaggina"],"slug":"vermentino-gallura-mancini","foto":FOTO["bianco_sud"]},
    {"id":"SAG001","nome":"Sagrantino DOCG Montefalco Caprai 25 Anni","regione":"Umbria","continente":"Italia","tipo":"Rosso","fascia":"premium","prezzo":45.00,"uva":"Sagrantino","alcol":14.5,"acidita":"media","tannini":"titanici","corpo":"pieno","residuo_zuccherino":1.0,"profilo_aromatico":["more","tabacco","spezie scure","cioccolato","mirtillo selvatico"],"abbina_bene_con":["cinghiale","selvaggina pesante","pasta al tartufo nero","formaggi molto stagionati"],"non_abbina_con":["pesce","piatti leggeri","crostacei"],"slug":"sagrantino-caprai-25anni","foto":FOTO["rosso_umbria"]},
    {"id":"MON001","nome":"Montepulciano d'Abruzzo DOC Masciarelli Marina Cvetic","regione":"Abruzzo","continente":"Italia","tipo":"Rosso","fascia":"standard","prezzo":16.00,"uva":"Montepulciano","alcol":13.5,"acidita":"media","tannini":"morbidi","corpo":"pieno","residuo_zuccherino":2.5,"profilo_aromatico":["more","ciliegia nera","cioccolato","spezie dolci"],"abbina_bene_con":["arrosticini","pizza","pasta al ragù","lamb chops","porchetta"],"non_abbina_con":["pesce","antipasti di mare"],"slug":"montepulciano-masciarelli","foto":FOTO["rosso_campania"]},
    {"id":"TRE002","nome":"Trebbiano d'Abruzzo DOC Valentini","regione":"Abruzzo","continente":"Italia","tipo":"Bianco","fascia":"premium","prezzo":38.00,"uva":"Trebbiano d'Abruzzo","alcol":13.5,"acidita":"alta","tannini":"assenti","corpo":"pieno","residuo_zuccherino":1.0,"profilo_aromatico":["camomilla","mandorla","miele","minerale profondo","idrocarburi nobili"],"abbina_bene_con":["brodetto","dentice","pasta con le sarde","formaggi semi-stagionati","pollo arrosto"],"non_abbina_con":["carne rossa","selvaggina"],"slug":"trebbiano-abruzzo-valentini","foto":FOTO["bianco_sud"]},
    {"id":"CER001","nome":"Cerasuolo d'Abruzzo DOC Valentini","regione":"Abruzzo","continente":"Italia","tipo":"Rosato","fascia":"premium","prezzo":32.00,"uva":"Montepulciano","alcol":13.5,"acidita":"media","tannini":"leggeri","corpo":"medio","residuo_zuccherino":1.5,"profilo_aromatico":["ciliegia fresca","melograno","spezie leggere","rosa","fragola"],"abbina_bene_con":["pasta alla chitarra con ragù","arrosticini","pizza","formaggi semi-stagionati","salmone"],"non_abbina_con":["selvaggina pesante","dolci"],"slug":"cerasuolo-abruzzo-valentini","foto":FOTO["rosato"]},
    {"id":"VRD001","nome":"Verdicchio dei Castelli di Jesi DOC Umani Ronchi","regione":"Marche","continente":"Italia","tipo":"Bianco","fascia":"economico","prezzo":9.50,"uva":"Verdicchio","alcol":13.0,"acidita":"alta","tannini":"assenti","corpo":"leggero-medio","residuo_zuccherino":1.8,"profilo_aromatico":["erbe aromatiche","mandorla verde","limone","finocchio","mela Granny"],"abbina_bene_con":["fritto misto","spaghetti alle vongole","brodetto marchigiano","pesce alla griglia"],"non_abbina_con":["carne rossa","formaggi stagionati","brasati"],"slug":"verdicchio-jesi-umani-ronchi","foto":FOTO["bianco_nord"]},
    {"id":"CIR001","nome":"Cirò Rosso Classico DOC Librandi Duca Sanfelice","regione":"Calabria","continente":"Italia","tipo":"Rosso","fascia":"standard","prezzo":14.00,"uva":"Gaglioppo","alcol":13.5,"acidita":"media","tannini":"medi","corpo":"medio-pieno","residuo_zuccherino":1.5,"profilo_aromatico":["ciliegia nera","spezie meridionali","arancia sanguinella","cuoio leggero"],"abbina_bene_con":["nduja","pasta al ragù calabrese","formaggi Caciocavallo","pesce spada alla ghiotta"],"non_abbina_con":["pesce delicato","ostriche"],"slug":"ciro-rosso-librandi","foto":FOTO["rosso_campania"]},
    {"id":"PRO002","nome":"Primitivo di Manduria DOC ES Gianfranco Fino","regione":"Puglia","continente":"Italia","tipo":"Rosso","fascia":"premium","prezzo":32.00,"uva":"Primitivo","alcol":16.0,"acidita":"media","tannini":"vellutati","corpo":"pieno","residuo_zuccherino":6.0,"profilo_aromatico":["confettura di more","cioccolato","spezie dolci","tabacco","fico secco"],"abbina_bene_con":["agnello alla pugliese","orecchiette al ragù","formaggi stagionati pugliesi","carne brasata","BBQ"],"non_abbina_con":["pesce delicato","piatti leggeri"],"slug":"primitivo-manduria-es-fino","foto":FOTO["rosso_campania"]},
    {"id":"NEG001","nome":"Negroamaro Salento IGT Taurino Patriglione","regione":"Puglia","continente":"Italia","tipo":"Rosso","fascia":"standard","prezzo":16.00,"uva":"Negroamaro","alcol":14.0,"acidita":"media","tannini":"morbidi","corpo":"pieno","residuo_zuccherino":2.5,"profilo_aromatico":["mora","spezie di gariga","tabacco dolce","cioccolato al latte"],"abbina_bene_con":["orecchiette con cime di rapa","agnello","pizza al forno a legna","formaggi pecorino"],"non_abbina_con":["pesce crudo","crostacei"],"slug":"negroamaro-taurino","foto":FOTO["rosso_campania"]},
    {"id":"NEG002","nome":"Nero di Troia Puglia IGT Tormaresca Bocca di Lupo","regione":"Puglia","continente":"Italia","tipo":"Rosso","fascia":"premium","prezzo":29.00,"uva":"Nero di Troia","alcol":14.5,"acidita":"alta","tannini":"potenti","corpo":"pieno","residuo_zuccherino":1.0,"profilo_aromatico":["prugna","mirtillo selvatico","pepe","rabarbaro","spezie orientali"],"abbina_bene_con":["agnello al forno","carne alla brace","formaggi Canestrato Pugliese","pasta al ragù"],"non_abbina_con":["pesce","crostacei","piatti leggeri"],"slug":"nero-troia-tormaresca","foto":FOTO["rosso_campania"]},
    {"id":"AMA002","nome":"Amastuola Primitivo Rosato Puglia IGT","regione":"Puglia","continente":"Italia","tipo":"Rosato","fascia":"economico","prezzo":10.00,"uva":"Primitivo","alcol":13.5,"acidita":"media","tannini":"leggeri","corpo":"medio","residuo_zuccherino":3.0,"profilo_aromatico":["fragola","melograno","spezie dolci","ciliegia fresca"],"abbina_bene_con":["pizza","orecchiette","salmone alla griglia","parmigiana di melanzane","antipasti"],"non_abbina_con":["selvaggina","formaggi molto stagionati"],"slug":"amastuola-rosato","foto":FOTO["rosato"]},
    {"id":"PEC001","nome":"Pecorino Colli Aprutini IGT Emidio Pepe","regione":"Abruzzo","continente":"Italia","tipo":"Bianco","fascia":"premium","prezzo":28.00,"uva":"Pecorino","alcol":13.5,"acidita":"alta","tannini":"assenti","corpo":"medio-pieno","residuo_zuccherino":1.5,"profilo_aromatico":["pesca","mandorla","erbe di montagna","agrumi","pietra calcarea"],"abbina_bene_con":["pasta alla chitarra","brodetto","formaggi semistagionati","carne bianca al forno","pesce di scoglio"],"non_abbina_con":["carne rossa","selvaggina"],"slug":"pecorino-emidio-pepe","foto":FOTO["bianco_sud"]},
    {"id":"CAR001","nome":"Carricante Etna Bianco Superiore DOC Benanti","regione":"Sicilia","continente":"Italia","tipo":"Bianco","fascia":"premium","prezzo":35.00,"uva":"Carricante","alcol":13.5,"acidita":"altissima","tannini":"assenti","corpo":"pieno","residuo_zuccherino":0.8,"profilo_aromatico":["agrumi vulcanici","iodio","pietra pomice","frutta tropicale tenue","gesso"],"abbina_bene_con":["ricci di mare","crostacei","pesce spada crudo","sushi di tonno rosso","carpaccio di gamberi"],"non_abbina_con":["carne rossa","brasati","dolci"],"slug":"carricante-pietra-marina","foto":FOTO["bianco_sud"]},

    # ══════════════════════════════════
    # EUROPA — FRANCIA
    # ══════════════════════════════════
    {"id":"CHA001","nome":"Chablis Premier Cru 'Montée de Tonnerre' Raveneau","regione":"Francia","continente":"Europa","tipo":"Bianco","fascia":"lusso","prezzo":72.00,"uva":"Chardonnay","alcol":12.5,"acidita":"altissima","tannini":"assenti","corpo":"pieno","residuo_zuccherino":1.0,"profilo_aromatico":["iodio","pietra focaia","gesso","limone candito","ostrica"],"abbina_bene_con":["ostriche","crostacei","pesce alla piastra","sushi di tonno","tartar di salmone"],"non_abbina_con":["carne rossa","formaggi stagionati","brasati"],"slug":"chablis-raveneau","foto":FOTO["bianco_estero"]},
    {"id":"CHA002","nome":"Chablis AOC William Fèvre","regione":"Francia","continente":"Europa","tipo":"Bianco","fascia":"standard","prezzo":19.00,"uva":"Chardonnay","alcol":12.0,"acidita":"alta","tannini":"assenti","corpo":"leggero-medio","residuo_zuccherino":1.5,"profilo_aromatico":["pietra focaia","agrumi verdi","fiori bianchi","gesso","leggermente iodato"],"abbina_bene_con":["frutti di mare","ostriche","salmone","sashimi","risotto leggero"],"non_abbina_con":["carne rossa","formaggi molto stagionati"],"slug":"chablis-william-fevre","foto":FOTO["bianco_estero"]},
    {"id":"BUR001","nome":"Meursault Premier Cru Coche-Dury","regione":"Francia","continente":"Europa","tipo":"Bianco","fascia":"lusso","prezzo":320.00,"uva":"Chardonnay","alcol":13.5,"acidita":"alta","tannini":"assenti","corpo":"pieno","residuo_zuccherino":1.0,"profilo_aromatico":["burro noisette","nocciola tostata","agrumi canditi","pietra focaia","miele di tiglio"],"abbina_bene_con":["aragosta alla crema","capesante al burro","foie gras di anatra","tartufo bianco","formaggi Époisses"],"non_abbina_con":["carne rossa","formaggi molto piccanti"],"slug":"meursault-coche-dury","foto":FOTO["bianco_estero"]},
    {"id":"PNG001","nome":"Pinot Noir Beaune 'Clos des Ursules' Jadot","regione":"Francia","continente":"Europa","tipo":"Rosso","fascia":"lusso","prezzo":95.00,"uva":"Pinot Noir","alcol":13.0,"acidita":"alta","tannini":"fini","corpo":"medio","residuo_zuccherino":1.0,"profilo_aromatico":["lampone","fragola selvatica","violetta","foglia di tè","terra di Borgogna","pepe bianco"],"abbina_bene_con":["petto d'anatra","fagiano","funghi porcini","piccione","salmone al forno","formaggi Époisses"],"non_abbina_con":["carne rossa pesante","piatti piccanti","selvaggina muschiata"],"slug":"pinot-noir-jadot-beaune","foto":FOTO["rosso_estero"]},
    {"id":"CHP001","nome":"Champagne Brut Billecart-Salmon Blanc de Blancs","regione":"Francia","continente":"Europa","tipo":"Spumante","fascia":"lusso","prezzo":72.00,"uva":"Chardonnay","alcol":12.0,"acidita":"alta","tannini":"assenti","corpo":"leggero-medio","residuo_zuccherino":6.0,"profilo_aromatico":["brioche","limone confit","agrumi fini","fiori bianchi","gesso"],"abbina_bene_con":["ostriche","caviale","scampi","sashimi","formaggi freschi erborinati","capesante"],"non_abbina_con":["carne rossa","formaggi molto stagionati","cioccolato fondente"],"slug":"champagne-billecart-blanc-blancs","foto":FOTO["spumante"]},
    {"id":"CHP002","nome":"Champagne Brut Krug Grande Cuvée","regione":"Francia","continente":"Europa","tipo":"Spumante","fascia":"lusso","prezzo":195.00,"uva":"Pinot Noir + Chardonnay + Pinot Meunier","alcol":12.0,"acidita":"alta","tannini":"assenti","corpo":"pieno","residuo_zuccherino":6.0,"profilo_aromatico":["brioche tostata","noci","mele dorate","crosta di pane","agrumi canditi","miele"],"abbina_bene_con":["caviale Beluga","astice al burro","tartufo bianco","formaggi Comté stagionato","salmone selvaggio affumicato"],"non_abbina_con":["piatti molto dolci","carne rossa pesante"],"slug":"champagne-krug-grande-cuvee","foto":FOTO["spumante"]},
    {"id":"SAU001","nome":"Sauternes Château Rieussec 2015","regione":"Francia","continente":"Europa","tipo":"Dolce","fascia":"lusso","prezzo":85.00,"uva":"Sémillon + Sauvignon Blanc + Muscadelle","alcol":13.5,"acidita":"alta","tannini":"assenti","corpo":"pieno","residuo_zuccherino":120.0,"profilo_aromatico":["miele d'acacia","zafferano","albicocca confitta","ananas","vaniglina","noce moscata"],"abbina_bene_con":["foie gras d'anatra","formaggi erborinati Roquefort","tarte tatin","crostate","salmone affumicato con miele"],"non_abbina_con":["carne rossa secca","pesce crudo","piatti piccanti"],"slug":"sauternes-rieussec-2015","foto":FOTO["dolce"]},
    {"id":"CDR001","nome":"Côtes du Rhône Rouge Château Rayas Pignan","regione":"Francia","continente":"Europa","tipo":"Rosso","fascia":"premium","prezzo":32.00,"uva":"Grenache","alcol":14.5,"acidita":"media","tannini":"morbidi","corpo":"pieno","residuo_zuccherino":2.0,"profilo_aromatico":["frutti rossi maturi","spezie meridionali","garrigue","lavanda","pepe"],"abbina_bene_con":["agnello provenzale","ratatouille","pizza gourmet","formaggi erborinati","pasta al ragù"],"non_abbina_con":["pesce delicato","ostriche"],"slug":"cotes-rhone-rayas-pignan","foto":FOTO["rosso_estero"]},
    {"id":"GRE002","nome":"Grenache Blanc Roussillon AOC Domaine Gauby","regione":"Francia","continente":"Europa","tipo":"Bianco","fascia":"premium","prezzo":28.00,"uva":"Grenache Blanc","alcol":14.0,"acidita":"media","tannini":"leggeri","corpo":"pieno","residuo_zuccherino":2.5,"profilo_aromatico":["pesca bianca","fiori di mandorlo","spezie provenzali","anice","mandorla"],"abbina_bene_con":["bouillabaisse","pesce alla provenzale","ratatouille","poulet rôti","formaggi chèvre"],"non_abbina_con":["carne rossa pesante","formaggi molto stagionati"],"slug":"grenache-blanc-gauby","foto":FOTO["bianco_estero"]},
    {"id":"CAB001","nome":"Chinon AOC Cabernet Franc Charles Joguet","regione":"Francia","continente":"Europa","tipo":"Rosso","fascia":"premium","prezzo":36.00,"uva":"Cabernet Franc","alcol":12.5,"acidita":"alta","tannini":"fini","corpo":"medio","residuo_zuccherino":0.8,"profilo_aromatico":["ribes rosso","violetta","grafite","peperone verde","humus","spezie fini"],"abbina_bene_con":["coniglio in umido","pollo al forno","funghi trifolati","pasta al ragù delicato","formaggi semistagionati"],"non_abbina_con":["pesce crudo","dessert","brasati molto pesanti"],"slug":"chinon-joguet-clos-chene","foto":FOTO["rosso_estero"]},
    {"id":"CRE001","nome":"Crépy AOC Savoie Domaine Dupasquier","regione":"Francia","continente":"Europa","tipo":"Bianco","fascia":"economico","prezzo":12.00,"uva":"Chasselas","alcol":11.5,"acidita":"alta","tannini":"assenti","corpo":"leggero","residuo_zuccherino":2.0,"profilo_aromatico":["mela verde","fiori alpini","minerale","leggermente frizzante","citrus"],"abbina_bene_con":["fonduta","raclette","formaggi alpini","pesce di lago","sushi leggero","tartare"],"non_abbina_con":["carne rossa","formaggi molto stagionati","piatti piccanti"],"slug":"crepy-dupasquier","foto":FOTO["bianco_estero"]},
    {"id":"GEW002","nome":"Riesling Alsace Grand Cru Trimbach Clos Sainte Hune","regione":"Francia","continente":"Europa","tipo":"Bianco","fascia":"lusso","prezzo":95.00,"uva":"Riesling","alcol":13.0,"acidita":"alta","tannini":"assenti","corpo":"pieno","residuo_zuccherino":3.0,"profilo_aromatico":["idrocarburi nobili","miele","lime","pietra bagnata","zafferano","datteri"],"abbina_bene_con":["choucroute garnie","foie gras","munster affinato","aragoste","salmone in crosta"],"non_abbina_con":["carne rossa pesante","piatti molto dolci"],"slug":"trimbach-clos-sainte-hune","foto":FOTO["bianco_estero"]},
    {"id":"ROS002","nome":"Rosé de Provence AOC Château Miraval","regione":"Francia","continente":"Europa","tipo":"Rosato","fascia":"standard","prezzo":21.00,"uva":"Cinsault + Grenache + Syrah","alcol":13.0,"acidita":"alta","tannini":"assenti","corpo":"leggero-medio","residuo_zuccherino":1.5,"profilo_aromatico":["fragola","fiori di campo","agrumi","petali di rosa","note marine"],"abbina_bene_con":["bouillabaisse","salade niçoise","pizza","tapas","griglia leggera","caprese"],"non_abbina_con":["carne rossa pesante","formaggi molto stagionati"],"slug":"rose-miraval","foto":FOTO["rosato"]},
    {"id":"MOU001","nome":"Mouton Rothschild Pauillac AOC 2015","regione":"Francia","continente":"Europa","tipo":"Rosso","fascia":"lusso","prezzo":380.00,"uva":"Cabernet Sauvignon + Merlot + Cab.Franc","alcol":13.5,"acidita":"media","tannini":"strutturati","corpo":"pieno","residuo_zuccherino":0.5,"profilo_aromatico":["ribes nero","cedro","sigaro","pepe","spezie nobili","grafite"],"abbina_bene_con":["filetto di manzo Wagyu","agnello rack","selvaggina nobile","formaggi Comté 36 mesi"],"non_abbina_con":["pesce","piatti leggeri","dolci"],"slug":"mouton-rothschild-2015","foto":FOTO["rosso_estero"]},

    # ══════════════════════════════════
    # EUROPA — SPAGNA
    # ══════════════════════════════════
    {"id":"RIO001","nome":"Rioja Gran Reserva Muga Prado Enea 2015","regione":"Spagna","continente":"Europa","tipo":"Rosso","fascia":"premium","prezzo":42.00,"uva":"Tempranillo + Garnacha","alcol":14.0,"acidita":"media","tannini":"vellutati","corpo":"pieno","residuo_zuccherino":1.5,"profilo_aromatico":["vaniglia","cocco","frutta matura","cuoio","spezie dolci","tabacco"],"abbina_bene_con":["cordero asado","cochinillo","pasta al ragù","formaggi Manchego stagionati","prosciutto iberico"],"non_abbina_con":["pesce crudo","ostriche","piatti leggeri"],"slug":"rioja-muga-prado-enea","foto":FOTO["rosso_estero"]},
    {"id":"RIB001","nome":"Ribera del Duero Reserva Pesquera Janus 2016","regione":"Spagna","continente":"Europa","tipo":"Rosso","fascia":"premium","prezzo":38.00,"uva":"Tempranillo","alcol":14.0,"acidita":"media","tannini":"strutturati","corpo":"pieno","residuo_zuccherino":1.8,"profilo_aromatico":["frutti neri","tostato","spezie dolci","cioccolato","vaniglia americana"],"abbina_bene_con":["agnello lechal","carne alla brace","formaggi stagionati","pasta al ragù pesante"],"non_abbina_con":["pesce","crostacei","piatti molto leggeri"],"slug":"ribera-pesquera-janus","foto":FOTO["rosso_estero"]},
    {"id":"ALB001","nome":"Albariño Rías Baixas DO Pazo San Mauro","regione":"Spagna","continente":"Europa","tipo":"Bianco","fascia":"standard","prezzo":16.00,"uva":"Albariño","alcol":12.5,"acidita":"alta","tannini":"assenti","corpo":"leggero-medio","residuo_zuccherino":2.0,"profilo_aromatico":["albicocca","salino oceanico","pesca","citrus atlantico","fiori bianchi"],"abbina_bene_con":["polpo alla gallega","gambas al ajillo","salmone","frutos del mar","spaghetti alle vongole","pesce alla griglia"],"non_abbina_con":["carne rossa","formaggi stagionati","piatti piccanti"],"slug":"albarino-pazo-san-mauro","foto":FOTO["bianco_estero"]},
    {"id":"VER002","nome":"Verdejo Rueda DO Belondrade y Lurton","regione":"Spagna","continente":"Europa","tipo":"Bianco","fascia":"standard","prezzo":18.00,"uva":"Verdejo","alcol":13.0,"acidita":"alta","tannini":"assenti","corpo":"medio","residuo_zuccherino":1.5,"profilo_aromatico":["erba fresca","pompelmo","fico","note erbacee","agrumi"],"abbina_bene_con":["insalate","ceviche","caprese","pesce al limone","verdure grigliate","pollo leggero"],"non_abbina_con":["carne rossa","formaggi molto stagionati"],"slug":"verdejo-belondrade","foto":FOTO["bianco_estero"]},
    {"id":"TEM001","nome":"Tempranillo Ribera del Duero Jóven Pago de los Capellanes","regione":"Spagna","continente":"Europa","tipo":"Rosso","fascia":"economico","prezzo":11.00,"uva":"Tempranillo","alcol":13.5,"acidita":"media","tannini":"leggeri","corpo":"medio","residuo_zuccherino":2.0,"profilo_aromatico":["ciliegia fresca","lampone","floreale","spezie leggere"],"abbina_bene_con":["pizza","pasta al pomodoro","chorizo","hamburger","pincho moruno"],"non_abbina_con":["pesce crudo","ostriche"],"slug":"tempranillo-joven-capellanes","foto":FOTO["rosso_estero"]},
    {"id":"RIO002","nome":"Rioja Blanco Reserva López de Heredia Viña Gravonia","regione":"Spagna","continente":"Europa","tipo":"Bianco","fascia":"premium","prezzo":26.00,"uva":"Viura","alcol":12.5,"acidita":"alta","tannini":"leggeri","corpo":"medio-pieno","residuo_zuccherino":1.0,"profilo_aromatico":["nocciola ossidativa","miele","camomilla","mela cotogna","tostato antico"],"abbina_bene_con":["bacalà","patatas bravas","carne bianca","formaggi semi-stagionati","uova"],"non_abbina_con":["pesce crudo delicato","carne rossa","frutti di mare"],"slug":"rioja-blanco-lopez-heredia","foto":FOTO["bianco_estero"]},
    {"id":"PRI001","nome":"Priorat DOC Alvaro Palacios L'Ermita 2018","regione":"Spagna","continente":"Europa","tipo":"Rosso","fascia":"lusso","prezzo":320.00,"uva":"Garnacha + Cabernet Sauvignon","alcol":15.0,"acidita":"media","tannini":"vellutati","corpo":"pieno","residuo_zuccherino":2.5,"profilo_aromatico":["more concentrate","minerale di ardesia","kirsch","spezie orientali","cioccolato fondente","lavanda"],"abbina_bene_con":["agnello rack","cinghiale","carne alla brace premium","formaggi stagionati iberici"],"non_abbina_con":["pesce delicato","piatti leggeri"],"slug":"ermita-alvaro-palacios","foto":FOTO["rosso_estero"]},
    {"id":"JER001","nome":"Jerez Fino En Rama Tio Pepe Gonzalez Byass","regione":"Spagna","continente":"Europa","tipo":"Bianco","fascia":"standard","prezzo":14.00,"uva":"Palomino","alcol":15.0,"acidita":"alta","tannini":"assenti","corpo":"leggero","residuo_zuccherino":0.0,"profilo_aromatico":["mandorla ossidativa","salino","fieno secco","lievito di flor","agrumi secchi"],"abbina_bene_con":["jamón ibérico","gambas al ajillo","tapas","ostriche","pesce fritto","aceitunas"],"non_abbina_con":["carne rossa pesante","dolci molto dolci"],"slug":"fino-tio-pepe","foto":FOTO["bianco_estero"]},

    # ══════════════════════════════════
    # EUROPA — GERMANIA
    # ══════════════════════════════════
    {"id":"RIE001","nome":"Riesling Spätlese Mosel Joh. Jos. Prüm Wehlener Sonnenuhr","regione":"Germania","continente":"Europa","tipo":"Bianco","fascia":"premium","prezzo":35.00,"uva":"Riesling","alcol":8.0,"acidita":"altissima","tannini":"assenti","corpo":"leggero","residuo_zuccherino":50.0,"profilo_aromatico":["pesca bianca","albicocca","idrocarburi nobili","pietra","lime","miele leggero"],"abbina_bene_con":["cucina cinese","foie gras","formaggi erborinati","sushi","tempura","maiale al vapore"],"non_abbina_con":["carne rossa secca","selvaggina","piatti aggressivi"],"slug":"riesling-prum-wehlener","foto":FOTO["bianco_estero"]},
    {"id":"RIE002","nome":"Riesling Trocken Mosel Egon Müller Scharzhofberger","regione":"Germania","continente":"Europa","tipo":"Bianco","fascia":"lusso","prezzo":85.00,"uva":"Riesling","alcol":11.5,"acidita":"altissima","tannini":"assenti","corpo":"medio","residuo_zuccherino":5.0,"profilo_aromatico":["petrol nobile","agrumi cangianti","pietra focaia","miele di bosco","fiori bianchi"],"abbina_bene_con":["sushi premium","capesante","ceviche","pesce crudo","tartare di tonno","formaggi freschi alpini"],"non_abbina_con":["carne rossa","brasati pesanti"],"slug":"riesling-egon-muller","foto":FOTO["bianco_estero"]},
    {"id":"SPB001","nome":"Spätburgunder Pinot Noir Baden Bernhard Huber","regione":"Germania","continente":"Europa","tipo":"Rosso","fascia":"premium","prezzo":42.00,"uva":"Spätburgunder (Pinot Noir)","alcol":13.5,"acidita":"alta","tannini":"fini","corpo":"medio","residuo_zuccherino":1.0,"profilo_aromatico":["lampone","ciliegia","violetta","spezie delicate","sottobosco"],"abbina_bene_con":["salmone al forno","petto d'anatra","funghi porcini","Wiener Schnitzel","selvaggina delicata"],"non_abbina_con":["carne rossa pesante","piatti molto grassi"],"slug":"spatburgunder-huber","foto":FOTO["rosso_estero"]},

    # ══════════════════════════════════
    # EUROPA — AUSTRIA
    # ══════════════════════════════════
    {"id":"GRU001","nome":"Grüner Veltliner Smaragd Wachau Knoll Loibenberg","regione":"Austria","continente":"Europa","tipo":"Bianco","fascia":"premium","prezzo":32.00,"uva":"Grüner Veltliner","alcol":13.5,"acidita":"alta","tannini":"assenti","corpo":"pieno","residuo_zuccherino":1.5,"profilo_aromatico":["pepe bianco","erbe alpine","minerale","lime","pompelmo","prezzemolo"],"abbina_bene_con":["asparagi","Wiener Schnitzel","salmone","formaggi alpini giovani","verdure grigliate","pollo in crosta di erbe"],"non_abbina_con":["carne rossa pesante","formaggi molto stagionati","piatti dolci"],"slug":"gruner-veltliner-knoll","foto":FOTO["bianco_estero"]},
    {"id":"GRU002","nome":"Grüner Veltliner Federspiel Wachau Domäne Wachau","regione":"Austria","continente":"Europa","tipo":"Bianco","fascia":"standard","prezzo":16.00,"uva":"Grüner Veltliner","alcol":12.5,"acidita":"alta","tannini":"assenti","corpo":"leggero-medio","residuo_zuccherino":2.0,"profilo_aromatico":["pepe verde","mela","citrus","erbe fresche","minerale"],"abbina_bene_con":["insalate","pollo leggero","asparagi","pesce bianco","verdure al vapore"],"non_abbina_con":["carne rossa","selvaggina"],"slug":"gruner-federspiel-wachau","foto":FOTO["bianco_estero"]},
    {"id":"BLF001","nome":"Blaufränkisch Reserve Burgenland Moric","regione":"Austria","continente":"Europa","tipo":"Rosso","fascia":"premium","prezzo":34.00,"uva":"Blaufränkisch","alcol":13.0,"acidita":"alta","tannini":"fini","corpo":"medio-pieno","residuo_zuccherino":0.8,"profilo_aromatico":["mirtillo","spezie nere","pimento","violetta","grafite"],"abbina_bene_con":["Tafelspitz","manzo brasato","funghi","gulasch","formaggi alpini stagionati"],"non_abbina_con":["pesce delicato","piatti molto dolci"],"slug":"blaufrankisch-moric","foto":FOTO["rosso_estero"]},

    # ══════════════════════════════════
    # EUROPA — PORTOGALLO & ALTRI
    # ══════════════════════════════════
    {"id":"POR001","nome":"Vintage Port Graham's 2016","regione":"Portogallo","continente":"Europa","tipo":"Dolce","fascia":"lusso","prezzo":68.00,"uva":"Touriga Nacional blend","alcol":20.0,"acidita":"media","tannini":"potenti","corpo":"pieno","residuo_zuccherino":90.0,"profilo_aromatico":["frutti neri confettati","cioccolato","spezie esotiche","tabacco","noci"],"abbina_bene_con":["stilton","formaggi erborinati","cioccolato fondente 70%","noci","dessert al cioccolato"],"non_abbina_con":["pesce","crostacei","piatti salati delicati"],"slug":"port-grahams-2016","foto":FOTO["dolce"]},
    {"id":"VIN003","nome":"Vinho Verde DOC Quinta do Ameal Escolha","regione":"Portogallo","continente":"Europa","tipo":"Bianco","fascia":"economico","prezzo":10.00,"uva":"Loureiro + Arinto","alcol":11.0,"acidita":"alta","tannini":"assenti","corpo":"leggero","residuo_zuccherino":3.5,"profilo_aromatico":["lime","fiori bianchi","mela verde","leggermente frizzante","erbe fresche"],"abbina_bene_con":["polvo à lagareiro","baccalà","pesce fritto","gamberi","insalate","sushi"],"non_abbina_con":["carne rossa","formaggi stagionati","piatti molto ricchi"],"slug":"vinho-verde-quinta-ameal","foto":FOTO["bianco_estero"]},
    {"id":"DOC001","nome":"Douro Reserva Quinta do Crasto","regione":"Portogallo","continente":"Europa","tipo":"Rosso","fascia":"standard","prezzo":18.00,"uva":"Touriga Franca + Touriga Nacional","alcol":14.0,"acidita":"alta","tannini":"strutturati","corpo":"pieno","residuo_zuccherino":1.5,"profilo_aromatico":["frutti neri","violetta","spezie lusitane","grafite","tabacco"],"abbina_bene_con":["bacalhau","agnello alla portoghese","pasta al ragù","carne alla griglia"],"non_abbina_con":["pesce delicato","ostriche"],"slug":"douro-crasto","foto":FOTO["rosso_estero"]},
    {"id":"XIN001","nome":"Xinomavro Naoussa PDO Kir-Yianni Diaporos","regione":"Grecia","continente":"Europa","tipo":"Rosso","fascia":"premium","prezzo":28.00,"uva":"Xinomavro","alcol":13.5,"acidita":"alta","tannini":"potenti","corpo":"pieno","residuo_zuccherino":0.8,"profilo_aromatico":["pomodoro essiccato","olive nere","spezie greche","ciliegia acida","tabacco"],"abbina_bene_con":["moussaka","agnello al forno con origano","stifado","pasta al forno","formaggi feta stagionata"],"non_abbina_con":["pesce delicato","piatti leggeri"],"slug":"xinomavro-kir-yianni","foto":FOTO["rosso_estero"]},
    {"id":"ASS001","nome":"Assyrtiko Santorini PDO Sigalas","regione":"Grecia","continente":"Europa","tipo":"Bianco","fascia":"premium","prezzo":25.00,"uva":"Assyrtiko","alcol":13.5,"acidita":"altissima","tannini":"assenti","corpo":"pieno","residuo_zuccherino":1.0,"profilo_aromatico":["vulcanico","iodio","agrumi secchi","pietra pomice","sale marino","lime"],"abbina_bene_con":["octopus grigliato","ceviche","sushi di tonno","crostacei crudi","lavraki al forno","calamari"],"non_abbina_con":["carne rossa","dolci","formaggi stagionati pesanti"],"slug":"assyrtiko-santorini-sigalas","foto":FOTO["bianco_estero"]},

    # ══════════════════════════════════
    # AMERICHE — USA
    # ══════════════════════════════════
    {"id":"ZIN001","nome":"Zinfandel Old Vines Ridge Vineyards Lodi","regione":"California","continente":"Americhe","tipo":"Rosso","fascia":"standard","prezzo":18.00,"uva":"Zinfandel","alcol":15.0,"acidita":"media","tannini":"morbidi","corpo":"pieno","residuo_zuccherino":4.0,"profilo_aromatico":["mora jam","pepe nero","vaniglia americana","mirtillo","cioccolato al latte"],"abbina_bene_con":["barbecue","pulled pork","hamburger gourmet","pizza al salame","pasta al ragù piccante"],"non_abbina_con":["pesce delicato","ostriche","piatti leggeri"],"slug":"zinfandel-ridge-lodi","foto":FOTO["rosso_estero"]},
    {"id":"CHI003","nome":"Chardonnay Napa Valley Rombauer Vineyards","regione":"California","continente":"Americhe","tipo":"Bianco","fascia":"premium","prezzo":42.00,"uva":"Chardonnay","alcol":14.5,"acidita":"media","tannini":"assenti","corpo":"pieno","residuo_zuccherino":4.0,"profilo_aromatico":["burro fuso","vaniglia","ananas","mango","rovere dolce","burro di nocciola"],"abbina_bene_con":["aragosta al burro","pollo alla crema","pasta al salmone","risotto ai funghi","formaggi brie"],"non_abbina_con":["pesce crudo iodato","piatti piccanti","vini tannici"],"slug":"chardonnay-rombauer","foto":FOTO["bianco_estero"]},
    {"id":"CAB002","nome":"Cabernet Sauvignon Napa Valley Opus One 2019","regione":"California","continente":"Americhe","tipo":"Rosso","fascia":"lusso","prezzo":310.00,"uva":"Cabernet Sauvignon + Merlot + Cab.Franc + Malbec + Petit Verdot","alcol":14.5,"acidita":"media","tannini":"strutturati","corpo":"pieno","residuo_zuccherino":1.5,"profilo_aromatico":["ribes nero","cedro","tabacco","spezie dolci","vaniglia di rovere","cioccolato premium"],"abbina_bene_con":["filetto Wellington","agnello al rosmarino","selvaggina nobile","formaggi stagionati premium"],"non_abbina_con":["pesce","piatti leggeri"],"slug":"opus-one-2019","foto":FOTO["rosso_estero"]},
    {"id":"PIN003","nome":"Pinot Noir Willamette Valley Domaine Drouhin Oregon","regione":"Oregon","continente":"Americhe","tipo":"Rosso","fascia":"premium","prezzo":48.00,"uva":"Pinot Noir","alcol":13.5,"acidita":"alta","tannini":"fini","corpo":"medio","residuo_zuccherino":1.0,"profilo_aromatico":["fragola","ciliegia acida","violetta","sottobosco pacifico","pepe rosa"],"abbina_bene_con":["salmone del Pacifico","petto d'anatra","funghi selvatici","piccione","brie stagionato"],"non_abbina_con":["carne rossa pesante","piatti molto grassi"],"slug":"pinot-noir-drouhin-oregon","foto":FOTO["rosso_estero"]},
    {"id":"SAU003","nome":"Sauvignon Blanc Napa Valley Honig","regione":"California","continente":"Americhe","tipo":"Bianco","fascia":"standard","prezzo":22.00,"uva":"Sauvignon Blanc","alcol":14.0,"acidita":"alta","tannini":"assenti","corpo":"medio","residuo_zuccherino":2.5,"profilo_aromatico":["agrumi","erba tagliata","melone","pompelmo","fiori bianchi"],"abbina_bene_con":["capra fresca","insalate","sushi","ceviche","gamberi","asparagi"],"non_abbina_con":["carne rossa","formaggi stagionati","brasati"],"slug":"sauvignon-honig","foto":FOTO["bianco_estero"]},

    # ══════════════════════════════════
    # AMERICHE — ARGENTINA & CILE
    # ══════════════════════════════════
    {"id":"MAL001","nome":"Malbec Reserva Achaval Ferrer Mendoza","regione":"Argentina","continente":"Americhe","tipo":"Rosso","fascia":"standard","prezzo":19.00,"uva":"Malbec","alcol":14.5,"acidita":"media","tannini":"morbidi","corpo":"pieno","residuo_zuccherino":2.5,"profilo_aromatico":["mora","prugna","cioccolato fondente","violetta","spezie dolci"],"abbina_bene_con":["asado","churrasco","hamburger","pasta al ragù","formaggi semiduri","empanadas"],"non_abbina_con":["pesce crudo","ostriche","dessert delicati"],"slug":"malbec-achaval-ferrer","foto":FOTO["rosso_estero"]},
    {"id":"MAL003","nome":"Malbec Gran Reserva Catena Zapata Adrianna Vineyard","regione":"Argentina","continente":"Americhe","tipo":"Rosso","fascia":"lusso","prezzo":95.00,"uva":"Malbec","alcol":14.0,"acidita":"alta","tannini":"seta","corpo":"pieno","residuo_zuccherino":1.5,"profilo_aromatico":["more di alta quota","violetta","spezie andine","cacao fine","grafite"],"abbina_bene_con":["asado premium","filetto di manzo","agnello","pasta al ragù nobile","formaggi stagionati"],"non_abbina_con":["pesce","piatti leggeri"],"slug":"malbec-catena-adrianna","foto":FOTO["rosso_estero"]},
    {"id":"CAB003","nome":"Cabernet Sauvignon Maipo Valley Concha y Toro Don Melchor","regione":"Cile","continente":"Americhe","tipo":"Rosso","fascia":"premium","prezzo":55.00,"uva":"Cabernet Sauvignon","alcol":14.0,"acidita":"media","tannini":"strutturati","corpo":"pieno","residuo_zuccherino":1.5,"profilo_aromatico":["ribes nero","eucalipto","menta","spezie dolci","cedro","pepe"],"abbina_bene_con":["carne alla brace cilena","agnello","hamburger gourmet","pasta al ragù","formaggi stagionati"],"non_abbina_con":["pesce delicato","ostriche"],"slug":"don-melchor-concha-toro","foto":FOTO["rosso_estero"]},
    {"id":"CAR002","nome":"Carménère Rapel Valley Montes Purple Angel","regione":"Cile","continente":"Americhe","tipo":"Rosso","fascia":"premium","prezzo":42.00,"uva":"Carménère + Petit Verdot","alcol":14.5,"acidita":"media","tannini":"vellutati","corpo":"pieno","residuo_zuccherino":2.0,"profilo_aromatico":["paprika","peperone rosso","cioccolato","caffè","spezie cilene"],"abbina_bene_con":["empanadas","carne alla brace","pasta al ragù piccante","formaggi semi-stagionati"],"non_abbina_con":["pesce","piatti molto delicati"],"slug":"carmenere-montes-purple-angel","foto":FOTO["rosso_estero"]},

    # ══════════════════════════════════
    # OCEANIA — AUSTRALIA & NZ
    # ══════════════════════════════════
    {"id":"SYR001","nome":"Shiraz Penfolds Grange Hermitage","regione":"Australia","continente":"Oceania","tipo":"Rosso","fascia":"lusso","prezzo":180.00,"uva":"Shiraz","alcol":14.5,"acidita":"media","tannini":"strutturati","corpo":"pieno","residuo_zuccherino":2.0,"profilo_aromatico":["more selvatiche","pepe","spezie orientali","eucalipto","cuoio","fumo"],"abbina_bene_con":["agnello al forno","carne alla brace","formaggi stagionati robusti","brasato"],"non_abbina_con":["pesce delicato","piatti leggeri","crostacei"],"slug":"penfolds-grange","foto":FOTO["rosso_estero"]},
    {"id":"SYR002","nome":"Shiraz Barossa Valley Torbreck RunRig","regione":"Australia","continente":"Oceania","tipo":"Rosso","fascia":"lusso","prezzo":120.00,"uva":"Shiraz + Viognier","alcol":15.0,"acidita":"media","tannini":"vellutati","corpo":"pieno","residuo_zuccherino":3.0,"profilo_aromatico":["more nere","violetta","pepe bianco","cioccolato fondente","spezie esotiche","eucalipto"],"abbina_bene_con":["agnello Barossa","kangaroo steak","BBQ gourmet","formaggi robusti stagionati"],"non_abbina_con":["pesce","piatti delicati"],"slug":"runrig-torbreck","foto":FOTO["rosso_estero"]},
    {"id":"SAU002","nome":"Sauvignon Blanc Marlborough Cloudy Bay","regione":"Nuova Zelanda","continente":"Oceania","tipo":"Bianco","fascia":"standard","prezzo":20.00,"uva":"Sauvignon Blanc","alcol":13.0,"acidita":"alta","tannini":"assenti","corpo":"leggero-medio","residuo_zuccherino":2.0,"profilo_aromatico":["pompelmo","erba tagliata","asparago","passion fruit","note erbacee pungenti"],"abbina_bene_con":["capra fresca","insalate primaverili","sushi","pesce al lime","asparagi","ceviche"],"non_abbina_con":["carne rossa","formaggi stagionati","brasati"],"slug":"sauvignon-cloudy-bay","foto":FOTO["bianco_estero"]},
    {"id":"PIN004","nome":"Pinot Noir Central Otago Felton Road Block 3","regione":"Nuova Zelanda","continente":"Oceania","tipo":"Rosso","fascia":"premium","prezzo":52.00,"uva":"Pinot Noir","alcol":14.0,"acidita":"alta","tannini":"fini","corpo":"medio","residuo_zuccherino":0.8,"profilo_aromatico":["ciliegia nera","spezie speziate","mirtillo","violetta","terra di scisto"],"abbina_bene_con":["agnello neozelandese","salmone del Pacifico","funghi tartufo","anatra","formaggi freschi"],"non_abbina_con":["carne rossa pesante","piatti grassi"],"slug":"pinot-felton-road","foto":FOTO["rosso_estero"]},
    {"id":"CHA003","nome":"Chardonnay Margaret River Leeuwin Estate Art Series","regione":"Australia","continente":"Oceania","tipo":"Bianco","fascia":"premium","prezzo":58.00,"uva":"Chardonnay","alcol":13.5,"acidita":"alta","tannini":"assenti","corpo":"pieno","residuo_zuccherino":2.0,"profilo_aromatico":["melone bianco","noci tostate","burro noisette","pesca matura","mineralità calcarea"],"abbina_bene_con":["aragosta","capesante","salmone in crosta","risotto ai funghi","pollo alla crema"],"non_abbina_con":["carne rossa","formaggi piccanti"],"slug":"chardonnay-leeuwin","foto":FOTO["bianco_estero"]},
]

# ─────────────────────────────────────────────
# AI — SISTEMA CHIMICO MOLECOLARE
# ─────────────────────────────────────────────
SYSTEM_PROMPT_DIVINO = """
Sei il Motore Chimico di diVino — sistema AI di abbinamento cibo-vino basato su CHIMICA MOLECOLARE.
NON usare regole empiriche. Ragiona SOLO su composti, interazioni fisico-chimiche, struttura molecolare.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FASE 1 — ANALISI MOLECOLARE DEL PIATTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Identifica per ogni ingrediente:
• Lipidi: acidi grassi saturi/insaturi, fosfolipidi, trigliceridi → percentuale percepita
• Proteine: amminoacidi, glutammato/umami, mioglobina (carne), collagene (brasati), actomiosina
• Carboidrati: amidi, saccarosio, glucosio → tendenza dolce
• Acidi organici: citrico, malico, acetico, lattico, tartarico, succinico
• Tannini vegetali: gallotannini (legumi, carciofi), condensati (cacao, noci)
• Composti solforati: allicina (aglio/cipolla), sulforafano (crucifere), DAS
• Capsaicinoidi: capsaicina, diidrocapsaicina → scala Scoville percepita
• Volatili aromatici: terpeni (limonene, linalolo, geraniolo), pirazine (Maillard/tostatura),
  tioli (aglio cotto, crostacei), aldeidi (verde fresco), esteri (fermentati/fruttati),
  lattoni (burro, crema), furanoni (caramello), fenoli volatili (affumicatura)
• Effetti cottura: crudo→composti intatti; Maillard→pirazine tostate, acroleine; griglia→fenoli

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FASE 2 — PRINCIPI CHIMICI DI ABBINAMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• LIPIDI: acidi tartarico/malico → disgregano micelle → pulizia palatale
  CO₂ (bollicine) → rimuove film lipidico meccanicamente
  Etanolo >13% → solubilizza lipidi non polari → amplifica aromi
• PROTEINE: tannini + proteine denaturate (cotta) → complessi vellutati
  tannini + proteine native (crudo) → precipitazione → sensazione metallica
• CAPSAICINA: alcol >13.5% amplifica TRPV1 (EVITARE con piccante intenso)
  residuo zuccherino >5g/L compete con capsaicina (PREFERIRE)
  CO₂ attenua per tamponamento
• ACIDI: vino acido + piatto grasso = contrasto pulente (ideale)
  vino acido + piatto acido = amplificazione (solo se concordanza aromatica)
  vino piatto + piatto acido = piattezza sensoriale
• COMPOSTI SOLFORATI: tioli del vino (SB, Riesling) + tioli del piatto → risonanza aromatica
  terpeni condivisi → amplificazione bouquet
• AMARO: tannini + tannini vegetali (carciofo, rucola) = PERICOLO amplificazione
  zucchero + amaro = contrasto gradevole
• FERRO/IODIO: minerali vulcanici/marini del vino + iodio del pesce = amplificazione umami

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FASE 3 — SCORING E RANKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Per OGNI vino nel catalogo calcola score 0-100:
• Compatibilità interazioni primarie: 40 pt
• Concordanza/contrasto aromatico molecolare: 25 pt
• Equilibrio strutturale peso/intensità: 20 pt
• Assenza conflitti chimici negativi: 15 pt

INCLUDI TUTTI i vini con score ≥ 55. Se nessuno supera 55, includi i top 3.
NON escludere un vino per categoria/colore — usa SOLO la chimica.
Un rosso intenso può abbinarsi a pesce se la chimica lo supporta.
Un bianco può abbinarsi a carne se la struttura molecolare lo giustifica.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT — JSON PURO, ZERO TESTO FUORI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "analisi_piatto": {
    "ingredienti_identificati": ["ingrediente1"],
    "grassi": "tipo e intensità",
    "proteine": "tipo, textura, umami",
    "carboidrati": "tendenza dolce/amidacea",
    "acidi": "tipo e intensità",
    "volatili_aromatici": ["composto1","composto2"],
    "tannini_vegetali": "presenza e fonte",
    "piccantezza": "assente|bassa|media|alta|molto alta",
    "sapidita": "bassa|media|alta",
    "umami": "basso|medio|alto|molto alto",
    "tendenza_dolce": "assente|bassa|media|alta",
    "cottura": "effetti chimici della cottura",
    "complessita": "bassa|media|alta|molto alta",
    "sfida_abbinamento": "il problema chimico principale"
  },
  "abbinamenti": [
    {
      "wine_id": "ID esatto",
      "score": 87,
      "principio": "contrasto|concordanza|complementare|strutturale",
      "interazione_primaria": "Meccanismo chimico in 1 frase tecnica",
      "meccanismo_chimico": "Spiegazione molecolare in 2-3 frasi scientifiche",
      "sensazione_in_bocca": "Descrizione sensoriale del palato",
      "molecole_protagoniste": ["acido tartarico","tannini polimerizzati"],
      "perche_funziona": "Spiegazione accessibile in 1 frase",
      "avvertenza": "Aspetto critico se presente (ometti se ok)"
    }
  ],
  "consiglio_divino": "Paragrafo narrativo elegante in prima persona senza la parola sommelier"
}
"""


def extract_json_robust(text: str) -> dict:
    text = text.strip()
    try: return json.loads(text)
    except: pass
    text_clean = re.sub(r"```(?:json)?", "", text).strip().rstrip("`").strip()
    try: return json.loads(text_clean)
    except: pass
    match = re.search(r'\{[\s\S]*\}', text_clean)
    if match:
        try: return json.loads(match.group())
        except: pass
    return {"error": "JSON_PARSE_ERROR", "raw": text[:600]}


def get_ai_pairing(piatto: str, filtri: dict, catalogo: list) -> dict:
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        try: api_key = st.secrets.get("ANTHROPIC_API_KEY", "")
        except: pass
    if not api_key:
        return {"error": "API_KEY_MISSING"}

    catalogo_ai = json.dumps([
        {"id":v["id"],"nome":v["nome"],"tipo":v["tipo"],"regione":v["regione"],
         "fascia":v["fascia"],"prezzo":v["prezzo"],"uva":v["uva"],"alcol":v["alcol"],
         "acidita":v["acidita"],"tannini":v["tannini"],"corpo":v.get("corpo","medio"),
         "residuo_zuccherino":v["residuo_zuccherino"],
         "profilo_aromatico":v.get("profilo_aromatico",v.get("tag",[])),
         "abbina_bene_con":v.get("abbina_bene_con",[]),
         "non_abbina_con":v.get("non_abbina_con",[])}
        for v in catalogo
    ], ensure_ascii=False, indent=2)

    filtri_attivi = []
    if filtri.get("regione") and filtri["regione"] != "qualsiasi":
        filtri_attivi.append(f"Preferenza geografica: {filtri['regione']}")
    if filtri.get("continente") and filtri["continente"] != "qualsiasi":
        filtri_attivi.append(f"Continente: {filtri['continente']}")
    if filtri.get("fascia") and filtri["fascia"] != "qualsiasi":
        filtri_attivi.append(f"Fascia di prezzo: {filtri['fascia']}")
    if filtri.get("tipo") and filtri["tipo"] != "qualsiasi":
        filtri_attivi.append(f"Tipo vino: {filtri['tipo']}")
    if filtri.get("budget_min") and filtri.get("budget_max"):
        filtri_attivi.append(f"Range prezzo: {filtri['budget_min']}€ – {filtri['budget_max']}€")
    elif filtri.get("budget_max"):
        filtri_attivi.append(f"Budget max: {filtri['budget_max']}€")

    filtri_str = "\n".join(filtri_attivi) if filtri_attivi else "Nessun filtro"
    lang = st.session_state.get("lang", "it")
    lang_instruction = {"en": "Respond in English.", "es": "Responde en español.", "it": ""}.get(lang, "")

    user_message = f"""
PIATTO / DISH: "{piatto}"
{lang_instruction}

FILTRI:
{filtri_str}

CATALOGO VINI ({len(catalogo)} vini — analizza OGNUNO):
{catalogo_ai}

ISTRUZIONI: Scomponi molecolarmente il piatto → calcola score chimico per OGNI vino → includi tutti ≥55 (o top 3) → JSON puro.
"""

    try:
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            system=SYSTEM_PROMPT_DIVINO,
            messages=[{"role": "user", "content": user_message}]
        )
        return extract_json_robust(message.content[0].text)
    except Exception as e:
        return {"error": str(e)}


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

def render_wine_card(wine: dict, abb: dict, piatto: str, user_id: Optional[int], idx: int):
    score = abb.get("score", 0)
    molecole = abb.get("molecole_protagoniste", [])
    mol_pills = "".join([f'<span class="molecule-pill">{m}</span>' for m in molecole])
    avv = abb.get("avvertenza", "")
    avv_html = f'<p style="color:#9e3a3a;font-size:0.82em;margin-top:8px;padding:8px;background:#fff5f5;border-radius:6px">⚠️ {avv}</p>' if avv else ""
    foto = wine.get("foto", "")
    shop_url = f"{BASE_SHOP}/{wine.get('slug', wine['id'].lower())}"
    img_html = f'<img src="{foto}" class="wine-img" alt="{wine["nome"]}" onerror="this.style.display=\'none\'">' if foto else '<div class="wine-img-placeholder">🍷</div>'

    st.markdown(f"""
    <div class="wine-card">
        {img_html}
        <div class="wine-card-body">
            <h3>{score_emoji(score)} {wine['nome']}</h3>
            <p style="margin:4px 0 10px">
                <span class="badge badge-score">{T('match')} {score}/100</span>
                <span class="badge badge-price">{fascia_label(wine['fascia'])} — {wine['prezzo']:.2f}€</span>
                <span class="badge badge-type">{wine['tipo']}</span>
                <span class="badge badge-geo">{wine['regione']}</span>
                <span class="badge badge-match">{abb.get('principio','').upper()}</span>
            </p>
            <div style="margin:6px 0 14px">
                <div style="display:flex;align-items:center;gap:8px">
                    <span style="font-size:0.72em;color:#888;width:90px">{T('match')}</span>
                    <div class="score-bar" style="flex:1">
                        <div class="score-fill" style="width:{score}%;background:linear-gradient(90deg,#3d0a10,{score_color(score)})"></div>
                    </div>
                    <span style="font-size:0.82em;font-weight:700;color:{score_color(score)}">{score}%</span>
                </div>
            </div>
            <p style="font-size:0.84em;color:#444;margin:0 0 6px"><strong>{T('chemistry')}</strong><br>{abb.get('meccanismo_chimico','')}</p>
            <p style="font-size:0.84em;color:#333;margin:0 0 6px"><strong>{T('in_mouth')}</strong> {abb.get('sensazione_in_bocca','')}</p>
            <p style="font-size:0.84em;color:#5c1d24;margin:0 0 8px"><strong>{T('why_works')}</strong> {abb.get('perche_funziona','')}</p>
            <div class="molecule-row">{mol_pills if mol_pills else '<span style="color:#aaa;font-size:0.78em">—</span>'}</div>
            {avv_html}
            <p style="font-size:0.78em;color:#999;margin:8px 0 0">
                {T('grape')}: {wine['uva']} · {T('alcohol')}: {wine['alcol']}% · {T('acidity')}: {wine['acidita']} · {T('tannins')}: {wine['tannini']} · {T('body')}: {wine.get('corpo','—')}
            </p>
            <a href="{shop_url}" target="_blank" class="buy-btn">{T('buy', wine['prezzo'])}</a>
        </div>
    </div>
    """, unsafe_allow_html=True)

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
# SIDEBAR
# ─────────────────────────────────────────────
def render_sidebar():
    with st.sidebar:
        # Selezione lingua
        lang_opts = {"🇮🇹 Italiano": "it", "🇬🇧 English": "en", "🇪🇸 Español": "es"}
        current_lang = st.session_state.get("lang", "it")
        reverse_map = {v: k for k, v in lang_opts.items()}
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
        st.caption(T("sidebar_caption", len(WINE_CATALOG)))

        with st.expander(T("ai_explanation_title"), expanded=False):
            st.markdown(T("ai_explanation"))


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
def main():
    if "lang" not in st.session_state:
        st.session_state.lang = "it"

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

    # API KEY
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        try: api_key = st.secrets.get("ANTHROPIC_API_KEY", "")
        except: pass
    if not api_key:
        st.warning(f"""**{T('api_missing')}**
```
export ANTHROPIC_API_KEY="sk-ant-..."
streamlit run divino_v4.py
```
Or in `.streamlit/secrets.toml`: `ANTHROPIC_API_KEY = "sk-ant-..."`""")

    # TABS
    tab_pair, tab_cat = st.tabs([f"🍷 {T('pairing')}", f"📚 {T('catalog')}"])

    # ── ABBINAMENTO ──
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
                area = st.selectbox(T("area"), [T("any"), T("italy"), T("abroad")])
            with col2:
                if area == T("italy"):
                    reg_opts = [T("any"),"Lombardia","Piemonte","Toscana","Veneto","Campania",
                                "Sardegna","Sicilia","Friuli-Venezia Giulia","Umbria","Trentino-Alto Adige",
                                "Abruzzo","Basilicata","Marche","Calabria","Puglia"]
                elif area == T("abroad"):
                    reg_opts = [T("any"),"Francia","Spagna","Austria","Germania","California",
                                "Oregon","Argentina","Cile","Australia","Nuova Zelanda","Portogallo","Grecia"]
                else:
                    reg_opts = [T("any")]
                regione = st.selectbox(T("region"), reg_opts)
            with col3:
                fascia = st.selectbox(T("price_band"), T("bands_display"))
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
            tipo_map_it = {"Bianco":"Bianco","Rosso":"Rosso","Spumante":"Spumante","Rosato":"Rosato","Dolce":"Dolce",
                           "White":"Bianco","Red":"Rosso","Sparkling":"Spumante","Rosé":"Rosato","Sweet":"Dolce",
                           "Blanco":"Bianco","Tinto":"Rosso","Espumoso":"Spumante","Rosado":"Rosato","Dulce":"Dolce"}
            filtri = {
                "regione": regione if regione not in [T("any")] else "qualsiasi",
                "area": area if area not in [T("any")] else "qualsiasi",
                "fascia": fascia_map.get(fascia, "qualsiasi"),
                "tipo": tipo_map_it.get(tipo, "qualsiasi"),
                "budget_min": bmin if bmin > 0 else None,
                "budget_max": bmax if bmax > 0 else None,
            }

            cat = WINE_CATALOG.copy()
            if filtri["area"] == T("italy") or filtri["area"] == "Italia":
                cat = [w for w in cat if w["continente"] == "Italia"]
            elif filtri["area"] in [T("abroad"), "Estero"]:
                cat = [w for w in cat if w["continente"] != "Italia"]
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
                with st.spinner(T("analyzing", piatto, len(cat))):
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
                        c1,c2,c3,c4 = st.columns(4)
                        items = [(T("fats"),analisi.get("grassi","—")),
                                 (T("proteins"),analisi.get("proteine","—")),
                                 (T("acidity"),analisi.get("acidi","—")),
                                 (T("volatiles"), ", ".join(analisi.get("volatili_aromatici",[])[:3]) or "—")]
                        for col,(lbl,val) in zip([c1,c2,c3,c4],items):
                            with col: st.metric(lbl, val[:55] if len(str(val))>55 else val)
                        c5,c6,c7,c8 = st.columns(4)
                        with c5: st.metric(T("spice"), analisi.get("piccantezza","—"))
                        with c6: st.metric(T("umami"), analisi.get("umami","—"))
                        with c7: st.metric(T("sweetness"), analisi.get("tendenza_dolce","—"))
                        with c8: st.metric(T("complexity"), analisi.get("complessita","—"))
                        sfida = analisi.get("sfida_abbinamento","")
                        if sfida: st.info(f"{T('challenge')} {sfida}")
                        ingredienti = analisi.get("ingredienti_identificati", [])
                        if ingredienti:
                            st.markdown(f"{T('ingredients_found')} " + " · ".join([f"`{i}`" for i in ingredienti]))

                    if consiglio:
                        st.info(f"{T('divino_suggests')} {consiglio}")

                    n = len(abbinamenti)
                    suffix = "" if n == 1 else "i"
                    st.markdown(f"### ✨ {n} abbinament{'o' if n==1 else 'i'} per *{piatto}*")

                    for idx, abb in enumerate(abbinamenti):
                        wine = get_wine_by_id(abb.get("wine_id",""))
                        if wine:
                            render_wine_card(wine, abb, piatto, user_id, idx)
                        else:
                            st.caption(f"⚠️ ID '{abb.get('wine_id')}' non nel catalogo (score: {abb.get('score')})")

                    if not user_id:
                        st.info(T("register_cta"))

        elif cerca and not piatto:
            st.warning(T("write_dish"))

    # ── CATALOGO ──
    with tab_cat:
        st.markdown(f"### {T('catalog_title', len(WINE_CATALOG))}")

        col_f1,col_f2,col_f3,col_f4 = st.columns(4)
        with col_f1:
            ft = st.selectbox(T("wine_type"), T("types_cat"), key="ct")
        with col_f2:
            # Raggruppamento per continente
            cont_opts = [T("any"), "Italia", T("continent_europe"), T("continent_americas"), T("continent_oceania")]
            fc = st.selectbox("🌍 Continente", cont_opts, key="cc")
        with col_f3:
            regioni_uniche = sorted(set(w["regione"] for w in WINE_CATALOG))
            fr = st.selectbox(T("region"), [T("any")] + regioni_uniche, key="cr")
        with col_f4:
            ff = st.selectbox(T("price_band"), [T("fascia_all"),"economico","standard","premium","lusso"], key="cf")

        cv = WINE_CATALOG.copy()
        tipo_map_inv = {v:v for v in ["Bianco","Rosso","Spumante","Rosato","Dolce"]}
        tipo_map_inv.update({"White":"Bianco","Red":"Rosso","Sparkling":"Spumante","Rosé":"Rosato","Sweet":"Dolce",
                              "Blanco":"Bianco","Tinto":"Rosso","Espumoso":"Spumante","Rosado":"Rosato","Dulce":"Dolce",
                              T("types_cat")[1] if len(T("types_cat"))>1 else "Bianco":"Bianco"})
        if ft and ft not in [T("types_all"), "Tutti", "All", "Todos"]:
            ft_it = tipo_map_inv.get(ft, ft)
            cv = [w for w in cv if w["tipo"] == ft_it]
        if fc and fc != T("any"):
            if fc == "Italia": cv = [w for w in cv if w["continente"] == "Italia"]
            elif fc in [T("continent_europe")]: cv = [w for w in cv if w["continente"] == "Europa"]
            elif fc in [T("continent_americas")]: cv = [w for w in cv if w["continente"] == "Americhe"]
            elif fc in [T("continent_oceania")]: cv = [w for w in cv if w["continente"] == "Oceania"]
        if fr and fr != T("any"): cv = [w for w in cv if w["regione"] == fr]
        if ff and ff not in [T("fascia_all"),"Tutte","All","Todos"]: cv = [w for w in cv if w["fascia"] == ff]

        st.caption(T("showing_n", len(cv)))

        # Raggruppa per continente nel display
        def get_continente_label(c):
            return {"Italia": "🇮🇹 Italia", "Europa": T("continent_europe"),
                    "Americhe": T("continent_americas"), "Oceania": T("continent_oceania")}.get(c, c)

        continenti_presenti = list(dict.fromkeys(w["continente"] for w in cv))
        display_count = 0

        for cont in continenti_presenti:
            wines_cont = [w for w in cv if w["continente"] == cont]
            st.markdown(f'<div class="continent-header">{get_continente_label(cont)} · {len(wines_cont)} vini</div>', unsafe_allow_html=True)
            cols = st.columns(3)
            for i, w in enumerate(wines_cont[:30]):
                with cols[i % 3]:
                    foto = w.get("foto","")
                    img = f'<img src="{foto}" style="width:100%;height:160px;object-fit:cover;border-radius:8px 8px 0 0" onerror="this.style.display=\'none\'">' if foto else '<div style="height:80px;display:flex;align-items:center;justify-content:center;font-size:2em">🍷</div>'
                    tags = " ".join([f'<span class="molecule-pill">{t}</span>' for t in w.get("profilo_aromatico",w.get("tag",[]))[:2]])
                    shop_url = f"{BASE_SHOP}/{w.get('slug', w['id'].lower())}"
                    st.markdown(f"""
                    <div class="wine-card" style="min-height:auto">
                        {img}
                        <div class="wine-card-body">
                            <h3 style="font-size:0.92em">{w['nome']}</h3>
                            <p style="font-size:0.76em;color:#888;margin:2px 0">{w['regione']} · {w['tipo']} · {w['prezzo']:.2f}€</p>
                            <div class="molecule-row" style="padding:4px 6px;margin:6px 0">{tags}</div>
                            <a href="{shop_url}" target="_blank" class="buy-btn" style="font-size:0.78em;padding:7px">🛒 {T('buy', w['prezzo'])}</a>
                        </div>
                    </div>
                    """, unsafe_allow_html=True)
                display_count += 1
            if len(wines_cont) > 30:
                st.caption(T("showing", len(wines_cont)))


if __name__ == "__main__":
    main()
PYEOF_MARKER
echo "Scritto: $(wc -l < /home/claude/divino_v4.py) righe"
Output

Command argument is 125_181 bytes, exceeding the 100_000-byte per-argument limit. For large content, pipe via stdin or use a file-write API instead of embedding the content inline in the command. Argument preview: 'cat > /home/claude/divino_v4.py << \'PYEOF_MARKER\'\n"""\n╔══════════════════════════════════════════════════════════════════╗\n║         diVino — v4.0                                           ║\n║
