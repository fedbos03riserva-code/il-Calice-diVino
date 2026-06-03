import streamlit as st

# Configurazione della pagina
st.set_page_config(
    page_title="Il Calice di Vino - Il Sommelier Tascabile",
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
        <p style='margin:5px 0 0 0; color:#dfc3c6; font-style:italic;'>La guida pratica per abbinare il vino al cibo • Copertura Nazionale</p>
    </div>
""", unsafe_allow_html=True)

st.write("### 🧠 Trova l'abbinamento ideale senza complicazioni")
st.write("Inserisci il piatto, seleziona la regione d'Italia e scopri i vini consigliati per ogni tasca, spiegati in modo semplice e legati a ciò che mangi.")

# INPUT UTENTE
# INPUT UTENTE
piatto = st.text_input("🍽️ Cosa mangi stasera?", placeholder="Es: Pasta al salmone, Bistecca, Pizza, Sushi...")

col1, col2, col3 = st.columns(3)

with col1:
    prezzo_scelto = st.selectbox("💰 Filtra per Prezzo:", [
        "Mostra tutte le fasce",
        "Economica (<10€)",
        "Standard (10€ - 30€)",
        "Premium (>30€)"
    ])

with col2:
    # Prima scelta: Italia o Estero
    area = st.selectbox("🌍 Scegli l'Area:", ["Italia", "Estero"])

with col3:
    # La terza tendina cambia da sola in base a cosa hai scelto nella seconda!
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
database = {
    "pesce": {
        "Lombardia": [
            {"nome": "Oltrepò Pavese Riesling DOC", "prezzo": "8.50€", "fascia": "Economica (<10€)", "connessione": "L'acidità dritta taglia la grassezza naturale del pesce, ripulendo la bocca.", "gusto": "Fresco, agrumato, con note intense di mela verde."},
            {"nome": "Lugana DOC", "prezzo": "14.00€", "fascia": "Standard (10€ - 30€)", "connessione": "Il corpo morbido avvolge i pesci più ricchi (salmone/tonno) senza sovrastarli.", "gusto": "Morbido, con sentori di pesca bianca e mandorla."},
            {"nome": "Franciacorta Satèn DOCG", "prezzo": "36.00€", "fascia": "Premium (>30€)", "connessione": "La bollicina setosa sgrassa i sughi complessi creandone un contrasto perfetto.", "gusto": "Note di crosta di pane e vellutata freschezza."}
        ],
        "Piemonte": [
            {"nome": "Cortese dell'Alto Monferrato DOC", "prezzo": "7.80€", "fascia": "Economica (<10€)", "connessione": "Ideale per pesci leggeri, alleggerisce la struttura del cibo.", "gusto": "Molto secco, lineare e floreale."},
            {"nome": "Gavi di Gavi DOCG", "prezzo": "16.50€", "fascia": "Standard (10€ - 30€)", "connessione": "La spiccata mineralità sposa la sapidità dei primi allo scoglio.", "gusto": "Elegante, con sfumature di pera e finale asciutto."},
            {"nome": "Alta Langa Brut DOCG", "prezzo": "34.00€", "fascia": "Premium (>30€)", "connessione": "La struttura da Pinot Nero sostiene zuppe di pesce o cotture al forno.", "gusto": "Intenso, con note di nocciola tostata e burro."},
        ],
        "Toscana": [
            {"nome": "IGT Toscana Bianco", "prezzo": "8.00€", "fascia": "Economica (<10€)", "connessione": "Vino immediato, ottimo per contrastare la tendenza dolce delle fritture.", "gusto": "Fresco, dissetante e fruttato."},
            {"nome": "Vernaccia di San Gimignano DOCG", "prezzo": "12.50€", "fascia": "Standard (10€ - 30€)", "connessione": "Il finale salino esalta la sapidità dei crostacei e dei frutti di mare.", "gusto": "Asciutto, minerale, con un tocco di mandorla amara."},
            {"nome": "Vermentino di Bolgheri Superiore DOC", "prezzo": "31.00€", "fascia": "Premium (>30€)", "connessione": "La complessità aromatica sorregge preparazioni importanti o pesci alla griglia.", "gusto": "Ricco, morbido, con sentori di macchia mediterranea."}
        ],
        "Veneto": [
            {"nome": "Soave Classico DOC", "prezzo": "9.50€", "fascia": "Economica (<10€)", "connessione": "Bilancia la dolcezza dei risotti di mare o dei pesci bianchi.", "gusto": "Fresco, floreale e leggermente minerale."},
            {"nome": "Valdobbiadene Prosecco Superiore DOCG", "prezzo": "13.50€", "fascia": "Standard (10€ - 30€)", "connessione": "Il perlage vivace resetta le papille gustative dai grassi del pesce crudo o sushi.", "gusto": "Fruttato, con note di mela ed erba cedrina."},
            {"nome": "Lugana Riserva DOC (Veneto)", "prezzo": "32.00€", "fascia": "Premium (>30€)", "connessione": "Grande struttura che regge pesci impegnativi in umido o salse con panna.", "gusto": "Evoluto, caldo, con richiami di pietra focaia e agrumi canditi."}
        ],
        "Campania": [
            {"nome": "Falanghina del Sannio DOC", "prezzo": "9.00€", "fascia": "Economica (<10€)", "connessione": "La freschezza vulcanica pulisce la bocca dalla frittura di paranza.", "gusto": "Vivace, profumato di zagara e mela verde."},
            {"nome": "Fiano di Avellino DOCG", "prezzo": "15.50€", "fascia": "Standard (10€ - 30€)", "connessione": "Perfetto con crostacei e pesci al sale grazie alla sua profonda acidità marina.", "gusto": "Elegante, minerale, con sentori di nocciola e idrocarburo."},
            {"nome": "Greco di Tufo Riserva DOCG", "prezzo": "33.00€", "fascia": "Premium (>30€)", "connessione": "Un bianco potente quasi come un rosso, regge zuppe e pesci ad alto contenuto di grassi.", "gusto": "Strutturato, secco, caldo e intensamente minerale."}
        ],
        "Sardegna": [
            {"nome": "Vermentino di Sardegna DOC", "prezzo": "8.50€", "fascia": "Economica (<10€)", "connessione": "La sapidità iodata pulisce il palato dai primi piatti di mare.", "gusto": "Fresco, marino, con richiami di limone."},
            {"nome": "Nuragus di Cagliari DOC", "prezzo": "12.00€", "fascia": "Standard (10€ - 30€)", "connessione": "Acidità spiccata che esalta la delicatezza dei pesci bolliti o al vapore.", "gusto": "Asciutto, essenziale e delicatamente fruttato."},
            {"nome": "Vermentino di Gallura Superiore DOCG", "prezzo": "32.00€", "fascia": "Premium (>30€)", "connessione": "La struttura alcolica importante avvolge e sostiene pesci grassi o salse dense.", "gusto": "Caldo, persistente, con note di mandorla e macchia marina."}
        ],
        "Francia": [
            {"nome": "Muscadet Sèvre et Maine", "prezzo": "9.80€", "fascia": "Economica (<10€)", "connessione": "L'acidità tagliente e agrumata lo rende il compagno perfetto per frutti di mare crudi.", "gusto": "Teso, dritto, con una fortissima nota di lime e gesso."},
            {"nome": "Chablis DOC (Borgogna)", "prezzo": "28.00€", "fascia": "Standard (10€ - 30€)", "connessione": "Uno Chardonnay leggendario che pulisce ed esalta la delicatezza dei crostacei nobili.", "gusto": "Affilato come una lama, minerale, sa di mela verde e pietra focaia."},
            {"nome": "Champagne Brut", "prezzo": "45.00€", "fascia": "Premium (>30€)", "connessione": "La massima espressione delle bollicine resetta il palato da qualsiasi grassezza marina.", "gusto": "Complesso, sa di brioche tostata e frutti gialli con freschezza infinita."}
        ],
        "Spagna": [
            {"nome": "Verdejo Rueda DO", "prezzo": "8.90€", "fascia": "Economica (<10€)", "connessione": "La sua freschezza vegetale pulisce i piatti di pesce azzurro cotti alla piastra.", "gusto": "Erbaceo, fresco, con sentori di fieno e melone bianco."},
            {"nome": "Rías Baixas Albariño DO", "prezzo": "18.50€", "fascia": "Standard (10€ - 30€)", "connessione": "Un vino atlantico che sposa la sapidità di molluschi, paella de marisco e polpo.", "gusto": "Salino, vibrante, con profumi intensi di albicocca e agrumi."},
            {"nome": "Cava Gran Reserva Gran Duc", "prezzo": "35.00€", "fascia": "Premium (>30€)", "connessione": "Bollicina metodo classico spagnolo, ideale per ripulire la bocca dalle fritture ricche.", "gusto": "Secco, maturo, con note di frutta secca tostata e mela cotta."}
        ]
    },
    "generico": {
        "Lombardia": [
            {"nome": "Bonarda dell'Oltrepò Pavese DOC", "prezzo": "7.50€", "fascia": "Economica (<10€)", "connessione": "La leggera effervescenza asporta lo strato grasso di salumi e pizze.", "gusto": "Brioso, fragrante, dominato da ricordi di ciliegia."},
            {"nome": "Curtefranca Rosso DOC", "prezzo": "15.00€", "fascia": "Standard (10€ - 30€)", "connessione": "Struttura media che equilibra primi saporiti e grigliate di carne bianca.", "gusto": "Armonico, con un tannino vellutato e frutti rossi."},
            {"nome": "Sfursat di Valtellina DOCG", "prezzo": "38.00€", "fascia": "Premium (>30€)", "connessione": "La monumentale potenza da uve appassite sostiene brasati e formaggi storici.", "gusto": "Caldo, speziato, ricco di prugna secca e cacao amaro."}
        ],
        "Piemonte": [
            {"nome": "Dolcetto d'Alba DOC", "prezzo": "9.00€", "fascia": "Economica (<10€)", "connessione": "Tannino delicato che pulisce la bocca senza aggredire le carni magre.", "gusto": "Morbido, vinoso e piacevolmente mandorlato."},
            {"nome": "Barbera d'Asti DOCG Superiore", "prezzo": "16.00€", "fascia": "Standard (10€ - 30€)", "connessione": "L'acidità taglia i condimenti grassi di lasagne, burro o formaggi fusi.", "gusto": "Succoso, vibrante, ricco di prugna e mora."},
            {"nome": "Barolo DOCG", "prezzo": "42.00€", "fascia": "Premium (>30€)", "connessione": "I tannini fitti esigono la proteina di una bistecca o di uno stracotto per ammorbidirsi.", "gusto": "Austero, complesso, con note di cuoio, tabacco e liquirizia."}
        ],
        "Toscana": [
            {"nome": "Chianti DOCG", "prezzo": "8.50€", "fascia": "Economica (<10€)", "connessione": "Pulisce la bocca dalla componente oleosa di ragù o carni alla griglia.", "gusto": "Fresco, asciutto, sa di ciliegia e pepe nero."},
            {"nome": "Chianti Classico DOCG", "prezzo": "18.00€", "fascia": "Standard (10€ - 30€)", "connessione": "Equilibra perfettamente la succosità della carne grazie a una solida struttura.", "gusto": "Elegante, speziato, con ricordi di viola e marasca."},
            {"nome": "Brunello di Montalcino DOCG", "prezzo": "48.00€", "fascia": "Premium (>30€)", "connessione": "Un gigante che si fonde con la grassezza e l'intensità della cacciagione e della Fiorentina.", "gusto": "Profondo, caldo, con note di vaniglia, cioccolato e frutti scuri."}
        ],
        "Veneto": [
            {"nome": "Bardolino DOC", "prezzo": "8.00€", "fascia": "Economica (<10€)", "connessione": "Rosso leggerissimo, non sovrasta i piatti quotidiani o le carni bianche.", "gusto": "Sottile, fresco, con sentori di fragolina di bosco e cannella."},
            {"nome": "Valpolicella Ripasso DOC", "prezzo": "19.50€", "fascia": "Standard (10€ - 30€)", "connessione": "La sua morbidezza bilancia la sapidità di arrosti e formaggi di media stagionatura.", "gusto": "Avvolgente, sa di amarena sotto spirito e spezie dolci."},
            {"nome": "Amarone della Valpolicella DOCG", "prezzo": "45.00€", "fascia": "Premium (>30€)", "connessione": "Struttura alcolica e spessore pazzesco, ideale per stracotti e carni rosse importanti.", "gusto": "Caldo, robusto, trionfo di confettura di prugne, uvetta e tabacco."}
        ],
        "Campania": [
            {"nome": "Sannio Aglianico DOC", "prezzo": "9.50€", "fascia": "Economica (<10€)", "connessione": "Il tannino giovane ripulisce la bocca dalla carne di maiale o salsicce alla brace.", "gusto": "Rustico, deciso, ricco di frutti neri e pepe."},
            {"nome": "Lacryma Christi del Vesuvio Rosso DOC", "prezzo": "14.50€", "fascia": "Standard (10€ - 30€)", "connessione": "La mineralità vulcanica sposa perfettamente i sughi di carne ricchi e la pizza margherita.", "gusto": "Morbido, minerale, con note di prugna e cenere.",
            "nome": "Taurasi DOCG", "prezzo": "38.00€", "fascia": "Premium (>30€)", "connessione": "Vino di incredibile potenza, i suoi tannini domano le carni rosse più ricche e succulente.", "gusto": "Austero, maestoso, sa di marasca, caffè e fumo."}
        ],
        "Sardegna": [
            {"nome": "Monica di Sardegna DOC", "prezzo": "8.00€", "fascia": "Economica (<10€)", "connessione": "Un rosso morbido, perfetto per non sovrastare primi piatti al sugo semplici.", "gusto": "Beva facile, vellutato, dominato da frutti rossi caldi."},
            {"nome": "Cannonau di Sardegna DOC", "prezzo": "15.00€", "fascia": "Standard (10€ - 30€)", "connessione": "Il calore alcolico sostiene la struttura di carni grigliate e formaggi pecorini.", "gusto": "Caldo, robusto, speziato con note di prugna secca."},
            {"nome": "Turriga Isola dei Nuraghi IGT", "prezzo": "75.00€", "fascia": "Premium (>30€)", "connessione": "Un monumento sardo che richiede piatti sontuosi come il maialetto arrosto o selvaggina.", "gusto": "Immenso, vellutato, note di macchia mediterranea, tabacco e more nere."}
        ],
        "Francia": [
            {"nome": "Côtes-du-Rhône Rouge", "prezzo": "9.50€", "fascia": "Economica (<10€)", "connessione": "Un rosso speziato che esalta la sapidità di hamburger, carni alla griglia e spezzatini leggeri.", "gusto": "Rotondo, speziato, sa di frutti neri e pepe."},
            {"nome": "Bordeaux Supérieur", "prezzo": "22.00€", "fascia": "Standard (10€ - 30€)", "connessione": "L'equilibrio tra Cabernet e Merlot pulisce il palato da arrosti di manzo o agnello.", "gusto": "Elegante, asciutto, con note di ribes nero, legno nobile e grafite."},
            {"nome": "Châteauneuf-du-Pape", "prezzo": "55.00€", "fascia": "Premium (>30€)", "connessione": "La straordinaria potenza alcolica e speziata sostiene stufati complessi e cacciagione.", "gusto": "Caldo, sontuoso, sentori di liquirizia, prugna e cuoio."},
        ],
        "Spagna": [
            {"nome": "Tempranillo La Mancha DO", "prezzo": "7.50€", "fascia": "Economica (<10€)", "connessione": "Vino dritto e fruttato, ottimo per ripulire la bocca da tapas di carne e salumi.", "gusto": "Morbido, succoso, sa di fragola matura e spezie dolci."},
            {"nome": "Rioja Crianza DO", "prezzo": "16.00€", "fascia": "Standard (10€ - 30€)", "connessione": "L'affinamento in legno asciuga i grassi di grigliate miste e arrosti di maiale.", "gusto": "Equilibrato, con note di vaniglia, cocco e ciliegie mature."},
            {"nome": "Priorat DOCa Tinto", "prezzo": "45.00€", "fascia": "Premium (>30€)", "connessione": "Rosso da suoli di ardesia, concentratissimo, ideale per tagli di carne rossa pregiata alla brace.", "gusto": "Potente, minerale, molto profondo, sa di liquirizia e mirtilli neri."}
        ]
    }
}

# LOGICA DI FUNZIONAMENTO DEL SITO
if st.button("🚀 TROVA I VINI PERFETTI"):
    if not piatto:
        st.warning("Ehi! Scrivi cosa stai mangiando (es: pasta al salmone o grigliata) per permettere all'applicazione di fare l'abbinamento!")
    else:
        st.write("---")
        
        # Identifico la macro-categoria del piatto inserito
        categoria = "generico"
        if any(keyword in piatto.lower() for keyword in ["salmone", "pesce", "tonno", "branzino", "scoglio", "sushi"]):
            categoria = "pesce"
            
        st.info(f"🔍 Analisi chimica del piatto completata. Categoria rilevata: **{categoria.upper()}**. Ricerca vini in corso...")
        
        # Estraggo i vini per la selezione scelta
        regioni_db = database.get(categoria, {})
        
        if region in regioni_db:
            vini_filtrati = regioni_db[regione]
            
            # Filtro in base alla fascia di prezzo scelta dall'utente
            if prezzo_scelto != "Mostra tutte le fasce":
                vini_filtrati = [v for v in vini_filtrati if v['fascia'] == prezzo_scelto]
            
            if len(vini_filtrati) == 0:
                st.warning("Nessun vino trovato per questa specifica fascia di prezzo. Prova a selezionare 'Mostra tutte le fasce'!")
            else:
                termine_geo = "dalla regione" if area == "Italia" else "dal Paese"
                st.success(f"Ecco le migliori opzioni trovate in **{regione}** {termine_geo} ideali per il tuo piatto:")
                
                # Stampo le schede dei vini trovati
                for v in vini_filtrati:
                    st.markdown(f"""
                        <div class='result-card'>
                            <h2 style='margin:0 0 10px 0; font-size:1.5em; color:#5c1d24;'>🍷 {v['nome']}</h2>
                            <p>
                                <span class='badge-price'>{v['fascia']} (Prezzo: {v['prezzo']})</span> &nbsp; 
                                <span class='badge-geo'>Provenienza: {regione}</span>
                            </p>
                            <hr style='border:0; border-top:1px solid #e8ded9; margin:10px 0;'>
                            <p><strong>🤔 Perché si abbina al piatto?</strong><br>{v['connessione']}</p>
                            <p><strong>👅 Che sensazione dà in bocca?</strong><br>{v['gusto']}</p>
                        </div>
                    """, unsafe_allow_html=True)
                    
                    # Generazione automatica del link di acquisto per il vino specifico
                    search_url = f"https://www.google.com/search?q={v['nome'].replace(' ', '+')}+prezzo+online"
                    st.markdown(f'<a href="{search_url}" target="_blank"><button style="background-color:#2c2523; color:white; border:none; padding:8px; border-radius:5px; width:100%; font-weight:bold; cursor:pointer; margin-bottom:25px;">🛒 CERCA AL PREZZO MINIMO ONLINE</button></a>', unsafe_allow_html=True)
        else:
            # Fallback amichevole se l'utente clicca una delle regioni italiane non ancora caricate nel database di prova
            st.warning(f"La zona {regione} è in corso di mappatura per questa categoria di cibo. Ecco una scelta jolly nazionale di sicuro successo:")
            st.markdown("""
                <div class='result-card'>
                    <h2 style='margin:0 0 10px 0; font-size:1.5em; color:#5c1d24;'>🍷 Prosecco Superiore di Valdobbiadene DOCG</h2>
                    <p><span class='badge-price'>Fascia Standard (Prezzo: ~ 12.50€)</span> &nbsp; <span class='badge-geo'>Provenienza: Veneto (Italia)</span></p>
                    <hr style='border:0; border-top:1px solid #e8ded9; margin:10px 0;'>
                    <p><strong>🤔 Perché si abbina al piatto?</strong><br>La bollicina spazza via l'unto, pulisce il palato dai grassi e rinfresca la bocca istantaneamente a ogni sorso, adattandosi a qualsiasi cibo.</p>
                </div>
            """, unsafe_allow_html=True)
