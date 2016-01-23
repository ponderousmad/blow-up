var INPUT = (function (LINEAR) {
    "use strict";

    function KeyboardState(element) {
        this.pressed = {};
        this.lastPressed = {};
        var self = this;
        
        if (element) {
            element.onkeydown = function (e) {
                e = e || window.event;
                self.pressed[e.keyCode] = true;
            };

            element.onkeyup = function (e) {
                e = e || window.event;
                delete self.pressed[e.keyCode];
            };
        }
    }

    KeyboardState.prototype.isKeyDown = function (keyCode) {
        return this.pressed[keyCode] ? true : false;
    };

    KeyboardState.prototype.wasKeyPressed = function (keyCode) {
        return this.pressed[keyCode] ? !this.wasKeyPressed[keyCode] : false;
    };

    KeyboardState.prototype.isShiftDown = function () {
        return this.isKeyDown(16);
    };

    KeyboardState.prototype.isCtrlDown = function () {
        return this.isKeyDown(17);
    };

    KeyboardState.prototype.isAltDown = function () {
        return this.isKeyDown(18);
    };
       
    KeyboardState.prototype.isAsciiDown = function (ascii) {
        return this.isKeyDown(ascii.charCodeAt());
    };
       
    KeyboardState.prototype.wasAsciiPressed = function (ascii) {
        return this.wasKeyPressed(ascii.charCodeAt());
    };
       
    KeyboardState.prototype.keysDown = function () {
        var count = 0;
        for (var p in this.pressed) {
            if (this.pressed.hasOwnProperty(p)) {
                ++count;
            }
        }
        return count;
    };
    
    KeyboardState.prototype.postUpdate = function () {
        this.lastPressed = {}
        for (var p in this.pressed) {
            if (this.pressed.hasOwnProperty(p)) {
                this.lastPressed[p] = this.pressed[p];
            }
        }
    };

    function MouseState(element) {
        this.location = new LINEAR.Vector(0, 0);
        this.left = false;
        this.middle = false;
        this.right = false;
        this.wasLeft = false;
        this.wasMiddle = false;
        this.wasRight = false;
        this.leftDown = false;
        this.middleDown = false;
        this.rightDown = false;
        this.shift = false;
        this.ctrl = false;
        this.alt = false;
        
        var self = this;
        var updateState = function (event) {
            var bounds = element.getBoundingClientRect(),
                left = (event.buttons & 1) == 1,
                right = (event.buttons & 2) == 2,
                middle = (event.buttons & 4) == 4;

            self.location.set(event.clientX - bounds.left, event.clientY - bounds.top);

            self.leftDown = self.left && !self.wasLeft;
            self.middleDown = self.middle && !self.wasMiddle;
            self.rightDown = self.right && !self.wasRight;
            
            if (self.leftDown) {
                console.log("left pressed");
            }
            
            self.wasLeft = self.left;
            self.wasRight = self.right;
            self.wasMiddle = self.middle;
            
            self.left = left;
            self.right = right;
            self.middle = middle;
            
            self.shift = event.shiftKey;
            self.ctrl = event.ctrlKey;
            self.altKey = event.altKey;
        };
        
        element.addEventListener("mousemove", updateState);
        element.addEventListener("mousedown", updateState);
        element.addEventListener("mouseup", updateState);
    }
    
    MouseState.prototype.postUpdate = function () {
        this.leftDown = false;
        this.middleDown = false;
        this.rightDown = false;
    };
    
    return {
        KeyboardState: KeyboardState,
        MouseState: MouseState
    };
}(LINEAR));