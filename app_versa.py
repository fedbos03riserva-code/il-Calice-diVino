import streamlit as st

# Configurazione della pagina
st.set_page_config(
    page_title="Il Calice diVino - Un vero e proprio Sommelier a portata di click",
    page_icon="🍷",
    layout="centered"
)

# Stile CSS per un'interfaccia pulita, calda ed elegante
st.markdown("""
    <style>
    .main { background-color: #faf7f5; color: #2c2523; }
    .stButton>button {
        background-color: #5c1d24; color: white; border-radius: 8px;
        padding: 10px 24px; font-weight: bold; border: none; width: 100%;
    }
    .stButton>button:hover { background-color: #a03c46; color: white; }
    .title-panel {
        background-color: #5c1d24; padding: 25px; border-radius: 12px;
        text-align: center; color: white; margin-bottom: 25px;
    }
    .result-card {
        background-color: white; padding: 20px; border-radius: 10px;
        border-left: 5px solid #5c1d24; box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .badge-price { background-color: #d1e7dd; color: #0f5132; padding: 3px 8px; border-radius: 12px; font-size: 0.85em; font-weight: bold; }
    .badge-geo { background-color: #cff4fc; color: #055160; padding: 3px 8px; border-radius: 12px; font-size: 0.85em; font-weight: bold; }
    </style>
""", unsafe_allow_html=True)

# Header del sito
st.markdown("""
    <div class='title-panel'>
        <h1 style='margin:0; font-size:2.5em;'>🍷 Il Calice di Vino</h1>
        <p style='margin:5px 0 0 0; color:#dfc3c6; font-style:italic;'>La guida pratica per abbinare il vino al cibo • Copertura Nazionale e non...</p>
    </div>
""", unsafe_allow_html=True)

st.write("### 🧠 Trova l'abbinamento ideale senza complicazioni")
st.write("Inserisci il piatto, seleziona la regione italiana o straniera di tua preferenza e scopri i vini consigliati per ogni tasca, spiegati in modo semplice e legati a ciò che mangi.")


# INPUT UTENTE
piatto = st.text_input("🍽️ Cosa mangi oggi?", placeholder="Es: Pasta al salmone, Bistecca, Pizza, Sushi...")

# Creiamo 4 colonne affiancate per contenere tutti i filtri in modo compatto
col_prezzo, col_tipo, col_area, col_geo = st.columns(4)

with col_prezzo:
    prezzo_scelto = st.selectbox("💰 Filtra per Prezzo:", [
        "Mostra tutte le fasce",
        "Economica (<10€)",
        "Standard (10€ - 30€)",
        "Premium (>30€)"
    ])

with col_tipo:
    # Nuova tendina per la tipologia di vino richiesta
    tipo_scelto = st.selectbox("🎨 Tipo di Vino:", [
        "Qualsiasi Tipologia",
        "Vino Bianco",
        "Vino Rosso",
        "Bollicine / Spumante"
    ])

with col_area:
    # Prima scelta geografica: Italia o Estero
    area = st.selectbox("🌍 Scegli l'Area:", ["Italia", "Estero"])

with col_geo:
    # La quarta tendina cambia in automatico in base alla scelta dell'area
    if area == "Italia":
        regione = st.selectbox("🗺️ Seleziona la Regione:", [
            "Lombardia", "Piemonte", "Toscana", "Veneto", "Campania", "Sardegna",
            "Abruzzo", "Basilicata", "Calabria", "Emilia-Romagna", "Friuli-Venezia Giulia",
            "Lazio", "Liguria", "Marche", "Molise", "Puglia", "Sicilia", "Trentino-Alto Adige",
            "Umbria", "Valle d'Aosta"
        ])
    else:
        regione = st.selectbox("🗺️ Seleziona il Paese:", ["Francia", "Spagna"])
# DATABASE INTEGRALE NAZIONALE (3 VINI PER FASCIA X REGIONE - MAPPA DEL GUSTO E DEL CIBO)
# ==============================================================================
# LOGICA DI FUNZIONAMENTO: RILEVATORE MOLECOLARE DEL PIATTO
# ==============================================================================
if st.button("🚀 TROVA I VINI PERFETTI"):
    if not piatto:
        st.warning("Ehi! Scrivi cosa stai mangiando per calcolare i legami chimici dell'abbinamento!")
    else:
        st.write("---")
        
        # RILEVATORE INTELLIGENTE INCROCIATO RAFFINATO
        categoria = "generico"
        parola_piatto = piatto.lower()
        
        # 1. Dolci
        if any(k in parola_piatto for k in ["dolce", "torta", "tiramisu", "cioccolato", "biscotti", "pasticceria", "crostata", "dessert"]):
            categoria = "dolci"
            
        # 2. Pizza e focacce con pesce (es: pizza al tonno)
        elif any(k in parola_piatto for k in ["pizza", "focaccia", "panino"]) and any(k in parola_piatto for k in ["tonno", "pesce", "salmone", "frutti di mare", "acciughe", "sarde"]):
            categoria = "panificato_e_pesce"
            
        # 3. Primi con carne rossa / sughi pesanti (es: pasta al ragù, lasagne)
        elif any(k in parola_piatto for k in ["pasta", "lasagna", "tagliatelle", "gnocchi", "cannelloni"]) and any(k in parola_piatto for k in ["ragu", "carne", "cinghiale", "bolognese", "salsiccia"]):
            categoria = "carne_rossa"
            
        # 4. Pesce puro
        elif any(k in parola_piatto for k in ["salmone", "pesce", "tonno", "branzino", "scoglio", "sushi", "ostriche", "orata", "platessa", "frittura", "molluschi", "polpo", "calamari"]):
            categoria = "pesce"
            
        # 5. Carne Rossa pura
        elif any(k in parola_piatto for k in ["bistecca", "fiorentina", "tagliata", "manzo", "cinghiale", "filetto", "carne rossa", "hamburger"]):
            categoria = "carne_rossa"
            
        # 6. Carne Bianca (Ecco risolto l'inghippo di tacchino, vitello, ecc.)
        elif any(k in parola_piatto for k in ["pollo", "tacchino", "coniglio", "faraona", "maiale", "vitello", "arista"]):
            categoria = "carne_bianca"
            
        # 7. Primi leggeri / Risi
        elif any(k in parola_piatto for k in ["pasta", "riso", "risotto", "gnocchi", "tortellini", "ravioli"]):
            categoria = "primi_risi"
            
        # 8. Verdure e basi vegetariane semplici
        elif any(k in parola_piatto for k in ["verdure", "vegetariano", "insalata", "zuppa", "vellutata", "funghi", "asparagi", "carciofi", "pizza margherita", "pizza"]):
            categoria = "verdure"
            
        st.info(f"🔍 Tipo di piatto riconosciuto: **{categoria.upper().replace('_', ' ')}**. Cerco il vino perfetto...")

        # ==============================================================================
        # DATABASE INTEGRALE E STRUTTURATO (ITALIA ED ESTERO)
        # ==============================================================================
        database = {
            "pesce": {
                "Lombardia": [
                    {"nome": "Oltrepò Pavese Riesling DOC", "prezzo": "8.50€", "fascia": "Economica (<10€)", "tipo": "Vino Bianco", "connessione": "L'acido tartarico e malico del Riesling riducono il pH orale, disgregando i lipidi e azzerando la sensazione di unto dei pesci cotti in padella.", "gusto": "Teso, dritto, sferzata acida di idrocarburo leggero e lime."},
                    {"nome": "Lugana DOC", "prezzo": "14.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Bianco", "connessione": "Il salmone o il tonno contengono una forte frazione lipidica dolce. La sapidità del Lugana agisce per contrasto chimico, bilanciando la dolcezza senza coprire il piatto.", "gusto": "Morbido, avvolgente, strutturato, note di pesca bianca e finale minerale."},
                    {"nome": "Franciacorta Satèn DOCG", "prezzo": "36.00€", "fascia": "Premium (>30€)", "tipo": "Bollicine / Spumante", "connessione": "L'anidride carbonica ($CO_2$) del perlage finissimo agisce meccanicamente rimuovendo i residui proteici e cremosi dei sughi dalle papille gustative.", "gusto": "Setoso, cremoso, accenni di crosta di pane, burro fresco e agrumi caldi."}
                ],
                "Piemonte": [
                    {"nome": "Cortese dell'Alto Monferrato DOC", "prezzo": "7.80€", "fascia": "Economica (<10€)", "tipo": "Vino Bianco", "connessione": "L'elevata acidità fissa contrasta la tendenza dolce delle carni del pesce bianco, stimolando l'idratazione orale.", "gusto": "Secco, lineare, con spiccate note vegetali e di mela verde."},
                    {"nome": "Gavi di Gavi DOCG", "prezzo": "16.50€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Bianco", "connessione": "La presenza di sali estrattivi genera una risposta di sapidità che si unisce alle proteine dei primi allo scoglio, esaltandone l'umami.", "gusto": "Elegante, minerale, asciutto con un tocco finale di mandorla amara."},
                    {"nome": "Alta Langa Brut DOCG", "prezzo": "34.00€", "fascia": "Premium (>30€)", "tipo": "Bollicine / Spumante", "connessione": "La struttura da Pinot Nero sostiene zuppe di pesce o cotture ricche al forno, dove l'alcol scioglie l'untuosità da olio.", "gusto": "Intenso, profondo, aromi di crosta di pane, burro e nocciola tostata."}
                ],
                "Toscana": [
                    {"nome": "Chianti DOCG (Giovane)", "prezzo": "8.50€", "fascia": "Economica (<10€)", "tipo": "Vino Rosso", "connessione": "I tannini giovanili ma deboli del Sangiovese non generano sgradevoli deviazioni metalliche con lo iodio, ma domano la succulenza di zuppe come il caciucco.", "gusto": "Fresco, mediamente tannico, sa di ciliegia croccante e pepe nero."},
                    {"nome": "Vernaccia di San Gimignano DOCG", "prezzo": "12.50€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Bianco", "connessione": "I composti minerali salini derivanti dai suoli pliocenici riequilibrano la tendenza dolce degli amidi conditi con frutti di mare.", "gusto": "Asciutto, solido, minerale, con un tipico finale finemente ammandorlato."},
                    {"nome": "Vermentino di Bolgheri Superiore DOC", "prezzo": "31.00€", "fascia": "Premium (>30€)", "tipo": "Vino Bianco", "connessione": "La frazione alcolica pronunciata agisce come solvente naturale per i grassi del pesce alla griglia, sostenendo la fibra muscolare compatta.", "gusto": "Ricco, caldo, mediterraneo, sentori di erbe aromatiche e pesca gialla."}
                ],
                "Veneto": [
                    {"nome": "Soave Classico DOC", "prezzo": "9.50€", "fascia": "Economica (<10€)", "tipo": "Vino Bianco", "connessione": "L'equilibrio acido-sapido contrasta la tendenza dolce dei risotti di mare o dei pesci bianchi lessati.", "gusto": "Fresco, floreale, minerale con un finale di mandorla bianca."},
                    {"nome": "Valdobbiadene Prosecco Superiore DOCG", "prezzo": "13.50€", "fascia": "Standard (10€ - 30€)", "tipo": "Bollicine / Spumante", "connessione": "Il perlage vivace e la spinta acida detergono il palato dalla patina oleosa del pesce crudo (sushi o tartare).", "gusto": "Fruttato, mela verde croccante, pera e glicine, bollicina briosa."},
                    {"nome": "Lugana Riserva DOC (Veneto)", "prezzo": "32.00€", "fascia": "Premium (>30€)", "tipo": "Vino Bianco", "connessione": "L'alto estratto secco e la struttura evoluta reggono l'impatto molecolare di pesci impegnativi in umido o al forno.", "gusto": "Strutturato, caldo, complesso con note di pietra focaia e agrumi canditi."}
                ],
                "Campania": [
                    {"nome": "Falanghina del Sannio DOC", "prezzo": "9.00€", "fascia": "Economica (<10€)", "tipo": "Vino Bianco", "connessione": "L'acidità vulcanica taglia di netto l'unto della frittura di paranza o dei polipetti, asciugando la lingua.", "gusto": "Vivace, fresco, con intensi profumi di zagara, ginestra e mela verde."},
                    {"nome": "Fiano di Avellino DOCG", "prezzo": "15.50€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Bianco", "connessione": "La profonda mineralità marina si unisce alle proteine dei pesci al sale, esaltando l'umami del piatto.", "gusto": "Elegante, profondo, sentori minerali, note di nocciola tostata e miele."},
                    {"nome": "Greco di Tufo Riserva DOCG", "prezzo": "33.00€", "fascia": "Premium (>30€)", "tipo": "Vino Bianco", "connessione": "Bianco di straordinaria potenza estrattiva. L'alcol elevato dissolve i lipidi di zuppe di pesce molto strutturate.", "gusto": "Pieno, secco, caldo e intensamente minerale, quasi come un rosso mascherato."}
                ],
                "Sardegna": [
                    {"nome": "Vermentino di Sardegna DOC", "prezzo": "8.50€", "fascia": "Economica (<10€)", "tipo": "Vino Bianco", "connessione": "I richiami iodati e la freschezza citrica puliscono la bocca dalla pastosità dei primi conditi con sughi di mare.", "gusto": "Fresco, sottile, marino, con netti richiami di limone e salvia."},
                    {"nome": "Nuragus di Cagliari DOC", "prezzo": "12.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Bianco", "connessione": "L'acidità lineare esalta la delicatezza del pescato bianco al vapore, preservandone la texture morbida.", "gusto": "Molto asciutto, essenziale, sapido e delicatamente fruttato."},
                    {"nome": "Vermentino di Gallura Superiore DOCG", "prezzo": "32.00€", "fascia": "Premium (>30€)", "tipo": "Vino Bianco", "connessione": "La frazione alcolica importante avvolge e fluidifica i grassi densi di pesci al forno o salse a base di molluschi.", "gusto": "Caldo, rotondo, lunghissima persistenza di macchia mediterranea e mandorla."}
                ],
                "Francia": [
                    {"nome": "Muscadet Sèvre et Maine", "prezzo": "9.80€", "fascia": "Economica (<10€)", "tipo": "Vino Bianco", "connessione": "L'estrema acidità fissa (basso pH) mima l'azione del limone sul pesce crudo, legando le molecole saline.", "gusto": "Teso, affilato, dominato da note di lime e gesso."},
                    {"nome": "Chablis DOC (Borgogna)", "prezzo": "28.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Bianco", "connessione": "I suoli calcarei marini trasferiscono al vino una salinità atomica che si unisce alle proteine dei crostacei.", "gusto": "Affilato, minerale, sa di mela verde, pietra focaia e iodio."},
                    {"nome": "Champagne Brut", "prezzo": "45.00€", "fascia": "Premium (>30€)", "tipo": "Bollicine / Spumante", "connessione": "La tripla azione di acido tartarico, etanolo e pressione di $CO_2$ disgrega le molecole di grasso fitte delle fritture.", "gusto": "Complesso, con perlage finissimo, note di brioche tostata e agrumi nitidi."}
                ],
                "Spagna": [
                    {"nome": "Verdejo Rueda DO", "prezzo": "8.90€", "fascia": "Economica (<10€)", "tipo": "Vino Bianco", "connessione": "La freschezza vegetale pulisce i recettori orali dalla grassezza del pesce azzurro alla piastra.", "gusto": "Erbaceo, fresco, con sentori di fieno e melone bianco."},
                    {"nome": "Rías Baixas Albariño DO", "prezzo": "18.50€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Bianco", "connessione": "Vino atlantico che sposa la sapidità di paella de marisco, polpo e molluschi ricchi di sodio.", "gusto": "Salino, vibrante, con profumi intensi di albicocca e agrumi."},
                    {"nome": "Cava Gran Reserva DO", "prezzo": "35.00€", "fascia": "Premium (>30€)", "tipo": "Bollicine / Spumante", "connessione": "Metodo classico iberico, le cui bollicine asportano meccanicamente i lipidi da fritture o pesci in pastella.", "gusto": "Secco, evoluto, con note di frutta secca tostata, nocciola e mela cotta."}
                ],
                "Abruzzo": [{"nome": "Trebbiano d'Abruzzo DOC", "prezzo": "8.00€", "fascia": "Economica (<10€)", "tipo": "Vino Bianco", "connessione": "L'acidità fissa mima la goccia di limone sul pesce bianco bollito.", "gusto": "Fresco, lineare, sa di mela gialla e fiori bianchi."}],
                "Basilicata": [{"nome": "Matera Greco DOC", "prezzo": "12.50€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Bianco", "connessione": "La spinta sapida contrasta la tendenza dolce di risotti e paste alle vongole.", "gusto": "Asciutto, minerale, con note di pesca bianca."}],
                "Calabria": [{"nome": "Cirò Bianco DOC", "prezzo": "9.00€", "fascia": "Economica (<10€)", "tipo": "Vino Bianco", "connessione": "La mineralità marina pulisce la bocca dal pesce azzurro cotto alla piastra.", "gusto": "Sapido, fresco, con sentori di erbe di campo e agrumi."}],
                "Emilia-Romagna": [{"nome": "Pignoletto Frizzante DOCG", "prezzo": "8.50€", "fascia": "Economica (<10€)", "tipo": "Bollicine / Spumante", "connessione": "La bollicina rimuove meccanicamente l'unto di antipasti di mare fritti.", "gusto": "Brioso, leggero, note di pera e gelsomino."}],
                "Friuli-Venezia Giulia": [{"nome": "Friulano DOC", "prezzo": "16.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Bianco", "connessione": "L'ottima struttura avvolge crostacei importanti (scampi, canocchie) esaltandone la polpa.", "gusto": "Morbido, minerale, con un netto finale di mandorla amara."}],
                "Lazio": [{"nome": "Frascati Superiore DOCG", "prezzo": "11.50€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Bianco", "connessione": "Bilancia la tendenza dolce della pasta con sughi di pesce della tradizione tirrenica.", "gusto": "Equilibrato, sapido, con ritorni di frutta a polpa bianca."}],
                "Liguria": [{"nome": "Pigato Riviera Ligure DOC", "prezzo": "18.50€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Bianco", "connessione": "Le note aromatiche e resinose sposano pesci cotti con erbe aromatiche e olio d'oliva.", "gusto": "Intenso, marino, con richiami di pino silvestre e pesca."}],
                "Marche": [{"nome": "Verdicchio dei Castelli di Jesi DOCG", "prezzo": "13.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Bianco", "connessione": "La straordinaria spina acida contrasta i grassi di brodetti di pesce e cotture in umido.", "gusto": "Strutturato, teso, sa di mela verde, mandorla e pietra focaia."}],
                "Molise": [{"nome": "Molise Falanghina DOC", "prezzo": "8.50€", "fascia": "Economica (<10€)", "tipo": "Vino Bianco", "connessione": "Rinfresca il palato durante il consumo di zuppe di pesce semplici o pesci al cartoccio.", "gusto": "Semplice, beva immediata, fruttato e floreale."}],
                "Puglia": [{"nome": "Salento Verdeca IGT", "prezzo": "9.50€", "fascia": "Economica (<10€)", "tipo": "Vino Bianco", "connessione": "La freschezza minerale pulisce la bocca da crudi di mare, ostriche e cozze.", "gusto": "Asciutto, agrumato, con note di fieno e mela bianca."}],
                "Sicilia": [{"nome": "Etna Bianco DOC", "prezzo": "19.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Bianco", "connessione": "La sapidità lavica si fonde con la sapidità di pesci nobili (pesce spada o ricciola).", "gusto": "Verticale, profondo, minerale con note di limone e polvere da sparo."}],
                "Trentino-Alto Adige": [{"nome": "Alto Adige Gewürztraminer DOC", "prezzo": "21.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Bianco", "connessione": "La prorompente aromaticità contrasta piatti speziati di mare, sushi o crostacei dolci.", "gusto": "Intensamente aromatico, sa di litchi, rosa canina e chiodi di garofano."}],
                "Umbria": [{"nome": "Cervaro della Sala IGT", "prezzo": "52.00€", "fascia": "Premium (>30€)", "tipo": "Vino Bianco", "connessione": "Lo Chardonnay affinato in legno regge chimicamente l'impatto di aragoste o salse complesse.", "gusto": "Immenso, burroso, avvolgente con note di vaniglia, nocciola e agrumi dolci."}],
                "Valle d'Aosta": [{"nome": "Vallée d'Aoste Petite Arvine DOC", "prezzo": "19.50€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Bianco", "connessione": "La proverbiale scossa salina di questo vitigno alpino pulisce la bocca da pesci d'acqua dolce.", "gusto": "Fresco, sapido come l'acqua marina, con note di pompelmo rosa."}]
            },
            "generico": {
                "Lombardia": [
                    {"nome": "Bonarda dell'Oltrepò Pavese DOC", "prezzo": "7.50€", "fascia": "Economica (<10€)", "tipo": "Vino Rosso", "connessione": "La micro-frizzantezza giovanile rompe i legami dei lipidi densi depositati sul palato da insaccati o pizze saporite.", "gusto": "Brioso, vinoso, un'esplosione di uva rossa fresca e ciliegia."},
                    {"nome": "Curtefranca Rosso DOC", "prezzo": "15.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "I tannini gentili estratti dal legno reagiscono con le proteine dei sughi, inducendo una leggera asciugatura salivare.", "gusto": "Equilibrato, vellutato, con note di piccoli frutti rossi e spezie fini."},
                    {"nome": "Sfursat di Valtellina DOCG", "prezzo": "38.00€", "fascia": "Premium (>30€)", "tipo": "Vino Rosso", "connessione": "La massiccia gradazione alcolica e i tannini terziari domano le fibre dure di brasati o selvaggina.", "gusto": "Caldo, imponente, con note di prugna secca, cannella e cacao amaro."}
                ],
                "Piemonte": [
                    {"nome": "Dolcetto d'Alba DOC", "prezzo": "9.00€", "fascia": "Economica (<10€)", "tipo": "Vino Rosso", "connessione": "Tannini a catena corta, morbidi e poco aggressivi. Asciugano la bocca dalle proteine di carni magre senza graffiare.", "gusto": "Morbido, vinoso, fruttato con un tipico finale di mandorla fresca."},
                    {"nome": "Barbera d'Asti DOCG Superiore", "prezzo": "16.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "Questo vino compensa l'assenza di tannino con un'altissima concentrazione di acido malico che taglia di netto i grassi solidi delle lasagne.", "gusto": "Vibrante, succoso, concentrato, sa di prugna nera e mora selvatica."},
                    {"nome": "Barolo DOCG", "prezzo": "42.00€", "fascia": "Premium (>30€)", "tipo": "Vino Rosso", "connessione": "I tannini fitti del vitigno Nebbiolo si legano alla proteina della saliva e ai succhi liberi della carne al sangue, creando armonia.", "gusto": "Austero, monumentale, con note di rosa appassita, cuoio, tabacco e liquirizia."}
                ],
                "Toscana": [
                    {"nome": "Chianti DOCG", "prezzo": "8.50€", "fascia": "Economica (<10€)", "tipo": "Vino Rosso", "connessione": "Il perfetto bilanciamento tra l'alcol e l'acidità naturale del Sangiovese disidrata la succulenza indotta da ragù tradizionali.", "gusto": "Fresco, asciutto, immediato, con note di marasca e pepe nero."},
                    {"nome": "Chianti Classico DOCG", "prezzo": "18.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "I polifenoli della macro-struttura bloccano l'iper-salivazione causata dalle carni rosse grasse, ripristinando la pulizia.", "gusto": "Armonico, profondo, con sentori di viola, spezie scure e legno nobile."},
                    {"nome": "Brunello di Montalcino DOCG", "prezzo": "48.00€", "fascia": "Premium (>30€)", "tipo": "Vino Rosso", "connessione": "La lunga polimerizzazione dei tannini li rende vellutati ma potentissimi. Fondono la massima espressione lipidica della Fiorentina.", "gusto": "Sontuoso, caldo, infinito, con note di cioccolato fondente, vaniglia e frutti scuri maturi."}
                ],
                "Veneto": [
                    {"nome": "Bardolino DOC", "prezzo": "8.00€", "fascia": "Economica (<10€)", "tipo": "Vino Rosso", "connessione": "Rosso a bassa concentrazione polifenolica. Non aggredisce i piatti magri o le preparazioni quotidiane.", "gusto": "Sottile, fresco, con sentori di fragolina di bosco e cannella."},
                    {"nome": "Valpolicella Ripasso DOC", "prezzo": "19.50€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "Il leggero residuo zuccherino e la morbidezza glicerica bilanciano la sapidità di arrosti e formaggi stagionati.", "gusto": "Avvolgente, sa di amarena sotto spirito, confettura e spezie dolci."},
                    {"nome": "Amarone della Valpolicella DOCG", "prezzo": "45.00€", "fascia": "Premium (>30€)", "tipo": "Vino Rosso", "connessione": "Struttura alcolica imponente che funge da solvente biologico per i grassi saturi di stracotti e stufati.", "gusto": "Caldo, robusto, trionfo di confettura di prugne, uvetta, cacao e tabacco scuro."}
                ],
                "Campania": [
                    {"nome": "Sannio Aglianico DOC", "prezzo": "9.50€", "fascia": "Economica (<10€)", "tipo": "Vino Rosso", "connessione": "Il tannino giovane e l'acidità sferzante ripuliscono la bocca dai grassi delle carni di maiale o salsicce.", "gusto": "Rustico, deciso, ricco di frutti neri, terra e pepe nero."},
                    {"nome": "Lacryma Christi Rosso DOC", "prezzo": "14.50€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "La mineralità vulcanica si sposa alla perfezione con i grassi filanti della mozzarella sulla pizza margherita.", "gusto": "Morbido, minerale, con note di prugna, cenere e piccoli frutti rossi."},
                    {"nome": "Taurasi DOCG", "prezzo": "38.00€", "fascia": "Premium (>30€)", "tipo": "Vino Rosso", "connessione": "Vino dalla potenza polifenolica colossale; i suoi tannini domano le carni rosse più succulente e la cacciagione.", "gusto": "Austero, maestoso, sa di marasca sotto spirito, polvere di caffè e fumo."}
                ],
                "Sardegna": [
                    {"nome": "Monica di Sardegna DOC", "prezzo": "8.00€", "fascia": "Economica (<10€)", "tipo": "Vino Rosso", "connessione": "Rosso morbido a bassa acidità, ideale per assecondare la consistenza di primi piatti al sugo semplici.", "gusto": "Beva facile, vellutato, dominato da frutti rossi caldi e prugna fresca."},
                    {"nome": "Cannonau di Sardegna DOC", "prezzo": "15.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "L'elevato tenore alcolico contrasta la grassezza e sostiene la struttura complessa di carni grigliate.", "gusto": "Caldo, robusto, speziato con note di prugna secca e sottobosco."},
                    {"nome": "Turriga IGT", "prezzo": "75.00€", "fascia": "Premium (>30€)", "tipo": "Vino Rosso", "connessione": "Un monumento polifenolico sardo. Richiede piatti sontuosi come il maialetto arrosto per scaricare la sua energia tannica.", "gusto": "Immenso, vellutato, note di macchia mediterranea, tabacco e more nere."}
                ],
                "Francia": [
                    {"nome": "Côtes-du-Rhône Rouge", "prezzo": "9.50€", "fascia": "Economica (<10€)", "tipo": "Vino Rosso", "connessione": "Un rosso speziato che esalta la sapidità di hamburger, carni alla griglia e spezzatini leggeri.", "gusto": "Rotondo, speziato, sa di frutti neri e pepe."},
                    {"nome": "Bordeaux Supérieur", "prezzo": "22.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "L'equilibrio tra Cabernet e Merlot pulisce il palato da arrosti di manzo o agnello.", "gusto": "Elegante, asciutto, con note di ribes nero, legno nobile e grafite."},
                    {"nome": "Châteauneuf-du-Pape", "prezzo": "55.00€", "fascia": "Premium (>30€)", "tipo": "Vino Rosso", "connessione": "La straordinaria potenza alcolica e speziata sostiene stufati complessi e cacciagione.", "gusto": "Caldo, sontuoso, sentori di liquirizia, prugna e cuoio."}
                ],
                "Spagna": [
                    {"nome": "Tempranillo La Mancha DO", "prezzo": "7.50€", "fascia": "Economica (<10€)", "tipo": "Vino Rosso", "connessione": "Vino dritto e fruttato, ottimo per ripulire la bocca da tapas di carne e salumi.", "gusto": "Morbido, succoso, sa di fragola matura e spezie dolci."},
                    {"nome": "Rioja Crianza DO", "prezzo": "16.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "L'affinamento in legno asciuga i grassi di grigliate miste e arrosti di maiale.", "gusto": "Equilibrato, con note di vaniglia, cocco e ciliegie mature."},
                    {"nome": "Priorat DOCa Tinto", "prezzo": "45.00€", "fascia": "Premium (>30€)", "tipo": "Vino Rosso", "connessione": "Rosso da suoli di ardesia, concentratissimo, ideale per tagli di carne rossa pregiata alla brace.", "gusto": "Potente, minerale, molto profondo, sa di liquirizia e mirtilli neri."}
                ],
                "Abruzzo": [{"nome": "Montepulciano d'Abruzzo DOC", "prezzo": "8.50€", "fascia": "Economica (<10€)", "tipo": "Vino Rosso", "connessione": "Il tannino solido asciuga la bocca dalla succulenza di carni alla griglia.", "gusto": "Morbido, caldo, ricco di marasca e prugna matura."}],
                "Basilicata": [{"nome": "Aglianico del Vulture DOC", "prezzo": "16.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "La freschezza minerale e i tannini serrati puliscono la bocca da stufati speziati.", "gusto": "Austero, minerale, frutti neri caldi, cioccolato fondente e liquirizia."}],
                "Calabria": [{"nome": "Cirò Rosso DOC", "prezzo": "11.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "I tannini del vitigno Gaglioppo asciugano il palato dalle carni di maiale al sugo.", "gusto": "Asciutto, caldo, speziato con note di tabacco e piccoli frutti rossi."}],
                "Emilia-Romagna": [{"nome": "Lambrusco Grasparossa DOC", "prezzo": "7.80€", "fascia": "Economica (<10€)", "tipo": "Vino Rosso", "connessione": "L'anidride carbonica ($CO_2$) naturale e l'acidità sgrassano la bocca da salumi e lasagne.", "gusto": "Frizzante, vinoso, sapido, trionfo di frutti rossi freschi."}],
                "Friuli-Venezia Giulia": [{"nome": "Schioppettino DOC", "prezzo": "24.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "La nota speziata biologica si sposa alla perfezione con arrosti saporiti al forno.", "gusto": "Elegante, fresco, caratterizzato da note intense di pepe nero."}],
                "Lazio": [{"nome": "Cesanese del Piglio DOCG", "prezzo": "13.50€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "I tannini equilibrati puliscono la bocca dall'unto di piatti saporiti di carne.", "gusto": "Morbido, sapido, con sentori di visciola, liquirizia e sottobosco."}],
                "Liguria": [{"nome": "Rossese di Dolceacqua DOC", "prezzo": "17.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "Rosso leggero, perfetto per non coprire carni bianche saporite o coniglio.", "gusto": "Sottile, sapido, con aromi di fragolina e erbe aromatiche."}],
                "Marche": [{"nome": "Rosso Conero DOC", "prezzo": "9.50€", "fascia": "Economica (<10€)", "tipo": "Vino Rosso", "connessione": "Il Montepulciano dona morbidezza e polifenoli adatti ad asciugare la bocca da grigliate.", "gusto": "Rotondo, caldo, con tannini morbidi e profumi di visciola."}],
                "Molise": [{"nome": "Tintilia del Molise DOC", "prezzo": "15.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "Vino speziato, ideale per contrastare primi al ragù o formaggi saporiti.", "gusto": "Caldo, morbido, spiccatamente speziato con note di pepe nero."}],
                "Puglia": [{"nome": "Primitivo di Manduria DOC", "prezzo": "14.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "L'elevata morbidezza glicerica e l'alcol avvolgono la sapidità di carni rosse pugliesi.", "gusto": "Morbido, caldissimo, potente, note di prugna disidratata e vaniglia."}],
                "Sicilia": [{"nome": "Etna Rosso DOC", "prezzo": "22.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "Il vitigno Nerello Mascalese ha tannini finissimi e un'acidità minerale tagliente, ottima per lasagne.", "gusto": "Elegante, fresco, sa di piccoli frutti rossi, spezie fini, grafite e cenere."}],
                "Trentino-Alto Adige": [{"nome": "Alto Adige Pinot Nero DOC", "prezzo": "19.50€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "L'acidità vibrante e i tannini setosi puliscono la bocca da taglieri di speck o arrosti.", "gusto": "Elegante, fine, sa di piccoli frutti rossi come lampone e ribes."}],
                "Umbria": [{"nome": "Sagrantino di Montefalco DOCG", "prezzo": "36.00€", "fascia": "Premium (>30€)", "tipo": "Vino Rosso", "connessione": "I tannini titanici necessitano di carni succulente (cinghiale, brasati) per ammorbidirsi.", "gusto": "Austero, potentissimo, sa di more di rovo, tabacco e spezie scure."},],
                "Valle d'Aosta": [{"nome": "Vallée d'Aoste Torrette DOC", "prezzo": "12.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "Rosso alpino fresco e scattante, ideale per sgrassare taglieri di formaggi e salumi.", "gusto": "Fresco, asciutto, vinoso, con note di rosa selvatica."}]
            },
            "carne_bianca": {
                "Piemonte": [
                    {"nome": "Roero Arneis DOCG", "prezzo": "13.50€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Bianco", "connessione": "Le carni bianche hanno fibre delicate. L'Arneis offre una struttura glicerica media che avvolge il pollo senza aggredirlo.", "gusto": "Morbido, fresco, con note di pera, camomilla e un finale ammandorlato."}
                ],
                "Toscana": [
                    {"nome": "Chianti Classico DOCG", "prezzo": "18.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Rosso", "connessione": "Se la carne bianca è cucinata in umido o alla cacciatora, il Chianti Classico asciuga l'unto senza sovrastarla.", "gusto": "Elegante, speziato, con ricordi di viola e marasca."}
                ]
            },
            "primi_risi": {
                "Lombardia": [
                    {"nome": "Oltrepò Pavese Pinot Nero Metodo Classico DOCG", "prezzo": "24.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Bollicine / Spumante", "connessione": "I primi mantecati (zafferano/burro) creano una barriera lipidica. La $CO_2$ di questa bollicina spezza i legami dei grassi.", "gusto": "Fresco, verticale, sapido, con sentori di piccoli frutti rossi e crosta di pane."}
                ],
                "Campania": [
                    {"nome": "Fiano di Avellino DOCG", "prezzo": "15.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Bianco", "connessione": "La tendenza dolce e pastosa degli amidi del riso o della pasta richiede la scossa salina ed estrattiva del Fiano.", "gusto": "Elegante, minerale, con sentori di nocciola tostata e idrocarburo."}
                ]
            },
            "verdure": {
                "Trentino-Alto Adige": [
                    {"nome": "Alto Adige Sauvignon DOC", "prezzo": "16.50€", "fascia": "Standard (10€ - 30€)", "tipo": "Vino Bianco", "connessione": "Le verdure contengono molecole aromatiche piraziniche. Il Sauvignon, condividendole per concordanza, si fonde con il piatto.", "gusto": "Intenso, fresco, con note di foglia di pomodoro, sambuco e pompelmo rosa."}
                ],
                "Veneto": [
                    {"nome": "Bardolino Chiaretto DOC (Rosato)", "prezzo": "9.00€", "fascia": "Economica (<10€)", "tipo": "Vino Bianco", "connessione": "Per vellutate o piatti vegetariani con funghi, questo rosato offre freschezza e zero tannini, assecondando il cibo.", "gusto": "Fresco, agrumato, sa di lampone e piccoli fiori di campo."}
                ]
            },
            "dolci": {
                "Piemonte": [
                    {"nome": "Moscato d'Asti DOCG", "prezzo": "11.00€", "fascia": "Standard (10€ - 30€)", "tipo": "Bollicine / Spumante", "connessione": "Regola d'oro: il dolce richiama il dolce. Gli zuccheri residui del Moscato si sposano per concordanza molecolare con la pasticceria.", "gusto": "Dolce, aromatico, spumeggiante, note intense di pesca, salvia e miele."},
                    {"nome": "Brachetto d'Acqui DOCG", "prezzo": "9.50€", "fascia": "Economica (<10€)", "tipo": "Vino Rosso", "connessione": "Perfetto per dolci a base di frutti rossi o cioccolato leggero. La dolcezza rossa avvolge la pastosità del dessert.", "gusto": "Dolce, frizzante, dal colore rubino, profumatissimo di rosa e fragola."}
                ],
                "Francia": [
                    {"nome": "Sauternes AOC", "prezzo": "48.00€", "fascia": "Premium (>30€)", "tipo": "Vino Bianco", "connessione": "Vino da uve colpite da muffa nobile. La concentrazione di zuccheri sposa dolci complessi o formaggi erborinati ricchi.", "gusto": "Dolce, opulento, immenso, note di zafferano, albicocca secca e miele."}
                ]
            }
        }

        # ==============================================================================
        # ESECUZIONE DEI FILTRI INCROCIATI E OUTPUT
        # ==============================================================================
        if regione in database.get(categoria, {}):
            vini_filtrati = database[categoria][regione]
            
            # FILTRO 1: Prezzo
            if prezzo_scelto != "Mostra tutte le fasce":
                vini_filtrati = [v for v in vini_filtrati if v['fascia'] == prezzo_scelto]
            
            # FILTRO 2: Colore / Tipologia
            if tipo_scelto != "Qualsiasi Tipologia":
                vini_filtrati = [v for v in vini_filtrati if v['tipo'] == tipo_scelto]
            
            # Controllo risultati
            if len(vini_filtrati) == 0:
                st.warning("Nessun vino trovato con questa combinazione di prezzo e colore per la zona selezionata. Prova ad allargare i filtri!")
            else:
                termine_geo = "dalla regione" if area == "Italia" else "dal Paese"
                st.success(f"Ecco le migliori soluzioni molecolari trovate in **{regione}** {termine_geo} per il tuo piatto:")
                
                # Renderizzazione grafica delle schede dei vini
                for v in vini_filtrati:
                    st.markdown(f"""
                        <div class='result-card'>
                            <h2 style='margin:0 0 10px 0; font-size:1.5em; color:#5c1d24;'>🍷 {v['nome']}</h2>
                            <p>
                                <span class='badge-price'>{v['fascia']} ({v['prezzo']})</span> &nbsp; 
                                <span class='badge-colore'>{v['tipo']}</span> &nbsp; 
                                <span class='badge-geo'>Provenienza: {regione}</span>
                            </p>
                            <hr style='border:0; border-top:1px solid #e8ded9; margin:10px 0;'>
                            <p><strong>🔬 Reazione Chimica nel Palato:</strong><br>{v['connessione']}</p>
                            <p><strong>👅 Profilo Organolettico (Gusto):</strong><br>{v['gusto']}</p>
                        </div>
                    """, unsafe_allow_html=True)
                    
                    # Generatore automatico del link di ricerca Google Shopping / Ecommerce
                    search_url = f"https://www.google.com/search?q={v['nome'].replace(' ', '+')}+prezzo+online"
                    st.markdown(f'<a href="{search_url}" target="_blank"><button style="background-color:#2c2523; color:white; border:none; padding:8px; border-radius:5px; width:100%; font-weight:bold; cursor:pointer; margin-bottom:25px;">🛒 CERCA AL PREZZO MINIMO ONLINE</button></a>', unsafe_allow_html=True)
        else:
            # Fallback intelligente (Se la regione/categoria scelta non ha ancora dati inseriti nel database)
            st.warning(f"La zona {regione} è in corso di mappatura biochimica per questo specifico piatto. Ecco una soluzione jolly di sicuro successo:")
            st.markdown("""
                <div class='result-card'>
                    <h2 style='margin:0 0 10px 0; font-size:1.5em; color:#5c1d24;'>🍷 Prosecco Superiore di Valdobbiadene DOCG</h2>
                    <p><span class='badge-price'>Fascia Standard (Prezzo: ~ 12.50€)</span> &nbsp; <span class='badge-colore'>Bollicine / Spumante</span> &nbsp; <span class='badge-geo'>Provenienza: Veneto (Italia)</span></p>
                    <hr style='border:0; border-top:1px solid #e8ded9; margin:10px 0;'>
                    <p><strong>🔬 Reazione Chimica nel Palato:</strong><br>Le molecole di anidride carbonica ($CO_2$) agiscono come tensioattivo in sinergia con l'acido tartarico: dissolvono la patina lipidica lasciata dai condimenti e resettano l'idratazione delle papille gustative a ogni singolo sorso.</p>
                </div>
            """, unsafe_allow_html=True)

# LOGICA DI FUNZIONAMENTO DEL SITO

        
        # Identifico la macro-categoria del piatto inserito
        categoria = "generico"
        if any(keyword in piatto.lower() for keyword in ["salmone", "pesce", "tonno", "branzino", "scoglio", "sushi"]):
            categoria = "pesce"
            
        st.info(f"🔍 Analisi chimica del piatto completata. Categoria rilevata: **{categoria.upper()}**. Ricerca vini in corso...")
        
        # Estraggo i vini per la selezione scelta
        regioni_db = database.get(categoria, {})
        
        if regione in regioni_db:
            vini_filtrati = regioni_db[regione]
            
            # Filtro in base alla fascia di prezzo scelta dall'utente
            if prezzo_scelto != "Mostra tutte le fasce":
                vini_filtrati = [v for v in vini_filtrati if v['fascia'] == prezzo_scelto]
            
            if len(vini_filtrati) == 0:
                st.warning("Nessun vino trovato per questa specifica fascia di prezzo. Prova a selezionare 'Mostra tutte le fasce'!")
            else:
                termine_geo = "dalla regione" if area == "Italia" else "dal Paese"
                st.success(f"Ecco le migliori opzioni trovate in **{regione}** {termine_geo} ideali per il tuo piatto:")
                
               
                    # Generazione automatica del link di acquisto per il vino specifico
                    search_url = f"https://www.google.com/search?q={v['nome'].replace(' ', '+')}+prezzo+online"
                    st.markdown(f'<a href="{search_url}" target="_blank"><button style="background-color:#2c2523; color:white; border:none; padding:8px; border-radius:5px; width:100%; font-weight:bold; cursor:pointer; margin-bottom:25px;">🛒 CERCA AL PREZZO MINIMO ONLINE</button></a>', unsafe_allow_html=True)
        else:
            # Fallback se la regione selezionata non ha ancora vini inseriti in quella categoria
            st.warning(f"La zona {regione} è in corso di mappatura per questa categoria di cibo. Ecco una scelta jolly di sicuro successo:")
            st.markdown("""
                <div class='result-card'>
                    <h2 style='margin:0 0 10px 0; font-size:1.5em; color:#5c1d24;'>🍷 Prosecco Superiore di Valdobbiadene DOCG</h2>
                    <p>
                        <span class='badge-price'>Fascia Standard (~ 12.50€)</span> &nbsp; 
                        <span class='badge-colore'>Bollicine / Spumante</span> &nbsp; 
                        <span class='badge-geo'>Provenienza: Veneto (Italia)</span>
                    </p>
                    <hr style='border:0; border-top:1px solid #e8ded9; margin:10px 0;'>
                    <p><strong>🤔 Perché si abbina al piatto?</strong><br>Il jolly perfetto per non sbagliare mai. La bollicina allegra cancella la pesantezza del cibo, pulisce la lingua dall'olio o dai grassi e ti rinfresca la bocca a ogni singolo sorso.</p>
                </div>
            """, unsafe_allow_html=True)
