const show_debug = true;
gsap.registerPlugin(gsap );
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x =  document.getElementById("game_box").offsetWidth,
    y = document.getElementById("game_box").offsetHeight;


console.log(w.innerWidth);
console.log(w.innerHeight);
let win_init_width = w.innerWidth;
let win_init_height = w.innerHeight;
var md = new MobileDetect(window.navigator.userAgent);
// let WIDTH = 1920;
// let HEIGHT = WIDTH * (9 / 16);
// let HEIGHT = WIDTH * (7.5 / 16);
// console.log(x);
// console.log(y);
let HEIGHT = y;
let WIDTH = x;
$('#gameContainer').css({'width': WIDTH ,'height': HEIGHT});
// show_console('origin HEIGHT =' + HEIGHT);
// WIDTH = window.innerWidth;
// HEIGHT = window.innerWidth  * (9/ 16);
let origin_ratio = WIDTH / 1366;
let countdown = 60;
let gameScene, state, block_wall;  //基礎設定
let block_wall_ratio = 0.84;
let block_wall_op = 0;
let unmute = true;
let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
}
const bg_speed = 5;
// show_console(type);
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
//遊戲基本設定
let opt = {
    backgroundColor: 0x005D7E,
    width: WIDTH,
    height: HEIGHT,
    antialias: true,    // default: false
    transparent: false, // default: false
    autoResize: true,
    forceCanvas: true,
    autoStart: false,
    resolution: window.devicePixelRatio || 1,
};
//player can click?
let player_action = true;
//遊戲場景

const manifest = {
    // loop1: 'sounds/a'+level+'.mp3',
    // boing: 'sounds/clear.mp3',
    // buzzer: 'sounds/mechanical.mp3'
};

let app = new PIXI.Application(opt);
const loader = PIXI.Loader.shared;
const Sprite = PIXI.Sprite;
const Container = PIXI.Container;
app.stop();

app.stage.interactive = true;
app.stage.buttonMode = true;
app.stage.sortableChildren = true;
$('#gameContainer').append(app.view);

// Add to the PIXI loader
for (let name in manifest) {
    loader.add(name, manifest[name]);
}


window.addEventListener("resize", resize(app));
// setTimeout(function(){
const vpw = document.getElementById("game_box").offsetWidth  ;  // Width of the viewport
const vph = document.getElementById("game_box").offsetHeight ; // Height of the viewport
let nvw; // New game width
let nvh; // New game height
if (vph / vpw < HEIGHT / WIDTH) {
    nvh = vph;
    nvw = (nvh * WIDTH) / HEIGHT;
} else {
    // In the else case, the opposite is happening.
    nvw = vpw;
    nvh = (nvw * HEIGHT) / WIDTH;
}
app.renderer.resize(nvw, 600);

$('#gameContainer').css({'height': nvh});
// This command scales the stage to fit the new size of the game.
app.stage.scale.set(nvw / WIDTH, nvh / HEIGHT);

// },500);

//遊戲元件


const timer = new EE3Timer.Timer(1000);
timer.repeat = countdown;
timer.on('start', elapsed => {
    // show_console('start');
});
timer.on('end', elapsed => {
    // show_console('end', elapsed);
});
timer.on('repeat', (elapsed, repeat) => {
    // show_console('repeat', repeat);
    countdown--;
    timer_txt.text = countdown;
});
timer.on('stop', elapsed => {
    // show_console('stop');
});
timer.start();
//>倒數計時

//增加按鈕< space
let keys = [
    'KEY_CODE',
    keyboard(32)
];
//>增加按鈕

// 遮擋區塊 -z50
block_wall = new PIXI.Graphics();
block_wall.beginFill(0xFFFFFF, block_wall_op);
block_wall.drawRect(0, 0, WIDTH, HEIGHT * block_wall_ratio);
block_wall.endFill();
app.stage.addChild(block_wall);
block_wall.zIndex = 50;
// 載入圖片
loader
    .add('player_run_1', "../game_assets/images/ok_run_1.png")
    .add('player_run_2', "../game_assets/images/ok_run_2.png")
    .add('player_run_3', "../game_assets/images/ok_run_3.png")
    .add('player_run_4', "../game_assets/images/ok_run_4.png")
    .add('player_jump', "../game_assets/images/ok_jump.png")
    .add('bg', '../game_assets/images/game_bg.png')
    // .add('fg', 'https://pixijs.io/examples/examples/assets/pixi-spine/iP4_ground.png')
    .load(onAssetsLoaded);



// const tiling = new Sprite(loader.resources["bg_sprite_u"].texture, app.screen.width, app.screen.height);
// tiling.position.set(app.screen.width / 2, app.screen.height);
// tiling.anchor.set(0.5, 1.0);
// tiling.tint = 0x808080;

let bg_container = new Container;

let fg_container = new Container;

let player_container = new Container;
//加入場景
let sound = null;
let bg_sprite, fg_sprite, player_sprite;
let textureArray, textureArrayJump;
const

    axis = 'y',
    direction = -2, //to Top
    gravity = 1,
    power = 20;
let jumping = false;
let jumpAt = 0;

function onAssetsLoaded(loaderInstance, res) {
    // bg_sprite = new Sprite(loader.resources["bg"].texture);
    // bg_sprite.width = WIDTH ;
    // bg_sprite.height = HEIGHT ;
    // bg_container.addChild(bg_sprite);
    bg_sprite = new PIXI.projection.TilingSprite2d(loader.resources["bg"].texture, WIDTH, loader.resources["bg"].texture.height);
    bg_sprite.position.set(WIDTH / 2, loader.resources["bg"].texture.height);
    // bg_sprite.tileScale.set(1, 1.5);
    bg_sprite.anchor.set(0.5, 1.0);
    // bg_sprite.tint = 0x808080;
    bg_container.addChild(bg_sprite);
    app.stage.addChild(bg_container);

    // fg_sprite = new PIXI.projection.TilingSprite2d(loader.resources["fg"].texture, WIDTH, loader.resources["fg"].texture.height);
    // fg_sprite.position.set(WIDTH / 2, HEIGHT);
    // fg_sprite.anchor.set(0.5, 1.0);
    // // bg_sprite.tint = 0x808080;
    // fg_container.addChild(fg_sprite);
    // app.stage.addChild(fg_container);

    // player_sprite = new PIXI.projection.TilingSprite2d(loader.resources["player_1"].texture, loader.resources["player_1"].texture.width ,loader.resources["player_1"].texture.height);
    // player_sprite.anchor.set(1.0, 1.0);

    textureArray = [];
    textureArray['run'] = [
        loader.resources["player_run_1"].texture,
        loader.resources["player_run_2"].texture,
        loader.resources["player_run_3"].texture,
        loader.resources["player_run_4"].texture,
        loader.resources["player_run_4"].texture,
        loader.resources["player_run_3"].texture,
        loader.resources["player_run_2"].texture,
        loader.resources["player_run_1"].texture,
    ];
    textureArray['jump'] = [
        loader.resources["player_jump"].texture,
    ];

    console.log(textureArray);
    player_sprite = new PIXI.AnimatedSprite(textureArray.run);
    player_sprite.animationSpeed =  0.25;
    player_sprite.position.set(WIDTH / 3, HEIGHT - player_sprite.height);

    player_container.addChild(player_sprite);
    app.stage.addChild(player_container);

    player_sprite.play();
    jumpAt = HEIGHT - player_sprite.height;
    // pixie = new PIXI.spine.Spine(res.player_1);
    // pixie.position.set(300, 0);
    // pixie.scale.set(0.3);
    //
    // mainLayer.addChild(pixie);
    //
    // pixie.stateData.setMix('running', 'jump', 0.2);
    // pixie.stateData.setMix('jump', 'running', 0.4);
    //
    // pixie.state.setAnimation(0, 'running', true);

    // app.stage.on('pointerdown', onTouchStart);
    //
    // function onTouchStart() {
    //     pixie.state.setAnimation(0, 'jump', false);
    //     pixie.state.addAnimation(0, 'running', true, 0);
    // }

    app.start();
}

let time = 0;
let game_stop = true;
app.ticker.add((deltaMS) => {
    bg_sprite.tilePosition.x = (bg_sprite.tilePosition.x - deltaMS * bg_speed) % bg_sprite.texture.width;
    // fg_sprite.tilePosition.x = (fg_sprite.tilePosition.x - deltaMS * 2 * bg_speed) % fg_sprite.texture.width;
    setTimeout(() => {
        // app.ticker.stop();
    }, 1000)
    app.view.addEventListener('mousedown', function () {
        jumping = true;
        game_stop = true;

        player_sprite.textures = textureArray.jump;
        // player_sprite.animationSpeed = 0.4;
        // player_sprite.loop = false;
        // player_sprite.play();
        // console.log('jump');
    });
    if (jumping) {

        // player_sprite.currentFrame[1];
        // player_sprite.texture = loader.resources["player_jump"].texture;
        // if(jumping){
        //     player_sprite.textures  = textureArrayJump;
        //     player_sprite.animationSpeed =  0.2;
        //     player_sprite.play();
        // }
        // player_sprite.texture = loader.resources["player_2"].texture;


        // player_sprite.gotoAndStop(2);
        const jumpHeight = (-gravity / 2) * Math.pow(time, 2) + power * time;
        // console.log(jumpHeight);
        if (jumpHeight < 0) {
            // player_sprite.currentFrame[1];

            player_sprite.textures = textureArray.run;
            player_sprite.animationSpeed =  0.25;
            // player_sprite.loop = true;
            player_sprite.play();
            time = 0;
            jumping = false;
            player_sprite.y = jumpAt;
            return;
        }
        if (player_sprite.y < jumpAt) {
            if (game_stop) {
                setTimeout(() => {
                    // app.ticker.stop();
                    game_stop = false;
                }, 400)
            }
            setTimeout(() => {
                app.ticker.start();
            }, 1200)
        }

        player_sprite.y = jumpAt + (jumpHeight * direction);
        time += deltaMS;
        // console.log(jumpHeight);
    }

});


function setup() {

    sound = PIXI.sound.play("loop1", {
        sound: 30,
        autoplay: true,
        loop: true
    });
    // sound.volume = 1;


    gameScene = new Container;

    //>背景


    //執行遊戲

    // ticker.autoStart = false;
    // ticker.stop();
    // ticker.start();
    // keyboard(32).press = function () {
    //     ticker.stop();
    //     // sound.volume = 0;
    // };


    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function () {
        if (window.orientation === 180 || window.orientation === 0) {
            // sound.volume = 0;
            resize(app);
            ticker.stop();
            $('#black_mask').show();
            jc.open();
        }
        if (window.orientation === 90 || window.orientation === -90) {
            resize(app);
            $('#black_mask').hide();
            ticker.start();

            // sound.volume = 60;
            // alert('目前您的螢幕為橫向！');
        }
    }, false);

    //靜音
    $('#sound').click(function () {
        sound.volume = 0;
        $('#sound').hide();
        $('#mute').show();
        unmute = false;
    });
    $('#mute').click(function () {
        sound.volume = 30;
        $('#mute').hide();
        $('#sound').show();
        unmute = true;
    });


}

let is_run = true;


function gameLoop(delta) {
    //更新遊戲場景:
    state(delta);
}

let run_create_germs = 0;
let is_shake = false;
let is_shake_color = '0xFFFFFF';
let shake = true;

const dmg_timer = new EE3Timer.Timer(500);
dmg_timer.on('start', function () {
    //// console.log('dmg_timer -start');
});
dmg_timer.on('end', elapsed => {
    if (elapsed === 500) {
        block_wall.clear();
        block_wall.beginFill(0xFFFFFF, block_wall_op);
        block_wall.drawRect(0, 0, WIDTH, HEIGHT * block_wall_ratio);
        block_wall.endFill();
        is_shake = false;
        //// console.log('dmg_timer -end');
    }
    dmg_timer.reset(); //Reset the timer
}, dmg_timer);

function play(delta) {

    run_create_germs += delta;
    //// console.log(delta);


    timer.timerManager.update(app.ticker.elapsedMS); //倒數計時

    //>細菌

}


//動作
function addInteraction(obj) {
    obj.on('pointerdown', onClick);
}

//CLICK方法
function onClick() {


}



//按鍵方法
function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    key.downHandler = function (event) {
        if (event.keyCode === key.code && player_action) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    key.upHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}

//FACEBOOK分享和授權判斷
//debug

show_console('jquery - ' + $().jquery);

function show_console(msg = '') {
    if (show_debug) {
        console.log(msg);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function wait(duration = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    });
}

//縮放
function resize(app) {
    return function () {
        let vpw = 1366 ;  // Width of the viewport
        if( w.innerWidth  < 750) {
            vpw = 1366  *    w.innerWidth / win_init_width ;  // Width of the viewport
            if (vpw > 1366) {
                vpw = 1366;
            }
        }
        let vph = 600; // Height of the viewport
        if( w.innerWidth  < 750) {
            vph = 600  *    w.innerHeight / win_init_height ;  // Width of the viewport
            if (vph < 600) {
                vph = 600;
            }
        }
        let nvw; // New game width
        let nvh; // New game height


        if (vph / vpw < HEIGHT / WIDTH) {
            nvh = vph;
            nvw = (nvh * WIDTH) / HEIGHT;
        } else {
            nvw = vpw;
            nvh = (nvw * HEIGHT) / WIDTH;
        }

        app.renderer.resize(nvw, nvh);


        $('#gameContainer').css({'height': nvh});
        app.stage.scale.set(nvw / WIDTH, nvh / HEIGHT);


    };
}

