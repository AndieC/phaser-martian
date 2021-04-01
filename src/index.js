/**@type {import('../typings/phase')}*/

import Phaser from'phaser';
import config from './config/config';
import MainScene from './scenes/MainScene';

class Game extends Phaser.Game {
    constructor() {
        super(config);
        this.scene.add('MainScene', MainScene);
        this.scene.start('MainScene')
    }
};



window.onload = function() {
    window.game = new Game();
};