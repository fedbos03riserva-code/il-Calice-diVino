# -*- coding: utf-8 -*-
"""Genera 50 voci W(...) — SOLO vini dell'Oltrepò Pavese — nello stesso formato
esatto usato nel catalogo originale (WINE_CATALOG). Uve, produttori e stili
sono quelli tipici della denominazione (Pinot Nero, Bonarda/Croatina, Barbera,
Buttafuoco, Sangue di Giuda, Riesling Italico/Renano, Moscato, Metodo Classico,
Cortese, Vespolina/Ughetta di Canneto, Chardonnay, Sauvignon, Pinot Grigio,
Cabernet Sauvignon)."""

import json

# (nome_base, tipo, uva, fascia, prezzo, alcol, acidita, tannini, corpo, rz, profilo, abbina, non_abbina, foto_key, produttore)
DATA = [
 ("Pinot Nero DOC Vigna del Convento","Rosso","Pinot Nero","premium",29.0,13.0,"alta","fini","medio",0.8,
  ["lampone","ciliegia croccante","sottobosco","spezie fini"],["arrosto di vitello","funghi porcini trifolati","formaggi semi-stagionati"],["pesce crudo","piatti molto piccanti"],"rosso_piemonte","Tenuta del Convento"),
 ("Bonarda DOC Vivace Cascina Roccolo","Rosso","Croatina","economico",10.5,12.0,"media","morbidi","medio",4.5,
  ["ciliegia fresca","mora","viola","leggera effervescenza"],["salumi pavesi","pizza","tortelli di zucca","formaggi freschi"],["pesce crudo","piatti delicati"],"rosso_piemonte","Cascina Roccolo"),
 ("Buttafuoco Storico DOC Vigna Bertone","Rosso","Croatina + Barbera + Ughetta di Canneto","standard",18.0,13.5,"alta","strutturati","pieno",1.2,
  ["mora selvatica","cuoio","spezie scure","ciliegia sotto spirito"],["brasato","cotechino con lenticchie","formaggi Grana stagionato"],["pesce","crostacei"],"rosso_piemonte","Vigna Bertone"),
 ("Sangue di Giuda DOC Dolce Frizzante Cascina Alberoni","Dolce","Croatina + Barbera + Uva Rara","economico",11.0,7.5,"media","assenti","leggero",65.0,
  ["fragola","lampone","ciliegia fresca","floreale rosso"],["crostate di frutti rossi","budino","panettone"],["carne rossa","pesce crudo"],"dolce","Cascina Alberoni"),
 ("Riesling Italico DOC Colline del Bosco","Bianco","Riesling Italico","economico",12.5,12.0,"alta","assenti","leggero",1.8,
  ["mela verde","agrumi","fiori di campo","nota minerale"],["risotto alle erbe","pesce di lago","insalate estive"],["carne rossa","selvaggina"],"bianco_nord","Colline del Bosco"),
 ("Riesling Renano DOC Vigneti Alti","Bianco","Riesling Renano","standard",16.5,12.5,"alta","assenti","leggero-medio",2.2,
  ["pesca bianca","lime","mineralità","fiori bianchi"],["capesante","sushi","pesce al vapore"],["carne rossa","formaggi molto stagionati"],"bianco_nord","Vigneti Alti"),
 ("Metodo Classico DOCG Extra Brut Torre delle Rondini","Spumante","Pinot Nero","premium",31.0,12.5,"alta","assenti","medio",1.0,
  ["crosta di pane","mela renetta","agrumi maturi","lievito fresco"],["ostriche","tartare di pesce","aperitivo raffinato"],["carne rossa pesante","dolci molto zuccherini"],"spumante","Torre delle Rondini"),
 ("Metodo Classico DOCG Rosé Brut Cascina delle Terre","Spumante","Pinot Nero (vinificato in rosa)","standard",26.0,12.5,"alta","assenti","leggero-medio",2.0,
  ["fragolina","rosa","agrumi rosati","perlage fine"],["salmone","carpaccio di tonno","risotto allo zafferano"],["selvaggina pesante","formaggi molto stagionati"],"spumante","Cascina delle Terre"),
 ("Barbera DOC Superiore Poggio del Falco","Rosso","Barbera","standard",17.0,14.0,"altissima","medi","pieno",1.0,
  ["prugna matura","ciliegia nera","liquirizia","spezie scure"],["brasato al vino rosso","costine di maiale","polenta con funghi"],["pesce crudo","ostriche"],"rosso_piemonte","Poggio del Falco"),
 ("Uva Rara DOC Cascina Monteverde","Rosso","Uva Rara","economico",12.5,12.5,"media","morbidi","leggero-medio",2.0,
  ["ciliegia dolce","lampone","fiori rossi"],["salumi","pasta al forno","antipasti misti"],["pesce","piatti molto delicati"],"rosso_piemonte","Cascina Monteverde"),
 ("Vespolina DOC Ughetta di Canneto Cascina Verzate","Rosso","Vespolina (Ughetta di Canneto)","standard",19.5,13.0,"alta","fini","medio",0.9,
  ["pepe bianco","frutti rossi","erbe selvatiche","mineralità"],["salumi piccanti","cacciagione da penna","formaggi di media stagionatura"],["dolci","pesce grasso"],"rosso_piemonte","Cascina Verzate"),
 ("Chardonnay DOC Corte Vecchia","Bianco","Chardonnay","economico",13.5,13.0,"media","assenti","medio",2.0,
  ["mela golden","burro fresco","nocciola tostata"],["pollo al burro","risotto allo zafferano","pasta con panna"],["piatti molto piccanti","carne rossa"],"bianco_nord","Corte Vecchia"),
 ("Sauvignon DOC Vigna Airale","Bianco","Sauvignon Blanc","standard",17.0,13.0,"alta","assenti","medio",1.6,
  ["pompelmo rosa","foglia di pomodoro","fiori di sambuco"],["asparagi","primi con pesto","formaggi di capra freschi"],["carne rossa","piatti molto grassi"],"bianco_nord","Vigna Airale"),
 ("Pinot Grigio DOC Le Coste","Bianco","Pinot Grigio","economico",13.0,13.0,"media","assenti","leggero-medio",1.9,
  ["mela","pesca bianca","mandorla"],["risotto al pesce","frittura mista","insalate"],["carne rossa","formaggi molto stagionati"],"bianco_nord","Le Coste"),
 ("Pinot Grigio Ramato DOC Rovereto","Rosato","Pinot Grigio (vinificato in rosa)","standard",15.0,12.5,"media","assenti","leggero-medio",1.5,
  ["pesca rosa","scorza d'arancia","petali di rosa"],["antipasti di pesce","risotto al radicchio","salumi delicati"],["selvaggina","carne rossa pesante"],"bianco_nord","Rovereto"),
 ("Cabernet Sauvignon DOC Cascina Torretta","Rosso","Cabernet Sauvignon","standard",18.5,13.5,"media","strutturati","pieno",1.0,
  ["ribes nero","peperone verde","cedro","grafite"],["brasato al Cabernet","tagliata di manzo","selvaggina da penna"],["pesce","piatti molto delicati"],"rosso_piemonte","Cascina Torretta"),
 ("Moscato DOC Frizzante Vigna Solatia","Dolce","Moscato Bianco","economico",11.5,7.5,"media","assenti","leggero",68.0,
  ["pesca","albicocca","fiori d'arancio"],["crostate di frutta","panettone","pasticceria secca"],["carne rossa","piatti salati"],"spumante","Vigna Solatia"),
 ("Pinot Nero Vinificato in Bianco DOC Cascina San Marco","Bianco","Pinot Nero","premium",24.0,13.0,"alta","assenti","medio",1.2,
  ["pera","crosta di pane","agrumi delicati","nocciola"],["risotto ai funghi","pesce al forno","formaggi freschi"],["piatti molto piccanti","carne rossa pesante"],"bianco_nord","Cascina San Marco"),
 ("Rosato DOC Croatina in Rosa Vigneto delle Quaglie","Rosato","Croatina (vinificato in rosa)","economico",12.0,12.0,"media","assenti","leggero",2.0,
  ["fragola","melagrana","fiori rossi"],["antipasti di salumi","pizza","insalate estive"],["carne rossa pesante","selvaggina"],"rosato","Vigneto delle Quaglie"),
 ("Buttafuoco DOC Vigna del Prete","Rosso","Croatina + Barbera + Vespolina","premium",25.0,14.0,"alta","strutturati","pieno",1.0,
  ["mora","tabacco dolce","spezie padane","ciliegia matura"],["salumi pavesi","brasato","formaggi Grana Padano stagionato"],["pesce","crostacei"],"rosso_piemonte","Vigna del Prete"),
 ("Riesling Italico DOC Cascina Fontanile","Bianco","Riesling Italico","economico",11.5,12.0,"alta","assenti","leggero",2.0,
  ["mela verde","agrumi","erbe fresche"],["antipasti di pesce di lago","verdure grigliate","formaggi freschi"],["carne rossa","selvaggina"],"bianco_nord","Cascina Fontanile"),
 ("Bonarda DOC Secco Podere Casanova","Rosso","Croatina","standard",15.0,13.0,"media","morbidi","medio",1.0,
  ["ciliegia matura","prugna","spezie dolci"],["salumi lombardi","primi con sugo","formaggi semi-stagionati"],["pesce crudo","ostriche"],"rosso_piemonte","Podere Casanova"),
 ("Pinot Nero DOC Rosé Metodo Charmat Villa Bricchi","Spumante","Pinot Nero (vinificato in rosa)","standard",17.0,12.0,"media","assenti","leggero",5.0,
  ["fragola","lampone","fiori rosa"],["aperitivo","frittura di pesce","salumi delicati"],["carne rossa pesante","formaggi molto stagionati"],"spumante","Villa Bricchi"),
 ("Cortese DOC Vigna Prealpina","Bianco","Cortese","economico",12.0,12.5,"alta","assenti","leggero",1.5,
  ["mela verde","agrumi","erbe di campo"],["antipasti leggeri","pesce di lago","verdure crude"],["carne rossa","dolci"],"bianco_nord","Vigna Prealpina"),
 ("Barbera DOC Vivace Cascina dei Ronchi","Rosso","Barbera","economico",11.0,12.5,"altissima","bassi","leggero-medio",3.0,
  ["ciliegia acida","lampone","leggera effervescenza"],["salumi","pizza","tortelli"],["formaggi molto stagionati","selvaggina"],"rosso_piemonte","Cascina dei Ronchi"),
 ("Metodo Classico DOCG Pas Dosé Riserva Le Torri","Spumante","Pinot Nero + Chardonnay","lusso",48.0,12.5,"alta","assenti","medio",0.0,
  ["crosta di pane tostata","agrumi canditi","mandorla","mineralità gessosa"],["caviale","ostriche","crudi di pesce pregiato"],["carne rossa pesante","dolci molto zuccherini"],"spumante","Le Torri"),
 ("Croatina in Purezza DOC Cascina Belvedere","Rosso","Croatina","standard",16.0,13.0,"media","medi","medio-pieno",1.0,
  ["mora","ciliegia scura","spezie leggere"],["salumi pavesi","brasato leggero","formaggi semi-stagionati"],["pesce delicato","crostacei"],"rosso_piemonte","Cascina Belvedere"),
 ("Sauvignon DOC Vendemmia Tardiva Cascina Airoldi","Bianco","Sauvignon Blanc","premium",22.0,13.5,"media","assenti","medio-pieno",4.5,
  ["frutto della passione","fiori di sambuco","miele leggero"],["foie gras","formaggi erborinati","cucina speziata"],["pesce delicato","piatti molto acidi"],"bianco_nord","Cascina Airoldi"),
 ("Pinot Nero DOC Riserva Vigna Costa Alta","Rosso","Pinot Nero","lusso",42.0,13.5,"alta","fini","medio-pieno",0.6,
  ["ciliegia","sottobosco","spezie fini","note terziarie di cuoio"],["anatra all'arancia","funghi porcini","formaggi a pasta molle"],["pesce fritto","piatti molto piccanti"],"rosso_piemonte","Vigna Costa Alta"),
 ("Bonarda DOC Frizzante Dolce Cascina del Pero","Rosso","Croatina","economico",10.0,11.5,"media","morbidi","leggero",6.0,
  ["mora dolce","ciliegia","frutti rossi maturi"],["dolci al cioccolato","crostate","formaggi erborinati dolci"],["carne rossa","piatti salati strutturati"],"rosso_piemonte","Cascina del Pero"),
 ("Chardonnay DOC Riserva Vigna dei Meli","Bianco","Chardonnay","premium",23.0,13.5,"media","assenti","pieno",1.3,
  ["burro noisette","vaniglia","frutta a polpa bianca","tostatura leggera"],["capesante scottate","pollo alla panna","formaggi di capra stagionati"],["carne rossa pesante","piatti molto piccanti"],"bianco_nord","Vigna dei Meli"),
 ("Buttafuoco Storico DOC Riserva Cascina Broglio","Rosso","Croatina + Barbera + Ughetta di Canneto","lusso",34.0,14.0,"alta","titanici","pieno",0.8,
  ["mora selvatica","liquirizia","spezie orientali","cuoio nobile"],["cinghiale in umido","selvaggina","formaggi pecorino di fossa"],["pesce","piatti delicati"],"rosso_piemonte","Cascina Broglio"),
 ("Riesling Renano DOC Secco Cascina delle Vigne","Bianco","Riesling Renano","standard",14.5,12.5,"alta","assenti","leggero-medio",1.4,
  ["lime","pietra bagnata","fiori bianchi"],["pesce affumicato","cucina asiatica leggera","insalate di mare"],["carne rossa pesante","cioccolato"],"bianco_nord","Cascina delle Vigne"),
 ("Rosato DOC Vespolina in Rosa Cascina Pralunga","Rosato","Vespolina (vinificato in rosa)","standard",15.5,12.5,"media","assenti","leggero",1.8,
  ["ciliegia rosa","pepe bianco","erbe aromatiche"],["salumi delicati","risotto agli asparagi","formaggi freschi"],["selvaggina","carne rossa pesante"],"rosato","Cascina Pralunga"),
 ("Pinot Nero DOC Vigneti di Montalto","Rosso","Pinot Nero","standard",21.0,13.0,"alta","fini","medio",1.0,
  ["lampone","fragola matura","viola","spezie delicate"],["salmone al forno","petto d'anatra","funghi porcini"],["carne rossa pesante","piatti molto grassi"],"rosso_piemonte","Vigneti di Montalto"),
 ("Bonarda DOC Superiore Cascina Guelfa","Rosso","Croatina","standard",16.5,13.5,"media","medi","medio-pieno",1.0,
  ["mora matura","ciliegia scura","spezie dolci"],["brasato","formaggi stagionati","selvaggina leggera"],["pesce crudo","ostriche"],"rosso_piemonte","Cascina Guelfa"),
 ("Metodo Classico DOCG Blanc de Noirs Villa Serena","Spumante","Pinot Nero","premium",36.0,12.5,"alta","assenti","medio",1.0,
  ["frutti rossi","crosta di pane","spezie fini","perlage cremoso"],["salmone affumicato","tartare di manzo","formaggi stagionati leggeri"],["carne rossa pesante","dolci molto zuccherini"],"spumante","Villa Serena"),
 ("Malvasia di Casteggio DOC Dolce Cascina Rovescala","Dolce","Malvasia di Candia Aromatica","economico",13.0,7.0,"media","assenti","leggero",75.0,
  ["moscato d'uva","fiori d'arancio","miele","frutta candita"],["pasticceria secca","panettone","formaggi erborinati dolci"],["carne rossa","piatti salati"],"dolce","Cascina Rovescala"),
 ("Sauvignon DOC Fermentazione in Legno Tenuta del Poggiolo","Bianco","Sauvignon Blanc","premium",25.0,13.5,"alta","assenti","pieno",1.6,
  ["frutto della passione","vaniglia leggera","fiori bianchi"],["capesante","pollo speziato","formaggi di media stagionatura"],["carne rossa","piatti molto grassi"],"bianco_nord","Tenuta del Poggiolo"),
 ("Barbera DOC Riserva Cascina Isabella","Rosso","Barbera","premium",23.0,14.5,"altissima","medi","pieno",1.0,
  ["prugna","ciliegia sotto spirito","spezie scure","tabacco leggero"],["brasato al Barbera","selvaggina","formaggi molto stagionati"],["pesce crudo","crostacei"],"rosso_piemonte","Cascina Isabella"),
 ("Croatina Rosato Frizzante DOC Cascina Fiorita","Rosato","Croatina (vinificato in rosa)","economico",10.5,12.0,"media","assenti","leggero",3.5,
  ["fragola","lampone","leggera effervescenza"],["pizza","salumi","antipasti misti"],["carne rossa pesante","selvaggina"],"rosato","Cascina Fiorita"),
 ("Pinot Nero DOC Vinificato in Rosso Cascina Torraccia","Rosso","Pinot Nero","standard",20.0,13.0,"alta","fini","medio",0.9,
  ["ciliegia","lampone","sottobosco leggero"],["carni bianche","risotto ai funghi","formaggi freschi"],["piatti molto piccanti","pesce grasso"],"rosso_piemonte","Cascina Torraccia"),
 ("Chardonnay DOC Fermentato in Acciaio Le Robinie","Bianco","Chardonnay","economico",13.5,13.0,"media","assenti","leggero-medio",1.6,
  ["mela verde","agrumi","fiori bianchi"],["pesce alla griglia","antipasti misti","insalate"],["carne rossa","piatti molto piccanti"],"bianco_nord","Le Robinie"),
 ("Metodo Classico DOCG Millesimato Cascina Bellaria","Spumante","Pinot Nero + Chardonnay","premium",39.0,12.5,"alta","assenti","medio",1.0,
  ["crosta di pane","frutta secca","agrumi maturi","mineralità"],["ostriche","risotto ai frutti di mare","aperitivo elegante"],["carne rossa pesante","piatti molto piccanti"],"spumante","Cascina Bellaria"),
 ("Uva Rara DOC Vivace Cascina Motta","Rosso","Uva Rara","economico",11.5,12.0,"media","morbidi","leggero",3.0,
  ["ciliegia dolce","lampone","leggera effervescenza"],["salumi","pizza","tortelli di zucca"],["pesce","piatti molto delicati"],"rosso_piemonte","Cascina Motta"),
 ("Riesling Italico DOC Superiore Vigna Selvatica","Bianco","Riesling Italico","standard",15.0,12.5,"alta","assenti","medio",1.6,
  ["mela","agrumi","fiori bianchi","nota minerale"],["risotto alle erbe","pesce di lago","formaggi freschi"],["carne rossa","selvaggina"],"bianco_nord","Vigna Selvatica"),
 ("Buttafuoco DOC Giovane Cascina Zappata","Rosso","Croatina + Barbera + Ughetta di Canneto","standard",17.5,13.0,"alta","medi","medio-pieno",1.3,
  ["ciliegia sotto spirito","spezie padane","frutti neri"],["salumi pavesi","primi con ragù","formaggi semi-stagionati"],["pesce","crostacei"],"rosso_piemonte","Cascina Zappata"),
 ("Pinot Grigio DOC Superiore Cascina Aurora","Bianco","Pinot Grigio","standard",16.0,13.5,"media","assenti","medio",1.8,
  ["mela","pesca bianca","mandorla dolce"],["risotto al pesce","frittura mista","formaggi freschi"],["carne rossa","formaggi molto stagionati"],"bianco_nord","Cascina Aurora"),
 ("Bonarda DOC Passito Cascina Gemma","Dolce","Croatina","premium",27.0,14.0,"media","morbidi","pieno",90.0,
  ["prugna secca","confettura di mora","spezie dolci","cioccolato"],["formaggi erborinati","cioccolato fondente","dolci al cucchiaio"],["pesce","piatti salati leggeri"],"dolce","Cascina Gemma"),
 ("Cabernet Sauvignon DOC Riserva Cascina Belfiore","Rosso","Cabernet Sauvignon","premium",26.0,14.0,"media","strutturati","pieno",0.8,
  ["ribes nero","cedro","grafite","spezie scure"],["filetto al pepe verde","selvaggina","formaggi stagionati duri"],["pesce delicato","piatti agrodolci"],"rosso_piemonte","Cascina Belfiore"),
 ("Moscato DOC Passito Cascina Solaria","Dolce","Moscato Bianco","premium",29.0,10.5,"media","assenti","pieno",120.0,
  ["albicocca disidratata","miele","zafferano","fiori d'arancio canditi"],["pasticceria secca","formaggi erborinati","crostate di frutta secca"],["carne rossa","piatti salati"],"dolce","Cascina Solaria"),
 ("Metodo Classico DOCG Sboccatura Tardiva Cascina Ombrina","Spumante","Pinot Nero","lusso",55.0,12.5,"alta","assenti","medio",0.5,
  ["frutta secca tostata","crosta di pane","miele leggero","mineralità profonda"],["caviale","crostacei pregiati","formaggi stagionati leggeri"],["carne rossa pesante","dolci molto zuccherini"],"spumante","Cascina Ombrina"),
]

DATA = DATA[:50]

assert len(DATA) == 50, len(DATA)

lines = []
lines.append("# ─────────────────────────────────────────────")
lines.append("# CATALOGO OLTREPÒ PAVESE — 50 vini")
lines.append("# Stesso formato esatto della funzione W(...) usata nel file originale.")
lines.append("# Richiede che W() e bottle_svg_data_uri() siano già definite (vedi sezione")
lines.append("# in fondo a questo file per copiarle se serve un file totalmente standalone).")
lines.append("# ─────────────────────────────────────────────")
lines.append("OLTREPO_50_CATALOG = [")
for i, (nome, tipo, uva, fascia, prezzo, alcol, acidita, tannini, corpo, rz, profilo, abbina, non_abbina, foto_key, prod) in enumerate(DATA, start=1):
    wid = f"OLT{i:03d}"
    nome_completo = nome if prod in nome else f"{nome} {prod}"
    line = (f'    W("{wid}",{json.dumps(nome_completo, ensure_ascii=False)},"Oltrepò Pavese","Italia",'
            f'"{tipo}","{fascia}",{prezzo},{json.dumps(uva, ensure_ascii=False)},{alcol},"{acidita}","{tannini}","{corpo}",{rz},'
            f'{json.dumps(profilo, ensure_ascii=False)},{json.dumps(abbina, ensure_ascii=False)},{json.dumps(non_abbina, ensure_ascii=False)},'
            f'"{wid.lower()}-oltrepo","{foto_key}"),')
    lines.append(line)
lines.append("]")

with open("/home/claude/oltrepo_block.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("OK, generate", len(DATA), "wines")
