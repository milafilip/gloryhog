import { Player } from '../player';
import { Spotlight } from '../spotlight';

export class Battle extends Phaser.State {
    text: Phaser.Text;

    players;

    playerCount: number;
    playerPairs;

    platforms;
    layer;

    preload() {
      this.game.stage.backgroundColor = '#85b5e1';
      // this.game.load.baseURL = 'http://examples.phaser.io/assets/';
      // this.game.load.crossOrigin = 'anonymous';
      this.game.load.image('player', 'assets/images/guy.png');
      this.game.load.image('platform', 'assets/images/platform.png');

      this.game.load.tilemap('map', 'assets/tilemaps/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
      this.game.load.image('tilespng', 'assets/tilemaps/tiles.png');
    }

    pairwise(list) {
      if (list.length < 2) { return []; }
      var first = list[0],
          rest  = list.slice(1),
          pairs = rest.map(function (x) { return [first, x]; });
      return pairs.concat(this.pairwise(rest));
    }

    create() {
      this.game.time.advancedTiming = true;

      let map = this.game.add.tilemap('map');
      map.addTilesetImage('tiles','tilespng');
      this.layer = map.createLayer('Tile Layer 1');
      map.setCollision(1);
      map.setCollision(4);
      this.layer.resizeWorld();

      let cursors = this.game.input.keyboard.createCursorKeys();
      // // this.game.world.setBounds(0, 0, 1400, 1400);
      this.players = [
        new Player(this.game,100,0,this.game.input.activePointer.leftButton, this.game.input.activePointer.rightButton, true),
        new Player(this.game,250,0,this.game.input.keyboard.addKey(Phaser.Keyboard.A), this.game.input.keyboard.addKey(Phaser.Keyboard.S)),
        new Player(this.game,500,0,this.game.input.keyboard.addKey(Phaser.Keyboard.G), this.game.input.keyboard.addKey(Phaser.Keyboard.H))
      ];

      new Spotlight(this.game, this.players[0]);
      this.playerPairs = this.pairwise(this.players);
      //
      //
      // // this.game.camera.follow(this.players[0], Phaser.Camera.FOLLOW_PLATFORMER);

      this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
      this.game.physics.arcade.gravity.y = 2000;

      // this.platforms = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
      // this.platforms.create(300, 150, 'platform');
      // this.platforms.create(20, 300, 'platform');
      // this.platforms.create(400, 450, 'platform');
      // this.platforms.setAll('body.immovable', true);
      // this.platforms.setAll('body.allowGravity', false);
    }

    hitPlayer(player,enemy) {
      if (player.body.blocked.down && enemy.body.blocked.up) {
        enemy.respawn();
      }
    }

    update() {
      // this.game.physics.arcade.overlap(this.players, this.platforms);
      this.game.physics.arcade.overlap(this.players[0], [this.players[1],this.players[2]], this.hitPlayer, null, this);

      for (var i = 0; i < this.players.length; i++) {
        // this.game.physics.arcade.collide(this.players[i], this.platforms);
          this.game.physics.arcade.collide(this.players[i], this.layer);
          // this.game.debug.body(this.players[i]);
      }
      for (var i = 0; i < this.playerPairs.length; i++) {
        this.game.physics.arcade.collide(this.playerPairs[i][0], this.playerPairs[i][1]);
      }
    }

    render() {
      this.game.debug.text(this.game.time.fps.toString(), 200, 20, "#ff0000");
    }


}
