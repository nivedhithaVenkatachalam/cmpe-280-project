var socketio = require('socket.io');

var master = null;
var slave = null;
var no_tree=0;
var no_wall=0;

var StateEnum = {
    FIND_MASTER: 0,
    FIND_SLAVE: 1,
    PAIR_UP: 2,        
};

var stateMachine = StateEnum.FIND_MASTER;
var clientId = 0;

module.exports.listen = function( app ){
    var io = require('socket.io')( app );

    io.on('connection', function( socket ){

        console.log('a user connected');
        

        socket.on( 'disconnect', function() {
            console.log('user disconnected');
            switch( stateMachine )
            {
                case StateEnum.FIND_MASTER:
                    break;
                    
                case StateEnum.FIND_SLAVE:
                    if( this === master )
                    {
                        stateMachine = StateEnum.FIND_MASTER;                        
                    }
                    break;
                    
                default:
                    break;
            }
        });

        socket.on( 'chatAll', function( msg ){
            io.emit( 'chatAll', msg );
        });

        socket.on( 'chatPair', function( msg ){
            if( this.slave !== null )
            {
                this.slave.emit( 'chatPair', msg );  
                this.emit( 'chatPair', msg );
            }          
            else if( this.master !== null )
            {
                this.master.emit( 'chatPair', msg );  
                this.emit( 'chatPair', msg );                
            }
        });

        socket.on( 'GetRole', function( msg ){
            socket.master = null;
            socket.slave = null;
            switch( stateMachine )
            {
                case StateEnum.FIND_MASTER:
                    master = socket;  
                    master.playerId = msg.playerId;
                    stateMachine = StateEnum.FIND_SLAVE;
                    break;
                    
                case StateEnum.FIND_SLAVE:
                    slave = socket;
                    slave.playerId = msg.playerId;
                    stateMachine = StateEnum.PAIR_UP;
                    break;
                    
                default:
                    break;
            }
            var currentState = stateMachine;
            
            if( stateMachine === StateEnum.PAIR_UP )
            {
                master.slave = slave;
                slave.master = master;
                stateMachine = StateEnum.FIND_MASTER;            
            }
        
            if( this === master )
            {
                this.emit( 'GetRole', "master" );
            }
            else if( this === slave )
            {
                this.emit( 'GetRole', "slave" );
            }
            else
            {
                this.emit( 'GetRole', "queued" );                
            }
            
            if( currentState === StateEnum.PAIR_UP )
            {
                setTimeout( function(){ StartGame( master, slave ); }, 1000 );
            }
        });
        
        function StartGame( recv1, recv2 ){ 
            recv1.emit( 'StartGame', { "opponentId": recv2.playerId } ); 
            recv2.emit( 'StartGame', { "opponentId": recv1.playerId } ); 
        }

        socket.on( 'CreateEnemy', function( msg ){       
            if( this.slave !== null )
            {
                this.slave.emit( 'CreateEnemy', msg );  
                this.emit( 'CreateEnemy', msg ); 
            }          
        });

        socket.on( 'UpdateEnemyPosition', function( msg ){
            if( this.slave !== null )
            {
                this.slave.emit( 'UpdateEnemyPosition', msg );  
                this.emit( 'UpdateEnemyPosition', msg );
            }          
        });

        socket.on( 'UpdatePlayerPosition', function( msg ){  
            if( this.slave !== null )
            {
                this.slave.emit( 'UpdatePlayerPosition', msg );  
                this.emit( 'UpdatePlayerPosition', msg );
            }          
            else if( this.master !== null )
            {
                this.master.emit( 'UpdatePlayerPosition', msg );  
                this.emit( 'UpdatePlayerPosition', msg );                
            }
        });

        socket.on( 'AddObject', function( msg ){
            if( this.slave !== null )
            {
                this.slave.emit( 'AddObject', msg );  
                this.emit( 'AddObject', msg );
            }
            else if( this.master !== null )
            {
                this.master.emit( 'AddObject', msg );  
                this.emit( 'AddObject', msg );
            }             
        });

        socket.on( 'AddEnemyWall', function( msg ){
            if( this.slave !== null )
            {
                this.slave.emit( 'AddEnemyWall', msg );  
            }
            else if( this.master !== null )
            {
                this.master.emit( 'AddEnemyWall', msg );  
            }             
        });
        
        // Web team integration
        socket.on( 'GameWin', function( msg ){ 
            if( this.slave !== null )
            {
                this.slave.emit( 'GameWin', msg );  
                this.emit( 'GameWin', msg );
            }          
            else if( this.master !== null )
            {
                this.master.emit( 'GameWin', msg );  
                this.emit( 'GameWin', msg );                
            }
            console.log( "Winner: " + msg.winnerId + " - LooserId: " + msg.looserId + " - Time: " + msg.time );
            // msg.winnerId, msg.looserId, msg.time (seconds)            
            // Please save to database here
            // localStorage.setItem("winnerId", msg.winnerId);
            // localStorage.setItem("looserId", msg.looserId);
            // localStorage.setItem("time", msg.time);
        });

        socket.on( 'PlayerPowerUp', function( msg ){
            console.log( "Power -playerId: " + msg.playerId + " - Type: " + msg.type );
            
            // msg.playerId, msg.type         
            // Please save to database here

        });

        socket.on( 'PlayerCustomize', function( msg ){
            console.log( "Customize - playerId: " + msg.playerId + " - Type: " + msg.type );
            // msg.playerId, msg.type         
            // Please save to database here

            if(msg.type=="tree")
                no_tree++;
            else if(msg.type=="wall")
                no_wall++;
        });

        socket.on( 'PlayerCharacterCustomize', function( msg ){
            if( this.slave !== null )
            {
                this.slave.emit( 'PlayerCharacterCustomize', msg );  
                this.emit( 'PlayerCharacterCustomize', msg );
            }          
            else if( this.master !== null )
            {
                this.master.emit( 'PlayerCharacterCustomize', msg );  
                this.emit( 'PlayerCharacterCustomize', msg );                
            }else
            {
                this.emit( 'PlayerCharacterCustomize', msg );                

            }
            console.log( "PlayerShape - playerId: " + msg.playerId + " - Shape: " + msg.shape + " - Color: " + msg.color );
            // msg.playerId, msg.shape, msg.color         
            // Please save to database here
            // localStorage.setItem("shape", msg.shape);
            // localStorage.setItem("color", msg.color);
            
        });
        
    });

    return io;
}
