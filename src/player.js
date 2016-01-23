var Player = (function () {
    "use strict";
    
    var loader = new ImageBatch("images/"),
        torso = loader.load("torso.png"),
        leg = loader.load("leg.png"),
        arm = loader.load("arm.png"),
        rocket = loader.load("rocket.png"),
        playerHeight = 200,
        legPivotHeight = playerHeight * 0.5,
        armPivotHeight = playerHeight * 0.78,
        MAX_LEG_SWING = Math.PI * 0.1,
        MAX_ARM_SWING = Math.PI * 0.03,
        DRAW_OFFSET = 5,
        SWING_RATE = 0.005;
    
    loader.commit();
    
    function Rocket(location, velocity) {
        this.location = location.clone();
        this.velocity = velocity.clone();
    }
    
    Rocket.prototype.draw = function(context) {
        if (!loader.loaded) {
            return;
        }
        var rocketLength = 25,
            flameOffset = 5,
            rocketHeight = rocketLength / rocket.width;
        context.drawImage(rocket, this.location.x - flameOffset, this.location.y - rocketHeight * 0.5, rocketLength, rocketHeight);
    };
    
    Rocket.prototype.update = function(elapsed, platforms, particles, enemies, gravity) {
        this.velocity.addScaled(gravity, elapsed);
        this.location.addScaled(this.velocity, elapsed);
    };
    
    function Player(location) {
        this.location = location;
        this.swingDelta = 0;
        
        this.rockets = [];
    }
    
    Player.prototype.draw = function (context) {
        if (!loader.loaded) {
            return;
        }
        
        var torsoHeight = playerHeight * 0.6,
            scaleFactor = torsoHeight / torso.height,
            torsoWidth = torso.width * scaleFactor,
            legWidth = leg.width * scaleFactor,
            legHeight = leg.height * scaleFactor,
            legPivotY = this.location.y - legPivotHeight + DRAW_OFFSET,
            armWidth = arm.width * scaleFactor,
            armHeight = arm.height * scaleFactor,
            armPivotY = this.location.y - armPivotHeight + DRAW_OFFSET,
            swing = Math.sin(this.swingDelta * SWING_RATE);
            
        context.save();
        context.translate(this.location.x, legPivotY);
        context.rotate(MAX_LEG_SWING * swing);
        context.drawImage(leg, -legWidth * 0.5, -2, legWidth, legHeight);
        context.restore();
        
        context.save();
        context.translate(this.location.x, armPivotY);
        context.rotate(MAX_ARM_SWING * swing);
        context.drawImage(arm, -armWidth * 0.13, -1, armWidth, armHeight);
        context.restore();
        
        context.drawImage(torso, this.location.x - torsoWidth * 0.5, this.location.y - playerHeight + DRAW_OFFSET, torsoWidth, torsoHeight);
        
        context.save();
        context.translate(this.location.x, legPivotY);
        context.rotate(-MAX_LEG_SWING * swing);
        context.drawImage(leg, -legWidth * 0.5, -2, legWidth, legHeight);
        context.restore();
                
        context.save();
        context.translate(this.location.x, armPivotY);
        context.rotate(-MAX_ARM_SWING * swing);
        context.drawImage(arm, -armWidth * 0.13, -1, armWidth, armHeight);
        context.restore();
        
        for (var r = 0; r < this.rockets.length; ++r) {
            this.rockets[r].draw(context);
        }
    };
    
    Player.prototype.update = function (elapsed, platforms, particles, enemies, gravity, keyboard, mouse) {
        this.swingDelta += elapsed;
        this.location.x += elapsed * 0.1;
        
        if (mouse.leftDown) {
            console.log("Fire rocket");
            this.rockets.push(new Rocket(LINEAR.addVectors(this.location, new LINEAR.Vector(5, -armPivotHeight)), new LINEAR.Vector(1, 0)));
        }
        
        for (var r = 0; r < this.rockets.length; ++r) {
            this.rockets[r].update(elapsed, platforms, particles, enemies, gravity);
        }
    };
    
    return Player;
}());