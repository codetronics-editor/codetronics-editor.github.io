function setup_menu() {
	return {
		"Hinweis": {
			"Schnelltasten": function() {
				main.setPanel("left","left_keys");
			},
			"Beschreibung": function() {
			
			},
		},
		"Projekt": {
			"Geladen": function() {
				// neu, importieren, exportieren
				
				main.setPanel("left","left_loadedprojects");
			},
			"Aktuell": function() {
				// neu einlesen
				// 
				
				main.setPanel("left","left_currentproject");
			},
			"Struktur": function() {
				// package, class, member
				// (bereichs-) markierungen
				
				// unparsed nodes
				// highlight invalid
				
				
				main.setPanel("left","left_structure");
			},
			"Tabs": function() {
			
				
				main.setPanel("left","left_tabs");
			},
			"Eigensch.": function() {
			
				
				main.setPanel("left","left_properties");
			},
			"Varianten": function() {
				// bereiche
				// vergleich
				
				// fehlersuch-variante
				
				main.setPanel("left","left_variants");
			},
		},
		"Bearbeiten": {
			"Verlauf": function() {
				// marker (todo, bearbeitung bestätigen)
				// test/debug input category
				
				main.setPanel("left","left_history");
			},
			"Suchen/Ers.": function() {
				// refactoring
				
				main.setPanel("left","left_search");
			},
		},
		"Ausführen": {
			"Ausführen": function() {
				// einstiegspunkte
				// parameter/konfigurationen
				// ereignisse
				
				// compiler api, code-zugriff, ausführ-api, threading
				// generieren (code lesen, baumstruktur bauen, aus beschreibungssprache(json))
				
				// transformieren (baum-abfrage, baum-iteration, filterregeln/-programme, konfigurationen)
				// umstrukturieren (refactoring-skripting)
				
				// tests (syntax, zusammenhänge)
				
				main.setPanel("left","left_execute");
			},
			"Untersuchen": function() {
				// Haltepkt. liste
				// ereignis-snapshots
				// code und ereignisse zurückspulen
				
				main.setPanel("left","left_inspect");
			},
			"Zustand": function() {
				// aufrufstapel pro thread
				// variablen
				
				main.setPanel("left","left_state");
			},
		},
		"Editor": {
			"Code-Editor": function() {
				// live update
				// wertebereich
				// anzahl durchläufe
				
				// angehalten:
				// durchlauf, werte
				
				// impact scope
				
				// highlight unparsed, invalid
				
				main.setPanel("edit","edit_code");
			},
			"Konfiguration": function() {
				// selbes
				
				main.setPanel("edit","edit_config");
			},
			"Code-Diagramm": function() {
			
				
				main.setPanel("edit","edit_codediagram");
			},
			"Daten-Editor": function() {
			
				
				main.setPanel("edit","edit_data");
			},
		},
		"Analyse": { // svg
			"Abh. Matrix": function() {
				// eingabewerte unbeschränkt
				// direkter aufruf
				// indirekt (kontrollfluss/datenfluss)
				// auf funktionsebene/objektebene
				
				// callgraph
				// wer kann (indirekt) aufrufen, ruft wen (indirekt) auf ?
				
				main.setPanel("edit","edit_dependencies");
			},
			"Bereiche": function() {
				// eingabewerte unbeschränkt
				// abgeschlossene bereiche (kontrollfluss/datenfluss)
				
				main.setPanel("edit","edit_scopes");
			},
			"Zustände": function() {
				// eingabewerte unbeschränkt
				// wo werden zustände gespeichert
				// funktional/nebenwirkungen
				
				main.setPanel("edit","edit_states");
			},
			"Ablaufplan": function() {
				// eingabewerte unbeschränkt
				// bearbeiten über eigenschaften
				
				main.setPanel("edit","edit_flowchart");
			},
			"Kontrollpfade": function() {
				// eingabewerte konfiguration
				// eigenes
				// parallelisierbarkeit
				// schleifen, anzahl durchläufe
				// rekursion, indirekt
				
				main.setPanel("edit","edit_controlpath");
			},
			"Verhalten": function() {
				// eingabewerte konfiguration
				// rekursion
				// komplexität
				
				main.setPanel("edit","edit_behavior");
			},
			"Datenfluss": function() {
				// eingabewerte konfiguration
				// eigenes
				
				main.setPanel("edit","edit_dataflow");
			},
			"Wertebereich": function() {
				// eingabewerte konfiguration
				// Ergebnisse aus Datenfluss tabellarisch
				
				main.setPanel("edit","edit_valuerange");
			},
		},
	};
}