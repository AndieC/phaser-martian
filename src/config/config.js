import MainScene from '../scenes/MainScene'
export default {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        parent: 'mygame',
        autoCenter: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false
        }
    },
    dom: {
        createContainer: true
    },
    scene: [MainScene]
};