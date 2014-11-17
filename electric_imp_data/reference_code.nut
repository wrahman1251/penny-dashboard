// Agent Code
// Log the URLs we need
server.log("Turn LED On: " + http.agenturl() + "?led_right=1");
server.log("Turn LED Off: " + http.agenturl() + "?led_right=0");
server.log("Turn LED On: " + http.agenturl() + "?led_left=1");
server.log("Turn LED Off: " + http.agenturl() + "?led_left=0");

server.log("Poll our app for a google maps destination string: " + http.agenturl() + "?destination=[insert destination]");
 
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
    
    if("destination" in request.query) {
        
        if (request.query.destination != "") {
            local destString = request.query.destination;
            device.send("destination", destString);
        }
    }
    
    response.send(200, "OK");

  } catch (ex) {
    response.send(500, "Internal Server Error: " + ex);
  }
}
 
// register the HTTP handler
http.onrequest(requestHandler);




// Copyright (c) 2013 Electric Imp
// This file is licensed under the MIT License
// http://opensource.org/licenses/MIT

// Twitter Keys
const API_KEY = "No5zWrlju7eOiFGr3aKmKSQCH";
const API_SECRET = "6PVe6fEvU9xXO8HxXrXa9yifzwBopkF9uyUlnXKohY6rREDGiz";
const AUTH_TOKEN = "2842676480-W1K92bwTrUj2qNE1BJ1KDxESyUjKsSLLdnihPcY";
const TOKEN_SECRET = "0IVRR98PwWnJp7tTZT1lK4QHtqPYjmS0L65ZRDETQOlTd";

class Twitter {
    // OAuth
    _consumerKey = null;
    _consumerSecret = null;
    _accessToken = null;
    _accessSecret = null;
    
    // URLs
    streamUrl = "https://stream.twitter.com/1.1/";
    tweetUrl = "https://api.twitter.com/1.1/statuses/update.json";
    
    // Streaming
    streamingRequest = null;
    _reconnectTimeout = null;
    _buffer = null;

    
    constructor (consumerKey, consumerSecret, accessToken, accessSecret) {
        this._consumerKey = consumerKey;
        this._consumerSecret = consumerSecret;
        this._accessToken = accessToken;
        this._accessSecret = accessSecret;
        
        this._reconnectTimeout = 60;
        this._buffer = "";
    }
    
    /***************************************************************************
     * function: Tweet
     *   Posts a tweet to the user's timeline
     * 
     * Params:
     *   status - the tweet
     *   cb - an optional callback
     * 
     * Return:
     *   bool indicating whether the tweet was successful(if no cb was supplied)
     *   nothing(if a callback was supplied)
     **************************************************************************/
    function tweet(status, cb = null) {
        local headers = { };
        
        local request = _oAuth1Request(tweetUrl, headers, { "status": status} );
        if (cb == null) {
            local response = request.sendsync();
            if (response && response.statuscode != 200) {
                server.log(format("Error updating_status tweet. HTTP Status Code %i:\r\n%s", response.statuscode, response.body));
                return false;
            } else {
                return true;
            }
        } else {
            request.sendasync(cb);
        }
    }
    
    /***************************************************************************
     * function: Stream
     *   Opens a connection to twitter's streaming API
     * 
     * Params:
     *   searchTerms - what we're searching for
     *   onTweet - callback function that executes whenever there is data
     *   onError - callback function that executes whenever there is an error
     **************************************************************************/
    function stream(searchTerms, onTweet, onError = null) {
		server.log("Opening stream for: " + searchTerms);
        // Set default error handler
        if (onError == null) onError = _defaultErrorHandler.bindenv(this);
        
        local method = "statuses/filter.json"
        local headers = { };
        local post = { track = searchTerms };
        local request = _oAuth1Request(streamUrl + method, headers, post);
        
        
        this.streamingRequest = request.sendasync(
            
            function(resp) {
                // connection timeout
                server.log("Stream Closed (" + resp.statuscode + ": " + resp.body +")");
                // if we have autoreconnect set
                if (resp.statuscode == 28 || resp.statuscode == 200) {
                    stream(searchTerms, onTweet, onError);
                } else if (resp.statuscode == 420) {
                    imp.wakeup(_reconnectTimeout, function() { stream(searchTerms, onTweet, onError); }.bindenv(this));
                    _reconnectTimeout *= 2;
                }
            }.bindenv(this),
            
            function(body) {
                 try {
                    if (body.len() == 2) {
                        _reconnectTimeout = 60;
                        _buffer = "";
                        return;
                    }
                    
                    local data = null;
                    try {
                        data = http.jsondecode(body);
                    } catch(ex) {
                        _buffer += body;
                        try {
                            data = http.jsondecode(_buffer);
                        } catch (ex) {
                            return;
                        }
                    }
                    if (data == null) return;

                    // if it's an error
                    if ("errors" in data) {
                        server.log("Got an error");
                        onError(data.errors);
                        return;
                    } 
                    else {
                        if (_looksLikeATweet(data)) {
                            onTweet(data);
                            return;
                        }
                    }
                } catch(ex) {
                    // if an error occured, invoke error handler
                    onError([{ message = "Squirrel Error - " + ex, code = -1 }]);
                }
            }.bindenv(this)
        
        );
    }
    
    /***** Private Function - Do Not Call *****/
    function _encode(str) {
        return http.urlencode({ s = str }).slice(2);
    }

    function _oAuth1Request(postUrl, headers, data) {
        local time = time();
        local nonce = time;
 
        local parm_string = http.urlencode({ oauth_consumer_key = _consumerKey });
        parm_string += "&" + http.urlencode({ oauth_nonce = nonce });
        parm_string += "&" + http.urlencode({ oauth_signature_method = "HMAC-SHA1" });
        parm_string += "&" + http.urlencode({ oauth_timestamp = time });
        parm_string += "&" + http.urlencode({ oauth_token = _accessToken });
        parm_string += "&" + http.urlencode({ oauth_version = "1.0" });
        parm_string += "&" + http.urlencode(data);
        
        local signature_string = "POST&" + _encode(postUrl) + "&" + _encode(parm_string);
        
        local key = format("%s&%s", _encode(_consumerSecret), _encode(_accessSecret));
        local sha1 = _encode(http.base64encode(http.hash.hmacsha1(signature_string, key)));
        
        local auth_header = "oauth_consumer_key=\""+_consumerKey+"\", ";
        auth_header += "oauth_nonce=\""+nonce+"\", ";
        auth_header += "oauth_signature=\""+sha1+"\", ";
        auth_header += "oauth_signature_method=\""+"HMAC-SHA1"+"\", ";
        auth_header += "oauth_timestamp=\""+time+"\", ";
        auth_header += "oauth_token=\""+_accessToken+"\", ";
        auth_header += "oauth_version=\"1.0\"";
        
        local headers = { 
            "Authorization": "OAuth " + auth_header
        };
        
        local url = postUrl + "?" + http.urlencode(data);
        local request = http.post(url, headers, "");
        return request;
    }
    
    function _looksLikeATweet(data) {
        return (
            "created_at" in data &&
            "id" in data &&
            "text" in data &&
            "user" in data
        );
    }
    
    function _defaultErrorHandler(errors) {
        foreach(error in errors) {
            server.log("ERROR " + error.code + ": " + error.message);
        }
    }

}

twitter <- Twitter(API_KEY, API_SECRET, AUTH_TOKEN, TOKEN_SECRET);

device.on("tweet", function(data){
    twitter.tweet(data);
});





//Device Code
led_left <- hardware.pin2;
led_right <- hardware.pin1;


button <- hardware.pin7;

destination <- "";

new_destination <- "";


led_left.configure(DIGITAL_OUT);
led_right.configure(DIGITAL_OUT);

function setDestination(destString) {
    server.log("Set Destination on tweet: " + destString);
    destination = destString;
    new_destination = "";
    
    for(local i = 0; i < destination.len(); i += 1) {
        if (destination[i].tochar() != "_") {
            new_destination += destination[i].tochar();
        }
        else {
            new_destination += " ";
        }
    }
}

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
        
        agent.send("tweet", "Penny boarding through " + new_destination + " right now! Hit me up if you're nearby!! #shreddingthegnar");
        server.log("Press");
    }
}


agent.on("led", setLED);

agent.on("destination", setDestination);




 




button.configure(DIGITAL_IN_PULLUP, buttonPress);
	