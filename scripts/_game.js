var game = (function () {

    "use strict";

    Physijs.scripts.worker = 'scripts/physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';
    
    var gameContainer = document.getElementById("webgl-container");
    console.log( gameContainer.clientWidth  );
    console.log( gameContainer.clientHeight   );
    
    var frameSkip = 0;

    var scene = new Physijs.Scene(),
        camera,
        clock = new THREE.Clock(),
        width = gameContainer.clientWidth,
        height = ( ( ( gameContainer.clientWidth * 3 ) / 4 ) ),
        playerBox,
        renderer = new THREE.WebGLRenderer(),
        playerActive = true,
        lives = 3,
        controls;

    renderer.setSize( width, height );
    renderer.setClearColor(0xE0EEEE);

    document.getElementById("webgl-container").appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(
        35,
        width / height,
        1,
        1000
    );

    scene.add(camera);
    scene.fog = new THREE.Fog(0xE0EEEE, 250, 600);
    scene.setGravity(new THREE.Vector3(0, -100, 0));

    function init() {

        text.createPlayerText( "Waiting for second player" );
        pointerLock.init(camera, scene);
        sceneSetup.addSceneObjects();
        gameControls.init();
        resetScene();

        render();
    }

    function newGame() {
          
        if( game.waitingPlayer ){
            game.scene.remove( game.waitingPlayer );
            game.waitingPlayer = null;
        }
          
        enemy.init();

        //trees
        for (var i = 0; i < 20; i++) {
            AddObject( objectTypeTree, { "x": support.getRand(-500, 500), "z": support.getRand(-250, -320) } );
        }
        
        for (var i = 0; i < 10; i++) {
            AddObject( objectTypePowerUp, { "x": support.getRand(-500, 500), "z": support.getRand(-150, -820) } );
        }
    }

    function resetScene() {
        camera.position.set( -15, 105, 345 );
        camera.rotation.set( 50, 0, 0);
    }

    function removeLife( life ) {
        document.getElementById("numberOfLives").innerHTML = life;
    }

    function render() {
        scene.simulate();
        pointerLock.controls.update();

        if( clientType === Client.MASTER && startGame === 1 )
        {
            frameSkip++;
            if( frameSkip > 3 )
            {
                frameSkip = 0;
                var delta = clock.getDelta();
                enemy.update(delta);
            }
        }

        if (game.wintext) {
            game.wintext.rotation.y += 0.01;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    return {
        scene: scene,
        camera: camera,
        playerBox: playerBox,
        init: init,
        controls: controls,
        playerActive: playerActive,
        resetScene: resetScene,
        lives: lives,
        removeLife: removeLife,
        newGame: newGame
    }

})();