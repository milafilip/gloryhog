import { Player } from '../player';
import { Spotlight } from '../spotlight';
import { Oscar } from '../oscar';

export class Battle extends Phaser.State {
    text: Phaser.Text;
    players;
    playerCount: number;
    playerPairs;
    layer;
    layer2;
    layer3;
    map;
    music;
    conductor;
    oscar: Oscar;
    spotlight: Spotlight;

    pairwise(list) {
      if (list.length < 2) { return []; }
      var first = list[0],
          rest  = list.slice(1),
          pairs = rest.map(function (x) { return [first, x]; });
      return pairs.concat(this.pairwise(rest));
    }

    preload() {
      this.game.stage.backgroundColor = '#7D4545';
      this.game.load.atlas('player', 'assets/images/player.png', 'assets/images/player.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
      this.game.load.atlas('conductor', 'assets/images/conductor.png', 'assets/images/conductor.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
      this.game.load.tilemap('map', 'assets/tilemaps/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
      this.game.load.image('tilespng', 'assets/images/tiles.png');
      this.game.load.image('tilespng2', 'assets/images/stage2.png');
      this.game.load.image('oscar', 'assets/images/oscar.png');
      this.game.load.audio('song', 'assets/audio/song.m4a');
    }

    create() {

      this.music = this.game.add.audio('song');
      this.music.play();
      this.music.loop = true;
      this.music.volume = 0.1;

      this.game.time.advancedTiming = true;
      this.map = this.game.add.tilemap('map');
      this.map.addTilesetImage('tiles','tilespng');
      this.map.addTilesetImage('foreground','tilespng2');

      this.layer2 = this.map.createLayer('Tile Layer 2');
      this.layer = this.map.createLayer('Tile Layer 1');
      this.layer3 = this.map.createLayer('platforms');
      this.layer.visible = false;

      // map.setCollision(indexes: any, collides?: boolean, layer?: any, recalculate?: boolean
      this.map.setCollision(1, true, this.layer3);
      this.map.setCollision(2, true, this.layer);

      this.layer3.resizeWorld();

      let cursors = this.game.input.keyboard.createCursorKeys();
      // // this.game.world.setBounds(0, 0, 1400, 1400);
      this.players = [
        new Player(this.game,150,200,this.game.input.activePointer.leftButton, this.game.input.activePointer.rightButton, true),
        new Player(this.game,550,200,this.game.input.keyboard.addKey(Phaser.Keyboard.A), this.game.input.keyboard.addKey(Phaser.Keyboard.D), false, this.game.input.keyboard.addKey(Phaser.Keyboard.W)),
        new Player(this.game,800,400,this.game.input.keyboard.addKey(Phaser.Keyboard.G), this.game.input.keyboard.addKey(Phaser.Keyboard.H))
      ];
      this.oscar = new Oscar(this.game, 500, 100);

      this.map.createLayer('Tile Layer 4');

      this.spotlight = new Spotlight(this.game, this.players[0]);
      this.spotlight.visible = false;


      this.playerPairs = this.pairwise(this.players);
      // // this.game.camera.follow(this.players[0], Phaser.Camera.FOLLOW_PLATFORMER);

      this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
      this.game.physics.arcade.gravity.y = 1700;

      this.conductor = this.game.add.sprite(600,830,'conductor');
      this.conductor.animations.add('conducting', [0, 1, 2, 3, 4, 5, 6, 7], 1, true);
      this.conductor.animations.play('conducting');
      // map.createFromObjects('Object Layer 1', 12, 'player', 0, true, false);
    }

    collectOscar(player, oscar) {
      player.state = "HOLDING";
      this.spotlight.visible = true;
      oscar.visible = false;
      this.map.putTile(100, this.layer3.getTileX(8), this.layer3.getTileY(15), this.layer);
    }

    hitPlayer(player,enemy) {
      this.music.volume = 0.1;
      enemy.respawn();
      // this.map.replace(0,1,0,0,100,100,'platforms');
    }

    update() {
      this.musicVolume += 0.0005;

      this.game.physics.arcade.collide(this.oscar, this.layer);
      this.game.physics.arcade.collide(this.oscar, this.layer3);

      this.game.physics.arcade.overlap(this.players[0], this.oscar, this.collectOscar, null, this);


      // this.game.physics.arcade.overlap(this.players, this.platforms);
      this.game.physics.arcade.overlap(this.players[0], [this.players[1],this.players[2]], this.hitPlayer, null, this);

      for (var i = 0; i < this.players.length; i++) {
        this.game.physics.arcade.collide(this.players[i], this.layer);
        this.game.physics.arcade.collide(this.players[i], this.layer3);
      }

      // for (var i = 0; i < this.playerPairs.length; i++) {
      //   this.game.physics.arcade.collide(this.playerPairs[i][0], this.playerPairs[i][1]);
      // }

    }

    render() {
      this.game.debug.text(this.game.time.fps.toString(), 200, 20, "#ff0000");
    }

  public get musicVolume():number {
    return this.music.volume;
  }

  public set musicVolume(val:number) {
    this.music.volume = Math.min(val, 1.5);
    let conductorSpeed = Math.max(this.music.volume * 30, 0);
    if (conductorSpeed == 0) {
      this.conductor.animations.paused = true;
    } else{
      // this.conductor.animations.currentAnim.speed = conductorSpeed;
      // this.conductor.animations.paused = false;
    }
    console.log(conductorSpeed);
  }

}
