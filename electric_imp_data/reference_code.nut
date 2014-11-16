// Agent Code
// Log the URLs we need
server.log("Turn LED On: " + http.agenturl() + "?led_right=1");
server.log("Turn LED Off: " + http.agenturl() + "?led_right=0");
server.log("Turn LED On: " + http.agenturl() + "?led_left=1");
server.log("Turn LED Off: " + http.agenturl() + "?led_left=0");
 
function requestHandler(request, response) {
  try {
    // check if the user sent led as a query parameter
    if ("led_left" in request.query) {
      
      // if they did, and led=1.. set our variable to 1
      if (request.query.led_left == "1" || request.query.led_left == "0") {
        // convert the led query parameter to an integer
        local ledState = request.query.led_left.tointeger();
 
        // send "led" message to device, and send ledState as the data
        device.send("led", { led = "led_left", state = ledState }); 
      }
    }
    // send a response back saying everything was OK.
    
    
    if("led_right" in request.query) {
        
        if (request.query.led_right == "1" || request.query.led_right == "0") {
            local ledState = request.query.led_right.tointeger();
            device.send("led", { led = "led_right", state = ledState });
        }
    }
    
    response.send(200, "OK");

  } catch (ex) {
    response.send(500, "Internal Server Error: " + ex);
  }
}
 
// register the HTTP handler
http.onrequest(requestHandler);



//Device Code
led_left <- hardware.pin2;
led_right <- hardware.pin1;

button <- hardware.pin7;

led_left.configure(DIGITAL_OUT);
led_right.configure(DIGITAL_OUT);

function setLED(data) {
    if (data.led == "led_left") {
        led_left.write(data.state);
    } else {
        led_right.write(data.state);
    }
    server.log("Set " + data.led + ": " + data.state);
}


function buttonPress() 
{
    local state = button.read();
    if (state == 1) 
    {
        // The button is released
        
        server.log("Release");
    } else 
    {
        // The button is pressed
        
        server.log("Press");
    }
}


agent.on("led", setLED);

button.configure(DIGITAL_IN_PULLUP, buttonPress);
