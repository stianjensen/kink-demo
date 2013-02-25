function FixedCamera( _options ) {
    var goalposition = _options.position || {
        "x": x,
        "y": y,
        "z": z
    }
    var startposition, startTime, endTime, cameraHelper;

    this.init = function( prevCamera ) {
        console.log("init time: %i", t);
        startposition = (_options.startposition) || (prevCamera.position);
        cameraHelper = new CameraHelper( _options );

        return startposition;
    };

    this.getPosition = function( target ) {
        return cameraHelper.animate( startposition, goalposition );
    };
}

function TrackingCamera( _options ) {
    if (!_options.position) {
        _options.position = {"x":0, "y":0, "z":0};
    }
    var relative_position = _options.position;
    var startposition, startTime, endTime, cameraHelper;

    this.init = function( prevCamera ) {
        console.log("init time: %i", t);
        startposition = (_options.startposition) || (prevCamera.position);
        cameraHelper = new CameraHelper( _options );

        return startposition;
    };

    this.getPosition = function( target ) {
        var relative_position = cameraHelper.animate( startposition, goalposition );

        return {
            "x": target.x + relative_position.x, 
            "y": target.y + relative_position.y, 
            "z": target.z + relative_position.z, 
        };
    };
}

function CameraHelper( _options ) {
    var cameraMovementDone = true;
    if (_options.animate) {
        startTime = t;
        endTime = t + ( _options.duration || 1000);
        cameraMovementDone = false;
    }

    this.animate = function(startposition, goalposition) {

        /* interpolate camera movement */
        var position = {};
        if (!cameraMovementDone) {
            var interpolt = (t-startTime) / (endTime-startTime);
            if (interpolt >=0 && interpolt < 1) {
                position.x = smoothstep(startposition.x, goalposition.x, interpolt);
                position.y = smoothstep(startposition.y, goalposition.y, interpolt);
                position.z = smoothstep(startposition.z, goalposition.z, interpolt);
            } else {
                position.x = goalposition.x;
                position.y = goalposition.y;
                position.z = goalposition.z;
                cameraMovementDone = true;
            }
            return position;
        }
        return goalposition;
    };
}