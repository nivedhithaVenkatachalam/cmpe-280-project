var enemy = (function () {

    "use strict";

    var enemies = [];

    function createEnemy( origin, speed, startPos, zPos) {
        
        var enemy = new Physijs.BoxMesh(
            new THREE.CubeGeometry(50, 30, 25),
            Physijs.createMaterial(
                new THREE.MeshPhongMaterial({
                    ambient: Math.random() * 0xffffff
                }),
                0, //friction
                0 //restitution/bounciness
            ),
            100
        );

        var tyre1 = new Physijs.BoxMesh(new THREE.CylinderGeometry(8, 8, 26, 12, 12, false), new THREE.MeshBasicMaterial({color: 0x000000 }), 0);
        tyre1.position.x = -17;
        tyre1.position.y = -10;
        tyre1.rotation.x = 90 * (Math.PI / 180);

        var tyre2 = new Physijs.BoxMesh(new THREE.CylinderGeometry(8, 8, 26, 12, 12, false), new THREE.MeshBasicMaterial({color: 0x000000 }), 0);
        tyre2.position.x = 17;
        tyre2.position.y = -10;
        tyre2.rotation.x = 90 * (Math.PI / 180);

        enemy.add(tyre1);
        enemy.add(tyre2);

        startPos = origin == 'right' ? startPos : -startPos;

        enemy.position.set(startPos, 18, zPos);

        enemy.userData = {
            origin: origin,
            speed: speed,
            startPos: startPos,
            zPos: zPos
        }

        enemy.name = 'enemy';
        enemy.addEventListener('collision', handleCollision);

        enemies.push(enemy);

        game.scene.add(enemy);
    }

    function createWall( x, y, z ) {
        
        var enemy = new Physijs.BoxMesh(
            new THREE.CubeGeometry(100, 30, 25),
            Physijs.createMaterial(
                new THREE.MeshPhongMaterial({
                    ambient: Math.random() * 0xffffff
                }),
                0, //friction
                0 //restitution/bounciness
            ),
            100
        );

        enemy.position.set( x, y , z );

        enemy.name = 'wall';
        enemy.addEventListener('collision', handleCollision);

        game.scene.add(enemy);
    }

    function handleCollision(objectCollidedWith) {

        player.handleCollision( objectCollidedWith );
    }

    function createEnemies() {

        //road 1
        createEnemy('right', 0.5, -200, -5 );
        createEnemy('right', 0.5, 200, -5 );

        //road 2
        createEnemy('left', 0.2, -350, -60 );
        createEnemy('left', 0.2, 0, -60 );

        //road 3
        createEnemy('right', 1.3, -200, -130 );
        createEnemy('left', 1.3, -300, -190 );

        //road 4
        createEnemy('right', 1.3, -200, -520 );
    }

    function update( delta ) {
        if (enemies.length == 0) return;

        var enemyPositions = [];
        //var position = { "x": 0, "y": 0, "z": 0 };
        for (var i = 0; i < enemies.length; i++) {

            var enemy = enemies[i];
            var position = Object.create( enemy.position );
            position.x = enemy.position.x;
            position.y = enemy.position.y;
            position.z = enemy.position.z;
            var movement = enemy.userData.origin == 'right' ? 200 : -200;

            position.x -= movement * (delta * enemy.userData.speed);

            if ((enemy.userData.origin == 'right' && position.x < -400) || (enemy.userData.origin == 'left' && position.x > 400)) {
                //restart enemy over other side
                position.x = enemy.userData.origin == 'right' ? 400 : -400;
            }
            enemyPositions.push( position );
        }
        UpdateEnemyPosition( enemyPositions );
    }

    function updateEnemy( positions ) {
        for( var i = 0; i < positions.length; ++i )
        {
            enemies[i].position.x = positions[i].x;
            enemies[i].position.y = positions[i].y;
            enemies[i].position.z = positions[i].z;
            //rotate tyres
            enemies[i].children[0].rotation.y += 1;
            enemies[i].children[1].rotation.y += 1;
            enemies[i].__dirtyPosition = true;
        }
    }

    function init() {
        
        if( clientType === Client.MASTER )
        {
            EmitCreateEnemy('right', 0.5, -200, -5 );        
            EmitCreateEnemy('right', 0.5, 200, -5 );
            EmitCreateEnemy('left', 0.2, -350, -60 );
            EmitCreateEnemy('left', 0.2, 0, -60 );
            EmitCreateEnemy('right', 1.3, -200, -130 );
            EmitCreateEnemy('left', 1.3, -300, -190 );
            EmitCreateEnemy('right', 1.3, -200, -520 );   
        }
    }

    return {
        init: init,
        createEnemy: createEnemy,
        update: update,
        updateEnemy: updateEnemy,
        createWall: createWall
    }

})();