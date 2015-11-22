var gameControls=(function(){

    function checkKey(e) {

        if(!game.playerActive){
            return;
        }

        var left = 65,
            up = 87,
            right = 68,
            down = 83,
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
        }
    }

    function init(){
        window.onkeydown = checkKey;
    }

    return{
        init: init
    }

})();