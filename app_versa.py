import streamlit as st
import anthropic
import functools
import sqlite3
import json
import hashlib
import os
import re
import base64
import urllib.parse
from datetime import datetime
from typing import Optional

st.set_page_config(
    page_title="Bwine — AI Wine Pairing",
    page_icon="🍷",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ─────────────────────────────────────────────
# TRADUZIONI
# ─────────────────────────────────────────────
LANG = {
    "it": {
        "hero_title": "Bwine",
        "hero_sub": "Il motore che abbina cibo e vino tramite la chimica molecolare dei tuoi piatti",
        "hero_tagline": "Perché il vino giusto è sempre… Bwine.",
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
        "divino_suggests": "🍷 **Bwine consiglia:**",
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
        "sidebar_caption": "Bwine v7.0 · Motore AI chimico",
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
        "bands": {"Economico (<15€)":"economico","Standard (15–30€)":"standard","Premium (30–65€)":"premium","Lusso (>65€)":"lusso"},
        "bands_display": ["Qualsiasi","Economico (<15€)","Standard (15–30€)","Premium (30–65€)","Lusso (>65€)"],
        "bands_labels": {"economico":"Economico <15€","standard":"Standard 15–30€","premium":"Premium 30–65€","lusso":"Lusso >65€"},
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
        "newsletter_sub": "Ogni settimana: 3 abbinamenti stagionali + offerte riservate ai membri Bwine.",
        "newsletter_btn": "Iscriviti gratis",
        "newsletter_placeholder": "La tua email",
        "newsletter_ok": "✅ Iscritto! Controlla la tua email.",
        "premium_title": "🏆 Bwine Premium",
        "premium_sub": "Abbinamenti illimitati, accesso ai vini rari, consulenza sommelier AI.",
        "premium_btn": "Scopri Premium — 4.90€/mese",
        "quiz_title": "🍾 Qual è il tuo vino ideale?",
        "quiz_sub": "3 domande per scoprire il tuo stile enologico",
        "quiz_btn": "Inizia il quiz",
    },
    "en": {
        "hero_title": "Bwine",
        "hero_sub": "AI-powered molecular chemistry wine pairing engine",
        "hero_tagline": "Because the right wine is always… Bwine.",
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
        "divino_suggests": "🍷 **Bwine recommends:**",
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
        "sidebar_caption": "Bwine v7.0 · AI Chemical Engine",
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
        "bands": {"Budget (<15€)":"economico","Standard (15–30€)":"standard","Premium (30–65€)":"premium","Luxury (>65€)":"lusso"},
        "bands_display": ["Any","Budget (<15€)","Standard (15–30€)","Premium (30–65€)","Luxury (>65€)"],
        "bands_labels": {"economico":"Budget <15€","standard":"Standard 15–30€","premium":"Premium 30–65€","lusso":"Luxury >65€"},
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
        "premium_title": "🏆 Bwine Premium",
        "premium_sub": "Unlimited pairings, rare wines, AI sommelier advice.",
        "premium_btn": "Discover Premium — €4.90/month",
        "quiz_title": "🍾 What's your ideal wine?",
        "quiz_sub": "3 questions to find your wine style",
        "quiz_btn": "Start the quiz",
    },
    "es": {
        "hero_title": "Bwine",
        "hero_sub": "Motor de maridaje basado en química molecular con IA",
        "hero_tagline": "Porque el vino correcto siempre es… Bwine.",
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
        "divino_suggests": "🍷 **Bwine recomienda:**",
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
        "sidebar_caption": "Bwine v7.0 · Motor AI Químico",
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
        "bands": {"Económico (<15€)":"economico","Estándar (15–30€)":"standard","Premium (30–65€)":"premium","Lujo (>65€)":"lusso"},
        "bands_display": ["Cualquiera","Económico (<15€)","Estándar (15–30€)","Premium (30–65€)","Lujo (>65€)"],
        "bands_labels": {"economico":"Económico <15€","standard":"Estándar 15–30€","premium":"Premium 30–65€","lusso":"Lujo >65€"},
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
        "premium_title": "🏆 Bwine Premium",
        "premium_sub": "Maridajes ilimitados, vinos raros, sommelier AI.",
        "premium_btn": "Descubre Premium — 4,90€/mes",
        "quiz_title": "🍾 ¿Cuál es tu vino ideal?",
        "quiz_sub": "3 preguntas para descubrir tu estilo",
        "quiz_btn": "Empezar el quiz",
    }
}

LANG["it"].update({'nav_home': '🍷 Home', 'nav_business': '🍽️ Per Locali', 'nav_pairing': '🍷 Abbinamento', 'nav_lab': '🧪 Wine Lab', 'nav_culinary': '👨\u200d🍳 Consigli Culinari', 'nav_catalog': '📚 Catalogo', 'nav_cart': '🛒 Carrello', 'nav_account': '👤 Account', 'who_title': '🚀 Prova Bwine gratis', 'who_label': "👤 Chi sei? Seleziona il tuo profilo per un'esperienza su misura", 'who_private': '🙋 Privato / Appassionato di vino', 'who_restaurant': '🍽️ Ristorante / Trattoria / Osteria', 'who_enoteca': '🍇 Enoteca / Wine bar', 'who_locale_serale': '🍸 Locale serale / Discoteca / Cocktail bar', 'who_hotel': '🏨 Hotel / Resort / B&B', 'who_beach': '🏖️ Beach club / Stabilimento balneare', 'who_gruppo': '🏛️ Catena / Gruppo di locali', 'who_priv_desc': 'Trova il vino perfetto per ogni piatto che cucini o ordini, e acquistalo subito su bwine.shop.', 'who_priv_caption': 'Gratis per iniziare, nessuna carta richiesta.', 'who_priv_cta': '✅ Inizia gratis come privato', 'who_priv_hint': '👇 Usa il pannello **Account** per accedere o registrarti.', 'who_biz_desc_restaurant': "Il tool di abbinamento per il tuo staff in sala: dal cameriere al sommelier, tutti trovano in 5 secondi l'abbinamento giusto per ogni piatto in carta.", 'who_biz_desc_enoteca': 'Guida i tuoi clienti nella scelta tra centinaia di etichette, genera carte dei vini filtrate per fascia di prezzo e usa Bwine come strumento di vendita assistita.', 'who_biz_desc_serale': 'Una wine & bollicine list pensata per il servizio serale: bollicine e vini da aperitivo e dopocena, liste per il tavolo VIP e bottle service, suggerimenti rapidi anche per lo staff bar.', 'who_biz_desc_hotel': "Carta dei vini per il ristorante interno, il room service e il bar dell'hotel, con abbinamenti per la colazione, i pranzi leggeri e le cene gourmet.", 'who_biz_desc_beach': 'Bollicine, rosati e bianchi freschi abbinati ai piatti estivi del tuo menu, con una carta snella pensata per il servizio veloce in spiaggia.', 'who_biz_desc_gruppo': "Un'unica piattaforma multi-sede per uniformare abbinamenti, carte dei vini e formazione dello staff su tutti i tuoi locali.", 'who_biz_desc_default': 'Il tool di abbinamento AI per il tuo locale.', 'who_biz_trial': '🎁 **14 giorni di prova gratuita** — nessuna carta di credito richiesta.', 'who_biz_cta': '✅ Prova gratis per il mio locale', 'who_biz_hint': "👇 Vai al tab **'🍽️ Per Locali'** qui sotto per completare la richiesta di prova gratuita.", 'api_key_hint': 'Imposta `ANTHROPIC_API_KEY` nei Secrets di Streamlit.', 'quick_mode': '⚡ Modalità Rapida gratuita (regole classiche, senza AI — meno precisa ma a costo zero)', 'quick_mode_help': "Utile per test, demo o per ridurre le chiamate a pagamento all'API. Per l'analisi molecolare completa lascia questa opzione disattivata.", 'continent_select': '🌍 Continente / Area', 'region_it': '🗺️ Regione italiana', 'region_eu': '🗺️ Paese europeo', 'region_country': '🗺️ Paese', 'region_state': '🗺️ Stato / Regione', 'biz_title': '## 🍽️ Bwine per il tuo locale', 'biz_intro': 'Il motore di abbinamento AI che il tuo staff può usare in sala, al bancone o in consolle, e che aiuta i clienti a scegliere il vino o le bollicine giuste in pochi secondi — dalla carta dei vini alla formazione del personale, fino a un widget da inserire nel tuo sito o un QR code al tavolo. Pensato per ristoranti ed enoteche, ma anche per hotel, beach club e locali serali come discoteche, cocktail bar e lounge.', 'biz_trial_banner': '🎁 **14 giorni di prova gratuita** per il tuo locale — nessuna carta di credito richiesta.', 'biz_why_title': '### 💡 Perché conviene, qualunque sia il tuo locale', 'biz_c1_t': '**🧑\u200d🍳 Vendita assistita in sala**', 'biz_c1_d': 'Ristoranti ed enoteche: il cameriere digita il piatto ordinato e ottiene in 5 secondi 2-3 abbinamenti motivati, anche se non è un sommelier.', 'biz_c2_t': '**📋 Carta dei vini "viva"**', 'biz_c2_d': 'Genera e stampa liste filtrate per fascia di prezzo o regione, utili per aggiornare la carta o creare menu degustazione stagionali.', 'biz_c3_t': '**🍸 Discoteche & locali serali**', 'biz_c3_d': "Wine list e bollicine per il servizio serale, liste per il tavolo VIP e bottle service, suggerimenti rapidi per lo staff bar durante l'aperitivo o il dopocena.", 'biz_c4_t': '**🎓 Formazione dello staff**', 'biz_c4_d': 'Nuovi camerieri, barman e sommelier junior imparano la logica degli abbinamenti usando il motore come strumento di studio quotidiano.', 'biz_plans_title': '### 📦 Piani per i locali', 'biz_plans_caption': 'Importi indicativi, punto di partenza: vanno tarati sui tuoi costi reali di API e sul valore percepito dal locale.', 'biz_p1_t': '#### 🥂 Base', 'biz_p1_price': '**~49€/mese**', 'biz_p1_d': '1 postazione (tablet/PC in sala) · Catalogo standard Bwine · Abbinamenti illimitati', 'biz_p2_t': '#### 🍾 Locale', 'biz_p2_price': '**~129€/mese**', 'biz_p2_d': 'Fino a 4 postazioni · Carta dei vini personalizzata (i tuoi vini in carta) · QR code al tavolo', 'biz_p3_t': '#### 🍸 Serale / VIP', 'biz_p3_price': '**~149€/mese**', 'biz_p3_d': 'Pensato per discoteche e cocktail bar · Liste bottle service e tavoli VIP · Supporto fino a tarda notte', 'biz_p4_t': '#### 🏛️ Catena / Gruppo', 'biz_p4_price': '**Su misura**', 'biz_p4_d': 'Più locali, multi-sede · Integrazione con il tuo sito o PMS · Account manager dedicato', 'biz_form_title': '### ✍️ Richiedi una demo gratuita per il tuo locale', 'biz_f_nome': 'Nome del locale *', 'biz_f_referente': 'Nome e cognome del referente *', 'biz_f_email': 'Email *', 'biz_f_tel': 'Telefono', 'biz_f_citta': 'Città', 'biz_f_tipo': 'Tipo di locale', 'biz_f_coperti': 'Coperti / dimensione', 'biz_f_piano': 'Piano di interesse', 'biz_f_note': 'Note (facoltativo)', 'biz_f_note_ph': 'Es: vorremmo integrarlo con la nostra carta dei vini già esistente...', 'biz_f_submit': '📨 Richiedi demo gratuita', 'biz_tipo_opts': ['Ristorante', 'Trattoria/Osteria', 'Enoteca', 'Wine bar', 'Locale serale / Discoteca', 'Cocktail bar / Lounge', 'Hotel/Resort', 'B&B', 'Beach club', 'Catena/Gruppo', 'Altro'], 'biz_coperti_opts': ['< 30', '30–80', '80–150', '> 150', 'Multi-sede'], 'biz_piano_opts': ['Base', 'Locale', 'Catena / Gruppo', 'Non so ancora'], 'biz_success': '✅ Richiesta inviata! Ti contatteremo a breve per organizzare una demo.', 'biz_warn': 'Compila almeno Nome locale, Referente ed Email valida.', 'biz_leads_caption': '📊 {} locali hanno già richiesto informazioni su Bwine.', 'biz_print_expander': '🖨️ Genera una carta dei vini stampabile (demo)', 'biz_print_caption': 'Filtra il catalogo e genera una lista pronta da stampare o mostrare su tablet in sala.', 'biz_print_continent': 'Continente', 'biz_print_type': 'Tipo', 'biz_print_band': 'Fascia', 'biz_print_count': '**{} vini selezionati**', 'biz_print_preview': 'Anteprima carta (copia/incolla o esporta)', 'biz_print_download': '⬇️ Scarica come .txt', 'opt_all_m': 'Tutti', 'opt_all_f': 'Tutte', 'lab_title': '## 🧪 Wine Lab — il laboratorio del gusto', 'lab_intro': "Prendi l'ultimo piatto cercato (o scrivine uno nuovo), modificalo con gli slider qui sotto e guarda **come cambia l'abbinamento** — stessa analisi molecolare del motore Bwine, applicata alla variante del piatto. Utile anche per un ristorante che vuole testare una variazione di ricetta prima di metterla in carta.", 'lab_dish_label': '🍽️ Piatto di partenza', 'lab_dish_ph': 'Es: risotto ai funghi porcini', 'lab_modify_title': '#### 🎛️ Modifica il piatto', 'lab_acid': '🍋 Acidità (es. succo di limone, aceto)', 'lab_acid_help': '-2 = meno acido, 0 = invariato, +2 = molto più acido', 'lab_fat': '🧈 Grassi (es. burro, panna, olio)', 'lab_fat_help': '-2 = più leggero, 0 = invariato, +2 = molto più grasso', 'lab_spice': '🌶️ Piccantezza aggiunta', 'lab_spice_help': '0 = nessuna, +2 = molto piccante (peperoncino abbondante)', 'lab_cook': '🔥 Cottura / rosolatura (Maillard)', 'lab_cook_help': '-1 = cottura più breve, +2 = molto rosolato/caramellizzato', 'lab_preview': '🔬 Piatto che verrà analizzato: *{}*', 'lab_slider_hint': 'Sposta almeno uno slider per creare una variante del piatto da analizzare.', 'lab_freeform_title': '#### ✍️ Oppure scrivi tu la modifica', 'lab_freeform_caption': "Pensato per lo staff di cucina: descrivi a parole libere come vuoi modificare la ricetta (es. \"tolgo il burro e uso olio EVO, aggiungo scorza di limone\") e l'AI la considera insieme (o al posto) degli slider qui sopra. Molto utile per un locale che vuole testare una variante prima di metterla in carta.", 'lab_freeform_label': 'Modifica libera del piatto', 'lab_freeform_ph': 'Es: versione più leggera senza panna, con brodo vegetale al posto del burro e una spolverata di pepe nero...', 'lab_run_btn': '🔬 Ricalcola abbinamenti con questa variante', 'lab_spinner': '🧪 Analisi molecolare della variante in corso…', 'lab_error': 'Errore AI: {}', 'lab_results_title': '### ✨ Abbinamenti per la variante di *{}*', 'lab_changes': 'Modifiche applicate: {}', 'lab_no_original': "💡 Fai prima una ricerca nel tab '🍷 Abbinamento' con il piatto originale per vedere anche il confronto prima/dopo.", 'lab_start_hint': '✏️ Scrivi un piatto (o fai prima una ricerca nel tab Abbinamento) per iniziare a sperimentare.', 'cul_title': '## 👨\u200d🍳 Consigli Culinari', 'cul_intro': 'Hai già scelto (o hai in cantina) un vino e vuoi sapere **come abbinarlo o cucinare** un piatto o un ingrediente specifico? Scrivi la domanda qui sotto: il motore Bwine ti risponde con consigli pratici, partendo dalla chimica di quel vino.', 'cul_example': 'Esempio: *"Voglio fare un risotto con il Bonarda, come abbino i funghi?"*', 'cul_wine_label': '🍷 Vino di partenza', 'cul_question_label': '❓ La tua domanda', 'cul_question_ph': 'Es: come abbino i funghi in un risotto fatto con questo vino?', 'cul_ask_btn': '🤖 Chiedi al sommelier Bwine', 'cul_warn_q': 'Scrivi una domanda per ricevere un consiglio.', 'cul_warn_w': 'Seleziona un vino valido.', 'cul_spinner': '👨\u200d🍳 Sto pensando al miglior consiglio…', 'cul_error': 'Errore AI: {}', 'cul_answer_prefix': '🍷 **{}** · risposta su misura per questo vino', 'cul_addcart': '🛒 Aggiungi {} al carrello', 'cul_open_product': 'Apri la scheda prodotto', 'cart_step1_t': '**1️⃣ Trova il vino**', 'cart_step1_d': 'Nel tab 🍷 Abbinamento (per piatto) o 📚 Catalogo (sfoglia tutto).', 'cart_step2_t': '**2️⃣ Aggiungi al carrello**', 'cart_step2_d': "Un click sul bottone '🛒 Acquista' sotto ogni vino.", 'cart_step3_t': '**3️⃣ Paga qui e ricevi a casa**', 'cart_step3_d': 'Dati di spedizione + pagamento, in questa pagina.', 'cart_trust': '🔒 Pagamento sicuro (Stripe) · 🚚 Spedizione 24/48h, gratuita oltre 60€ · ↩️ Reso gratuito entro 30 giorni', 'cart_empty': 'Il carrello è vuoto. Aggiungi qualche vino dal catalogo o dagli abbinamenti qui sopra 🍷', 'cart_qty': 'Q.tà', 'cart_subtotal': 'Subtotale: {:.2f}€', 'cart_free': 'Gratuita 🎉', 'cart_shipping': 'Spedizione: {} (gratis oltre 60€)', 'cart_total': '### Totale: {:.2f}€', 'cart_ship_title': '### 📦 Dati di spedizione e pagamento', 'cart_demo_caption': '🔒 Ambiente demo — nessun addebito reale se non è configurata una chiave Stripe di test.', 'cart_f_name': 'Nome e cognome *', 'cart_f_email': 'Email *', 'cart_f_address': 'Indirizzo *', 'cart_f_city': 'Città *', 'cart_f_zip': 'CAP *', 'cart_f_method': 'Metodo di pagamento', 'cart_method_opts': ['💳 Carta (Stripe)', '🅿️ PayPal (demo)', '🏦 Bonifico (demo)'], 'cart_age_confirm': 'Confermo di avere più di 18 anni (vendita di alcolici)', 'cart_pay_btn': '🔒 Paga {:.2f}€', 'cart_warn_fields': 'Compila tutti i campi obbligatori con una email valida.', 'cart_warn_age': 'Devi confermare di avere più di 18 anni per acquistare alcolici.', 'cart_stripe_created': '✅ Sessione di pagamento Stripe (TEST) creata — ordine `{}`.', 'cart_stripe_go': '➡️ Vai al pagamento sicuro Stripe', 'cart_sim_ok': '🎉 Pagamento simulato completato! Ordine **{}** confermato — totale **{:.2f}€**. Riceverai (in un negozio reale) una email di conferma a {}.', 'quiz_expander': '🍾 Quiz del tuo vino ideale', 'quiz_q1': 'Preferisci vini:', 'quiz_q1_opts': ['Rossi corposi 🍷', 'Bianchi freschi 🥂', 'Bollicine 🫧', 'Dolci 🍯'], 'quiz_q2': 'Cucini spesso:', 'quiz_q2_opts': ['Carne & selvaggina 🥩', 'Pesce & frutti di mare 🐟', 'Pasta & pizza 🍕', 'Cucina etnica 🌏'], 'quiz_q3': 'Budget per bottiglia:', 'quiz_q3_opts': ['<15€', '15–35€', '35–80€', '>80€'], 'quiz_discover': 'Scopri il tuo vino! 🍷', 'quiz_result': '🍷 Il tuo vino ideale: **{}**', 'quiz_hint': 'Cerca questo vino nel tab Abbinamento o sfoglialo nel Catalogo!', 'quiz_close': '✕ Chiudi quiz', 'lvl_high': 'Alto', 'lvl_medium': 'Medio', 'lvl_low': 'Basso', 'lbl_acidity': 'Acidità', 'lbl_tannins': 'Tannini', 'lbl_body': 'Corpo', 'lbl_sweetness': 'Dolcezza', 'irc_chimica': '🧪 Chimica', 'irc_aromatico': '🌸 Aromatico', 'irc_struttura': '⚖️ Struttura', 'irc_pulizia': '✨ Pulizia', 'irc_breakdown': '🎯 Scomposizione IRC', 'irc_caption': 'IRC = Indice di Reattività Chimica Bwine, il punteggio proprietario del motore molecolare', 'calibrated_tip': 'Punteggio corretto in base a {} valutazioni reali degli utenti', 'chem_in_mouth': '🧪 Chimica in bocca:', 'culinary_tips': '👨\u200d🍳 Consigli culinari:', 'molecule_hint': '💡 Passa il mouse sulle pillole rosse per scoprire cosa sono le molecole protagoniste', 'open_product': 'Apri la scheda prodotto su bwine.shop', 'buy_trust': '🔒 Pagamento sicuro · 🚚 Spedito in 24/48h · ↩️ Reso gratuito 30gg — clicca per aggiungere al carrello, paghi solo nel tab 🛒 Carrello.', 'added_to_cart': '🛒 {} aggiunto al carrello — vai al tab Carrello per pagare!', 'account_title': '## 👤 Il tuo account', 'account_not_logged': 'Accedi o registrati per salvare le tue ricerche, valutare i vini e velocizzare il checkout.', 'account_login_tab': 'Accedi', 'account_register_tab': 'Registrati', 'account_reg_name': 'Nome e cognome *', 'account_reg_email': 'Email *', 'account_reg_pwd': 'Password *', 'account_reg_phone': 'Telefono', 'account_reg_address': 'Indirizzo (per checkout più veloce)', 'account_reg_city': 'Città', 'account_reg_zip': 'CAP', 'account_reg_submit': 'Crea account', 'account_profile_saved': '✅ Profilo aggiornato.', 'account_your_orders': '📦 I tuoi ordini', 'account_no_orders': 'Nessun ordine ancora effettuato.', 'account_edit_profile': '✏️ Modifica profilo', 'account_save_profile': '💾 Salva profilo', 'dish_profile_title': '**🔬 Profilo del piatto**', 'no_match_warning': "⚠️ **Il piatto '{}' non si abbina con nessun vino** nel catalogo filtrato. Il tonno alla diavola, ad esempio, si abbina a vini bianchi secchi ad alta acidità (Verdicchio, Etna Bianco, Assyrtiko) o rossi leggeri (Nerello Mascalese). Prova ad allargare i filtri.", 'n_pairings_title': '### ✨ {} abbinamenti per *{}*', 'n_pairing_title_single': '### ✨ 1 abbinamento per *{}*', 'wine_not_in_catalog': 'ℹ️ Il vino `{}` suggerito dall\'AI non è presente nel catalogo corrente. Prova senza filtri per vedere tutti i vini compatibili.', 'stripe_no_key_msg': 'Nessuna chiave Stripe di test configurata: verrà usato il pagamento simulato.'})
LANG["en"].update({'nav_home': '🍷 Home', 'nav_business': '🍽️ For Venues', 'nav_pairing': '🍷 Pairing', 'nav_lab': '🧪 Wine Lab', 'nav_culinary': '👨\u200d🍳 Culinary Advice', 'nav_catalog': '📚 Catalog', 'nav_cart': '🛒 Cart', 'nav_account': '👤 Account', 'who_title': '🚀 Try Bwine for free', 'who_label': '👤 Who are you? Pick your profile for a tailored experience', 'who_private': '🙋 Individual / Wine enthusiast', 'who_restaurant': '🍽️ Restaurant / Trattoria', 'who_enoteca': '🍇 Wine shop / Wine bar', 'who_locale_serale': '🍸 Nightlife venue / Cocktail bar', 'who_hotel': '🏨 Hotel / Resort / B&B', 'who_beach': '🏖️ Beach club', 'who_gruppo': '🏛️ Chain / Venue group', 'who_priv_desc': 'Find the perfect wine for every dish you cook or order, and buy it right away on bwine.shop.', 'who_priv_caption': 'Free to start, no card required.', 'who_priv_cta': '✅ Start free as an individual', 'who_priv_hint': '👇 Use the **Account** panel to log in or sign up.', 'who_biz_desc_restaurant': 'The pairing tool for your floor staff: from waiter to sommelier, everyone finds the right pairing for any dish on the menu in 5 seconds.', 'who_biz_desc_enoteca': 'Guide your customers through hundreds of labels, generate wine lists filtered by price band, and use Bwine as an assisted-selling tool.', 'who_biz_desc_serale': 'A wine & bubbles list built for the evening service: aperitivo and late-night wines, VIP table and bottle-service lists, quick suggestions for bar staff too.', 'who_biz_desc_hotel': 'A wine list for your in-house restaurant, room service and hotel bar, with pairings for breakfast, light lunches and gourmet dinners.', 'who_biz_desc_beach': 'Sparkling, rosé and fresh whites paired with your summer menu, in a lean list built for fast beachside service.', 'who_biz_desc_gruppo': 'One multi-venue platform to standardize pairings, wine lists and staff training across all your locations.', 'who_biz_desc_default': 'The AI pairing tool for your venue.', 'who_biz_trial': '🎁 **14-day free trial** for your venue — no credit card required.', 'who_biz_cta': '✅ Try it free for my venue', 'who_biz_hint': "👇 Go to the **'🍽️ For Venues'** tab below to complete your free trial request.", 'api_key_hint': 'Set `ANTHROPIC_API_KEY` in Streamlit Secrets.', 'quick_mode': '⚡ Free Quick Mode (classic rules, no AI — less precise but zero cost)', 'quick_mode_help': 'Useful for tests, demos, or to cut paid API calls. Leave this off for the full molecular analysis.', 'continent_select': '🌍 Continent / Area', 'region_it': '🗺️ Italian region', 'region_eu': '🗺️ European country', 'region_country': '🗺️ Country', 'region_state': '🗺️ State / Region', 'biz_title': '## 🍽️ Bwine for your venue', 'biz_intro': 'The AI pairing engine your staff can use on the floor, at the bar or at the pass, helping guests choose the right wine or bubbles in seconds — from the wine list to staff training, up to a widget for your website or a QR code on the table. Built for restaurants and wine bars, but also hotels, beach clubs and nightlife venues like clubs, cocktail bars and lounges.', 'biz_trial_banner': '🎁 **14-day free trial** for your venue — no credit card required.', 'biz_why_title': '### 💡 Why it pays off, whatever your venue', 'biz_c1_t': '**🧑\u200d🍳 Assisted floor selling**', 'biz_c1_d': 'Restaurants and wine bars: the waiter types the ordered dish and gets 2-3 well-reasoned pairings in 5 seconds, even without sommelier training.', 'biz_c2_t': '**📋 A "living" wine list**', 'biz_c2_d': 'Generate and print lists filtered by price band or region — handy for updating the list or building seasonal tasting menus.', 'biz_c3_t': '**🍸 Clubs & nightlife venues**', 'biz_c3_d': 'Wine & bubbles lists for the evening service, VIP table and bottle-service lists, quick suggestions for bar staff during aperitivo or late night.', 'biz_c4_t': '**🎓 Staff training**', 'biz_c4_d': 'New waiters, bartenders and junior sommeliers learn pairing logic using the engine as a daily study tool.', 'biz_plans_title': '### 📦 Plans for venues', 'biz_plans_caption': 'Indicative amounts, a starting point — to be tuned to your real API costs and the value perceived by the venue.', 'biz_p1_t': '#### 🥂 Base', 'biz_p1_price': '**~€49/month**', 'biz_p1_d': '1 station (tablet/PC on the floor) · Standard Bwine catalog · Unlimited pairings', 'biz_p2_t': '#### 🍾 Venue', 'biz_p2_price': '**~€129/month**', 'biz_p2_d': 'Up to 4 stations · Custom wine list (your own wines) · QR code on the table', 'biz_p3_t': '#### 🍸 Nightlife / VIP', 'biz_p3_price': '**~€149/month**', 'biz_p3_d': 'Built for clubs and cocktail bars · Bottle-service and VIP table lists · Support until late night', 'biz_p4_t': '#### 🏛️ Chain / Group', 'biz_p4_price': '**Custom**', 'biz_p4_d': 'Multiple venues, multi-site · Integration with your website or PMS · Dedicated account manager', 'biz_form_title': '### ✍️ Request a free demo for your venue', 'biz_f_nome': 'Venue name *', 'biz_f_referente': "Contact person's full name *", 'biz_f_email': 'Email *', 'biz_f_tel': 'Phone', 'biz_f_citta': 'City', 'biz_f_tipo': 'Venue type', 'biz_f_coperti': 'Seats / size', 'biz_f_piano': 'Plan of interest', 'biz_f_note': 'Notes (optional)', 'biz_f_note_ph': "E.g.: we'd like to integrate it with our existing wine list...", 'biz_f_submit': '📨 Request free demo', 'biz_tipo_opts': ['Restaurant', 'Trattoria/Osteria', 'Wine shop', 'Wine bar', 'Nightlife venue / Club', 'Cocktail bar / Lounge', 'Hotel/Resort', 'B&B', 'Beach club', 'Chain/Group', 'Other'], 'biz_coperti_opts': ['< 30', '30–80', '80–150', '> 150', 'Multi-site'], 'biz_piano_opts': ['Base', 'Venue', 'Chain / Group', 'Not sure yet'], 'biz_success': "✅ Request sent! We'll contact you soon to set up a demo.", 'biz_warn': 'Please fill in at least Venue name, Contact person and a valid Email.', 'biz_leads_caption': '📊 {} venues have already requested information about Bwine.', 'biz_print_expander': '🖨️ Generate a printable wine list (demo)', 'biz_print_caption': 'Filter the catalog and generate a list ready to print or show on a tablet on the floor.', 'biz_print_continent': 'Continent', 'biz_print_type': 'Type', 'biz_print_band': 'Price band', 'biz_print_count': '**{} wines selected**', 'biz_print_preview': 'List preview (copy/paste or export)', 'biz_print_download': '⬇️ Download as .txt', 'opt_all_m': 'All', 'opt_all_f': 'All', 'lab_title': '## 🧪 Wine Lab — the taste laboratory', 'lab_intro': 'Take the last dish you searched for (or write a new one), tweak it with the sliders below and see **how the pairing changes** — the same molecular analysis as the Bwine engine, applied to the dish variant. Also handy for a restaurant testing a recipe tweak before adding it to the menu.', 'lab_dish_label': '🍽️ Starting dish', 'lab_dish_ph': 'E.g.: porcini mushroom risotto', 'lab_modify_title': '#### 🎛️ Modify the dish', 'lab_acid': '🍋 Acidity (e.g. lemon juice, vinegar)', 'lab_acid_help': '-2 = less acidic, 0 = unchanged, +2 = much more acidic', 'lab_fat': '🧈 Fat (e.g. butter, cream, oil)', 'lab_fat_help': '-2 = lighter, 0 = unchanged, +2 = much richer', 'lab_spice': '🌶️ Added spiciness', 'lab_spice_help': '0 = none, +2 = very spicy (plenty of chili)', 'lab_cook': '🔥 Cooking / searing (Maillard)', 'lab_cook_help': '-1 = shorter cooking, +2 = heavily seared/caramelized', 'lab_preview': '🔬 Dish that will be analyzed: *{}*', 'lab_slider_hint': 'Move at least one slider to create a dish variant to analyze.', 'lab_run_btn': '🔬 Recalculate pairings for this variant', 'lab_spinner': '🧪 Molecular analysis of the variant in progress…', 'lab_error': 'AI error: {}', 'lab_results_title': '### ✨ Pairings for the *{}* variant', 'lab_changes': 'Changes applied: {}', 'lab_no_original': "💡 Run a search first in the '🍷 Pairing' tab with the original dish to also see the before/after comparison.", 'lab_start_hint': '✏️ Write a dish (or search first in the Pairing tab) to start experimenting.', 'cul_title': '## 👨\u200d🍳 Culinary Advice', 'cul_intro': "Already picked (or have in your cellar) a wine and want to know **how to pair it or cook** a specific dish or ingredient? Write your question below: the Bwine engine answers with practical advice, starting from that wine's chemistry.", 'cul_example': 'Example: *"I want to make a risotto with Bonarda, how do I pair mushrooms?"*', 'cul_wine_label': '🍷 Starting wine', 'cul_question_label': '❓ Your question', 'cul_question_ph': 'E.g.: how do I pair mushrooms in a risotto made with this wine?', 'cul_ask_btn': '🤖 Ask the Bwine sommelier', 'cul_warn_q': 'Write a question to get advice.', 'cul_warn_w': 'Select a valid wine.', 'cul_spinner': '👨\u200d🍳 Thinking of the best advice…', 'cul_error': 'AI error: {}', 'cul_answer_prefix': '🍷 **{}** · answer tailored to this wine', 'cul_addcart': '🛒 Add {} to cart', 'cul_open_product': 'Open product page', 'cart_step1_t': '**1️⃣ Find the wine**', 'cart_step1_d': 'In the 🍷 Pairing tab (by dish) or 📚 Catalog (browse everything).', 'cart_step2_t': '**2️⃣ Add to cart**', 'cart_step2_d': "One click on the '🛒 Buy' button under each wine.", 'cart_step3_t': '**3️⃣ Pay here and get it delivered**', 'cart_step3_d': 'Shipping and payment details, right on this page.', 'cart_trust': '🔒 Secure payment (Stripe) · 🚚 24/48h shipping, free above €60 · ↩️ Free returns within 30 days', 'cart_empty': 'Your cart is empty. Add some wine from the catalog or the pairings above 🍷', 'cart_qty': 'Qty', 'cart_subtotal': 'Subtotal: {:.2f}€', 'cart_free': 'Free 🎉', 'cart_shipping': 'Shipping: {} (free above €60)', 'cart_total': '### Total: {:.2f}€', 'cart_ship_title': '### 📦 Shipping and payment details', 'cart_demo_caption': '🔒 Demo environment — no real charge unless a Stripe test key is configured.', 'cart_f_name': 'Full name *', 'cart_f_email': 'Email *', 'cart_f_address': 'Address *', 'cart_f_city': 'City *', 'cart_f_zip': 'ZIP code *', 'cart_f_method': 'Payment method', 'cart_method_opts': ['💳 Card (Stripe)', '🅿️ PayPal (demo)', '🏦 Bank transfer (demo)'], 'cart_age_confirm': 'I confirm I am over 18 (alcohol sale)', 'cart_pay_btn': '🔒 Pay {:.2f}€', 'cart_warn_fields': 'Please fill in all required fields with a valid email.', 'cart_warn_age': 'You must confirm you are over 18 to buy alcohol.', 'cart_stripe_created': '✅ Stripe (TEST) payment session created — order `{}`.', 'cart_stripe_go': '➡️ Go to secure Stripe payment', 'cart_sim_ok': "🎉 Simulated payment completed! Order **{}** confirmed — total **{:.2f}€**. In a real shop you'd receive a confirmation email at {}.", 'quiz_expander': '🍾 Your ideal wine quiz', 'quiz_q1': 'You prefer wines that are:', 'quiz_q1_opts': ['Full-bodied reds 🍷', 'Crisp whites 🥂', 'Sparkling 🫧', 'Sweet 🍯'], 'quiz_q2': 'You often cook:', 'quiz_q2_opts': ['Meat & game 🥩', 'Fish & seafood 🐟', 'Pasta & pizza 🍕', 'World cuisine 🌏'], 'quiz_q3': 'Budget per bottle:', 'quiz_q3_opts': ['<€15', '€15–35', '€35–80', '>€80'], 'quiz_discover': 'Discover your wine! 🍷', 'quiz_result': '🍷 Your ideal wine: **{}**', 'quiz_hint': 'Search for this wine in the Pairing tab or browse it in the Catalog!', 'quiz_close': '✕ Close quiz', 'lvl_high': 'High', 'lvl_medium': 'Medium', 'lvl_low': 'Low', 'lbl_acidity': 'Acidity', 'lbl_tannins': 'Tannins', 'lbl_body': 'Body', 'lbl_sweetness': 'Sweetness', 'irc_chimica': '🧪 Chemistry', 'irc_aromatico': '🌸 Aromatic', 'irc_struttura': '⚖️ Structure', 'irc_pulizia': '✨ Cleanliness', 'irc_breakdown': '🎯 IRC breakdown', 'irc_caption': "IRC = Bwine Chemical Reactivity Index, the engine's proprietary molecular score", 'calibrated_tip': 'Score adjusted based on {} real user ratings', 'chem_in_mouth': '🧪 Chemistry on the palate:', 'culinary_tips': '👨\u200d🍳 Culinary tips:', 'molecule_hint': '💡 Hover over the red pills to find out what the key molecules are', 'open_product': 'Open product page on bwine.shop', 'buy_trust': '🔒 Secure payment · 🚚 Shipped in 24/48h · ↩️ Free returns 30 days — click to add to cart, you only pay in the 🛒 Cart tab.', 'added_to_cart': '🛒 {} added to cart — go to the Cart tab to pay!', 'account_title': '## 👤 Your account', 'account_not_logged': 'Log in or sign up to save your searches, rate wines and speed up checkout.', 'account_login_tab': 'Log in', 'account_register_tab': 'Sign up', 'account_reg_name': 'Full name *', 'account_reg_email': 'Email *', 'account_reg_pwd': 'Password *', 'account_reg_phone': 'Phone', 'account_reg_address': 'Address (for faster checkout)', 'account_reg_city': 'City', 'account_reg_zip': 'ZIP code', 'account_reg_submit': 'Create account', 'account_profile_saved': '✅ Profile updated.', 'account_your_orders': '📦 Your orders', 'account_no_orders': 'No orders yet.', 'account_edit_profile': '✏️ Edit profile', 'account_save_profile': '💾 Save profile', 'dish_profile_title': '**🔬 Dish profile**', 'no_match_warning': "⚠️ **No wine in the filtered catalog matches '{}'.** Spicy tuna, for example, pairs with dry high-acid whites (Verdicchio, Etna Bianco, Assyrtiko) or light reds (Nerello Mascalese). Try widening the filters.", 'n_pairings_title': '### ✨ {} pairings for *{}*', 'n_pairing_title_single': '### ✨ 1 pairing for *{}*', 'wine_not_in_catalog': 'ℹ️ The wine `{}` suggested by the AI is not in the current catalog. Try without filters to see all compatible wines.', 'stripe_no_key_msg': 'No Stripe test key configured: simulated payment will be used.'})
LANG["es"].update({'nav_home': '🍷 Inicio', 'nav_business': '🍽️ Para Locales', 'nav_pairing': '🍷 Maridaje', 'nav_lab': '🧪 Wine Lab', 'nav_culinary': '👨\u200d🍳 Consejos Culinarios', 'nav_catalog': '📚 Catálogo', 'nav_cart': '🛒 Carrito', 'nav_account': '👤 Cuenta', 'who_title': '🚀 Prueba Bwine gratis', 'who_label': '👤 ¿Quién eres? Elige tu perfil para una experiencia a medida', 'who_private': '🙋 Particular / Aficionado al vino', 'who_restaurant': '🍽️ Restaurante / Trattoria', 'who_enoteca': '🍇 Vinoteca / Wine bar', 'who_locale_serale': '🍸 Local nocturno / Coctelería', 'who_hotel': '🏨 Hotel / Resort / B&B', 'who_beach': '🏖️ Beach club', 'who_gruppo': '🏛️ Cadena / Grupo de locales', 'who_priv_desc': 'Encuentra el vino perfecto para cada plato que cocinas o pides, y cómpralo al instante en bwine.shop.', 'who_priv_caption': 'Gratis para empezar, sin tarjeta requerida.', 'who_priv_cta': '✅ Empieza gratis como particular', 'who_priv_hint': '👇 Usa el panel **Cuenta** para iniciar sesión o registrarte.', 'who_biz_desc_restaurant': 'La herramienta de maridaje para tu personal de sala: del camarero al sumiller, todos encuentran en 5 segundos el maridaje correcto para cada plato de la carta.', 'who_biz_desc_enoteca': 'Guía a tus clientes entre cientos de etiquetas, genera cartas de vinos filtradas por rango de precio y usa Bwine como herramienta de venta asistida.', 'who_biz_desc_serale': 'Una carta de vinos y burbujas pensada para el servicio nocturno: burbujas para el aperitivo y after, listas para mesas VIP y bottle service, sugerencias rápidas también para el personal de barra.', 'who_biz_desc_hotel': 'Carta de vinos para el restaurante interno, el room service y el bar del hotel, con maridajes para el desayuno, comidas ligeras y cenas gourmet.', 'who_biz_desc_beach': 'Espumosos, rosados y blancos frescos maridados con los platos de verano de tu menú, con una carta ágil pensada para el servicio rápido en la playa.', 'who_biz_desc_gruppo': 'Una única plataforma multi-sede para uniformar maridajes, cartas de vinos y formación del personal en todos tus locales.', 'who_biz_desc_default': 'La herramienta de maridaje con IA para tu local.', 'who_biz_trial': '🎁 **14 días de prueba gratuita** para tu local — sin tarjeta de crédito.', 'who_biz_cta': '✅ Prueba gratis para mi local', 'who_biz_hint': "👇 Ve a la pestaña **'🍽️ Para Locales'** más abajo para completar la solicitud de prueba gratuita.", 'api_key_hint': 'Configura `ANTHROPIC_API_KEY` en los Secrets de Streamlit.', 'quick_mode': '⚡ Modo Rápido gratuito (reglas clásicas, sin IA — menos preciso pero sin coste)', 'quick_mode_help': 'Útil para pruebas, demos o para reducir las llamadas de pago a la API. Para el análisis molecular completo deja esta opción desactivada.', 'continent_select': '🌍 Continente / Área', 'region_it': '🗺️ Región italiana', 'region_eu': '🗺️ País europeo', 'region_country': '🗺️ País', 'region_state': '🗺️ Estado / Región', 'biz_title': '## 🍽️ Bwine para tu local', 'biz_intro': 'El motor de maridaje con IA que tu personal puede usar en la sala, en la barra o en la consola, y que ayuda a los clientes a elegir el vino o las burbujas adecuadas en segundos — desde la carta de vinos hasta la formación del personal, o un widget para tu web o un código QR en la mesa. Pensado para restaurantes y vinotecas, pero también hoteles, beach clubs y locales nocturnos como discotecas, coctelerías y lounges.', 'biz_trial_banner': '🎁 **14 días de prueba gratuita** para tu local — sin tarjeta de crédito.', 'biz_why_title': '### 💡 Por qué compensa, sea cual sea tu local', 'biz_c1_t': '**🧑\u200d🍳 Venta asistida en sala**', 'biz_c1_d': 'Restaurantes y vinotecas: el camarero escribe el plato pedido y obtiene en 5 segundos 2-3 maridajes justificados, incluso sin ser sumiller.', 'biz_c2_t': '**📋 Carta de vinos "viva"**', 'biz_c2_d': 'Genera e imprime listas filtradas por rango de precio o región, útiles para actualizar la carta o crear menús de degustación de temporada.', 'biz_c3_t': '**🍸 Discotecas y locales nocturnos**', 'biz_c3_d': 'Lista de vinos y burbujas para el servicio nocturno, listas para mesa VIP y bottle service, sugerencias rápidas para el personal de barra durante el aperitivo o el after.', 'biz_c4_t': '**🎓 Formación del personal**', 'biz_c4_d': 'Nuevos camareros, bartenders y sumilleres junior aprenden la lógica de los maridajes usando el motor como herramienta de estudio diaria.', 'biz_plans_title': '### 📦 Planes para locales', 'biz_plans_caption': 'Importes orientativos, punto de partida: hay que ajustarlos a tus costes reales de API y al valor percibido por el local.', 'biz_p1_t': '#### 🥂 Base', 'biz_p1_price': '**~49€/mes**', 'biz_p1_d': '1 puesto (tablet/PC en sala) · Catálogo estándar Bwine · Maridajes ilimitados', 'biz_p2_t': '#### 🍾 Local', 'biz_p2_price': '**~129€/mes**', 'biz_p2_d': 'Hasta 4 puestos · Carta de vinos personalizada (tus propios vinos) · Código QR en la mesa', 'biz_p3_t': '#### 🍸 Nocturno / VIP', 'biz_p3_price': '**~149€/mes**', 'biz_p3_d': 'Pensado para discotecas y coctelerías · Listas de bottle service y mesas VIP · Soporte hasta altas horas', 'biz_p4_t': '#### 🏛️ Cadena / Grupo', 'biz_p4_price': '**A medida**', 'biz_p4_d': 'Varios locales, multi-sede · Integración con tu web o PMS · Gestor de cuenta dedicado', 'biz_form_title': '### ✍️ Solicita una demo gratuita para tu local', 'biz_f_nome': 'Nombre del local *', 'biz_f_referente': 'Nombre y apellidos del contacto *', 'biz_f_email': 'Email *', 'biz_f_tel': 'Teléfono', 'biz_f_citta': 'Ciudad', 'biz_f_tipo': 'Tipo de local', 'biz_f_coperti': 'Cubiertos / tamaño', 'biz_f_piano': 'Plan de interés', 'biz_f_note': 'Notas (opcional)', 'biz_f_note_ph': 'Ej: nos gustaría integrarlo con nuestra carta de vinos ya existente...', 'biz_f_submit': '📨 Solicitar demo gratuita', 'biz_tipo_opts': ['Restaurante', 'Trattoria/Osteria', 'Vinoteca', 'Wine bar', 'Local nocturno / Discoteca', 'Coctelería / Lounge', 'Hotel/Resort', 'B&B', 'Beach club', 'Cadena/Grupo', 'Otro'], 'biz_coperti_opts': ['< 30', '30–80', '80–150', '> 150', 'Multi-sede'], 'biz_piano_opts': ['Base', 'Local', 'Cadena / Grupo', 'Aún no lo sé'], 'biz_success': '✅ ¡Solicitud enviada! Te contactaremos pronto para organizar una demo.', 'biz_warn': 'Completa al menos Nombre del local, Contacto y un Email válido.', 'biz_leads_caption': '📊 {} locales ya han solicitado información sobre Bwine.', 'biz_print_expander': '🖨️ Generar una carta de vinos imprimible (demo)', 'biz_print_caption': 'Filtra el catálogo y genera una lista lista para imprimir o mostrar en una tablet en sala.', 'biz_print_continent': 'Continente', 'biz_print_type': 'Tipo', 'biz_print_band': 'Rango', 'biz_print_count': '**{} vinos seleccionados**', 'biz_print_preview': 'Vista previa de la carta (copiar/pegar o exportar)', 'biz_print_download': '⬇️ Descargar como .txt', 'opt_all_m': 'Todos', 'opt_all_f': 'Todas', 'lab_title': '## 🧪 Wine Lab — el laboratorio del sabor', 'lab_intro': 'Toma el último plato buscado (o escribe uno nuevo), modifícalo con los deslizadores de abajo y observa **cómo cambia el maridaje** — el mismo análisis molecular del motor Bwine, aplicado a la variante del plato. Útil también para un restaurante que quiere probar una variación de receta antes de incluirla en la carta.', 'lab_dish_label': '🍽️ Plato de partida', 'lab_dish_ph': 'Ej: risotto de setas porcini', 'lab_modify_title': '#### 🎛️ Modifica el plato', 'lab_acid': '🍋 Acidez (ej. zumo de limón, vinagre)', 'lab_acid_help': '-2 = menos ácido, 0 = sin cambios, +2 = mucho más ácido', 'lab_fat': '🧈 Grasas (ej. mantequilla, nata, aceite)', 'lab_fat_help': '-2 = más ligero, 0 = sin cambios, +2 = mucho más graso', 'lab_spice': '🌶️ Picante añadido', 'lab_spice_help': '0 = ninguno, +2 = muy picante (mucho chile)', 'lab_cook': '🔥 Cocción / dorado (Maillard)', 'lab_cook_help': '-1 = cocción más breve, +2 = muy dorado/caramelizado', 'lab_preview': '🔬 Plato que se analizará: *{}*', 'lab_slider_hint': 'Mueve al menos un deslizador para crear una variante del plato a analizar.', 'lab_run_btn': '🔬 Recalcular maridajes con esta variante', 'lab_spinner': '🧪 Análisis molecular de la variante en curso…', 'lab_error': 'Error de IA: {}', 'lab_results_title': '### ✨ Maridajes para la variante de *{}*', 'lab_changes': 'Cambios aplicados: {}', 'lab_no_original': "💡 Haz primero una búsqueda en la pestaña '🍷 Maridaje' con el plato original para ver también la comparación antes/después.", 'lab_start_hint': '✏️ Escribe un plato (o busca primero en la pestaña Maridaje) para empezar a experimentar.', 'cul_title': '## 👨\u200d🍳 Consejos Culinarios', 'cul_intro': '¿Ya elegiste (o tienes en tu bodega) un vino y quieres saber **cómo maridarlo o cocinar** un plato o ingrediente específico? Escribe tu pregunta abajo: el motor Bwine te responde con consejos prácticos, partiendo de la química de ese vino.', 'cul_example': 'Ejemplo: *"Quiero hacer un risotto con el Bonarda, ¿cómo marido las setas?"*', 'cul_wine_label': '🍷 Vino de partida', 'cul_question_label': '❓ Tu pregunta', 'cul_question_ph': 'Ej: ¿cómo marido las setas en un risotto hecho con este vino?', 'cul_ask_btn': '🤖 Pregunta al sumiller Bwine', 'cul_warn_q': 'Escribe una pregunta para recibir un consejo.', 'cul_warn_w': 'Selecciona un vino válido.', 'cul_spinner': '👨\u200d🍳 Pensando en el mejor consejo…', 'cul_error': 'Error de IA: {}', 'cul_answer_prefix': '🍷 **{}** · respuesta a medida para este vino', 'cul_addcart': '🛒 Añadir {} al carrito', 'cul_open_product': 'Abrir la ficha del producto', 'cart_step1_t': '**1️⃣ Encuentra el vino**', 'cart_step1_d': 'En la pestaña 🍷 Maridaje (por plato) o 📚 Catálogo (explora todo).', 'cart_step2_t': '**2️⃣ Añádelo al carrito**', 'cart_step2_d': "Un clic en el botón '🛒 Comprar' debajo de cada vino.", 'cart_step3_t': '**3️⃣ Paga aquí y recíbelo en casa**', 'cart_step3_d': 'Datos de envío y pago, en esta misma página.', 'cart_trust': '🔒 Pago seguro (Stripe) · 🚚 Envío 24/48h, gratis a partir de 60€ · ↩️ Devolución gratuita en 30 días', 'cart_empty': 'El carrito está vacío. Añade algún vino desde el catálogo o los maridajes de arriba 🍷', 'cart_qty': 'Cant.', 'cart_subtotal': 'Subtotal: {:.2f}€', 'cart_free': 'Gratis 🎉', 'cart_shipping': 'Envío: {} (gratis a partir de 60€)', 'cart_total': '### Total: {:.2f}€', 'cart_ship_title': '### 📦 Datos de envío y pago', 'cart_demo_caption': '🔒 Entorno de demostración — sin cargo real salvo que haya configurada una clave de prueba de Stripe.', 'cart_f_name': 'Nombre y apellidos *', 'cart_f_email': 'Email *', 'cart_f_address': 'Dirección *', 'cart_f_city': 'Ciudad *', 'cart_f_zip': 'Código postal *', 'cart_f_method': 'Método de pago', 'cart_method_opts': ['💳 Tarjeta (Stripe)', '🅿️ PayPal (demo)', '🏦 Transferencia (demo)'], 'cart_age_confirm': 'Confirmo que soy mayor de 18 años (venta de alcohol)', 'cart_pay_btn': '🔒 Pagar {:.2f}€', 'cart_warn_fields': 'Completa todos los campos obligatorios con un email válido.', 'cart_warn_age': 'Debes confirmar que eres mayor de 18 años para comprar alcohol.', 'cart_stripe_created': '✅ Sesión de pago Stripe (TEST) creada — pedido `{}`.', 'cart_stripe_go': '➡️ Ir al pago seguro de Stripe', 'cart_sim_ok': '🎉 ¡Pago simulado completado! Pedido **{}** confirmado — total **{:.2f}€**. En una tienda real recibirías un email de confirmación en {}.', 'quiz_expander': '🍾 Quiz de tu vino ideal', 'quiz_q1': 'Prefieres vinos:', 'quiz_q1_opts': ['Tintos con cuerpo 🍷', 'Blancos frescos 🥂', 'Espumosos 🫧', 'Dulces 🍯'], 'quiz_q2': 'Cocinas a menudo:', 'quiz_q2_opts': ['Carne y caza 🥩', 'Pescado y marisco 🐟', 'Pasta y pizza 🍕', 'Cocina del mundo 🌏'], 'quiz_q3': 'Presupuesto por botella:', 'quiz_q3_opts': ['<15€', '15–35€', '35–80€', '>80€'], 'quiz_discover': '¡Descubre tu vino! 🍷', 'quiz_result': '🍷 Tu vino ideal: **{}**', 'quiz_hint': '¡Busca este vino en la pestaña Maridaje o explóralo en el Catálogo!', 'quiz_close': '✕ Cerrar quiz', 'lvl_high': 'Alto', 'lvl_medium': 'Medio', 'lvl_low': 'Bajo', 'lbl_acidity': 'Acidez', 'lbl_tannins': 'Taninos', 'lbl_body': 'Cuerpo', 'lbl_sweetness': 'Dulzura', 'irc_chimica': '🧪 Química', 'irc_aromatico': '🌸 Aromático', 'irc_struttura': '⚖️ Estructura', 'irc_pulizia': '✨ Limpieza', 'irc_breakdown': '🎯 Desglose IRC', 'irc_caption': 'IRC = Índice de Reactividad Química Bwine, la puntuación propia del motor molecular', 'calibrated_tip': 'Puntuación corregida según {} valoraciones reales de usuarios', 'chem_in_mouth': '🧪 Química en boca:', 'culinary_tips': '👨\u200d🍳 Consejos culinarios:', 'molecule_hint': '💡 Pasa el ratón sobre las píldoras rojas para descubrir qué son las moléculas protagonistas', 'open_product': 'Abrir la ficha del producto en bwine.shop', 'buy_trust': '🔒 Pago seguro · 🚚 Enviado en 24/48h · ↩️ Devolución gratuita 30 días — haz clic para añadir al carrito, solo pagas en la pestaña 🛒 Carrito.', 'added_to_cart': '🛒 {} añadido al carrito — ¡ve a la pestaña Carrito para pagar!', 'account_title': '## 👤 Tu cuenta', 'account_not_logged': 'Inicia sesión o regístrate para guardar tus búsquedas, valorar vinos y agilizar el checkout.', 'account_login_tab': 'Iniciar sesión', 'account_register_tab': 'Registrarse', 'account_reg_name': 'Nombre y apellidos *', 'account_reg_email': 'Email *', 'account_reg_pwd': 'Contraseña *', 'account_reg_phone': 'Teléfono', 'account_reg_address': 'Dirección (para un checkout más rápido)', 'account_reg_city': 'Ciudad', 'account_reg_zip': 'Código postal', 'account_reg_submit': 'Crear cuenta', 'account_profile_saved': '✅ Perfil actualizado.', 'account_your_orders': '📦 Tus pedidos', 'account_no_orders': 'Aún no hay pedidos.', 'account_edit_profile': '✏️ Editar perfil', 'account_save_profile': '💾 Guardar perfil', 'dish_profile_title': '**🔬 Perfil del plato**', 'no_match_warning': "⚠️ **Ningún vino del catálogo filtrado combina con '{}'.** El atún picante, por ejemplo, marida con blancos secos de alta acidez (Verdicchio, Etna Bianco, Assyrtiko) o tintos ligeros (Nerello Mascalese). Prueba a ampliar los filtros.", 'n_pairings_title': '### ✨ {} maridajes para *{}*', 'n_pairing_title_single': '### ✨ 1 maridaje para *{}*', 'wine_not_in_catalog': 'ℹ️ El vino `{}` sugerido por la IA no está en el catálogo actual. Prueba sin filtros para ver todos los vinos compatibles.', 'stripe_no_key_msg': 'No hay clave de prueba de Stripe configurada: se usará el pago simulado.'})

# ── Nuove chiavi: Contatti, Le mie etichette salvate, Correttore automatico, Schede tecniche ──
LANG["it"].update({
    'nav_contact': '📞 Contatti',
    'contact_title': '## 📞 Contatti Bwine',
    'contact_intro': 'Hai domande, suggerimenti o vuoi segnalarci un problema? Scrivici, ti rispondiamo il prima possibile.',
    'contact_brand_name': 'Bwine',
    'contact_email_label': '✉️ Email',
    'contact_form_title': '### ✍️ Scrivici un messaggio',
    'contact_f_name': 'Nome e cognome *',
    'contact_f_email': 'La tua email *',
    'contact_f_subject': 'Oggetto',
    'contact_f_message': 'Messaggio *',
    'contact_f_message_ph': 'Scrivi qui la tua domanda, segnalazione o richiesta...',
    'contact_f_submit': '📨 Invia messaggio',
    'contact_success': '✅ Messaggio pronto! Si aprirà il tuo client email verso {} — controlla e invia.',
    'contact_warn': 'Compila almeno Nome, Email valida e Messaggio.',
    'contact_direct': 'Oppure scrivi direttamente a **{}** — **{}**',
    'saved_wines_title': '### 🔖 Le tue etichette salvate',
    'saved_wines_caption': 'I vini che hai salvato dal Catalogo o dagli Abbinamenti, tutti in un unico posto.',
    'save_wine_btn': '🔖 Salva etichetta',
    'unsave_wine_btn': '✅ Salvata — rimuovi',
    'no_saved_wines': '📭 Nessuna etichetta salvata ancora. Salva un vino dal Catalogo o dagli Abbinamenti con il bottone 🔖.',
    'saved_wine_added': '🔖 {} salvato tra le tue etichette!',
    'saved_wine_removed': '🗑️ {} rimosso dalle etichette salvate.',
    'tech_sheet_link': '📄 Scheda tecnica',
    'tech_sheet_help': 'Apre una ricerca con la scheda tecnica ufficiale del vino (produttore, denominazione, dati enologici)',
    'corrector_label': '✏️ Correttore automatico',
    'corrector_help': 'Corregge automaticamente refusi comuni negli ingredienti/piatti scritti (es. "pomodooro" → "pomodoro") prima di analizzare',
    'corrector_applied': '✏️ Corretto automaticamente: *{}* → *{}*',
    'lab_more_title': '#### 🧪 Altri strumenti del laboratorio',
    'lab_save_variant': '💾 Salva questa variante nelle tue ricerche',
    'lab_variant_saved': '✅ Variante salvata nelle tue ricerche.',
    'lab_history_title': '#### 📜 Cronologia varianti testate in questa sessione',
    'lab_no_history': 'Nessuna variante testata ancora in questa sessione.',
    'lab_tip_title': '💡 Suggerimento',
    'lab_tip_text': "Prova a spostare un solo slider alla volta per capire quale variabile chimica influenza di più l'abbinamento.",
    # ── Admin, account demo, Wine Lab ingredienti, ricerca vino nei Consigli Culinari ──
    'nav_admin': '🛠️ Admin',
    'admin_title': 'Pannello Admin',
    'admin_locked_desc': 'Area riservata: inserisci la password admin per vedere chi si è registrato, le ricerche, gli ordini e le richieste demo dei locali.',
    'admin_pwd_label': 'Password admin',
    'admin_pwd_btn': '🔓 Sblocca pannello',
    'admin_wrong_pwd': '❌ Password errata.',
    'admin_logout_btn': '🔒 Blocca pannello',
    'admin_stat_users': '👥 Utenti registrati',
    'admin_stat_orders': '📦 Ordini pagati',
    'admin_stat_revenue': '💶 Fatturato demo',
    'admin_stat_leads': '🏛️ Richieste locali',
    'admin_users_title': '### 👥 Chi si è registrato',
    'admin_searches_title': '### 🔍 Ultime ricerche',
    'admin_orders_title': '### 📦 Ultimi ordini',
    'admin_leads_title': '### 🏛️ Richieste demo dai locali',
    'admin_no_data': 'Nessun dato ancora disponibile.',
    'admin_pwd_hint': 'Password demo di default: `bwine-admin-2025` (personalizzabile con la variabile `ADMIN_PASSWORD`).',
    'account_demo_title': "#### 🔑 Vuoi solo vedere come funziona un account?",
    'account_demo_desc': 'Usa questo account demo già popolato con vini salvati, ricerche passate e un ordine di esempio — nessuna registrazione necessaria.',
    'account_demo_btn': "🚀 Entra con l'account demo",
    'account_orders_title': '### 📦 I tuoi ordini',
    'account_order_line': '**{}** · {} · {:.2f}€ · {}',
    'cul_search_label': '🔎 Cerca vino per nome, uva o regione',
    'cul_search_ph': 'Es: bonarda, nebbiolo, sicilia, spumante...',
    'cul_search_noresults': "😕 Nessun vino trovato con questa ricerca — ecco l'elenco completo.",
    'cul_search_or': 'oppure scegli dalla lista',
})
LANG["en"].update({
    'nav_contact': '📞 Contact',
    'contact_title': '## 📞 Contact Bwine',
    'contact_intro': "Questions, suggestions, or found an issue? Write to us — we'll get back to you as soon as possible.",
    'contact_brand_name': 'Bwine',
    'contact_email_label': '✉️ Email',
    'contact_form_title': '### ✍️ Send us a message',
    'contact_f_name': 'Full name *',
    'contact_f_email': 'Your email *',
    'contact_f_subject': 'Subject',
    'contact_f_message': 'Message *',
    'contact_f_message_ph': 'Write your question, report, or request here...',
    'contact_f_submit': '📨 Send message',
    'contact_success': '✅ Message ready! Your email client will open addressed to {} — check it and send.',
    'contact_warn': 'Please fill in at least Name, a valid Email, and a Message.',
    'contact_direct': 'Or write directly to **{}** — **{}**',
    'saved_wines_title': '### 🔖 Your saved labels',
    'saved_wines_caption': 'Wines you saved from the Catalog or Pairings, all in one place.',
    'save_wine_btn': '🔖 Save label',
    'unsave_wine_btn': '✅ Saved — remove',
    'no_saved_wines': '📭 No saved labels yet. Save a wine from the Catalog or Pairings with the 🔖 button.',
    'saved_wine_added': '🔖 {} saved to your labels!',
    'saved_wine_removed': '🗑️ {} removed from saved labels.',
    'tech_sheet_link': '📄 Technical sheet',
    'tech_sheet_help': "Opens a search for the wine's official technical sheet (producer, denomination, oenological data)",
    'corrector_label': '✏️ Auto-correct',
    'corrector_help': 'Automatically fixes common typos in the dish/ingredients you type (e.g. "tomatoe" → "tomato") before analyzing',
    'corrector_applied': '✏️ Auto-corrected: *{}* → *{}*',
    'lab_more_title': '#### 🧪 More lab tools',
    'lab_save_variant': '💾 Save this variant to your searches',
    'lab_variant_saved': '✅ Variant saved to your searches.',
    'lab_history_title': '#### 📜 Variants tested this session',
    'lab_no_history': 'No variant tested yet this session.',
    'lab_tip_title': '💡 Tip',
    'lab_tip_text': 'Try moving one slider at a time to see which chemical variable affects the pairing most.',
    'nav_admin': '🛠️ Admin',
    'admin_title': 'Admin Panel',
    'admin_locked_desc': 'Restricted area: enter the admin password to see registered users, searches, orders and venue demo requests.',
    'admin_pwd_label': 'Admin password',
    'admin_pwd_btn': '🔓 Unlock panel',
    'admin_wrong_pwd': '❌ Wrong password.',
    'admin_logout_btn': '🔒 Lock panel',
    'admin_stat_users': '👥 Registered users',
    'admin_stat_orders': '📦 Paid orders',
    'admin_stat_revenue': '💶 Demo revenue',
    'admin_stat_leads': '🏛️ Venue requests',
    'admin_users_title': '### 👥 Who registered',
    'admin_searches_title': '### 🔍 Recent searches',
    'admin_orders_title': '### 📦 Recent orders',
    'admin_leads_title': '### 🏛️ Demo requests from venues',
    'admin_no_data': 'No data available yet.',
    'admin_pwd_hint': 'Default demo password: `bwine-admin-2025` (customize with the `ADMIN_PASSWORD` variable).',
    'account_demo_title': '#### 🔑 Just want to see how an account works?',
    'account_demo_desc': 'Use this demo account, already populated with saved wines, past searches and a sample order — no signup needed.',
    'account_demo_btn': '🚀 Enter with the demo account',
    'account_orders_title': '### 📦 Your orders',
    'account_order_line': '**{}** · {} · {:.2f}€ · {}',
    'cul_search_label': '🔎 Search wine by name, grape or region',
    'cul_search_ph': 'E.g.: bonarda, nebbiolo, sicily, sparkling...',
    'cul_search_noresults': '😕 No wine found for this search — here is the full list.',
    'cul_search_or': 'or pick from the list',
})
LANG["es"].update({
    'nav_contact': '📞 Contacto',
    'contact_title': '## 📞 Contacto Bwine',
    'contact_intro': '¿Preguntas, sugerencias o algún problema? Escríbenos, te responderemos lo antes posible.',
    'contact_brand_name': 'Bwine',
    'contact_email_label': '✉️ Email',
    'contact_form_title': '### ✍️ Envíanos un mensaje',
    'contact_f_name': 'Nombre y apellidos *',
    'contact_f_email': 'Tu email *',
    'contact_f_subject': 'Asunto',
    'contact_f_message': 'Mensaje *',
    'contact_f_message_ph': 'Escribe aquí tu pregunta, incidencia o solicitud...',
    'contact_f_submit': '📨 Enviar mensaje',
    'contact_success': '✅ ¡Mensaje listo! Se abrirá tu cliente de correo hacia {} — revísalo y envíalo.',
    'contact_warn': 'Completa al menos Nombre, Email válido y Mensaje.',
    'contact_direct': 'O escribe directamente a **{}** — **{}**',
    'saved_wines_title': '### 🔖 Tus etiquetas guardadas',
    'saved_wines_caption': 'Los vinos que guardaste desde el Catálogo o los Maridajes, todos en un solo lugar.',
    'save_wine_btn': '🔖 Guardar etiqueta',
    'unsave_wine_btn': '✅ Guardada — quitar',
    'no_saved_wines': '📭 Aún no hay etiquetas guardadas. Guarda un vino desde el Catálogo o los Maridajes con el botón 🔖.',
    'saved_wine_added': '🔖 ¡{} guardado en tus etiquetas!',
    'saved_wine_removed': '🗑️ {} eliminado de las etiquetas guardadas.',
    'tech_sheet_link': '📄 Ficha técnica',
    'tech_sheet_help': 'Abre una búsqueda con la ficha técnica oficial del vino (productor, denominación, datos enológicos)',
    'corrector_label': '✏️ Corrector automático',
    'corrector_help': 'Corrige automáticamente errores comunes en el plato/ingredientes escritos antes de analizar',
    'corrector_applied': '✏️ Corregido automáticamente: *{}* → *{}*',
    'lab_more_title': '#### 🧪 Más herramientas del laboratorio',
    'lab_save_variant': '💾 Guardar esta variante en tus búsquedas',
    'lab_variant_saved': '✅ Variante guardada en tus búsquedas.',
    'lab_history_title': '#### 📜 Historial de variantes probadas en esta sesión',
    'lab_no_history': 'Aún no se ha probado ninguna variante en esta sesión.',
    'lab_tip_title': '💡 Consejo',
    'lab_tip_text': 'Prueba a mover un solo deslizador a la vez para ver qué variable química influye más en el maridaje.',
    'nav_admin': '🛠️ Admin',
    'admin_title': 'Panel de Admin',
    'admin_locked_desc': 'Área reservada: introduce la contraseña de admin para ver los usuarios registrados, las búsquedas, los pedidos y las solicitudes de demo de los locales.',
    'admin_pwd_label': 'Contraseña admin',
    'admin_pwd_btn': '🔓 Desbloquear panel',
    'admin_wrong_pwd': '❌ Contraseña incorrecta.',
    'admin_logout_btn': '🔒 Bloquear panel',
    'admin_stat_users': '👥 Usuarios registrados',
    'admin_stat_orders': '📦 Pedidos pagados',
    'admin_stat_revenue': '💶 Facturación demo',
    'admin_stat_leads': '🏛️ Solicitudes de locales',
    'admin_users_title': '### 👥 Quién se registró',
    'admin_searches_title': '### 🔍 Búsquedas recientes',
    'admin_orders_title': '### 📦 Pedidos recientes',
    'admin_leads_title': '### 🏛️ Solicitudes de demo de locales',
    'admin_no_data': 'Aún no hay datos disponibles.',
    'admin_pwd_hint': 'Contraseña demo por defecto: `bwine-admin-2025` (personalizable con la variable `ADMIN_PASSWORD`).',
    'account_demo_title': '#### 🔑 ¿Solo quieres ver cómo funciona una cuenta?',
    'account_demo_desc': 'Usa esta cuenta demo ya poblada con vinos guardados, búsquedas anteriores y un pedido de ejemplo — sin necesidad de registro.',
    'account_demo_btn': '🚀 Entrar con la cuenta demo',
    'account_orders_title': '### 📦 Tus pedidos',
    'account_order_line': '**{}** · {} · {:.2f}€ · {}',
    'cul_search_label': '🔎 Buscar vino por nombre, uva o región',
    'cul_search_ph': 'Ej: bonarda, nebbiolo, sicilia, espumoso...',
    'cul_search_noresults': '😕 No se encontró ningún vino con esta búsqueda — aquí está la lista completa.',
    'cul_search_or': 'o elige de la lista',
})

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
/* Sfondo a tema "mondo del vino": texture leggera di tralci/foglie di vite
   su fondo caldo crema, con vignatura ai bordi per dare profondita' senza
   compromettere la leggibilita' del contenuto. */
.stApp {
    background-color: #ffffff;
}
.main { background-color: transparent; }

/* Menu in alto: restyling di st.tabs come navbar del "sito" Bwine */
.stTabs { margin-top: 4px; }
.stTabs [data-baseweb="tab-list"] {
    background: linear-gradient(135deg, #2a0608 0%, #4a1018 55%, #6b2030 100%);
    border-radius: 14px;
    padding: 6px 10px;
    gap: 2px;
    box-shadow: 0 6px 20px rgba(42,6,8,0.25);
    position: sticky; top: 0; z-index: 999;
    flex-wrap: wrap;
}
.stTabs [data-baseweb="tab"] {
    color: #e8c5c8 !important;
    font-weight: 600;
    border-radius: 10px !important;
    padding: 8px 16px !important;
    background: transparent !important;
    transition: all 0.15s;
}
.stTabs [data-baseweb="tab"]:hover { background: rgba(255,255,255,0.08) !important; color: #fff !important; }
.stTabs [aria-selected="true"] {
    background: rgba(255,255,255,0.14) !important;
    color: #fff !important;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.25);
}
.stTabs [data-baseweb="tab-highlight"] { background-color: transparent !important; }
.stTabs [data-baseweb="tab-border"] { display: none !important; }

/* Barra sito: logo + tagline compatti sopra il menu */
.site-topbar { display: flex; align-items: center; justify-content: space-between; padding: 6px 4px 14px; }
.site-logo { font-size: 1.7em; font-weight: 800; color: #3d0a10; letter-spacing: -0.5px; }
.site-logo span { font-style: italic; font-weight: 300; }
.site-tagline { font-size: 0.82em; color: #8a5a5f; font-style: italic; }

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
.molecule-row { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0; padding: 8px 10px; background: #ffffff; border: 1px solid #f0e8e9; border-radius: 8px; }
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
.history-item { border-left: 3px solid #e8c5c8; padding: 8px 12px; margin: 6px 0; background: #ffffff; border-radius: 0 6px 6px 0; font-size: 0.84em; }
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

/* ── FIX: testo nero nei menu a tendina (select/multiselect/radio) ──
   Streamlit/BaseWeb a volte eredita un tema scuro per i popover dei
   selectbox: il testo diventa bianco su sfondo bianco ed è illeggibile
   quando si seleziona un'opzione (catalogo, Wine Lab, filtri, ecc.).
   Qui forziamo sempre testo scuro leggibile su sfondo chiaro. */
div[data-baseweb="select"] div { color: #2b1114 !important; }
div[data-baseweb="select"] span { color: #2b1114 !important; }
div[data-baseweb="select"] [class*="singleValue"],
div[data-baseweb="select"] [class*="ValueContainer"],
div[data-baseweb="select"] [class*="placeholder"] {
    color: #2b1114 !important;
}
div[data-baseweb="popover"] { background: #ffffff !important; }
div[data-baseweb="popover"] ul[role="listbox"] { background: #ffffff !important; }
div[data-baseweb="popover"] li,
div[data-baseweb="popover"] li span,
div[data-baseweb="popover"] div[role="option"] {
    color: #2b1114 !important;
    background: #ffffff !important;
}
div[data-baseweb="popover"] li:hover,
div[data-baseweb="popover"] div[role="option"]:hover {
    background: #f6e6e8 !important;
    color: #3d0a10 !important;
}
div[data-baseweb="popover"] li[aria-selected="true"],
div[data-baseweb="popover"] div[aria-selected="true"] {
    background: #f0d5d9 !important;
    color: #3d0a10 !important;
    font-weight: 600;
}
/* Chip dei multiselect: restano leggibili anche su sfondo colorato */
span[data-baseweb="tag"] { background:#5c1d24 !important; color:#ffffff !important; }
span[data-baseweb="tag"] span { color:#ffffff !important; }
/* Radio / checkbox label sempre scuri */
.stRadio label, .stCheckbox label, .stSelectbox label, .stMultiSelect label { color:#3d0a10 !important; }

/* ═══════════════════════════════════════════════════════════
   RESTYLING "PREMIUM" — palette bordeaux + oro, font serif per
   i titoli (Playfair Display) e sans elegante per il corpo (Inter).
   ═══════════════════════════════════════════════════════════ */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,500&family=Inter:wght@400;500;600;700&display=swap');

:root {
    --bw-bordeaux-deep: #240508;
    --bw-bordeaux: #3d0a10;
    --bw-bordeaux-light: #6b2030;
    --bw-gold: #c9a24a;
    --bw-gold-light: #e8cf8a;
    --bw-cream: #faf6ef;
}

html, body, [class*="css"] { font-family: 'Inter', -apple-system, sans-serif; }
h1, h2, h3, .hero h1, .site-logo, .wine-card h3 { font-family: 'Playfair Display', Georgia, serif !important; }

.stApp { background: linear-gradient(180deg, #fffdf9 0%, #fbf6ee 100%); }

/* ── Topbar / logo: più formale, con filo oro sotto ── */
.site-topbar {
    border-bottom: 1px solid #ecdfc8;
    margin-bottom: 6px;
}
.site-logo {
    font-family: 'Playfair Display', serif !important;
    font-size: 2em !important;
    letter-spacing: 0.5px !important;
    color: var(--bw-bordeaux) !important;
}
.site-logo span { color: var(--bw-gold) !important; font-weight: 700 !important; font-style: normal !important; }
.site-tagline {
    font-family: 'Playfair Display', serif !important;
    font-style: italic !important;
    color: #9c7a3a !important;
    font-size: 0.88em !important;
}

/* ── Hero: più cinematografico, con cornice oro e motto in evidenza ── */
.hero {
    background:
        radial-gradient(circle at 15% 20%, rgba(201,162,74,0.10), transparent 45%),
        radial-gradient(circle at 85% 80%, rgba(201,162,74,0.08), transparent 50%),
        linear-gradient(135deg, var(--bw-bordeaux-deep) 0%, var(--bw-bordeaux) 45%, var(--bw-bordeaux-light) 100%);
    padding: 56px 32px 44px;
    border-radius: 18px;
    border: 1px solid rgba(201,162,74,0.35);
    box-shadow: 0 14px 40px rgba(36,5,8,0.28), inset 0 0 0 1px rgba(255,255,255,0.03);
    position: relative;
    overflow: hidden;
}
.hero::before, .hero::after {
    content: "";
    position: absolute; left: 50%; transform: translateX(-50%);
    width: 64px; height: 2px; background: var(--bw-gold);
}
.hero::before { top: 22px; }
.hero::after { bottom: 22px; }
.hero h1 {
    font-family: 'Playfair Display', serif !important;
    font-size: 3.4em !important;
    font-weight: 900 !important;
    letter-spacing: 0.5px !important;
    text-shadow: 0 2px 18px rgba(0,0,0,0.25);
}
.hero h1 span { color: var(--bw-gold-light) !important; }
.hero p { font-family: 'Playfair Display', serif !important; }
.hero-motto {
    display: inline-block; margin-top: 18px; padding: 8px 22px;
    border: 1px solid rgba(201,162,74,0.55); border-radius: 30px;
    color: var(--bw-gold-light); font-size: 0.82em; letter-spacing: 1.5px;
    text-transform: uppercase; font-weight: 600;
}
.hero-bottles { display:flex; justify-content:center; gap: 18px; margin: 22px 0 6px; opacity: 0.95; }
.hero-bottles img { height: 92px; filter: drop-shadow(0 10px 18px rgba(0,0,0,0.35)); }

/* ── Card vino: filo oro invece del rosso piatto, più "boutique" ── */
.wine-card {
    border-left: 4px solid var(--bw-gold);
    box-shadow: 0 4px 22px rgba(61,10,16,0.09);
}
.wine-card h3 { color: var(--bw-bordeaux) !important; }

/* ── Bottoni: gradiente bordeaux con rifinitura oro ── */
.stButton > button {
    background: linear-gradient(135deg, var(--bw-bordeaux), var(--bw-bordeaux-light)) !important;
    border: 1px solid rgba(201,162,74,0.5) !important;
    letter-spacing: 0.3px;
}
.stButton > button:hover {
    background: linear-gradient(135deg, var(--bw-bordeaux-light), var(--bw-bordeaux)) !important;
    box-shadow: 0 4px 14px rgba(201,162,74,0.35) !important;
}
.buy-btn { background: linear-gradient(135deg, var(--bw-bordeaux), var(--bw-bordeaux-light)); border: 1px solid rgba(201,162,74,0.5); }
.buy-btn:hover { box-shadow: 0 4px 14px rgba(201,162,74,0.4); }

/* ── Sezione "chi sei" e altri container con bordo elegante ── */
div[data-testid="stExpander"], div[data-testid="stContainer"] { border-radius: 12px !important; }

/* ── Wine Lab: nota libera in evidenza ── */
.wl-freeform-box {
    background: linear-gradient(135deg, #fff, #fbf3e4);
    border: 1px solid rgba(201,162,74,0.4);
    border-radius: 12px; padding: 14px 18px; margin: 12px 0 4px;
}
</style>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────
# DATABASE
# ─────────────────────────────────────────────
DB_PATH = "bwine.db"

@st.cache_resource(show_spinner=False)
def init_db():
    """Cache_resource: esegue le CREATE TABLE una sola volta per processo,
    invece che ad ogni rerun di Streamlit (che avviene ad ogni click/slider).
    Prima questa funzione veniva richiamata ad ogni interazione, aprendo una
    connessione SQLite ed eseguendo 7 CREATE TABLE + ALTER TABLE ogni volta:
    era la causa principale della sensazione di lentezza/"si ricarica sempre"."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE,
        nome TEXT, password_hash TEXT, preferenze TEXT DEFAULT '{}',
        telefono TEXT DEFAULT '', indirizzo TEXT DEFAULT '', citta TEXT DEFAULT '', cap TEXT DEFAULT '',
        created_at TEXT)""")
    # Migrazione soft per DB creati con lo schema precedente (senza le colonne indirizzo)
    for col in ("telefono", "indirizzo", "citta", "cap"):
        try:
            c.execute(f"ALTER TABLE users ADD COLUMN {col} TEXT DEFAULT ''")
        except sqlite3.OperationalError:
            pass
    c.execute("""CREATE TABLE IF NOT EXISTS searches (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER,
        piatto TEXT, filtri TEXT, risultati TEXT, created_at TEXT)""")
    c.execute("""CREATE TABLE IF NOT EXISTS wine_feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER,
        wine_name TEXT, piatto TEXT, rating INTEGER, note TEXT, created_at TEXT)""")
    # Lead B2B: ristoranti, enoteche, wine bar interessati al prodotto per i locali
    c.execute("""CREATE TABLE IF NOT EXISTS locali_leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT, nome_locale TEXT, referente TEXT,
        email TEXT, telefono TEXT, citta TEXT, tipo_locale TEXT, n_coperti TEXT,
        piano_interesse TEXT, note TEXT, created_at TEXT)""")
    # Cache persistente delle risposte AI: sopravvive ai riavvii e riduce le chiamate a pagamento
    c.execute("""CREATE TABLE IF NOT EXISTS ai_cache (
        cache_key TEXT PRIMARY KEY, risultato TEXT, created_at TEXT, hits INTEGER DEFAULT 0)""")
    # Ordini dello shop demo (bwine.shop): checkout simulato o Stripe Test Mode
    c.execute("""CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT, order_ref TEXT UNIQUE, user_id INTEGER,
        nome_cliente TEXT, email TEXT, indirizzo TEXT, citta TEXT, cap TEXT,
        items_json TEXT, totale REAL, metodo_pagamento TEXT, stato TEXT,
        stripe_session_id TEXT, created_at TEXT)""")
    # "Le mie etichette" — vini che l'utente ha salvato/preferito dal Catalogo o dagli
    # Abbinamenti, per ritrovarli tutti in un unico posto nella pagina Account.
    c.execute("""CREATE TABLE IF NOT EXISTS saved_wines (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, wine_id TEXT,
        wine_name TEXT, created_at TEXT, UNIQUE(user_id, wine_id))""")
    # Messaggi inviati dal form Contatti (per uno storico, anche se l'invio reale
    # avviene via client email dell'utente con mailto:)
    c.execute("""CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT,
        oggetto TEXT, messaggio TEXT, created_at TEXT)""")
    conn.commit(); conn.close()

def save_order(order_ref, user_id, nome_cliente, email, indirizzo, citta, cap,
                items, totale, metodo_pagamento, stato, stripe_session_id=""):
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("""INSERT INTO orders
        (order_ref,user_id,nome_cliente,email,indirizzo,citta,cap,items_json,totale,
         metodo_pagamento,stato,stripe_session_id,created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
        (order_ref, user_id, nome_cliente, email, indirizzo, citta, cap,
         json.dumps(items, ensure_ascii=False), totale, metodo_pagamento, stato,
         stripe_session_id, datetime.now().isoformat()))
    conn.commit(); conn.close()

def count_orders():
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("SELECT COUNT(*), COALESCE(SUM(totale),0) FROM orders WHERE stato='pagato'")
    row = c.fetchone(); conn.close()
    return {"n": row[0], "totale": row[1]}

def save_locale_lead(nome_locale, referente, email, telefono, citta, tipo_locale, n_coperti, piano_interesse, note=""):
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("""INSERT INTO locali_leads
        (nome_locale,referente,email,telefono,citta,tipo_locale,n_coperti,piano_interesse,note,created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?)""",
        (nome_locale, referente, email, telefono, citta, tipo_locale, n_coperti, piano_interesse, note,
         datetime.now().isoformat()))
    conn.commit(); conn.close()

def count_locali_leads():
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM locali_leads")
    n = c.fetchone()[0]; conn.close(); return n

def hash_pwd(p): return hashlib.sha256(p.encode()).hexdigest()

def register_user(email, nome, password, telefono="", indirizzo="", citta="", cap=""):
    try:
        conn = sqlite3.connect(DB_PATH); c = conn.cursor()
        c.execute("""INSERT INTO users (email,nome,password_hash,telefono,indirizzo,citta,cap,created_at)
                     VALUES (?,?,?,?,?,?,?,?)""",
                  (email.lower(), nome, hash_pwd(password), telefono, indirizzo, citta, cap,
                   datetime.now().isoformat()))
        conn.commit(); conn.close(); return True
    except sqlite3.IntegrityError: return False

def login_user(email, password):
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("""SELECT id,nome,email,preferenze,telefono,indirizzo,citta,cap FROM users
                 WHERE email=? AND password_hash=?""",
              (email.lower(), hash_pwd(password)))
    row = c.fetchone(); conn.close()
    if row:
        return {"id":row[0],"nome":row[1],"email":row[2],"preferenze":json.loads(row[3]),
                "telefono":row[4] or "","indirizzo":row[5] or "","citta":row[6] or "","cap":row[7] or ""}
    return None

def update_user_profile(user_id, nome, telefono, indirizzo, citta, cap):
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("UPDATE users SET nome=?,telefono=?,indirizzo=?,citta=?,cap=? WHERE id=?",
              (nome, telefono, indirizzo, citta, cap, user_id))
    conn.commit(); conn.close()

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
# "LE MIE ETICHETTE" — vini salvati/preferiti dall'utente
# ─────────────────────────────────────────────
def save_wine_label(user_id: int, wine_id: str, wine_name: str) -> bool:
    """Salva un vino tra le etichette dell'utente. Ritorna False se già salvato."""
    try:
        conn = sqlite3.connect(DB_PATH); c = conn.cursor()
        c.execute("INSERT INTO saved_wines (user_id,wine_id,wine_name,created_at) VALUES (?,?,?,?)",
                  (user_id, wine_id, wine_name, datetime.now().isoformat()))
        conn.commit(); conn.close(); return True
    except sqlite3.IntegrityError:
        return False

def remove_wine_label(user_id: int, wine_id: str):
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("DELETE FROM saved_wines WHERE user_id=? AND wine_id=?", (user_id, wine_id))
    conn.commit(); conn.close()

def is_wine_saved(user_id: int, wine_id: str) -> bool:
    if not user_id:
        return False
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("SELECT 1 FROM saved_wines WHERE user_id=? AND wine_id=?", (user_id, wine_id))
    row = c.fetchone(); conn.close()
    return row is not None

def get_saved_wine_ids(user_id: int) -> set:
    if not user_id:
        return set()
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("SELECT wine_id FROM saved_wines WHERE user_id=? ORDER BY created_at DESC", (user_id,))
    rows = c.fetchall(); conn.close()
    return {r[0] for r in rows}

def get_saved_wines_full(user_id: int) -> list:
    """Ritorna gli oggetti vino completi (dal catalogo) per tutte le etichette salvate,
    più recenti prima — usata nella pagina Account."""
    ids = list(get_saved_wine_ids(user_id))
    wines = [get_wine_by_id(wid) for wid in ids]
    return [w for w in wines if w]

# ─────────────────────────────────────────────
# ADMIN — chi si è registrato, ricerche, ordini, lead B2B: tutto in un pannello
# raggiungibile solo con una password (vedi ADMIN_PASSWORD più sotto).
# ─────────────────────────────────────────────
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "bwine-admin-2025")

def get_all_users(limit: int = 500) -> list:
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("""SELECT id,email,nome,telefono,citta,indirizzo,cap,created_at
                 FROM users ORDER BY created_at DESC LIMIT ?""", (limit,))
    cols = ["id","email","nome","telefono","citta","indirizzo","cap","created_at"]
    rows = [dict(zip(cols, r)) for r in c.fetchall()]
    conn.close()
    return rows

def count_users() -> int:
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM users")
    n = c.fetchone()[0]; conn.close(); return n

def get_recent_searches_admin(limit: int = 50) -> list:
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("""SELECT s.piatto, s.created_at, u.email, u.nome
                 FROM searches s LEFT JOIN users u ON u.id = s.user_id
                 ORDER BY s.created_at DESC LIMIT ?""", (limit,))
    rows = c.fetchall(); conn.close()
    return [{"piatto": r[0], "created_at": r[1], "email": r[2] or "—", "nome": r[3] or "Ospite"} for r in rows]

def get_recent_orders_admin(limit: int = 50) -> list:
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("""SELECT order_ref, nome_cliente, email, totale, stato, created_at
                 FROM orders ORDER BY created_at DESC LIMIT ?""", (limit,))
    cols = ["order_ref","nome_cliente","email","totale","stato","created_at"]
    rows = [dict(zip(cols, r)) for r in c.fetchall()]
    conn.close()
    return rows

def get_all_locali_leads_admin(limit: int = 200) -> list:
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("""SELECT nome_locale,referente,email,telefono,citta,tipo_locale,
                        n_coperti,piano_interesse,note,created_at
                 FROM locali_leads ORDER BY created_at DESC LIMIT ?""", (limit,))
    cols = ["nome_locale","referente","email","telefono","citta","tipo_locale",
            "n_coperti","piano_interesse","note","created_at"]
    rows = [dict(zip(cols, r)) for r in c.fetchall()]
    conn.close()
    return rows

# ─────────────────────────────────────────────
# ACCOUNT DEMO — un account precompilato ("prova il prodotto senza registrarti")
# con vini salvati, ricerche e un ordine finto già in pancia, per far vedere a
# un locale/investitore come appare l'account di un utente reale.
# ─────────────────────────────────────────────
DEMO_EMAIL = "demo@bwine.it"
DEMO_PASSWORD = "BwineDemo25!"
DEMO_NOME = "Utente Demo"

@st.cache_resource(show_spinner=False)
def seed_demo_account():
    """Crea (una sola volta per processo, grazie a cache_resource) l'account demo
    con dati di esempio già popolati: vini salvati, storico ricerche, una
    valutazione e un ordine completato. Prima girava ad ogni rerun."""
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("SELECT id FROM users WHERE email=?", (DEMO_EMAIL,))
    row = c.fetchone()
    if row:
        conn.close()
        return row[0]
    conn.close()
    register_user(DEMO_EMAIL, DEMO_NOME, DEMO_PASSWORD,
                   telefono="+39 345 000 0000", indirizzo="Via delle Botti 12",
                   citta="Milano", cap="20100")
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("SELECT id FROM users WHERE email=?", (DEMO_EMAIL,))
    demo_id = c.fetchone()[0]
    conn.close()

    # Etichette salvate: qualche vino a caso dal catalogo, se disponibile
    demo_wines = WINE_CATALOG[:4] if len(WINE_CATALOG) >= 4 else WINE_CATALOG
    for w in demo_wines:
        save_wine_label(demo_id, w["id"], w["nome"])

    # Storico ricerche di esempio
    piatti_demo = ["risotto ai funghi porcini", "tagliata di manzo al rosmarino", "spaghetti alle vongole"]
    for p in piatti_demo:
        save_search(demo_id, p, {"regione":"qualsiasi"}, {})

    # Una valutazione di esempio
    if demo_wines:
        save_feedback(demo_id, demo_wines[0]["nome"], "risotto ai funghi porcini", 5,
                       "Abbinamento perfetto, lo confermo.")

    # Un ordine "pagato" di esempio, così l'account mostra anche il checkout
    if demo_wines:
        items = [{"id": w["id"], "nome": w["nome"], "prezzo": w.get("prezzo", 0), "qty": 1} for w in demo_wines[:2]]
        totale = sum(i["prezzo"] * i["qty"] for i in items)
        save_order("BWDEMO0001", demo_id, DEMO_NOME, DEMO_EMAIL, "Via delle Botti 12",
                   "Milano", "20100", items, totale, "💳 Carta (Stripe)", "pagato", "")
    return demo_id

def get_user_orders(user_id: int) -> list:
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("""SELECT order_ref,items_json,totale,metodo_pagamento,stato,created_at
                 FROM orders WHERE user_id=? ORDER BY created_at DESC""", (user_id,))
    cols = ["order_ref","items_json","totale","metodo_pagamento","stato","created_at"]
    rows = [dict(zip(cols, r)) for r in c.fetchall()]
    conn.close()
    for r in rows:
        try:
            r["items"] = json.loads(r["items_json"])
        except Exception:
            r["items"] = []
    return rows

# ─────────────────────────────────────────────
# CONTATTI — storico messaggi inviati dal form (l'invio reale avviene via mailto:)
# ─────────────────────────────────────────────
CONTACT_EMAIL = "vinodivinoai@gmail.com"
CONTACT_BRAND = "Bwine"

def save_contact_message(nome: str, email: str, oggetto: str, messaggio: str):
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("INSERT INTO contact_messages (nome,email,oggetto,messaggio,created_at) VALUES (?,?,?,?,?)",
              (nome, email, oggetto, messaggio, datetime.now().isoformat()))
    conn.commit(); conn.close()

# ─────────────────────────────────────────────
# CORRETTORE AUTOMATICO — corregge refusi comuni nei piatti/ingredienti scritti
# dall'utente prima di mandarli all'analisi molecolare AI. Non è un correttore
# ortografico generico: è un dizionario mirato ai termini gastronomici/vino più
# comuni (italiano + qualche inglese), pensato per essere veloce e senza dipendenze
# esterne, più un fallback "fuzzy" con difflib per i refusi non in dizionario.
# ─────────────────────────────────────────────
import difflib

_CORREZIONI_DIZIONARIO = {
    "pomodooro":"pomodoro","pomodorro":"pomodoro","pomodoto":"pomodoro","pomodor":"pomodoro",
    "spaghetti":"spaghetti","spagetti":"spaghetti","spagheti":"spaghetti","spaghety":"spaghetti",
    "carbonara":"carbonara","carbonaraa":"carbonara","carbnara":"carbonara",
    "risoto":"risotto","risotoo":"risotto","rissotto":"risotto",
    "funghi":"funghi","fungi":"funghi","funghii":"funghi",
    "porccini":"porcini","porcni":"porcini","porcinii":"porcini",
    "parmiggiano":"parmigiano","parmigiiano":"parmigiano","parmiggiano reggiano":"parmigiano reggiano",
    "mozzarela":"mozzarella","mozzarrella":"mozzarella","mozarella":"mozzarella",
    "pancetta":"pancetta","panceta":"pancetta",
    "guanciale":"guanciale","guancale":"guanciale","guanciiale":"guanciale",
    "besciamella":"besciamella","besciamela":"besciamella","besciamela":"besciamella",
    "lasagne":"lasagne","lasagna":"lasagne","lasagnie":"lasagne",
    "brasato":"brasato","brassato":"brasato",
    "salmone":"salmone","salmonne":"salmone","salomne":"salmone",
    "gamberi":"gamberi","gamberri":"gamberi","gamberoni":"gamberoni",
    "polipo":"polpo","polppo":"polpo",
    "tonno":"tonno","tono":"tonno","tonnno":"tonno",
    "vongole":"vongole","vongoole":"vongole","vongolle":"vongole",
    "cozze":"cozze","cozzze":"cozze",
    "peperoncino":"peperoncino","peperonccino":"peperoncino","peperonchino":"peperoncino",
    "aceto":"aceto","acetto":"aceto",
    "limone":"limone","limonne":"limone","limmone":"limone",
    "burro":"burro","burroo":"burro",
    "panna":"panna","pannna":"panna",
    "aglio":"aglio","agllio":"aglio",
    "prosciuto":"prosciutto","prosciuttto":"prosciutto","prociutto":"prosciutto",
    "bresaola":"bresaola","bresaolla":"bresaola",
    "gorgonzola":"gorgonzola","gorgonzolla":"gorgonzola",
    "tartufo":"tartufo","tartuffo":"tartufo",
    "asparaggi":"asparagi","asparagii":"asparagi",
    "melanzane":"melanzane","melanzanee":"melanzane","melanzana":"melanzane",
    "zucchine":"zucchine","zuccine":"zucchine","zucchina":"zucchine",
    "carciofi":"carciofi","carcioffi":"carciofi","carciofo":"carciofi",
    "piccante":"piccante","piccantte":"piccante","picante":"piccante",
    "affumicato":"affumicato","affumicatto":"affumicato",
    "grigliata":"grigliata","griglliata":"grigliata","grigliatta":"grigliata",
    "arrosto":"arrosto","arosto":"arrosto","arrossto":"arrosto",
    "brodo":"brodo","broddo":"brodo",
    "ragu":"ragù","ragù":"ragù","raguù":"ragù",
    "pesto":"pesto","peesto":"pesto",
    "friggitello":"friggitello",
    "cotoletta":"cotoletta","cottoletta":"cotoletta",
    "polenta":"polenta","pollenta":"polenta",
    "selvagina":"selvaggina","selvagggina":"selvaggina",
    "formagio":"formaggio","formaggo":"formaggio","fromaggio":"formaggio",
    "insalatta":"insalata","insallata":"insalata",
    "friture":"frittura","frittuura":"frittura",
    "sushii":"sushi","susci":"sushi",
    "ostriche":"ostriche","hostriche":"ostriche",
}

def correggi_piatto(testo: str) -> tuple[str, bool]:
    """Corregge automaticamente i refusi più comuni in un testo di piatto/ingredienti.
    Ritorna (testo_corretto, è_stato_modificato). Usa prima il dizionario mirato,
    poi un fallback fuzzy (difflib) sulle parole più lunghe di 4 lettere non trovate
    nel dizionario, per intercettare refusi non previsti senza introdurre falsi positivi
    su parole corte (dove il fuzzy matching è troppo rischioso)."""
    if not testo or not testo.strip():
        return testo, False

    parole = testo.split(" ")
    corrette = []
    modificato = False
    vocabolario_fuzzy = list(set(_CORREZIONI_DIZIONARIO.values()))

    for parola in parole:
        # isola punteggiatura eventuale ai bordi per non romperla
        prefisso = ""
        suffisso = ""
        nucleo = parola
        while nucleo and not nucleo[0].isalnum():
            prefisso += nucleo[0]; nucleo = nucleo[1:]
        while nucleo and not nucleo[-1].isalnum():
            suffisso = nucleo[-1] + suffisso; nucleo = nucleo[:-1]

        if not nucleo:
            corrette.append(parola)
            continue

        chiave = nucleo.lower()
        if chiave in _CORREZIONI_DIZIONARIO:
            sostituto = _CORREZIONI_DIZIONARIO[chiave]
            # rispetta la capitalizzazione originale (iniziale maiuscola se era maiuscola)
            if nucleo[0].isupper():
                sostituto = sostituto.capitalize()
            corrette.append(prefisso + sostituto + suffisso)
            if sostituto.lower() != chiave:
                modificato = True
        elif len(chiave) > 4:
            match = difflib.get_close_matches(chiave, vocabolario_fuzzy, n=1, cutoff=0.84)
            if match and match[0] != chiave:
                sostituto = match[0]
                if nucleo[0].isupper():
                    sostituto = sostituto.capitalize()
                corrette.append(prefisso + sostituto + suffisso)
                modificato = True
            else:
                corrette.append(parola)
        else:
            corrette.append(parola)

    return " ".join(corrette), modificato

# ─────────────────────────────────────────────
# SCHEDA TECNICA VINO — link di ricerca verso la scheda tecnica ufficiale
# (denominazione, dati enologici, produttore), oltre ai dati già nel catalogo.
# ─────────────────────────────────────────────
def scheda_tecnica_url(wine: dict) -> str:
    query = f"{wine.get('nome','')} scheda tecnica DOC DOCG produttore"
    return "https://www.google.com/search?q=" + query.replace(" ", "+").replace("'", "")

# ─────────────────────────────────────────────
# CALIBRAZIONE DA FEEDBACK REALI — "l'AI che si autoallena" (step 1: calibrazione)
# ─────────────────────────────────────────────
# Non è un fine-tuning vero (serve un volume di dati molto più grande), ma un
# livello di ricalibrazione statistica sopra il punteggio dell'AI: se gli utenti
# valutano sistematicamente un vino sopra o sotto quanto l'AI si aspetta, il
# punteggio mostrato viene corretto di conseguenza. È il primo mattone del
# "motore che impara dai dati reali" descritto nella strategia di prodotto.
def get_feedback_calibration(wine_name: str) -> dict:
    """Ritorna la media delle valutazioni utente (1-10) e il numero di voti
    raccolti per un vino specifico, aggregando tutte le ricerche/piatti."""
    try:
        conn = sqlite3.connect(DB_PATH); c = conn.cursor()
        c.execute("SELECT AVG(rating), COUNT(*) FROM wine_feedback WHERE wine_name=?", (wine_name,))
        row = c.fetchone(); conn.close()
        avg_rating, n = row[0], row[1]
        return {"avg_rating": round(avg_rating, 1) if avg_rating else None, "n": n or 0}
    except Exception:
        return {"avg_rating": None, "n": 0}

def calibra_score(score_ai: int, wine_name: str) -> dict:
    """Applica una piccola correzione allo score AI in base ai voti reali raccolti.
    Regole (volutamente prudenti, per non stravolgere l'analisi chimica con pochi voti):
    - Servono almeno 3 valutazioni prima di correggere qualcosa (evita che 1 voto isolato
      distorca il punteggio).
    - La correzione massima è ±8 punti, e cresce con il numero di voti raccolti
      (più dati = più fiducia nella calibrazione), fino a un tetto di 20 voti.
    - Se il voto medio (1-10) corrisponde grosso modo allo score AI (score/10), non si
      corregge nulla: si interviene solo quando c'è uno scarto sistematico.
    """
    cal = get_feedback_calibration(wine_name)
    if not cal["avg_rating"] or cal["n"] < 3:
        return {"score_calibrato": score_ai, "delta": 0, "n_voti": cal["n"], "calibrato": False}

    atteso = score_ai / 10.0          # lo score AI "tradotto" in scala 1-10
    scarto = cal["avg_rating"] - atteso
    peso = min(cal["n"] / 20.0, 1.0)  # fiducia crescente con più voti, tetto a 20 voti
    delta = round(scarto * 10 * 0.4 * peso)   # correzione prudente: max ~40% dello scarto
    delta = max(-8, min(8, delta))            # tetto assoluto ±8 punti
    if delta == 0:
        return {"score_calibrato": score_ai, "delta": 0, "n_voti": cal["n"], "calibrato": False}
    nuovo = max(0, min(100, score_ai + delta))
    return {"score_calibrato": nuovo, "delta": delta, "n_voti": cal["n"], "calibrato": True}

# ─────────────────────────────────────────────
# CATALOGO VINI
# ─────────────────────────────────────────────
BASE_SHOP = "https://www.bwine.shop/vini"
SHOP_DOMAIN = "bwine.shop"

# Non avendo foto reali delle bottiglie, invece di usare immagini stock scaricate
# dal web (che non corrispondono ai vini veri, ingannando il visitatore), generiamo
# una bottiglia stilizzata SVG per ogni TIPO di vino (Rosso, Bianco, Spumante,
# Rosato, Dolce). Nessuna chiamata esterna: l'immagine è generata al volo e incorporata
# come data-URI, quindi funziona anche offline e non dipende da servizi terzi.
BOTTLE_COLORS = {
    "Rosso":    ("#6b0f1a", "#3d0a10"),
    "Bianco":   ("#d7c873", "#a6913a"),
    "Spumante": ("#e8c766", "#a97e12"),
    "Rosato":   ("#e8a3b8", "#c1547a"),
    "Dolce":    ("#c98a2e", "#8a5a12"),
}

@functools.lru_cache(maxsize=None)
def bottle_svg_data_uri(tipo: str) -> str:
    # lru_cache: solo ~5 tipi di vino esistono (Rosso/Bianco/Spumante/Rosato/Dolce),
    # ma questa funzione veniva rigenerata da zero per ognuna delle ~500 etichette
    # del catalogo, ad OGNI rerun di Streamlit (il catalogo è definito a livello di
    # modulo e quindi si ricostruisce ogni volta). Con la cache, i tipi ripetuti
    # riusano l'SVG già codificato invece di rigenerarlo e ri-codificarlo in base64.
    fill, dark = BOTTLE_COLORS.get(tipo, ("#6b0f1a", "#3d0a10"))
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 400" width="200" height="400">
  <rect width="200" height="400" fill="#f6f1ea"/>
  <path d="M85 18 h30 v46 q0 16 16 26 q19 13 19 42 v226 q0 22 -22 22 h-56 q-22 0 -22 -22 v-226 q0 -29 19 -42 q16 -10 16 -26 z"
        fill="{fill}" stroke="{dark}" stroke-width="4"/>
  <rect x="80" y="6" width="40" height="18" rx="3" fill="{dark}"/>
  <rect x="58" y="205" width="84" height="66" fill="#fffdf8" stroke="{dark}" stroke-width="2" opacity="0.95"/>
  <text x="100" y="233" font-family="Georgia, 'Times New Roman', serif" font-size="15" text-anchor="middle" fill="{dark}">{tipo}</text>
  <text x="100" y="252" font-family="Georgia, 'Times New Roman', serif" font-size="11" text-anchor="middle" fill="{dark}" font-style="italic">Bwine</text>
  <ellipse cx="100" cy="120" rx="10" ry="22" fill="#ffffff" opacity="0.18"/>
</svg>"""
    b64 = base64.b64encode(svg.encode("utf-8")).decode("ascii")
    return f"data:image/svg+xml;base64,{b64}"

def W(id,nome,regione,continente,tipo,fascia,prezzo,uva,alcol,acidita,tannini,corpo,rz,profilo,abbina,non_abbina,slug,foto_key):
    return {
        "id":id,"nome":nome,"regione":regione,"continente":continente,"tipo":tipo,
        "fascia":fascia,"prezzo":prezzo,"uva":uva,"alcol":alcol,"acidita":acidita,
        "tannini":tannini,"corpo":corpo,"residuo_zuccherino":rz,
        "profilo_aromatico":profilo,"abbina_bene_con":abbina,"non_abbina_con":non_abbina,
        "slug":slug,"foto":bottle_svg_data_uri(tipo)
    }

WINE_CATALOG = [
    # ── 100 nuove etichette (espansione a 500 vini, prezzi 2026) ──
    W("NEW001","Cerasuolo d'Abruzzo DOC Superiore Valentini","Abruzzo","Italia","Rosato","premium",38,"Montepulciano",13.0,"alta","leggeri","medio",2.0,["ciliegia","melagrana","erbe mediterranee","agrumi rossi"],["arrosticini","pesce alla brace","pasta allo scoglio","formaggi freschi"],["carne rossa pesante","selvaggina"],"cerasuolo-abruzzo-valentini","rosato"),
    W("NEW002","Trebbiano d'Abruzzo DOC Emidio Pepe","Abruzzo","Italia","Bianco","standard",26,"Trebbiano",12.5,"alta","assenti","medio",1.5,["camomilla","pesca bianca","erbe di campo","miele leggero"],["brodetto di pesce","formaggi di pecora freschi","zuppe di legumi"],["carne rossa","piatti molto piccanti"],"trebbiano-abruzzo-pepe","bianco_nord"),
    W("NEW003","Montepulciano d'Abruzzo DOC Colline Teramane Riserva","Abruzzo","Italia","Rosso","standard",24,"Montepulciano",14.0,"media","strutturati","pieno",1.0,["mora","liquirizia","spezie scure","cacao"],["arrosticini","agnello alla brace","formaggi pecorino stagionati"],["pesce delicato","crudi"],"montepulciano-colline-teramane","rosso_piemonte"),
    W("NEW004","Verdicchio dei Castelli di Jesi DOC Classico Riserva","Marche","Italia","Bianco","standard",21,"Verdicchio",13.0,"alta","assenti","medio-pieno",1.8,["mandorla","erbe alpine","agrumi","mineralità salina"],["brodetto anconetano","pesce al forno","risotto ai frutti di mare"],["carne rossa","formaggi molto stagionati"],"verdicchio-jesi-riserva","bianco_nord"),
    W("NEW005","Rosso Conero DOCG Riserva Umani Ronchi","Marche","Italia","Rosso","standard",27,"Montepulciano",14.0,"media","medi","pieno",1.2,["ciliegia nera","spezie dolci","tabacco leggero"],["coniglio in porchetta","salumi marchigiani","formaggi stagionati"],["pesce","crostacei"],"rosso-conero-umani-ronchi","rosso_toscana"),
    W("NEW006","Sagrantino di Montefalco DOCG Arnaldo Caprai","Umbria","Italia","Rosso","premium",42,"Sagrantino",14.5,"alta","titanici","pieno",0.8,["mora selvatica","cacao amaro","spezie orientali","cuoio"],["cinghiale in umido","selvaggina","formaggi pecorino di fossa"],["pesce","piatti delicati"],"sagrantino-montefalco-caprai","rosso_toscana"),
    W("NEW007","Orvieto Classico DOC Superiore Antinori","Umbria","Italia","Bianco","standard",19,"Grechetto + Trebbiano",12.5,"media","assenti","leggero-medio",2.0,["fiori bianchi","mela","mandorla dolce"],["pasta al tartufo nero umbro","pesce di lago","formaggi freschi"],["carne rossa","selvaggina"],"orvieto-classico-antinori","bianco_nord"),
    W("NEW008","Cesanese del Piglio DOCG Casale della Ioria","Lazio","Italia","Rosso","standard",23,"Cesanese",13.5,"media","medi","medio-pieno",1.0,["frutti di bosco","pepe nero","viola"],["abbacchio alla romana","salumi laziali","formaggi pecorino romano"],["pesce crudo","crostacei"],"cesanese-piglio-ioria","rosso_toscana"),
    W("NEW009","Frascati Superiore DOCG Villa Simone","Lazio","Italia","Bianco","standard",15,"Malvasia + Trebbiano",12.5,"media","assenti","leggero",1.5,["pesca","fiori bianchi","mandorla fresca"],["carciofi alla giudia","pasta cacio e pepe","fritti romani"],["carne rossa pesante","cioccolato"],"frascati-superiore-villa-simone","bianco_nord"),
    W("NEW010","Taurasi DOCG Riserva Mastroberardino","Campania","Italia","Rosso","premium",44,"Aglianico",14.0,"alta","potenti","pieno",0.7,["prugna scura","tabacco","spezie nobili","terra vulcanica"],["ragù napoletano","agnello al forno","formaggi stagionati di bufala"],["pesce","crudi di mare"],"taurasi-riserva-mastroberardino","rosso_toscana"),
    W("NEW011","Fiano di Avellino DOCG Feudi di San Gregorio","Campania","Italia","Bianco","standard",23,"Fiano",13.0,"alta","assenti","medio-pieno",1.8,["nocciola tostata","miele","fiori di campo","agrumi"],["pesce al forno","impepata di cozze","formaggi di bufala"],["carne rossa","selvaggina"],"fiano-avellino-feudi","bianco_nord"),
    W("NEW012","Greco di Tufo DOCG Terredora","Campania","Italia","Bianco","standard",20,"Greco",12.5,"alta","assenti","medio",1.5,["agrumi","pietra focaia","erbe mediterranee"],["frutti di mare crudi","spaghetti alle vongole","pesce alla griglia"],["carne rossa","dolci"],"greco-tufo-terredora","bianco_nord"),
    W("NEW013","Aglianico del Vulture DOC Superiore Elena Fucci","Basilicata","Italia","Rosso","premium",31,"Aglianico",14.5,"alta","potenti","pieno",0.8,["frutti neri","grafite","spezie vulcaniche"],["agnello alla lucana","salumi","formaggi stagionati"],["pesce","piatti leggeri"],"aglianico-vulture-fucci","rosso_toscana"),
    W("NEW014","Cirò Rosso DOC Classico Superiore Librandi","Calabria","Italia","Rosso","standard",17,"Gaglioppo",13.5,"media","medi","medio",1.2,["ciliegia","erbe mediterranee","spezie leggere"],["nduja","pasta alla calabrese","salumi piccanti"],["pesce delicato","dolci"],"ciro-rosso-librandi","rosso_toscana"),
    W("NEW015","Etna Rosso DOC Tenuta delle Terre Nere","Sicilia","Italia","Rosso","premium",32,"Nerello Mascalese",13.5,"alta","fini","medio",0.9,["ciliegia","lava","erbe di montagna","agrumi rossi"],["pasta alla norma","carne alla brace","formaggi siciliani"],["pesce crudo","dolci"],"etna-rosso-terre-nere","rosso_piemonte"),
    W("NEW016","Etna Bianco DOC Superiore Benanti","Sicilia","Italia","Bianco","standard",27,"Carricante",12.5,"alta","assenti","medio",1.6,["agrumi","mineralità vulcanica","fiori bianchi"],["pesce spada alla siciliana","cous cous di pesce","frutti di mare"],["carne rossa","selvaggina"],"etna-bianco-benanti","bianco_nord"),
    W("NEW017","Nero d'Avola DOC Sicilia Planeta","Sicilia","Italia","Rosso","standard",19,"Nero d'Avola",14.0,"media","morbidi","pieno",1.0,["mora","spezie dolci","frutta matura"],["pasta con le sarde","involtini siciliani","formaggi stagionati"],["pesce delicato","crostacei"],"nero-avola-planeta","rosso_toscana"),
    W("NEW018","Vermentino di Sardegna DOC Argiolas Costamolino","Sardegna","Italia","Bianco","standard",15,"Vermentino",13.0,"alta","assenti","leggero-medio",1.8,["macchia mediterranea","agrumi","erbe aromatiche"],["fregola ai frutti di mare","pesce alla griglia","bottarga"],["carne rossa","selvaggina"],"vermentino-sardegna-argiolas","bianco_nord"),
    W("NEW019","Cannonau di Sardegna DOC Riserva Sella & Mosca","Sardegna","Italia","Rosso","standard",25,"Cannonau",14.5,"media","strutturati","pieno",1.0,["prugna","macchia mediterranea","spezie scure"],["porceddu","salsiccia sarda","formaggi pecorino sardo"],["pesce crudo","piatti delicati"],"cannonau-riserva-sella-mosca","rosso_toscana"),
    W("NEW020","Alto Adige Gewürztraminer DOC Alois Lageder","Trentino-Alto Adige","Italia","Bianco","standard",29,"Gewürztraminer",14.0,"media","assenti","pieno",6.0,["litchi","rosa","frutta esotica","spezie orientali"],["cucina speziata asiatica","formaggi erborinati","foie gras"],["pesce delicato","piatti acidi"],"gewurztraminer-lageder","bianco_nord"),
    W("NEW021","Trentino Superiore DOC Teroldego Rotaliano Foradori","Trentino-Alto Adige","Italia","Rosso","standard",26,"Teroldego",13.5,"alta","medi","medio-pieno",1.0,["mora","viola","erbe di montagna"],["canederli allo speck","selvaggina di montagna","formaggi di malga"],["pesce","crostacei"],"teroldego-foradori","rosso_piemonte"),
    W("NEW022","Friuli Collio DOC Sauvignon Blanc Venica","Friuli-Venezia Giulia","Italia","Bianco","standard",24,"Sauvignon Blanc",13.0,"alta","assenti","medio",1.5,["pompelmo","foglia di pomodoro","fiori bianchi"],["asparagi","pesce di mare","formaggi freschi"],["carne rossa","cioccolato"],"collio-sauvignon-venica","bianco_nord"),
    W("NEW023","Friuli Colli Orientali DOC Ribolla Gialla Livio Felluga","Friuli-Venezia Giulia","Italia","Bianco","standard",23,"Ribolla Gialla",12.5,"alta","assenti","leggero-medio",1.6,["mela verde","agrumi","erbe di campo"],["prosciutto San Daniele","pesce di lago","formaggi montasio"],["carne rossa","selvaggina"],"ribolla-gialla-felluga","bianco_nord"),
    W("NEW024","Champagne Brut Grand Cru Bollinger Special Cuvée","Champagne","Francia","Spumante","lusso",89.7,"Pinot Noir + Chardonnay",12.5,"alta","assenti","medio-pieno",9.0,["mela cotogna","crosta di pane","agrumi","note lattee"],["ostriche","caviale","pesce crudo","tempura"],["carne rossa pesante","dolci molto zuccherini"],"champagne-bollinger-special-cuvee","spumante"),
    W("NEW025","Champagne Rosé Laurent-Perrier","Champagne","Francia","Spumante","lusso",79.3,"Pinot Noir + Chardonnay",12.0,"alta","assenti","medio",8.0,["fragola","lampone","crosta di pane"],["salmone affumicato","fragole con panna","aperitivo raffinato"],["carne rossa","formaggi molto stagionati"],"champagne-laurent-perrier-rose","spumante"),
    W("NEW026","Pouilly-Fuissé AOC Domaine Ferret","Borgogna","Francia","Bianco","premium",46,"Chardonnay",13.0,"alta","assenti","pieno",1.5,["burro noisette","pietra focaia","frutta a polpa bianca"],["capesante scottate","pollo alla panna","formaggi di capra"],["carne rossa pesante","piatti molto piccanti"],"pouilly-fuisse-ferret","bianco_nord"),
    W("NEW027","Chablis AOC Premier Cru Fourchaume William Fèvre","Borgogna","Francia","Bianco","premium",38,"Chardonnay",12.5,"altissima","assenti","medio",1.2,["ostrica","gesso","agrumi verdi"],["ostriche","pesce crudo","frutti di mare al vapore"],["carne rossa","piatti dolci"],"chablis-premier-cru-fevre","bianco_nord"),
    W("NEW028","Gevrey-Chambertin AOC Domaine Trapet","Borgogna","Francia","Rosso","lusso",109.2,"Pinot Nero",13.0,"alta","fini","medio",0.6,["ciliegia","sottobosco","spezie fini"],["anatra all'arancia","funghi porcini","formaggi a pasta molle"],["pesce fritto","piatti molto piccanti"],"gevrey-chambertin-trapet","rosso_veneto"),
    W("NEW029","Pauillac AOC Château Grand-Puy-Lacoste","Bordeaux","Francia","Rosso","lusso",82.8,"Cabernet Sauvignon + Merlot",13.5,"media","strutturati","pieno",0.7,["ribes nero","cedro","grafite","tabacco"],["agnello arrosto","filetto al pepe verde","formaggi stagionati duri"],["pesce delicato","piatti agrodolci"],"pauillac-grand-puy-lacoste","rosso_toscana"),
    W("NEW030","Saint-Émilion Grand Cru AOC Château Fonplégade","Bordeaux","Francia","Rosso","premium",58,"Merlot + Cabernet Franc",14.0,"media","vellutati","pieno",0.6,["prugna","cioccolato","spezie dolci"],["anatra","brasato di manzo","formaggi erborinati"],["pesce crudo","crostacei"],"saint-emilion-fonplegade","rosso_toscana"),
    W("NEW031","Sancerre AOC Domaine Vacheron","Loira","Francia","Bianco","standard",28,"Sauvignon Blanc",13.0,"alta","assenti","leggero-medio",1.3,["pompelmo","selce","erba tagliata"],["capra fresca","spaghetti alle vongole","pesce di fiume"],["carne rossa","dolci"],"sancerre-vacheron","bianco_nord"),
    W("NEW032","Châteauneuf-du-Pape AOC Château de Beaucastel","Rodano","Francia","Rosso","premium",62,"Grenache + Syrah + Mourvèdre",14.5,"media","strutturati","pieno",0.9,["frutti neri","erbe della garrigue","pepe nero","cuoio"],["agnello alle erbe","selvaggina","formaggi stagionati"],["pesce delicato","piatti molto acidi"],"chateauneuf-beaucastel","rosso_toscana"),
    W("NEW033","Alsace Riesling Grand Cru Trimbach","Alsazia","Francia","Bianco","premium",34,"Riesling",12.5,"alta","assenti","medio",4.0,["lime","pietra bagnata","fiori bianchi"],["choucroute","pesce affumicato","cucina asiatica speziata"],["carne rossa pesante","cioccolato"],"riesling-trimbach-grand-cru","bianco_nord"),
    W("NEW034","Ribera del Duero DO Vega Sicilia Valbuena","Castiglia e León","Spagna","Rosso","lusso",126.5,"Tempranillo",14.0,"media","strutturati","pieno",0.7,["frutti neri","vaniglia","cuoio nobile"],["cordero asado","carne alla brace","formaggi manchego stagionati"],["pesce","piatti leggeri"],"ribera-duero-vega-sicilia","rosso_toscana"),
    W("NEW035","Priorat DOQ Clos Mogador","Catalogna","Spagna","Rosso","lusso",78.2,"Garnacha + Cariñena",14.5,"media","potenti","pieno",0.8,["frutti scuri","minerale","spezie mediterranee"],["carni alla brace","stufati catalani","formaggi stagionati"],["pesce delicato","crudi"],"priorat-clos-mogador","rosso_toscana"),
    W("NEW036","Rioja DOCa Reserva Marqués de Murrieta","La Rioja","Spagna","Rosso","standard",27,"Tempranillo",13.5,"media","medi","medio-pieno",1.0,["ciliegia","vaniglia","spezie dolci del rovere americano"],["paella di carne","jamón ibérico","formaggi manchego"],["pesce crudo","dolci"],"rioja-reserva-murrieta","rosso_toscana"),
    W("NEW037","Albariño DO Rías Baixas Pazo Señorans","Galizia","Spagna","Bianco","standard",21,"Albariño",12.5,"alta","assenti","leggero-medio",1.8,["pesca","sale marino","agrumi"],["pulpo a la gallega","frutti di mare","pesce alla griglia"],["carne rossa","formaggi molto stagionati"],"albarino-pazo-senorans","bianco_nord"),
    W("NEW038","Cava DO Brut Nature Gramona","Catalogna","Spagna","Spumante","standard",19,"Xarel·lo + Macabeo + Parellada",12.0,"alta","assenti","leggero",2.0,["mela verde","crosta di pane","agrumi"],["tapas","jamón","frittura di pesce"],["carne rossa pesante","dolci molto dolci"],"cava-gramona-brut-nature","spumante"),
    W("NEW039","Jerez Fino DO Tio Pepe","Andalusia","Spagna","Bianco","standard",17,"Palomino",15.0,"altissima","assenti","leggero",1.0,["mandorla amara","salsedine","lievito"],["jamón ibérico","olive","frutti di mare fritti"],["dolci","carne rossa"],"jerez-fino-tio-pepe","bianco_nord"),
    W("NEW040","Douro DOC Tinto Reserva Quinta do Crasto","Douro","Portogallo","Rosso","standard",28,"Touriga Nacional + Touriga Franca",14.0,"media","strutturati","pieno",0.9,["frutti neri","violetta","spezie"],["bacalhau assado","carni alla brace","formaggi da capra stagionati"],["pesce crudo","piatti leggeri"],"douro-crasto-reserva","rosso_toscana"),
    W("NEW041","Vinho Verde DOC Soalheiro Alvarinho","Minho","Portogallo","Bianco","standard",16,"Alvarinho",12.0,"alta","assenti","leggero",1.5,["lime","fiori bianchi","leggera effervescenza"],["frutti di mare","bacalhau à brás","insalate estive"],["carne rossa","piatti molto grassi"],"vinho-verde-soalheiro","bianco_nord"),
    W("NEW042","Porto Tawny 20 anni Taylor's","Douro","Portogallo","Dolce","premium",52,"Touriga Nacional e altre autoctone",20.0,"media","medi","pieno",130.0,["noce","caramello","fico secco","spezie dolci"],["formaggi erborinati","dolci alle noci","cioccolato fondente"],["piatti salati leggeri","pesce"],"porto-tawny-20-taylors","dolce"),
    W("NEW043","Mosel Riesling Kabinett Dr. Loosen","Mosel","Germania","Bianco","standard",19,"Riesling",8.5,"altissima","assenti","leggero",35.0,["pesca","lime","ardesia","fiori bianchi"],["cucina thai speziata","involtini primavera","formaggi freschi"],["carne rossa","piatti molto grassi"],"mosel-riesling-kabinett-loosen","bianco_nord"),
    W("NEW044","Pfalz Spätburgunder Reserve Knipser","Pfalz","Germania","Rosso","premium",33,"Pinot Nero",13.5,"alta","fini","medio",0.8,["ciliegia","sottobosco","spezie leggere"],["anatra arrosto","funghi","formaggi a pasta molle"],["pesce fritto","piatti molto piccanti"],"pfalz-spatburgunder-knipser","rosso_veneto"),
    W("NEW045","Wachau Grüner Veltliner Smaragd F.X. Pichler","Wachau","Austria","Bianco","premium",44,"Grüner Veltliner",13.5,"alta","assenti","medio-pieno",1.5,["pepe bianco","mela verde","erbe alpine"],["wiener schnitzel","asparagi bianchi","pesce di fiume"],["carne rossa pesante","dolci"],"wachau-gruner-veltliner-pichler","bianco_nord"),
    W("NEW046","Burgenland Blaufränkisch Reserve Moric","Burgenland","Austria","Rosso","premium",36,"Blaufränkisch",13.0,"alta","medi","medio-pieno",0.9,["frutti di bosco","pepe nero","erbe selvatiche"],["gulasch","selvaggina","formaggi stagionati"],["pesce","crostacei"],"burgenland-blaufrankisch-moric","rosso_toscana"),
    W("NEW047","Santorini PDO Assyrtiko Domaine Sigalas","Santorini","Grecia","Bianco","standard",27,"Assyrtiko",13.5,"altissima","assenti","medio",1.2,["agrumi","cenere vulcanica","erbe mediterranee"],["polpo alla griglia","pesce di mare","formaggi feta"],["carne rossa","dolci"],"santorini-assyrtiko-sigalas","bianco_nord"),
    W("NEW048","Naoussa PDO Xinomavro Riserva Boutari","Macedonia","Grecia","Rosso","standard",24,"Xinomavro",13.5,"alta","potenti","medio-pieno",1.0,["pomodoro secco","olive","spezie mediterranee"],["moussaka","agnello al forno","formaggi stagionati"],["pesce delicato","crudi"],"naoussa-xinomavro-boutari","rosso_toscana"),
    W("NEW049","Tokaji Aszú 5 Puttonyos Disznókő","Tokaj","Ungheria","Dolce","premium",58,"Furmint + Hárslevelű",11.5,"alta","assenti","pieno",150.0,["albicocca secca","miele","zafferano","agrumi canditi"],["foie gras","formaggi erborinati","dolci di pasta di mandorle"],["piatti salati","carne rossa"],"tokaji-aszu-disznoko","dolce"),
    W("NEW050","Villány Cuvée Riserva Bock","Villány","Ungheria","Rosso","standard",29,"Cabernet Franc + Merlot",14.0,"media","strutturati","pieno",0.8,["frutti scuri","spezie dolci","cioccolato"],["gulasch ungherese","selvaggina","formaggi stagionati"],["pesce","piatti leggeri"],"villany-cuvee-bock","rosso_toscana"),
    W("NEW051","Dingač PDO Plavac Mali Bura","Dalmazia","Croazia","Rosso","premium",31,"Plavac Mali",14.5,"media","strutturati","pieno",0.9,["prugna scura","macchia mediterranea","spezie scure"],["pesce alla griglia","agnello","formaggi stagionati dalmati"],["pesce crudo delicato","dolci"],"dingac-plavac-mali-bura","rosso_toscana"),
    W("NEW052","Valais AOC Fendant Domaine Chappaz","Vallese","Svizzera","Bianco","standard",26,"Chasselas",12.0,"media","assenti","leggero",1.5,["mela","fiori bianchi","mineralità alpina"],["raclette","fonduta di formaggio","pesce di lago"],["carne rossa","piatti piccanti"],"valais-fendant-chappaz","bianco_nord"),
    W("NEW053","English Sparkling Brut Nyetimber Classic Cuvée","Sussex","Inghilterra","Spumante","premium",48,"Chardonnay + Pinot Nero + Pinot Meunier",12.0,"altissima","assenti","medio",8.0,["mela verde","agrumi","crosta di pane","fiori bianchi"],["pesce e patatine","frutti di mare","formaggi freschi inglesi"],["carne rossa pesante","dolci molto dolci"],"english-sparkling-nyetimber","spumante"),
    W("NEW054","Napa Valley Cabernet Sauvignon Stag's Leap","California","USA","Rosso","lusso",82.8,"Cabernet Sauvignon",14.5,"media","strutturati","pieno",0.6,["cassis","cedro","vaniglia","cioccolato"],["bistecca alla griglia","costolette di manzo","formaggi stagionati americani"],["pesce delicato","crudi"],"napa-cabernet-stags-leap","rosso_toscana"),
    W("NEW055","Sonoma Coast Pinot Noir Kistler","California","USA","Rosso","lusso",74.8,"Pinot Nero",13.5,"alta","fini","medio",0.5,["ciliegia","fragola","sottobosco","spezie leggere"],["salmone alla griglia","anatra","funghi selvatici"],["pesce fritto","piatti piccanti"],"sonoma-pinot-kistler","rosso_veneto"),
    W("NEW056","Willamette Valley Pinot Gris Eyrie Vineyards","Oregon","USA","Bianco","standard",28,"Pinot Grigio",13.0,"media","assenti","medio",2.5,["pera","mela","fiori bianchi delicati"],["pesce al forno","insalate estive","formaggi freschi"],["carne rossa","selvaggina"],"willamette-pinot-gris-eyrie","bianco_nord"),
    W("NEW057","Finger Lakes Riesling Dry Hermann J. Wiemer","New York","USA","Bianco","standard",24,"Riesling",11.5,"alta","assenti","leggero-medio",4.0,["lime","pesca bianca","mineralità"],["cucina asiatica","pesce affumicato","formaggi di capra"],["carne rossa pesante","cioccolato"],"finger-lakes-riesling-wiemer","bianco_nord"),
    W("NEW058","Okanagan Valley Chardonnay Mission Hill","Columbia Britannica","Canada","Bianco","standard",27,"Chardonnay",13.0,"media","assenti","medio-pieno",1.8,["burro","mela gialla","vaniglia leggera"],["salmone al forno","pollo alla panna","formaggi semi-stagionati"],["carne rossa","piatti piccanti"],"okanagan-chardonnay-mission-hill","bianco_nord"),
    W("NEW059","Niagara Peninsula Icewine Vidal Inniskillin","Ontario","Canada","Dolce","premium",62,"Vidal",10.0,"alta","assenti","pieno",200.0,["albicocca","miele","agrumi canditi"],["foie gras","formaggi erborinati","dessert alla frutta"],["piatti salati pesanti","carne rossa"],"niagara-icewine-inniskillin","dolce"),
    W("NEW060","Valle de Uco Malbec Catena Zapata","Mendoza","Argentina","Rosso","standard",26,"Malbec",14.5,"media","strutturati","pieno",0.7,["prugna","viola","cioccolato","spezie andine"],["asado argentino","bistecca alla griglia","formaggi stagionati"],["pesce delicato","crudi"],"uco-malbec-catena-zapata","rosso_toscana"),
    W("NEW061","Casablanca Valley Sauvignon Blanc Casas del Bosque","Valle di Casablanca","Cile","Bianco","standard",17,"Sauvignon Blanc",13.0,"alta","assenti","leggero-medio",1.6,["pompelmo","erba tagliata","frutto della passione"],["ceviche","pesce alla griglia","frutti di mare"],["carne rossa","dolci"],"casablanca-sauvignon-bosque","bianco_nord"),
    W("NEW062","Colchagua Valley Carmenère Montes Alpha","Valle di Colchagua","Cile","Rosso","standard",22,"Carmenère",14.0,"media","medi","medio-pieno",0.8,["prugna","paprika dolce","cioccolato"],["carne alla griglia","empanadas","formaggi stagionati"],["pesce crudo","piatti agrodolci"],"colchagua-carmenere-montes","rosso_toscana"),
    W("NEW063","Tannat Reserva Bodega Garzón","Maldonado","Uruguay","Rosso","standard",23,"Tannat",13.5,"alta","potenti","pieno",1.0,["mora","pepe nero","erbe selvatiche"],["asado uruguaiano","carne alla griglia","formaggi stagionati"],["pesce delicato","dolci"],"tannat-garzon-reserva","rosso_toscana"),
    W("NEW064","Vale dos Vinhedos Espumante Brut Miolo","Rio Grande do Sul","Brasile","Spumante","standard",21,"Chardonnay + Pinot Nero",12.0,"alta","assenti","leggero",7.0,["mela verde","agrumi","lievito fresco"],["feijoada leggera","aperitivo","frutti di mare"],["carne rossa pesante","dolci molto dolci"],"vale-vinhedos-miolo-brut","spumante"),
    W("NEW065","Barossa Valley Shiraz Penfolds Bin 28","Barossa Valley","Australia","Rosso","premium",34,"Shiraz",14.5,"media","strutturati","pieno",0.6,["mora","pepe nero","cioccolato","eucalipto"],["bistecca alla griglia","costine BBQ","formaggi stagionati"],["pesce delicato","crudi"],"barossa-shiraz-penfolds-bin28","rosso_toscana"),
    W("NEW066","Margaret River Chardonnay Leeuwin Estate","Margaret River","Australia","Bianco","premium",48,"Chardonnay",13.0,"alta","assenti","medio-pieno",1.5,["pesca bianca","burro noisette","agrumi"],["aragosta alla griglia","pollo alla panna","formaggi semi-stagionati"],["carne rossa","piatti molto piccanti"],"margaret-river-chardonnay-leeuwin","bianco_nord"),
    W("NEW067","Clare Valley Riesling Grosset Polish Hill","Clare Valley","Australia","Bianco","premium",36,"Riesling",12.0,"altissima","assenti","leggero",1.0,["lime","gelsomino","mineralità"],["cucina thailandese","pesce crudo","formaggi freschi di capra"],["carne rossa pesante","cioccolato"],"clare-riesling-grosset","bianco_nord"),
    W("NEW068","Marlborough Sauvignon Blanc Cloudy Bay","Marlborough","Nuova Zelanda","Bianco","premium",31,"Sauvignon Blanc",13.0,"alta","assenti","medio",1.5,["frutto della passione","pompelmo","erba tagliata"],["cozze alla neozelandese","insalate estive","formaggi di capra"],["carne rossa","dolci"],"marlborough-sauvignon-cloudy-bay","bianco_nord"),
    W("NEW069","Central Otago Pinot Noir Felton Road","Central Otago","Nuova Zelanda","Rosso","premium",54,"Pinot Nero",13.5,"alta","fini","medio",0.6,["ciliegia","lampone","spezie leggere","sottobosco"],["agnello neozelandese","anatra","funghi porcini"],["pesce fritto","piatti piccanti"],"central-otago-pinot-felton-road","rosso_veneto"),
    W("NEW070","Stellenbosch Pinotage Kanonkop","Western Cape","Sudafrica","Rosso","standard",27,"Pinotage",14.0,"media","strutturati","pieno",0.8,["mora","affumicato","spezie dolci"],["braai sudafricano","carne alla griglia","formaggi stagionati"],["pesce delicato","crudi"],"stellenbosch-pinotage-kanonkop","rosso_toscana"),
    W("NEW071","Swartland Chenin Blanc Mullineux","Western Cape","Sudafrica","Bianco","standard",24,"Chenin Blanc",13.0,"alta","assenti","medio-pieno",2.0,["mela cotogna","miele leggero","erbe selvatiche"],["pesce alla griglia","pollo speziato","formaggi semi-stagionati"],["carne rossa pesante","dolci molto dolci"],"swartland-chenin-mullineux","bianco_nord"),
    W("NEW072","Meknès Rouge Domaine de la Zouina","Meknès","Marocco","Rosso","standard",18,"Syrah + Cabernet Sauvignon",13.5,"media","medi","medio-pieno",1.0,["frutti scuri","spezie nordafricane","erbe aromatiche"],["tajine di agnello","cous cous speziato","formaggi stagionati"],["pesce delicato","dolci"],"meknes-rouge-zouina","rosso_toscana"),
    W("NEW073","Saperavi Qvevri Pheasant's Tears","Kakheti","Georgia","Rosso","standard",23,"Saperavi",13.0,"alta","medi","pieno",1.0,["prugna","terra","spezie orientali"],["khinkali","carne alla brace georgiana","formaggi stagionati"],["pesce delicato","crudi"],"saperavi-qvevri-pheasants-tears","rosso_toscana"),
    W("NEW074","Rkatsiteli Qvevri Orange Wine Iago's Wine","Kartli","Georgia","Bianco","standard",21,"Rkatsiteli",12.5,"media","medi","medio-pieno",1.5,["albicocca secca","tè nero","erbe di campo"],["khachapuri","piatti speziati georgiani","formaggi stagionati"],["dolci molto delicati","pesce crudo"],"rkatsiteli-orange-iago","bianco_nord"),
    W("NEW075","Koshu Grace Wine Yamanashi","Yamanashi","Giappone","Bianco","standard",29,"Koshu",11.5,"media","assenti","leggero",1.2,["agrumi delicati","fiori bianchi","erbe di riso"],["sushi","tempura","pesce crudo giapponese"],["carne rossa","spezie piccanti"],"koshu-grace-wine","bianco_nord"),
    W("NEW076","Bekaa Valley Rouge Château Musar","Valle della Bekaa","Libano","Rosso","premium",32,"Cabernet Sauvignon + Cinsault + Carignan",13.5,"media","medi","medio-pieno",1.0,["frutti scuri","spezie orientali","cuoio leggero"],["kebab libanese","piatti a base di melanzane speziate","formaggi stagionati"],["pesce delicato","dolci"],"bekaa-musar-rouge","rosso_toscana"),
    W("NEW077","Ningxia Cabernet Gernischt Helan Mountain","Ningxia","Cina","Rosso","standard",26,"Cabernet Gernischt",14.0,"media","medi","medio-pieno",0.9,["ciliegia scura","spezie leggere","erbe"],["anatra alla pechinese","carne di maiale brasata","formaggi stagionati"],["pesce delicato","crudi"],"ningxia-cabernet-helan","rosso_toscana"),
    W("NEW078","Nashik Valley Chenin Blanc Sula Vineyards","Nashik","India","Bianco","economico",14,"Chenin Blanc",12.5,"media","assenti","leggero-medio",2.5,["mango","fiori bianchi","agrumi"],["curry leggero","pesce speziato","formaggi freschi"],["carne rossa pesante","cioccolato"],"nashik-chenin-sula","bianco_nord"),
    W("NEW079","Lambrusco di Sorbara DOC Secco Cleto Chiarli","Emilia-Romagna","Italia","Rosso","economico",10.5,"Lambrusco di Sorbara",11.5,"alta","leggeri","leggero",6.0,["fragolina","viola","frizzantezza vivace"],["tagliere di salumi","tortellini in brodo","pizza"],["pesce delicato","dolci molto dolci"],"lambrusco-sorbara-chiarli","rosso_veneto"),
    W("NEW080","Pignoletto DOC Frizzante Colli Bolognesi","Emilia-Romagna","Italia","Bianco","economico",9,"Pignoletto",11.0,"media","assenti","leggero",8.0,["mela","fiori bianchi","leggera frizzantezza"],["piadina romagnola","affettati","aperitivo"],["carne rossa","formaggi stagionati"],"pignoletto-colli-bolognesi","bianco_nord"),
    W("NEW081","Bardolino Chiaretto DOC Classico","Veneto","Italia","Rosato","economico",11,"Corvina + Rondinella",12.0,"media","leggeri","leggero",2.0,["ciliegia fresca","fragola","fiori di campo"],["antipasti di pesce","pizza","aperitivo estivo"],["carne rossa pesante","selvaggina"],"bardolino-chiaretto-classico","rosato"),
    W("NEW082","Bianco di Custoza DOC Classico","Veneto","Italia","Bianco","economico",10,"Garganega + Trebbiano",12.0,"media","assenti","leggero",1.5,["mela","fiori bianchi","mandorla"],["risotto di pesce","antipasti veneti","frittura di paranza"],["carne rossa","formaggi stagionati"],"bianco-custoza-classico","bianco_nord"),
    W("NEW083","Ortrugo dei Colli Piacentini DOC","Emilia-Romagna","Italia","Bianco","economico",9.5,"Ortrugo",11.5,"media","assenti","leggero",4.0,["pera","erbe di campo","leggera frizzantezza"],["salumi piacentini","pisarei e fasö","formaggi freschi"],["carne rossa","dessert"],"ortrugo-colli-piacentini","bianco_nord"),
    W("NEW084","Gutturnio DOC Colli Piacentini Frizzante","Emilia-Romagna","Italia","Rosso","economico",11,"Barbera + Croatina",12.5,"alta","medi","medio",3.0,["ciliegia","mora","leggera frizzantezza"],["salumi piacentini","pisarei e fasö","pizza"],["pesce delicato","dolci"],"gutturnio-colli-piacentini","rosso_piemonte"),
    W("NEW085","Colli Euganei Rosso DOC","Veneto","Italia","Rosso","economico",12,"Merlot + Cabernet",13.0,"media","medi","medio",1.5,["prugna","erbe collinari","spezie leggere"],["pasta al ragù","salumi veneti","formaggi di media stagionatura"],["pesce crudo","dolci"],"colli-euganei-rosso","rosso_piemonte"),
    W("NEW086","Falanghina del Sannio DOC","Campania","Italia","Bianco","economico",11.5,"Falanghina",12.5,"alta","assenti","leggero-medio",1.8,["mela verde","fiori bianchi","agrumi"],["frittura di paranza","pizza fritta","frutti di mare"],["carne rossa","formaggi molto stagionati"],"falanghina-sannio","bianco_nord"),
    W("NEW087","Primitivo di Manduria DOC","Puglia","Italia","Rosso","economico",13,"Primitivo",14.5,"media","morbidi","pieno",2.0,["mora matura","confettura di prugna","spezie dolci"],["orecchiette alle cime di rapa","carne alla brace","formaggi pugliesi"],["pesce crudo","piatti delicati"],"primitivo-manduria-base","rosso_toscana"),
    W("NEW088","Negroamaro Salento IGT","Puglia","Italia","Rosso","economico",9,"Negroamaro",13.0,"media","morbidi","medio",1.5,["ciliegia","erbe mediterranee","spezie leggere"],["taralli","pizza","salumi pugliesi"],["pesce crudo delicato","dolci"],"negroamaro-salento-igt","rosso_toscana"),
    W("NEW089","Grillo Sicilia DOC","Sicilia","Italia","Bianco","economico",10,"Grillo",12.5,"alta","assenti","leggero-medio",1.6,["agrumi","erbe mediterranee","fiori bianchi"],["caponata","pesce alla griglia","insalate estive"],["carne rossa","formaggi molto stagionati"],"grillo-sicilia-doc","bianco_nord"),
    W("NEW090","Catarratto Terre Siciliane IGT","Sicilia","Italia","Bianco","economico",8.5,"Catarratto",12.0,"media","assenti","leggero",1.8,["mela","erbe di campo","agrumi delicati"],["pasta con le sarde","antipasti siciliani","formaggi freschi"],["carne rossa","selvaggina"],"catarratto-terre-siciliane","bianco_nord"),
    W("NEW091","Vino da Tavola Rosso della Casa Puglia IGT","Puglia","Italia","Rosso","economico",7.5,"Primitivo + Negroamaro",13.0,"media","morbidi","medio",1.5,["frutti rossi maturi","spezie leggere"],["pizza","pasta al sugo","salumi"],["pesce crudo","dolci"],"rosso-casa-puglia-igt","rosso_toscana"),
    W("NEW092","Vino Bianco IGT Veneto Tavola","Veneto","Italia","Bianco","economico",7,"Garganega + Trebbiano",11.5,"media","assenti","leggero",1.5,["mela","fiori bianchi"],["pizza bianca","antipasti misti","aperitivo"],["carne rossa","formaggi stagionati"],"bianco-veneto-tavola-igt","bianco_nord"),
    W("NEW093","Rosé d'Anjou AOC","Loira","Francia","Rosato","economico",12,"Grolleau + Gamay",11.0,"media","leggeri","leggero",25.0,["fragola","lampone","note floreali dolci"],["aperitivo estivo","dessert alla frutta","formaggi freschi"],["carne rossa pesante","piatti molto salati"],"rose-anjou-aoc","rosato"),
    W("NEW094","Beaujolais Villages AOC","Borgogna","Francia","Rosso","economico",14,"Gamay",12.5,"alta","leggeri","leggero-medio",1.2,["ciliegia croccante","banana","fiori"],["salumi francesi","pollo arrosto","formaggi freschi di capra"],["carne rossa pesante","selvaggina"],"beaujolais-villages","rosso_piemonte"),
    W("NEW095","Muscadet Sèvre et Maine AOC Sur Lie","Loira","Francia","Bianco","economico",13,"Melon de Bourgogne",12.0,"alta","assenti","leggero",1.0,["agrumi","salsedine","mela verde"],["ostriche","frutti di mare crudi","pesce alla griglia"],["carne rossa","dolci"],"muscadet-sevre-maine","bianco_nord"),
    W("NEW096","Côtes du Rhône AOC Rouge","Rodano","Francia","Rosso","economico",13.5,"Grenache + Syrah",13.5,"media","medi","medio",1.5,["frutti rossi","erbe della garrigue","pepe"],["salumi","pasta al ragù","formaggi semi-stagionati"],["pesce crudo","dolci"],"cotes-du-rhone-rouge","rosso_toscana"),
    W("NEW097","Rioja DOCa Crianza","La Rioja","Spagna","Rosso","economico",13,"Tempranillo",13.0,"media","medi","medio",1.2,["ciliegia","vaniglia leggera","spezie dolci"],["tapas di carne","paella","formaggi manchego giovani"],["pesce crudo","dolci"],"rioja-crianza-base","rosso_toscana"),
    W("NEW098","Verdejo Rueda DO","Castiglia e León","Spagna","Bianco","economico",9.5,"Verdejo",13.0,"alta","assenti","leggero-medio",1.5,["erba fresca","agrumi","frutta tropicale leggera"],["tapas di pesce","insalate","formaggi freschi"],["carne rossa","selvaggina"],"verdejo-rueda-base","bianco_nord"),
    W("NEW099","Vinho Regional Alentejano Tinto","Alentejo","Portogallo","Rosso","economico",11,"Aragonez + Trincadeira",13.5,"media","medi","medio",1.5,["frutti rossi maturi","spezie mediterranee"],["carne alla brace","bacalhau","formaggi stagionati"],["pesce crudo","dolci"],"alentejano-tinto-regional","rosso_toscana"),
    W("NEW100","Yarra Valley Pinot Noir Coldstream Hills","Yarra Valley","Australia","Rosso","premium",38,"Pinot Nero",13.5,"alta","fini","medio",0.7,["ciliegia","fragola","erbe fresche"],["salmone alla griglia","anatra","funghi"],["pesce fritto","piatti piccanti"],"yarra-valley-pinot-coldstream","rosso_veneto"),
    # ══════════════════════════════════
    # ITALIA — PIEMONTE
    # ══════════════════════════════════
    W("BAR001","Barolo DOCG Borgogno 2018","Piemonte","Italia","Rosso","premium",49.0,"Nebbiolo",14.5,"alta","potenti","pieno",0.8,["rosa appassita","cuoio","tabacco","catrame","liquirizia"],["selvaggina","brasati","tartufo","formaggi stagionati"],["pesce","frutti di mare","dolci"],"barolo-borgogno-2018","rosso_piemonte"),
    W("BAR002","Barolo DOCG Pio Cesare Ornato 2017","Piemonte","Italia","Rosso","lusso",100.6,"Nebbiolo",14.0,"alta","seta","pieno",0.6,["violetta","prugna","spezie orientali","muschio","vaniglia"],["filetto","porcini","tartufo bianco","cacciagione"],["frittura","acidità elevata"],"barolo-pio-cesare-ornato","rosso_piemonte"),
    W("BAR003","Barbaresco DOCG Gaja 2019","Piemonte","Italia","Rosso","lusso",207,"Nebbiolo",13.5,"altissima","fini","pieno",0.5,["rosa","lampone","tabacco","cuoio nobile","spezie fini"],["fagiano","petto d'anatra","risotto al tartufo","formaggi erborinati"],["piatti dolci","frittura"],"barbaresco-gaja-2019","rosso_piemonte"),
    W("OVE001","Ovello Barbaresco Riserva DOCG Produttori","Piemonte","Italia","Rosso","premium",50.5,"Nebbiolo",14.0,"alta","seta","pieno",0.6,["rosa essiccata","tabacco Virginia","cuoio nobile","spezie fini","rabarbaro"],["filetto di manzo","tartufo bianco","risotto al tartufo","capriolo","formaggi stagionati 36 mesi"],["pesce","crostacei","piatti delicati"],"ovello-barbaresco-produttori","rosso_piemonte"),
    W("NEB001","Nebbiolo d'Alba DOC Prunotto","Piemonte","Italia","Rosso","standard",19.0,"Nebbiolo",13.5,"alta","medi","medio-pieno",1.0,["viola","ciliegia selvatica","spezie dolci","erbe alpine"],["pasta al ragù","stracotto","salumi stagionati"],["pesce","crostacei"],"nebbiolo-alba-prunotto","rosso_piemonte"),
    W("DOL001","Dolcetto d'Alba DOC Vietti","Piemonte","Italia","Rosso","economico",12.0,"Dolcetto",13.0,"bassa","morbidi","medio",1.5,["mora","mandorla","prugna fresca","liquirizia"],["pizza","salumi","pasta al sugo","cotoletta"],["pesce crudo","ostriche"],"dolcetto-alba-vietti","rosso_piemonte"),
    W("BAR004","Barbera d'Asti Superiore DOCG La Morandina","Piemonte","Italia","Rosso","economico",14.5,"Barbera",14.0,"altissima","bassi","medio",0.8,["ciliegia","prugna","spezie","vaniglia"],["pasta al pomodoro","pizza","salumi grassi","formaggi semi-stagionati"],["ostriche","pesce delicato"],"barbera-asti-morandina","rosso_piemonte"),
    W("BAR005","Barbera d'Alba DOC Giacomo Conterno","Piemonte","Italia","Rosso","premium",30.5,"Barbera",14.0,"altissima","bassi","pieno",0.8,["ciliegia croccante","viola","spezie dolci","legno fine"],["brasato al Barolo","pasta al ragù","pizza gourmet","salumi"],["pesce","ostriche"],"barbera-alba-conterno","rosso_piemonte"),
    W("GAV001","Gavi di Gavi DOCG La Scolca Etichetta Nera","Piemonte","Italia","Bianco","standard",28.5,"Cortese",12.5,"alta","assenti","leggero-medio",1.8,["mandorla","pietra bagnata","fiori bianchi","agrumi","mela verde"],["pesce al vapore","spaghetti alle vongole","frittura mista","risotto allo zafferano","antipasti di pesce"],["carne rossa","formaggi piccanti","piatti grassi"],"gavi-la-scolca","bianco_nord"),
    W("GAV002","Gavi DOCG Broglia La Meirana","Piemonte","Italia","Bianco","standard",18.0,"Cortese",12.5,"alta","assenti","leggero",2.0,["mandorla fresca","agrumi","fiori bianchi","minerale"],["pesce al forno","risotto alle verdure","insalate di mare","frittura"],["carne rossa","formaggi stagionati"],"gavi-broglia-meirana","bianco_nord"),
    W("MOS001","Moscato d'Asti DOCG Ceretto","Piemonte","Italia","Dolce","economico",12.5,"Moscato Bianco",5.5,"media","assenti","leggero",110.0,["pesca","albicocca","fiori d'arancio","muschio bianco","miele"],["crostate di frutta","panettone","formaggi erborinati dolci","torta di mele"],["carne rossa","piatti salati","formaggi piccanti"],"moscato-asti-ceretto","dolce"),
    W("AST001","Asti Spumante DOCG Contratto","Piemonte","Italia","Dolce","economico",12.0,"Moscato",7.0,"media","assenti","leggero",80.0,["pesca","fiori d'arancio","albicocca","muschio","miele"],["pandoro","panettone","crostate di frutta","formaggi erborinati dolci"],["carne rossa","pesce crudo","piatti salati"],"asti-spumante-contratto","spumante"),
    W("LAS001","Alta Langa DOCG Enrico Serafino Zero Dosage","Piemonte","Italia","Spumante","standard",20.5,"Pinot Nero + Chardonnay",12.0,"alta","assenti","medio",0.0,["agrumi","lievito","crosta di pane","mela verde","mineralità"],["ostriche","tartare di tonno","sushi","crudités","formaggi freschi"],["dolci","piatti piccanti","brasati"],"alta-langa-serafino-zero","spumante"),
    W("RUC001","Ruchè di Castagnole Monferrato DOCG Dacapo","Piemonte","Italia","Rosso","standard",20.5,"Ruchè",13.5,"alta","medi","medio",1.0,["rosa","geranio","spezie orientali","ciliegia","fragola"],["salumi","pasta al ragù leggero","pollo arrosto","formaggi freschi"],["pesce","ostriche"],"ruche-dacapo","rosso_piemonte"),
    W("TIM001","Timorasso Colli Tortonesi DOC Walter Massa Derthona","Piemonte","Italia","Bianco","premium",37.5,"Timorasso",13.5,"alta","assenti","pieno",2.0,["pietra pomice","agrumi","miele","cera d'api","frutta a polpa bianca"],["risotto ai funghi porcini","pesce al forno","vitello tonnato","formaggi semistagionati"],["carne rossa pesante","formaggi molto stagionati"],"timorasso-massa-derthona","bianco_nord"),
    W("BRA001","Brachetto d'Acqui DOCG Braida","Piemonte","Italia","Dolce","economico",13.0,"Brachetto",5.5,"media","assenti","leggero",75.0,["fragola","lampone","rosa","frutti rossi freschi"],["formaggi erborinati dolci","torte alla fragola","mousse al cioccolato al latte","macarons"],["carne rossa","piatti salati"],"brachetto-braida","spumante"),
    # ══════════════════════════════════
    # ITALIA — TOSCANA
    # ══════════════════════════════════
    W("CHI001","Chianti Classico DOCG Riserva Fonterutoli","Toscana","Italia","Rosso","standard",25.5,"Sangiovese",13.5,"alta","medi","medio-pieno",1.0,["marasca","viola","spezie fini","cuoio leggero"],["bistecca fiorentina","cinghiale","pasta al tartufo","pecorino stagionato"],["crostacei","dessert al cioccolato"],"chianti-classico-riserva-fonterutoli","rosso_toscana"),
    W("CHI003","Chianti Classico DOCG Castello di Ama","Toscana","Italia","Rosso","premium",32.0,"Sangiovese",13.5,"alta","medi","medio-pieno",1.0,["viola","ciliegia","spezie fini","tabacco","cuoio"],["bistecca fiorentina","pappardelle al cinghiale","formaggi pecorino","arrosto di maiale"],["pesce crudo","dolci"],"chianti-classico-ama","rosso_toscana"),
    W("BRU001","Brunello di Montalcino DOCG Biondi-Santi 2016","Toscana","Italia","Rosso","lusso",250.7,"Sangiovese Grosso",14.0,"alta","seta","pieno",0.5,["frutta scura","vaniglia","tabacco","spezie nobili","terra umida"],["selvaggina nobile","tartufo nero","filetto al pepe","formaggi affilati"],["pesce","frittura","piatti leggeri"],"brunello-biondi-santi-2016","rosso_toscana"),
    W("BRU002","Brunello di Montalcino DOCG Casanova di Neri","Toscana","Italia","Rosso","lusso",85.1,"Sangiovese Grosso",14.5,"alta","potenti","pieno",0.6,["ciliegia nera","prugna secca","moka","spezie","cuoio"],["cinghiale","arrosto di manzo","formaggi erborinati"],["pesce","verdure delicate"],"brunello-casanova-di-neri","rosso_toscana"),
    W("VIN001","Vino Nobile di Montepulciano DOCG Avignonesi","Toscana","Italia","Rosso","premium",32.0,"Prugnolo Gentile",13.5,"alta","medi","medio-pieno",0.9,["ciliegia","spezie dolci","muschio","viola"],["bistecca","agnello","pasta al ragù di cinghiale"],["pesce crudo","dolci delicati"],"vino-nobile-avignonesi","rosso_toscana"),
    W("BOR001","Morellino di Scansano DOCG Poggio Argentiera","Toscana","Italia","Rosso","standard",16.5,"Sangiovese",13.5,"media","morbidi","medio",1.5,["mora","maremma","macchia","spezie marine"],["cinghiale","pasta al ragù","cacciucco","formaggi toscani"],["crudi di mare","dessert"],"morellino-scansano-argentiera","rosso_toscana"),
    W("BOL001","Bolgheri Sassicaia DOC 2019","Toscana","Italia","Rosso","lusso",360.0,"Cabernet Sauvignon + Cabernet Franc",13.5,"media","strutturati","pieno",0.8,["ribes nero","cedro","peperone","spezie internazionali","tabacco Virginia"],["filetto di manzo","agnello al forno","formaggi stagionati duri"],["pesce delicato","dolci","piatti piccanti"],"bolgheri-sassicaia-2019","rosso_toscana"),
    W("SUP001","Supertuscan IGT Ornellaia 2018","Toscana","Italia","Rosso","lusso",276,"Merlot + Cab.Sauvignon + Cab.Franc + Petit Verdot",14.0,"media","vellutati","pieno",1.0,["ribes nero","mirtillo","cedro","spezie dolci","tabacco premium","cioccolato fondente"],["filetto Wagyu","agnello rack","selvaggina nobile","formaggi stagionati premium"],["pesce","piatti leggeri"],"ornellaia-2018","rosso_toscana"),
    W("VIN002","Vin Santo del Chianti DOC Isole e Olena","Toscana","Italia","Dolce","premium",42.0,"Trebbiano + Malvasia",16.0,"alta","assenti","pieno",100.0,["nocciola","miele","fico secco","mandorla tostata","vaniglia","spezie"],["cantucci","crostate","formaggi stagionati duri","dolci secchi","torta della nonna"],["carne","pesce","piatti salati"],"vin-santo-isole-olena","dolce"),
    W("ROS001","Rosso di Montalcino DOC Col d'Orcia","Toscana","Italia","Rosso","standard",20.5,"Sangiovese",13.5,"alta","medi","medio",1.0,["ciliegia","spezie","terra toscana","viola"],["pasta al ragù","arista toscana","bistecca","formaggi pecorino"],["pesce","crostacei"],"rosso-montalcino-orcia","rosso_toscana"),
    W("VER003","Vernaccia di San Gimignano DOCG Teruzzi","Toscana","Italia","Bianco","standard",15.5,"Vernaccia",13.0,"alta","assenti","leggero-medio",1.5,["mandorla amara","minerale","fiori bianchi","agrumi","leggero speziato"],["pesce alla griglia","frittura mista","zuppe di pesce","risotto delicato","formaggi freschi"],["carne rossa","brasati","formaggi stagionati"],"vernaccia-san-gimignano-teruzzi","bianco_nord"),
    # ══════════════════════════════════
    # ITALIA — VENETO
    # ══════════════════════════════════
    W("AMA001","Amarone DOCG Allegrini 2017","Veneto","Italia","Rosso","lusso",77.6,"Corvina + Corvinone + Rondinella",15.5,"media","vellutati","pieno",5.0,["prugna secca","cacao","tabacco","marmellata di more","cannella"],["selvaggina","stufati","formaggi affinati lungamente","brasato all'Amarone"],["pesce","piatti leggeri","frittura"],"amarone-allegrini-2017","rosso_veneto"),
    W("AMA002","Amarone DOCG Dal Forno Romano 2015","Veneto","Italia","Rosso","lusso",293.2,"Corvina + Corvinone + Rondinella + Oseleta",15.5,"media","vellutati","pieno",4.0,["cioccolato fondente","prugna nera","spezie esotiche","cuoio premium","tabacco"],["brasato all'Amarone","selvaggina nobile","formaggi stagionati 48 mesi","cinghiale"],["pesce","piatti leggeri"],"amarone-dal-forno","rosso_veneto"),
    W("VPN001","Valpolicella Ripasso DOC Zenato","Veneto","Italia","Rosso","standard",20.0,"Corvina + Molinara",13.5,"media","vellutati","medio-pieno",3.5,["ciliegia sottospirito","cacao","rotondo","spezie dolci"],["pasta al ragù","salsiccia","pizza gourmet","risotto al radicchio"],["ostriche","tartare di pesce"],"valpolicella-ripasso-zenato","rosso_veneto"),
    W("VAL001","Valpolicella Classico DOC Masi","Veneto","Italia","Rosso","economico",11.0,"Corvina",12.5,"media","leggeri","leggero-medio",2.0,["ciliegia fresca","mandorla","erbe aromatiche"],["pizza","pasta al pomodoro","salumi","antipasti"],["selvaggina","formaggi molto stagionati"],"valpolicella-classico-masi","rosso_veneto"),
    W("SOA001","Soave Classico DOC Pieropan Calvarino","Veneto","Italia","Bianco","economico",13.5,"Garganega + Trebbiano",12.5,"media","assenti","leggero-medio",2.5,["mandorla","fiori bianchi","pesca","minerale","mela"],["risotto agli asparagi","pesce al vapore","formaggi freschi","prosciutto crudo","insalate"],["brasati","selvaggina","carne rossa"],"soave-pieropan-calvarino","bianco_nord"),
    W("SOA002","Soave Superiore DOCG Inama Vigneti di Foscarino","Veneto","Italia","Bianco","standard",24.5,"Garganega",13.0,"alta","assenti","medio-pieno",2.0,["mandorla tostata","pesca bianca","minerale vulcanico","fiori di campo"],["capesante","scampi","risotto al pesce","formaggi Asiago fresco"],["carne rossa","brasati"],"soave-inama-foscarino","bianco_nord"),
    W("PRO001","Prosecco Superiore DOCG Valdobbiadene Ruggeri","Veneto","Italia","Spumante","standard",15.5,"Glera",11.5,"media","assenti","leggero",12.0,["mela golden","pera Williams","pesco","fiori di acacia","note lattee"],["aperitivo","pizza bianca","prosciutto crudo","frittura leggera","frutti di mare"],["selvaggina","formaggi stagionati pesanti","cioccolato fondente"],"prosecco-ruggeri","spumante"),
    W("REC001","Recioto di Soave DOCG Anselmi","Veneto","Italia","Dolce","premium",32.0,"Garganega",12.0,"alta","assenti","pieno",120.0,["mela cotogna","mandorla","miele","fiori bianchi appassiti","albicocca"],["crostate di frutta","formaggi erborinati dolci","panettone","biscotti","pasta di mandorle"],["piatti salati","carne rossa"],"recioto-soave-anselmi","dolce"),
    # ══════════════════════════════════
    # ITALIA — LOMBARDIA
    # ══════════════════════════════════
    W("FRA001","Franciacorta Satèn DOCG Ca' del Bosco","Lombardia","Italia","Spumante","premium",40.0,"Chardonnay",12.5,"alta","assenti","medio",6.0,["crosta di pane","burro noisette","mela cotogna","lievito","tostato delicato"],["frittura mista","risotto allo zafferano","ostriche","salmone affumicato","capesante","formaggi freschi"],["selvaggina","salumi molto grassi","cioccolato amaro"],"franciacorta-saten-ca-del-bosco","spumante"),
    W("FRA002","Franciacorta Brut DOCG Bellavista Alma","Lombardia","Italia","Spumante","premium",32.0,"Chardonnay + Pinot Nero",12.5,"alta","assenti","leggero-medio",5.0,["agrumi","fiori bianchi","lievito fresco","perlage finissimo"],["aperitivo","tartine","pesce crudo","antipasti delicati","sushi"],["selvaggina","carne rossa","dolci molto dolci"],"franciacorta-bellavista-alma","spumante"),
    W("FRA003","Franciacorta Dosage Zéro DOCG Bellavista Vittorio Moretti","Lombardia","Italia","Spumante","lusso",86.8,"Chardonnay + Pinot Nero + Pinot Bianco",12.5,"alta","assenti","pieno",0.0,["gesso","agrumi secchi","lievito nobile","crosta di pane minerale"],["ostriche Belon","caviale","capesante crude","sashimi premium"],["dolci","piatti dolci","frutta"],"franciacorta-bellavista-moretti","spumante"),
    W("SFO001","Sforzato di Valtellina DOCG Nino Negri 5 Stelle","Lombardia","Italia","Rosso","premium",60.5,"Nebbiolo (Chiavennasca)",14.5,"alta","potenti","pieno",1.5,["prugna secca","rosa appassita","tabacco","cuoio","spezie nobili"],["brasato","stinco","formaggi Bitto e Casera stagionati","selvaggina di montagna"],["pesce","piatti leggeri"],"sforzato-valtellina-negri","rosso_piemonte"),
    W("LUG001","Lugana DOC Zenato Sergio Zenato","Lombardia","Italia","Bianco","standard",17.0,"Trebbiano di Lugana",13.0,"alta","assenti","medio",2.1,["pesca bianca","mandorla","minerale","fiori di campo","glicerina"],["risotto al pesce","spaghetti alle vongole","frittura di lago","pesce di lago","formaggi freschi"],["carne rossa","selvaggina","formaggi molto piccanti"],"lugana-zenato","bianco_nord"),
    W("LUG002","Lugana Superiore DOC Ca' dei Frati I Frati","Lombardia","Italia","Bianco","standard",26.5,"Trebbiano di Lugana",13.5,"alta","assenti","medio-pieno",1.8,["pesca matura","mandorla tostata","minerale gessoso","fiori alpini"],["lavarello","trota in carpione","risotto ai funghi","branzino al forno"],["carne rossa","formaggi stagionati"],"lugana-ca-dei-frati","bianco_nord"),
    W("CHI002","Chiaretto del Garda DOC Cà dei Frati","Lombardia","Italia","Rosato","economico",14.5,"Groppello + Barbera",12.0,"alta","leggeri","leggero-medio",2.0,["fragola","lampone","petali di rosa","arancia sanguinella"],["pizza","pasta al pomodoro","frittura","aperitivi","formaggi freschi","insalate"],["carne rossa pesante","selvaggina"],"chiaretto-garda-ca-dei-frati","rosato"),
    W("VAL002","Valtellina Superiore Sassella DOCG Ar.Pe.Pe","Lombardia","Italia","Rosso","premium",39.0,"Nebbiolo (Chiavennasca)",13.0,"alta","fini","medio-pieno",0.8,["rosa alpina","lampone","spezie montane","cuoio fine","rabarbaro"],["cervo","capriolo","pizzoccheri","formaggi Casera","selvaggina"],["pesce","piatti leggeri"],"valtellina-superiore-arpepe","rosso_piemonte"),
    # ══════════════════════════════════
    # ITALIA — OLTREPÒ PAVESE (Lombardia)
    # ══════════════════════════════════
    W("OLP001","Oltrepò Pavese Metodo Classico DOCG Brut Pas Dosé Monsupello","Oltrepò Pavese","Italia","Spumante","standard",24.0,"Pinot Nero",12.5,"alta","assenti","medio",0.0,["lievito fresco","mela verde","agrumi","crosta di pane","mineralità"],["ostriche","frittura di pesce","salmone affumicato","aperitivo","formaggi freschi lombardi"],["carne rossa pesante","formaggi molto stagionati"],"oltrep-metodo-classico-monsupello","spumante"),
    W("OLP002","Buttafuoco dell'Oltrepò Pavese DOC Storico Fiamberti","Oltrepò Pavese","Italia","Rosso","standard",16.0,"Croatina + Barbera + Ughetta di Canneto",13.0,"alta","strutturati","pieno",1.5,["mora selvatica","spezie padane","cuoio","tabacco dolce","ciliegia sotto spirito"],["salumi pavesi","pasta al ragù","brasato","cotechino con lenticchie","formaggi Grana Padano stagionato"],["pesce","crostacei","piatti delicati"],"buttafuoco-oltrep-fiamberti","rosso_piemonte"),
    W("OLP003","Oltrepò Pavese Pinot Nero DOC vinificato in rosso Tenuta Mazzolino Noir","Oltrepò Pavese","Italia","Rosso","premium",33.0,"Pinot Nero",13.5,"alta","fini","medio",0.8,["lampone","fragola matura","viola","spezie delicate","sottobosco"],["salmone al forno","petto d'anatra","funghi porcini","pasta al ragù leggero","formaggi semi-stagionati"],["carne rossa pesante","piatti molto grassi"],"pinot-nero-mazzolino-noir","rosso_piemonte"),
    W("OLP004","Oltrepò Pavese Bonarda DOC frizzante Quaquarini Francesco","Oltrepò Pavese","Italia","Rosso","economico",11.0,"Croatina",12.5,"media","morbidi","medio",3.5,["mora fresca","ciliegia","lampone","leggera effervescenza","floreale"],["pizza","pasta al pomodoro","salumi","antipasti","formaggi freschi","crescenza"],["selvaggina","formaggi molto stagionati","pesce crudo"],"bonarda-oltrep-quaquarini","rosso_piemonte"),
    W("OLP005","Oltrepò Pavese Riesling Renano DOC Tenuta Il Bosco","Oltrepò Pavese","Italia","Bianco","standard",15.5,"Riesling Renano",12.5,"alta","assenti","leggero-medio",2.5,["agrumi","pesca","minerale","fiori bianchi","lime delicato"],["pesce di lago","risotto alle erbe","insalate","sushi","capesante","formaggi freschi"],["carne rossa","formaggi stagionati"],"riesling-renano-oltrep-bosco","bianco_nord"),
    W("OLP006","Oltrepò Pavese Moscato DOC Frizzante Castello di Cigognola","Oltrepò Pavese","Italia","Dolce","economico",12.0,"Moscato Bianco",8.0,"media","assenti","leggero",70.0,["pesca","albicocca","fiori d'arancio","muschio delicato"],["crostate di frutta","panettone","formaggi erborinati dolci","pasticceria secca","torta di mele"],["carne rossa","piatti salati"],"moscato-oltrep-cigognola","spumante"),
    W("OLP007","Oltrepò Pavese Pinot Grigio DOC Frecciarossa","Oltrepò Pavese","Italia","Bianco","standard",15.0,"Pinot Grigio",13.0,"media","assenti","leggero-medio",2.0,["mela","pesca bianca","fiori bianchi","leggero speziato","mandorla"],["risotto al pesce","frittura mista","pasta alle vongole","formaggi freschi","insalate"],["carne rossa","formaggi molto stagionati"],"pinot-grigio-oltrep-frecciarossa","bianco_nord"),
    W("OLP008","Sangue di Giuda dell'Oltrepò Pavese DOC Frizzante Dolce Quaquarini","Oltrepò Pavese","Italia","Dolce","economico",10.5,"Croatina + Barbera + Uva Rara",8.0,"media","assenti","leggero",60.0,["fragola","lampone","ciliegia fresca","mora dolce","floreale rosso"],["formaggi erborinati dolci","torta di fragole","budino","panettone","crostate di frutti rossi"],["carne rossa","piatti salati","pesce crudo"],"sangue-giuda-oltrep-quaquarini","dolce"),
    W("OLP009","Oltrepò Pavese Barbera DOC Ruiz de Cardenas","Oltrepò Pavese","Italia","Rosso","economico",13.5,"Barbera",13.5,"altissima","bassi","medio",1.0,["ciliegia acida","prugna","spezie","viola","leggero speziato"],["pasta al pomodoro","pizza","salumi padani","risotto al ragù","formaggi semi-stagionati"],["ostriche","pesce delicato"],"barbera-oltrep-ruiz-cardenas","rosso_piemonte"),
    W("OLP010","Oltrepò Pavese Metodo Classico DOCG Rosé Brut Conte Vistarino Ughetta","Oltrepò Pavese","Italia","Spumante","standard",27.0,"Ughetta di Canneto (Vespolina)",12.5,"alta","assenti","leggero-medio",3.0,["fragola selvatica","lampone","rosa","agrumi rosati","perlage fine"],["salmone","prosciutto crudo","formaggi freschi lombardi","risotto allo zafferano","carpaccio di tonno"],["selvaggina pesante","formaggi molto stagionati"],"metodo-classico-rose-vistarino","spumante"),
    W("OLP011","Oltrepò Pavese Rosso DOC Casa Re Cabernet Sauvignon","Oltrepò Pavese","Italia","Rosso","standard",17.5,"Cabernet Sauvignon",13.5,"media","strutturati","pieno",1.0,["ribes nero","peperone verde","cedro","spezie dolci","grafite"],["brasato al Cabernet","tagliata di manzo","formaggi stagionati","selvaggina da penna","peperonata"],["pesce","piatti molto delicati"],"cabernet-oltrep-casare","rosso_piemonte"),
    W("OLP012","Oltrepò Pavese Chardonnay DOC San Bacco","Oltrepò Pavese","Italia","Bianco","economico",13.0,"Chardonnay",13.0,"media","assenti","medio",2.0,["mela golden","burro fresco","nocciola tostata","fiori bianchi","vaniglia leggera"],["pollo al burro","risotto allo zafferano","formaggi a pasta molle","pesce in salsa","pasta con panna"],["piatti molto piccanti","carne rossa"],"chardonnay-oltrep-sanbacco","bianco_nord"),
    W("OLP013","Oltrepò Pavese Barbera DOC Superiore Doria","Oltrepò Pavese","Italia","Rosso","standard",19.0,"Barbera",14.0,"altissima","medi","pieno",1.2,["prugna matura","ciliegia nera","liquirizia","spezie scure","tabacco"],["brasato al vino rosso","costine di maiale","salame cotto","polenta con funghi","formaggi grassi"],["pesce crudo","ostriche"],"barbera-superiore-oltrep-doria","rosso_piemonte"),
    W("OLP014","Oltrepò Pavese Metodo Classico DOCG Extra Brut Travaglino","Oltrepò Pavese","Italia","Spumante","premium",32.0,"Pinot Nero + Chardonnay",12.5,"alta","assenti","medio",1.0,["crosta di pane","nocciola","agrumi maturi","fiori bianchi","mineralità gessosa"],["ostriche crude","tartare di pesce","risotto ai frutti di mare","aperitivo raffinato","formaggi freschi"],["carne rossa pesante","piatti molto piccanti"],"extrabrut-travaglino-oltrep","spumante"),
    W("OLP015","Oltrepò Pavese Pinot Grigio DOC Ramato La Piotta","Oltrepò Pavese","Italia","Rosato","standard",14.5,"Pinot Grigio (vinificato in rosa)",12.5,"media","assenti","leggero-medio",1.5,["pesca rosa","scorza d'arancia","petali di rosa","erbe aromatiche","frutti rossi delicati"],["antipasti di pesce","risotto al radicchio","salumi delicati","formaggi freschi","insalate estive"],["selvaggina","carne rossa pesante"],"pinot-grigio-ramato-piotta","bianco_nord"),
    W("OLP016","Oltrepò Pavese Bonarda DOC Vivace Vercesi del Castellazzo","Oltrepò Pavese","Italia","Rosso","economico",12.5,"Croatina",12.0,"media","morbidi","medio",4.0,["ciliegia croccante","mora fresca","viola mammola","leggera effervescenza","spezie dolci"],["salumi lombardi","pizza margherita","tortelli di zucca","formaggi freschi","antipasti misti"],["pesce crudo","piatti molto delicati"],"bonarda-vivace-vercesi","rosso_piemonte"),
    W("OLP017","Oltrepò Pavese Riesling Italico DOC Ballabio","Oltrepò Pavese","Italia","Bianco","economico",12.0,"Riesling Italico",12.0,"alta","assenti","leggero",2.0,["mela verde","agrumi","fiori di campo","erbe fresche","nota minerale"],["antipasti di pesce di lago","risotto alla milanese leggero","insalate di mare","formaggi freschi","verdure grigliate"],["carne rossa","selvaggina"],"riesling-italico-oltrep-ballabio","bianco_nord"),
    W("OLP018","Oltrepò Pavese Metodo Classico DOCG Blanc de Blancs Ca' di Frara","Oltrepò Pavese","Italia","Spumante","premium",29.0,"Riesling",12.5,"alta","assenti","leggero-medio",1.5,["agrumi canditi","mela renetta","fiori bianchi","lievito sottile","mineralità"],["crudi di pesce","sushi","capesante scottate","aperitivo elegante","formaggi freschi di capra"],["carne rossa pesante","piatti molto grassi"],"blancdeblancs-cadifrara-oltrep","spumante"),
    W("OLP019","Oltrepò Pavese Rosso DOC Uva Rara Frecciarossa","Oltrepò Pavese","Italia","Rosso","economico",13.0,"Uva Rara",12.5,"media","morbidi","leggero-medio",2.0,["ciliegia dolce","lampone","fiori rossi","spezie leggere","frutta fresca"],["salumi","pasta al forno","pizza","formaggi semi-stagionati","antipasti misti"],["pesce","piatti molto delicati"],"uva-rara-oltrep-frecciarossa","rosso_piemonte"),
    W("OLP020","Oltrepò Pavese Sauvignon DOC Tenuta Il Bosco","Oltrepò Pavese","Italia","Bianco","standard",16.0,"Sauvignon Blanc",13.0,"alta","assenti","medio",2.0,["foglia di pomodoro","pompelmo rosa","fiori di sambuco","erba appena tagliata","frutto della passione"],["asparagi","primi con pesto","capesante","formaggi di capra freschi","insalate con agrumi"],["carne rossa","piatti molto grassi"],"sauvignon-oltrep-bosco","bianco_nord"),
    # ══════════════════════════════════
    # ITALIA — TRENTINO-ALTO ADIGE
    # ══════════════════════════════════
    W("TRE001","Trento DOC Ferrari Giulio Ferrari Riserva del Fondatore","Trentino-Alto Adige","Italia","Spumante","premium",60.5,"Chardonnay",12.5,"alta","assenti","pieno",5.0,["nocciola tostata","burro","agrumi canditi","mineralità alpina","lievito complesso"],["crostacei","risotto al tartufo bianco","ostriche","salmone selvaggio","formaggi di alpeggio"],["brasati","formaggi molto piccanti"],"trento-ferrari-giulio","spumante"),
    W("GEW001","Gewürztraminer Alto Adige DOC Tramin Nussbaumer","Trentino-Alto Adige","Italia","Bianco","standard",25.5,"Gewürztraminer",13.5,"bassa","assenti","pieno",8.0,["rosa","litchi","speziato intenso","petali di fiori","mango"],["cucina thai","curry di pollo","foie gras","formaggi erborinati","salmone affumicato","formaggi al pepe"],["carne rossa secca","pesce molto delicato"],"gewurztraminer-tramin-nussbaumer","bianco_nord"),
    W("LAG001","Lagrein Alto Adige DOC Cantina Bolzano Taber","Trentino-Alto Adige","Italia","Rosso","standard",29.5,"Lagrein",13.5,"media","morbidi","pieno",1.5,["more","mirtillo","cacao","spezie dolci","viola"],["canederli","strangolapreti","arrosto di maiale","formaggi Graukäse","selvaggina alpina"],["pesce delicato","ostriche"],"lagrein-bolzano-taber","rosso_veneto"),
    W("PIN002","Pinot Nero Alto Adige DOC Elena Walch","Trentino-Alto Adige","Italia","Rosso","premium",33.0,"Pinot Nero",13.0,"alta","fini","medio",0.8,["lampone","fragola alpina","viola","spezie alpine","humus"],["salmone al forno","petto d'anatra","funghi porcini","cervo","tagliatelle al ragù"],["carne rossa pesante","formaggi piccanti"],"pinot-nero-elena-walch","rosso_veneto"),
    W("PIN005","Pinot Bianco Alto Adige DOC Cantina Terlan Vorberg","Trentino-Alto Adige","Italia","Bianco","premium",43.5,"Pinot Bianco",13.0,"alta","assenti","pieno",1.5,["mela cotogna","mandorla","minerale alpino","fiori bianchi","crema"],["astice","capesante","risotto al tartufo bianco","formaggi di malga","pollo in crosta di erbe"],["carne rossa","formaggi stagionati pesanti"],"pinot-bianco-terlan-vorberg","bianco_nord"),
    W("MUL001","Müller Thurgau Alto Adige DOC Tiefenbrunner Feldmarschall","Trentino-Alto Adige","Italia","Bianco","premium",42.5,"Müller Thurgau",12.5,"alta","assenti","leggero-medio",2.0,["fiori alpini","salvia","pepe bianco","lime","mineralità di quota"],["antipasti di pesce","sushi","carpaccio di pesce","formaggi freschi","verdure grigliate"],["carne rossa","formaggi stagionati pesanti"],"muller-thurgau-feldmarschall","bianco_nord"),
    # ══════════════════════════════════
    # ITALIA — FRIULI-VENEZIA GIULIA
    # ══════════════════════════════════
    W("PIN001","Pinot Grigio Ramato DOC Livon","Friuli-Venezia Giulia","Italia","Bianco","standard",17.5,"Pinot Grigio",13.0,"media","leggeri","medio",2.0,["pesca gialla","speziato delicato","rame","miele","noce"],["salmone","prosciutto cotto","pasta al salmone","risotto al radicchio","formaggi medio stagionati"],["carne rossa","selvaggina"],"pinot-grigio-ramato-livon","bianco_nord"),
    W("SCH001","Schiopettino di Prepotto DOC Ronchi di Cialla","Friuli-Venezia Giulia","Italia","Rosso","premium",39.5,"Schiopettino",13.0,"alta","fini","medio",0.8,["pepe nero","mirtillo","violetta","spezie alpine","muschio"],["cervo in salmi","porcini","capriolo","frico al formaggio","carne affumicata"],["pesce","crostacei","piatti dolci"],"schiopettino-ronchi-cialla","rosso_umbria"),
    W("RIB002","Ribolla Gialla Collio DOC Schiopetto","Friuli-Venezia Giulia","Italia","Bianco","standard",21.5,"Ribolla Gialla",13.0,"alta","assenti","medio",1.5,["agrumi","mela acida","fiori bianchi","minerale","erbe fresche"],["carpaccio di salmone","prosciutto San Daniele","formaggi Montasio fresco","insalate","ceviche leggero"],["carne rossa","formaggi molto stagionati"],"ribolla-gialla-schiopetto","bianco_nord"),
    W("TOC001","Tocai Friulano Collio DOC Zuani Vigne","Friuli-Venezia Giulia","Italia","Bianco","standard",29.0,"Friulano",13.0,"alta","assenti","medio-pieno",1.5,["mandorla","fiori di campo","pesca bianca","minerale","erbe fresche"],["prosciutto San Daniele","frico","formaggi Montasio","capesante","pesce bianco al forno"],["carne rossa","formaggi molto stagionati","piatti piccanti"],"tocai-zuani-vigne","bianco_nord"),
    # ══════════════════════════════════
    # ITALIA — CAMPANIA
    # ══════════════════════════════════
    W("AGL001","Taurasi DOCG Mastroberardino Radici","Campania","Italia","Rosso","premium",39.5,"Aglianico",14.0,"alta","potenti","pieno",0.9,["marasca","caffè","polvere da sparo","spezie scure","cioccolato fondente"],["agnello al forno","cacciagione","pasta al ragù di cinghiale","formaggi piccanti"],["pesce crudo","frutti di mare","dolci"],"taurasi-mastroberardino-radici","rosso_campania"),
    W("AGL002","Taurasi DOCG Antonio Caggiano Vigna Macchia dei Goti","Campania","Italia","Rosso","premium",61.0,"Aglianico",14.0,"alta","potenti","pieno",0.8,["ciliegia nera","spezie vulcaniche","cuoio nobile","tabacco","cioccolato"],["capretto al forno","agnello","pasta al ragù nobile","formaggi stagionati campani"],["pesce","crostacei"],"taurasi-caggiano-macchia-goti","rosso_campania"),
    W("FIA001","Fiano di Avellino DOCG Feudi di San Gregorio","Campania","Italia","Bianco","standard",23.0,"Fiano",13.0,"alta","assenti","medio-pieno",1.5,["nocciola tostata","miele di acacia","minerale profondo","frutto della passione","spezie delicate"],["astice","dentice al forno","risotto ai porcini","pollo al forno con erbe","formaggi semistagionati"],["carne rossa","salumi grassi"],"fiano-avellino-feudi","bianco_sud"),
    W("GRE001","Greco di Tufo DOCG Mastroberardino","Campania","Italia","Bianco","standard",22.5,"Greco",13.0,"alta","assenti","medio-pieno",1.8,["pesca bianca","agrumi","minerale sulfureo","fiori di pesco","nocciola"],["frittura di pesce","pasta ai frutti di mare","risotto allo zafferano","cozze gratinate","formaggi provola"],["carne rossa","salumi grassi"],"greco-tufo-mastroberardino","bianco_sud"),
    W("FIA002","Fiano di Avellino DOCG Ciro Picariello","Campania","Italia","Bianco","standard",26.5,"Fiano",13.5,"alta","assenti","pieno",1.5,["nocciola","zafferano","minerale profondo","pesca matura","spezie di montagna"],["spaghetti alle vongole","frittura di paranza","formaggi Provolone del Monaco","astice"],["carne rossa","salumi"],"fiano-picariello","bianco_sud"),
    W("AGR001","Aglianico del Vulture DOC Grifalco","Basilicata","Italia","Rosso","standard",27.5,"Aglianico",13.5,"alta","potenti","pieno",1.0,["more selvatiche","humus","spezie vulcaniche","vaniglia"],["agnello","salsiccia lucana","pasta al ragù"],["pesce","crostacei"],"aglianico-vulture-grifalco","rosso_campania"),
    W("AGR002","Aglianico del Vulture Superiore DOCG Elena Fucci Titolo","Basilicata","Italia","Rosso","premium",43.5,"Aglianico",14.0,"alta","strutturati","pieno",1.0,["ciliegia nera","violetta","pepe nero","cuoio","mineralità vulcanica"],["agnello al forno","capretto","pasta al ragù con salsiccia","formaggi stagionati lucani"],["pesce","frutti di mare"],"aglianico-vulture-elena-fucci","rosso_campania"),
    # ══════════════════════════════════
    # ITALIA — SICILIA
    # ══════════════════════════════════
    W("ETR001","Etna Rosso DOC Cornelissen Susucaru","Sicilia","Italia","Rosso","premium",30.5,"Nerello Mascalese",13.0,"altissima","fini","medio",0.8,["lampone","fragola alpina","cenere vulcanica","spezie fini","geranio"],["pesce al forno","tonno alla siciliana","pasta alla norma","formaggi freschi"],["brasati grassi","formaggi molto stagionati"],"etna-rosso-cornelissen","rosso_sicilia"),
    W("ETR002","Etna Rosso DOC Benanti Serra della Contessa","Sicilia","Italia","Rosso","premium",43.5,"Nerello Mascalese",13.5,"altissima","fini","medio",0.8,["lampone","ciliegia acida","minerale vulcanico","cenere","erbe aromatiche"],["tonno rosso","salmone","pesce spada","pasta ai frutti di mare","formaggi pecorino giovane"],["brasati","carne rossa pesante"],"etna-rosso-benanti-serra","rosso_sicilia"),
    W("NEA001","Nero d'Avola DOC Cusumano Benuara","Sicilia","Italia","Rosso","economico",11.5,"Nero d'Avola",14.0,"media","morbidi","pieno",3.0,["frutti rossi maturi","cacao","spezie calde","confettura"],["pasta alla norma","arancine","carne alla griglia","pizza","caponata"],["pesce crudo","carpacci"],"nero-avola-cusumano","rosso_sicilia"),
    W("ETB001","Etna Bianco DOC Benanti Pietra Marina","Sicilia","Italia","Bianco","standard",26.0,"Carricante",13.0,"altissima","assenti","pieno",1.2,["agrumi canditi","vulcanico","iodio","pompelmo","pietra focaia"],["crostacei","pesce alla griglia","pasta ai ricci","spaghetti alle vongole","formaggi pecorino giovane"],["carni rosse","dessert"],"etna-bianco-benanti","bianco_sud"),
    W("CAT001","Cataratto Siciliano DOC Tasca d'Almerita","Sicilia","Italia","Bianco","economico",10.5,"Cataratto",13.0,"media","assenti","medio",2.5,["fiori bianchi","pesca","mandorla","agrumi siciliani"],["pasta con le sarde","frittura di pesce","pesce spada","cous cous siciliano"],["carne rossa","formaggi piccanti"],"cataratto-tasca-almerita","bianco_sud"),
    W("PAS001","Passito di Pantelleria DOC Donnafugata Ben Ryé","Sicilia","Italia","Dolce","premium",42.0,"Zibibbo",14.5,"alta","assenti","pieno",150.0,["albicocca secca","dattero","fichi","miele di zagara","agrumi canditi","iodio"],["formaggi erborinati","foie gras","crostate di frutta secca","dessert alla frutta","biscotti secchi"],["pesce crudo","carne rossa","piatti salati"],"passito-pantelleria-donnafugata","dolce"),
    W("MAL002","Malvasia delle Lipari DOC Hauner","Sicilia","Italia","Dolce","premium",31.0,"Malvasia di Lipari",13.5,"media","assenti","pieno",90.0,["albicocca confitta","arancio","miele","spezie dolci","vaniglia"],["formaggi erborinati","crostate","biscotti di mandorle","frutta secca","cantucci"],["pesce crudo","carne rossa"],"malvasia-lipari-hauner","dolce"),
    W("NEH001","Nero d'Avola Rosato IGT Abele","Sicilia","Italia","Rosato","economico",11.0,"Nero d'Avola",13.0,"media","assenti","leggero-medio",2.5,["fragola","pesca","fiori di arancio","corallo"],["arancine","pasta al pomodoro fresco","caponata","pesce alla griglia","antipasti siciliani"],["selvaggina","formaggi molto stagionati"],"nero-avola-rosato-abele","rosato"),
    # ══════════════════════════════════
    # ITALIA — SUD, SARDEGNA, UMBRIA
    # ══════════════════════════════════
    W("CAN001","Cannonau di Sardegna DOC Sella&Mosca","Sardegna","Italia","Rosso","economico",13.0,"Cannonau",14.0,"media","morbidi","medio-pieno",2.0,["spezie","prugna","macchia mediterranea","tostato"],["agnello","maiale","formaggi sardi","pasta con salsiccia"],["ostriche","pesce molto delicato"],"cannonau-sella-mosca","rosso_sardegna"),
    W("CAN002","Cannonau di Sardegna DOC Riserva Argiolas Costera","Sardegna","Italia","Rosso","standard",19.0,"Cannonau",14.5,"media","morbidi","pieno",2.0,["macchia mediterranea","more","vaniglia","cuoio","tostato nobile"],["agnello al forno","capretto","formaggi Pecorino Sardo stagionato","pasta alla salsiccia"],["pesce crudo","ostriche"],"cannonau-argiolas-costera","rosso_sardegna"),
    W("VER001","Vermentino di Gallura DOCG Piero Mancini","Sardegna","Italia","Bianco","standard",18.0,"Vermentino",13.5,"media","assenti","medio",3.0,["macchia mediterranea","mandorla","fiori di ginestra","albicocca","agrumi"],["aragosta","gamberi","pesce alla sarda","pasta con bottarga","frittura"],["carne rossa","selvaggina"],"vermentino-gallura-mancini","bianco_sud"),
    W("VER004","Vermentino di Sardegna DOC Argiolas Costamolino","Sardegna","Italia","Bianco","economico",11.0,"Vermentino",13.0,"media","assenti","leggero-medio",3.0,["fiori di campo","mandorla","agrumi","pesca delicata"],["antipasti di mare","frittura","pesce alla griglia","insalate"],["carne rossa","selvaggina"],"vermentino-argiolas-costamolino","bianco_sud"),
    W("SAG001","Sagrantino DOCG Montefalco Caprai 25 Anni","Umbria","Italia","Rosso","premium",49.5,"Sagrantino",14.5,"media","titanici","pieno",1.0,["more","tabacco","spezie scure","cioccolato","mirtillo selvatico"],["cinghiale","selvaggina pesante","pasta al tartufo nero","formaggi molto stagionati"],["pesce","piatti leggeri","crostacei"],"sagrantino-caprai-25anni","rosso_umbria"),
    W("ORV001","Orvieto Classico Superiore DOC Palazzone Campo del Guardiano","Umbria","Italia","Bianco","premium",30.5,"Grechetto + Trebbiano + Verdello",13.0,"alta","assenti","medio-pieno",1.5,["miele","camomilla","minerale gessoso","pesca bianca","mandorla"],["pasta al tartufo bianco","carne bianca","formaggi semi-stagionati","torta al testo"],["carne rossa","selvaggina"],"orvieto-palazzone-guardiano","bianco_nord"),
    W("MON001","Montepulciano d'Abruzzo DOC Masciarelli Marina Cvetic","Abruzzo","Italia","Rosso","standard",18.5,"Montepulciano",13.5,"media","morbidi","pieno",2.5,["more","ciliegia nera","cioccolato","spezie dolci"],["arrosticini","pizza","pasta al ragù","lamb chops","porchetta"],["pesce","antipasti di mare"],"montepulciano-masciarelli","rosso_campania"),
    W("TRE002","Trebbiano d'Abruzzo DOC Valentini","Abruzzo","Italia","Bianco","premium",41.5,"Trebbiano d'Abruzzo",13.5,"alta","assenti","pieno",1.0,["camomilla","mandorla","miele","minerale profondo","idrocarburi nobili"],["brodetto","dentice","pasta con le sarde","formaggi semi-stagionati","pollo arrosto"],["carne rossa","selvaggina"],"trebbiano-abruzzo-valentini","bianco_sud"),
    W("CER001","Cerasuolo d'Abruzzo DOC Valentini","Abruzzo","Italia","Rosato","premium",37.0,"Montepulciano",13.5,"media","leggeri","medio",1.5,["ciliegia fresca","melograno","spezie leggere","rosa","fragola"],["pasta alla chitarra con ragù","arrosticini","pizza","formaggi semi-stagionati","salmone"],["selvaggina pesante","dolci"],"cerasuolo-abruzzo-valentini","rosato"),
    W("CIR001","Cirò Rosso Classico DOC Librandi Duca Sanfelice","Calabria","Italia","Rosso","standard",16.0,"Gaglioppo",13.5,"media","medi","medio-pieno",1.5,["ciliegia nera","spezie meridionali","arancia sanguinella","cuoio leggero"],["nduja","pasta al ragù calabrese","formaggi Caciocavallo","pesce spada alla ghiotta"],["pesce delicato","ostriche"],"ciro-rosso-librandi","rosso_campania"),
    W("PRO002","Primitivo di Manduria DOC ES Gianfranco Fino","Puglia","Italia","Rosso","premium",35.0,"Primitivo",16.0,"media","vellutati","pieno",6.0,["confettura di more","cioccolato","spezie dolci","tabacco","fico secco"],["agnello alla pugliese","orecchiette al ragù","formaggi stagionati pugliesi","carne brasata","BBQ"],["pesce delicato","piatti leggeri"],"primitivo-manduria-es-fino","rosso_campania"),
    W("NEG001","Negroamaro Salento IGT Taurino Patriglione","Puglia","Italia","Rosso","standard",18.0,"Negroamaro",14.0,"media","morbidi","pieno",2.5,["mora","spezie di gariga","tabacco dolce","cioccolato al latte"],["orecchiette con cime di rapa","agnello","pizza al forno a legna","formaggi pecorino"],["pesce crudo","crostacei"],"negroamaro-taurino","rosso_campania"),
    W("NEG002","Nero di Troia Puglia IGT Tormaresca Bocca di Lupo","Puglia","Italia","Rosso","premium",32.5,"Nero di Troia",14.5,"alta","potenti","pieno",1.0,["prugna","mirtillo selvatico","pepe","rabarbaro","spezie orientali"],["agnello al forno","carne alla brace","formaggi Canestrato Pugliese","pasta al ragù"],["pesce","crostacei","piatti leggeri"],"nero-troia-tormaresca","rosso_campania"),
    # ══════════════════════════════════
    # EUROPA — FRANCIA
    # ══════════════════════════════════
    W("CHA001","Chablis Premier Cru Raveneau","Francia","Europa","Bianco","lusso",97.2,"Chardonnay",12.5,"altissima","assenti","pieno",1.0,["iodio","pietra focaia","gesso","limone candito","ostrica"],["ostriche","crostacei","pesce alla piastra","sushi di tonno","tartar di salmone"],["carne rossa","formaggi stagionati","brasati"],"chablis-raveneau","bianco_estero"),
    W("CHA002","Chablis AOC William Fèvre","Francia","Europa","Bianco","standard",21.0,"Chardonnay",12.0,"alta","assenti","leggero-medio",1.5,["pietra focaia","agrumi verdi","fiori bianchi","gesso","leggermente iodato"],["frutti di mare","ostriche","salmone","sashimi","risotto leggero"],["carne rossa","formaggi molto stagionati"],"chablis-william-fevre","bianco_estero"),
    W("BUR001","Meursault Premier Cru Coche-Dury","Francia","Europa","Bianco","lusso",400.2,"Chardonnay",13.5,"alta","assenti","pieno",1.0,["burro noisette","nocciola tostata","agrumi canditi","pietra focaia","miele di tiglio"],["aragosta alla crema","capesante al burro","foie gras di anatra","tartufo bianco","formaggi Époisses"],["carne rossa","formaggi molto piccanti"],"meursault-coche-dury","bianco_estero"),
    W("PNG001","Pinot Noir Beaune Jadot","Francia","Europa","Rosso","lusso",118.4,"Pinot Noir",13.0,"alta","fini","medio",1.0,["lampone","fragola selvatica","violetta","foglia di tè","terra di Borgogna","pepe bianco"],["petto d'anatra","fagiano","funghi porcini","piccione","salmone al forno","formaggi Époisses"],["carne rossa pesante","piatti piccanti","selvaggina muschiata"],"pinot-noir-jadot-beaune","rosso_estero"),
    W("CHP001","Champagne Brut Billecart-Salmon Blanc de Blancs","Francia","Europa","Spumante","lusso",93.7,"Chardonnay",12.0,"alta","assenti","leggero-medio",6.0,["brioche","limone confit","agrumi fini","fiori bianchi","gesso"],["ostriche","caviale","scampi","sashimi","formaggi freschi erborinati","capesante"],["carne rossa","formaggi molto stagionati","cioccolato fondente"],"champagne-billecart-blanc-blancs","spumante"),
    W("CHP002","Champagne Brut Krug Grande Cuvée","Francia","Europa","Spumante","lusso",261,"Pinot Noir + Chardonnay + Pinot Meunier",12.0,"alta","assenti","pieno",6.0,["brioche tostata","noci","mele dorate","crosta di pane","agrumi canditi","miele"],["caviale Beluga","astice al burro","tartufo bianco","formaggi Comté stagionato","salmone selvaggio affumicato"],["piatti molto dolci","carne rossa pesante"],"champagne-krug-grande-cuvee","spumante"),
    W("SAU001","Sauternes Château Rieussec 2015","Francia","Europa","Dolce","lusso",109.8,"Sémillon + Sauvignon Blanc + Muscadelle",13.5,"alta","assenti","pieno",120.0,["miele d'acacia","zafferano","albicocca confitta","ananas","vaniglina","noce moscata"],["foie gras d'anatra","formaggi erborinati Roquefort","tarte tatin","crostate","salmone affumicato con miele"],["carne rossa secca","pesce crudo","piatti piccanti"],"sauternes-rieussec-2015","dolce"),
    W("CDR001","Côtes du Rhône Rouge Château Rayas Pignan","Francia","Europa","Rosso","premium",36.0,"Grenache",14.5,"media","morbidi","pieno",2.0,["frutti rossi maturi","spezie meridionali","garrigue","lavanda","pepe"],["agnello provenzale","ratatouille","pizza gourmet","formaggi erborinati","pasta al ragù"],["pesce delicato","ostriche"],"cotes-rhone-rayas-pignan","rosso_estero"),
    W("GEW002","Riesling Alsace Grand Cru Trimbach Clos Sainte Hune","Francia","Europa","Bianco","lusso",121.9,"Riesling",13.0,"alta","assenti","pieno",3.0,["idrocarburi nobili","miele","lime","pietra bagnata","zafferano","datteri"],["choucroute garnie","foie gras","munster affinato","aragoste","salmone in crosta"],["carne rossa pesante","piatti molto dolci"],"trimbach-clos-sainte-hune","bianco_estero"),
    W("CAB001","Chinon AOC Cabernet Franc Charles Joguet","Francia","Europa","Rosso","premium",39.5,"Cabernet Franc",12.5,"alta","fini","medio",0.8,["ribes rosso","violetta","grafite","peperone verde","humus","spezie fini"],["coniglio in umido","pollo al forno","funghi trifolati","pasta al ragù delicato","formaggi semistagionati"],["pesce crudo","dessert","brasati molto pesanti"],"chinon-joguet-clos-chene","rosso_estero"),
    W("MOU001","Mouton Rothschild Pauillac AOC 2015","Francia","Europa","Rosso","lusso",486.4,"Cabernet Sauvignon + Merlot + Cab.Franc",13.5,"media","strutturati","pieno",0.5,["ribes nero","cedro","sigaro","pepe","spezie nobili","grafite"],["filetto di manzo Wagyu","agnello rack","selvaggina nobile","formaggi Comté 36 mesi"],["pesce","piatti leggeri","dolci"],"mouton-rothschild-2015","rosso_estero"),
    W("ROS002","Rosé de Provence AOC Château Miraval","Francia","Europa","Rosato","standard",23.5,"Cinsault + Grenache + Syrah",13.0,"alta","assenti","leggero-medio",1.5,["fragola","fiori di campo","agrumi","petali di rosa","note marine"],["bouillabaisse","salade niçoise","pizza","tapas","griglia leggera","caprese"],["carne rossa pesante","formaggi molto stagionati"],"rose-miraval","rosato"),
    W("CRE001","Crépy AOC Savoie Domaine Dupasquier","Francia","Europa","Bianco","economico",14.0,"Chasselas",11.5,"alta","assenti","leggero",2.0,["mela verde","fiori alpini","minerale","leggermente frizzante","citrus"],["fonduta","raclette","formaggi alpini","pesce di lago","sushi leggero","tartare"],["carne rossa","formaggi molto stagionati","piatti piccanti"],"crepy-dupasquier","bianco_estero"),
    W("GRE002","Grenache Blanc Roussillon AOC Domaine Gauby","Francia","Europa","Bianco","premium",31.5,"Grenache Blanc",14.0,"media","leggeri","pieno",2.5,["pesca bianca","fiori di mandorlo","spezie provenzali","anice","mandorla"],["bouillabaisse","pesce alla provenzale","ratatouille","poulet rôti","formaggi chèvre"],["carne rossa pesante","formaggi molto stagionati"],"grenache-blanc-gauby","bianco_estero"),
    W("MER001","Pomerol Château Pétrus 2016","Francia","Europa","Rosso","lusso",3247.6,"Merlot",13.5,"media","vellutati","pieno",1.0,["prugna matura","tartufo","cioccolato fondente","viole","spezie dolci"],["filetto Wagyu","agnello rack","tartufo nero","piccione","formaggi Comté 48 mesi"],["pesce","piatti leggeri"],"petrus-2016","rosso_estero"),
    W("SYR004","Crozes-Hermitage Syrah M.Chapoutier","Francia","Europa","Rosso","standard",24.0,"Syrah",13.0,"alta","medi","medio-pieno",1.0,["olive nere","pepe bianco","more","viola","spezie del Rodano"],["agnello rosticciana","cassoulet","formaggi semiduri","pasta al ragù"],["pesce delicato","ostriche"],"crozes-hermitage-chapoutier","rosso_estero"),
    W("VIO001","Viognier Condrieu AOC Guigal","Francia","Europa","Bianco","lusso",98.9,"Viognier",14.0,"bassa","assenti","pieno",3.0,["albicocca fresca","pesca nettarina","fiori d'arancio","mandorla","spezie floreali"],["aragosta al burro","foie gras","cucina thai","curry di pollo","capesante al vapore"],["carne rossa secca","pesce crudo delicato"],"condrieu-guigal","bianco_estero"),
    # ══════════════════════════════════
    # EUROPA — SPAGNA
    # ══════════════════════════════════
    W("RIO001","Rioja Gran Reserva Muga Prado Enea 2015","Spagna","Europa","Rosso","premium",49.0,"Tempranillo + Garnacha",14.0,"media","vellutati","pieno",1.5,["vaniglia","cocco","frutta matura","cuoio","spezie dolci","tabacco"],["cordero asado","cochinillo","pasta al ragù","formaggi Manchego stagionati","prosciutto iberico"],["pesce crudo","ostriche","piatti leggeri"],"rioja-muga-prado-enea","rosso_estero"),
    W("RIB001","Ribera del Duero Reserva Pesquera Janus 2016","Spagna","Europa","Rosso","premium",41.5,"Tempranillo",14.0,"media","strutturati","pieno",1.8,["frutti neri","tostato","spezie dolci","cioccolato","vaniglia americana"],["agnello lechal","carne alla brace","formaggi stagionati","pasta al ragù pesante"],["pesce","crostacei","piatti molto leggeri"],"ribera-pesquera-janus","rosso_estero"),
    W("ALB001","Albariño Rías Baixas DO Pazo San Mauro","Spagna","Europa","Bianco","standard",18.5,"Albariño",12.5,"alta","assenti","leggero-medio",2.0,["albicocca","salino oceanico","pesca","citrus atlantico","fiori bianchi"],["polpo alla gallega","gambas al ajillo","salmone","frutos del mar","spaghetti alle vongole","pesce alla griglia"],["carne rossa","formaggi stagionati","piatti piccanti"],"albarino-pazo-san-mauro","bianco_estero"),
    W("VER002","Verdejo Rueda DO Belondrade y Lurton","Spagna","Europa","Bianco","standard",20.5,"Verdejo",13.0,"alta","assenti","medio",1.5,["erba fresca","pompelmo","fico","note erbacee","agrumi"],["insalate","ceviche","caprese","pesce al limone","verdure grigliate","pollo leggero"],["carne rossa","formaggi molto stagionati"],"verdejo-belondrade","bianco_estero"),
    W("TEM001","Tempranillo Ribera del Duero Jóven Pago de los Capellanes","Spagna","Europa","Rosso","economico",12.0,"Tempranillo",13.5,"media","leggeri","medio",2.0,["ciliegia fresca","lampone","floreale","spezie leggere"],["pizza","pasta al pomodoro","chorizo","hamburger","pincho moruno"],["pesce crudo","ostriche"],"tempranillo-joven-capellanes","rosso_estero"),
    W("RIO002","Rioja Blanco Reserva López de Heredia Viña Gravonia","Spagna","Europa","Bianco","standard",28.5,"Viura",12.5,"alta","leggeri","medio-pieno",1.0,["nocciola ossidativa","miele","camomilla","mela cotogna","tostato antico"],["bacalà","patatas bravas","carne bianca","formaggi semi-stagionati","uova"],["pesce crudo delicato","carne rossa","frutti di mare"],"rioja-blanco-lopez-heredia","bianco_estero"),
    W("PRI001","Priorat DOC Alvaro Palacios L'Ermita 2018","Spagna","Europa","Rosso","lusso",403.6,"Garnacha + Cabernet Sauvignon",15.0,"media","vellutati","pieno",2.5,["more concentrate","minerale di ardesia","kirsch","spezie orientali","cioccolato fondente","lavanda"],["agnello rack","cinghiale","carne alla brace premium","formaggi stagionati iberici"],["pesce delicato","piatti leggeri"],"ermita-alvaro-palacios","rosso_estero"),
    W("JER001","Jerez Fino En Rama Tio Pepe Gonzalez Byass","Spagna","Europa","Bianco","standard",16.0,"Palomino",15.0,"alta","assenti","leggero",0.0,["mandorla ossidativa","salino","fieno secco","lievito di flor","agrumi secchi"],["jamón ibérico","gambas al ajillo","tapas","ostriche","pesce fritto","aceitunas"],["carne rossa pesante","dolci molto dolci"],"fino-tio-pepe","bianco_estero"),
    W("CAV001","Cava Brut Nature Gramona Imperial","Spagna","Europa","Spumante","premium",37.5,"Macabeo + Xarel·lo + Parellada",11.5,"alta","assenti","medio",0.0,["mela verde","agrumi","lievito fresco","fiori bianchi","mineralità"],["tapas","gambas","pesce alla griglia","formaggi freschi","jamón serrano"],["carne rossa pesante","dolci"],"cava-gramona-imperial","spumante"),
    W("MEN001","Mencia Ribeira Sacra DO Descendientes de J. Palacios","Spagna","Europa","Rosso","premium",38.0,"Mencía",13.0,"alta","fini","medio",0.8,["lampone","violetta","spezie galiziane","minerale di granito","fiori"],["polpo alla galiziana","carne bianca","formaggi semi-stagionati","funghi"],["carne rossa pesante","piatti molto grassi"],"mencia-palacios","rosso_estero"),
    W("GAR001","Garnacha Vieja Campo de Borja DO Borsao Berola","Spagna","Europa","Rosso","economico",10.5,"Garnacha",14.5,"bassa","morbidi","pieno",3.0,["mora matura","spezie dolci","prugna","cioccolato al latte"],["tapas","pizza","pasta al sugo","salsiccia","paella"],["pesce crudo","piatti delicati"],"garnacha-borsao-berola","rosso_estero"),
    # ══════════════════════════════════
    # EUROPA — GERMANIA
    # ══════════════════════════════════
    W("RIE001","Riesling Spätlese Mosel Joh. Jos. Prüm Wehlener Sonnenuhr","Germania","Europa","Dolce","premium",39.0,"Riesling",8.0,"altissima","assenti","leggero",50.0,["pesca bianca","albicocca","idrocarburi nobili","pietra","lime","miele leggero"],["cucina cinese","foie gras","formaggi erborinati","sushi","tempura","maiale al vapore"],["carne rossa secca","selvaggina","piatti aggressivi"],"riesling-prum-wehlener","bianco_estero"),
    W("RIE002","Riesling Trocken Mosel Egon Müller Scharzhofberger","Germania","Europa","Bianco","lusso",112.1,"Riesling",11.5,"altissima","assenti","medio",5.0,["petrol nobile","agrumi cangianti","pietra focaia","miele di bosco","fiori bianchi"],["sushi premium","capesante","ceviche","pesce crudo","tartare di tonno","formaggi freschi alpini"],["carne rossa","brasati pesanti"],"riesling-egon-muller","bianco_estero"),
    W("SPB001","Spätburgunder Pinot Noir Baden Bernhard Huber","Germania","Europa","Rosso","premium",48.5,"Spätburgunder (Pinot Noir)",13.5,"alta","fini","medio",1.0,["lampone","ciliegia","violetta","spezie delicate","sottobosco"],["salmone al forno","petto d'anatra","funghi porcini","Wiener Schnitzel","selvaggina delicata"],["carne rossa pesante","piatti molto grassi"],"spatburgunder-huber","rosso_estero"),
    W("RIE003","Riesling Kabinett Rheingau Schloss Johannisberg","Germania","Europa","Dolce","standard",24.5,"Riesling",10.0,"altissima","assenti","leggero",35.0,["lime","albicocca","mela verde","minerale","leggero floreale"],["sushi","insalate di mare","formaggi freschi","cucina asiatica","capesante"],["carne rossa","piatti molto grassi"],"riesling-schloss-johannisberg","bianco_estero"),
    W("GEW003","Gewürztraminer Pfalz Bürklin-Wolf","Germania","Europa","Bianco","standard",20.5,"Gewürztraminer",13.0,"bassa","assenti","pieno",6.0,["rosa intensa","litchi","spezie tedesche","zenzero","petali di gelsomino"],["cucina indiana","curry","salmone affumicato","formaggi a crosta fiorita","asparagi bianchi"],["carne rossa secca","piatti iodati delicati"],"gewurztraminer-burklin-wolf","bianco_estero"),
    # ══════════════════════════════════
    # EUROPA — AUSTRIA
    # ══════════════════════════════════
    W("GRU001","Grüner Veltliner Smaragd Wachau Knoll Loibenberg","Austria","Europa","Bianco","premium",37.5,"Grüner Veltliner",13.5,"alta","assenti","pieno",1.5,["pepe bianco","erbe alpine","minerale","lime","pompelmo","prezzemolo"],["asparagi","Wiener Schnitzel","salmone","formaggi alpini giovani","verdure grigliate","pollo in crosta di erbe"],["carne rossa pesante","formaggi molto stagionati","piatti dolci"],"gruner-veltliner-knoll","bianco_estero"),
    W("GRU002","Grüner Veltliner Federspiel Wachau Domäne Wachau","Austria","Europa","Bianco","standard",19.0,"Grüner Veltliner",12.5,"alta","assenti","leggero-medio",2.0,["pepe verde","mela","citrus","erbe fresche","minerale"],["insalate","pollo leggero","asparagi","pesce bianco","verdure al vapore"],["carne rossa","selvaggina"],"gruner-federspiel-wachau","bianco_estero"),
    W("BLF001","Blaufränkisch Reserve Burgenland Moric","Austria","Europa","Rosso","premium",38.5,"Blaufränkisch",13.0,"alta","fini","medio-pieno",0.8,["mirtillo","spezie nere","pimento","violetta","grafite"],["Tafelspitz","manzo brasato","funghi","gulasch","formaggi alpini stagionati"],["pesce delicato","piatti molto dolci"],"blaufrankisch-moric","rosso_estero"),
    W("ZWE001","Zweigelt Burgenland Classic Umathum","Austria","Europa","Rosso","standard",20.0,"Zweigelt",13.0,"alta","medi","medio",1.0,["ciliegia nera","spezie viennesi","violetta","cioccolato leggero"],["Wiener Schnitzel","salsiccia Viennese","formaggi alpini","pasta al ragù"],["pesce crudo","ostriche"],"zweigelt-umathum","rosso_estero"),
    W("GRU003","Grüner Veltliner Steinfeder Wachau Hirtzberger","Austria","Europa","Bianco","standard",23.5,"Grüner Veltliner",11.5,"alta","assenti","leggero",1.5,["pompelmo","erbe di campo","pietra bagnata","lime"],["aperitivo","vegetariano","pesce leggero","insalate di primavera"],["carne rossa","formaggi stagionati"],"gruner-steinfeder-hirtzberger","bianco_estero"),
    # ══════════════════════════════════
    # EUROPA — PORTOGALLO & GRECIA
    # ══════════════════════════════════
    W("POR001","Vintage Port Graham's 2016","Portogallo","Europa","Dolce","lusso",86.2,"Touriga Nacional blend",20.0,"media","potenti","pieno",90.0,["frutti neri confettati","cioccolato","spezie esotiche","tabacco","noci"],["stilton","formaggi erborinati","cioccolato fondente 70%","noci","dessert al cioccolato"],["pesce","crostacei","piatti salati delicati"],"port-grahams-2016","dolce"),
    W("VIN003","Vinho Verde DOC Quinta do Ameal Escolha","Portogallo","Europa","Bianco","economico",11.5,"Loureiro + Arinto",11.0,"alta","assenti","leggero",3.5,["lime","fiori bianchi","mela verde","leggermente frizzante","erbe fresche"],["polvo à lagareiro","baccalà","pesce fritto","gamberi","insalate","sushi"],["carne rossa","formaggi stagionati","piatti molto ricchi"],"vinho-verde-quinta-ameal","bianco_estero"),
    W("DOC001","Douro Reserva Quinta do Crasto","Portogallo","Europa","Rosso","standard",20.5,"Touriga Franca + Touriga Nacional",14.0,"alta","strutturati","pieno",1.5,["frutti neri","violetta","spezie lusitane","grafite","tabacco"],["bacalhau","agnello alla portoghese","pasta al ragù","carne alla griglia"],["pesce delicato","ostriche"],"douro-crasto","rosso_estero"),
    W("TOA001","Touriga Nacional Alentejo DOC Esporão Reserva","Portogallo","Europa","Rosso","premium",32.0,"Touriga Nacional + Aragonez",14.0,"alta","strutturati","pieno",1.5,["ribes nero","violetta","menta","spezie meridionali","cuoio"],["agnello al forno","carne alla brace","formaggi Queijo Serpa","pasta al ragù"],["pesce delicato","ostriche"],"esporao-reserva","rosso_estero"),
    W("XIN001","Xinomavro Naoussa PDO Kir-Yianni Diaporos","Grecia","Europa","Rosso","premium",32.0,"Xinomavro",13.5,"alta","potenti","pieno",0.8,["pomodoro essiccato","olive nere","spezie greche","ciliegia acida","tabacco"],["moussaka","agnello al forno con origano","stifado","pasta al forno","formaggi feta stagionata"],["pesce delicato","piatti leggeri"],"xinomavro-kir-yianni","rosso_estero"),
    W("ASS001","Assyrtiko Santorini PDO Sigalas","Grecia","Europa","Bianco","standard",29.0,"Assyrtiko",13.5,"altissima","assenti","pieno",1.0,["vulcanico","iodio","agrumi secchi","pietra pomice","sale marino","lime"],["octopus grigliato","ceviche","sushi di tonno","crostacei crudi","lavraki al forno","calamari"],["carne rossa","dolci","formaggi stagionati pesanti"],"assyrtiko-santorini-sigalas","bianco_estero"),
    W("MAV001","Mavrodaphne of Patras PDO Achaia Clauss","Grecia","Europa","Dolce","standard",18.5,"Mavrodaphne",15.0,"media","morbidi","pieno",120.0,["uvetta","cioccolato","spezie greche","fico","cannella"],["formaggi erborinati","dolci al cioccolato","biscotti al sesamo","dessert alla frutta secca"],["pesce","piatti salati"],"mavrodaphne-achaia-clauss","dolce"),
    W("MOS002","Moschofilero Mantineia PDO Tselepos","Grecia","Europa","Bianco","standard",17.5,"Moschofilero",12.0,"alta","assenti","leggero-medio",2.5,["rosa fresca","agrumi","note floreali delicate","erbe greche"],["insalata greca","frutti di mare","salmone","pesce bianco alla griglia"],["carne rossa","formaggi stagionati"],"moschofilero-tselepos","bianco_estero"),
    # ══════════════════════════════════
    # SUD AMERICA — ARGENTINA & CILE
    # ══════════════════════════════════
    W("MAL001","Malbec Reserva Achaval Ferrer Mendoza","Argentina","Sud America","Rosso","standard",22.0,"Malbec",14.5,"media","morbidi","pieno",2.5,["mora","prugna","cioccolato fondente","violetta","spezie dolci"],["asado","churrasco","hamburger","pasta al ragù","formaggi semiduri","empanadas"],["pesce crudo","ostriche","dessert delicati"],"malbec-achaval-ferrer","rosso_estero"),
    W("MAL003","Malbec Gran Reserva Catena Zapata Adrianna Vineyard","Argentina","Sud America","Rosso","lusso",119.6,"Malbec",14.0,"alta","seta","pieno",1.5,["more di alta quota","violetta","spezie andine","cacao fine","grafite"],["asado premium","filetto di manzo","agnello","pasta al ragù nobile","formaggi stagionati"],["pesce","piatti leggeri"],"malbec-catena-adrianna","rosso_estero"),
    W("CAB003","Cabernet Sauvignon Maipo Valley Concha y Toro Don Melchor","Cile","Sud America","Rosso","premium",62.0,"Cabernet Sauvignon",14.0,"media","strutturati","pieno",1.5,["ribes nero","eucalipto","menta","spezie dolci","cedro","pepe"],["carne alla brace cilena","agnello","hamburger gourmet","pasta al ragù","formaggi stagionati"],["pesce delicato","ostriche"],"don-melchor-concha-toro","rosso_estero"),
    W("CAR002","Carménère Rapel Valley Montes Purple Angel","Cile","Sud America","Rosso","premium",47.5,"Carménère + Petit Verdot",14.5,"media","vellutati","pieno",2.0,["paprika","peperone rosso","cioccolato","caffè","spezie cilene"],["empanadas","carne alla brace","pasta al ragù piccante","formaggi semi-stagionati"],["pesce","piatti molto delicati"],"carmenere-montes-purple-angel","rosso_estero"),
    W("SAU004","Sauvignon Blanc Casablanca Valley Concha y Toro Terrunyo","Cile","Sud America","Bianco","standard",20.5,"Sauvignon Blanc",13.5,"alta","assenti","medio",2.0,["pompelmo","erba tagliata","agrumi","frutto della passione","fiori bianchi"],["ceviche","sushi","pesce al limone","insalate","capra fresca","gamberi"],["carne rossa","formaggi stagionati"],"sauvignon-terrunyo","bianco_estero"),
    W("MAL002a","Malbec Uco Valley Clos de los Siete Michel Rolland","Argentina","Sud America","Rosso","premium",35.5,"Malbec + Merlot + Cabernet Sauvignon",14.5,"media","vellutati","pieno",2.0,["prugna","violetta","cioccolato","spezie morbide","cassis"],["asado","hamburger gourmet","agnello","pasta al ragù","formaggi semiduri"],["pesce","piatti delicati"],"malbec-clos-siete","rosso_estero"),
    W("TOR001","Torrontés Salta Valle Calcháquí Clos de los Siete","Argentina","Sud America","Bianco","standard",17.5,"Torrontés",13.5,"alta","assenti","leggero-medio",3.5,["gelsomino","rosa","albicocca fresca","agrumi andini","frutto della passione"],["ceviche andino","pesce bianco","insalate di frutta","cucina speziata leggera","formaggi freschi"],["carne rossa pesante","formaggi molto stagionati"],"torrontes-clos-siete","bianco_estero"),
    W("CAR003","Carménère Reserva Valle del Maipo Concha y Toro","Cile","Sud America","Rosso","economico",11.0,"Carménère",13.5,"media","morbidi","medio-pieno",2.5,["peperone rosso","more","cioccolato al latte","spezie leggere"],["pasta al ragù","pizza","salsiccia","hamburger","anticuchos"],["pesce crudo","piatti delicati"],"carmenere-reserva-concha-toro","rosso_estero"),
    # ══════════════════════════════════
    # AMERICHE — USA
    # ══════════════════════════════════
    W("ZIN001","Zinfandel Old Vines Ridge Vineyards Lodi","California","Americhe","Rosso","standard",20.5,"Zinfandel",15.0,"media","morbidi","pieno",4.0,["mora jam","pepe nero","vaniglia americana","mirtillo","cioccolato al latte"],["barbecue","pulled pork","hamburger gourmet","pizza al salame","pasta al ragù piccante"],["pesce delicato","ostriche","piatti leggeri"],"zinfandel-ridge-lodi","rosso_estero"),
    W("CHI003a","Chardonnay Napa Valley Rombauer Vineyards","California","Americhe","Bianco","premium",48.5,"Chardonnay",14.5,"media","assenti","pieno",4.0,["burro fuso","vaniglia","ananas","mango","rovere dolce","burro di nocciola"],["aragosta al burro","pollo alla crema","pasta al salmone","risotto ai funghi","formaggi brie"],["pesce crudo iodato","piatti piccanti"],"chardonnay-rombauer","bianco_estero"),
    W("CAB002","Cabernet Sauvignon Napa Valley Opus One 2019","California","Americhe","Rosso","lusso",388.7,"Cabernet Sauvignon + Merlot + Cab.Franc + Malbec + Petit Verdot",14.5,"media","strutturati","pieno",1.5,["ribes nero","cedro","tabacco","spezie dolci","vaniglia di rovere","cioccolato premium"],["filetto Wellington","agnello al rosmarino","selvaggina nobile","formaggi stagionati premium"],["pesce","piatti leggeri"],"opus-one-2019","rosso_estero"),
    W("PIN003","Pinot Noir Willamette Valley Domaine Drouhin Oregon","Oregon","Americhe","Rosso","premium",53.5,"Pinot Noir",13.5,"alta","fini","medio",1.0,["fragola","ciliegia acida","violetta","sottobosco pacifico","pepe rosa"],["salmone del Pacifico","petto d'anatra","funghi selvatici","piccione","brie stagionato"],["carne rossa pesante","piatti molto grassi"],"pinot-noir-drouhin-oregon","rosso_estero"),
    W("SAU003","Sauvignon Blanc Napa Valley Honig","California","Americhe","Bianco","standard",24.0,"Sauvignon Blanc",14.0,"alta","assenti","medio",2.5,["agrumi","erba tagliata","melone","pompelmo","fiori bianchi"],["capra fresca","insalate","sushi","ceviche","gamberi","asparagi"],["carne rossa","formaggi stagionati","brasati"],"sauvignon-honig","bianco_estero"),
    W("CAB004","Cabernet Sauvignon Napa Valley Stag's Leap Cask 23","California","Americhe","Rosso","lusso",241.5,"Cabernet Sauvignon",14.5,"media","vellutati","pieno",1.5,["ribes nero","cioccolato","cedro americano","spezie morbide","vaniglia"],["filetto di manzo","agnello","costata","formaggi stagionati americani"],["pesce","piatti leggeri"],"cab-stags-leap-cask23","rosso_estero"),
    W("ZIN002","Zinfandel Dry Creek Valley Ravenswood","California","Americhe","Rosso","standard",22.5,"Zinfandel",14.5,"media","morbidi","pieno",3.5,["mora","pepe","spezie tostate","cioccolato al latte","mora essiccata"],["ribs BBQ","salsiccia piccante","pizza americana","hamburger","pasta al ragù speziato"],["pesce","piatti leggeri"],"zinfandel-ravenswood","rosso_estero"),
    # ══════════════════════════════════
    # OCEANIA — AUSTRALIA & NZ
    # ══════════════════════════════════
    W("SYR001","Shiraz Penfolds Grange Hermitage","Australia","Oceania","Rosso","lusso",243.8,"Shiraz",14.5,"media","strutturati","pieno",2.0,["more selvatiche","pepe","spezie orientali","eucalipto","cuoio","fumo"],["agnello al forno","carne alla brace","formaggi stagionati robusti","brasato"],["pesce delicato","piatti leggeri","crostacei"],"penfolds-grange","rosso_estero"),
    W("SYR002","Shiraz Barossa Valley Torbreck RunRig","Australia","Oceania","Rosso","lusso",149.5,"Shiraz + Viognier",15.0,"media","vellutati","pieno",3.0,["more nere","violetta","pepe bianco","cioccolato fondente","spezie esotiche","eucalipto"],["agnello Barossa","BBQ gourmet","formaggi robusti stagionati","brasati"],["pesce","piatti delicati"],"runrig-torbreck","rosso_estero"),
    W("SAU002","Sauvignon Blanc Marlborough Cloudy Bay","Nuova Zelanda","Oceania","Bianco","standard",23.5,"Sauvignon Blanc",13.0,"alta","assenti","leggero-medio",2.0,["pompelmo","erba tagliata","asparago","passion fruit","note erbacee pungenti"],["capra fresca","insalate primaverili","sushi","pesce al lime","asparagi","ceviche"],["carne rossa","formaggi stagionati","brasati"],"sauvignon-cloudy-bay","bianco_estero"),
    W("PIN004","Pinot Noir Central Otago Felton Road Block 3","Nuova Zelanda","Oceania","Rosso","premium",58.5,"Pinot Noir",14.0,"alta","fini","medio",0.8,["ciliegia nera","spezie speziate","mirtillo","violetta","terra di scisto"],["agnello neozelandese","salmone del Pacifico","funghi tartufo","anatra","formaggi freschi"],["carne rossa pesante","piatti grassi"],"pinot-felton-road","rosso_estero"),
    W("CHA003","Chardonnay Margaret River Leeuwin Estate Art Series","Australia","Oceania","Bianco","lusso",77,"Chardonnay",13.5,"alta","assenti","pieno",2.0,["melone bianco","noci tostate","burro noisette","pesca matura","mineralità calcarea"],["aragosta","capesante","salmone in crosta","risotto ai funghi","pollo alla crema"],["carne rossa","formaggi piccanti"],"chardonnay-leeuwin","bianco_estero"),
    W("SYR003","Shiraz McLaren Vale d'Arenberg The Dead Arm","Australia","Oceania","Rosso","premium",52.0,"Shiraz",14.5,"media","strutturati","pieno",2.5,["mora","cuoio","eucalipto","pepe","spezie scure","cioccolato"],["agnello alla brace","BBQ australiano","carne rossa","formaggi stagionati duri"],["pesce","piatti leggeri"],"shiraz-darenberg-dead-arm","rosso_estero"),
    W("RIE004","Riesling Clare Valley Jim Barry The Armagh","Australia","Oceania","Bianco","premium",48.5,"Riesling",13.0,"altissima","assenti","medio",3.0,["lime","agrumi secchi","petrolio nobile","minerale","mela verde"],["sushi","tempura","cucina asiatica","capesante","pesce bianco"],["carne rossa","formaggi stagionati pesanti"],"riesling-jim-barry","bianco_estero"),
    W("GRE003","Grenache Barossa Valley Yalumba Bush Vine","Australia","Oceania","Rosso","standard",25.5,"Grenache",14.5,"bassa","morbidi","pieno",3.5,["mora matura","lampone caldo","spezie australiane","pepe rosa"],["agnello alla brace","pizza BBQ","salsiccia kangaroo","formaggi semi-stagionati"],["pesce crudo","ostriche"],"grenache-yalumba-barossa","rosso_estero"),
    # ══════════════════════════════════
    # ASIA — GIAPPONE & CINA
    # ══════════════════════════════════
    W("KOS001","Koshu Chateau Mercian Kikyogahara","Giappone","Asia","Bianco","premium",34.5,"Koshu",11.5,"alta","assenti","leggero",1.5,["pesca bianca delicata","yuzu","fiori di ciliegio","mineralità giapponese","note umami"],["sushi","sashimi","tempura","ramen al brodo chiaro","tofu","edamame"],["carne rossa pesante","formaggi stagionati","piatti piccanti"],"koshu-chateau-mercian","bianco_estero"),
    W("KOS002","Koshu Lumière Sparkling","Giappone","Asia","Spumante","premium",45.0,"Koshu",11.0,"alta","assenti","leggero",4.0,["yuzu effervescente","pesca fresca","fiori di pesco","mineralità vulcanica"],["sushi premium","sashimi di ricciola","tempura di gamberi","gyoza al vapore"],["carne rossa","formaggi stagionati"],"koshu-lumiere-sparkling","spumante"),
    # ══════════════════════════════════
    # NUOVI — LAZIO
    # ══════════════════════════════════
    W("LAZ001","Frascati Superiore DOCG Villa Simone","Lazio","Italia","Bianco","economico",14.5,"Malvasia + Trebbiano",12.5,"media","assenti","leggero-medio",2.0,["fiori bianchi","mandorla","agrumi","erbe di campo"],["carciofi alla romana","abbacchio","cacio e pepe leggero","pesce al forno"],["carne rossa pesante","selvaggina"],"frascati-villa-simone","bianco_nord"),
    W("LAZ002","Cesanese del Piglio DOCG Coletti Conti","Lazio","Italia","Rosso","standard",19.5,"Cesanese",13.5,"alta","medi","medio",1.2,["ciliegia","pepe nero","viola","erbe mediterranee"],["abbacchio scottadito","porchetta","amatriciana","salumi laziali"],["pesce delicato","crostacei"],"cesanese-piglio-coletti","rosso_estero"),
    W("LAZ003","Est! Est!! Est!!! di Montefiascone DOC Falesco","Lazio","Italia","Bianco","economico",11.0,"Trebbiano + Malvasia",12.0,"media","assenti","leggero",2.5,["mela","fiori bianchi","mandorla dolce"],["pesce di lago","antipasti misti","pasta al pomodoro leggera"],["carne rossa","formaggi molto stagionati"],"est-est-est-falesco","bianco_nord"),
    W("LAZ004","Cesanese di Affile DOC Riserva Anagni","Lazio","Italia","Rosso","standard",29.5,"Cesanese",14.0,"alta","strutturati","pieno",1.0,["mora","spezie scure","cacao","tabacco"],["abbacchio al forno","cinghiale in umido","formaggi stagionati laziali"],["pesce crudo","piatti delicati"],"cesanese-affile-riserva","rosso_estero"),
    W("LAZ005","Passerina del Frusinate IGT Casale della Ioria","Lazio","Italia","Bianco","economico",11.5,"Passerina",12.0,"media","assenti","leggero",3.0,["pera","fiori bianchi","erbe fresche"],["antipasti di mare","formaggi freschi","insalate estive"],["carne rossa","selvaggina"],"passerina-casale-ioria","bianco_nord"),
    # ══════════════════════════════════
    # NUOVI — MARCHE
    # ══════════════════════════════════
    W("MAR001","Verdicchio dei Castelli di Jesi Classico Riserva DOCG Bucci","Marche","Italia","Bianco","standard",26.5,"Verdicchio",13.0,"alta","assenti","medio-pieno",1.8,["mandorla","erbe alpine","agrumi","mineralità salina"],["brodetto di pesce","frittura di paranza","risotto ai frutti di mare","olive ascolane"],["carne rossa","formaggi molto stagionati"],"verdicchio-bucci-riserva","bianco_nord"),
    W("MAR002","Conero Riserva DOCG Umani Ronchi","Marche","Italia","Rosso","standard",21.5,"Montepulciano",14.0,"alta","strutturati","pieno",0.8,["ciliegia matura","liquirizia","spezie scure","viola"],["vincisgrassi","porchetta marchigiana","brasato","formaggi stagionati"],["pesce crudo","crostacei"],"conero-umani-ronchi","rosso_estero"),
    W("MAR003","Rosso Piceno Superiore DOC Velenosi","Marche","Italia","Rosso","economico",12.5,"Sangiovese + Montepulciano",13.0,"media","medi","medio",1.2,["ciliegia","prugna","erbe mediterranee"],["olive all'ascolana","salumi","pasta al ragù","pizza"],["pesce delicato","ostriche"],"rosso-piceno-velenosi","rosso_estero"),
    W("MAR004","Lacrima di Morro d'Alba DOC Stefano Mancinelli","Marche","Italia","Rosso","standard",16.0,"Lacrima",13.0,"media","morbidi","medio",1.0,["rosa","mora","frutti di bosco","spezie dolci"],["salame di Fabriano","formaggi freschi","pasta con ragù bianco","pizza"],["pesce affumicato","piatti molto piccanti"],"lacrima-morro-mancinelli","rosato"),
    # ══════════════════════════════════
    # NUOVI — LIGURIA
    # ══════════════════════════════════
    W("LIG001","Cinque Terre DOC Bisson","Liguria","Italia","Bianco","standard",18.0,"Bosco + Albarola + Vermentino",12.5,"alta","assenti","leggero-medio",2.0,["fiori di macchia mediterranea","agrumi","erbe aromatiche","mineralità"],["acciughe al limone","pesto alla genovese","frittura di paranza","focaccia con formaggio"],["carne rossa","selvaggina"],"cinque-terre-bisson","bianco_nord"),
    W("LIG002","Vermentino di Liguria DOC Lunae Bosoni","Liguria","Italia","Bianco","standard",15.0,"Vermentino",13.0,"alta","assenti","leggero-medio",1.8,["fiori bianchi","agrumi","erbe mediterranee","mandorla"],["trofie al pesto","branzino al forno","antipasti di mare"],["carne rossa","formaggi stagionati"],"vermentino-lunae","bianco_nord"),
    W("LIG003","Rossese di Dolceacqua DOC Terre Bianche","Liguria","Italia","Rosso","standard",21.0,"Rossese",13.0,"media","fini","medio",1.0,["rosa","frutti rossi","spezie leggere","erbe di macchia"],["coniglio alla ligure","cacciucco leggero","formaggi freschi","salumi"],["pesce crudo delicato","dolci"],"rossese-dolceacqua-terrebianche","rosato"),
    # ══════════════════════════════════
    # NUOVI — VALLE D'AOSTA
    # ══════════════════════════════════
    W("VDA001","Valle d'Aosta Fumin DOC Les Crêtes","Valle d'Aosta","Italia","Rosso","standard",25.5,"Fumin",13.5,"alta","strutturati","pieno",0.9,["mora","pepe nero","spezie alpine","viola"],["carbonade valdostana","selvaggina di montagna","fonduta","formaggi di alpeggio"],["pesce","piatti delicati"],"fumin-les-cretes","rosso_estero"),
    W("VDA002","Blanc de Morgex et de La Salle DOC Ermes Pavese","Valle d'Aosta","Italia","Bianco","standard",23.0,"Prié Blanc",11.5,"altissima","assenti","leggero",2.0,["mela verde","fiori alpini","erbe di montagna","mineralità glaciale"],["fonduta leggera","trote di montagna","formaggi freschi di malga"],["carne rossa","brasati"],"blanc-morgex-pavese","bianco_nord"),
    W("VDA003","Valle d'Aosta Petit Rouge DOC Institut Agricole Régional","Valle d'Aosta","Italia","Rosso","standard",17.5,"Petit Rouge",12.5,"alta","medi","medio",1.0,["frutti di bosco","viola","erbe alpine"],["polenta concia","salumi di montagna","formaggi di alpeggio"],["pesce","dolci"],"petit-rouge-iar","rosso_estero"),
    # ══════════════════════════════════
    # NUOVI — MOLISE
    # ══════════════════════════════════
    W("MOL001","Tintilia del Molise DOC Cianfagna","Molise","Italia","Rosso","standard",18.5,"Tintilia",13.5,"alta","strutturati","medio-pieno",1.0,["mora","spezie scure","liquirizia","erbe molisane"],["agnello alla molisana","salumi","formaggi stagionati","cacciagione"],["pesce","piatti leggeri"],"tintilia-cianfagna","rosso_estero"),
    W("MOL002","Molise Falanghina DOC Di Majo Norante","Molise","Italia","Bianco","economico",12.5,"Falanghina",12.5,"alta","assenti","leggero-medio",1.5,["fiori bianchi","agrumi","mela verde"],["pesce alla griglia","antipasti di mare","formaggi freschi"],["carne rossa","selvaggina"],"falanghina-dimajo-norante","bianco_nord"),
    # ══════════════════════════════════
    # NUOVI — CALABRIA
    # ══════════════════════════════════
    W("CAL002","Cirò Rosso Classico DOC Librandi","Calabria","Italia","Rosso","economico",14.5,"Gaglioppo",13.5,"alta","medi","medio",1.0,["ciliegia","spezie","erbe mediterranee","frutti rossi maturi"],["'nduja","pasta alla calabrese","carne alla brace","formaggi stagionati"],["pesce delicato","crostacei"],"ciro-rosso-librandi","rosso_estero"),
    W("CAL003","Greco di Bianco DOC Ceratti","Calabria","Italia","Dolce","premium",30.0,"Greco Bianco",15.5,"media","assenti","pieno",100.0,["albicocca disidratata","miele","fichi secchi","agrumi canditi"],["formaggi erborinati","dolci alle mandorle","crostate di frutta secca"],["piatti salati","carne rossa"],"greco-bianco-ceratti","dolce"),
    W("CAL004","Terre di Cosenza Magliocco DOC Serracavallo","Calabria","Italia","Rosso","standard",17.0,"Magliocco",14.0,"alta","strutturati","pieno",0.8,["mora","liquirizia","tabacco","spezie scure"],["capra alla calabrese","salsiccia piccante","cacciagione","formaggi stagionati"],["pesce","piatti leggeri"],"magliocco-serracavallo","rosso_estero"),
    W("CAL005","Cirò Bianco DOC Sergio Arcuri","Calabria","Italia","Bianco","standard",15.5,"Greco Bianco",13.0,"alta","assenti","medio",1.5,["agrumi","fiori bianchi","erbe mediterranee","mineralità"],["pesce spada alla ghiotta","antipasti di mare","frittura"],["carne rossa","selvaggina"],"ciro-bianco-arcuri","bianco_sud"),
    # ══════════════════════════════════
    # NUOVI — BASILICATA
    # ══════════════════════════════════
    W("BAS002","Aglianico del Vulture Superiore DOCG Elena Fucci Titolo","Basilicata","Italia","Rosso","premium",56.0,"Aglianico",14.0,"alta","potenti","pieno",0.6,["mora","grafite","spezie scure","viola appassita"],["cinghiale","agnello al forno","formaggi stagionati","salumi lucani"],["pesce","piatti delicati"],"aglianico-vulture-fucci-titolo","rosso_estero"),
    W("BAS003","Aglianico del Vulture DOC Paternoster Don Anselmo","Basilicata","Italia","Rosso","premium",33.0,"Aglianico",13.5,"alta","strutturati","pieno",0.7,["prugna","cuoio","spezie scure","tabacco"],["brasato di agnello","salumi lucani","formaggi pecorino stagionato"],["pesce crudo","dolci"],"aglianico-vulture-paternoster","rosso_estero"),
    W("BAS004","Matera Greco DOC Cantine del Notaio","Basilicata","Italia","Bianco","standard",17.5,"Greco",13.0,"alta","assenti","medio",1.6,["agrumi","fiori bianchi","erbe di collina"],["pane di Matera con salumi","pesce alla griglia","formaggi freschi"],["carne rossa","selvaggina"],"matera-greco-notaio","bianco_sud"),
    # ══════════════════════════════════
    # NUOVI — ABRUZZO
    # ══════════════════════════════════
    W("ABR004","Montepulciano d'Abruzzo Colline Teramane DOCG Illuminati","Abruzzo","Italia","Rosso","premium",31.0,"Montepulciano",14.0,"alta","strutturati","pieno",0.8,["prugna","liquirizia","spezie scure","tabacco"],["arrosticini","agnello al forno","cacciagione","formaggi stagionati"],["pesce","piatti leggeri"],"montepulciano-teramane-illuminati","rosso_estero"),
    W("ABR005","Trebbiano d'Abruzzo DOC Valentini","Abruzzo","Italia","Bianco","premium",42.0,"Trebbiano d'Abruzzo",13.0,"alta","assenti","medio-pieno",1.5,["miele","erbe di campo","frutta a polpa gialla","mineralità"],["brodetto abruzzese","pesce al forno","formaggi freschi"],["carne rossa pesante","selvaggina"],"trebbiano-abruzzo-valentini","bianco_sud"),
    W("ABR006","Cerasuolo d'Abruzzo DOC Emidio Pepe","Abruzzo","Italia","Rosato","premium",34.5,"Montepulciano",13.0,"alta","leggeri","medio",1.0,["ciliegia","fragola","erbe aromatiche","petali di rosa"],["arrosticini","pasta alla chitarra","salumi abruzzesi","pesce alla griglia"],["carne rossa pesante","selvaggina intensa"],"cerasuolo-emidio-pepe","rosato"),
    # ══════════════════════════════════
    # NUOVI — UMBRIA
    # ══════════════════════════════════
    W("UMB003","Sagrantino di Montefalco DOCG Arnaldo Caprai 25 Anni","Umbria","Italia","Rosso","premium",63.5,"Sagrantino",15.0,"alta","titanici","pieno",0.5,["mora","cacao","spezie scure","liquirizia","tabacco"],["cinghiale in umido","brasato al Sagrantino","formaggi molto stagionati","cacciagione"],["pesce","piatti delicati"],"sagrantino-caprai-25anni","rosso_umbria"),
    W("UMB004","Orvieto Classico Superiore DOC Barberani","Umbria","Italia","Bianco","standard",17.0,"Grechetto + Procanico",12.5,"alta","assenti","leggero-medio",1.8,["fiori bianchi","mandorla","agrumi","mineralità vulcanica"],["pasta alla norcina leggera","pesce di lago","antipasti umbri"],["carne rossa","selvaggina"],"orvieto-barberani","bianco_nord"),
    W("UMB005","Rosso di Montefalco DOC Tabarrini","Umbria","Italia","Rosso","standard",22.0,"Sangiovese + Sagrantino",13.5,"alta","medi","medio-pieno",1.0,["ciliegia","spezie","viola","erbe umbre"],["norcineria umbra","pasta al tartufo nero","formaggi stagionati"],["pesce crudo","crostacei"],"rosso-montefalco-tabarrini","rosso_umbria"),
    # ══════════════════════════════════
    # NUOVI — PUGLIA
    # ══════════════════════════════════
    W("PUG004","Primitivo di Manduria DOC Felline","Puglia","Italia","Rosso","standard",17.5,"Primitivo",15.0,"media","potenti","pieno",2.0,["mora matura","confettura di prugne","spezie dolci","liquirizia"],["carne alla brace","bombette pugliesi","formaggi stagionati","cacciagione"],["pesce delicato","crostacei"],"primitivo-manduria-felline","rosso_estero"),
    W("PUG005","Negroamaro Salento IGT Rosa del Golfo","Puglia","Italia","Rosato","economico",14.0,"Negroamaro",12.5,"alta","leggeri","medio",1.5,["fragola","melograno","fiori rosa","agrumi"],["orecchiette con le cime di rapa","frutti di mare","frittura","pizza"],["carne rossa pesante","selvaggina"],"negroamaro-rosa-golfo","rosato"),
    W("PUG006","Castel del Monte Nero di Troia Riserva DOCG Rivera","Puglia","Italia","Rosso","standard",27.0,"Nero di Troia",14.0,"alta","strutturati","pieno",0.8,["mora","spezie scure","cuoio","tabacco"],["agnello alla pugliese","carne alla brace","formaggi stagionati","cacciagione"],["pesce","piatti delicati"],"nero-troia-rivera","rosso_estero"),
    W("PUG007","Locorotondo DOC Cantina Locorotondo","Puglia","Italia","Bianco","economico",10.5,"Verdeca + Bianco d'Alessano",12.0,"media","assenti","leggero",1.5,["fiori bianchi","mandorla","agrumi"],["frutti di mare crudi","pesce alla griglia","burrata"],["carne rossa","selvaggina"],"locorotondo-cantina","bianco_sud"),
    # ══════════════════════════════════
    # NUOVI — FRIULI-VENEZIA GIULIA
    # ══════════════════════════════════
    W("FRI005","Collio Sauvignon DOC Venica & Venica","Friuli-Venezia Giulia","Italia","Bianco","standard",24.5,"Sauvignon Blanc",13.0,"alta","assenti","medio",1.5,["foglia di pomodoro","frutto della passione","salvia","agrumi"],["risotto agli asparagi","tartare di pesce","insalate estive"],["carne rossa","brasati"],"collio-sauvignon-venica","bianco_nord"),
    W("FRI006","Friuli Colli Orientali Ribolla Gialla DOC Livio Felluga","Friuli-Venezia Giulia","Italia","Bianco","standard",21.0,"Ribolla Gialla",12.5,"alta","assenti","leggero-medio",1.6,["mela verde","fiori bianchi","erbe alpine","mineralità"],["prosciutto di San Daniele","frittura di pesce","formaggi freschi friulani"],["carne rossa","selvaggina"],"ribolla-gialla-felluga","bianco_nord"),
    W("FRI007","Carso Terrano DOC Kante","Friuli-Venezia Giulia","Italia","Rosso","standard",21.5,"Terrano",12.5,"altissima","medi","medio",1.0,["frutti di bosco","erbe di macchia","mineralità ferrosa"],["jota triestina","salumi affumicati","gulasch"],["pesce crudo","piatti dolci"],"carso-terrano-kante","rosso_estero"),
    # ══════════════════════════════════
    # NUOVI — SARDEGNA
    # ══════════════════════════════════
    W("SAR005","Cannonau di Sardegna Riserva DOC Sella & Mosca","Sardegna","Italia","Rosso","standard",18.0,"Cannonau",14.5,"media","strutturati","pieno",1.0,["ciliegia sotto spirito","spezie","erbe mediterranee","frutti rossi maturi"],["porceddu","salsicce sarde","formaggi stagionati sardi","carne alla brace"],["pesce delicato","crostacei"],"cannonau-riserva-sellamosca","rosso_sardegna"),
    W("SAR006","Vermentino di Gallura Superiore DOCG Capichera","Sardegna","Italia","Bianco","standard",26.0,"Vermentino",13.5,"alta","assenti","medio",1.8,["agrumi","macchia mediterranea","fiori bianchi","mineralità salina"],["aragosta","fregola ai frutti di mare","pesce alla griglia"],["carne rossa","selvaggina"],"vermentino-gallura-capichera","bianco_sud"),
    W("SAR007","Carignano del Sulcis DOC Santadi Rocca Rubia","Sardegna","Italia","Rosso","standard",17.5,"Carignano",13.5,"alta","medi","medio-pieno",1.0,["mora","macchia mediterranea","spezie","liquirizia"],["agnello al mirto","salumi sardi","formaggi stagionati"],["pesce crudo","piatti dolci"],"carignano-sulcis-santadi","rosso_sardegna"),
    # ══════════════════════════════════
    # NUOVI — SICILIA
    # ══════════════════════════════════
    W("SIC009","Etna Rosso DOC Tenuta delle Terre Nere","Sicilia","Italia","Rosso","premium",34.0,"Nerello Mascalese",13.5,"alta","fini","medio-pieno",0.8,["ciliegia","viola","erbe vulcaniche","spezie fini"],["pasta alla Norma","carne alla brace","formaggi stagionati siciliani"],["pesce crudo","dolci"],"etna-rosso-terre-nere","rosso_sicilia"),
    W("SIC010","Etna Bianco DOC Benanti","Sicilia","Italia","Bianco","standard",23.0,"Carricante",12.5,"altissima","assenti","medio",1.6,["agrumi","fiori bianchi","mineralità vulcanica","erbe"],["pesce spada","couscous di pesce","frutti di mare"],["carne rossa","selvaggina"],"etna-bianco-benanti","bianco_sud"),
    W("SIC011","Nero d'Avola Sicilia DOC Planeta","Sicilia","Italia","Rosso","standard",16.0,"Nero d'Avola",14.0,"media","medi","pieno",1.0,["mora","prugna","spezie dolci","macchia mediterranea"],["pasta alla Norma","involtini di carne","caponata","formaggi stagionati"],["pesce delicato","crostacei"],"nero-avola-planeta","rosso_sicilia"),
    W("SIC012","Marsala Vergine Riserva DOC Florio","Sicilia","Italia","Dolce","premium",36.5,"Grillo",18.0,"media","assenti","pieno",30.0,["frutta secca","noce","caramello","spezie orientali"],["formaggi erborinati stagionati","dolci alle mandorle","cioccolato fondente"],["piatti salati leggeri"],"marsala-vergine-florio","dolce"),
    # ══════════════════════════════════
    # NUOVI — CAMPANIA
    # ══════════════════════════════════
    W("CAM006","Taurasi DOCG Riserva Mastroberardino","Campania","Italia","Rosso","premium",56.5,"Aglianico",14.0,"alta","potenti","pieno",0.6,["mora","grafite","cuoio","spezie scure","tabacco"],["cinghiale","brasato","formaggi molto stagionati","cacciagione"],["pesce","piatti delicati"],"taurasi-riserva-mastroberardino","rosso_campania"),
    W("CAM007","Fiano di Avellino DOCG Mastroberardino","Campania","Italia","Bianco","standard",23.0,"Fiano",13.0,"alta","assenti","medio",1.7,["nocciola tostata","miele","fiori bianchi","frutta a polpa gialla"],["impepata di cozze","risotto ai frutti di mare","formaggi freschi campani"],["carne rossa pesante","selvaggina"],"fiano-avellino-mastroberardino","bianco_sud"),
    W("CAM008","Greco di Tufo DOCG Feudi di San Gregorio","Campania","Italia","Bianco","standard",19.0,"Greco",13.0,"altissima","assenti","medio",1.5,["agrumi","pesca","mineralità sulfurea","fiori bianchi"],["frittura di paranza","spaghetti alle vongole","impepata di cozze"],["carne rossa","selvaggina"],"greco-tufo-feudi","bianco_sud"),
    # ══════════════════════════════════
    # NUOVI — TRENTINO-ALTO ADIGE
    # ══════════════════════════════════
    W("TAA007","Alto Adige Gewürztraminer DOC Cantina Tramin","Trentino-Alto Adige","Italia","Bianco","standard",21.0,"Gewürztraminer",14.0,"media","assenti","pieno",2.5,["rosa","litchi","spezie orientali","frutta esotica"],["speck e canederli","formaggi di malga stagionati","cucina orientale speziata"],["pesce delicato","crostacei crudi"],"gewurztraminer-tramin","bianco_nord"),
    W("TAA008","Teroldego Rotaliano DOC Foradori","Trentino-Alto Adige","Italia","Rosso","standard",22.0,"Teroldego",13.5,"alta","strutturati","pieno",1.0,["mora","viola","spezie alpine","erbe di montagna"],["canederli allo speck","carne alla griglia","formaggi di malga"],["pesce","piatti delicati"],"teroldego-foradori","rosso_estero"),
    # ══════════════════════════════════
    # NUOVI — GEORGIA
    # ══════════════════════════════════
    W("GEO001","Saperavi Qvevri Pheasant's Tears","Georgia","Europa","Rosso","standard",24.5,"Saperavi",13.0,"alta","strutturati","pieno",1.0,["frutti di bosco","terra","spezie","tè nero"],["khinkali","carne alla griglia","formaggi stagionati","melanzane speziate"],["pesce delicato","dolci"],"saperavi-pheasants-tears","rosso_estero"),
    W("GEO002","Rkatsiteli Qvevri Orange Wine Iago's Wine","Georgia","Europa","Bianco","premium",30.5,"Rkatsiteli",12.5,"alta","medi","pieno",1.0,["albicocca secca","tè","noci","miele scuro"],["khachapuri","piatti speziati georgiani","formaggi stagionati"],["dolci molto zuccherini"],"rkatsiteli-orange-iago","bianco_estero"),
    W("GEO003","Kindzmarauli Semi-Dolce Telavi","Georgia","Europa","Dolce","standard",19.5,"Saperavi",11.5,"media","medi","medio",30.0,["frutti rossi","prugna","spezie dolci"],["dolci alle noci","formaggi erborinati","cioccolato fondente"],["piatti salati intensi"],"kindzmarauli-telavi","dolce"),
    # ══════════════════════════════════
    # NUOVI — UNGHERIA
    # ══════════════════════════════════
    W("HUN001","Tokaji Aszú 5 Puttonyos Disznókő","Ungheria","Europa","Dolce","premium",62.0,"Furmint + Hárslevelű",10.5,"altissima","assenti","pieno",150.0,["albicocca disidratata","miele","zafferano","agrumi canditi"],["foie gras","formaggi erborinati","dolci alla frutta secca"],["piatti salati","carne rossa"],"tokaji-aszu-disznoko","dolce"),
    W("HUN002","Egri Bikavér DHC Gróf Buttler","Ungheria","Europa","Rosso","standard",20.0,"Kékfrankos + Kadarka",13.5,"alta","strutturati","pieno",0.8,["mora","spezie","tabacco","frutti rossi maturi"],["gulasch","carne alla brace","formaggi stagionati"],["pesce","piatti delicati"],"egri-bikaver-buttler","rosso_estero"),
    W("HUN003","Furmint Secco Tokaj Disznókő","Ungheria","Europa","Bianco","standard",18.0,"Furmint",12.5,"altissima","assenti","medio",2.0,["mela verde","agrumi","mineralità vulcanica"],["pesce di fiume","formaggi freschi","antipasti leggeri"],["carne rossa pesante","selvaggina"],"furmint-secco-disznoko","bianco_estero"),
    # ══════════════════════════════════
    # NUOVI — NEW YORK
    # ══════════════════════════════════
    W("USA007","Finger Lakes Riesling Dry Hermann J. Wiemer","New York","Americhe","Bianco","standard",28.0,"Riesling",12.0,"altissima","assenti","leggero-medio",1.8,["lime","pesca bianca","mineralità di ardesia","fiori bianchi"],["sushi","pesce al vapore","cucina asiatica speziata"],["carne rossa pesante","brasati"],"finger-lakes-riesling-wiemer","bianco_estero"),
    # ══════════════════════════════════
    # NUOVI — WASHINGTON
    # ══════════════════════════════════
    W("USA008","Walla Walla Cabernet Sauvignon Leonetti Cellar","Washington","Americhe","Rosso","lusso",89.7,"Cabernet Sauvignon",14.5,"media","potenti","pieno",0.6,["cassis","cedro","spezie dolci","cioccolato"],["bistecca alla griglia","costata","formaggi stagionati"],["pesce","piatti leggeri"],"walla-walla-leonetti","rosso_estero"),
    W("USA009","Columbia Valley Syrah Charles Smith K Vintners","Washington","Americhe","Rosso","premium",36.0,"Syrah",14.0,"media","strutturati","pieno",0.7,["mora","pepe nero","olive","affumicato"],["costine BBQ","agnello speziato","formaggi stagionati"],["pesce delicato","dolci"],"columbia-syrah-ksmith","rosso_estero"),
    # ══════════════════════════════════
    # NUOVI — SUD AFRICA
    # ══════════════════════════════════
    W("SAF001","Chenin Blanc Swartland Mullineux Old Vines","Sud Africa","Africa","Bianco","standard",27.5,"Chenin Blanc",13.5,"alta","assenti","medio-pieno",1.5,["mela cotogna","miele","agrumi","mineralità"],["pesce alla griglia","curry leggero","formaggi freschi"],["carne rossa pesante","selvaggina"],"chenin-swartland-mullineux","bianco_estero"),
    W("SAF002","Stellenbosch Pinotage Kanonkop","Sud Africa","Africa","Rosso","premium",31.5,"Pinotage",14.5,"media","strutturati","pieno",0.7,["mora","affumicato","spezie dolci","cioccolato"],["biltong","carne alla griglia (braai)","formaggi stagionati"],["pesce delicato","crostacei"],"pinotage-kanonkop","rosso_estero"),
    W("SAF003","Constantia Sauvignon Blanc Klein Constantia","Sud Africa","Africa","Bianco","standard",20.5,"Sauvignon Blanc",13.0,"alta","assenti","leggero-medio",1.5,["frutto della passione","erbe fresche","agrumi"],["insalate estive","pesce crudo","formaggi di capra"],["carne rossa","brasati"],"sauvignon-constantia-klein","bianco_estero"),
    W("SAF004","Vin de Constance Klein Constantia","Sud Africa","Africa","Dolce","lusso",88,"Moscato di Alessandria",10.0,"alta","assenti","pieno",130.0,["albicocca","miele d'arancio","fichi","zafferano"],["foie gras","formaggi erborinati","dolci alla frutta"],["piatti salati intensi"],"vin-de-constance-klein","dolce"),
    # ══════════════════════════════════
    # NUOVI — NUOVA ZELANDA
    # ══════════════════════════════════
    W("NZ003","Central Otago Pinot Noir Felton Road","Nuova Zelanda","Oceania","Rosso","premium",38.0,"Pinot Nero",13.5,"alta","fini","medio",0.8,["ciliegia","lampone","sottobosco","spezie fini"],["salmone alla griglia","anatra","formaggi a pasta molle"],["carne rossa pesante","piatti molto piccanti"],"central-otago-felton-road","rosso_estero"),
    W("NZ004","Hawke's Bay Syrah Trinity Hill Homage","Nuova Zelanda","Oceania","Rosso","premium",50.0,"Syrah",13.5,"media","strutturati","pieno",0.7,["mora","pepe bianco","viola","spezie fini"],["agnello arrosto","carne alla griglia","formaggi stagionati"],["pesce delicato","dolci"],"hawkes-bay-syrah-trinity","rosso_estero"),
    # ══════════════════════════════════
    # NUOVI — ARGENTINA
    # ══════════════════════════════════
    W("ARG005","Uco Valley Malbec Catena Zapata Nicolás Catena Zapata","Argentina","Sud America","Rosso","lusso",79.9,"Malbec",14.5,"media","potenti","pieno",0.5,["prugna","viola","cioccolato","spezie dolci"],["asado argentino","bistecca alla griglia","formaggi stagionati"],["pesce","piatti leggeri"],"uco-valley-malbec-catena","rosso_estero"),
    W("ARG006","Torrontés Cafayate Michel Torino Don David","Argentina","Sud America","Bianco","economico",12.5,"Torrontés",13.0,"media","assenti","leggero-medio",1.5,["fiori bianchi","litchi","agrumi","uva moscata"],["empanadas","ceviche","cucina piccante"],["carne rossa pesante","selvaggina"],"torrontes-cafayate-dondavid","bianco_estero"),
    # ══════════════════════════════════
    # NUOVI — CILE
    # ══════════════════════════════════
    W("CHL005","Colchagua Valley Carmenère Montes Purple Angel","Cile","Sud America","Rosso","premium",34.0,"Carmenère",14.5,"media","strutturati","pieno",0.7,["prugna","peperone verde","spezie dolci","cioccolato"],["carne alla griglia","empanadas di carne","formaggi stagionati"],["pesce delicato","crostacei"],"carmenere-montes-purple-angel","rosso_estero"),
    W("CHL006","Casablanca Valley Chardonnay Kingston Family","Cile","Sud America","Bianco","standard",19.5,"Chardonnay",13.0,"alta","assenti","medio",1.5,["frutta a polpa gialla","burro","vaniglia leggera","agrumi"],["salmone al forno","pollo in salsa cremosa","formaggi a pasta molle"],["piatti molto piccanti"],"casablanca-chardonnay-kingston","bianco_estero"),
    # ══════════════════════════════════
    # NUOVI — ROSATI (Italia + Francia + Nuovo Mondo)
    # ══════════════════════════════════
    
    W("ROS003","Côtes de Provence AOP Domaines Ott Château de Selle","Provenza","Europa","Rosato","premium",42.0,"Grenache + Cinsault + Syrah",13.0,"media","assenti","medio",2.0,["pesca bianca","agrumi","erbe di Provenza","minerale"],["bouillabaisse","pesce alla griglia","ratatouille","formaggi di capra freschi"],["carne rossa","selvaggina"],"ott-chateau-selle","rosato"),
    W("ROS004","Tavel AOP Château d'Aquéria","Rodano","Europa","Rosato","standard",24.5,"Grenache + Cinsault + Clairette",13.5,"media","leggeri","medio-pieno",2.5,["fragola matura","spezie provenzali","melograno","erbe mediterranee"],["bouillabaisse","tagine di agnello","salumi","formaggi di capra"],["dolci molto dolci"],"tavel-aqueria","rosato"),
    W("ROS005","Negroamaro Rosato Salento IGT Leone de Castris Five Roses","Puglia","Italia","Rosato","economico",10.0,"Negroamaro",12.5,"media","leggeri","medio",2.0,["ciliegia","melograno","fiori rossi","erbe mediterranee"],["orecchiette alle cime di rapa","antipasti pugliesi","frutti di mare","formaggi freschi"],["carne rossa pesante","selvaggina"],"five-roses-leone-castris","rosato"),
    W("ROS006","Etna Rosato DOC Tenuta di Fessina","Sicilia","Italia","Rosato","standard",26.0,"Nerello Mascalese",13.0,"alta","leggeri","medio",1.8,["lampone","agrumi","cenere vulcanica","erbe siciliane"],["pesce spada","caponata","pasta con le sarde","formaggi freschi"],["carne rossa pesante","selvaggina"],"etna-rosato-fessina","rosato"),
    W("ROS007","Bardolino Chiaretto DOC Le Fraghe","Veneto","Italia","Rosato","economico",12.5,"Corvina + Rondinella",12.0,"media","leggeri","leggero",2.2,["fragolina di bosco","agrumi","fiori di pesco"],["pizza","salumi","risotto agli asparagi","pesce di lago"],["carne rossa pesante","selvaggina"],"bardolino-chiaretto-fraghe","rosato"),
    W("ROS008","Cirò Rosato DOC 'A Vita","Calabria","Italia","Rosato","standard",17.0,"Gaglioppo",13.0,"alta","leggeri","medio",2.0,["ciliegia","macchia mediterranea","pepe rosa","agrumi"],["pesce alla calabrese","'nduja leggera","antipasti di mare","formaggi freschi"],["dolci molto dolci"],"ciro-rosato-avita","rosato"),
    W("ROS009","Lacrima di Morro d'Alba Rosato IGT Marotti Campi","Marche","Italia","Rosato","economico",12.0,"Lacrima",12.5,"media","leggeri","leggero-medio",2.0,["rosa","fragola","spezie dolci","frutti rossi freschi"],["salumi marchigiani","olive ascolane","pesce fritto","formaggi freschi"],["carne rossa pesante"],"lacrima-rosato-marotti","rosato"),
    W("ROS010","Rosé d'Anjou AOP Château de la Roulerie","Loira","Europa","Rosato","economico",11.0,"Grolleau + Gamay + Cabernet Franc",11.0,"media","assenti","leggero",18.0,["fragola","lampone","caramella","fiori rossi"],["aperitivo","formaggi freschi di capra","frutta estiva","dolci leggeri"],["piatti molto salati","carne rossa"],"rose-anjou-roulerie","rosato"),
    W("ROS011","Rosé Central Otago Rippon","Nuova Zelanda","Oceania","Rosato","standard",28.0,"Pinot Nero",13.0,"alta","leggeri","medio",1.5,["lampone","ciliegia","fiori alpini","erbe fresche"],["salmone alla griglia","tartare di tonno","formaggi freschi","insalate di primavera"],["carne rossa pesante"],"rippon-rose-central-otago","rosato"),
    W("ROS012","Rosé Sonoma Coast La Crema","California","Americhe","Rosato","standard",18.5,"Pinot Nero",13.0,"media","leggeri","medio",1.8,["fragola","melone","agrumi","fiori bianchi"],["insalate California","pesce alla griglia","sushi","formaggi freschi"],["carne rossa pesante"],"la-crema-rose-sonoma","rosato"),
    # ══════════════════════════════════
    # NUOVI — SPUMANTI (Metodo Classico, Champenoise, Crémant, Cap Classique)
    # ══════════════════════════════════
    W("CHAM001","Champagne Brut AOC Bollinger Special Cuvée","Champagne","Europa","Spumante","lusso",74.8,"Pinot Nero + Chardonnay + Pinot Meunier",12.0,"alta","assenti","pieno",8.0,["crosta di pane","nocciola tostata","mela cotogna","agrumi","brioche"],["ostriche","aragosta","formaggi a pasta dura","tartare di tonno","frittura di pesce"],["dolci molto dolci","carne rossa pesante"],"bollinger-special-cuvee","spumante"),
    W("CHAM002","Champagne Blanc de Blancs AOC Ruinart","Champagne","Europa","Spumante","lusso",96,"Chardonnay",12.5,"alta","assenti","medio-pieno",7.0,["agrumi canditi","gesso","fiori bianchi","lievito fine"],["ostriche Fine de Claire","caviale","capesante crude","sushi premium"],["dolci molto dolci","carne rossa"],"ruinart-blanc-de-blancs","spumante"),
    W("CHAM003","Champagne Rosé AOC Laurent-Perrier Cuvée Rosé","Champagne","Europa","Spumante","lusso",88.5,"Pinot Nero",12.0,"alta","leggeri","medio",8.0,["fragola","lampone","melograno","brioche leggera"],["salmone affumicato","fragole al naturale","macaron alla frutta rossa","tartare di tonno"],["formaggi molto stagionati"],"laurent-perrier-rose","spumante"),
    W("CREM001","Crémant d'Alsace AOC Domaine Lucas et André Rieffel","Alsazia","Europa","Spumante","standard",18.5,"Pinot Bianco + Pinot Grigio + Riesling",12.0,"alta","assenti","medio",6.0,["mela verde","fiori bianchi","agrumi","lievito fresco"],["choucroute","formaggi alsaziani","frittura di pesce","aperitivo"],["carne rossa pesante"],"cremant-alsace-rieffel","spumante"),
    W("CRE002","Crémant de Loire AOC Langlois-Château","Loira","Europa","Spumante","economico",14.5,"Chenin Blanc + Chardonnay",12.0,"alta","assenti","leggero-medio",7.0,["mela","pera","fiori bianchi","agrumi delicati"],["aperitivo","formaggi di capra freschi","pesce di fiume","frittura leggera"],["carne rossa","selvaggina"],"cremant-loire-langlois","spumante"),
    W("MCC001","Méthode Cap Classique Graham Beck Brut","Western Cape","Africa","Spumante","standard",19.5,"Chardonnay + Pinot Nero",12.5,"alta","assenti","medio",6.0,["agrumi","mela verde","lievito","note minerali"],["ostriche","biltong leggero","pesce alla griglia","aperitivo"],["carne rossa pesante","dolci"],"graham-beck-mcc-brut","spumante"),
    W("ENG001","English Sparkling Wine Nyetimber Classic Cuvée","Sussex","Europa","Spumante","premium",48.5,"Chardonnay + Pinot Nero + Pinot Meunier",12.0,"altissima","assenti","medio-pieno",8.0,["mela verde","limone","crosta di pane","fiori bianchi"],["ostriche native","pesce affumicato","formaggi inglesi stagionati","fish and chips gourmet"],["dolci molto dolci"],"nyetimber-classic-cuvee","spumante"),
    W("LAM001","Lambrusco di Sorbara DOC Secco Cleto Chiarli","Emilia-Romagna","Italia","Spumante","economico",10.0,"Lambrusco di Sorbara",11.0,"alta","leggeri","leggero-medio",4.0,["violetta","lampone","fragola","leggero speziato"],["salumi emiliani","tortellini in brodo","gnocco fritto","parmigiano stagionato"],["pesce delicato","dolci"],"lambrusco-sorbara-chiarli","spumante"),
    W("PROS002","Prosecco Rosé DOC Bisol Millesimato","Veneto","Italia","Spumante","standard",16.5,"Glera + Pinot Nero",11.5,"media","assenti","leggero",13.0,["fragola","lampone","mela golden","fiori bianchi"],["aperitivo","frutti di bosco","salumi leggeri","frittura di pesce"],["formaggi molto stagionati"],"prosecco-rose-bisol","spumante"),
    W("TRE003","Trento DOC Altemasi Graal Riserva","Trentino-Alto Adige","Italia","Spumante","premium",36.5,"Chardonnay + Pinot Nero",12.5,"alta","assenti","pieno",4.0,["crosta di pane","nocciola","agrumi canditi","mineralità alpina"],["risotto al tartufo","crostacei","formaggi di malga stagionati","pesce di lago"],["dolci molto dolci"],"altemasi-graal-riserva","spumante"),
    W("AUS001","Sparkling Shiraz Barossa Valley Peter Lehmann","Australia","Oceania","Spumante","standard",24.0,"Syrah/Shiraz",13.5,"media","strutturati","pieno",8.0,["mora","cioccolato","spezie dolci","effervescenza vivace"],["barbecue australiano","selvaggina","formaggi erborinati","dessert al cioccolato"],["pesce crudo","crostacei"],"sparkling-shiraz-lehmann","spumante"),
    # ══════════════════════════════════
    # NUOVI — DOLCI (botritizzati, passiti, fortificati, icewine)
    # ══════════════════════════════════
    
    W("TOK001","Tokaji Aszú 5 Puttonyos Disznókő","Tokaj","Europa","Dolce","premium",63.5,"Furmint + Hárslevelű",11.5,"altissima","assenti","pieno",150.0,["albicocca secca","miele di castagno","zafferano","agrumi canditi","noce"],["foie gras","formaggi erborinati","strudel di mele","dessert alla frutta secca"],["piatti salati","carne rossa"],"tokaji-aszu-disznoko","dolce"),
    W("ICE001","Vidal Icewine Niagara Peninsula Inniskillin","Ontario","Americhe","Dolce","premium",52.5,"Vidal Blanc",10.5,"altissima","assenti","pieno",190.0,["albicocca","miele","ananas","agrumi ghiacciati"],["foie gras","formaggi erborinati","crostate di frutta tropicale","dessert alla panna"],["piatti salati","carne rossa"],"inniskillin-icewine-vidal","dolce"),
    W("BAN001","Banyuls AOC Domaine du Mas Blanc","Linguadoca-Rossiglione","Europa","Dolce","premium",30.0,"Grenache Noir",16.5,"media","morbidi","pieno",90.0,["cioccolato fondente","prugna secca","spezie","frutti di bosco maturi"],["cioccolato fondente 70%","formaggi erborinati","dessert alla frutta rossa","torta al cioccolato"],["pesce","piatti salati"],"banyuls-mas-blanc","dolce"),
    W("PX001","Pedro Ximénez Jerez DO Alvear","Andalusia","Europa","Dolce","standard",19.0,"Pedro Ximénez",16.0,"bassa","assenti","pieno",250.0,["uvetta","dattero","melassa","caffè","cioccolato"],["gelato alla vaniglia","formaggi erborinati","dessert al caffè","panettone"],["pesce","piatti salati"],"px-alvear","dolce"),
    W("MARS001","Marsala Superiore Riserva DOC Florio","Sicilia","Italia","Dolce","standard",20.5,"Grillo + Catarratto",18.0,"media","morbidi","pieno",100.0,["noce","caramello","fico secco","spezie","miele di castagno"],["cassata siciliana","formaggi erborinati","dolci alle mandorle","dessert al cioccolato"],["pesce","piatti salati"],"marsala-florio-riserva","dolce"),
    W("COL001","Colli Euganei Fior d'Arancio DOCG Vignalta","Veneto","Italia","Dolce","standard",19.5,"Moscato Giallo",6.0,"media","assenti","leggero",100.0,["fiori d'arancio","pesca","miele","agrumi canditi"],["crostate di frutta","panettone","formaggi erborinati dolci","dolci alle mandorle"],["carne rossa","piatti salati"],"fior-arancio-vignalta","dolce"),
    W("MUS001","Muscat de Beaumes-de-Venise AOC Domaine de Durban","Rodano","Europa","Dolce","standard",20.5,"Moscato Bianco",15.0,"media","assenti","medio",120.0,["albicocca","miele di fiori d'arancio","litchi","uva moscata"],["foie gras","crostate di frutta","formaggi erborinati","dessert alla frutta esotica"],["carne rossa","piatti salati"],"muscat-beaumes-durban","dolce"),
    W("ELB001","Elbling/Riesling Auslese Mosel Dr. Loosen","Mosella","Europa","Dolce","premium",37.5,"Riesling",8.0,"altissima","assenti","medio",90.0,["albicocca","miele","petrolio nobile","pesca matura"],["foie gras","formaggi erborinati","cucina asiatica speziata","dessert alla frutta"],["piatti salati pesanti"],"auslese-dr-loosen","dolce"),
    W("REC002","Recioto della Valpolicella DOCG Speri","Veneto","Italia","Dolce","premium",37.0,"Corvina + Rondinella",14.0,"media","morbidi","pieno",110.0,["ciliegia sotto spirito","cacao","prugna","spezie dolci"],["formaggi erborinati","cioccolato fondente","crostate ai frutti rossi","dessert al cacao"],["pesce","piatti salati"],"recioto-valpolicella-speri","dolce"),
    W("SFM001","Sforzato Passito Malvasia delle Cinque Terre DOC","Liguria","Italia","Dolce","premium",33.5,"Bosco + Albarola + Vermentino",15.0,"media","assenti","pieno",130.0,["albicocca secca","miele di macchia","fico","erbe mediterranee"],["formaggi erborinati liguri","dolci alle mandorle","crostate di frutta secca"],["pesce","piatti salati"],"sciacchetra-cinque-terre","dolce"),
    # ══════════════════════════════════
    # NUOVI — FRANCIA (Loira, Alsazia, Rodano, Borgogna, Beaujolais)
    # ══════════════════════════════════
    W("SAN001","Sancerre AOC Pascal Jolivet","Loira","Europa","Bianco","standard",26.5,"Sauvignon Blanc",13.0,"alta","assenti","medio",1.5,["pompelmo","selce","erba tagliata","fiori bianchi","agrumi"],["capre freschi","frutti di mare","asparagi","pesce al limone"],["carne rossa","formaggi stagionati"],"sancerre-jolivet","bianco_estero"),
    W("VOU001","Vouvray AOC Sec Domaine Huet Le Haut-Lieu","Loira","Europa","Bianco","premium",30.0,"Chenin Blanc",13.0,"alta","assenti","medio-pieno",2.0,["mela cotogna","miele leggero","fiori bianchi","cera d'api"],["rillettes","formaggi di capra","pesce di fiume","pollo alla panna"],["carne rossa pesante"],"vouvray-huet-haut-lieu","bianco_estero"),
    W("CHI004","Chinon AOC Rouge Charles Joguet Clos de la Dioterie","Loira","Europa","Rosso","premium",32.5,"Cabernet Franc",12.5,"alta","fini","medio",1.0,["peperone rosso","lampone","grafite","violetta","erbe fresche"],["rillettes di maiale","coniglio in umido","formaggi di capra semi-stagionati"],["pesce crudo","crostacei"],"chinon-joguet-dioterie","rosso_estero"),
    W("ALS001","Riesling Alsace AOC Grand Cru Trimbach Cuvée Frédéric Emile","Alsazia","Europa","Bianco","premium",38.0,"Riesling",13.0,"altissima","assenti","medio-pieno",2.5,["lime","pietra focaia","fiori bianchi","mela verde","mineralità"],["choucroute di pesce","aragosta","sushi","formaggi alsaziani giovani"],["carne rossa pesante"],"trimbach-frederic-emile","bianco_estero"),
    W("ALS002","Pinot Gris Alsace AOC Zind-Humbrecht Rotenberg","Alsazia","Europa","Bianco","premium",35.0,"Pinot Grigio",14.0,"media","assenti","pieno",8.0,["pera matura","miele","affumicato","spezie dolci","frutta secca"],["foie gras","formaggio Munster","curry di pollo","carne bianca in salsa"],["pesce crudo delicato"],"zind-humbrecht-rotenberg","bianco_estero"),
    W("CHA004","Châteauneuf-du-Pape AOC Château de Beaucastel","Rodano","Europa","Rosso","lusso",85.1,"Grenache + Syrah + Mourvèdre + altre 10 varietà",14.5,"media","strutturati","pieno",1.5,["frutti neri","garrigue","pepe nero","cuoio","spezie mediterranee"],["agnello alla provenzale","cacciagione","formaggi stagionati","stufati di carne"],["pesce","crostacei"],"beaucastel-chateauneuf","rosso_estero"),
    W("COT001","Côtes du Rhône Villages AOC Domaine de la Janasse","Rodano","Europa","Rosso","standard",17.5,"Grenache + Syrah",14.0,"media","morbidi","medio-pieno",2.0,["mora","garrigue","pepe","liquirizia"],["daube provenzale","carni alla brace","formaggi semi-stagionati","salumi"],["pesce crudo","ostriche"],"janasse-cotes-rhone","rosso_estero"),
    W("CON001","Condrieu AOC Yves Cuilleron","Rodano","Europa","Bianco","premium",53.5,"Viognier",13.5,"media","assenti","pieno",2.0,["albicocca","fiori bianchi","miele leggero","pesca","spezie dolci"],["astice alla panna","foie gras","pollo in crosta di erbe","formaggi di capra"],["carne rossa pesante"],"condrieu-cuilleron","bianco_estero"),
    W("CHA005","Chablis AOC Premier Cru Fourchaume William Fèvre","Borgogna","Europa","Bianco","premium",36.5,"Chardonnay",12.5,"altissima","assenti","medio",1.0,["selce","limone","mela verde","ostrica","mineralità gessosa"],["ostriche","pesce al burro bianco","capesante","formaggi di capra giovani"],["carne rossa","piatti dolci"],"chablis-fevre-fourchaume","bianco_estero"),
    W("MEU001","Meursault AOC Domaine Roulot","Borgogna","Europa","Bianco","lusso",108.1,"Chardonnay",13.0,"alta","assenti","pieno",1.5,["nocciola tostata","burro","miele","agrumi","vaniglia sottile"],["astice alla vaniglia","pollo in crosta","formaggi a pasta molle","pesce al burro"],["carne rossa pesante"],"meursault-roulot","bianco_estero"),
    W("BEA001","Beaujolais Villages AOC Domaine de la Madone","Beaujolais","Europa","Rosso","standard",15.0,"Gamay",12.5,"alta","leggeri","leggero-medio",2.0,["lampone","banana matura","fiori","ciliegia fresca"],["salumi","pollo al forno","formaggi freschi","pasta al pomodoro leggero"],["selvaggina pesante"],"beaujolais-madone","rosso_estero"),
    W("MOR001","Morgon AOC Côte du Py Marcel Lapierre","Beaujolais","Europa","Rosso","premium",30.0,"Gamay",13.0,"alta","medi","medio",1.5,["ciliegia nera","kirsch","grafite","spezie dolci"],["coniglio in umido","formaggi semi-stagionati","salumi","pollo alla cacciatora"],["pesce crudo delicato"],"morgon-lapierre","rosso_estero"),
    # ══════════════════════════════════
    # NUOVI — USA, CANADA (regioni non ancora coperte)
    # ══════════════════════════════════
    W("FIN001","Riesling Finger Lakes Dr. Konstantin Frank","New York","Americhe","Bianco","standard",22.0,"Riesling",12.0,"alta","assenti","leggero-medio",6.0,["lime","pesca bianca","mineralità glaciale","fiori bianchi"],["ostriche","cucina asiatica leggera","formaggi freschi","pesce al vapore"],["carne rossa pesante"],"dr-frank-riesling","bianco_estero"),
    W("WIL001","Pinot Noir Willamette Valley Domaine Drouhin","Oregon","Americhe","Rosso","premium",40.0,"Pinot Nero",13.5,"alta","fini","medio",1.0,["ciliegia","sottobosco","spezie dolci","viola","terra"],["salmone selvaggio","anatra","funghi porcini","formaggi semi-stagionati"],["carne rossa pesante","piatti molto piccanti"],"drouhin-willamette-pinot","rosso_estero"),
    W("WAS001","Cabernet Sauvignon Columbia Valley Chateau Ste. Michelle","Washington","Americhe","Rosso","standard",20.0,"Cabernet Sauvignon",14.0,"media","strutturati","pieno",2.0,["ribes nero","ciliegia","cedro","spezie dolci"],["hamburger gourmet","costata alla griglia","formaggi stagionati","pasta al ragù"],["pesce crudo","ostriche"],"ste-michelle-cabernet","rosso_estero"),
    W("NAP001","Cabernet Sauvignon Napa Valley Stag's Leap Artemis","California","Americhe","Rosso","lusso",92,"Cabernet Sauvignon",14.5,"media","vellutati","pieno",2.0,["cassis","cioccolato","cedro","spezie americane","vaniglia"],["filetto alla griglia","costolette d'agnello","formaggi stagionati duri"],["pesce","piatti leggeri"],"stags-leap-artemis","rosso_estero"),
    W("SON001","Zinfandel Sonoma Ridgecrest Ridge Vineyards","California","Americhe","Rosso","premium",34.0,"Zinfandel",15.0,"media","morbidi","pieno",3.0,["mora","pepe nero","confettura","spezie calde","liquirizia"],["barbecue americano","costine al forno","chili con carne","formaggi piccanti"],["pesce crudo","ostriche"],"ridge-zinfandel-sonoma","rosso_estero"),
    # ══════════════════════════════════
    # NUOVI — AUSTRALIA, NUOVA ZELANDA, SUDAFRICA (ampliamento)
    # ══════════════════════════════════
    W("BAR002b","Shiraz Barossa Valley Penfolds Bin 28","Australia","Oceania","Rosso","premium",37.5,"Syrah/Shiraz",14.5,"media","strutturati","pieno",2.0,["mora","cioccolato","pepe nero","eucalipto","vaniglia"],["barbecue australiano","agnello alla griglia","formaggi stagionati","selvaggina"],["pesce crudo","ostriche"],"penfolds-bin28-shiraz","rosso_estero"),
    W("HUNT001","Semillon Hunter Valley Tyrrell's Vat 1","Australia","Oceania","Bianco","premium",32.0,"Sémillon",11.0,"alta","assenti","leggero-medio",1.5,["limone","erba fresca","cera d'api con l'età","minerale"],["frutti di mare","sushi","pesce al vapore","insalate estive"],["carne rossa","formaggi molto stagionati"],"tyrrells-vat1-semillon","bianco_estero"),
    W("MARG001","Cabernet Sauvignon Margaret River Cullen Diana Madeline","Australia","Oceania","Rosso","lusso",78.2,"Cabernet Sauvignon + Merlot",14.0,"media","vellutati","pieno",1.5,["ribes nero","eucalipto","cedro","grafite","spezie fini"],["agnello arrosto","filetto di manzo","formaggi stagionati","cacciagione"],["pesce delicato"],"cullen-diana-madeline","rosso_estero"),
    W("OTAG001","Pinot Noir Central Otago Felton Road","Nuova Zelanda","Oceania","Rosso","premium",48.0,"Pinot Nero",13.5,"alta","fini","medio",1.0,["ciliegia","lampone","erbe alpine","spezie delicate","sottobosco"],["salmone selvaggio","anatra","funghi","formaggi semi-stagionati"],["carne rossa pesante","piatti piccanti"],"felton-road-pinot","rosso_estero"),
    W("MARL001","Sauvignon Blanc Marlborough Cloudy Bay","Nuova Zelanda","Oceania","Bianco","standard",24.5,"Sauvignon Blanc",13.0,"alta","assenti","medio",2.0,["frutto della passione","pompelmo","erba tagliata","peperone verde"],["capesante","insalate estive","formaggi di capra freschi","pesce al lime"],["carne rossa","formaggi molto stagionati"],"cloudy-bay-sauvignon","bianco_estero"),
    W("SWA001","Chenin Blanc Swartland Mullineux Old Vines","Sud Africa","Africa","Bianco","standard",29.5,"Chenin Blanc",13.5,"alta","assenti","pieno",2.0,["mela cotogna","miele leggero","fiori bianchi","agrumi","gesso"],["pesce al forno","pollo speziato","formaggi semi-stagionati","curry leggero"],["carne rossa pesante"],"mullineux-chenin-swartland","bianco_estero"),
    W("STE001","Pinotage Stellenbosch Kanonkop","Sud Africa","Africa","Rosso","premium",33.5,"Pinotage",14.0,"media","strutturati","pieno",2.5,["mora","affumicato","cioccolato","spezie dolci","terra rossa"],["biltong","braai sudafricano","carne alla brace","formaggi stagionati"],["pesce crudo","ostriche"],"kanonkop-pinotage","rosso_estero"),
    # ══════════════════════════════════
    # NUOVI — EUROPA DELL'EST, MEDITERRANEO ORIENTALE
    # ══════════════════════════════════
    W("CRO001","Plavac Mali Dingač DOC Bura-Mrgudić","Croazia","Europa","Rosso","premium",32.5,"Plavac Mali",15.0,"media","strutturati","pieno",1.5,["prugna","fichi","macchia mediterranea","spezie balcaniche"],["agnello alla brace","pesce grigliato","formaggi pecorino","stufati"],["pesce crudo"],"dingac-bura-mrgudic","rosso_estero"),
    W("SLO001","Rebula Brda Movia","Slovenia","Europa","Bianco","standard",27.5,"Ribolla Gialla",13.0,"alta","leggeri","medio-pieno",1.5,["agrumi","mela","erbe fresche","note ossidative leggere"],["prosciutto di Kras","formaggi freschi","pesce alla griglia","insalate"],["carne rossa pesante"],"rebula-movia","bianco_estero"),
    W("LIB001","Château Musar Rouge Bekaa Valley","Libano","Asia","Rosso","premium",38.0,"Cabernet Sauvignon + Cinsault + Carignan",13.5,"media","fini","medio-pieno",1.5,["frutti rossi maturi","spezie orientali","cuoio","erbe mediterranee"],["kebab di agnello","mezze libanesi","formaggi stagionati","melanzane speziate"],["pesce crudo delicato"],"chateau-musar-rouge","rosso_estero"),
    W("GEO004","Saperavi Kakheti Qvevri Pheasant's Tears","Georgia","Asia","Rosso","standard",21.0,"Saperavi",13.0,"alta","strutturati","pieno",1.0,["mora","prugna","spezie caucasiche","terra","tè nero"],["khinkali","churchkhela salata","carne alla griglia","formaggi georgiani stagionati"],["pesce delicato"],"pheasants-tears-saperavi","rosso_estero"),
    W("ROM001","Fetească Neagră Dealu Mare Davino","Romania","Europa","Rosso","standard",18.0,"Fetească Neagră",14.0,"media","morbidi","pieno",2.0,["mora","prugna","spezie dolci","cioccolato leggero"],["sarmale","carne alla griglia","formaggi stagionati","stufati rumeni"],["pesce crudo"],"davino-feteasca-neagra","rosso_estero"),
    W("UNG002","Furmint Secco Tokaj Királyudvar","Ungheria","Europa","Bianco","standard",21.0,"Furmint",12.5,"altissima","assenti","medio",2.0,["mela verde","agrumi","minerale vulcanico","erbe di campo"],["paprikash di pollo","pesce di fiume","formaggi freschi","insalate"],["carne rossa pesante"],"furmint-secco-kiralyudvar","bianco_estero"),
    # ══════════════════════════════════
    # NUOVI — ITALIA, REGIONI SOTTORAPPRESENTATE (Molise, Calabria, Marche, Puglia, Lazio, Liguria, Valle d'Aosta)
    # ══════════════════════════════════
    W("TIN001","Tintilia del Molise DOC Di Majo Norante","Molise","Italia","Rosso","standard",16.5,"Tintilia",13.0,"alta","medi","medio-pieno",1.5,["mora","spezie","erbe molisane","liquirizia"],["agnello al forno","salumi molisani","pasta al ragù","formaggi pecorino"],["pesce crudo","ostriche"],"tintilia-di-majo-norante","rosso_toscana"),
    W("PRI002","Primitivo di Manduria DOC Felline","Puglia","Italia","Rosso","standard",18.0,"Primitivo",15.0,"bassa","morbidi","pieno",3.5,["confettura di more","cioccolato","spezie calde","prugna secca"],["carne alla brace","formaggi stagionati pugliesi","salumi","bombette"],["pesce crudo","ostriche"],"primitivo-manduria-felline","rosso_campania"),
    W("GAGL001","Gaglioppo Cirò DOC Classico Librandi","Calabria","Italia","Rosso","economico",13.5,"Gaglioppo",13.5,"alta","medi","medio",1.5,["ciliegia","macchia mediterranea","spezie","erbe calabresi"],["pesce spada alla calabrese","'nduja","pasta al sugo piccante","formaggi pecorino"],["dolci"],"ciro-librandi","rosso_campania"),
    W("VER005","Verdicchio dei Castelli di Jesi Classico Riserva DOCG Umani Ronchi","Marche","Italia","Bianco","standard",22.5,"Verdicchio",13.5,"alta","assenti","medio-pieno",1.5,["mandorla","erbe di campo","agrumi","salinità","fiori bianchi"],["brodetto di pesce","frittura mista","pollo alle olive","formaggi freschi"],["carne rossa pesante"],"verdicchio-umani-ronchi","bianco_nord"),
    W("CES001","Cesanese del Piglio DOCG Superiore Coletti Conti","Lazio","Italia","Rosso","standard",25.0,"Cesanese",13.5,"alta","fini","medio-pieno",1.5,["ciliegia nera","spezie","viola","erbe laziali"],["abbacchio","pasta all'amatriciana","formaggi pecorino romano","carne alla brace"],["pesce crudo"],"cesanese-piglio-coletti","rosso_toscana"),
    W("PIG002","Pigato Riviera Ligure di Ponente DOC Bruna","Liguria","Italia","Bianco","standard",20.0,"Pigato",13.0,"alta","assenti","medio",2.0,["fiori di macchia","mandorla","agrumi","erbe liguri","salinità"],["pesto alla genovese","pesce al forno","frittura di paranza","focaccia col formaggio"],["carne rossa"],"pigato-bruna","bianco_nord"),
    
    W("ERB001","Erbaluce di Caluso DOCG Orsolani La Rustia","Piemonte","Italia","Bianco","standard",16.5,"Erbaluce",12.5,"alta","assenti","medio",1.8,["agrumi","fiori bianchi","mandorla","mineralità"],["antipasti piemontesi","pesce di lago","formaggi freschi","risotto alle erbe"],["carne rossa pesante"],"erbaluce-orsolani","bianco_nord"),

    # ══════════════════════════════════
    # ESPANSIONE CATALOGO — 102 nuovi vini (fino a 400 totali)
    # ══════════════════════════════════
    W("PUG010","Primitivo di Manduria DOP Felline","Puglia","Italia","Rosso","standard",18.5,"Primitivo",14.5,"media","morbidi","pieno",2.0,['mora matura', 'confettura di prugna', 'liquirizia', 'spezie dolci'],['carne alla brace', 'salumi piccanti', 'formaggi stagionati', 'pasta al forno'],['pesce crudo', 'crostacei delicati'],"primitivo-manduria-felline","rosso_puglia"),
    W("PUG011","Salice Salentino DOC Riserva Candido","Puglia","Italia","Rosso","economico",12.5,"Negroamaro",13.5,"media","medi","medio-pieno",1.0,['ciliegia scura', 'erbe mediterranee', 'spezie', 'cuoio leggero'],['orecchiette alle cime di rapa', 'carni alla griglia', 'formaggi pugliesi'],['pesce crudo', 'dolci'],"salice-salentino-candido","rosso_puglia"),
    W("PUG012","Negroamaro Salento IGT Cantele","Puglia","Italia","Rosso","economico",10.0,"Negroamaro",13.0,"media","morbidi","medio",1.0,['mora', 'prugna', 'erbe aromatiche', 'pepe nero'],['pasta al sugo di carne', 'salumi', 'grigliate miste'],['pesce crudo', 'ostriche'],"negroamaro-salento-cantele","rosso_puglia"),
    W("PUG013","Fiano Minutolo IGP Puglia","Puglia","Italia","Bianco","standard",16.0,"Fiano Minutolo",12.5,"alta","assenti","leggero-medio",1.5,['glicine', 'agrumi', 'erbe mediterranee', 'pesca bianca'],['antipasti di mare', 'burrata', 'pesce alla griglia', 'crudité'],['carne rossa', 'brasati'],"fiano-minutolo-puglia","bianco_nord"),
    W("PUG014","Locorotondo DOC Bianco","Puglia","Italia","Bianco","economico",9.5,"Verdeca + Bianco d'Alessano",12.0,"media","assenti","leggero",1.0,['mela verde', 'fiori bianchi', 'mandorla', 'agrumi'],['frutti di mare', 'frittura di paranza', 'formaggi freschi pugliesi'],['carne rossa', 'selvaggina'],"locorotondo-bianco","bianco_nord"),
    W("SIC020","Etna Rosso DOC Tenuta di Fessina","Sicilia","Italia","Rosso","premium",30.5,"Nerello Mascalese",13.5,"alta","fini","medio",1.0,['ciliegia', 'erbe vulcaniche', 'spezie', 'mineralità'],['coniglio alla stemperata', 'carni bianche', 'formaggi siciliani stagionati'],['pesce crudo', 'dolci'],"etna-rosso-fessina","rosso_sicilia"),
    W("SIC021","Etna Bianco DOC Benanti","Sicilia","Italia","Bianco","standard",26.0,"Carricante",12.5,"altissima","assenti","medio",1.5,['agrumi', 'mandorla', 'pietra focaia', 'erbe mediterranee'],['pesce spada', 'crudi di mare', 'couscous di pesce', 'formaggi freschi'],['carne rossa', 'brasati'],"etna-bianco-benanti","bianco_nord"),
    W("SIC022","Nero d'Avola DOC Feudo Montoni","Sicilia","Italia","Rosso","standard",19.5,"Nero d'Avola",14.0,"media","morbidi","pieno",1.5,['prugna', 'mora', 'liquirizia', 'macchia mediterranea'],['caponata', 'carni brasate', 'pasta alla norma', 'formaggi stagionati'],['pesce crudo', 'piatti delicati'],"nero-avola-montoni","rosso_sicilia"),
    W("SIC023","Grillo DOC Tenute Rapitalà","Sicilia","Italia","Bianco","economico",11.5,"Grillo",12.5,"media","assenti","leggero-medio",1.5,['agrumi', "fiori d'arancio", 'erbe aromatiche'],['pesce alla griglia', 'insalate di mare', 'cous cous', 'antipasti estivi'],['carne rossa', 'cioccolato'],"grillo-rapitala","bianco_nord"),
    W("SIC024","Passito di Pantelleria DOC Donnafugata Ben Ryé","Sicilia","Italia","Dolce","premium",46.0,"Zibibbo",14.5,"media","assenti","pieno",120.0,['albicocca disidratata', 'miele di zagara', 'dattero', 'fico secco'],['formaggi erborinati', 'crostate di frutta secca', 'cannoli siciliani'],['carne', 'pesce', 'piatti salati'],"passito-pantelleria-donnafugata","dolce"),
    W("SIC025","Cerasuolo di Vittoria DOCG COS","Sicilia","Italia","Rosso","standard",21.0,"Nero d'Avola + Frappato",13.0,"alta","medi","medio",1.0,['ciliegia', 'fragola', 'spezie', 'erbe mediterranee'],['involtini di pesce spada', 'carni bianche', 'primi con pomodoro'],['dolci', 'pesce crudo'],"cerasuolo-vittoria-cos","rosso_sicilia"),
    W("SAR010","Cannonau di Sardegna DOC Riserva Sella & Mosca","Sardegna","Italia","Rosso","standard",17.0,"Cannonau",14.5,"media","morbidi","pieno",1.5,['mora', 'mirto', 'spezie', 'macchia mediterranea'],['porceddu', 'carni alla brace', 'formaggi sardi stagionati'],['pesce crudo', 'dolci delicati'],"cannonau-sella-mosca","rosso_sardegna"),
    W("SAR011","Vermentino di Gallura DOCG Capichera","Sardegna","Italia","Bianco","standard",23.5,"Vermentino",13.5,"alta","assenti","medio",1.5,['agrumi', 'macchia mediterranea', 'erbe aromatiche', 'mandorla'],['aragosta', 'pesce alla griglia', 'bottarga', 'fregola ai frutti di mare'],['carne rossa', 'brasati'],"vermentino-gallura-capichera","bianco_nord"),
    W("SAR012","Carignano del Sulcis DOC Santadi","Sardegna","Italia","Rosso","standard",15.5,"Carignano",13.5,"media","morbidi","medio-pieno",1.0,['frutti di bosco', 'macchia mediterranea', 'pepe', 'erbe selvatiche'],['agnello', 'salsiccia sarda', 'formaggi pecorino'],['pesce delicato', 'crostacei'],"carignano-sulcis-santadi","rosso_sardegna"),
    W("EMI010","Lambrusco di Sorbara DOC Cleto Chiarli","Emilia-Romagna","Italia","Spumante","economico",10.0,"Lambrusco di Sorbara",11.0,"alta","leggeri","leggero",8.0,['fragolina', 'rosa', 'frutti rossi freschi'],['salumi emiliani', 'tortellini in brodo', 'gnocco fritto', 'parmigiano'],['pesce delicato', 'dolci molto zuccherini'],"lambrusco-sorbara-chiarli","spumante"),
    W("EMI011","Sangiovese di Romagna Superiore DOC","Emilia-Romagna","Italia","Rosso","economico",11.5,"Sangiovese",13.0,"alta","medi","medio",1.0,['ciliegia', 'viola', 'spezie leggere'],['piadina farcita', 'passatelli in brodo', 'carni bianche', 'salumi'],['pesce crudo', 'dolci'],"sangiovese-romagna-superiore","rosso_toscana"),
    W("EMI012","Albana di Romagna DOCG Secco","Emilia-Romagna","Italia","Bianco","standard",15.0,"Albana",13.0,"media","assenti","medio",1.0,['pesca', 'miele', 'fiori gialli'],['cappelletti in brodo', 'formaggi di fossa', 'piadina'],['carne rossa', 'selvaggina'],"albana-romagna-secco","bianco_nord"),
    W("EMI013","Colli Bolognesi Pignoletto DOC","Emilia-Romagna","Italia","Spumante","economico",10.5,"Pignoletto",11.5,"alta","assenti","leggero",4.0,['mela verde', 'fiori bianchi', 'agrumi'],['antipasti misti', 'salumi emiliani leggeri', 'frittura', 'aperitivo'],['carne rossa', 'cioccolato'],"pignoletto-colli-bolognesi","spumante"),
    W("MOL004","Tintilia del Molise DOC","Molise","Italia","Rosso","standard",17.0,"Tintilia",13.5,"alta","medi","medio-pieno",1.0,['mora', 'pepe nero', 'erbe di montagna', 'spezie'],['agnello al forno', 'carni alla brace', 'formaggi molisani'],['pesce crudo', 'dolci'],"tintilia-molise","rosso_toscana"),
    W("UMB006","Sagrantino di Montefalco DOCG Arnaldo Caprai","Umbria","Italia","Rosso","premium",31.5,"Sagrantino",14.5,"alta","potenti","pieno",1.0,['mora', 'liquirizia', 'cioccolato amaro', 'spezie intense'],['cinghiale in umido', 'brasati importanti', 'formaggi molto stagionati'],['pesce', 'piatti delicati'],"sagrantino-montefalco-caprai","rosso_toscana"),
    W("FRA020","Sancerre AOC Domaine Vacheron","Loira","Europa","Bianco","standard",28.5,"Sauvignon Blanc",13.0,"alta","assenti","leggero-medio",1.0,['ribes nero', 'pompelmo', 'pietra focaia', 'erbe fresche'],['capra fresca', 'crudi di pesce', 'asparagi', 'frutti di mare'],['carne rossa', 'piatti speziati intensi'],"sancerre-vacheron","bianco_nord"),
    W("FRA021","Pouilly-Fumé AOC Didier Dagueneau","Loira","Europa","Bianco","premium",52.5,"Sauvignon Blanc",13.0,"alta","assenti","medio",1.0,['fumo', 'selce', 'agrumi', 'erbe verdi'],['ostriche', 'capesante', 'pesce affumicato', 'formaggi di capra'],['carne rossa', 'dolci'],"pouilly-fume-dagueneau","bianco_nord"),
    W("FRA022","Châteauneuf-du-Pape AOC Château de Beaucastel","Rodano","Europa","Rosso","lusso",86.2,"Grenache + Syrah + Mourvèdre",14.5,"media","strutturati","pieno",1.0,['frutti neri', 'garrigue', 'pepe', 'spezie mediterranee'],['agnello alla provenzale', 'selvaggina', 'formaggi stagionati'],['pesce', 'piatti leggeri'],"chateauneuf-du-pape-beaucastel","rosso_veneto"),
    W("FRA023","Chablis Premier Cru AOC William Fèvre","Borgogna","Europa","Bianco","premium",37.0,"Chardonnay",12.5,"alta","assenti","medio",0.5,['agrumi', 'gesso', 'mela verde', 'mineralità marina'],['ostriche', 'capesante', 'pesce al burro bianco', 'formaggi freschi'],['carne rossa', 'piatti piccanti'],"chablis-premier-cru-fevre","bianco_nord"),
    W("FRA024","Gevrey-Chambertin AOC Domaine Rossignol-Trapet","Borgogna","Europa","Rosso","lusso",108.7,"Pinot Nero",13.0,"alta","fini","medio-pieno",0.5,['ciliegia', 'sottobosco', 'spezie fini', 'terra'],["anatra all'arancia", 'funghi porcini', 'formaggi di media stagionatura'],['pesce grasso', 'piatti piccanti'],"gevrey-chambertin-trapet","rosso_veneto"),
    W("FRA025","Crozes-Hermitage AOC Paul Jaboulet","Rodano","Europa","Rosso","standard",21.5,"Syrah",13.5,"media","strutturati","medio-pieno",1.0,['frutti neri', 'pepe nero', 'viola', 'olive nere'],['carni alla brace', 'selvaggina', 'formaggi di capra stagionati'],['pesce crudo', 'dolci'],"crozes-hermitage-jaboulet","rosso_veneto"),
    W("FRA026","Sauternes AOC Château Rieussec","Bordeaux","Europa","Dolce","premium",62.5,"Sémillon + Sauvignon Blanc",13.5,"alta","assenti","pieno",130.0,['albicocca', 'miele', 'zafferano', 'frutta candita'],['foie gras', 'formaggi erborinati', 'dessert alla frutta gialla'],['carne rossa', 'piatti salati intensi'],"sauternes-rieussec","dolce"),
    W("FRA027","Pomerol AOC Château La Conseillante","Bordeaux","Europa","Rosso","lusso",154.1,"Merlot + Cabernet Franc",14.0,"media","vellutati","pieno",0.6,['prugna', 'cioccolato', 'tartufo', 'spezie dolci'],['filetto al tartufo', 'agnello', 'formaggi stagionati morbidi'],['pesce', 'piatti leggeri'],"pomerol-la-conseillante","rosso_veneto"),
    W("FRA028","Muscadet Sèvre et Maine AOC sur Lie","Loira","Europa","Bianco","economico",12.0,"Melon de Bourgogne",12.0,"alta","assenti","leggero",0.5,['agrumi', 'salinità', 'mela verde'],['ostriche', 'frutti di mare crudi', 'pesce al vapore'],['carne rossa', 'cioccolato'],"muscadet-sur-lie","bianco_nord"),
    W("SPA015","Rioja Reserva DOCa Marqués de Murrieta","Rioja","Europa","Rosso","standard",29.5,"Tempranillo",14.0,"media","strutturati","pieno",1.0,['ciliegia', 'vaniglia', 'cuoio', 'spezie dolci'],['cordero asado', 'carni alla brace', 'formaggi stagionati spagnoli'],['pesce crudo', 'dolci'],"rioja-reserva-murrieta","rosso_veneto"),
    W("SPA016","Ribera del Duero DO Vega Sicilia Valbuena","Ribera del Duero","Europa","Rosso","lusso",181.7,"Tempranillo",14.5,"alta","potenti","pieno",0.8,['frutti neri', 'cioccolato', 'spezie', 'tabacco'],['cochinillo', 'carni rosse importanti', 'formaggi molto stagionati'],['pesce', 'piatti leggeri'],"ribera-duero-vega-sicilia","rosso_veneto"),
    W("SPA017","Albariño DO Rías Baixas Pazo Señorans","Galizia","Europa","Bianco","standard",20.5,"Albariño",12.5,"alta","assenti","leggero-medio",1.0,['pesca', 'agrumi', 'salinità atlantica'],['frutti di mare', 'pesce alla griglia', 'tapas di mare'],['carne rossa', 'brasati'],"albarino-pazo-senorans","bianco_nord"),
    W("SPA018","Priorat DOQ Álvaro Palacios Finca Dofí","Priorat","Europa","Rosso","lusso",123,"Garnacha + Cariñena",14.5,"media","potenti","pieno",0.7,['mora', 'liquirizia', 'minerale ardesia', 'spezie scure'],['carni brasate', 'selvaggina', 'formaggi stagionati intensi'],['pesce', 'piatti delicati'],"priorat-finca-dofi","rosso_veneto"),
    W("SPA019","Cava DO Brut Nature Gramona","Penedès","Europa","Spumante","standard",18.5,"Xarel·lo + Macabeo + Parellada",12.0,"alta","assenti","medio",1.0,['mela', 'crosta di pane', 'agrumi', 'fiori bianchi'],['tapas', 'frutti di mare', 'aperitivo', 'formaggi freschi'],['dolci molto zuccherini', 'piatti piccanti'],"cava-gramona-brut-nature","spumante"),
    W("SPA020","Jerez Fino DO Tio Pepe","Andalusia","Europa","Bianco","economico",14.5,"Palomino",15.0,"alta","assenti","leggero",0.5,['mandorla', 'camomilla', 'salinità', 'lievito'],['jamón ibérico', 'olive', 'frutti di mare', 'tapas fritte'],['dolci', 'carne rossa importante'],"jerez-fino-tio-pepe","bianco_nord"),
    W("GER006","Riesling Kabinett Mosel Dr. Loosen","Mosella","Europa","Bianco","standard",19.0,"Riesling",8.5,"alta","assenti","leggero",35.0,['pesca bianca', 'lime', 'ardesia', 'fiori bianchi'],['cucina asiatica speziata', 'pesce in agrodolce', 'formaggi freschi'],['carne rossa', 'piatti molto grassi'],"riesling-kabinett-loosen","bianco_nord"),
    W("GER007","Spätburgunder Baden Trocken","Baden","Europa","Rosso","standard",22.0,"Pinot Nero",13.0,"alta","fini","medio",1.0,['ciliegia', 'sottobosco', 'spezie leggere'],['anatra', 'funghi', 'carni bianche'],['pesce grasso', 'piatti piccanti'],"spatburgunder-baden","rosso_veneto"),
    W("AUT006","Grüner Veltliner Smaragd Wachau","Wachau","Europa","Bianco","standard",25.5,"Grüner Veltliner",13.5,"alta","assenti","medio",1.0,['pepe bianco', 'mela verde', 'erbe di campo'],['wiener schnitzel', 'asparagi', 'pesce di lago'],['carne rossa pesante', 'cioccolato'],"gruner-veltliner-wachau","bianco_nord"),
    W("AUT007","Zweigelt Burgenland","Burgenland","Europa","Rosso","economico",13.0,"Zweigelt",13.0,"media","morbidi","medio",1.0,['ciliegia', 'frutti di bosco', 'spezie leggere'],['gulasch', 'carni alla griglia', 'salumi austriaci'],['pesce crudo', 'crostacei'],"zweigelt-burgenland","rosso_veneto"),
    W("POR005","Vinho Verde DOC Quinta de Azevedo","Minho","Europa","Bianco","economico",9.5,"Alvarinho + Loureiro",10.5,"alta","assenti","leggero",1.0,['agrumi', 'fiori bianchi', 'leggera effervescenza'],['frutti di mare', 'pesce alla griglia', 'antipasti leggeri'],['carne rossa', 'dolci'],"vinho-verde-azevedo","bianco_nord"),
    W("POR006","Douro DOC Tinto Quinta do Crasto","Douro","Europa","Rosso","standard",20.0,"Touriga Nacional + Touriga Franca",14.0,"media","strutturati","pieno",1.0,['frutti neri', 'violetta', 'spezie', 'liquirizia'],['carni alla brace', 'bacalhau assado', 'formaggi stagionati'],['pesce crudo', 'piatti delicati'],"douro-tinto-crasto","rosso_veneto"),
    W("POR007","Porto Tawny 10 Anni Taylor's","Douro","Europa","Dolce","premium",36.0,"Touriga Nacional + Tinta Roriz",20.0,"media","morbidi","pieno",100.0,['frutta secca', 'caramello', 'fico', 'spezie dolci'],['formaggi erborinati', 'dolci alle noci', 'cioccolato fondente'],['pesce', 'carne rossa non dolce'],"porto-tawny-taylors","dolce"),
    W("GRE005","Assyrtiko PDO Santorini Gaia Wines","Santorini","Europa","Bianco","standard",24.5,"Assyrtiko",13.5,"altissima","assenti","medio",1.0,['agrumi', 'salinità vulcanica', 'erbe mediterranee'],['pesce alla griglia', 'frutti di mare crudi', 'insalata greca'],['carne rossa', 'dolci'],"assyrtiko-santorini-gaia","bianco_nord"),
    W("GRE006","Agiorgitiko PDO Nemea","Nemea","Europa","Rosso","economico",14.5,"Agiorgitiko",13.5,"media","morbidi","medio",1.0,['ciliegia', 'prugna', 'spezie dolci'],['moussaka', 'carni brasate', 'formaggi greci'],['pesce crudo', 'crostacei'],"agiorgitiko-nemea","rosso_veneto"),
    W("CRO002","Plavac Mali PDO Dalmazia","Dalmazia","Europa","Rosso","standard",21.5,"Plavac Mali",14.5,"media","potenti","pieno",1.0,['mora', 'fichi', 'erbe mediterranee', 'spezie'],['carni alla griglia', 'pesce grasso al forno', 'formaggi stagionati'],['pesce crudo delicato'],"plavac-mali-dalmazia","rosso_veneto"),
    W("SLO002","Rebula Brda Movia","Brda","Europa","Bianco","premium",31.5,"Rebula",13.0,"alta","assenti","medio",1.0,['mela', 'erbe di campo', 'mandorla', 'miele leggero'],['pesce di fiume', 'formaggi di malga', 'piatti sloveni tradizionali'],['carne rossa pesante'],"rebula-brda-movia","bianco_nord"),
    W("HUN005","Tokaji Furmint Dry Disznókő","Tokaj","Europa","Bianco","standard",22.5,"Furmint",13.0,"alta","assenti","medio",1.0,['mela cotogna', 'agrumi', 'mineralità vulcanica'],['pesce di fiume', 'formaggi ungheresi', 'piatti speziati leggeri'],['carne rossa pesante'],"tokaji-furmint-dry-disznoko","bianco_nord"),
    W("ROM002","Fetească Neagră DOC Recaș","Banat","Europa","Rosso","economico",12.5,"Fetească Neagră",13.5,"media","morbidi","medio",1.0,['frutti di bosco', 'spezie dolci', 'prugna'],['carni alla griglia', 'piatti rumeni tradizionali', 'formaggi stagionati'],['pesce crudo'],"feteasca-neagra-recas","rosso_veneto"),
    W("SUI001","Fendant du Valais AOC","Vallese","Europa","Bianco","standard",19.5,"Chasselas",12.0,"media","assenti","leggero",1.0,['mela', 'fiori di montagna', 'leggera nota di nocciola'],['fondue di formaggio', 'raclette', 'pesce di lago'],['carne rossa', 'piatti piccanti'],"fendant-valais","bianco_nord"),
    W("SUI002","Pinot Noir Grisons AOC","Grigioni","Europa","Rosso","standard",27.5,"Pinot Nero",13.0,"alta","fini","medio",1.0,['ciliegia', 'sottobosco', 'spezie leggere'],['carni bianche', 'funghi di montagna', 'formaggi svizzeri'],['pesce grasso', 'piatti piccanti'],"pinot-noir-grigioni","rosso_veneto"),
    W("UK002","English Sparkling Brut Nyetimber","Sussex","Europa","Spumante","premium",41.0,"Chardonnay + Pinot Nero + Pinot Meunier",12.0,"alta","assenti","medio",2.0,['mela verde', 'agrumi', 'crosta di pane', 'fiori bianchi'],['ostriche', 'aperitivo raffinato', 'pesce affumicato'],['dolci molto zuccherini', 'carne rossa'],"english-sparkling-nyetimber","spumante"),
    W("USA015","Napa Valley Cabernet Sauvignon Stag's Leap","California","Americhe","Rosso","lusso",125.3,"Cabernet Sauvignon",14.5,"media","strutturati","pieno",0.6,['cassis', 'cedro', 'vaniglia', 'cioccolato'],['filetto alla griglia', 'costata', 'formaggi stagionati duri'],['pesce', 'piatti leggeri'],"napa-cabernet-stags-leap","rosso_veneto"),
    W("USA016","Sonoma Coast Pinot Noir Kosta Browne","California","Americhe","Rosso","lusso",76.5,"Pinot Nero",14.0,"alta","fini","medio",0.7,['ciliegia', 'fragola', 'sottobosco', 'spezie leggere'],['salmone al forno', 'anatra', 'funghi porcini'],['carne rossa pesante', 'piatti piccanti'],"sonoma-pinot-kosta-browne","rosso_veneto"),
    W("USA017","Willamette Valley Pinot Gris Ponzi","Oregon","Americhe","Bianco","standard",22.0,"Pinot Grigio",13.0,"media","assenti","medio",1.5,['pera', 'fiori bianchi', 'spezie leggere'],['pesce al forno', 'insalate estive', 'formaggi freschi'],['carne rossa', 'piatti piccanti intensi'],"willamette-pinot-gris-ponzi","bianco_nord"),
    W("USA018","Finger Lakes Riesling Dry Hermann J. Wiemer","New York","Americhe","Bianco","standard",24.0,"Riesling",12.0,"alta","assenti","leggero-medio",5.0,['lime', 'pesca bianca', 'mineralità'],['cucina asiatica', 'pesce in salsa agrodolce', 'formaggi freschi'],['carne rossa pesante'],"finger-lakes-riesling-wiemer","bianco_nord"),
    W("USA019","Paso Robles Zinfandel Turley","California","Americhe","Rosso","premium",39.5,"Zinfandel",15.0,"media","morbidi","pieno",1.5,['mora', 'confettura', 'pepe nero', 'liquirizia'],['costine bbq', 'carni speziate', 'hamburger gourmet'],['pesce crudo', 'piatti delicati'],"paso-robles-zinfandel-turley","rosso_veneto"),
    W("USA020","Columbia Valley Syrah Charles Smith","Washington","Americhe","Rosso","standard",25.0,"Syrah",14.5,"media","strutturati","pieno",1.0,['mora', 'pepe nero', 'olive nere', 'affumicato'],['carni alla brace', 'selvaggina', 'formaggi stagionati'],['pesce crudo'],"columbia-syrah-charles-smith","rosso_veneto"),
    W("USA021","Santa Barbara Chardonnay Sanford","California","Americhe","Bianco","premium",33.0,"Chardonnay",13.5,"media","assenti","medio-pieno",1.0,['burro', 'vaniglia', 'frutta gialla matura', 'nocciola'],['astice al burro', 'pollo in salsa cremosa', 'risotto ai funghi'],['pesce crudo', 'piatti piccanti'],"santa-barbara-chardonnay-sanford","bianco_nord"),
    W("CAN003","Niagara Peninsula Icewine Inniskillin","Ontario","Americhe","Dolce","premium",52.5,"Vidal",10.0,"alta","assenti","pieno",180.0,['albicocca disidratata', 'miele', 'agrumi canditi'],['formaggi erborinati', 'dessert alla frutta', 'foie gras'],['carne rossa', 'piatti salati'],"niagara-icewine-inniskillin","dolce"),
    W("ARG007","Malbec Mendoza Reserva Catena Zapata","Mendoza","Sud America","Rosso","standard",21.0,"Malbec",14.0,"media","strutturati","pieno",1.0,['prugna', 'viola', 'cioccolato', 'spezie dolci'],['asado argentino', 'carni alla brace', 'empanadas di carne'],['pesce crudo', 'dolci'],"malbec-mendoza-catena-zapata","rosso_veneto"),
    W("ARG008","Torrontés Salta Colomé","Salta","Sud America","Bianco","economico",13.5,"Torrontés",13.0,"media","assenti","leggero-medio",1.5,["fiori d'arancio", 'litchi', 'uva moscata'],['empanadas', 'ceviche', 'cucina piccante latinoamericana'],['carne rossa pesante'],"torrontes-salta-colome","bianco_nord"),
    W("CIL007","Carménère Valle del Colchagua Montes","Colchagua","Sud America","Rosso","standard",16.5,"Carménère",14.0,"media","morbidi","pieno",1.0,['prugna', 'peperone rosso', 'spezie', 'cioccolato'],['carni alla griglia', 'empanadas', 'stufati speziati'],['pesce crudo', 'crostacei'],"carmenere-colchagua-montes","rosso_veneto"),
    W("CIL008","Sauvignon Blanc Casablanca Valley Veramonte","Casablanca","Sud America","Bianco","economico",12.5,"Sauvignon Blanc",13.0,"alta","assenti","leggero",1.0,['pompelmo', 'erba appena tagliata', 'frutto della passione'],['ceviche', 'pesce alla griglia', 'insalate fresche'],['carne rossa', 'dolci'],"sauvignon-casablanca-veramonte","bianco_nord"),
    W("URU001","Tannat Reserva Bodega Garzón","Maldonado","Sud America","Rosso","standard",19.5,"Tannat",13.5,"alta","potenti","pieno",1.0,['mora', 'pepe nero', 'tabacco', 'spezie scure'],['asado uruguaiano', 'carni rosse importanti', 'formaggi stagionati'],['pesce crudo', 'piatti delicati'],"tannat-garzon","rosso_veneto"),
    W("BRA002","Espumante Brut Rosé Casa Valduga","Rio Grande do Sul","Sud America","Spumante","standard",18.0,"Pinot Nero + Chardonnay",12.0,"alta","assenti","medio",4.0,['fragola', 'lampone', 'crosta di pane'],['aperitivo', 'frutti di mare', 'cucina brasiliana leggera'],['carne rossa pesante'],"espumante-rose-valduga","spumante"),
    W("AUS020","Barossa Valley Shiraz Penfolds Bin 28","Barossa Valley","Oceania","Rosso","premium",42.0,"Shiraz",14.5,"media","strutturati","pieno",1.0,['mora', 'cioccolato', 'pepe nero', 'vaniglia'],['carni alla brace', "costolette d'agnello", 'formaggi stagionati'],['pesce crudo', 'dolci'],"barossa-shiraz-penfolds-bin28","rosso_veneto"),
    W("AUS021","Margaret River Chardonnay Leeuwin Estate","Margaret River","Oceania","Bianco","premium",34.5,"Chardonnay",13.5,"media","assenti","medio-pieno",1.0,['frutta gialla', 'burro', 'vaniglia', 'agrumi'],['astice', 'pollo in salsa', 'risotto ai frutti di mare'],['carne rossa', 'piatti piccanti'],"margaret-river-chardonnay-leeuwin","bianco_nord"),
    W("AUS022","Clare Valley Riesling Jim Barry","Clare Valley","Oceania","Bianco","standard",21.0,"Riesling",12.0,"alta","assenti","leggero",3.0,['lime', 'pietra focaia', 'fiori bianchi'],['pesce alla griglia', 'cucina asiatica leggera', 'frutti di mare'],['carne rossa pesante'],"clare-valley-riesling-jim-barry","bianco_nord"),
    W("NZ008","Central Otago Pinot Noir Felton Road","Central Otago","Oceania","Rosso","premium",47.0,"Pinot Nero",13.5,"alta","fini","medio",0.8,['ciliegia', 'lampone', 'spezie leggere', 'sottobosco'],['agnello neozelandese', 'salmone al forno', 'funghi'],['pesce crudo', 'piatti piccanti'],"central-otago-pinot-felton-road","rosso_veneto"),
    W("NZ009","Hawke's Bay Syrah Trinity Hill","Hawke's Bay","Oceania","Rosso","standard",25.5,"Syrah",13.5,"media","strutturati","medio-pieno",1.0,['pepe nero', 'mora', 'viola', 'olive'],['carni alla griglia', 'agnello speziato', 'formaggi stagionati'],['pesce crudo'],"hawkes-bay-syrah-trinity-hill","rosso_veneto"),
    W("SAF008","Stellenbosch Chenin Blanc Ken Forrester","Western Cape","Africa","Bianco","standard",17.0,"Chenin Blanc",13.0,"alta","assenti","medio",1.5,['mela cotogna', 'miele leggero', 'agrumi'],['pesce alla griglia', 'pollo speziato', 'piatti sudafricani leggeri'],['carne rossa pesante'],"chenin-blanc-ken-forrester","bianco_nord"),
    W("SAF009","Swartland Pinotage Spice Route","Swartland","Africa","Rosso","standard",18.0,"Pinotage",14.0,"media","strutturati","pieno",1.0,['frutti di bosco', 'affumicato', 'spezie', 'cioccolato'],['braai sudafricano', 'carni affumicate', 'salumi speziati'],['pesce crudo', 'dolci'],"swartland-pinotage-spice-route","rosso_veneto"),
    W("MRC001","Guerrouane AOG Rouge Celliers de Meknès","Meknès","Africa","Rosso","economico",11.0,"Cinsault + Syrah",13.0,"media","morbidi","medio",1.0,['frutti rossi', 'spezie nordafricane', 'erbe aromatiche'],['tajine di agnello', 'cous cous speziato', 'carni alla griglia'],['pesce crudo', 'dolci'],"guerrouane-meknes","rosso_veneto"),
    W("GEO006","Saperavi Qvevri Pheasant's Tears","Kakheti","Asia","Rosso","standard",25.5,"Saperavi",13.0,"alta","potenti","pieno",1.0,['prugna', 'terra', 'spezie orientali', 'tannino vivo'],['khinkali', 'carni brasate georgiane', 'formaggi stagionati'],['pesce crudo delicato'],"saperavi-qvevri-pheasant-tears","rosso_veneto"),
    W("GEO007","Rkatsiteli Qvevri Orange Wine","Kakheti","Asia","Bianco","premium",30.0,"Rkatsiteli",12.5,"alta","medi","medio",1.0,['albicocca secca', 'tè nero', 'erbe', 'noce'],['formaggi stagionati', 'piatti speziati', 'cucina georgiana'],['dolci molto zuccherini'],"rkatsiteli-orange-wine","bianco_nord"),
    W("JAP003","Koshu Yamanashi Grace Wine","Yamanashi","Asia","Bianco","standard",28.5,"Koshu",11.5,"media","assenti","leggero",1.0,['yuzu', 'pera', 'erbe delicate', 'salinità leggera'],['sushi', 'tempura', 'cucina giapponese delicata'],['carne rossa', 'piatti molto speziati'],"koshu-yamanashi-grace","bianco_nord"),
    W("LIB002","Château Musar Bekaa Valley","Valle della Bekaa","Asia","Rosso","premium",30.5,"Cabernet Sauvignon + Cinsault + Carignan",13.5,"media","fini","medio-pieno",1.0,['ciliegia', 'spezie orientali', 'cuoio leggero', 'frutta secca'],['kebab speziato', 'agnello', 'piatti libanesi ricchi'],['pesce crudo', 'dolci'],"chateau-musar-bekaa","rosso_veneto"),
    W("CHN001","Ningxia Cabernet Sauvignon Helan Qingxue","Ningxia","Asia","Rosso","premium",38.5,"Cabernet Sauvignon",14.0,"media","strutturati","pieno",0.8,['cassis', 'cedro', 'spezie dolci'],['anatra alla pechinese', 'carni rosse speziate', 'formaggi stagionati'],['pesce crudo', 'piatti molto piccanti'],"ningxia-cabernet-helan-qingxue","rosso_veneto"),
    W("IND001","Nashik Valley Shiraz Sula Vineyards","Maharashtra","Asia","Rosso","economico",14.0,"Shiraz",13.5,"media","morbidi","medio",1.0,['mora', 'spezie indiane', 'pepe'],['curry di agnello', 'tandoori', 'piatti speziati moderati'],['pesce crudo', 'dolci'],"nashik-shiraz-sula","rosso_veneto"),    W("LOM010","Franciacorta DOCG Satèn Ca' del Bosco","Lombardia","Italia","Spumante","premium",34.0,"Chardonnay",12.5,"alta","assenti","medio",5.0,['crosta di pane', 'agrumi', 'fiori bianchi', 'nocciola'],['risotto allo zafferano', 'aperitivo raffinato', 'pesce delicato'],['carne rossa pesante', 'piatti molto speziati'],"franciacorta-saten-ca-del-bosco","spumante"),
    W("LOM011","Valtellina Superiore DOCG Sassella Nino Negri","Lombardia","Italia","Rosso","standard",24.5,"Nebbiolo (Chiavennasca)",13.5,"alta","fini","medio-pieno",1.0,['viola', 'ciliegia', 'spezie alpine', 'erbe di montagna'],['pizzoccheri', 'brasati di montagna', 'selvaggina', 'formaggi alpini'],['pesce crudo', 'crostacei'],"valtellina-sassella-negri","rosso_piemonte"),
    W("TRE010","Teroldego Rotaliano DOC Foradori","Trentino-Alto Adige","Italia","Rosso","standard",22.0,"Teroldego",13.0,"alta","medi","medio-pieno",1.0,['mora', 'viola', 'spezie alpine', 'erbe di montagna'],['canederli', 'carni bianche', 'formaggi trentini', 'selvaggina leggera'],['pesce crudo', 'dolci'],"teroldego-rotaliano-foradori","rosso_piemonte"),
    W("TRE011","Gewürztraminer Alto Adige DOC Cantina Tramin","Trentino-Alto Adige","Italia","Bianco","standard",20.5,"Gewürztraminer",14.0,"media","assenti","medio",1.5,['litchi', 'rosa', 'frutta esotica', 'spezie orientali'],['cucina speziata asiatica', 'formaggi erborinati', 'foie gras'],['pesce delicato', 'crudi'],"gewurztraminer-alto-adige-tramin","bianco_nord"),
    W("FRI010","Friulano DOC Colli Orientali Ronco del Gnemiz","Friuli-Venezia Giulia","Italia","Bianco","standard",26.0,"Friulano",13.0,"alta","assenti","medio",1.0,['mandorla', 'fiori di campo', 'pera'],['prosciutto di San Daniele', 'frittata di erbe', 'formaggi freschi friulani'],['carne rossa', 'cioccolato'],"friulano-colli-orientali-gnemiz","bianco_nord"),
    W("FRI011","Ramandolo DOCG Passito","Friuli-Venezia Giulia","Italia","Dolce","premium",36.5,"Verduzzo Friulano",13.5,"media","assenti","pieno",95.0,['miele', 'albicocca', 'frutta secca', 'spezie dolci'],['formaggi erborinati friulani', 'dolci alle noci', 'crostate'],['carne', 'pesce', 'piatti salati'],"ramandolo-passito","dolce"),
    W("VEN020","Prosecco Superiore DOCG Valdobbiadene Bisol","Veneto","Italia","Spumante","standard",16.5,"Glera",11.5,"alta","assenti","leggero",13.0,['mela verde', 'pera', 'fiori bianchi'],['aperitivo', 'antipasti leggeri', 'frutti di mare crudi'],['carne rossa', 'piatti molto speziati'],"prosecco-valdobbiadene-bisol","spumante"),
    W("VEN021","Bardolino Chiaretto DOC Le Fraghe","Veneto","Italia","Rosato","economico",11.0,"Corvina + Rondinella",12.0,"alta","leggeri","leggero",1.5,['fragola', 'ciliegia fresca', 'agrumi'],['antipasti estivi', 'pesce alla griglia', 'salumi leggeri'],['carne rossa importante', 'formaggi molto stagionati'],"bardolino-chiaretto-fraghe","rosato"),
    W("LIG005","Pigato Riviera Ligure di Ponente DOC","Liguria","Italia","Bianco","standard",17.5,"Pigato",13.0,"alta","assenti","medio",1.0,['erbe aromatiche', 'agrumi', 'salinità marina'],['pesto alla genovese', 'pesce ligure', 'focaccia con formaggio'],['carne rossa', 'brasati'],"pigato-riviera-ponente","bianco_nord"),
    W("LIG006","Sciacchetrà Cinque Terre DOC","Liguria","Italia","Dolce","premium",50.5,"Bosco + Albarola + Vermentino",15.0,"alta","assenti","pieno",110.0,['albicocca secca', 'miele', 'erbe mediterranee'],['formaggi erborinati', 'dolci secchi liguri', 'crostate di frutta'],['carne', 'pesce', 'piatti salati'],"sciacchetra-cinque-terre","dolce"),
    W("MAR010","Verdicchio dei Castelli di Jesi Riserva DOCG Umani Ronchi","Marche","Italia","Bianco","standard",18.5,"Verdicchio",13.5,"alta","assenti","medio",1.0,['mandorla', 'agrumi', 'erbe aromatiche', 'mineralità'],['brodetto di pesce', 'coniglio in porchetta', 'pesce alla griglia'],['carne rossa pesante'],"verdicchio-jesi-riserva-umani-ronchi","bianco_nord"),
    W("MAR011","Rosso Conero DOC Riserva Umani Ronchi","Marche","Italia","Rosso","standard",20.5,"Montepulciano",14.0,"media","strutturati","pieno",1.0,['mora', 'spezie', 'liquirizia'],['vincisgrassi', 'carni brasate', 'formaggi marchigiani'],['pesce crudo', 'dolci'],"rosso-conero-riserva-umani-ronchi","rosso_toscana"),
    W("ABR008","Trebbiano d'Abruzzo DOC Valentini","Abruzzo","Italia","Bianco","premium",43.5,"Trebbiano",13.0,"alta","assenti","medio",1.0,['miele', 'agrumi', 'erbe di campagna', 'mineralità'],['pesce adriatico', 'arrosticini di pollo', 'formaggi freschi'],['carne rossa importante'],"trebbiano-abruzzo-valentini","bianco_nord"),
    W("ABR009","Montepulciano d'Abruzzo DOC Riserva Emidio Pepe","Abruzzo","Italia","Rosso","premium",47.0,"Montepulciano",13.5,"alta","fini","pieno",1.0,['prugna', 'spezie', 'erbe abruzzesi', 'cuoio leggero'],["arrosticini d'agnello", 'carni alla brace', 'formaggi stagionati'],['pesce crudo', 'dolci'],"montepulciano-abruzzo-riserva-pepe","rosso_toscana"),
    W("CAM010","Taurasi DOCG Riserva Mastroberardino","Campania","Italia","Rosso","premium",42.5,"Aglianico",14.0,"alta","potenti","pieno",1.0,['mora', 'spezie scure', 'cuoio', 'liquirizia'],['carni brasate', 'cinghiale', 'formaggi campani stagionati'],['pesce crudo', 'dolci leggeri'],"taurasi-riserva-mastroberardino","rosso_toscana"),
    W("CAM011","Falanghina del Sannio DOC Feudi di San Gregorio","Campania","Italia","Bianco","economico",12.5,"Falanghina",12.5,"media","assenti","leggero-medio",1.5,['fiori bianchi', 'pesca', 'agrumi'],['frittura di paranza', 'pizza fritta', 'antipasti campani'],['carne rossa', 'dolci'],"falanghina-sannio-feudi","bianco_nord"),
    W("LAZ006","Frascati Superiore DOCG Casale Marchese","Lazio","Italia","Bianco","economico",12.5,"Malvasia + Trebbiano",12.5,"media","assenti","leggero",1.0,['fiori bianchi', 'mandorla', 'frutta gialla'],['carciofi alla romana', 'abbacchio leggero', 'antipasti laziali'],['carne rossa pesante'],"frascati-superiore-casale-marchese","bianco_nord"),
    W("BAS006","Aglianico del Vulture DOC Superiore Paternoster","Basilicata","Italia","Rosso","standard",22.5,"Aglianico",14.0,"alta","potenti","pieno",1.0,['mora', 'spezie vulcaniche', 'liquirizia'],['carni brasate', 'salsiccia lucana', 'formaggi stagionati'],['pesce crudo', 'dolci'],"aglianico-vulture-paternoster","rosso_toscana"),
    W("CAL006","Cirò Rosso DOC Classico Superiore Librandi","Calabria","Italia","Rosso","economico",14.5,"Gaglioppo",13.5,"media","medi","medio",1.0,['ciliegia', 'erbe mediterranee', 'spezie leggere'],["'nduja", 'carni alla brace', 'pasta alla calabrese'],['pesce crudo', 'dolci'],"ciro-rosso-librandi","rosso_toscana"),    W("PIE020","Roero Arneis DOCG Malvirà","Piemonte","Italia","Bianco","standard",16.0,"Arneis",13.0,"media","assenti","leggero-medio",1.5,['pera', 'fiori bianchi', 'mandorla'],['vitello tonnato', 'antipasti piemontesi', 'pesce di lago'],['carne rossa pesante'],"roero-arneis-malvira","bianco_nord"),
    W("PIE021","Erbaluce di Caluso DOCG Ferrando","Piemonte","Italia","Bianco","standard",19.5,"Erbaluce",12.5,"alta","assenti","medio",1.0,['agrumi', 'mineralità', 'fiori bianchi'],['fritto misto piemontese', 'pesce di lago', 'antipasti'],['carne rossa pesante'],"erbaluce-caluso-ferrando","bianco_nord"),
    W("TOS020","Carmignano DOCG Riserva Capezzana","Toscana","Italia","Rosso","premium",34.0,"Sangiovese + Cabernet",13.5,"alta","strutturati","pieno",1.0,['ciliegia', 'cassis', 'spezie', 'tabacco leggero'],['bistecca', 'cacciagione', 'formaggi toscani stagionati'],['pesce crudo', 'dolci'],"carmignano-riserva-capezzana","rosso_toscana"),
    W("TOS021","Chianti Rufina DOCG Riserva Selvapiana","Toscana","Italia","Rosso","standard",24.0,"Sangiovese",13.5,"alta","medi","medio-pieno",1.0,['ciliegia', 'viola', 'erbe toscane'],['pappardelle al ragù', 'arrosti toscani', 'pecorino stagionato'],['pesce crudo', 'dolci'],"chianti-rufina-selvapiana","rosso_toscana"),

    # ══════════════════════════════════
    # NUOVI 100 VINI — completamento catalogo (agosto 2026)
    # Prezzi: stime indicative su fascia/denominazione, DA CONFERMARE
    # singolarmente prima del lancio in produzione (vedi relazione investitore).
    # ══════════════════════════════════
    W("XSP001","Rioja Gran Reserva DOCa López de Heredia Viña Tondonia","Rioja","Europa","Rosso","premium",45.0,"Tempranillo",13.5,"alta","fini","pieno",1.0,['ciliegia matura', 'cuoio', 'vaniglia', 'tabacco'],['agnello arrosto', 'carni brasate', 'formaggi stagionati'],['pesce crudo', 'dolci'],"rioja-gran-reserva-tondonia","rosso_estero"),
    W("XSP002","Priorat DOQ Clos Mogador","Priorat","Europa","Rosso","lusso",95.0,"Garnacha + Cariñena",14.5,"media","potenti","pieno",0.8,['frutti neri', 'liquirizia', 'minerale', 'spezie'],['carni brasate', 'selvaggina', 'formaggi stagionati'],['pesce delicato', 'crudi'],"priorat-clos-mogador","rosso_estero"),
    W("XSP003","Rías Baixas DO Albariño Pazo de Señorans","Rías Baixas","Europa","Bianco","standard",19.0,"Albariño",12.5,"alta","assenti","leggero-medio",1.0,['pesca bianca', 'agrumi', 'salinità'],['frutti di mare', 'pesce alla griglia', 'tapas di pesce'],['carne rossa'],"albarino-pazo-senorans","bianco_estero"),
    W("XSP004","Ribera del Duero DO Pesquera Crianza","Ribera del Duero","Europa","Rosso","standard",26.0,"Tempranillo",14.0,"media","strutturati","pieno",1.0,['mora', 'vaniglia', 'tabacco'],['cordero asado', 'bistecca', 'formaggi stagionati'],['pesce crudo'],"ribera-duero-pesquera-crianza","rosso_estero"),
    W("XSP005","Jerez Fino DO Tio Pepe","Jerez","Europa","Bianco","economico",13.0,"Palomino",15.0,"altissima","assenti","leggero",0.5,['mandorla', 'salinità', 'lievito'],['tapas', 'jamón', 'olive'],['dolci'],"jerez-fino-tio-pepe","bianco_estero"),
    W("XSP006","Cava DO Brut Nature Gramona","Penedès","Europa","Spumante","standard",17.5,"Xarel·lo + Macabeo + Parellada",12.0,"alta","assenti","leggero-medio",2.0,['crosta di pane', 'agrumi', 'mela verde'],['aperitivo', 'frutti di mare', 'sushi'],['carne rossa pesante'],"cava-gramona-brut-nature","spumante"),
    W("XPT001","Douro DOC Tinto Quinta do Vale Meão","Douro","Europa","Rosso","premium",52.0,"Touriga Nacional + Touriga Franca",14.0,"media","strutturati","pieno",1.0,['frutti neri', 'violetta', 'spezie'],['carni brasate', 'selvaggina', 'formaggi portoghesi'],['pesce crudo'],"douro-vale-meao","rosso_estero"),
    W("XPT002","Vinho Verde DOC Soalheiro Alvarinho","Minho","Europa","Bianco","economico",13.5,"Alvarinho",12.0,"alta","assenti","leggero",5.0,['agrumi', 'fiori bianchi', 'leggera effervescenza'],['frutti di mare', 'aperitivo estivo', 'pesce alla griglia'],['carne rossa'],"vinho-verde-soalheiro","bianco_estero"),
    W("XPT003","Porto Tawny 20 anni Taylor's","Douro","Europa","Dolce","premium",48.0,"Touriga Nacional + Tinta Roriz",20.0,"media","morbidi","pieno",100.0,['noce', 'caramello', 'frutta secca', 'spezie dolci'],['formaggi erborinati', 'dolci alle noci', 'cioccolato fondente'],['pesce', 'piatti salati'],"porto-tawny-20-taylors","dolce"),
    W("XDE001","Mosel Riesling Kabinett Dr. Loosen","Mosel","Europa","Bianco","standard",22.0,"Riesling",8.5,"altissima","assenti","leggero",35.0,['pesca', 'lime', 'pietra ardesia'],['cucina asiatica speziata', 'pesce', 'formaggi freschi'],['carne rossa pesante'],"mosel-riesling-kabinett-loosen","bianco_estero"),
    W("XDE002","Pfalz Riesling Trocken GG Bürklin-Wolf","Pfalz","Europa","Bianco","premium",38.0,"Riesling",12.5,"altissima","assenti","medio",1.0,['agrumi', 'pietra focaia', 'erbe'],['pesce al forno', 'crostacei', 'formaggi delicati'],['carne rossa pesante'],"pfalz-riesling-gg-buerklin-wolf","bianco_estero"),
    W("XAT001","Wachau Grüner Veltliner Smaragd Prager","Wachau","Europa","Bianco","standard",27.0,"Grüner Veltliner",13.0,"alta","assenti","medio",1.0,['pepe bianco', 'mela verde', 'erbe'],['wiener schnitzel', 'asparagi', 'pesce di fiume'],['carne rossa pesante'],"wachau-gruner-veltliner-prager","bianco_estero"),
    W("XAT002","Burgenland Blaufränkisch Moric","Burgenland","Europa","Rosso","premium",32.0,"Blaufränkisch",13.0,"alta","fini","medio-pieno",1.0,['ciliegia', 'pepe nero', 'erbe selvatiche'],['gulasch', 'carni alla griglia', 'formaggi stagionati'],['pesce crudo'],"burgenland-blaufrankisch-moric","rosso_estero"),
    W("XGR001","Santorini PDO Assyrtiko Gaia Wines","Santorini","Europa","Bianco","standard",21.0,"Assyrtiko",13.5,"altissima","assenti","medio",1.0,['agrumi', 'salinità', 'pietra vulcanica'],['frutti di mare', 'insalata greca', 'pesce alla griglia'],['carne rossa pesante'],"santorini-assyrtiko-gaia","bianco_estero"),
    W("XGR002","Naoussa PDO Xinomavro Boutari","Naoussa","Europa","Rosso","standard",19.5,"Xinomavro",13.0,"alta","fini","medio",1.0,['pomodoro secco', 'olive', 'spezie'],['moussaka', 'carni alla griglia', 'formaggi stagionati'],['pesce crudo'],"naoussa-xinomavro-boutari","rosso_estero"),
    W("XHU001","Tokaji Aszú 5 Puttonyos Royal Tokaji","Tokaj","Europa","Dolce","premium",58.0,"Furmint + Hárslevelű",11.0,"alta","assenti","pieno",150.0,['albicocca', 'miele', 'zafferano', 'agrumi canditi'],['foie gras', 'formaggi erborinati', 'dolci speziati'],['carne rossa', 'piatti piccanti'],"tokaji-aszu-5-royal-tokaji","dolce"),
    W("XFR001","Alsace Riesling Grand Cru Trimbach","Alsazia","Europa","Bianco","premium",34.0,"Riesling",13.0,"altissima","assenti","medio",2.0,['agrumi', 'pietra focaia', 'fiori bianchi'],['choucroute', 'pesce di fiume', 'formaggi alsaziani'],['carne rossa pesante'],"alsace-riesling-trimbach","bianco_estero"),
    W("XFR002","Sancerre AOC Blanc Henri Bourgeois","Loira","Europa","Bianco","standard",24.5,"Sauvignon Blanc",13.0,"alta","assenti","leggero-medio",1.0,['pompelmo', 'erba tagliata', 'mineralità'],['formaggi di capra', 'frutti di mare', 'pesce leggero'],['carne rossa'],"sancerre-henri-bourgeois","bianco_estero"),
    W("XFR003","Châteauneuf-du-Pape AOC Château de Beaucastel","Rodano","Europa","Rosso","lusso",78.0,"Grenache + Syrah + Mourvèdre",14.5,"media","strutturati","pieno",1.0,['frutti neri', 'garrigue', 'pepe', 'liquirizia'],['agnello', 'selvaggina', 'formaggi stagionati'],['pesce crudo'],"chateauneuf-beaucastel","rosso_estero"),
    W("XFR004","Margaux AOC Château Palmer","Bordeaux","Europa","Rosso","lusso",320.0,"Cabernet Sauvignon + Merlot + Petit Verdot",13.5,"alta","fini","pieno",1.0,['cassis', 'viola', 'cedro', 'grafite'],['filetto di manzo', 'agnello', 'formaggi stagionati'],['pesce crudo', 'piatti piccanti'],"margaux-chateau-palmer","rosso_estero"),
    W("XFR005","Pouilly-Fuissé AOC Domaine Ferret","Borgogna","Europa","Bianco","premium",36.0,"Chardonnay",13.0,"alta","assenti","medio-pieno",1.0,['burro', 'nocciola', 'frutta bianca'],['pollo alla crema', 'pesce al burro', 'formaggi di capra'],['carne rossa pesante'],"pouilly-fuisse-domaine-ferret","bianco_estero"),
    W("XFR006","Crémant de Bourgogne Brut Louis Bouillot","Borgogna","Europa","Spumante","standard",16.0,"Chardonnay + Pinot Noir",12.0,"alta","assenti","leggero-medio",3.0,['crosta di pane', 'mela', 'agrumi'],['aperitivo', 'antipasti', 'pesce leggero'],['carne rossa'],"cremant-bourgogne-bouillot","spumante"),
    W("XUS001","Sonoma Coast Pinot Noir Kistler","Sonoma","Americhe","Rosso","premium",58.0,"Pinot Noir",13.5,"alta","fini","medio",1.0,['ciliegia', 'fragola', 'terra sottobosco'],['anatra', 'salmone al forno', 'funghi porcini'],['piatti molto piccanti'],"sonoma-pinot-noir-kistler","rosso_estero"),
    W("XUS002","Willamette Valley Pinot Gris Ponzi","Oregon","Americhe","Bianco","standard",22.0,"Pinot Gris",13.0,"media","assenti","medio",2.0,['pera', 'mela', 'fiori bianchi'],['pesce al forno', 'pollo', 'formaggi freschi'],['carne rossa pesante'],"willamette-pinot-gris-ponzi","bianco_estero"),
    W("XUS003","Paso Robles Zinfandel Ridge Vineyards","California","Americhe","Rosso","standard",29.0,"Zinfandel",14.5,"media","strutturati","pieno",1.0,['mora', 'pepe', 'spezie dolci'],['barbecue', 'costine', 'formaggi stagionati'],['pesce crudo'],"paso-robles-zinfandel-ridge","rosso_estero"),
    W("XUS004","Napa Valley Chardonnay Far Niente","Napa Valley","Americhe","Bianco","premium",55.0,"Chardonnay",14.0,"media","assenti","pieno",1.0,['ananas', 'burro', 'vaniglia'],['astice al burro', 'pollo alla crema', 'formaggi grassi'],['pesce crudo delicato'],"napa-chardonnay-far-niente","bianco_estero"),
    W("XUS005","Finger Lakes Riesling Dr. Konstantin Frank","New York","Americhe","Bianco","standard",21.0,"Riesling",11.5,"alta","assenti","leggero",8.0,['pesca', 'lime', 'minerale'],['cucina asiatica', 'pesce', 'formaggi freschi'],['carne rossa pesante'],"finger-lakes-riesling-frank","bianco_estero"),
    W("XCA001","Niagara Peninsula Icewine Inniskillin","Ontario","Americhe","Dolce","premium",42.0,"Vidal",10.0,"alta","assenti","pieno",180.0,['albicocca', 'miele', 'agrumi canditi'],['foie gras', 'dolci alla frutta', 'formaggi erborinati'],['carne', 'piatti salati'],"niagara-icewine-inniskillin","dolce"),
    W("XMX001","Valle de Guadalupe Tinto Casa Madero","Baja California","Americhe","Rosso","standard",24.0,"Cabernet Sauvignon + Tempranillo",14.0,"media","strutturati","pieno",1.0,['frutti neri', 'spezie', 'tabacco leggero'],['carni alla griglia', 'tacos di carne', 'formaggi stagionati'],['pesce crudo'],"valle-guadalupe-casa-madero","rosso_estero"),
    W("XAR001","Mendoza Malbec Catena Zapata Nicasia","Mendoza","Sud America","Rosso","premium",40.0,"Malbec",14.5,"media","strutturati","pieno",1.0,['prugna', 'violetta', 'cioccolato'],['asado argentino', 'bistecca', 'formaggi stagionati'],['pesce crudo'],"mendoza-malbec-catena-nicasia","rosso_estero"),
    W("XAR002","Salta Torrontés Colomé","Salta","Sud America","Bianco","standard",18.0,"Torrontés",13.0,"media","assenti","medio",1.0,['fiori bianchi', 'litchi', 'agrumi'],['cucina piccante', 'antipasti', 'pesce speziato'],['carne rossa pesante'],"salta-torrontes-colome","bianco_estero"),
    W("XCL001","Colchagua Valley Carménère Montes Alpha","Colchagua","Sud America","Rosso","standard",23.0,"Carménère",14.0,"media","strutturati","pieno",1.0,['prugna', 'pepe verde', 'cioccolato'],['carni rosse', 'empanadas di carne', 'formaggi stagionati'],['pesce crudo'],"colchagua-carmenere-montes","rosso_estero"),
    W("XCL002","Casablanca Valley Sauvignon Blanc Casas del Bosque","Casablanca","Sud America","Bianco","economico",13.5,"Sauvignon Blanc",13.0,"alta","assenti","leggero",1.0,['pompelmo', 'erba', 'agrumi'],['ceviche', 'frutti di mare', 'insalate'],['carne rossa'],"casablanca-sauv-blanc-casas-bosque","bianco_estero"),
    W("XUY001","Canelones Tannat Bodega Garzón","Canelones","Sud America","Rosso","standard",25.0,"Tannat",14.0,"alta","potenti","pieno",1.0,['mora', 'tabacco', 'spezie scure'],['asado uruguaiano', 'carni alla brace', 'formaggi stagionati'],['pesce crudo'],"canelones-tannat-garzon","rosso_estero"),
    W("XBR002","Vale dos Vinhedos Espumante Casa Valduga","Rio Grande do Sul","Sud America","Spumante","economico",14.0,"Chardonnay + Pinot Noir",12.0,"alta","assenti","leggero",2.0,['agrumi', 'mela', 'crosta di pane'],['aperitivo', 'antipasti', 'frutti di mare'],['carne rossa pesante'],"vale-vinhedos-valduga-espumante","spumante"),
    W("XAU001","Barossa Valley Shiraz Penfolds Bin 28","Barossa Valley","Oceania","Rosso","premium",48.0,"Shiraz",14.5,"media","strutturati","pieno",1.0,['mora', 'cioccolato', 'pepe', 'vaniglia'],['barbecue', 'agnello', 'formaggi stagionati'],['pesce crudo'],"barossa-shiraz-penfolds-bin28","rosso_estero"),
    W("XAU002","Clare Valley Riesling Grosset","Clare Valley","Oceania","Bianco","standard",26.0,"Riesling",12.5,"altissima","assenti","leggero",1.0,['lime', 'pietra', 'fiori bianchi'],['frutti di mare', 'cucina asiatica', 'pesce alla griglia'],['carne rossa pesante'],"clare-valley-riesling-grosset","bianco_estero"),
    W("XAU003","Margaret River Cabernet Sauvignon Cullen","Margaret River","Oceania","Rosso","premium",50.0,"Cabernet Sauvignon",13.5,"alta","fini","pieno",1.0,['cassis', 'cedro', 'erbe mediterranee'],['agnello', 'bistecca', 'formaggi stagionati'],['pesce crudo'],"margaret-river-cabernet-cullen","rosso_estero"),
    W("XNZ001","Marlborough Sauvignon Blanc Cloudy Bay","Marlborough","Oceania","Bianco","standard",28.0,"Sauvignon Blanc",13.0,"alta","assenti","leggero-medio",1.0,['frutto della passione', 'pompelmo', 'erba tagliata'],['capesante', 'insalate estive', 'formaggi di capra'],['carne rossa'],"marlborough-sauv-blanc-cloudy-bay","bianco_estero"),
    W("XNZ002","Central Otago Pinot Noir Felton Road","Central Otago","Oceania","Rosso","premium",46.0,"Pinot Noir",13.5,"alta","fini","medio",1.0,['ciliegia', 'spezie', 'terra'],['anatra', 'salmone', 'funghi'],['piatti molto piccanti'],"central-otago-pinot-felton-road","rosso_estero"),
    W("XZA001","Stellenbosch Chenin Blanc Ken Forrester","Stellenbosch","Africa","Bianco","standard",17.0,"Chenin Blanc",13.0,"alta","assenti","medio",1.0,['mela cotogna', 'miele', 'agrumi'],['pesce alla griglia', 'pollo', 'cucina speziata leggera'],['carne rossa pesante'],"stellenbosch-chenin-ken-forrester","bianco_estero"),
    W("XZA002","Constantia Sauvignon Blanc Klein Constantia","Constantia","Africa","Bianco","premium",30.0,"Sauvignon Blanc",13.0,"alta","assenti","leggero-medio",1.0,['frutto della passione', 'erba', 'agrumi'],['frutti di mare', 'insalate', 'pesce leggero'],['carne rossa'],"constantia-sauv-blanc-klein","bianco_estero"),
    W("XIT001","Franciacorta DOCG Riserva Bellavista Vittorio Moretti","Lombardia","Italia","Spumante","lusso",95.0,"Chardonnay + Pinot Nero",12.5,"alta","assenti","pieno",4.0,['crosta di pane tostata', 'frutta secca', 'miele', 'agrumi canditi'],['pesce nobile', 'crostacei', 'aperitivo importante'],['carne rossa pesante'],"franciacorta-riserva-bellavista","spumante"),
    W("XIT002","Amarone della Valpolicella DOCG Classico Allegrini","Veneto","Italia","Rosso","lusso",68.0,"Corvina + Rondinella + Molinara",15.5,"media","potenti","pieno",4.0,['prugna secca', 'cioccolato', 'spezie', 'cuoio'],["brasato all'amarone", 'selvaggina', 'formaggi molto stagionati'],['pesce crudo', 'piatti leggeri'],"amarone-classico-allegrini","rosso_toscana"),
    W("XIT003","Recioto della Valpolicella DOCG Tommasi","Veneto","Italia","Dolce","premium",38.0,"Corvina + Rondinella",14.0,"media","morbidi","pieno",90.0,['ciliegia sotto spirito', 'cioccolato', 'spezie dolci'],['dolci al cioccolato', 'formaggi erborinati', 'crostate ai frutti rossi'],['pesce', 'piatti salati'],"recioto-valpolicella-tommasi","dolce"),
    W("XIT004","Vino Nobile di Montepulciano DOCG Riserva Avignonesi","Toscana","Italia","Rosso","premium",39.0,"Sangiovese (Prugnolo Gentile)",14.0,"alta","strutturati","pieno",1.0,['ciliegia matura', 'spezie', 'tabacco'],['pici al ragù', 'bistecca', 'formaggi toscani'],['pesce crudo'],"nobile-montepulciano-avignonesi","rosso_toscana"),
    W("XIT005","Sagrantino di Montefalco DOCG Arnaldo Caprai","Umbria","Italia","Rosso","premium",36.0,"Sagrantino",14.5,"alta","potenti","pieno",1.0,['mora', 'liquirizia', 'cuoio', 'spezie scure'],['cinghiale in umido', 'carni brasate', 'formaggi umbri stagionati'],['pesce crudo'],"sagrantino-montefalco-caprai","rosso_toscana"),
    W("XIT006","Cerasuolo di Vittoria DOCG COS","Sicilia","Italia","Rosso","standard",23.0,"Nero d'Avola + Frappato",13.0,"media","medi","medio",1.0,['ciliegia', 'fragola', 'erbe mediterranee'],['pasta alla norma', 'caponata', 'carni bianche'],['pesce crudo'],"cerasuolo-vittoria-cos","rosso_toscana"),
    W("XIT007","Etna Bianco DOC Tenuta delle Terre Nere","Sicilia","Italia","Bianco","standard",24.0,"Carricante",12.5,"alta","assenti","medio",1.0,['agrumi', 'erbe vulcaniche', 'mineralità'],['pesce alla griglia', 'frutti di mare', 'pasta con le sarde'],['carne rossa pesante'],"etna-bianco-terre-nere","bianco_nord"),
    W("XIT008","Vermentino di Gallura DOCG Superiore Capichera","Sardegna","Italia","Bianco","standard",20.0,"Vermentino",13.5,"alta","assenti","medio",1.0,['macchia mediterranea', 'agrumi', 'mandorla'],['aragosta alla catalana', 'pesce alla griglia', 'antipasti sardi'],['carne rossa pesante'],"vermentino-gallura-capichera","bianco_nord"),
    W("XIT009","Cannonau di Sardegna DOC Riserva Sella & Mosca","Sardegna","Italia","Rosso","standard",21.5,"Cannonau (Grenache)",14.5,"media","strutturati","pieno",1.0,['frutti rossi maturi', 'spezie', 'erbe sarde'],['porceddu', 'carni alla brace', 'formaggi sardi stagionati'],['pesce crudo'],"cannonau-sardegna-sella-mosca","rosso_toscana"),
    W("XIT010","Lugana DOC Riserva Ca' dei Frati","Lombardia","Italia","Bianco","standard",19.0,"Turbiana (Trebbiano di Lugana)",13.0,"alta","assenti","medio",1.0,['fiori bianchi', 'mandorla', 'agrumi'],['pesce di lago', 'risotto al pesce', 'antipasti lacustri'],['carne rossa pesante'],"lugana-riserva-ca-dei-frati","bianco_nord"),
    W("XIT011","Oltrepò Pavese Pinot Nero DOC Frecciarossa","Oltrepò Pavese","Italia","Rosso","standard",22.0,"Pinot Nero",13.0,"alta","fini","medio",1.0,['ciliegia', 'lampone', 'terra'],['risotto ai funghi', 'carni bianche', 'formaggi freschi'],['piatti molto piccanti'],"oltrepo-pinot-nero-frecciarossa","rosso_piemonte"),
    W("XIT012","Gavi DOCG del Comune di Gavi La Scolca","Piemonte","Italia","Bianco","standard",21.0,"Cortese",12.5,"alta","assenti","leggero-medio",1.0,['agrumi', 'fiori bianchi', 'mandorla'],['antipasti piemontesi', 'pesce di mare', 'crudi di pesce'],['carne rossa pesante'],"gavi-comune-gavi-scolca","bianco_nord"),
    W("XIT013","Dolcetto d'Alba DOC Vietti","Piemonte","Italia","Rosso","economico",14.0,"Dolcetto",13.0,"media","morbidi","medio",1.0,['prugna', 'mandorla amara', 'viola'],['salumi piemontesi', 'pasta al ragù', 'formaggi freschi'],['pesce crudo'],"dolcetto-alba-vietti","rosso_piemonte"),
    W("XIT014","Barbera d'Asti DOCG Superiore Coppo","Piemonte","Italia","Rosso","standard",19.5,"Barbera",14.0,"alta","medi","medio-pieno",1.0,['ciliegia', 'prugna', 'spezie leggere'],['bollito misto', 'agnolotti', 'formaggi piemontesi'],['pesce crudo'],"barbera-asti-superiore-coppo","rosso_piemonte"),
    W("XIT015","Gattinara DOCG Travaglini","Piemonte","Italia","Rosso","premium",32.0,"Nebbiolo (Spanna)",13.5,"alta","fini","pieno",1.0,['viola', 'ciliegia', 'spezie', 'liquirizia'],['brasati', 'selvaggina', 'formaggi piemontesi stagionati'],['pesce crudo'],"gattinara-travaglini","rosso_piemonte"),
    W("XIT016","Vernaccia di San Gimignano DOCG Riserva Panizzi","Toscana","Italia","Bianco","standard",18.5,"Vernaccia",13.5,"alta","assenti","medio",1.0,['agrumi', 'mandorla', 'erbe toscane'],['crostini toscani', 'pesce alla griglia', 'formaggi freschi'],['carne rossa pesante'],"vernaccia-san-gimignano-panizzi","bianco_nord"),
    W("XIT017","Morellino di Scansano DOCG Riserva Le Pupille","Toscana","Italia","Rosso","standard",22.0,"Sangiovese",13.5,"alta","medi","medio-pieno",1.0,['ciliegia', 'erbe mediterranee', 'spezie leggere'],['pappardelle al cinghiale', 'carni alla brace', 'formaggi toscani'],['pesce crudo'],"morellino-scansano-pupille","rosso_toscana"),
    W("XIT018","Chianti Classico DOCG Gran Selezione Fontodi","Toscana","Italia","Rosso","premium",44.0,"Sangiovese",14.0,"alta","strutturati","pieno",1.0,['ciliegia matura', 'tabacco', 'spezie', 'cuoio leggero'],['bistecca alla fiorentina', 'cacciagione', 'formaggi stagionati'],['pesce crudo'],"chianti-classico-gran-selezione-fontodi","rosso_toscana"),
    W("XIT019","Custoza DOC Superiore Cavalchina","Veneto","Italia","Bianco","economico",12.0,"Garganega + Trebbianello",12.0,"media","assenti","leggero",1.0,['fiori bianchi', 'pesca', 'mandorla'],['antipasti veneti', 'pesce di lago', 'risotti leggeri'],['carne rossa pesante'],"custoza-superiore-cavalchina","bianco_nord"),
    W("XIT020","Colli Euganei Fior d'Arancio DOCG Passito","Veneto","Italia","Dolce","standard",22.0,"Moscato Giallo",11.0,"media","assenti","pieno",100.0,["fiori d'arancio", 'albicocca', 'miele'],['dolci secchi', 'crostate', 'formaggi freschi dolci'],['carne', 'pesce'],"euganei-fior-arancio-passito","dolce"),
    W("XIT021","Bianco di Custoza Superiore Le Tende","Veneto","Italia","Bianco","economico",11.5,"Garganega + Trebbiano",12.0,"media","assenti","leggero",1.0,['pesca', 'fiori bianchi', 'mandorla'],['antipasti leggeri', 'pesce di lago', 'risotti'],['carne rossa'],"custoza-le-tende","bianco_nord"),
    W("XIT022","Salice Salentino DOC Riserva Candido","Puglia","Italia","Rosso","economico",13.5,"Negroamaro",13.5,"media","strutturati","medio-pieno",1.0,['mora', 'spezie', 'erbe mediterranee'],['orecchiette alle cime di rapa', 'carni alla griglia', 'formaggi pugliesi'],['pesce crudo'],"salice-salentino-riserva-candido","rosso_toscana"),
    W("XIT023","Primitivo di Manduria DOC Produttori di Manduria","Puglia","Italia","Rosso","standard",16.5,"Primitivo",14.5,"media","morbidi","pieno",1.0,['mora', 'prugna', 'spezie dolci'],['carni alla brace', 'salumi pugliesi', 'formaggi stagionati'],['pesce crudo'],"primitivo-manduria-produttori","rosso_toscana"),
    W("XIT024","Fiano di Avellino DOCG Mastroberardino","Campania","Italia","Bianco","standard",18.0,"Fiano",13.0,"alta","assenti","medio",1.0,['nocciola', 'miele', 'fiori bianchi'],['pasta e fagioli', 'pesce al forno', 'formaggi campani'],['carne rossa pesante'],"fiano-avellino-mastroberardino","bianco_nord"),
    W("XIT025","Greco di Tufo DOCG Feudi di San Gregorio","Campania","Italia","Bianco","standard",19.0,"Greco",13.0,"alta","assenti","medio",1.0,['pesca', 'agrumi', 'mineralità sulfurea'],['frutti di mare', 'pesce al forno', 'antipasti campani'],['carne rossa pesante'],"greco-tufo-feudi","bianco_nord"),
    W("XIT026","Ischia Biancolella DOC Casa D'Ambra","Campania","Italia","Bianco","economico",13.0,"Biancolella",12.5,"media","assenti","leggero",1.0,['agrumi', 'fiori bianchi', 'salinità'],["pesce dell'isola", 'frutti di mare', 'antipasti leggeri'],['carne rossa'],"ischia-biancolella-dambra","bianco_nord"),
    W("XIT027","Nero di Troia DOC Castel del Monte Riserva Rivera","Puglia","Italia","Rosso","standard",21.0,"Nero di Troia",13.5,"alta","strutturati","pieno",1.0,['mora', 'spezie', 'erbe'],['carni alla brace', 'orecchiette al ragù', 'formaggi pugliesi'],['pesce crudo'],"castel-monte-nero-troia-rivera","rosso_toscana"),
    W("XIT028","Passito di Pantelleria DOC Donnafugata Ben Ryé","Sicilia","Italia","Dolce","lusso",65.0,"Zibibbo",14.5,"media","assenti","pieno",130.0,['albicocca secca', 'miele di zagara', 'frutta esotica'],['formaggi erborinati', 'dolci mandorlati', 'cioccolato bianco'],['carne', 'pesce'],"passito-pantelleria-ben-rye","dolce"),
    W("XIT029","Marsala Vergine Riserva Florio","Sicilia","Italia","Dolce","premium",34.0,"Grillo",18.0,"media","assenti","pieno",5.0,['noce', 'caramello', 'frutta secca'],['formaggi stagionati', 'dolci alle mandorle', 'dessert secchi'],['pesce crudo'],"marsala-vergine-florio","dolce"),
    W("XIT030","Grillo Sicilia DOC Planeta","Sicilia","Italia","Bianco","economico",12.5,"Grillo",13.0,"media","assenti","leggero-medio",1.0,['agrumi', 'erbe mediterranee', 'fiori bianchi'],['pasta con le sarde', 'pesce alla griglia', 'antipasti siciliani'],['carne rossa'],"grillo-sicilia-planeta","bianco_nord"),
    W("XIT031","Nerello Mascalese Etna Rosso DOC Graci","Sicilia","Italia","Rosso","standard",26.0,"Nerello Mascalese",13.5,"alta","fini","medio",1.0,['ciliegia', 'erbe vulcaniche', 'affumicato leggero'],['carni bianche', 'pasta alla norma', 'formaggi siciliani'],['pesce crudo delicato'],"etna-rosso-graci","rosso_toscana"),
    W("XIT032","Vermentino Toscana IGT Bolgheri Grattamacco","Toscana","Italia","Bianco","standard",19.5,"Vermentino",13.0,"media","assenti","medio",1.0,['macchia mediterranea', 'agrumi', 'salinità'],['pesce alla griglia', 'antipasti toscani', 'frutti di mare'],['carne rossa pesante'],"vermentino-bolgheri-grattamacco","bianco_nord"),
    W("XIT033","Bolgheri Rosso DOC Le Macchiole","Toscana","Italia","Rosso","premium",42.0,"Cabernet Franc + Merlot + Cabernet Sauvignon",14.0,"media","strutturati","pieno",1.0,['frutti neri', 'erbe mediterranee', 'spezie'],['bistecca', 'carni brasate', 'formaggi toscani stagionati'],['pesce crudo'],"bolgheri-rosso-macchiole","rosso_toscana"),
    W("XIT034","Verdicchio di Matelica DOC Riserva Belisario","Marche","Italia","Bianco","standard",20.0,"Verdicchio",13.5,"alta","assenti","medio",1.0,['mandorla', 'agrumi', 'erbe di collina'],['brodetto di pesce', 'coniglio', 'formaggi marchigiani'],['carne rossa pesante'],"verdicchio-matelica-belisario","bianco_nord"),
    W("XIT035","Lacrima di Morro d'Alba DOC Superiore Marotti Campi","Marche","Italia","Rosso","economico",14.5,"Lacrima",13.0,"media","morbidi","medio",1.5,['rosa', 'frutti rossi', 'spezie'],['salumi marchigiani', 'carni bianche', 'formaggi freschi'],['pesce crudo'],"lacrima-morro-alba-marotti","rosso_toscana"),
    W("XIT036","Cesanese del Piglio DOCG Superiore Coletti Conti","Lazio","Italia","Rosso","standard",23.0,"Cesanese",13.5,"alta","strutturati","medio-pieno",1.0,['ciliegia', 'spezie', 'erbe laziali'],['abbacchio', 'porchetta', 'formaggi laziali'],['pesce crudo'],"cesanese-piglio-coletti","rosso_toscana"),
    W("XIT037","Est! Est!! Est!!! di Montefiascone DOC Falesco","Lazio","Italia","Bianco","economico",10.5,"Trebbiano + Malvasia",12.5,"media","assenti","leggero",1.0,['fiori bianchi', 'pesca', 'mandorla'],['antipasti laziali', 'pesce di lago', 'pizza bianca'],['carne rossa'],"est-est-est-falesco","bianco_nord"),
    W("XIT038","Cirò Bianco DOC Librandi","Calabria","Italia","Bianco","economico",11.5,"Greco Bianco",12.5,"media","assenti","leggero",1.0,['agrumi', 'erbe mediterranee', 'fiori bianchi'],['pesce alla griglia', 'frutti di mare', 'antipasti calabresi'],['carne rossa'],"ciro-bianco-librandi","bianco_nord"),
    W("XIT039","Vulture Rosato IGT Basilicata Elena Fucci","Basilicata","Italia","Rosato","standard",19.0,"Aglianico",13.0,"alta","leggeri","medio",1.0,['ciliegia', 'fragola', 'spezie leggere'],['antipasti lucani', 'pesce alla griglia', 'salumi leggeri'],['dolci'],"vulture-rosato-fucci","rosato"),
    W("XIT040","Terlano DOC Sauvignon Cantina Terlano","Trentino-Alto Adige","Italia","Bianco","premium",31.0,"Sauvignon Blanc",13.5,"alta","assenti","medio",1.0,['frutto della passione', 'erbe di montagna', 'salinità'],['pesce di lago', 'formaggi di malga', 'risotti leggeri'],['carne rossa pesante'],"terlano-sauvignon-cantina","bianco_nord"),
    W("XIT041","Lagrein Alto Adige DOC Cantina Bolzano","Trentino-Alto Adige","Italia","Rosso","standard",21.0,"Lagrein",13.5,"alta","strutturati","pieno",1.0,['mora', 'viola', 'spezie alpine'],['speck e canederli', 'carni bianche', 'formaggi trentini'],['pesce crudo'],"lagrein-alto-adige-bolzano","rosso_piemonte"),
    W("XIT042","Collio Friulano DOC Venica & Venica","Friuli-Venezia Giulia","Italia","Bianco","standard",22.5,"Friulano",13.0,"alta","assenti","medio",1.0,['mandorla', 'pera', 'fiori di campo'],['prosciutto di San Daniele', 'frittata', 'formaggi friulani'],['carne rossa'],"collio-friulano-venica","bianco_nord"),
    W("XIT043","Colli Orientali del Friuli Picolit DOCG","Friuli-Venezia Giulia","Italia","Dolce","lusso",70.0,"Picolit",14.0,"media","assenti","pieno",110.0,['albicocca secca', 'miele', 'fiori appassiti'],['formaggi erborinati', 'dolci secchi', 'dessert alle noci'],['carne', 'pesce'],"colli-orientali-picolit","dolce"),
    W("XIT044","Valpolicella Ripasso DOC Superiore Zenato","Veneto","Italia","Rosso","standard",21.5,"Corvina + Rondinella",13.5,"media","strutturati","pieno",1.0,['ciliegia sotto spirito', 'spezie', 'cioccolato leggero'],['brasati', 'carni alla brace', 'formaggi veneti stagionati'],['pesce crudo'],"valpolicella-ripasso-zenato","rosso_toscana"),
    W("XIT045","Soave Classico DOC Pieropan","Veneto","Italia","Bianco","standard",17.0,"Garganega",12.5,"alta","assenti","leggero-medio",1.0,['mandorla', 'fiori bianchi', 'agrumi'],['baccalà alla vicentina', 'risotti di pesce', 'antipasti veneti'],['carne rossa pesante'],"soave-classico-pieropan","bianco_nord"),
    W("XCN001","Ningxia Marselan He Lan Qing Xue","Ningxia","Asia","Rosso","standard",29.5,"Marselan",14.0,"media","strutturati","pieno",1.0,['mora', 'spezie orientali', 'cioccolato'],['anatra laccata', 'carni rosse speziate', 'formaggi stagionati'],['pesce crudo'],"ningxia-marselan-he-lan","rosso_estero"),
    W("XJP001","Yamanashi Muscat Bailey A Suntory","Yamanashi","Asia","Rosso","economico",16.0,"Muscat Bailey A",12.0,"media","leggeri","leggero-medio",2.0,['fragola', 'frutti rossi', 'erbe delicate'],['cucina giapponese leggera', 'tempura', 'pesce alla griglia'],['carne rossa pesante'],"yamanashi-muscat-bailey-suntory","rosso_toscana"),
    W("XIL001","Golan Heights Yarden Cabernet Sauvignon","Alture del Golan","Asia","Rosso","standard",28.0,"Cabernet Sauvignon",14.0,"media","strutturati","pieno",1.0,['cassis', 'cedro', 'erbe mediterranee'],['carni rosse', 'piatti mediorientali', 'formaggi stagionati'],['pesce crudo'],"golan-heights-yarden-cabernet","rosso_estero"),
    W("XTR001","Cappadocia Öküzgözü Kavaklidere","Cappadocia","Asia","Rosso","economico",15.0,"Öküzgözü",13.0,"media","morbidi","medio",1.0,['ciliegia', 'prugna', 'spezie leggere'],['kebab', 'carni alla griglia', 'formaggi turchi'],['pesce crudo'],"cappadocia-okuzgozu-kavaklidere","rosso_toscana"),
    W("XMA002","Meknès Rosé Gris Boulaouane","Meknès","Africa","Rosato","economico",9.5,"Cinsault",12.0,"media","leggeri","leggero",1.5,['fragola', 'agrumi', 'erbe nordafricane'],['cous cous', 'tajine leggero', 'antipasti'],['carne rossa importante'],"meknes-rose-boulaouane","rosato"),
    W("XEG001","Nil Delta Obeidy Kouroum","Delta del Nilo","Africa","Bianco","economico",10.0,"Obeidy",12.5,"media","assenti","leggero",1.5,['agrumi', 'fiori bianchi', 'erbe'],['pesce del Nilo', 'antipasti leggeri', 'cucina egiziana'],['carne rossa'],"nil-delta-obeidy-kouroum","bianco_nord"),
    W("XHR001","Istria Malvazija Kozlović","Istria","Europa","Bianco","standard",19.5,"Malvazija Istarska",13.0,"alta","assenti","medio",1.0,['mela verde', 'fiori bianchi', 'erbe adriatiche'],['pesce adriatico', 'frutti di mare', 'antipasti istriani'],['carne rossa pesante'],"istria-malvazija-kozlovic","bianco_estero"),
    W("XSI002","Vipava Pinela Movia","Vipava","Europa","Bianco","premium",33.0,"Pinela",12.5,"alta","assenti","medio",1.0,['erbe alpine', 'agrumi', 'mineralità'],['formaggi sloveni', 'pesce di fiume', 'antipasti leggeri'],['carne rossa pesante'],"vipava-pinela-movia","bianco_estero"),
    W("XCH001","Vaud Chasselas Domaine Henri Cruchon","Vaud","Europa","Bianco","standard",23.0,"Chasselas",12.0,"media","assenti","leggero",1.0,['fiori bianchi', 'mela', 'mineralità di lago'],['fondue leggera', 'pesce di lago', 'formaggi svizzeri'],['carne rossa pesante'],"vaud-chasselas-cruchon","bianco_nord"),
    W("XUK001","Kent Sparkling Chapel Down","Kent","Europa","Spumante","standard",29.0,"Chardonnay + Pinot Noir + Pinot Meunier",12.0,"alta","assenti","leggero-medio",3.0,['mela verde', 'agrumi', 'crosta di pane'],['aperitivo', 'frutti di mare', 'pesce leggero'],['carne rossa pesante'],"kent-sparkling-chapel-down","spumante"),
    W("XRO001","Dealu Mare Fetească Neagră Davino","Dealu Mare","Europa","Rosso","standard",20.0,"Fetească Neagră",14.0,"media","strutturati","pieno",1.0,['mora', 'spezie', 'tabacco leggero'],['carni alla brace', 'stufati', 'formaggi stagionati'],['pesce crudo'],"dealu-mare-feteasca-davino","rosso_estero"),
    W("XBG001","Thracian Valley Mavrud Villa Melnik","Valle Tracia","Europa","Rosso","standard",18.5,"Mavrud",14.0,"alta","potenti","pieno",1.0,['mora', 'spezie scure', 'cuoio leggero'],['carni brasate', 'stufati balcanici', 'formaggi stagionati'],['pesce crudo'],"thracian-mavrud-melnik","rosso_estero"),
    W("XLU001","Moselle Luxembourgeoise Riesling Domaine Alice Hartmann","Moselle Lussemburghese","Europa","Bianco","standard",20.5,"Riesling",12.0,"alta","assenti","leggero",3.0,['agrumi', 'mela verde', 'mineralità'],['pesce di fiume', 'formaggi freschi', 'antipasti leggeri'],['carne rossa pesante'],"moselle-lux-riesling-hartmann","bianco_estero"),

    # ── 30 nuove etichette aggiuntive (espansione manuale, agosto 2026) ──
    W("AI001","Barbaresco DOCG Riserva Produttori del Barbaresco","Piemonte","Italia","Rosso","premium",49,"Nebbiolo",14.0,"alta","fini","pieno",1.0,["rosa appassita","catrame","frutti rossi","spezie"],["brasato al Barolo","tajarin al tartufo","formaggi stagionati"],["pesce","dolci molto zuccherini"],"barbaresco-riserva-produttori","rosso_piemonte"),
    W("AI002","Gavi di Gavi DOCG Villa Sparina","Piemonte","Italia","Bianco","standard",18,"Cortese",12.5,"alta","assenti","leggero-medio",1.2,["agrumi","fiori bianchi","mandorla"],["antipasti di pesce","risotto al limone","crudi di mare"],["carne rossa","selvaggina"],"gavi-di-gavi-sparina","bianco_nord"),
    W("AI003","Franciacorta DOCG Extra Brut Bellavista","Lombardia","Italia","Spumante","premium",39,"Chardonnay + Pinot Nero",12.5,"altissima","assenti","medio",4.0,["crosta di pane","agrumi","frutta secca"],["aperitivo","risotto agli agrumi","pesce crudo"],["carne rossa pesante","piatti molto piccanti"],"franciacorta-extrabrut-bellavista","spumante"),
    W("AI004","Bardolino Chiaretto DOC Le Fraghe","Veneto","Italia","Rosato","economico",13,"Corvina + Rondinella",12.0,"media","leggeri","leggero",2.0,["fragola","ciliegia","erbe fresche"],["aperitivo estivo","pesce alla griglia","salumi leggeri"],["carne rossa strutturata","selvaggina"],"bardolino-chiaretto-fraghe","rosato"),
    W("AI005","Amarone della Valpolicella DOCG Classico Tommasi","Veneto","Italia","Rosso","lusso",68,"Corvina + Rondinella + Molinara",15.5,"media","potenti","pieno",4.0,["prugna disidratata","cioccolato","spezie scure","amarena"],["brasato d'asino","risotto all'Amarone","formaggi molto stagionati"],["pesce","insalate leggere"],"amarone-classico-tommasi","rosso_veneto"),
    W("AI006","Soave Classico DOC Pieropan","Veneto","Italia","Bianco","standard",17,"Garganega",12.5,"alta","assenti","leggero-medio",1.4,["mandorla","fiori bianchi","erbe di collina"],["baccalà alla vicentina","risotto ai funghi","formaggi freschi"],["carne rossa pesante","dolci molto dolci"],"soave-classico-pieropan","bianco_nord"),
    W("AI007","Lambrusco di Sorbara DOC Secco Cleto Chiarli","Emilia-Romagna","Italia","Rosato","economico",10,"Lambrusco di Sorbara",11.0,"alta","leggeri","leggero",3.0,["lampone","violetta","crosta di pane"],["salumi emiliani","tortellini in brodo","gnocco fritto"],["pesce delicato","dolci"],"lambrusco-sorbara-chiarli","rosato"),
    W("AI008","Sangiovese di Romagna DOC Superiore San Patrignano","Emilia-Romagna","Italia","Rosso","standard",16,"Sangiovese",13.5,"media","medi","medio",1.0,["ciliegia","viola","erbe aromatiche"],["piadina romagnola","passatelli in brodo","salumi"],["pesce crudo","crostacei"],"sangiovese-romagna-san-patrignano","rosso_toscana"),
    W("AI009","Chianti Classico DOCG Gran Selezione Fontodi","Toscana","Italia","Rosso","lusso",65,"Sangiovese",14.0,"alta","strutturati","pieno",0.9,["ciliegia matura","cuoio","spezie","tabacco"],["bistecca alla fiorentina","cinghiale in umido","pecorino toscano"],["pesce","piatti molto delicati"],"chianti-gran-selezione-fontodi","rosso_toscana"),
    W("AI010","Vernaccia di San Gimignano DOCG Panizzi","Toscana","Italia","Bianco","standard",19,"Vernaccia",13.0,"media","assenti","medio",1.3,["agrumi","erbe di campo","mandorla"],["pappardelle al cinghiale leggero","pesce di lago","crostini toscani"],["carne rossa","selvaggina"],"vernaccia-san-gimignano-panizzi","bianco_nord"),
    W("AI011","Vin Santo del Chianti DOC Riserva Isole e Olena","Toscana","Italia","Dolce","lusso",72,"Trebbiano + Malvasia",15.5,"media","assenti","pieno",120.0,["albicocca secca","miele","frutta candita","noci"],["cantucci","formaggi erborinati","dessert secchi"],["piatti salati sapidi","pesce"],"vinsanto-isole-olena","dolce"),
    W("AI012","Rosato di Bolgheri DOC Le Macchiole","Toscana","Italia","Rosato","premium",34,"Syrah + Cabernet Franc",13.0,"media","leggeri","medio",1.5,["pesca","fragola","erbe mediterranee"],["pesce alla griglia","panzanella","salumi toscani"],["carne rossa pesante","cioccolato"],"rosato-bolgheri-macchiole","rosato"),
    W("AI013","Vermentino di Gallura DOCG Superiore Capichera","Sardegna","Italia","Bianco","premium",28,"Vermentino",13.5,"alta","assenti","medio",1.5,["macchia mediterranea","agrumi","erbe aromatiche"],["aragosta alla catalana","pesce alla griglia","bottarga"],["carne rossa","selvaggina"],"vermentino-gallura-capichera","bianco_nord"),
    W("AI014","Primitivo di Manduria DOC Riserva San Marzano","Puglia","Italia","Rosso","standard",22,"Primitivo",15.0,"media","morbidi","pieno",1.5,["mora","confettura di prugna","spezie dolci"],["orecchiette alle cime di rapa con salsiccia","carni alla brace","formaggi stagionati"],["pesce delicato","crudi"],"primitivo-manduria-san-marzano","rosso_toscana"),
    W("AI015","Salice Salentino DOC Riserva Rosso Leone de Castris","Puglia","Italia","Rosso","economico",14,"Negroamaro",13.5,"media","medi","medio-pieno",1.0,["ciliegia scura","erbe mediterranee","spezie leggere"],["taralli pugliesi","carne alla griglia","formaggi pugliesi"],["pesce crudo","dolci"],"salice-salentino-de-castris","rosso_toscana"),
    W("AI016","Alta Langa DOCG Metodo Classico Enrico Serafino","Piemonte","Italia","Spumante","premium",36,"Pinot Nero + Chardonnay",12.5,"alta","assenti","medio",3.0,["crosta di pane","agrumi","frutti rossi"],["vitello tonnato","aperitivo raffinato","pesce di lago"],["carne rossa pesante","dolci molto zuccherini"],"altalanga-enrico-serafino","spumante"),
    W("AI017","Ribera del Duero DO Crianza Emilio Moro","Castiglia e León","Spagna","Rosso","premium",30,"Tempranillo",14.5,"media","strutturati","pieno",0.8,["frutti neri","vaniglia","tabacco leggero"],["cordero asado","carne alla brace","formaggi stagionati spagnoli"],["pesce delicato","crudi"],"ribera-duero-emilio-moro","rosso_toscana"),
    W("AI018","Rioja DOCa Reserva Marqués de Riscal","La Rioja","Spagna","Rosso","standard",24,"Tempranillo",13.5,"media","medi","medio-pieno",1.0,["ciliegia","vaniglia","cuoio leggero"],["jamón ibérico","tapas di carne","formaggi stagionati"],["pesce crudo","dolci"],"rioja-reserva-marques-riscal","rosso_toscana"),
    W("AI019","Rías Baixas DO Albariño Pazo de Señorans","Galizia","Spagna","Bianco","standard",21,"Albariño",12.5,"alta","assenti","leggero-medio",1.4,["pesca bianca","agrumi","salsedine"],["frutti di mare","pulpo a la gallega","pesce alla griglia"],["carne rossa","selvaggina"],"rias-baixas-pazo-senorans","bianco_nord"),
    W("AI020","Vinho Verde DOC Alvarinho Soalheiro","Minho","Portogallo","Bianco","economico",13,"Alvarinho",11.5,"alta","assenti","leggero",1.8,["lime","fiori bianchi","leggera effervescenza"],["bacalhau à brás","frutti di mare","antipasti leggeri"],["carne rossa","piatti molto piccanti"],"vinho-verde-soalheiro","bianco_nord"),
    W("AI021","Douro DOC Tinto Reserva Quinta do Crasto","Douro","Portogallo","Rosso","standard",23,"Touriga Nacional + Touriga Franca",14.0,"media","strutturati","pieno",0.9,["frutti scuri","violetta","spezie"],["cozido à portuguesa","carne alla brace","formaggi da pecora"],["pesce delicato","crudi"],"douro-reserva-crasto","rosso_toscana"),
    W("AI022","Mosel Riesling Kabinett Dr. Loosen","Mosella","Germania","Bianco","standard",19,"Riesling",8.5,"altissima","assenti","leggero",35.0,["pesca","lime","fiori bianchi"],["cucina asiatica speziata","formaggi di capra","frutti di mare"],["carne rossa pesante","piatti molto salati"],"mosel-riesling-kabinett-loosen","bianco_nord"),
    W("AI023","Wachau Grüner Veltliner Smaragd F.X. Pichler","Bassa Austria","Austria","Bianco","premium",37,"Grüner Veltliner",13.5,"media","assenti","medio-pieno",1.2,["pepe bianco","mela verde","erbe di campo"],["wiener schnitzel","asparagi","formaggi alpini"],["carne rossa pesante","dolci molto dolci"],"wachau-gruner-pichler","bianco_nord"),
    W("AI024","Willamette Valley Pinot Noir Domaine Drouhin","Oregon","Americhe",'Rosso',"premium",42,"Pinot Nero",13.5,"alta","fini","medio",0.6,["ciliegia","lampone","sottobosco"],["salmone alla griglia","anatra","funghi selvatici"],["pesce fritto","piatti molto piccanti"],"willamette-pinot-drouhin","rosso_veneto"),
    W("AI025","Paso Robles Zinfandel Old Vine Ridge Vineyards","California","Americhe","Rosso","standard",29,"Zinfandel",15.0,"media","morbidi","pieno",1.2,["mora","pepe nero","confettura"],["costine BBQ","carne alla griglia speziata","formaggi stagionati"],["pesce delicato","crudi"],"paso-robles-zinfandel-ridge","rosso_toscana"),
    W("AI026","Mendoza Torrontés Alta Vista","Mendoza","Sud America","Bianco","economico",14,"Torrontés",12.5,"media","assenti","leggero-medio",2.0,["fiori bianchi","litchi","agrumi"],["empanadas","ceviche","cucina speziata sudamericana"],["carne rossa pesante","cioccolato"],"mendoza-torrontes-alta-vista","bianco_nord"),
    W("AI027","Elqui Valley Syrah De Martino","Valle dell'Elqui","Sud America","Rosso","standard",21,"Syrah",14.0,"media","strutturati","pieno",0.8,["mora","pepe nero","erbe di montagna"],["carne alla griglia","empanadas di carne","formaggi stagionati"],["pesce crudo","dolci"],"elqui-syrah-de-martino","rosso_toscana"),
    W("AI028","Hunter Valley Semillon Tyrrell's Vat 1","Nuovo Galles del Sud","Oceania","Bianco","premium",33,"Sémillon",11.0,"alta","assenti","leggero",1.5,["limone","erba fresca","miele leggero d'invecchiamento"],["ostriche","sushi","formaggi freschi"],["carne rossa pesante","piatti molto piccanti"],"hunter-semillon-tyrrells","bianco_nord"),
    W("AI029","Swartland Chenin Blanc Old Vine Mullineux","Western Cape","Africa","Bianco","premium",31,"Chenin Blanc",13.0,"alta","assenti","medio-pieno",1.4,["mela cotogna","cera d'api","agrumi"],["pesce al curry leggero","pollo speziato","formaggi semi-stagionati"],["carne rossa pesante","dolci molto dolci"],"swartland-chenin-mullineux","bianco_nord"),
    W("AI030","Kakheti Saperavi Qvevri Pheasant's Tears","Kakheti","Asia","Rosso","standard",26,"Saperavi",13.0,"alta","potenti","pieno",1.0,["prugna","terra","spezie orientali","tè nero"],["khinkali","carne alla griglia georgiana","formaggi stagionati"],["pesce delicato","dolci"],"kakheti-saperavi-pheasants-tears","rosso_toscana"),
]

# ─────────────────────────────────────────────
# WINE LAB AI — CUSTOMIZZAZIONI PERSISTENTI DEL CATALOGO
# Le tabelle qui sotto memorizzano su SQLite le modifiche che lo staff
# applica al catalogo tramite i "Comandi AI" dello Wine Lab (aggiunta di
# nuovi vini, modifiche a un vino esistente, vini nascosti). Vengono
# fuse in memoria su WINE_CATALOG a ogni avvio/rerun dello script, così
# le modifiche restano visibili anche dopo un riavvio dell'app.
# ─────────────────────────────────────────────
def _ensure_lab_tables():
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS custom_wines (
        wine_id TEXT PRIMARY KEY, data_json TEXT, created_at TEXT)""")
    c.execute("""CREATE TABLE IF NOT EXISTS wine_edits (
        wine_id TEXT PRIMARY KEY, edits_json TEXT, updated_at TEXT)""")
    c.execute("""CREATE TABLE IF NOT EXISTS wine_hidden (
        wine_id TEXT PRIMARY KEY, hidden_at TEXT)""")
    c.execute("""CREATE TABLE IF NOT EXISTS ai_lab_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT, richiesta TEXT, azione_json TEXT,
        esito TEXT, created_at TEXT)""")
    conn.commit(); conn.close()

def _apply_catalog_customizations():
    _ensure_lab_tables()
    conn = sqlite3.connect(DB_PATH); c = conn.cursor()

    c.execute("SELECT wine_id FROM wine_hidden")
    hidden_ids = {r[0] for r in c.fetchall()}
    if hidden_ids:
        WINE_CATALOG[:] = [w for w in WINE_CATALOG if w["id"] not in hidden_ids]

    c.execute("SELECT wine_id, edits_json FROM wine_edits")
    edits_map = {r[0]: json.loads(r[1]) for r in c.fetchall()}
    if edits_map:
        for w in WINE_CATALOG:
            if w["id"] in edits_map:
                w.update(edits_map[w["id"]])

    c.execute("SELECT wine_id, data_json FROM custom_wines ORDER BY created_at ASC")
    existing_ids = {w["id"] for w in WINE_CATALOG}
    for wid, data_json in c.fetchall():
        if wid not in existing_ids and wid not in hidden_ids:
            wdata = json.loads(data_json)
            wdata["foto"] = bottle_svg_data_uri(wdata.get("tipo", "Rosso"))
            WINE_CATALOG.append(wdata)
            existing_ids.add(wid)

    conn.close()

_apply_catalog_customizations()

# ─────────────────────────────────────────────
# SYSTEM PROMPT AI (ottimizzato per velocità)
# ─────────────────────────────────────────────
SYSTEM_PROMPT_DIVINO = """Sei il Motore Chimico di Bwine — abbinamento cibo-vino basato su CHIMICA MOLECOLARE
ed enologia sensoriale rigorosa. NON usare regole empiriche generiche ("rosso con carne, bianco con
pesce"): ragiona sempre a livello di composti, reazioni e interazioni fisico-chimiche misurabili tra
la matrice del piatto e la composizione chimica del vino.

ANALISI DEL PIATTO — identifica per ciascun ingrediente/preparazione:
• Lipidi (saturi vs insaturi; burro/panna vs olio EVO vs grassi di pesce ricchi di omega-3)
• Proteine e loro stato (crude, cotte, affumicate, fermentate) e apporto di umami (glutammato, inosinato, guanilato)
• Acidi organici prevalenti (citrico, malico, acetico, lattico) e pH stimato del piatto
• Composti volatili aromatici: esteri (fruttato), aldeidi (verde/erbaceo), pirazine (vegetale/peperone),
  composti solforati/tiolici (agliacei, marini), prodotti di Maillard/caramellizzazione (tostato, crosta)
• Capsaicinoidi (piccantezza) e loro concentrazione relativa
• Sale e la sua interazione con astringenza e acidità
• Tendenza dolce (zuccheri residui o percepiti da cottura/riduzione)
• Temperatura di servizio prevista del piatto

PRINCIPI CHIMICI DI ABBINAMENTO (applica quelli pertinenti al piatto, cita i composti coinvolti):
• EMULSIONE LIPIDICA: l'acidità del vino (acido tartarico/malico) disgrega le micelle lipidiche e
  rimuove il film di grasso dalle papille → sensazione di pulizia palatale; la CO₂ degli spumanti ha
  effetto meccanico simile, aumentato dalla pressione delle bollicine sulla mucosa.
• TANNINI-PROTEINE (astringenza): i tannini (proantocianidine) precipitano le glicoproteine salivari
  ricche di prolina (PRP); su proteine animali cotte e ben strutturate (collagene denaturato, grasso
  intramuscolare) l'effetto è ammorbidito e percepito come "vellutato"; su proteine crude o pesce
  (poca struttura fibrosa, alto contenuto di ferro/mioglobina in forma non ossidata) i tannini reagiscono
  con i lipidi omega-3 ossidati generando note metalliche e amare sgradevoli — evitare rossi tannici con
  crudi e pesce grasso.
• CAPSAICINA E TRPV1: l'etanolo è un potente solvente dei capsaicinoidi e ne amplifica la percezione
  piccante attivando il recettore TRPV1 (quindi evitare vini con alcol elevato, >13.5%, su piatti molto
  piccanti); zuccheri residui >5 g/L attenuano la piccantezza per competizione recettoriale e desensibilizzazione
  transitoria; la bassa tannicità evita di sommare astringenza a bruciore.
• EQUILIBRIO ACIDO-ACIDO: un piatto acido (agrumi, aceto, pomodoro crudo) richiede un vino con acidità
  totale pari o superiore, altrimenti il vino risulta piatto e "sfaldato" al palato (fenomeno di
  soppressione dell'acidità percepita per contrasto).
• UMAMI E SINERGIA GLUTAMMATO-NUCLEOTIDI: alimenti ricchi di umami (brodi, formaggi stagionati, funghi,
  pomodoro cotto, salumi) amplificano la percezione di amaro e astringenza nei vini tannici (effetto
  dimostrato sui recettori T1R1/T1R3) — preferire vini a bassa tannicità, buona acidità e/o componente
  minerale/salina che dialoga con il glutammato.
• MINERALITÀ E COMPONENTE IODICA/MARINA: pesce e frutti di mare ricchi di composti solforati volatili
  (dimetilsolfuro, trimetilammina) si abbinano a vini con acidità elevata, note di riduzione minerale
  (pietra focaia, gesso) o rifermentazione in bottiglia (autolisi dei lieviti, note di crosta di pane)
  che mascherano/bilanciano le note "di mare"; il pesce grasso (tonno, salmone, sgombro) tollera anche
  rossi leggeri a bassissimo tannino e temperatura di servizio fresca (12-14°C).
• REAZIONI DI MAILLARD E AROMI TOSTATI: piatti con crosta bruna, grigliatura o affumicatura sviluppano
  pirazine e furani tostati che trovano affinità aromatica diretta (non solo strutturale) con vini
  affinati in legno o con macerazione prolungata (stesse famiglie di composti: vanillina, guaiacolo,
  furfurale) — cerca corrispondenza tra il profilo aromatico del vino e queste note pirogeniche.
• DOLCE-DOLCE E CONTRASTO: con i dessert il residuo zuccherino del vino deve essere pari o superiore
  a quello del piatto, altrimenti il vino risulta acido e magro per contrasto; la componente acida del
  vino dolce (es. Sauternes, Passiti, Recioto) bilancia la percezione di stucchevolezza data dagli zuccheri.
• SPEZIE E COMPOSTI TERPENICI: piatti con spezie aromatiche (curcuma, coriandolo, cardamomo) trovano
  corrispondenza diretta in vini con profilo terpenico marcato (linalolo, geraniolo — tipico di
  Gewürztraminer, Moscato, Riesling) per affinità molecolare, non solo per "esotismo" generico.

SCORING per ogni vino (0-100): interazioni chimiche primarie 40pt, corrispondenza/contrasto aromatico
25pt, coerenza di struttura (corpo, tannino, alcol, acidità rispetto al piatto) 20pt, assenza di
conflitti chimici noti (es. tannino su crudo, alcol alto su piccante) 15pt.
INCLUDI tutti i vini con score ≥55. Se nessuno supera 55, includi comunque i TOP 3 con lo score più alto
(anche se basso), spiegando i limiti dell'abbinamento: MAI restituire abbinamenti vuoti.

CAMPI OBBLIGATORI per ogni abbinamento (linguaggio tecnico ma comprensibile, sempre nominando i
composti/meccanismi coinvolti, non descrizioni generiche):
- meccanismo_chimico: 2 frasi sulle reazioni chimiche specifiche tra i composti del piatto e quelli
  del vino (nomina acidi, tannini, esteri, zuccheri, composti solforati, ecc. per nome)
- sensazione_in_bocca: 1 frase descrittiva e sensoriale su cosa si percepisce assaggiando insieme
- perche_funziona: 1 frase di sintesi sul principio chimico-sensoriale dominante
- consigli_culinari: 1-2 frasi su come preparare/servire il piatto per esaltare l'abbinamento
  (temperatura di servizio del vino, punto di cottura, ingredienti/condimenti da aggiungere o togliere)
- chimica_in_bocca: 1-2 frasi su cosa accade chimicamente quando si beve il vino subito dopo aver
  masticato il piatto (interazione con la saliva, precipitazione tannino-proteine, effetto detergente
  dell'acidità o della CO₂, persistenza retro-olfattiva)
- irc: oggetto con i QUATTRO sotto-punteggi che compongono lo score totale (devono sommare
  esattamente allo "score" del vino): {"chimica":0-40 (interazioni chimiche primarie),
  "aromatico":0-25 (corrispondenza/contrasto aromatico), "struttura":0-20 (coerenza di corpo,
  tannino, alcol, acidità), "pulizia":0-15 (assenza di conflitti chimici noti)}. Questo è
  l'"Indice di Reattività Chimica Bwine" (IRC), il punteggio proprietario mostrato all'utente.

OUTPUT — JSON PURO, ZERO TESTO FUORI:
{"analisi_piatto":{"ingredienti_identificati":[],"grassi":"","proteine":"","acidi":"","volatili_aromatici":[],"piccantezza":"","umami":"","tendenza_dolce":"","complessita":"","sfida_abbinamento":""},"abbinamenti":[{"wine_id":"","score":0,"principio":"","interazione_primaria":"","meccanismo_chimico":"2 frasi max","sensazione_in_bocca":"1 frase","molecole_protagoniste":[],"perche_funziona":"1 frase","consigli_culinari":"1-2 frasi","chimica_in_bocca":"1-2 frasi","irc":{"chimica":0,"aromatico":0,"struttura":0,"pulizia":0}}],"consiglio_divino":"3 righe max"}"""

# ─────────────────────────────────────────────
# SYSTEM PROMPT — CONSIGLI CULINARI (dal vino al piatto)
# ─────────────────────────────────────────────
# Direzione opposta rispetto al motore principale: qui l'utente parte da un vino
# già scelto (es. una bottiglia che ha in cantina) e chiede consigli su come
# abbinarlo o modificare un piatto/ingrediente. Riusa la stessa competenza
# chimica del motore Bwine, ma la risposta è testo discorsivo, non JSON,
# pensata per essere letta velocemente in cucina.
SYSTEM_PROMPT_CULINARY = """Sei il sommelier-chef di Bwine. Ti viene indicato UN VINO specifico (con le sue
caratteristiche chimico-sensoriali) e una domanda pratica su un piatto, un ingrediente o una
variante di ricetta. Il tuo compito è dare consigli culinari CONCRETI, brevi e facilmente
applicabili in cucina, spiegando anche (in modo semplice, non accademico) perché funzionano dal
punto di vista chimico — stessa logica del motore Bwine (acidità, tannini, grassi, umami,
Maillard, ecc.), ma senza gergo tecnico eccessivo.

STRUTTURA DELLA RISPOSTA (testo semplice con markdown leggero, MASSIMO 180 parole):
1. Risposta diretta alla domanda (1-2 frasi)
2. 2-4 consigli pratici puntati: dosi/ingredienti da aggiungere o togliere, punto di cottura,
   temperatura di servizio del vino, eventuale alternativa se l'abbinamento è comunque difficile
3. Una frase finale che spiega IL PERCHÉ chimico in modo semplice (es. "perché l'acidità del
   vino pulisce il grasso dei funghi trifolati")

Se l'abbinamento richiesto è oggettivamente difficile con quel vino, dillo onestamente e proponi
la variante minima del piatto che lo rende possibile. Non inventare mai dati nutrizionali precisi.
Rispondi SEMPRE nella lingua indicata esplicitamente all'inizio del messaggio utente (istruzione
"LINGUA OBBLIGATORIA"), anche se la domanda o i dati del vino sono in un'altra lingua."""

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
# AI PAIRING — con ottimizzazioni costi API
# ─────────────────────────────────────────────
# Numero massimo di vini che vengono realmente inviati al modello per ogni richiesta.
# Il catalogo cresce (oggi quasi 300 vini), ma inviarli tutti ogni volta fa lievitare i token
# in ingresso e quindi il costo per chiamata. Qui si fa un campionamento stratificato:
# si prende un numero proporzionato di vini per ogni "tipo" (Rosso/Bianco/...) così
# da mantenere varietà nella risposta senza mandare l'intero catalogo.
MAX_VINI_PER_CHIAMATA_AI = 60

def _campiona_catalogo(catalogo: list, max_n: int = MAX_VINI_PER_CHIAMATA_AI) -> list:
    if len(catalogo) <= max_n:
        return catalogo
    from collections import defaultdict
    per_tipo = defaultdict(list)
    for w in catalogo:
        per_tipo[w["tipo"]].append(w)
    tipi = list(per_tipo.keys())
    quota = max(1, max_n // max(1, len(tipi)))
    campione = []
    for t in tipi:
        campione.extend(per_tipo[t][:quota])
    # Se restano ancora slot liberi (tipi piccoli), riempi con altri vini fino al tetto
    restanti = [w for w in catalogo if w not in campione]
    while len(campione) < max_n and restanti:
        campione.append(restanti.pop(0))
    return campione[:max_n]

def _normalizza_piatto(piatto: str) -> str:
    """Normalizza il testo del piatto (minuscolo, spazi puliti) per aumentare
    la probabilità di 'cache hit' su richieste sostanzialmente identiche
    (es. 'Pollo  al Curry' e 'pollo al curry' diventano la stessa chiave)."""
    return re.sub(r"\s+", " ", piatto.strip().lower())

def _cache_key(piatto_norm: str, filtri_str: str, ids_str: str, lang: str) -> str:
    raw = f"{piatto_norm}|{filtri_str}|{ids_str}|{lang}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()

def _db_cache_get(key: str):
    """Cache persistente su SQLite: sopravvive ai riavvii dell'app (a differenza
    della sola st.cache_data, che si svuota a ogni redeploy) e quindi evita di
    richiamare l'API a pagamento per piatti già analizzati in passato."""
    try:
        conn = sqlite3.connect(DB_PATH); c = conn.cursor()
        c.execute("SELECT risultato FROM ai_cache WHERE cache_key=?", (key,))
        row = c.fetchone()
        if row:
            c.execute("UPDATE ai_cache SET hits = hits + 1 WHERE cache_key=?", (key,))
            conn.commit()
        conn.close()
        return json.loads(row[0]) if row else None
    except Exception:
        return None

def _db_cache_set(key: str, risultato: dict):
    try:
        conn = sqlite3.connect(DB_PATH); c = conn.cursor()
        c.execute("INSERT OR REPLACE INTO ai_cache (cache_key,risultato,created_at,hits) VALUES (?,?,?,0)",
                  (key, json.dumps(risultato, ensure_ascii=False), datetime.now().isoformat()))
        conn.commit(); conn.close()
    except Exception:
        pass

@st.cache_data(ttl=3600, show_spinner=False)
def get_ai_pairing_cached(piatto: str, filtri_str: str, catalogo_json: str, lang: str, cache_key: str) -> dict:
    # 1) Cache di sessione (st.cache_data, in RAM) → già gestita dal decoratore.
    # 2) Cache persistente su disco (sopravvive ai riavvii) → controllata qui.
    cached = _db_cache_get(cache_key)
    if cached is not None:
        return cached

    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        try: api_key = st.secrets.get("ANTHROPIC_API_KEY", "")
        except: pass
    if not api_key:
        return {"error": "API_KEY_MISSING"}

    lang_names = {"it": "italiano", "en": "English", "es": "español"}
    lang_name = lang_names.get(lang, "italiano")
    lang_instruction = (
        f"LINGUA OBBLIGATORIA: scrivi TUTTI i valori testuali del JSON (sfida_abbinamento, "
        f"grassi, proteine, acidi, piccantezza, umami, tendenza_dolce, complessita, principio, "
        f"interazione_primaria, meccanismo_chimico, sensazione_in_bocca, perche_funziona, "
        f"consigli_culinari, chimica_in_bocca, consiglio_divino, ecc.) esclusivamente in {lang_name}, "
        f"a prescindere dalla lingua del piatto o del catalogo in input. Le CHIAVI del JSON restano "
        f"quelle indicate (fisse, sempre in italiano), solo i VALORI testuali vanno in {lang_name}."
    )
    user_message = f"""{lang_instruction}

PIATTO: "{piatto}"
FILTRI: {filtri_str}
CATALOGO:
{catalogo_json}
Analisi molecolare → score chimico → JSON puro.

RICORDA: rispondi in {lang_name}."""

    try:
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",  # modello più economico della famiglia: usalo sempre per questo task
            max_tokens=2000,                    # tetto ai token di output: riduce il costo per chiamata
            # Prompt caching lato Anthropic: il system prompt è statico e piuttosto lungo.
            # Con "cache_control" le chiamate successive (entro pochi minuti) pagano una
            # frazione del costo per la parte cachata invece di ripagarla per intero ogni volta.
            system=[{"type": "text", "text": SYSTEM_PROMPT_DIVINO, "cache_control": {"type": "ephemeral"}}],
            messages=[{"role": "user", "content": user_message}]
        )
        risultato = extract_json_robust(message.content[0].text)
        if "error" not in risultato:
            _db_cache_set(cache_key, risultato)  # salva su disco solo le risposte valide
        return risultato
    except Exception as e:
        return {"error": str(e)}

def get_quick_rule_pairing(piatto: str, catalogo: list) -> dict:
    """Motore di abbinamento a REGOLE, senza alcuna chiamata AI (quindi a costo zero).
    Meno preciso dell'analisi molecolare via AI, ma utile come:
    - alternativa gratuita per piatti semplici/comuni,
    - modalità di fallback se l'API key non è configurata o la quota è esaurita,
    - modo per ridurre il numero di chiamate a pagamento in un locale con tanto traffico.
    Si basa su euristiche di abbinamento cibo-vino classiche (non su analisi chimica)."""
    p = _normalizza_piatto(piatto)

    # Categorie euristiche molto semplificate: parola chiave nel piatto → tipi di vino consigliati
    regole = [
        (["carne rossa","manzo","bistecca","brasato","tagliata","agnello","cinghiale","selvaggina","costata"], ["Rosso"], "medio-pieno/pieno"),
        (["pesce","branzino","orata","salmone","tonno","frutti di mare","cozze","vongole","gamberi","crostacei"], ["Bianco","Spumante"], "leggero/medio"),
        (["formaggio","formaggi","stagionato","pecorino","parmigiano","gorgonzola"], ["Rosso","Dolce"], "medio/pieno"),
        (["pizza"], ["Rosso","Rosato"], "leggero/medio"),
        (["dolce","torta","cioccolato","dessert","crostata","tiramisù"], ["Dolce","Spumante"], "qualsiasi"),
        (["frittura","fritto","frittata"], ["Spumante","Bianco"], "leggero"),
        (["antipasto","aperitivo","salumi"], ["Spumante","Bianco","Rosato"], "leggero/medio"),
    ]
    tipi_suggeriti = []
    for keywords, tipi, _ in regole:
        if any(k in p for k in keywords):
            tipi_suggeriti.extend(tipi)
    if not tipi_suggeriti:
        tipi_suggeriti = ["Rosso", "Bianco"]  # default neutro se non riconosciamo il piatto
    tipi_suggeriti = list(dict.fromkeys(tipi_suggeriti))  # rimuove duplicati mantenendo l'ordine

    candidati = [w for w in catalogo if w["tipo"] in tipi_suggeriti]
    if not candidati:
        candidati = catalogo

    # Punteggio semplice: bonus se una parola del piatto compare tra gli abbinamenti dichiarati del vino
    def punteggio(w):
        s = 60
        for kw in w.get("abbina_bene_con", []):
            if kw.lower() in p or any(word in kw.lower() for word in p.split()):
                s += 15
        return min(s, 90)  # tetto volutamente più basso dell'AI, per non confondersi con l'analisi molecolare vera

    candidati_ord = sorted(candidati, key=punteggio, reverse=True)[:5]
    def irc_stimato(s):
        # Suddivisione proporzionale dello score nelle 4 componenti IRC (40/25/20/15),
        # solo a scopo di visualizzazione: la Modalità Rapida non fa vera analisi chimica.
        return {"chimica": round(s*0.40), "aromatico": round(s*0.25),
                "struttura": round(s*0.20), "pulizia": round(s*0.15)}
    abbinamenti = [{
        "wine_id": w["id"],
        "score": punteggio(w),
        "molecole_protagoniste": [],
        "chimica": "Abbinamento generato con regole rapide (senza AI): tipologia di vino compatibile con la categoria del piatto.",
        "in_bocca": "",
        "perche": f"Il tipo di vino ({w['tipo']}) è tradizionalmente adatto a piatti come '{piatto}'.",
        "avvertenza": "",
        "irc": irc_stimato(punteggio(w)),
    } for w in candidati_ord]

    return {
        "analisi_piatto": {
            "grassi": "n/d", "proteine": "n/d", "acidita": "n/d", "volatili": "n/d",
            "spice": "n/d", "umami": "n/d", "sweetness": "n/d", "complexity": "n/d",
            "ingredienti": [], "sfida_abbinamento": "",
        },
        "abbinamenti": abbinamenti,
        "consiglio_divino": "Abbinamento generato in Modalità Rapida gratuita (euristiche classiche, senza analisi molecolare AI). "
                             "Per un'analisi chimica completa disattiva la Modalità Rapida.",
        "modalita": "rapida_gratuita",
    }


def get_ai_pairing(piatto: str, filtri: dict, catalogo: list) -> dict:
    catalogo_limitato = _campiona_catalogo(catalogo)
    catalogo_ai = json.dumps([
        {"id": v["id"], "nome": v["nome"], "tipo": v["tipo"], "regione": v["regione"],
         "fascia": v["fascia"], "prezzo": v["prezzo"], "uva": v["uva"],
         "alcol": v["alcol"], "acidita": v["acidita"], "tannini": v["tannini"],
         "corpo": v.get("corpo","medio"), "residuo_zuccherino": v["residuo_zuccherino"],
         "profilo_aromatico": v.get("profilo_aromatico", [])[:4],
         "abbina_bene_con": v.get("abbina_bene_con", [])[:3],
         "non_abbina_con": v.get("non_abbina_con", [])[:2]}
        for v in catalogo_limitato
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

    piatto_norm = _normalizza_piatto(piatto)
    ids_str = ",".join(sorted(v["id"] for v in catalogo_limitato))
    cache_key = _cache_key(piatto_norm, filtri_str, ids_str, lang)

    return get_ai_pairing_cached(piatto, filtri_str, catalogo_ai, lang, cache_key)


# ─────────────────────────────────────────────
# CONSIGLI CULINARI — dal vino al piatto (AI, con cache su disco)
# ─────────────────────────────────────────────
def _culinary_cache_key(wine_id: str, domanda_norm: str, lang: str) -> str:
    raw = f"culinary|{wine_id}|{domanda_norm}|{lang}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()

@st.cache_data(ttl=3600, show_spinner=False)
def get_ai_culinary_advice_cached(wine_json: str, domanda: str, lang: str, cache_key: str) -> dict:
    cached = _db_cache_get(cache_key)
    if cached is not None:
        return cached

    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        try: api_key = st.secrets.get("ANTHROPIC_API_KEY", "")
        except Exception: pass
    if not api_key:
        return {"error": "API_KEY_MISSING"}

    lang_names = {"it": "italiano", "en": "English", "es": "español"}
    lang_name = lang_names.get(lang, "italiano")
    lang_instruction = f"LINGUA OBBLIGATORIA: rispondi per intero in {lang_name}, indipendentemente dalla lingua della domanda o dei dati del vino."
    user_message = f"""{lang_instruction}

VINO SCELTO DALL'UTENTE:
{wine_json}
DOMANDA DELL'UTENTE: "{domanda}"

Dai consigli culinari pratici e brevi come da istruzioni. RICORDA: rispondi in {lang_name}."""
    try:
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=500,
            system=[{"type": "text", "text": SYSTEM_PROMPT_CULINARY, "cache_control": {"type": "ephemeral"}}],
            messages=[{"role": "user", "content": user_message}]
        )
        testo = message.content[0].text.strip()
        risultato = {"consiglio": testo}
        _db_cache_set(cache_key, risultato)
        return risultato
    except Exception as e:
        return {"error": str(e)}

def get_ai_culinary_advice(wine: dict, domanda: str) -> dict:
    wine_json = json.dumps({
        "nome": wine["nome"], "tipo": wine["tipo"], "uva": wine["uva"],
        "regione": wine["regione"], "alcol": wine["alcol"], "acidita": wine["acidita"],
        "tannini": wine["tannini"], "corpo": wine.get("corpo","medio"),
        "residuo_zuccherino": wine["residuo_zuccherino"],
        "profilo_aromatico": wine.get("profilo_aromatico", []),
        "abbina_bene_con": wine.get("abbina_bene_con", []),
        "non_abbina_con": wine.get("non_abbina_con", []),
    }, ensure_ascii=False)
    lang = st.session_state.get("lang", "it")
    domanda_norm = _normalizza_piatto(domanda)
    cache_key = _culinary_cache_key(wine["id"], domanda_norm, lang)
    return get_ai_culinary_advice_cached(wine_json, domanda, lang, cache_key)


# ─────────────────────────────────────────────
# WINE LAB — "il piatto diventa modificabile in tempo reale"
# ─────────────────────────────────────────────
# Non inventa un secondo motore: costruisce una versione modificata del piatto
# a partire dagli slider scelti dall'utente e la manda allo stesso motore
# chimico AI (get_ai_pairing) usato nel tab Abbinamento. Il punteggio si
# "ricalcola" quindi con la stessa identica analisi molecolare, solo su un
# piatto leggermente diverso — è il laboratorio del gusto descritto nella
# strategia di prodotto.
def costruisci_piatto_modificato(piatto_base: str, d_acidita: int, d_grassi: int,
                                   d_piccante: int, d_cottura: int,
                                   d_dolcezza: int = 0, d_sale: int = 0,
                                   d_umami: int = 0, d_erbe: int = 0, d_affumicato: int = 0,
                                   ingredienti_aggiunti: Optional[list] = None,
                                   ingredienti_rimossi: Optional[list] = None,
                                   nota_libera: str = "") -> tuple:
    modifiche = []
    if d_acidita > 0:
        modifiche.append("con più acidità (aggiunto succo di limone/aceto)" if d_acidita == 1
                          else "con acidità molto marcata (abbondante limone/aceto/agrumi)")
    elif d_acidita < 0:
        modifiche.append("con meno acidità del solito")
    if d_grassi > 0:
        modifiche.append("con più grassi (aggiunto burro/panna/olio)" if d_grassi == 1
                          else "con grassi molto abbondanti (burro/panna/formaggio grasso in quantità)")
    elif d_grassi < 0:
        modifiche.append("alleggerito, con meno grassi/burro/panna")
    if d_piccante > 0:
        modifiche.append("reso piccante (aggiunto peperoncino)" if d_piccante == 1
                          else "molto piccante (peperoncino abbondante)")
    if d_cottura > 0:
        modifiche.append("con cottura più lunga e rosolatura marcata (più reazioni di Maillard, crosta scura)" if d_cottura == 1
                          else "con cottura molto prolungata e caramellizzazione intensa")
    elif d_cottura < 0:
        modifiche.append("con cottura più breve e leggera (meno rosolatura)")
    if d_dolcezza > 0:
        modifiche.append("reso più dolce (aggiunta di zucchero/miele/frutta matura)" if d_dolcezza == 1
                          else "molto dolce (zucchero/miele/frutta caramellata in abbondanza)")
    elif d_dolcezza < 0:
        modifiche.append("reso meno dolce del solito")
    if d_sale > 0:
        modifiche.append("più sapido/salato (aggiunto sale, colatura di alici o formaggio stagionato)" if d_sale == 1
                          else "molto sapido/salato (sale abbondante, acciughe, capperi, formaggi molto stagionati)")
    if d_umami > 0:
        modifiche.append("con più umami (funghi, parmigiano, salsa di soia o brodo ristretto)" if d_umami == 1
                          else "con umami molto intenso (funghi trifolati, parmigiano stravecchio, salsa di soia, acciughe, brodo ristretto)")
    if d_erbe > 0:
        modifiche.append("arricchito di erbe aromatiche fresche (basilico, prezzemolo, menta)" if d_erbe == 1
                          else "con erbe aromatiche fresche molto abbondanti, dal profilo verde ed erbaceo marcato")
    if d_affumicato > 0:
        modifiche.append("con nota affumicata (grigliato o leggermente affumicato)" if d_affumicato == 1
                          else "molto affumicato (cottura alla brace/griglia, affumicatura intensa)")

    if ingredienti_aggiunti:
        modifiche.append(f"con l'aggiunta di {', '.join(ingredienti_aggiunti)}")
    if ingredienti_rimossi:
        modifiche.append(f"senza {', '.join(ingredienti_rimossi)}")
    if nota_libera and nota_libera.strip():
        modifiche.append(nota_libera.strip())

    if not modifiche:
        return piatto_base, piatto_base
    piatto_mod = f"{piatto_base}, {', '.join(modifiche)}"
    return piatto_mod, ", ".join(modifiche)


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
# ─────────────────────────────────────────────
# CARRELLO & CHECKOUT DEMO (bwine.shop)
# ─────────────────────────────────────────────
def cart_add(wine: dict, qty: int = 1):
    if "cart" not in st.session_state:
        st.session_state.cart = {}
    wid = wine["id"]
    if wid in st.session_state.cart:
        st.session_state.cart[wid]["qty"] += qty
    else:
        st.session_state.cart[wid] = {
            "id": wid, "nome": wine["nome"], "prezzo": wine["prezzo"],
            "tipo": wine["tipo"], "foto": wine.get("foto", ""), "qty": qty,
        }

def cart_remove(wine_id: str):
    if "cart" in st.session_state and wine_id in st.session_state.cart:
        del st.session_state.cart[wine_id]

def cart_total() -> float:
    return sum(it["prezzo"] * it["qty"] for it in st.session_state.get("cart", {}).values())

def cart_count() -> int:
    return sum(it["qty"] for it in st.session_state.get("cart", {}).values())

def genera_order_ref() -> str:
    import random, string
    return "BW-" + "".join(random.choices(string.digits, k=6))

def crea_stripe_checkout_session(items: dict, email: str, order_ref: str):
    """Prova a creare una vera sessione di pagamento Stripe in modalità TEST.
    Richiede una chiave segreta di test (sk_test_...) nei Secrets di Streamlit
    o nella variabile d'ambiente STRIPE_SECRET_KEY. Se la chiave non è
    presente, l'app resta comunque una demo funzionante: il pagamento viene
    solo simulato (vedi 'metodo_pagamento' = 'simulato' nel record ordine)."""
    stripe_key = os.environ.get("STRIPE_SECRET_KEY", "")
    if not stripe_key:
        try: stripe_key = st.secrets.get("STRIPE_SECRET_KEY", "")
        except Exception: pass
    if not stripe_key:
        return None, T("stripe_no_key_msg")
    try:
        import stripe
        stripe.api_key = stripe_key
        line_items = []
        for it in items.values():
            line_items.append({
                "price_data": {
                    "currency": "eur",
                    "product_data": {"name": it["nome"]},
                    "unit_amount": int(round(it["prezzo"] * 100)),
                },
                "quantity": it["qty"],
            })
        session = stripe.checkout.Session.create(
            mode="payment",
            payment_method_types=["card"],
            line_items=line_items,
            customer_email=email or None,
            client_reference_id=order_ref,
            success_url=f"https://{SHOP_DOMAIN}/ordine-confermato?ref={order_ref}",
            cancel_url=f"https://{SHOP_DOMAIN}/carrello",
        )
        return session, None
    except Exception as e:
        return None, f"Stripe non disponibile in questo ambiente ({e}); uso il pagamento simulato."

@st.fragment
def render_cart_and_checkout(user_id: Optional[int], user_email: str = "", user_profile: Optional[dict] = None):
    st.markdown(f"### 🛒 {T('nav_cart')[2:] if T('nav_cart')[:1]=='🛒' else T('nav_cart')} — {SHOP_DOMAIN}")

    # Come funziona in 3 passaggi: reso il più semplice e chiaro possibile,
    # visibile subito sia col carrello vuoto sia con articoli dentro.
    s1, s2, s3 = st.columns(3)
    with s1:
        st.markdown(T("cart_step1_t"))
        st.caption(T("cart_step1_d"))
    with s2:
        st.markdown(T("cart_step2_t"))
        st.caption(T("cart_step2_d"))
    with s3:
        st.markdown(T("cart_step3_t"))
        st.caption(T("cart_step3_d"))
    st.caption(T("cart_trust"))
    st.markdown("---")

    cart = st.session_state.get("cart", {})
    if not cart:
        st.info(T("cart_empty"))
        return

    tot = 0.0
    for wid, it in list(cart.items()):
        c1, c2, c3, c4, c5 = st.columns([0.8, 3, 1, 1.2, 0.8])
        with c1:
            if it.get("foto"): st.image(it["foto"], width=45)
        with c2:
            st.markdown(f"**{it['nome']}**  \n<span style='color:#888;font-size:0.8em'>{it['tipo']}</span>", unsafe_allow_html=True)
        with c3:
            new_qty = st.number_input(T("cart_qty"), min_value=1, max_value=24, value=it["qty"], key=f"qty_{wid}", label_visibility="collapsed")
            if new_qty != it["qty"]:
                st.session_state.cart[wid]["qty"] = new_qty
                # scope="app": la quantità cambia anche il numero mostrato nel
                # badge del tab "🛒 Carrello (N)", che vive fuori da questo
                # fragment — serve un rerun completo perché si aggiorni subito.
                st.rerun(scope="app")
        with c4:
            riga_tot = it["prezzo"] * it["qty"]
            tot += riga_tot
            st.markdown(f"**{riga_tot:.2f}€**")
        with c5:
            if st.button("🗑️", key=f"rm_{wid}"):
                cart_remove(wid)
                st.rerun(scope="app")

    spedizione = 0.0 if tot >= 60 else 6.90
    totale_finale = tot + spedizione
    st.markdown("---")
    cs1, cs2 = st.columns(2)
    with cs1:
        st.caption(T("cart_subtotal", tot))
        st.caption(T("cart_shipping", T("cart_free") if spedizione == 0 else f"{spedizione:.2f}€"))
    with cs2:
        st.markdown(T("cart_total", totale_finale))

    st.markdown(T("cart_ship_title"))
    st.caption(T("cart_demo_caption"))
    up = user_profile or {}
    with st.form("checkout_form"):
        col_a, col_b = st.columns(2)
        with col_a:
            nome_cliente = st.text_input(T("cart_f_name"), value=up.get("nome", ""))
            email_ck = st.text_input(T("cart_f_email"), value=user_email)
            indirizzo = st.text_input(T("cart_f_address"), value=up.get("indirizzo", ""))
        with col_b:
            citta_ck = st.text_input(T("cart_f_city"), value=up.get("citta", ""))
            cap_ck = st.text_input(T("cart_f_zip"), value=up.get("cap", ""))
            metodo = st.selectbox(T("cart_f_method"), T("cart_method_opts"))
        conferma = st.checkbox(T("cart_age_confirm"))
        paga = st.form_submit_button(T("cart_pay_btn", totale_finale), type="primary", use_container_width=True)

    if paga:
        if not (nome_cliente and email_ck and "@" in email_ck and indirizzo and citta_ck and cap_ck):
            st.warning(T("cart_warn_fields"))
        elif not conferma:
            st.warning(T("cart_warn_age"))
        else:
            order_ref = genera_order_ref()
            session, msg = (None, None)
            if metodo.startswith("💳"):
                session, msg = crea_stripe_checkout_session(cart, email_ck, order_ref)
            if session is not None:
                save_order(order_ref, user_id, nome_cliente, email_ck, indirizzo, citta_ck, cap_ck,
                           list(cart.values()), totale_finale, "stripe_test", "in_attesa", session.id)
                st.success(T("cart_stripe_created", order_ref))
                st.link_button(T("cart_stripe_go"), session.url, type="primary", use_container_width=True)
            else:
                # Pagamento simulato: nessuna chiave Stripe configurata in questo ambiente demo
                save_order(order_ref, user_id, nome_cliente, email_ck, indirizzo, citta_ck, cap_ck,
                           list(cart.values()), totale_finale, "simulato", "pagato")
                if msg: st.caption(f"ℹ️ {msg}")
                st.balloons()
                st.success(T("cart_sim_ok", order_ref, totale_finale, email_ck))
                st.session_state.cart = {}


@st.fragment
def render_wine_card(wine: dict, abb: dict, piatto: str, user_id: Optional[int], idx: int):
    score_ai = abb.get("score", 0)
    # Calibrazione da feedback reali: se ci sono almeno 3 voti utente su questo vino,
    # lo score AI viene corretto di conseguenza (vedi calibra_score()).
    cal = calibra_score(score_ai, wine["nome"])
    score = cal["score_calibrato"]
    molecole = abb.get("molecole_protagoniste", [])
    avv = abb.get("avvertenza", "")
    avv_html = f'<p style="color:#9e3a3a;font-size:0.82em;margin-top:8px;padding:8px;background:#fff5f5;border-radius:6px">⚠️ {avv}</p>' if avv else ""
    foto = wine.get("foto", "")
    shop_url = f"{BASE_SHOP}/{wine.get('slug', wine['id'].lower())}"

    # IRC — Indice di Reattività Chimica Bwine: i 4 sotto-punteggi che compongono lo score,
    # mostrati come mini "radar" a barre. È l'indicatore proprietario del brand, non un
    # generico "score 0-100": comunica competenza tecnica invece che opinione generica.
    irc = abb.get("irc") or {}
    irc_max = {"chimica": 40, "aromatico": 25, "struttura": 20, "pulizia": 15}
    irc_label = {"chimica": T("irc_chimica"), "aromatico": T("irc_aromatico"), "struttura": T("irc_struttura"), "pulizia": T("irc_pulizia")}
    irc_rows = ""
    if irc:
        for k in ["chimica", "aromatico", "struttura", "pulizia"]:
            v = irc.get(k, 0)
            mx = irc_max[k]
            pct = min(100, round((v / mx) * 100)) if mx else 0
            irc_rows += f"""<div class="cat-gauge-wrap">
                <span class="cat-gauge-label">{irc_label[k]}</span>
                <div class="cat-gauge-bar"><div class="cat-gauge-fill" style="width:{pct}%;background:#5c1d24"></div></div>
                <span class="cat-gauge-pct">{v}/{mx}</span>
            </div>"""

    # Indicatori vino semplificati e leggibili
    def indicator_bar(label, val_text, icon, tooltip):
        mapping = {
            "altissima":95,"alta":75,"media":50,"bassa":25,"assenti":5,"assente":5,
            "potenti":90,"strutturati":75,"vellutati":60,"medi":50,"fini":40,
            "morbidi":35,"leggeri":25,"bassi":15,"titanici":100,"seta":55,
            "pieno":85,"medio-pieno":65,"medio":45,"leggero-medio":30,"leggero":15,
        }
        pct = mapping.get(str(val_text).lower().strip(), 50)
        if pct >= 75: col, lev = "#c0392b", T("lvl_high")
        elif pct >= 45: col, lev = "#e67e22", T("lvl_medium")
        else: col, lev = "#27ae60", T("lvl_low")
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
        indicator_bar(T("lbl_acidity"), wine.get("acidita","media"), "🍋", T("acidity")) +
        indicator_bar(T("lbl_tannins"), wine.get("tannini","medi"), "🍇", T("tannins")) +
        indicator_bar(T("lbl_body"), wine.get("corpo","medio"), "⚖️", T("body")) +
        indicator_bar(T("lbl_sweetness"), dolc_txt, "🍬", f"{rz:.1f} g/L")
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
            st.markdown('<div style="height:120px;display:flex;align-items:center;justify-content:center;font-size:3em;background:#ffffff;border:1px solid #f0e8e9;border-radius:10px;">🍷</div>', unsafe_allow_html=True)

    with col_info:
        st.markdown(f"""
        <div class="wine-card" style="margin-top:0;box-shadow:none;border:none;padding:0;">
            <div class="wine-card-body">
                <h3>{score_emoji(score)} {wine['nome']}</h3>
                <p style="margin:4px 0 8px">
                    <span class="badge badge-score">IRC {score}/100</span>
                    <span class="badge badge-price">{fascia_label(wine['fascia'])} · {wine['prezzo']:.0f}€</span>
                    <span class="badge badge-type">{wine['tipo']}</span>
                    <span class="badge badge-geo">{wine['regione']}</span>
                    <span class="badge badge-match">{abb.get('principio','').upper()}</span>
                    {(f'<span class="badge" style="background:#e8f4fd;color:#063242" title="{T("calibrated_tip", cal["n_voti"])}">🔄 {"+" if cal["delta"]>0 else ""}{cal["delta"]}</span>') if cal.get("calibrato") else ""}
                </p>
                <div style="margin:4px 0 10px">
                    <div style="display:flex;align-items:center;gap:8px">
                        <div class="score-bar" style="flex:1">
                            <div class="score-fill" style="width:{score}%;background:linear-gradient(90deg,#3d0a10,{score_color(score)})"></div>
                        </div>
                        <span style="font-size:0.9em;font-weight:700;color:{score_color(score)}">{score}%</span>
                    </div>
                    <p style="font-size:0.68em;color:#999;margin:2px 0 0;font-style:italic">{T("irc_caption")}</p>
                </div>
                <div style="margin:0 0 10px">{gauges}</div>
                <p style="font-size:0.83em;color:#444;margin:0 0 5px"><strong>{T('chemistry')}</strong> {abb.get('meccanismo_chimico','')}</p>
                <p style="font-size:0.83em;color:#333;margin:0 0 5px"><strong>{T('in_mouth')}</strong> {abb.get('sensazione_in_bocca','')}</p>
                <p style="font-size:0.83em;color:#5c1d24;margin:0 0 5px"><strong>{T('why_works')}</strong> {abb.get('perche_funziona','')}</p>
                {(f'<p style="font-size:0.82em;color:#1a4a2e;margin:0 0 5px;padding:7px 10px;background:#eaf7ef;border-radius:6px"><strong>{T("chem_in_mouth")}</strong> {abb.get("chimica_in_bocca","")}</p>') if abb.get("chimica_in_bocca") else ""}
                {(f'<p style="font-size:0.82em;color:#4a2a0a;margin:0 0 8px;padding:7px 10px;background:#fef9ec;border-radius:6px"><strong>{T("culinary_tips")}</strong> {abb.get("consigli_culinari","")}</p>') if abb.get("consigli_culinari") else ""}
                <div class="molecule-row">{mol_pills_html if mol_pills_html else '<span style="color:#aaa;font-size:0.78em">—</span>'}</div>
                <p style="font-size:0.72em;color:#888;margin:4px 0 8px;font-style:italic">{T("molecule_hint")}</p>
                {avv_html}
            </div>
        </div>
        """, unsafe_allow_html=True)

        # Bottone acquisto: aggiunge al carrello demo di bwine.shop (checkout nella tab dedicata).
        # Testo e badge pensati per essere il più chiari possibile: cosa succede cliccando,
        # e perché ci si può fidare (spedizione, sicurezza, reso).
        cba, cbb = st.columns([2, 1])
        with cba:
            if st.button(T('buy', wine['prezzo']), key=f"addcart_{idx}_{wine['id']}", use_container_width=True, type="primary"):
                cart_add(wine)
                st.toast(T("added_to_cart", wine['nome'][:35]))
                # scope="app": questa card è dentro un @st.fragment, quindi un
                # rerun "normale" aggiorna solo la card e NON il badge
                # "🛒 Carrello (N)" nel menu in alto — che è fuori dal fragment.
                # Con scope="app" il conteggio si aggiorna subito, senza
                # restare bloccato al valore precedente più a lungo del dovuto.
                st.rerun(scope="app")
        with cbb:
            st.link_button("🔗", shop_url, use_container_width=True, help=T("open_product"))
        st.caption(T("buy_trust"))

        # Salva etichetta (richiede login) + link alla scheda tecnica ufficiale del vino
        csave, csheet = st.columns([1, 1])
        with csave:
            if user_id:
                saved = is_wine_saved(user_id, wine["id"])
                label = T("unsave_wine_btn") if saved else T("save_wine_btn")
                if st.button(label, key=f"save_{idx}_{wine['id']}", use_container_width=True):
                    if saved:
                        remove_wine_label(user_id, wine["id"])
                        st.toast(T("saved_wine_removed", wine['nome'][:35]))
                    else:
                        save_wine_label(user_id, wine["id"], wine["nome"])
                        st.toast(T("saved_wine_added", wine['nome'][:35]))
                    st.rerun(scope="app")
            else:
                st.caption(f"🔖 {T('register_cta')}")
        with csheet:
            st.link_button(T("tech_sheet_link"), scheda_tecnica_url(wine), use_container_width=True, help=T("tech_sheet_help"))

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
        with st.container(border=True):
            st.markdown(f"#### {T('newsletter_title')}")
            st.caption(T('newsletter_sub'))
            nl_email = st.text_input("", placeholder=T("newsletter_placeholder"), key="nl_email", label_visibility="collapsed")
            if st.button(T("newsletter_btn"), key="nl_btn"):
                if nl_email and "@" in nl_email:
                    st.success(T("newsletter_ok"))
                else:
                    st.warning(T("fill_fields"))

    with col2:
        with st.container(border=True):
            st.markdown(f"#### {T('premium_title')}")
            st.caption(T('premium_sub'))
            st.link_button(T('premium_btn'), "https://www.bwine-shop.it/premium")

    with col3:
        with st.container(border=True):
            st.markdown(f"#### {T('quiz_title')}")
            st.caption(T('quiz_sub'))
            if st.button(T("quiz_btn"), key="quiz_btn"):
                st.session_state["show_quiz"] = True

    # Quiz modale semplice
    if st.session_state.get("show_quiz", False):
        with st.expander(T("quiz_expander"), expanded=True):
            q1_opts, q2_opts, q3_opts = T("quiz_q1_opts"), T("quiz_q2_opts"), T("quiz_q3_opts")
            q1 = st.radio(T("quiz_q1"), q1_opts)
            q2 = st.radio(T("quiz_q2"), q2_opts)
            q3 = st.radio(T("quiz_q3"), q3_opts)
            if st.button(T("quiz_discover")):
                # Logica di matching per indice (indipendente dalla lingua)
                i1, i3 = q1_opts.index(q1), q3_opts.index(q3)
                high_budget = i3 >= 3
                if i1 == 0:
                    rec = "Barolo DOCG o Brunello di Montalcino" if high_budget else "Chianti Classico Riserva"
                elif i1 == 1:
                    rec = "Chablis Premier Cru o Gavi di Gavi DOCG" if high_budget else "Vermentino di Gallura"
                elif i1 == 2:
                    rec = "Franciacorta Satèn o Champagne Krug" if high_budget else "Prosecco Superiore DOCG"
                else:
                    rec = "Passito di Pantelleria o Sauternes"
                st.success(T("quiz_result", rec))
                st.info(T("quiz_hint"))
                if st.button(T("quiz_close")):
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

        st.markdown("### 🍷 Bwine")
        st.markdown(f"*{T('hero_sub')[:60]}…*")
        st.markdown("---")

        if "user" not in st.session_state:
            st.session_state.user = None

        # Login, registrazione e profilo ora vivono nel menu in alto (tab
        # "👤 Account"), raggiungibile da qualunque pagina: qui in sidebar
        # teniamo solo un riepilogo rapido per non duplicare i widget.
        if not st.session_state.user:
            st.caption(T("account_not_logged"))
            sb_tab_login, sb_tab_reg = st.tabs([T("login"), T("register")])
            with sb_tab_login:
                sb_em = st.text_input(T("email"), key="sb_login_email", label_visibility="collapsed", placeholder=T("email"))
                sb_pw = st.text_input(T("password"), type="password", key="sb_login_pwd", label_visibility="collapsed", placeholder=T("password"))
                if st.button(T("login"), key="sb_btn_login", type="primary", use_container_width=True):
                    u = login_user(sb_em, sb_pw)
                    if u:
                        st.session_state.user = u
                        st.success(T("welcome", u["nome"]))
                        st.rerun()
                    else:
                        st.error(T("wrong_credentials"))
            with sb_tab_reg:
                sb_nm = st.text_input(T("account_reg_name"), key="sb_reg_nome", label_visibility="collapsed", placeholder=T("account_reg_name"))
                sb_em2 = st.text_input(T("account_reg_email"), key="sb_reg_email", label_visibility="collapsed", placeholder=T("account_reg_email"))
                sb_pw2 = st.text_input(T("account_reg_pwd"), type="password", key="sb_reg_pwd", label_visibility="collapsed", placeholder=T("account_reg_pwd"))
                if st.button(T("account_reg_submit"), key="sb_btn_reg", type="primary", use_container_width=True):
                    if sb_nm and sb_em2 and sb_pw2:
                        ok = register_user(sb_em2, sb_nm, sb_pw2, "", "", "", "")
                        if ok:
                            st.success(T("account_created"))
                        else:
                            st.warning(T("email_exists"))
                    else:
                        st.warning(T("fill_fields"))
                st.caption(f"👉 {T('nav_account')}: {T('account_reg_address')}, {T('account_reg_city')}, {T('account_reg_zip')}…")
        else:
            u = st.session_state.user
            st.markdown(f"""
            <div class="profile-card">
                <div class="profile-val">👤 {u['nome']}</div>
                <div class="profile-stat">{u['email']}</div>
            </div>
            """, unsafe_allow_html=True)
            if st.button(T("logout"), key="sb_btn_logout"): st.session_state.user = None; st.rerun()

        st.markdown("---")
        st.caption(T("sidebar_caption"))
        with st.expander(T("ai_explanation_title"), expanded=False):
            st.markdown(T("ai_explanation"))

def render_account_tab():
    """Account (login/registrazione/profilo) richiamabile dal menu in alto,
    accanto a tutte le altre funzioni — non solo dalla sidebar."""
    st.markdown(f"## 👤 {T('account_title')[3:] if T('account_title')[:2]=='##' else T('account_title')}")
    if "user" not in st.session_state:
        st.session_state.user = None

    if not st.session_state.user:
        st.info(T("account_not_logged"))

        with st.container(border=True):
            st.markdown(T("account_demo_title"))
            st.write(T("account_demo_desc"))
            if st.button(T("account_demo_btn"), key="acc_btn_demo", type="primary", use_container_width=True):
                seed_demo_account()
                u = login_user(DEMO_EMAIL, DEMO_PASSWORD)
                if u:
                    st.session_state.user = u
                    st.success(T("welcome", u["nome"]))
                    st.rerun()

        tab_login, tab_reg = st.tabs([T("login"), T("register")])
        with tab_login:
            em = st.text_input(T("email"), key="acc_login_email")
            pw = st.text_input(T("password"), type="password", key="acc_login_pwd")
            if st.button(T("login"), key="acc_btn_login", type="primary"):
                u = login_user(em, pw)
                if u: st.session_state.user = u; st.success(T("welcome", u["nome"])); st.rerun()
                else: st.error(T("wrong_credentials"))
        with tab_reg:
            nm = st.text_input(T("account_reg_name"), key="acc_reg_nome")
            em2 = st.text_input(T("account_reg_email"), key="acc_reg_email")
            pw2 = st.text_input(T("account_reg_pwd"), type="password", key="acc_reg_pwd")
            tel2 = st.text_input(T("account_reg_phone"), key="acc_reg_tel")
            addr2 = st.text_input(T("account_reg_address"), key="acc_reg_addr")
            colc, colz = st.columns(2)
            with colc: citta2 = st.text_input(T("account_reg_city"), key="acc_reg_citta")
            with colz: cap2 = st.text_input(T("account_reg_zip"), key="acc_reg_cap")
            if st.button(T("account_reg_submit"), key="acc_btn_reg", type="primary"):
                if nm and em2 and pw2:
                    ok = register_user(em2, nm, pw2, tel2, addr2, citta2, cap2)
                    if ok:
                        st.success(T("account_created"))
                    else:
                        st.warning(T("email_exists"))
                else:
                    st.warning(T("fill_fields"))
    else:
        u = st.session_state.user
        stats = get_stats(u["id"])
        col_a, col_b = st.columns([1, 2])
        with col_a:
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
            if st.button(T("logout"), key="acc_btn_logout"):
                st.session_state.user = None; st.rerun()
        with col_b:
            with st.expander(T("account_edit_profile"), expanded=False):
                nm_e = st.text_input(T("account_reg_name"), value=u.get("nome",""), key="acc_edit_nome")
                tel_e = st.text_input(T("account_reg_phone"), value=u.get("telefono",""), key="acc_edit_tel")
                addr_e = st.text_input(T("account_reg_address"), value=u.get("indirizzo",""), key="acc_edit_addr")
                citta_e = st.text_input(T("account_reg_city"), value=u.get("citta",""), key="acc_edit_citta")
                cap_e = st.text_input(T("account_reg_zip"), value=u.get("cap",""), key="acc_edit_cap")
                if st.button(T("account_save_profile"), key="acc_btn_save_profile"):
                    update_user_profile(u["id"], nm_e, tel_e, addr_e, citta_e, cap_e)
                    st.session_state.user.update({"nome":nm_e,"telefono":tel_e,"indirizzo":addr_e,"citta":citta_e,"cap":cap_e})
                    st.success(T("account_profile_saved")); st.rerun()
            st.markdown(T("last_searches"))
            hist = get_history(u["id"], 8)
            if not hist:
                st.caption(T("account_no_orders"))
            for h in hist:
                data = h[1][:10] if h[1] else ""
                st.markdown(f'<div class="history-item">🍽️ <b>{h[0]}</b><br><span style="color:#888">{data}</span></div>', unsafe_allow_html=True)

            st.markdown("---")
            st.markdown(T("saved_wines_title"))
            st.caption(T("saved_wines_caption"))
            saved = get_saved_wines_full(u["id"])
            if not saved:
                st.caption(T("no_saved_wines"))
            else:
                cols_sw = st.columns(3)
                for i, w in enumerate(saved):
                    with cols_sw[i % 3]:
                        st.markdown(f"""
                        <div class="profile-card">
                            <div class="profile-val">🍷 {w['nome']}</div>
                            <div class="profile-stat">{w['tipo']} · {w['regione']}</div>
                            <div class="profile-stat">{w.get('prezzo', 0):.2f}€</div>
                        </div>
                        """, unsafe_allow_html=True)
                        if st.button(T("unsave_wine_btn"), key=f"acc_unsave_{w['id']}", use_container_width=True):
                            remove_wine_label(u["id"], w["id"])
                            st.rerun()

            st.markdown("---")
            st.markdown(T("account_orders_title"))
            orders = get_user_orders(u["id"])
            if not orders:
                st.caption(T("account_no_orders"))
            for o in orders:
                data = o["created_at"][:10] if o.get("created_at") else ""
                st.markdown(
                    f'<div class="history-item">{T("account_order_line", o["order_ref"], o["stato"], o["totale"], data)}</div>',
                    unsafe_allow_html=True,
                )

# ─────────────────────────────────────────────
# HELPER: CARD CATALOGO
# ─────────────────────────────────────────────
@st.fragment
def _render_catalog_card(w: dict, T_func, user_id: Optional[int] = None):
    foto = w.get("foto","")
    shop_url = f"{BASE_SHOP}/{w.get('slug', w['id'].lower())}"
    tags = "".join([f'<span class="molecule-pill">{t}</span>' for t in w.get("profilo_aromatico",[])[:2]])
    if foto:
        st.image(foto, use_container_width=True)
    else:
        st.markdown('<div style="height:80px;text-align:center;font-size:2.5em;">🍷</div>', unsafe_allow_html=True)
    acid_pct = {"altissima":95,"alta":75,"media":50,"bassa":25}.get(w.get("acidita","media"),50)
    corpo_pct = {"pieno":85,"medio-pieno":65,"medio":45,"leggero-medio":30,"leggero":15}.get(w.get("corpo","medio"),45)
    fascia_colors = {
        "economico": ("background:#d1e7dd;color:#0a3d1f","💚 Economico"),
        "standard":  ("background:#cff4fc;color:#063242","💙 Standard"),
        "premium":   ("background:#f3d9fa;color:#4a0a5c","💜 Premium"),
        "lusso":     ("background:#fff3cd;color:#5c3d00","⭐ Lusso"),
    }
    f_style, f_label = fascia_colors.get(w.get("fascia","standard"), ("background:#eee;color:#333","—"))
    abbina_txt = " · ".join(w.get("abbina_bene_con",[])[:3])
    st.markdown(f"""
    <div style="background:white;border-radius:0 0 10px 10px;padding:10px 12px 14px;border:1px solid #f0e5e6;border-top:none;margin-bottom:16px;">
        <strong style="font-size:0.87em;color:#3d0a10">{w['nome']}</strong>
        <p style="font-size:0.74em;color:#888;margin:3px 0">{w['tipo']} · {w['uva']} · {w['alcol']}% · {w['prezzo']:.0f}€</p>
        <p style="margin:3px 0"><span style="{f_style};padding:2px 7px;border-radius:10px;font-size:0.78em;font-weight:600">{f_label}</span></p>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin:5px 0">{tags}</div>
        <div style="font-size:0.68em;color:#888;margin:4px 0 2px">Acidità <b>{acid_pct}%</b> · Corpo <b>{corpo_pct}%</b></div>
        {(f'<p style="font-size:0.70em;color:#555;margin:3px 0"><em>🍽️ {abbina_txt}</em></p>') if abbina_txt else ""}
    </div>
    """, unsafe_allow_html=True)
    if st.button(f"🛒 {T_func('buy', w['prezzo'])}", key=f"cat_addcart_{w['id']}", use_container_width=True):
        cart_add(w)
        st.toast(T_func("added_to_cart", w['nome'][:35]))
        st.rerun()

    csave, csheet = st.columns([1, 1])
    with csave:
        if user_id:
            saved = is_wine_saved(user_id, w["id"])
            label = T_func("unsave_wine_btn") if saved else T_func("save_wine_btn")
            if st.button(label, key=f"cat_save_{w['id']}", use_container_width=True):
                if saved:
                    remove_wine_label(user_id, w["id"])
                    st.toast(T_func("saved_wine_removed", w['nome'][:35]))
                else:
                    save_wine_label(user_id, w["id"], w["nome"])
                    st.toast(T_func("saved_wine_added", w['nome'][:35]))
                st.rerun()
        else:
            st.caption("🔖")
    with csheet:
        st.link_button(T_func("tech_sheet_link"), scheda_tecnica_url(w), use_container_width=True, help=T_func("tech_sheet_help"))

# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
def render_business_tab():
    """Sezione B2B pensata per il mercato principale di Bwine: ristoranti,
    enoteche e wine bar che vogliono uno strumento di abbinamento cibo-vino
    da usare in sala, per la carta dei vini o per formare il personale."""
    st.markdown(T("biz_title"))
    st.write(T("biz_intro"))
    st.success(T("biz_trial_banner"))

    st.markdown(T("biz_why_title"))
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        with st.container(border=True):
            st.markdown(T("biz_c1_t"))
            st.caption(T("biz_c1_d"))
    with c2:
        with st.container(border=True):
            st.markdown(T("biz_c2_t"))
            st.caption(T("biz_c2_d"))
    with c3:
        with st.container(border=True):
            st.markdown(T("biz_c3_t"))
            st.caption(T("biz_c3_d"))
    with c4:
        with st.container(border=True):
            st.markdown(T("biz_c4_t"))
            st.caption(T("biz_c4_d"))

    st.markdown("---")
    st.markdown(T("biz_plans_title"))
    st.caption(T("biz_plans_caption"))

    p1, p2, p3, p4 = st.columns(4)
    with p1:
        with st.container(border=True):
            st.markdown(T("biz_p1_t")); st.markdown(T("biz_p1_price")); st.caption(T("biz_p1_d"))
    with p2:
        with st.container(border=True):
            st.markdown(T("biz_p2_t")); st.markdown(T("biz_p2_price")); st.caption(T("biz_p2_d"))
    with p3:
        with st.container(border=True):
            st.markdown(T("biz_p3_t")); st.markdown(T("biz_p3_price")); st.caption(T("biz_p3_d"))
    with p4:
        with st.container(border=True):
            st.markdown(T("biz_p4_t")); st.markdown(T("biz_p4_price")); st.caption(T("biz_p4_d"))

    st.markdown("---")
    st.markdown(T("biz_form_title"))
    with st.form("lead_locale_form", clear_on_submit=True):
        col_a, col_b = st.columns(2)
        with col_a:
            nome_locale = st.text_input(T("biz_f_nome"))
            referente = st.text_input(T("biz_f_referente"))
            email_lead = st.text_input(T("biz_f_email"))
            telefono = st.text_input(T("biz_f_tel"))
        with col_b:
            citta = st.text_input(T("biz_f_citta"))
            tipi_locale_opts = T("biz_tipo_opts")
            # Il profilo scelto in home (main()) è salvato come codice indipendente dalla lingua
            profilo_code = st.session_state.get("profilo_utente_code", "")
            code_to_idx = {
                "restaurant": 0, "enoteca": 2, "serale": 4, "hotel": 6, "beach": 8, "gruppo": 9,
            }
            idx_default = code_to_idx.get(profilo_code, 0)
            tipo_locale = st.selectbox(T("biz_f_tipo"), tipi_locale_opts, index=idx_default)
            n_coperti = st.selectbox(T("biz_f_coperti"), T("biz_coperti_opts"))
            piano_interesse = st.selectbox(T("biz_f_piano"), T("biz_piano_opts"))
        note = st.text_area(T("biz_f_note"), placeholder=T("biz_f_note_ph"))
        invia = st.form_submit_button(T("biz_f_submit"))

    if invia:
        if nome_locale and referente and email_lead and "@" in email_lead:
            save_locale_lead(nome_locale, referente, email_lead, telefono, citta, tipo_locale, n_coperti, piano_interesse, note)
            st.success(T("biz_success"))
        else:
            st.warning(T("biz_warn"))

    n_leads = count_locali_leads()
    if n_leads:
        st.caption(T("biz_leads_caption", n_leads))

    st.markdown("---")
    with st.expander(T("biz_print_expander")):
        st.caption(T("biz_print_caption"))
        colf1, colf2, colf3 = st.columns(3)
        with colf1:
            biz_regione = st.selectbox(T("biz_print_continent"), [T("opt_all_m")] + sorted(set(w["continente"] for w in WINE_CATALOG)), key="biz_cont")
        with colf2:
            biz_tipo = st.selectbox(T("biz_print_type"), [T("opt_all_m")] + sorted(set(w["tipo"] for w in WINE_CATALOG)), key="biz_tipo")
        with colf3:
            biz_fascia = st.selectbox(T("biz_print_band"), [T("opt_all_f")] + sorted(set(w["fascia"] for w in WINE_CATALOG)), key="biz_fascia")

        biz_cat = WINE_CATALOG.copy()
        if biz_regione != T("opt_all_m"):
            biz_cat = [w for w in biz_cat if w["continente"] == biz_regione]
        if biz_tipo != T("opt_all_m"):
            biz_cat = [w for w in biz_cat if w["tipo"] == biz_tipo]
        if biz_fascia != T("opt_all_f"):
            biz_cat = [w for w in biz_cat if w["fascia"] == biz_fascia]

        st.write(T("biz_print_count", len(biz_cat)))
        righe = [f"- **{w['nome']}** ({w['regione']}) — {w['uva']} — {w['prezzo']:.2f}€" for w in biz_cat[:100]]
        testo_carta = "\n".join(righe)
        st.text_area(T("biz_print_preview"), testo_carta, height=220)
        st.download_button(T("biz_print_download"), testo_carta, file_name="carta_vini_bwine.txt")


# ─────────────────────────────────────────────
# WINE LAB — testi e configurazione dei 6 indicatori "a parole".
# Non viviamo più su 4 slider numerici -2..+2: ogni indicatore ha un set di
# livelli descritti a parole (select_slider), un'icona, un colore e una frase
# che spiega cosa succede chimicamente. Più alcuni "assaggi rapidi" (preset)
# per giocare con gli indicatori con un click, in modo più originale di un
# semplice pannello di slider.
# ─────────────────────────────────────────────
WL_STRINGS = {
    "it": {
        "kicker": "Cambia un ingrediente alla volta e guarda il piatto trasformarsi",
        "quick_title": "#### 🎲 Assaggi rapidi — un click, un piatto diverso",
        "quick_caption": "Combinazioni pronte per esplorare in fretta: le puoi sempre affinare con i comandi qui sotto.",
        "dashboard_title": "#### 🌡️ Il tuo piatto, indicatore per indicatore",
        "dashboard_caption": "Ogni barra si muove in tempo reale mentre regoli i comandi — è il profilo chimico del piatto che manderemo al motore Bwine.",
        "detail_title": "#### 🎛️ Regola ogni indicatore",
        "reset_btn": "🔄 Riparti dal piatto originale",
        "unchanged": "Come nella ricetta originale — nessuna variazione",
        "presets": [
            ("🍋 Sferzata di acidità", "Limone e aceto in più, per un piatto che taglia la bocca", {"wl_acid": 2, "wl_fat": -1}),
            ("🧈 Versione golosa", "Più burro, panna, formaggio: tutto più rotondo e avvolgente", {"wl_fat": 2, "wl_sweet": 1}),
            ("🌶️ Accendi il fuoco", "Peperoncino deciso, il piatto diventa piccante", {"wl_spice": 2}),
            ("🔥 Ben rosolato", "Cottura più lunga, crosta scura, note tostate di Maillard", {"wl_cook": 2}),
            ("🍯 Nota dolce", "Un tocco di zucchero, miele o frutta matura", {"wl_sweet": 2}),
            ("🧂 Più sapido", "Sale, colatura di alici, formaggi stagionati", {"wl_salt": 2}),
            ("🍄 Bomba di umami", "Funghi, parmigiano, salsa di soia: sapore profondo e persistente", {"wl_umami": 2}),
            ("🌿 Fresco ed erbaceo", "Basilico, menta, prezzemolo: una ventata di verde", {"wl_herb": 2}),
            ("🔥🪵 Alla brace", "Cottura alla griglia, nota affumicata decisa", {"wl_smoke": 2, "wl_cook": 1}),
        ],
        "indicators": [
            {
                "key": "wl_acid", "icon": "🍋", "label": "Acidità",
                "range": (-2, 2), "color": "#c9a227",
                "sub": "Limone, aceto, agrumi, pomodoro acerbo",
                "levels": {
                    -2: "Molto meno acida", -1: "Un po' meno acida",
                    0: "Invariata", 1: "Un po' più acida", 2: "Molto più acida (limone/aceto abbondanti)",
                },
            },
            {
                "key": "wl_fat", "icon": "🧈", "label": "Grassi",
                "range": (-2, 2), "color": "#d98c3d",
                "sub": "Burro, panna, olio, formaggi grassi",
                "levels": {
                    -2: "Molto più leggero", -1: "Un po' più leggero",
                    0: "Invariato", 1: "Un po' più grasso", 2: "Molto più grasso e avvolgente",
                },
            },
            {
                "key": "wl_spice", "icon": "🌶️", "label": "Piccantezza",
                "range": (0, 2), "color": "#c0392b",
                "sub": "Peperoncino, pepe, spezie piccanti",
                "levels": {0: "Nessun piccante", 1: "Un tocco di peperoncino", 2: "Deciso, bella piccantezza"},
            },
            {
                "key": "wl_cook", "icon": "🔥", "label": "Cottura / Maillard",
                "range": (-1, 2), "color": "#7a3b1a",
                "sub": "Rosolatura, crosta, caramellizzazione",
                "levels": {
                    -1: "Cottura più breve, meno rosolata", 0: "Cottura standard",
                    1: "Ben rosolata, crosta marcata", 2: "Molto rosolata / quasi caramellizzata",
                },
            },
            {
                "key": "wl_sweet", "icon": "🍯", "label": "Dolcezza",
                "range": (-2, 2), "color": "#b5651d",
                "sub": "Zucchero, miele, frutta matura",
                "levels": {
                    -2: "Molto meno dolce", -1: "Un po' meno dolce",
                    0: "Invariata", 1: "Un po' più dolce", 2: "Decisamente più dolce",
                },
            },
            {
                "key": "wl_salt", "icon": "🧂", "label": "Sapidità",
                "range": (-2, 2), "color": "#5a7d9a",
                "sub": "Sale, acciughe, capperi, stagionature",
                "levels": {
                    -2: "Molto meno sapida", -1: "Un po' meno sapida",
                    0: "Invariata", 1: "Un po' più sapida", 2: "Molto sapida / salata",
                },
            },
            {
                "key": "wl_umami", "icon": "🍄", "label": "Umami",
                "range": (0, 2), "color": "#6b4226",
                "sub": "Funghi, parmigiano, soia, brodo ristretto, acciughe",
                "levels": {0: "Nessun umami extra", 1: "Umami più presente", 2: "Umami molto intenso e persistente"},
            },
            {
                "key": "wl_herb", "icon": "🌿", "label": "Erbe aromatiche",
                "range": (0, 2), "color": "#3f7d3a",
                "sub": "Basilico, menta, prezzemolo, freschezza vegetale",
                "levels": {0: "Nessuna erba extra", 1: "Note erbacee fresche", 2: "Profilo erbaceo molto marcato"},
            },
            {
                "key": "wl_smoke", "icon": "🪵", "label": "Affumicatura",
                "range": (0, 2), "color": "#4a4038",
                "sub": "Griglia, brace, affumicatura, cottura al fumo",
                "levels": {0: "Nessuna affumicatura", 1: "Leggera nota affumicata / grigliata", 2: "Affumicatura intensa (brace, fumo marcato)"},
            },
        ],
        "ingredients_title": "#### 🧄 Aggiungi o togli ingredienti",
        "ingredients_caption": "Il modo più originale per trasformare il piatto: componi la variante ingrediente per ingrediente, non solo con gli slider.",
        "add_label": "➕ Ingredienti da aggiungere",
        "add_help": "Scegli uno o più ingredienti: verranno inseriti nella descrizione del piatto inviata al motore Bwine.",
        "remove_label": "➖ Ingredienti da togliere / escludere",
        "remove_help": "Utile per varianti vegetariane, senza glutine, senza latticini o per semplificare la ricetta.",
        "ingredient_options": [
            "succo di limone", "aceto balsamico", "capperi", "pomodorini acerbi",
            "burro", "panna fresca", "olio EVO a crudo", "formaggio grasso filante",
            "peperoncino fresco", "pepe nero", "zenzero", "paprika piccante",
            "funghi porcini", "parmigiano stravecchio", "salsa di soia", "acciughe",
            "basilico fresco", "menta", "prezzemolo", "scorza di agrumi",
            "miele", "uvetta", "frutta matura", "aceto balsamico invecchiato",
            "sale grosso", "colatura di alici", "olive nere", "formaggio stagionato",
            "affumicatura alla brace", "paprika affumicata",
        ],
        "remove_options": [
            "aglio", "cipolla", "glutine", "latticini", "carne", "pesce",
            "frutta secca", "uova", "burro", "sale aggiunto",
        ],
    },
}
WL_STRINGS["en"] = WL_STRINGS["it"]
WL_STRINGS["es"] = WL_STRINGS["it"]


def _wl_indicator_bar(icon: str, label: str, word: str, sub: str, color: str, value: int, minv: int, maxv: int) -> str:
    span = maxv - minv
    pct = int(round(((value - minv) / span) * 100)) if span else 50
    zero_pct = int(round(((0 - minv) / span) * 100)) if span else 50
    return f"""
    <div style="background:white;border:1px solid #f0e5e6;border-radius:10px;padding:10px 14px;margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
            <span style="font-size:0.85em;font-weight:700;color:#3d0a10">{icon} {label}</span>
            <span style="font-size:0.8em;color:{color};font-weight:700">{word}</span>
        </div>
        <p style="font-size:0.68em;color:#999;margin:1px 0 6px">{sub}</p>
        <div style="position:relative;height:8px;border-radius:6px;background:#f1e7e8;">
            <div style="position:absolute;left:{zero_pct}%;top:-3px;width:2px;height:14px;background:#ccc;"></div>
            <div style="position:absolute;left:0;top:0;height:8px;width:{pct}%;border-radius:6px;background:{color};transition:width .2s;"></div>
            <div style="position:absolute;left:calc({pct}% - 6px);top:-4px;width:12px;height:12px;border-radius:50%;background:{color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,.3);"></div>
        </div>
    </div>
    """


# ─────────────────────────────────────────────
# TAB WINE LAB — il piatto diventa modificabile in tempo reale
# ─────────────────────────────────────────────
def render_wine_lab_tab(user_id: Optional[int]):
    lang = st.session_state.get("lang", "it")
    WS = WL_STRINGS.get(lang, WL_STRINGS["it"])

    st.markdown(T("lab_title"))
    st.write(T("lab_intro"))
    st.caption(WS["kicker"])

    piatto_base = st.text_input(
        T("lab_dish_label"),
        value=st.session_state.get("last_piatto", ""),
        placeholder=T("lab_dish_ph"),
        key="wl_piatto",
    )

    if piatto_base:
        piatto_base_corretto, piatto_base_e_stato_corretto = correggi_piatto(piatto_base)
        if piatto_base_e_stato_corretto:
            st.caption(f"✏️ Corretto automaticamente in: *{piatto_base_corretto}*")
            piatto_base = piatto_base_corretto

    all_slider_keys = [ind["key"] for ind in WS["indicators"]]

    # ── ASSAGGI RAPIDI: chip cliccabili che impostano più indicatori insieme ──
    st.markdown(WS["quick_title"])
    st.caption(WS["quick_caption"])
    n_presets = len(WS["presets"]) + 1
    preset_cols = st.columns(n_presets)
    for i, (p_label, p_desc, p_deltas) in enumerate(WS["presets"]):
        with preset_cols[i]:
            if st.button(p_label, key=f"wl_preset_{i}", use_container_width=True, help=p_desc):
                for k in all_slider_keys:
                    st.session_state[k] = p_deltas.get(k, 0)
                st.rerun()
    with preset_cols[-1]:
        if st.button(WS["reset_btn"], key="wl_preset_reset", use_container_width=True, type="secondary"):
            for k in all_slider_keys:
                st.session_state[k] = 0
            st.session_state["wl_add_ingredients"] = []
            st.session_state["wl_remove_ingredients"] = []
            st.session_state["wl_nota_libera"] = ""
            st.rerun()

    # ── DETTAGLIO: un select_slider "a parole" per indicatore ──
    st.markdown(WS["detail_title"])
    valori = {}
    cols = st.columns(2)
    for i, ind in enumerate(WS["indicators"]):
        minv, maxv = ind["range"]
        opzioni = list(range(minv, maxv + 1))
        with cols[i % 2]:
            val = st.select_slider(
                f"{ind['icon']} {ind['label']}",
                options=opzioni,
                value=st.session_state.get(ind["key"], 0),
                format_func=lambda v, _ind=ind: _ind["levels"].get(v, str(v)),
                key=ind["key"],
                help=ind["sub"],
            )
            valori[ind["key"]] = val

    d_acidita = valori["wl_acid"]
    d_grassi = valori["wl_fat"]
    d_piccante = valori["wl_spice"]
    d_cottura = valori["wl_cook"]
    d_dolcezza = valori["wl_sweet"]
    d_sale = valori["wl_salt"]
    d_umami = valori["wl_umami"]
    d_erbe = valori["wl_herb"]
    d_affumicato = valori["wl_smoke"]

    # ── CRUSCOTTO LIVE: barre colorate con parole, non numeri ──
    st.markdown(WS["dashboard_title"])
    st.caption(WS["dashboard_caption"])
    bar_cols = st.columns(3)
    for i, ind in enumerate(WS["indicators"]):
        minv, maxv = ind["range"]
        val = valori[ind["key"]]
        word = ind["levels"].get(val, str(val))
        with bar_cols[i % 3]:
            st.markdown(
                _wl_indicator_bar(ind["icon"], ind["label"], word, ind["sub"], ind["color"], val, minv, maxv),
                unsafe_allow_html=True,
            )

    # ── INGREDIENTI: modo più concreto e originale di trasformare il piatto ──
    st.markdown(WS["ingredients_title"])
    st.caption(WS["ingredients_caption"])
    ing_cols = st.columns(2)
    with ing_cols[0]:
        ingredienti_aggiunti = st.multiselect(
            WS["add_label"],
            options=WS["ingredient_options"],
            default=st.session_state.get("wl_add_ingredients", []),
            key="wl_add_ingredients",
            help=WS["add_help"],
        )
    with ing_cols[1]:
        ingredienti_rimossi = st.multiselect(
            WS["remove_label"],
            options=WS["remove_options"],
            default=st.session_state.get("wl_remove_ingredients", []),
            key="wl_remove_ingredients",
            help=WS["remove_help"],
        )

    # ── NOTA LIBERA: descrivi a parole tue la modifica al piatto ──
    # Pensata per lo staff di un locale (cuoco, chef de partie, sommelier) che
    # vuole testare al volo una variazione di ricetta senza dover tradurla negli
    # slider sopra: basta scriverla in linguaggio naturale, es. "sostituisco il
    # burro con olio EVO e aggiungo scorza di limone" oppure "versione senza
    # glutine con farina di riso". Il testo viene passato all'AI insieme al resto.
    st.markdown(f'<div class="wl-freeform-box">', unsafe_allow_html=True)
    st.markdown(f"#### {T('lab_freeform_title')}")
    st.caption(T("lab_freeform_caption"))
    nota_libera = st.text_area(
        T("lab_freeform_label"),
        value=st.session_state.get("wl_nota_libera", ""),
        placeholder=T("lab_freeform_ph"),
        key="wl_nota_libera",
        height=90,
        label_visibility="collapsed",
    )
    st.markdown("</div>", unsafe_allow_html=True)

    piatto_mod, riassunto_modifiche = costruisci_piatto_modificato(
        piatto_base, d_acidita, d_grassi, d_piccante, d_cottura, d_dolcezza, d_sale,
        d_umami, d_erbe, d_affumicato, ingredienti_aggiunti, ingredienti_rimossi,
        nota_libera,
    ) if piatto_base else ("", "")

    if piatto_base:
        if riassunto_modifiche and piatto_mod != piatto_base:
            st.info(T("lab_preview", piatto_mod))
        else:
            st.caption(WS["unchanged"])

    ricalcola = st.button(T("lab_run_btn"), type="primary",
                           disabled=not piatto_base, key="wl_run")

    if ricalcola and piatto_base:
        with st.spinner(T("lab_spinner")):
            filtri_vuoti = {"regione": "qualsiasi", "area": "qualsiasi", "fascia": "qualsiasi",
                             "tipo": "qualsiasi", "budget_min": None, "budget_max": None}
            risultato_nuovo = get_ai_pairing(piatto_mod, filtri_vuoti, WINE_CATALOG)

        if "error" in risultato_nuovo:
            st.error(T("lab_error", risultato_nuovo.get('error')))
        else:
            abbinamenti_nuovi = risultato_nuovo.get("abbinamenti", [])
            abbinamenti_originali = st.session_state.get("last_abbinamenti", [])
            score_originali = {a.get("wine_id"): a.get("score", 0) for a in abbinamenti_originali}

            st.markdown(T("lab_results_title", piatto_base))
            if riassunto_modifiche:
                st.caption(T("lab_changes", riassunto_modifiche))

            for a in abbinamenti_nuovi[:8]:
                wine = get_wine_by_id(a.get("wine_id", ""))
                if not wine:
                    continue
                nuovo_score = a.get("score", 0)
                vecchio_score = score_originali.get(a.get("wine_id"))
                colA, colB = st.columns([3, 1])
                with colA:
                    st.markdown(f"**{wine['nome']}** — {wine['tipo']}, {wine['regione']}")
                    st.caption(a.get("perche_funziona", ""))
                with colB:
                    if vecchio_score is not None and vecchio_score != nuovo_score:
                        delta = nuovo_score - vecchio_score
                        freccia = "🔼" if delta > 0 else "🔽"
                        colore = "#1a7a3a" if delta > 0 else "#b03030"
                        st.markdown(f"<div style='text-align:right'><span style='font-size:1.3em;font-weight:800;color:{colore}'>{nuovo_score}</span> "
                                    f"<span style='font-size:0.85em;color:{colore}'>{freccia} {'+' if delta>0 else ''}{delta}</span></div>",
                                    unsafe_allow_html=True)
                    else:
                        st.markdown(f"<div style='text-align:right;font-size:1.3em;font-weight:800'>{nuovo_score}</div>", unsafe_allow_html=True)
            if not abbinamenti_originali:
                st.caption(T("lab_no_original"))
    elif not piatto_base:
        st.info(T("lab_start_hint"))


# ─────────────────────────────────────────────
# TAB CONSIGLI CULINARI — dal vino al piatto
# ─────────────────────────────────────────────
def render_culinary_tab():
    st.markdown(T("cul_title"))
    st.write(T("cul_intro"))
    st.caption(T("cul_example"))

    col_v, col_q = st.columns([1, 2])
    with col_v:
        opzioni_vino = {f"{w['nome']} ({w['regione']})": w["id"] for w in WINE_CATALOG}

        # ── Ricerca vino a parole: nome, uva o regione ──
        cul_query = st.text_input(
            T("cul_search_label"),
            placeholder=T("cul_search_ph"),
            key="cul_search",
        )

        catalogo_per_label = {f"{w['nome']} ({w['regione']})": w for w in WINE_CATALOG}
        if cul_query.strip():
            q = cul_query.strip().lower()
            filtrati = {
                label: w for label, w in catalogo_per_label.items()
                if q in w["nome"].lower() or q in w.get("uva", "").lower() or q in w["regione"].lower()
                or q in w.get("tipo", "").lower() or q in w.get("continente", "").lower()
            }
            if filtrati:
                nomi_vini = sorted(filtrati.keys())
            else:
                st.caption(T("cul_search_noresults"))
                nomi_vini = sorted(opzioni_vino.keys())
        else:
            nomi_vini = sorted(opzioni_vino.keys())

        if cul_query.strip():
            st.caption(T("cul_search_or"))

        vino_scelto_label = st.selectbox(T("cul_wine_label"), nomi_vini, key="cul_wine",
                                          index=nomi_vini.index(next((n for n in nomi_vini if "Bonarda" in n), nomi_vini[0]))
                                          if any("Bonarda" in n for n in nomi_vini) else 0)
        wine_sel = get_wine_by_id(opzioni_vino[vino_scelto_label])
        if wine_sel:
            st.caption(f"{wine_sel['tipo']} · {wine_sel['uva']} · {wine_sel['alcol']}% · "
                       f"{T('lbl_acidity')} {wine_sel['acidita']} · {T('lbl_tannins')} {wine_sel['tannini']} · {T('lbl_body')} {wine_sel['corpo']}")
    with col_q:
        domanda = st.text_area(
            T("cul_question_label"),
            placeholder=T("cul_question_ph"),
            key="cul_question", height=90,
        )
        chiedi = st.button(T("cul_ask_btn"), type="primary", key="cul_ask")

    if chiedi:
        if not domanda.strip():
            st.warning(T("cul_warn_q"))
        elif not wine_sel:
            st.warning(T("cul_warn_w"))
        else:
            with st.spinner(T("cul_spinner")):
                risultato = get_ai_culinary_advice(wine_sel, domanda)
            if "error" in risultato:
                if risultato["error"] == "API_KEY_MISSING":
                    st.error(f"❌ {T('api_missing')}")
                else:
                    st.error(T("cul_error", risultato['error']))
            else:
                st.markdown(f"""
                <div style="background:white;border-left:5px solid #5c1d24;border-radius:10px;padding:16px 20px;margin-top:10px;box-shadow:0 3px 12px rgba(0,0,0,0.06)">
                    <p style="font-size:0.8em;color:#888;margin:0 0 8px">{T('cul_answer_prefix', wine_sel['nome'])}</p>
                    {risultato.get("consiglio","").replace(chr(10), "<br>")}
                </div>
                """, unsafe_allow_html=True)
                shop_url = f"{BASE_SHOP}/{wine_sel.get('slug', wine_sel['id'].lower())}"
                cba, cbb = st.columns([2, 1])
                with cba:
                    if st.button(T("cul_addcart", wine_sel['nome'][:30]), key="cul_addcart", use_container_width=True):
                        cart_add(wine_sel)
                        st.toast(T("added_to_cart", wine_sel['nome'][:35]))
                        st.rerun()
                with cbb:
                    st.link_button("🔗", shop_url, use_container_width=True, help=T("cul_open_product"))


# ─────────────────────────────────────────────
# TAB CONTATTI — form di contatto verso CONTACT_EMAIL (vinodivinoai@gmail.com),
# più storico dei messaggi in DB (contact_messages) e link email diretto.
# ─────────────────────────────────────────────
def render_contact_tab():
    st.markdown(T("contact_title"))
    st.write(T("contact_intro"))

    with st.container(border=True):
        st.markdown(f"{T('contact_email_label')}: **{CONTACT_BRAND}** — [{CONTACT_EMAIL}](mailto:{CONTACT_EMAIL})")

    st.markdown(T("contact_form_title"))
    with st.form("contact_form", clear_on_submit=True):
        col_a, col_b = st.columns(2)
        with col_a:
            c_nome = st.text_input(T("contact_f_name"), key="contact_nome")
            c_email = st.text_input(T("contact_f_email"), key="contact_email")
        with col_b:
            c_oggetto = st.text_input(T("contact_f_subject"), key="contact_oggetto")
        c_messaggio = st.text_area(T("contact_f_message"), placeholder=T("contact_f_message_ph"), key="contact_messaggio", height=140)
        c_invia = st.form_submit_button(T("contact_f_submit"), type="primary")

    if c_invia:
        if c_nome and c_email and "@" in c_email and c_messaggio.strip():
            save_contact_message(c_nome, c_email, c_oggetto, c_messaggio)
            oggetto_mail = c_oggetto.strip() or f"Messaggio da {c_nome} via {CONTACT_BRAND}"
            corpo_mail = f"{c_messaggio}\n\n— {c_nome} ({c_email})"
            mailto_url = (
                f"mailto:{CONTACT_EMAIL}"
                f"?subject={urllib.parse.quote(oggetto_mail)}"
                f"&body={urllib.parse.quote(corpo_mail)}"
            )
            st.success(T("contact_success", CONTACT_EMAIL))
            st.link_button(f"✉️ {T('contact_f_submit')}", mailto_url, use_container_width=True)
        else:
            st.warning(T("contact_warn"))

    st.caption(T("contact_direct", CONTACT_BRAND, CONTACT_EMAIL))


# ─────────────────────────────────────────────
# TAB ADMIN — pannello riservato: chi si è registrato, ricerche, ordini,
# richieste demo dei locali. Protetto da password (ADMIN_PASSWORD).
# ─────────────────────────────────────────────
def render_admin_tab():
    st.markdown(f"## 🛠️ {T('admin_title')}")

    if "admin_unlocked" not in st.session_state:
        st.session_state.admin_unlocked = False

    if not st.session_state.admin_unlocked:
        st.info(T("admin_locked_desc"))
        col_p, col_b = st.columns([3, 1])
        with col_p:
            pwd = st.text_input(T("admin_pwd_label"), type="password",
                                 key="admin_pwd_input", label_visibility="collapsed",
                                 placeholder=T("admin_pwd_label"))
        with col_b:
            unlock = st.button(T("admin_pwd_btn"), type="primary",
                                key="admin_pwd_submit", use_container_width=True)
        if unlock:
            if pwd == ADMIN_PASSWORD:
                st.session_state.admin_unlocked = True
                st.rerun()
            else:
                st.error(T("admin_wrong_pwd"))
        st.caption(T("admin_pwd_hint"))
        return

    if st.button(T("admin_logout_btn"), key="admin_btn_logout"):
        st.session_state.admin_unlocked = False
        st.rerun()

    n_users = count_users()
    stats_ordini = count_orders()
    n_leads = count_locali_leads()

    c1, c2, c3, c4 = st.columns(4)
    c1.metric(T("admin_stat_users"), n_users)
    c2.metric(T("admin_stat_orders"), stats_ordini["n"])
    c3.metric(T("admin_stat_revenue"), f"{stats_ordini['totale']:.2f}€")
    c4.metric(T("admin_stat_leads"), n_leads)

    st.markdown("---")

    # ── Chi si è registrato ──
    st.markdown(T("admin_users_title"))
    users = get_all_users()
    if users:
        st.dataframe(
            users, use_container_width=True, hide_index=True,
            column_config={
                "id": "ID", "email": "Email", "nome": "Nome", "telefono": "Telefono",
                "citta": "Città", "indirizzo": "Indirizzo", "cap": "CAP",
                "created_at": "Registrato il",
            },
        )
    else:
        st.caption(T("admin_no_data"))

    # ── Ultime ricerche ──
    st.markdown(T("admin_searches_title"))
    searches = get_recent_searches_admin()
    if searches:
        st.dataframe(
            searches, use_container_width=True, hide_index=True,
            column_config={
                "piatto": "Piatto cercato", "created_at": "Data",
                "email": "Email utente", "nome": "Nome utente",
            },
        )
    else:
        st.caption(T("admin_no_data"))

    # ── Ultimi ordini ──
    st.markdown(T("admin_orders_title"))
    orders = get_recent_orders_admin()
    if orders:
        st.dataframe(
            orders, use_container_width=True, hide_index=True,
            column_config={
                "order_ref": "Rif. ordine", "nome_cliente": "Cliente", "email": "Email",
                "totale": st.column_config.NumberColumn("Totale €", format="%.2f€"),
                "stato": "Stato", "created_at": "Data",
            },
        )
    else:
        st.caption(T("admin_no_data"))

    # ── Richieste demo dai locali (B2B) ──
    st.markdown(T("admin_leads_title"))
    leads = get_all_locali_leads_admin()
    if leads:
        st.dataframe(
            leads, use_container_width=True, hide_index=True,
            column_config={
                "nome_locale": "Locale", "referente": "Referente", "email": "Email",
                "telefono": "Telefono", "citta": "Città", "tipo_locale": "Tipo",
                "n_coperti": "Coperti", "piano_interesse": "Piano", "note": "Note",
                "created_at": "Data",
            },
        )
    else:
        st.caption(T("admin_no_data"))


def main():
    if "lang" not in st.session_state:
        st.session_state.lang = "it"
    if "show_quiz" not in st.session_state:
        st.session_state.show_quiz = False

    init_db()
    seed_demo_account()
    render_sidebar()

    user = st.session_state.get("user")
    user_id = user["id"] if user else None

    # ── BARRA SITO: logo + tagline compatti, sempre visibili sopra il menu ──
    st.markdown(f"""
    <div class="site-topbar">
        <div class="site-logo">🍷 B<span>wine</span></div>
        <div class="site-tagline">{T('hero_tagline')}</div>
    </div>
    """, unsafe_allow_html=True)

    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        try: api_key = st.secrets.get("ANTHROPIC_API_KEY", "")
        except: pass
    if not api_key:
        st.warning(f"**{T('api_missing')}** · Imposta `ANTHROPIC_API_KEY` nei Secrets di Streamlit.")

    # ── MENU IN ALTO: tutte le funzioni raggiungibili da qui, "come un sito" ──
    n_cart = cart_count()
    cart_label = f"{T('nav_cart')} ({n_cart})" if n_cart else T('nav_cart')
    tab_home, tab_biz, tab_pair, tab_lab, tab_cul, tab_cat, tab_cart, tab_account, tab_contact, tab_admin = st.tabs([
        T('nav_home'),
        T('nav_business'),
        T('nav_pairing'),
        T('nav_lab'),
        T('nav_culinary'),
        T('nav_catalog'),
        cart_label,
        T('nav_account'),
        T('nav_contact'),
        T('nav_admin'),
    ])

    # ── TAB HOME ──
    with tab_home:
        _hero_bottles = "".join(
            f'<img src="{bottle_svg_data_uri(t)}" alt="{t}">'
            for t in ["Bianco", "Rosso", "Spumante"]
        )
        st.markdown(f"""
        <div class="hero">
            <h1>🍷 B<span>wine</span></h1>
            <p>{T('hero_sub')}</p>
            <div class="hero-bottles">{_hero_bottles}</div>
            <div class="hero-motto">{T('hero_tagline')}</div>
        </div>
        """, unsafe_allow_html=True)

        # Selettore unico "Chi sei?": copre sia i privati sia ogni tipologia
        # di locale (ristoranti, enoteche, wine bar, hotel, discoteche e
        # locali serali/notturni). In base alla scelta personalizziamo il CTA.
        PROFILI_UTENTE = ["privato", "ristorante", "enoteca", "serale", "hotel", "beach", "gruppo"]
        PROFILI_LABEL_KEY = {
            "privato": "who_private", "ristorante": "who_restaurant", "enoteca": "who_enoteca",
            "serale": "who_locale_serale", "hotel": "who_hotel", "beach": "who_beach", "gruppo": "who_gruppo",
        }
        with st.container(border=True):
            st.markdown(f"## {T('who_title')}")
            profilo = st.selectbox(
                T("who_label"),
                PROFILI_UTENTE,
                format_func=lambda pid: T(PROFILI_LABEL_KEY[pid]),
                key="profilo_utente_top",
            )
            st.session_state["profilo_utente"] = profilo

            if profilo == "privato":
                st.write(T("who_priv_desc"))
                st.caption(T("who_priv_caption"))
                if st.button(T("who_priv_cta"), type="primary", use_container_width=True, key="cta_priv_top"):
                    st.session_state["show_auth"] = True
                    st.info(T("who_priv_hint"))
            else:
                copy_key_map = {
                    "ristorante": "who_biz_desc_restaurant",
                    "enoteca": "who_biz_desc_enoteca",
                    "serale": "who_biz_desc_serale",
                    "hotel": "who_biz_desc_hotel",
                    "beach": "who_biz_desc_beach",
                    "gruppo": "who_biz_desc_gruppo",
                }
                st.write(T(copy_key_map.get(profilo, "who_biz_desc_default")))
                st.success(T("who_biz_trial"))
                if st.button(T("who_biz_cta"), type="primary", use_container_width=True, key="cta_biz_top"):
                    st.session_state["evidenzia_tab_locali"] = True
                    st.info(T("who_biz_hint"))

    # ── TAB ACCOUNT ──
    with tab_account:
        render_account_tab()

    # ── TAB CONTATTI ──
    with tab_contact:
        render_contact_tab()

    # ── TAB ADMIN ──
    with tab_admin:
        render_admin_tab()

    # ── TAB B2B: PER I LOCALI ──
    with tab_biz:
        render_business_tab()

    # ── TAB WINE LAB ──
    with tab_lab:
        render_wine_lab_tab(user_id)

    # ── TAB CONSIGLI CULINARI ──
    with tab_cul:
        render_culinary_tab()

    # ── TAB CARRELLO / CHECKOUT ──
    with tab_cart:
        render_cart_and_checkout(user_id, user.get("email","") if user else "")

    # ── TAB ABBINAMENTO ──
    with tab_pair:
        st.markdown(f"### {T('describe_dish')}")
        st.caption(T("dish_caption"))
        col_input, col_btn = st.columns([4, 1])
        with col_input:
            piatto = st.text_input("", placeholder=T("dish_placeholder"), label_visibility="collapsed")
        with col_btn:
            cerca = st.button(T("pair_btn"), key="main_search")

        modalita_rapida = st.checkbox(
            T("quick_mode"),
            key="modalita_rapida", value=False,
            help=T("quick_mode_help")
        )

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
            # Correttore automatico: ripulisce refusi comuni nei termini gastronomici
            # prima di mandare il testo all'analisi molecolare AI.
            piatto_corretto, piatto_e_stato_corretto = correggi_piatto(piatto)
            if piatto_e_stato_corretto:
                st.caption(f"✏️ Corretto automaticamente in: *{piatto_corretto}*")
            piatto = piatto_corretto

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
                    if modalita_rapida:
                        risultato = get_quick_rule_pairing(piatto, cat)
                    else:
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
                    # Memorizza l'ultima ricerca in sessione: usata dal tab Wine Lab
                    # per confrontare gli score "prima vs dopo" quando l'utente modifica il piatto.
                    st.session_state["last_piatto"] = piatto
                    st.session_state["last_abbinamenti"] = abbinamenti

                    with st.expander(T("molecular_analysis"), expanded=True):
                        ingredienti = analisi.get("ingredienti_identificati", [])
                        if ingredienti:
                            st.markdown(f"{T('ingredients_found')} " + " · ".join([f"`{i}`" for i in ingredienti]))

                        # Spiegazione in linguaggio semplice di ogni termine "tecnico" —
                        # molti utenti (soprattutto in un locale, non tra sommelier) non sanno
                        # cosa significhi "umami" o "volatili aromatici".
                        with st.expander("ℹ️ Cosa significano questi termini? (spiegazione semplice)", expanded=False):
                            st.markdown("""
- **🧈 Grassi** — quanto è "grasso"/burroso il piatto (burro, panna, fritture, formaggi grassi). Un vino acido "pulisce" la bocca dal grasso.
- **🥩 Proteine** — quanta carne, pesce o legumi ha il piatto. Più proteine → di solito serve un vino più strutturato.
- **🍋 Acidità** — quanto è "agro" il piatto (limone, pomodoro, aceto). Va abbinato a un vino con acidità simile o superiore, altrimenti il vino sembra piatto.
- **🌶️ Piccantezza** — quanto brucia il piatto. L'alcol alto amplifica il piccante: meglio vini a bassa gradazione, morbidi o leggermente dolci.
- **🫧 Umami** — è il cosiddetto "quinto gusto" (oltre a dolce, salato, acido, amaro): il sapore saporito, "di brodo", tipico di funghi, parmigiano, salsa di soia, pomodoro cotto a lungo, carne brasata. È difficile da abbinare: servono spesso vini con buona acidità o tannino leggero.
- **🍬 Dolcezza** — quanto è dolce il piatto. Regola d'oro: il vino deve essere dolce almeno quanto il piatto, mai meno, altrimenti sembra amaro.
- **⚗️ Complessità** — quanti sapori diversi convivono nel piatto. Più è complesso, più serve un vino versatile che non "combatta" con nessun ingrediente.
- **🌿 Volatili aromatici** — gli aromi che senti annusando il piatto (erbe, spezie, affumicato, agrumi). Il vino li deve richiamare o completare, non coprirli.
                            """)

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

                        mol_rows = [
                            ("🧈", T("fats"),      analisi.get("grassi","—")),
                            ("🥩", T("proteins"),   analisi.get("proteine","—")),
                            ("🍋", T("acidity"),    analisi.get("acidi","—")),
                            ("🌶️", T("spice"),      analisi.get("piccantezza","—")),
                            ("🫧", T("umami"),      analisi.get("umami","—")),
                            ("🍬", T("sweetness"),  analisi.get("tendenza_dolce","—")),
                            ("⚗️", T("complexity"), analisi.get("complessita","—")),
                        ]

                        st.markdown(T("dish_profile_title"))
                        for emoji, label, val in mol_rows:
                            pct = val_to_pct(val) / 100
                            c1, c2, c3 = st.columns([2, 5, 2])
                            with c1:
                                st.markdown(f"{emoji} **{label}**")
                            with c2:
                                st.progress(pct)
                            with c3:
                                val_short = str(val)[:30] if len(str(val)) > 30 else str(val)
                                st.caption(val_short)

                        volatili = ", ".join(analisi.get("volatili_aromatici",[])[:4]) or "—"
                        st.caption(f"🌿 **{T('volatiles')}:** {volatili}")

                        sfida = analisi.get("sfida_abbinamento","")
                        if sfida: st.info(f"{T('challenge')} {sfida}")

                    if consiglio:
                        st.info(f"{T('divino_suggests')} {consiglio}")

                    n = len(abbinamenti)
                    if n == 0:
                        st.warning(T("no_match_warning", piatto))
                    else:
                        st.markdown(T("n_pairing_title_single", piatto) if n == 1 else T("n_pairings_title", n, piatto))
                        for idx, abb in enumerate(abbinamenti):
                            wine = get_wine_by_id(abb.get("wine_id",""))
                            if wine:
                                render_wine_card(wine, abb, piatto, user_id, idx)
                            else:
                                # wine_id non trovato nel catalogo: segnala ma non crasha
                                wid = abb.get("wine_id","?")
                                st.info(T("wine_not_in_catalog", wid))

                    if not user_id:
                        st.info(T("register_cta"))

        elif cerca and not piatto:
            st.warning(T("write_dish"))

        # Footer monetizzazione nel tab abbinamento
        render_monetization_footer(user_id)

    # ── TAB CATALOGO ──
    with tab_cat:
        st.markdown(f"### {T('catalog_title')}")

        col_f1, col_f2, col_f3, col_f4, col_f5 = st.columns(5)
        with col_f1:
            ft = st.selectbox(T("wine_type"), T("types_cat"), key="ct")
        with col_f2:
            cont_opts_cat = {
                T("any"): None,
                "🇮🇹 Italia": "Italia",
                "🌍 Europa": "Europa",
                "🌎 Sud America": "Sud America",
                "🌎 Americhe (USA)": "Americhe",
                "🌏 Oceania": "Oceania",
                "🌏 Asia": "Asia",
            }
            fc_label = st.selectbox("🌍 Area / Continente", list(cont_opts_cat.keys()), key="cc")
            fc = cont_opts_cat[fc_label]

        with col_f3:
            # Regione dinamica in base al continente selezionato
            if fc == "Italia":
                it_regions_cat = [
                    "── Nord Ovest ──",
                    "Piemonte","Lombardia","Oltrepò Pavese","Liguria","Valle d'Aosta",
                    "── Nord Est ──",
                    "Veneto","Trentino-Alto Adige","Friuli-Venezia Giulia",
                    "── Centro ──",
                    "Toscana","Umbria","Marche","Lazio","Abruzzo",
                    "── Sud ──",
                    "Campania","Puglia","Calabria","Basilicata",
                    "── Isole ──",
                    "Sicilia","Sardegna",
                ]
                reg_nel_cat_it = set(w["regione"] for w in WINE_CATALOG if w["continente"] == "Italia")
                it_disp = [T("any")] + [r for r in it_regions_cat if r.startswith("──") or r in reg_nel_cat_it]
                fr_raw = st.selectbox("🗺️ Regione italiana", it_disp, key="cr")
                fr = T("any") if fr_raw.startswith("──") else fr_raw
            elif fc == "Europa":
                eu_c = sorted(set(w["regione"] for w in WINE_CATALOG if w["continente"] == "Europa"))
                fr = st.selectbox("🗺️ Paese europeo", [T("any")] + eu_c, key="cr")
            elif fc == "Sud America":
                sa_c = sorted(set(w["regione"] for w in WINE_CATALOG if w["continente"] == "Sud America"))
                fr = st.selectbox("🗺️ Paese", [T("any")] + sa_c, key="cr")
            elif fc == "Americhe":
                am_c = sorted(set(w["regione"] for w in WINE_CATALOG if w["continente"] == "Americhe"))
                fr = st.selectbox("🗺️ Stato / Regione", [T("any")] + am_c, key="cr")
            elif fc == "Oceania":
                oc_c = sorted(set(w["regione"] for w in WINE_CATALOG if w["continente"] == "Oceania"))
                fr = st.selectbox("🗺️ Paese", [T("any")] + oc_c, key="cr")
            elif fc == "Asia":
                as_c = sorted(set(w["regione"] for w in WINE_CATALOG if w["continente"] == "Asia"))
                fr = st.selectbox("🗺️ Paese", [T("any")] + as_c, key="cr")
            else:
                fr = st.selectbox("🗺️ Regione / Paese", [T("any")], key="cr")

        with col_f4:
            fascia_display_cat = ["Qualsiasi","Economico (<15€)","Standard (15–30€)","Premium (30–65€)","Lusso (>65€)"]
            fascia_map_cat = {"Economico (<15€)":"economico","Standard (15–30€)":"standard","Premium (30–65€)":"premium","Lusso (>65€)":"lusso"}
            ff_label = st.selectbox(T("price_band"), fascia_display_cat, key="cf")
            ff = fascia_map_cat.get(ff_label, None)

        with col_f5:
            tipo_map_inv_cat = {
                "Bianco":"Bianco","Rosso":"Rosso","Spumante":"Spumante","Rosato":"Rosato","Dolce":"Dolce",
                "White":"Bianco","Red":"Rosso","Sparkling":"Spumante","Rosé":"Rosato","Sweet":"Dolce",
            }

        cv = WINE_CATALOG.copy()
        if ft and ft not in [T("types_all"), "Tutti", "All", "Todos"]:
            ft_it = tipo_map_inv_cat.get(ft, ft)
            cv = [w for w in cv if w["tipo"] == ft_it]
        if fc:
            cv = [w for w in cv if w["continente"] == fc]
        if fr and fr != T("any"):
            cv = [w for w in cv if w["regione"] == fr]
        if ff:
            cv = [w for w in cv if w["fascia"] == ff]

        st.caption(T("showing_n", len(cv)))

        # Ordine continenti fisso e chiaro
        continenti_order = ["Italia", "Europa", "Sud America", "Americhe", "Oceania", "Asia"]
        continenti_presenti = [c for c in continenti_order if any(w["continente"] == c for w in cv)]

        for cont in continenti_presenti:
            wines_cont = [w for w in cv if w["continente"] == cont]

            # Per Italia: raggruppa per regione con intestazione
            if cont == "Italia":
                st.markdown(f'<div class="continent-header">🇮🇹 {cont} · {len(wines_cont)} vini</div>', unsafe_allow_html=True)
                # Ordine regioni Italia
                regioni_order_it = [
                    "Piemonte","Lombardia","Oltrepò Pavese","Liguria","Valle d'Aosta",
                    "Veneto","Trentino-Alto Adige","Friuli-Venezia Giulia",
                    "Toscana","Umbria","Marche","Lazio","Abruzzo",
                    "Campania","Puglia","Calabria","Basilicata","Sicilia","Sardegna"
                ]
                regioni_it = [r for r in regioni_order_it if any(w["regione"] == r for w in wines_cont)]
                for reg in regioni_it:
                    wines_reg = [w for w in wines_cont if w["regione"] == reg]
                    st.markdown(f'<div style="background:#f0e8e9;color:#3d0a10;padding:5px 14px;border-radius:6px;font-weight:700;font-size:0.85em;margin:14px 0 6px;">📍 {reg} · {len(wines_reg)} vini</div>', unsafe_allow_html=True)
                    cols = st.columns(3)
                    for i, w in enumerate(wines_reg):
                        with cols[i % 3]:
                            _render_catalog_card(w, T, user_id)
            else:
                # Per esteri: raggruppa per paese
                st.markdown(f'<div class="continent-header">🌍 {cont} · {len(wines_cont)} vini</div>', unsafe_allow_html=True)
                paesi = sorted(set(w["regione"] for w in wines_cont))
                for paese in paesi:
                    wines_paese = [w for w in wines_cont if w["regione"] == paese]
                    st.markdown(f'<div style="background:#e8f4fd;color:#063242;padding:5px 14px;border-radius:6px;font-weight:700;font-size:0.85em;margin:14px 0 6px;">🏳️ {paese} · {len(wines_paese)} vini</div>', unsafe_allow_html=True)
                    cols = st.columns(3)
                    for i, w in enumerate(wines_paese):
                        with cols[i % 3]:
                            _render_catalog_card(w, T, user_id)

            if len(wines_cont) > 30 and fr == T("any"):
                st.caption(T("showing", len(wines_cont)))


if __name__ == "__main__":
    main()
