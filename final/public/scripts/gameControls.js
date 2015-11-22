
var gameControls=(function(){

    function checkKey(e) {

        if(!game.playerActive){
            return;
        }

        var left = 65,
            up = 87,
            right = 68,
            down = 83,
            insert_wall = 76,
            insert_tree = 84,
            increment = 2;

        e = e || window.event;

        if (e.keyCode == up) {
            player.moveZ(-increment);
        } else if (e.keyCode == down) {
            player.moveZ(increment);
        } else if (e.keyCode == left) {
            player.moveX(-increment);
        } else if (e.keyCode == right) {
            player.moveX(increment);
        }else if (e.keyCode == insert_wall){
            player.addWall();
            UpdateCustomize( thisPlayerId, "wall" );
        }
        else if (e.keyCode ==insert_tree){
            player.addTree();
            UpdateCustomize( thisPlayerId, "tree" );
        }
    }

    function init(){
        window.onkeydown = checkKey;
    }

    return{
        init: init
    }

})();