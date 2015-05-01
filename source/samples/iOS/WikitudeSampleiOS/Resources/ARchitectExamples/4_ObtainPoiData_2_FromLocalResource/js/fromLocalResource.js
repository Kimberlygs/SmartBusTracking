// implementation of AR-Experience (aka "World")
var World = {
	// you may request new data from server periodically, however: in this sample data is only requested once
	isRequestingData: false,

	// true once data was fetched
	initiallyLoadedData: false,

	// different POI-Marker assets
	markerDrawable_idle: null,
	markerDrawable_selected: null,
	markerDrawable_directionIndicator: null,

	// list of AR.GeoObjects that are currently shown in the scene / World
	markerList: [],

	// The last selected marker
	currentMarker: null,

	// called to inject new POI data
	loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {

		// empty list of visible markers
		World.markerList = [];

		// start loading marker assets
		World.markerDrawable_idle = new AR.ImageResource("assets/marker_idle.png");
		World.markerDrawable_selected = new AR.ImageResource("assets/marker_selected.png");
		World.markerDrawable_directionIndicator = new AR.ImageResource("assets/indi.png");

		// loop through POI-information and create an AR.GeoObject (=Marker) per POI
		// for (var currentPlaceNr = 0; currentPlaceNr < poiData.length; currentPlaceNr++) {
			// var singlePoi = {
			// 	"id": poiData[currentPlaceNr].id,
			// 	"latitude": parseFloat(poiData[currentPlaceNr].latitude),
			// 	"longitude": parseFloat(poiData[currentPlaceNr].longitude),
			// 	"altitude": parseFloat(poiData[currentPlaceNr].altitude),
			// 	"title": poiData[currentPlaceNr].name,
			// 	"description": poiData[currentPlaceNr].description
			// };

		var staticPOI = [{
			"id": "1",
			"longitude": "4.417473",
			"latitude": "51.219590",
			"description": "Roosevelt plaats",
			"altitude": "100.0",
			"name": "Roosevelt plaats"
		}, {
			"id": "2",
			"longitude": "4.423541",
			"latitude": "51.216343",
			"description": "De zoo",
			"altitude": "100.0",
			"name": "zoo antwerpen"
		}, {
			"id": "3",
			"longitude": "4.359705",
			"latitude": "51.060710",
			"description": "t pleintje",
			"altitude": "100.0",
			"name": "t pleintje Willebroek"
		}, {
			"id": "4",
			"longitude": "4.408817",
			"latitude": "51.218100",
			"description": "de meir ",
			"altitude": "100.0",
			"name": "Bushalte de Meir"
		}, {
			"id": "5",
			"longitude": "4.401093",
			"latitude": "51.219410",
			"description": "Groenplaats Antwerpen",
			"altitude": "100.0",
			"name": "Groenplaats Antwerpen"
		}, {
			"id": "10",
			"longitude": "4.352834",
			"latitude": "50.846765",
			"description": "De grote markt Brussel",
			"altitude": "100.0",
			"name": "Grote markt Brussel"
		}]; 

			World.markerList.push(new Marker(staticPOI));
		}

		World.updateStatusMessage(currentPlaceNr + ' places loaded');
	},

	// updates status message shon in small "i"-button aligned bottom center
	updateStatusMessage: function updateStatusMessageFn(message, isWarning) {

		var themeToUse = isWarning ? "e" : "c";
		var iconToUse = isWarning ? "alert" : "info";

		$("#status-message").html(message);
		$("#popupInfoButton").buttonMarkup({
			theme: themeToUse
		});
		$("#popupInfoButton").buttonMarkup({
			icon: iconToUse
		});
	},

	// location updates, fired every time you call architectView.setLocation() in native environment
	locationChanged: function locationChangedFn(lat, lon, alt, acc) {

		// request data if not already present
		if (!World.initiallyLoadedData) {
			World.requestDataFromLocal(lat, lon);
			World.initiallyLoadedData = true;
		}
	},

	// fired when user pressed maker in cam
	onMarkerSelected: function onMarkerSelectedFn(marker) {

		// deselect previous marker
		if (World.currentMarker) {
			if (World.currentMarker.poiData.id == marker.poiData.id) {
				return;
			}
			World.currentMarker.setDeselected(World.currentMarker);
		}

		// highlight current one
		marker.setSelected(marker);
		World.currentMarker = marker;
	},

	// screen was clicked but no geo-object was hit
	onScreenClick: function onScreenClickFn() {
		if (World.currentMarker) {
			World.currentMarker.setDeselected(World.currentMarker);
		}
	},

	/*
		In case the data of your ARchitect World is static the content should be stored within the application. 
		Create a JavaScript file (e.g. myJsonData.js) where a globally accessible variable is defined.
		Include the JavaScript in the ARchitect Worlds HTML by adding <script src="js/myJsonData.js"/> to make POI information available anywhere in your JavaScript.
	*/

	// request POI data
	requestDataFromLocal: function requestDataFromLocalFn(lat, lon) {

		var poisNearby = Helper.bringPlacesToUser(myJsonData, lat, lon);
		World.loadPoisFromJsonData(poisNearby);


	}

};


/* forward locationChanges to custom function */
AR.context.onLocationChanged = World.locationChanged;

/* forward clicks in empty area to World */
AR.context.onScreenClick = World.onScreenClick;