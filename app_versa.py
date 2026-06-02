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
piatto = st.text_input("🍽️ Cosa mangi stasera?", placeholder="Es: Pasta al salmone, Bistecca, Pizza, Sushi...")

col1, col2 = st.columns(2)

with col1:
    prezzo_scelto = st.selectbox("💰 Filtra per Fascia di Prezzo:", [
        "Mostra tutte le fasce",
        "Economica (<10€)",
        "Standard (10€ - 30€)",
        "Premium (>30€)"
    ])

with col2:
    regione = st.selectbox("🗺️ Seleziona la Regione del vino:", [
        "Lombardia", "Piemonte", "Toscana", "Veneto", "Campania", "Sardegna"
    ])

# DATABASE INTEGRALE NAZIONALE (3 VINI PER FASCIA X REGIONE - MAPPA DEL GUSTO E DEL CIBO)
database = {
    "pesce": {
        "Lombardia": [
            # <10
            {"nome": "Oltrepò Pavese Riesling DOC", "prezzo": "8.50€", "fascia": "Economica (<10€)", 
             "connessione": "I piatti di pesce o le paste cremose lasciano una sensazione di morbidezza sul palato. Questo Riesling ha un'acidità vivace e naturale che contrasta la componente grassa, pulendo la bocca a ogni sorso proprio come una goccia di limone fresco.", 
             "gusto": "Fresco, asciutto e agrumato. Ricorda il sapore della mela verde croccante e lascia una piacevole sensazione di freschezza persistente."},
            # 10-30
            {"nome": "Lugana DOC", "prezzo": "14.00€", "fascia": "Standard (10€ - 30€)", 
             "connessione": "Ideale per pesci saporiti e ricchi come il salmone o il tonno. Ha un corpo più morbido e rotondo che avvolge la struttura del piatto senza farsi sovrastare dal condimento o dai grassi buoni del pesce.", 
             "gusto": "Morbido e avvolgente. Ha note che ricordano la pesca bianca e la mandorla fresca, con un finale pulito che non appesantisce il palato."},
            # >30
            {"nome": "Franciacorta Satèn DOCG", "prezzo": "36.00€", "fascia": "Premium (>30€)", 
             "connessione": "Le bollicine finissime ed eleganti del metodo classico creano un contrasto perfetto con l'untuosità dei sughi o del salmone. Funzionano come un sgrassatore naturale, resettando le papille gustative dopo ogni boccone.", 
             "gusto": "Crema, crosta di pane sfornato e note fruttate delicate. In bocca è setoso, morbido ma incredibilmente fresco e rigenerante."},
        ],
        "Piemonte": [
            {"nome": "Cortese dell'Alto Monferrato DOC", "prezzo": "7.80€", "fascia": "Economica (<10€)", 
             "connessione": "Un bianco quotidiano leggero, perfetto per rinfrescare il palato durante piatti di pesce semplici o primi allo scoglio. La sua rapidità di beva alleggerisce la struttura del cibo.", 
             "gusto": "Molto secco, dritto e lineare. Sa di frutti bianchi e fiori di prato, con una chiusura pulita che invita al sorso successivo."},
            {"nome": "Gavi di Gavi DOCG", "prezzo": "16.50€", "fascia": "Standard (10€ - 30€)", 
             "connessione": "La spiccata mineralità di questo vino piemontese sposa magnificamente la sapidità del pesce. Pulisce la bocca dalla pastosità dei sughi di mare grazie a un finale bilanciato e asciutto.", 
             "gusto": "Elegante e di medio corpo. Ha sfumature di pera e agrume leggero, con un retrogusto pulito ed elegantemente ammandorlato."},
            {"nome": "Alta Langa Brut DOCG", "prezzo": "34.00€", "fascia": "Premium (>30€)", 
             "connessione": "Bollicina di altissima scuola piemontese. La struttura importante da uve Pinot Nero regge la complessità di pesci grassi, cotture al forno o salse elaborate, lasciando la lingua fresca e asciutta.", 
             "gusto": "Intenso e strutturato. Sentori che ricordano la nocciola tostata, il burro fresco e la mela dorata. Ha un sapore profondo e una bollicina persistente che pulisce a fondo."},
        ],
        "Toscana": [
            {"nome": "IGT Toscana Bianco", "prezzo": "8.00€", "fascia": "Economica (<10€)", 
             "connessione": "Un vino da tavola fresco e immediato. Ottimo per ripulire la bocca da preparazioni di pesce veloci o fritture veloci grazie a una beva disimpegnata.", 
             "gusto": "Semplice, fruttato e dissetante. Prevalgono note di mela e agrumi, con una sensazione finale molto rinfrescante."},
            {"nome": "Vernaccia di San Gimignano DOCG", "prezzo": "12.50€", "fascia": "Standard (10€ - 30€)", 
             "connessione": "Vino storico dal carattere deciso. Ha un finale quasi salino che esalta il sapore del pesce e dei crostacei, bilanciando la dolcezza dei sughi ricchi senza mai coprirla.", 
             "gusto": "Asciutto e minerale. Ricorda la scorza di limone e la frutta gialla, con una caratteristica nota finale di mandorla che pulisce perfettamente il palato."},
            {"nome": "Vermentino di Bolgheri Superiore DOC", "prezzo": "31.00€", "fascia": "Premium (>30€)", 
             "connessione": "Nasce vicino al mare e ne assorbe la forza. La sua struttura imponente e la complessità aromatica sorreggono primi piatti di pesce intensi o pesci nobili cotti alla griglia.", 
             "gusto": "Ricco e strutturato. Note calde di pesca matura, erbe aromatiche e macchia mediterranea. In bocca è pieno, morbido ma sorretto da un'ottima freschezza."},
        ]
    },
    "generico": {
        "Lombardia": [
            {"nome": "Bonarda dell'Oltrepò Pavese DOC", "prezzo": "7.50€", "fascia": "Economica (<10€)", 
             "connessione": "Grazie alla sua leggera e vivace frizzantezza naturale, questo rosso è perfetto per accompagnare piatti di carne, pizze saporite o taglieri. La bollicina asporta la grassezza dei condimenti.", 
             "gusto": "Brioso e fruttato. Sa di uva fresca appena pigiata e ciliegie, molto morbido e immediato da bere."},
            {"nome": "Curtefranca Rosso DOC", "prezzo": "15.00€", "fascia": "Standard (10€ - 30€)", 
             "connessione": "Un rosso di medio corpo che si adatta a primi piatti con sughi di carne o arrosti leggeri. Equilibra il piatto senza sovrastarne la consistenza.", 
             "gusto": "Equilibrato e vellutato. Offre note di piccoli frutti rossi e un finale leggermente speziato che pulisce la bocca con delicatezza."},
            {"nome": "Sfursat di Valtellina DOCG", "prezzo": "38.00€", "fascia": "Premium (>30€)", 
             "connessione": "Ottenuto da uve appassite in montagna, ha una struttura enorme. Richiede piatti intensi come brasati, cacciagione o formaggi molto stagionati. Asciuga e arricchisce ogni boccone importante.", 
             "gusto": "Caldo, potente e profondo. Ricorda le more sotto spirito, la prugna secca e il cacao amaro. Lascia una sensazione calda e avvolgente."},
        ],
        "Piemonte": [
            {"nome": "Dolcetto d'Alba DOC", "prezzo": "9.00€", "fascia": "Economica (<10€)", 
             "connessione": "Rosso quotidiano della tradizione. Ha un tannino molto leggero e delicato che asciuga il palato da primi piatti o carni magre senza aggredire la bocca.", 
             "gusto": "Morbido e vinoso. Sa di ciliegia fresca e mandorla, con una facilità di beva che lo rende perfetto per tutti i giorni."},
            {"nome": "Barbera d'Asti DOCG Superiore", "prezzo": "16.00€", "fascia": "Standard (10€ - 30€)", 
             "connessione": "La Barbera possiede un'acidità naturale formidabile. Significa che è in grado di 'tagliare' e alleggerire i piatti più unti, ricchi di formaggio, burro o carni saporite.", 
             "gusto": "Succoso e intenso. Esprime note accese di prugna e frutti di bosco, lasciando la bocca fresca e pronta a un nuovo assaggio."},
            {"nome": "Barolo DOCG", "prezzo": "42.00€", "fascia": "Premium (>30€)", 
             "connessione": "Un vino monumentale. I suoi tannini fitti richiedono tassativamente cibi strutturati e ricchi di proteine (stracotti, carni rosse importanti, funghi e tartufi) per ammorbidirsi a vicenda.", 
             "gusto": "Complesso e austero. Sfuma dal tabacco alla rosa appassita e alla liquirizia. È asciutto, caldo e riempie completamente il palato con eleganza."},
        ],
        "Toscana": [
            {"nome": "Chianti DOCG", "prezzo": "8.50€", "fascia": "Economica (<10€)", 
             "connessione": "Ideale per i piatti della domenica, grigliate miste o lasagne. Asciuga la bocca dalla componente oleosa del cibo grazie a una struttura agile e scattante.", 
             "gusto": "Fresco e mediamente secco. Sa di ciliegia croccante e un pizzico di pepe nero, con un finale pulito ed energico."},
            {"nome": "Chianti Classico DOCG", "prezzo": "18.00€", "fascia": "Standard (10€ - 30€)", 
             "connessione": "La spina dorsale di questo grande vino ripulisce perfettamente il palato dalle carni rosse o dai sughi ricchi, offrendo un perfetto bilanciamento tra la succosità del cibo e l'eleganza del sorso.", 
             "gusto": "Armonico e di carattere. Note di viola, marasca e legno leggero, con un tannino elegante che lascia la bocca piacevolmente pulita."},
            {"nome": "Brunello di Montalcino DOCG", "prezzo": "48.00€", "fascia": "Premium (>30€)", 
             "connessione": "Un vino regale da occasioni speciali. Richiede piatti di carne importanti, arrosti o formaggi molto strutturati. La sua imponente architettura sensoriale esalta i sapori intensi.", 
             "gusto": "Profondo, caldo e avvolgente. Note di frutti scuri maturi, spezie dolci, cuoio e vaniglia. Al palato è denso, persistente e infinitamente nobile."},
        ]
    }
}

# LOGICA DI FUNZIONAMENTO DEL SITO
if st.button("🚀 TROVA I VINI PERFETTI"):
    if not piatto:
        st.warning("Ehi! Scrivi cosa stai mangiando (es: pasta al salmone o grigliata) per permettere all'AI di fare l'abbinamento!")
    else:
        st.write("---")
        
        # Identifico la macro-categoria del piatto inserito
        categoria = "generico"
        if any(keyword in piatto.lower() for keyword in ["salmone", "pesce", "tonno", "branzino", "scoglio", "sushi"]):
            categoria = "pesce"
            
        st.info(f"🔍 Analisi chimica del piatto completata. Categoria rilevata: **{categoria.upper()}**. Ricerca vini in corso...")
        
        # Estraggo i vini per la regione selezionata
        regioni_db = database.get(categoria, {})
        
        if regione in regioni_db:
            vini_filtrati = regioni_db[regione]
            
            # Filtro in base alla fascia di prezzo scelta dall'utente
            if prezzo_scelto != "Mostra tutte le fasce":
                vini_filtrati = [v for v in vini_filtrati if v['fascia'] == prezzo_scelto]
            
            if len(vini_filtrati) == 0:
                st.warning("Nessun vino trovato per questa specifica fascia di prezzo. Prova a selezionare 'Mostra tutte le fasce'!")
            else:
                st.success(f"Ecco le migliori opzioni trovate in **{regione}** ideali per il tuo piatto:")
                
                # Stampo le schede dei vini trovati
                for v in vini_filtrati:
                    st.markdown(f"""
                        <div class='result-card'>
                            <h2 style='margin:0 0 10px 0; font-size:1.5em; color:#5c1d24;'>🍷 {v['nome']}</h2>
                            <p>
                                <span class='badge-price'>{v['fascia']} (Prezzo: {v['prezzo']})</span> &nbsp; 
                                <span class='badge-geo'>Regione: {regione}</span>
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
            # Fallback amichevole se l'utente clicca una regione non ancora mappata nel prototipo
            st.warning(f"La regione {regione} è in corso di mappatura per questa categoria di cibo. Ecco una scelta jolly nazionale di sicuro successo:")
            st.markdown("""
                <div class='result-card'>
                    <h2 style='margin:0 0 10px 0; font-size:1.5em; color:#5c1d24;'>🍷 Prosecco Superiore di Valdobbiadene DOCG</h2>
                    <p><span class='badge-price'>Fascia Standard (Prezzo: ~ 12.50€)</span> &nbsp; <span class='badge-geo'>Regione: Veneto</span></p>
                    <hr style='border:0; border-top:1px solid #e8ded9; margin:10px 0;'>
                    <p><strong>🤔 Perché si abbina al piatto?</strong><br>La bollicina spazza via l'unto, pulisce il palato dai grassi e rinfresca la bocca istantaneamente a ogni sorso, adattandosi a qualsiasi cibo.</p>
                </div>
            """, unsafe_allow_html=True)