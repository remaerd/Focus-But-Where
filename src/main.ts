
import { setupFaceLandmarkDetector } from './faceLandmarkDetector'
import * as Phaser from 'phaser'

import { MainMenuScene } from './scenes/mainMenuScene'
import { Chapter1Scene } from './scenes/chapter1Scene'
import { Chapter2Scene } from './scenes/chapter2Scene'
import { Chapter3Scene } from './scenes/chapter3Scene'
import { Chapter4Scene } from './scenes/chapter4Scene'
import { Chapter5Scene } from './scenes/chapter5Scene'

const gameConfig: Phaser.Types.Core.GameConfig = 
{
  title: 'focus-but-what',
  type: Phaser.AUTO,
  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: 
  {
    default: 'arcade',
    arcade: { debug: true },
  },
  parent: 'game',
  backgroundColor: '#000000',
  scene: [ MainMenuScene, Chapter1Scene, Chapter2Scene, Chapter3Scene, Chapter4Scene, Chapter5Scene]
};

const game = new Phaser.Game(gameConfig);
 
async function app() 
{
	try 
  { 
    await setupFaceLandmarkDetector() 
  } 
  catch (error) { console.log(error) }
};

app();