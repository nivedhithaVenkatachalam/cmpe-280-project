
var player=(function(){

    "use strict";
    
    var playerId = 0;
    var players = {};
    var thisPlayer;
    var oppossingPlayer;
    var boost = 1;
    var flying = 0;
    var lives = 3;
    var thisShape = "rectangle";
    var thisColor = "green"
    var countDown = 3;

    var movementRate = 2,
        finishLineZPos=-920;

    function init(){
        lives = 3;
    }
    
    function setPlayerId( id )
    {
        playerId = id;
        thisPlayer = players[id];
    }
    
    function setPlayerPosition( id, playerPosition )
    {        
        players[id].position.x = playerPosition.x;  
        players[id].position.y = playerPosition.y;  
        players[id].position.z = playerPosition.z;   
        players[id].__dirtyPosition = true;
        
        if( id === playerId )
        {
            game.camera.position.x = playerPosition.x;
            game.camera.position.y = playerPosition.y + 100;
            game.camera.position.z = playerPosition.z + 300;
            game.camera.rotation.set( 50, 0, 0 );
            game.camera.__dirtyPosition = true;
        }
        checkIfPlayerAtFinish( id );
    }

    function moveX(movement) {
        var playerPosition = Object.create( players[playerId].position );
        playerPosition.x = players[playerId].position.x;
        playerPosition.y = players[playerId].position.y;
        playerPosition.z = players[playerId].position.z;
        playerPosition.x  += ( movementRate * boost ) * movement;
        
        UpdatePlayerPosition( playerId, playerPosition );
    }

    function moveZ(movement) {
        var playerPosition = Object.create( players[playerId].position );
        playerPosition.x = players[playerId].position.x;
        playerPosition.y = players[playerId].position.y;
        playerPosition.z = players[playerId].position.z;
        playerPosition.z  += ( movementRate * boost ) * movement ;
        
        UpdatePlayerPosition( playerId, playerPosition );
    }

    function checkIfPlayerAtFinish( id ){

        if( players[id].position.z<=finishLineZPos ){

            if( game.wintext ){
                //dont display win text twice!
                return;
            }
                
            if( id === playerId )
            {
                UpdateGameWinner( thisPlayer.playerId, oppossingPlayer.playerId );
            }
        }
    }
    
    function gameWin( winnerId )
    {
        if( game.wintext ){
            return
        }
            
        if( winnerId === playerId )
        {
            text.createText('You win!', 'winText');            
        }
        else
        {
            text.createText('You Lose!', 'winText');                
        }
        game.wintext.position.x = players[playerId].position.x;
        game.wintext.position.y = players[playerId].position.y;
        game.wintext.position.z = players[playerId].position.z;
        game.wintext.position.z -= 200;
    }
    
    function powerText( textString )
    {
        if( game.powerText ){
            game.scene.remove( game.powerText );
            game.powerText = null;
        }
            
        text.createPowerText(textString, 'powerText');            
        game.powerText.position.x = players[playerId].position.x - 10;
        game.powerText.position.y = players[playerId].position.y + 50;
        game.powerText.position.z = players[playerId].position.z - 100;
    }
    
    function resetPowerText()
    {
        if( game.powerText ){
            game.scene.remove( game.powerText );
            game.powerText = null;
        }
    }

    function createPlayer( offset, key, type, color ){

        var playerBoxMaterial = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({
                visible: false
            }),
            10.1, //friction
            0.1 //restitution/bounciness
        );

        var personMaterial;

        var personLeftLeg = 
            new THREE.MeshPhongMaterial({
                ambient: 0x0dd00,
                transparent: true,
                
            });

        var personRightLeg = 
            new THREE.MeshPhongMaterial({
                ambient: 0x0dd00,
                transparent: true,
                
            });
            
            console.log( "payer1" );

       
        var playerBody;
      
        switch( color )
        {
            default:
            case "green":
            {
                personMaterial = new THREE.MeshPhongMaterial({
                    ambient: 0x0dd00,
                    transparent: true,
                });
            
                personMaterial.ambient.r = 0x00;
                personMaterial.ambient.g = 0xFF;
                personMaterial.ambient.b = 0x00;
            }
            break;
            
            case "red":
            {
                personMaterial = new THREE.MeshPhongMaterial({
                    ambient: 0xFA200,
                    transparent: true,
                });
            
                personMaterial.ambient.r = 0xFF;
                personMaterial.ambient.g = 0x00;
                personMaterial.ambient.b = 0x00;
            }
            break;
            
            case "blue":
            {
                personMaterial = new THREE.MeshPhongMaterial({
                    ambient: 0x01C00,
                    transparent: true,
                });
            
                personMaterial.ambient.r = 0x00;
                personMaterial.ambient.g = 0x00;
                personMaterial.ambient.b = 0xFF;
            }
            break;
        }

        switch( type )
        {
            default:
            case "rectangle":
            {
                playerBody = new Physijs.BoxMesh(
                    new THREE.BoxGeometry(8, 5, 5),
                    personMaterial,
                    0.1
                );
            }
            break;
            
            case "sphere":
            {
                playerBody = new Physijs.BoxMesh(
                new THREE.SphereGeometry(4, 30 , 30),
                personMaterial,
                0.1
                );
            }
            break;
            
            case "cylinder":
            {
                playerBody = new Physijs.BoxMesh(
                new THREE.CylinderGeometry(1, 6, 6, 4),
                personMaterial,
                0.1
                );
            }
            break;
        }

        playerBody.position.y = -8;

        var playerLLeg = new Physijs.BoxMesh(
            new THREE.BoxGeometry(2, 5, 5),
            personLeftLeg,
            0.1
        );
        playerBody.add(playerLLeg);
        playerLLeg.position.y = -5;
        playerLLeg.position.x = -2;

        var playerRLeg = new Physijs.BoxMesh(
            new THREE.BoxGeometry(2, 5, 5),
            personRightLeg,
            0.1
        );
        playerBody.add(playerRLeg);
        playerRLeg.position.y = -5;
        playerRLeg.position.x = 2;

        var playerBox =  new Physijs.BoxMesh(
            new THREE.CubeGeometry(10, 10, 10),
            playerBoxMaterial,
            0.1
        );
            console.log( "payer3" );

        playerBox.position.set( offset, 15, 50);
        playerBox.name = "playerBox";
        playerBox.add(playerBody);
        playerBody.position.y = 2;
        playerBox.playerBody = playerBody;
        playerBox.playerLLeg = playerLLeg;
        playerBox.playerRLeg = playerRLeg;

        game.scene.add( playerBox );
        playerBox.offset = offset;
        playerBox.key = key;
        players[key] = playerBox;
        playerBox.addEventListener('collision', handlePlayerCollision);
        
        players[key].id = key;
        if( key === playerId )
        {            
            thisShape = type;
            thisColor = color;
            thisPlayer = players[key];
            thisPlayer.playerId = key;
        }
        else
        {
            oppossingPlayer = players[key];
            oppossingPlayer.playerId = key;
        }
    }
    function handlePlayerCollision(objectCollidedWith) {

        if( objectCollidedWith.name == "playerBox" ) {
            pointerLock.controls.enabled = false;
            game.playerActive = false;

            setTimeout(handlePlayerCollided, 2000);
        }
        else if( objectCollidedWith.name == "powerUp" && this.id === playerId ) {
            if( objectCollidedWith.used === 0 )
            {
                objectCollidedWith.used = 1;
                
                var min = 0;
                var max = 3;
                var powerType = parseInt((Math.random() * (max - min + 1)), 10) + min;
                
                switch( powerType )
                {
                    case 0:
                        addWallToEnemy();
                        UpdatePowerUp( thisPlayer.playerId, "wall" );     
                        powerText( "You gave your opponent the WALL!" );
                        break;
                        
                    case 1:
                        if( boost === 1.0 )
                        {
                            boost = 3.0;
                            thisPlayer.originalLeftLegColorG = thisPlayer.playerLLeg.material.ambient.g;
                            thisPlayer.originalLeftLegColorR = thisPlayer.playerLLeg.material.ambient.r;
                            thisPlayer.originalLeftLegColorB = thisPlayer.playerLLeg.material.ambient.b;
                            thisPlayer.originalRightLegColorG = thisPlayer.playerRLeg.material.ambient.g;
                            thisPlayer.originalRightLegColorR = thisPlayer.playerRLeg.material.ambient.r;
                            thisPlayer.originalRightLegColorB = thisPlayer.playerRLeg.material.ambient.b;
                            thisPlayer.playerRLeg.material.ambient.g = 0;
                            thisPlayer.playerRLeg.material.ambient.r = 255;
                            thisPlayer.playerRLeg.material.ambient.b = 0;
                            thisPlayer.playerLLeg.material.ambient.g = 0;
                            thisPlayer.playerLLeg.material.ambient.r = 255;
                            thisPlayer.playerLLeg.material.ambient.b = 0;
                            setTimeout(resetBoost, 2000);                        
                            UpdatePowerUp( thisPlayer.playerId, "boost" );  
                            powerText( "You got boost!" );
                        }
                        break;
                        
                    case 2:        
                        {
                            var playerPosition = Object.create( thisPlayer.position );
                            playerPosition.x = players[playerId].position.x + 50;
                            playerPosition.y = players[playerId].position.y;
                            playerPosition.z = players[playerId].position.z;
                            UpdatePlayerPosition( oppossingPlayer.id, playerPosition );                            
                            UpdatePowerUp( thisPlayer.playerId, "teleport" );
                            powerText( "You teleported your opponent!" );
                        }
                        break;
                        
                    case 3:        
                        {
                            thisPlayer.playerLLeg.material.opacity = 0.3;
                            thisPlayer.playerRLeg.material.opacity = 0.3;
                            
                            var playerPosition = Object.create( players[playerId].position );
                            playerPosition.x = players[playerId].position.x;
                            playerPosition.y = players[playerId].position.y;
                            playerPosition.z = players[playerId].position.z - 200;
                            UpdatePlayerPosition( playerId, playerPosition );
        
                            setTimeout(resetFlying, 2000);                        
                            UpdatePowerUp( thisPlayer.playerId, "flash" );     
                            powerText( "You got flash!" );
                        }
                        break;
                        
                    default:
                        break;
                }
                setTimeout(resetPowerText, 2000);    
            }
        }
    }
    
    function resetBoost() {
        //players[playerId].rotation.set( 0, 0, 0 );
        boost = 1.0;
        thisPlayer.playerLLeg.material.ambient.g = thisPlayer.originalLeftLegColorG;
        thisPlayer.playerLLeg.material.ambient.r = thisPlayer.originalLeftLegColorR;
        thisPlayer.playerLLeg.material.ambient.b = thisPlayer.originalLeftLegColorB;
        thisPlayer.playerRLeg.material.ambient.g = thisPlayer.originalRightLegColorG;
        thisPlayer.playerRLeg.material.ambient.r = thisPlayer.originalRightLegColorR;
        thisPlayer.playerRLeg.material.ambient.b = thisPlayer.originalRightLegColorB;
    }
    
    function resetFlying() {
        //players[playerId].rotation.set( 0, 0, 0 );
        thisPlayer.playerLLeg.material.opacity = 1.0;
        thisPlayer.playerRLeg.material.opacity = 1.0;
    }

    function handlePlayerCollided() {
        //players[playerId].rotation.set( 0, 0, 0 );
        game.playerActive = true;
    }

    function handleCollision(objectCollidedWith) {

        if( objectCollidedWith.name == "playerBox" && objectCollidedWith.key === playerId ) {
            if( lives > 0 )
            {
                pointerLock.controls.enabled = false;
                game.playerActive = false;
                lives--;
                game.removeLife( lives );
                if( lives === 0 )
                {
                    UpdateGameWinner( oppossingPlayer.playerId, thisPlayer.playerId );
                }
                else
                {
                    setTimeout(handlePlayerKilled, 2000);
                }
            }
        }
        
    }

    function handlePlayerKilled() {

        var offset = players[playerId].offset;
        game.scene.remove( players[playerId] );

        game.resetScene();
        createPlayer( offset, playerId, "default" , "default");
        game.playerActive = true;
    }
    
    function addTree()
    {
        AddObject( objectTypeTree, { "x": thisPlayer.position.x, "z": thisPlayer.position.z - 100 } );
    }
    

    function addWall()
    {
        AddObject( objectTypeWall, { "x": thisPlayer.position.x, "y": thisPlayer.position.y, "z": thisPlayer.position.z - 100 } );        
    }
    
    function addWallToEnemy()
    {
        AddObject( objectTypeWall, { "x": oppossingPlayer.position.x, "y": oppossingPlayer.position.y, "z": oppossingPlayer.position.z - 100 } );        
    }
    
    function resetCamera()
    {
        setPlayerPosition( playerId, thisPlayer.position );
    }
    
    function changeShape( shape )
    {
        UpdatePlayerCharacter( thisPlayer.playerId, shape, thisColor );
    }

    function changeColor( color )
    {
        UpdatePlayerCharacter( thisPlayer.playerId, thisShape, color );
    }
    
    function playerCustomize( id, shape, color )
    {        
        console.log( id + " " + shape + " " + color );
        if( id === playerId )
        {
            var offset = thisPlayer.offset;
            game.scene.remove( thisPlayer );
            createPlayer( offset, id, shape, color );            
        }
        else
        {
            var offset = oppossingPlayer.offset;
            game.scene.remove( oppossingPlayer );
            createPlayer( offset, id, shape, color );            
        }
    }

    function playerBroadcastCust()
    {
        UpdatePlayerCharacter( thisPlayer.playerId, thisShape, thisColor );
    }
    
    function startGameCount()
    {
        game.playerActive = false;
        countDown = 4;
        powerText( "Ready..." );
        setTimeout( updateCount, 1000 ); 
    }
    
    function updateCount()
    {
        --countDown;
        if( countDown > 0 )
        {
        powerText( countDown + "..." );
            setTimeout( updateCount, 1000 );         
        }
        else
        {
            powerText( "Go!" );
            game.playerActive = true;
            setTimeout( resetPowerText, 1000 );         
        }
    }

    return{
        init: init,
        createPlayer: createPlayer,
        moveX: moveX,
        moveZ: moveZ,
        setPlayerId: setPlayerId,
        setPlayerPosition: setPlayerPosition,
        handleCollision: handleCollision,
        addTree: addTree,
        addWallToEnemy: addWallToEnemy,
        resetCamera: resetCamera,
        gameWin: gameWin,
        powerText: powerText,
        addWall: addWall,
        changeShape: changeShape,
        changeColor: changeColor,
        playerCustomize: playerCustomize,
        playerBroadcastCust: playerBroadcastCust,
        startGameCount: startGameCount
    }

})();