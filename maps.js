<script type = "text/javascript"
	src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDvOhrUtu3vzlhQcxQ6XLbrdWH9d1KWD2I">
</script>
<script type = "text/javascript">
	var stepArray = [];

	function navigate() {
		for(i = 0; i < stepArray.length; i++) {
			stepArray[i].setMap(null);
		}

		var start //TODO: get starting point from the user
		var end //TODO: get end point from the user
		var request = {
			origin: start,
			destination: end,
			travelMode: google.maps.TravelMode.WALKING
		}

		directionsService.route(request, function(response, status)) {
			if (status == google.maps.DirectionsStatus.OK) {
				var warnings = document.getElementById("warnings_panel");
				warnings.innerHTML = "" + response.route[0].warnings + "";
				sendTurnSignals(response);
			}
		});
	}

	function sendTurnSignals(directionResult) {
		var myRoute = directionResult.routes[0].legs[0];

	  for (var i = 0; i < myRoute.steps.length; i++) {
	      var instr = myRoute.steps[i].instructions;
	      if (instr.match("Turn right") != null) // send signal to turn on right light
	      else if (instr.match("Turn left") != null) // send singal to turn on left light
	  }
	}

</script>