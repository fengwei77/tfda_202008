const show_debug = true
gsap.registerPlugin(gsap, MotionPathPlugin, EaselPlugin, PixiPlugin, TweenMax, TimelineMax, Power4, Power3, Power2, Power1, Power0);

let w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = document.getElementById("gameContainer").offsetWidth,
    y = document.getElementById("gameContainer").offsetHeight;
// console.log(w.innerWidth);
// console.log(w.innerHeight);
y =600 * x/1366;
console.log('x'+x);
console.log('y'+y);
x = 1366;
y = 600;
let win_init_width = w.innerWidth ;
let win_init_height = w.innerHeight ;
let md = new MobileDetect(window.navigator.userAgent);
let WIDTH = x;
let HEIGHT = 600 * x/1366 ;
 console.log(HEIGHT);
// console.log(w.innerHeight);
$('#gameContainer').css({'width': WIDTH, 'height': HEIGHT});
let gameScene, state, block_wall;  //基礎設定
let unmute = true;
let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
}
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
    // BGM_1: 'sounds/play.mp3',
    // BGM_2: 'sounds/clear.mp3',
    // BGM_3: 'sounds/mechanical.mp3',
    computer_operating: "./game_assets/images/computer_operating.png",
    mobile_operating: "./game_assets/images/mobile_operating.png",
    player_run_1: "./game_assets/images/ok_run_1.png",
    player_run_2: "./game_assets/images/ok_run_2.png",
    player_run_3: "./game_assets/images/ok_run_3.png",
    player_run_4: "./game_assets/images/ok_run_4.png",
    player_cry: "./game_assets/images/ok_cry.png",
    player_action_1: "./game_assets/images/ok_action_1.png",
    player_wish: "./game_assets/images/ok_wish.png",
    player_jump: "./game_assets/images/ok_jump.png",
    shiba_bring: "./game_assets/images/shiba_bring.png",
    shiba_cry: "./game_assets/images/shiba_cry.png",
    shiba_succes: "./game_assets/images/shiba_succes.png",
    shiba_thank: "./game_assets/images/thank.png",
    Answer_bacterial_1: "./game_assets/images/Answer_bacterial_1.png",
    Answer_bacterial_2: "./game_assets/images/Answer_bacterial_2.png",
    Answer_bacterial_3: "./game_assets/images/Answer_bacterial_3.png",
    Answer_bacterial_4: "./game_assets/images/Answer_bacterial_4.png",
    devil: "./game_assets/images/devil.png",
    devil_lose: "./game_assets/images/devil_lose.png",
    obstacle_1: "./game_assets/images/obstacle_1.png",
    obstacle_2: "./game_assets/images/obstacle_2.png",
    obstacle_3: "./game_assets/images/obstacle_3.png",
    obstacle_4: "./game_assets/images/obstacle_4.png",
    obstacle_5: "./game_assets/images/obstacle_5.png",
    obstacle_6: "./game_assets/images/obstacle_6.png",
    obstacle_7: "./game_assets/images/obstacle_7.png",
    background_forest: "./game_assets/images/game_bg.png",
    try_again: "./game_assets/images/try_again.png",
    back_question: "./game_assets/images/back_description.png",
    back_btn: "./game_assets/images/back.png",
    final: "./game_assets/images/final.png",
    action_go: "./game_assets/images/action_1.png",
    mobile_button: "./game_assets/images/mobile_button.png"
    // fg', 'https://pixijs.io/examples/examples/assets/pixi-spine/iP4_ground.png',

};

let app = new PIXI.Application(opt);
const layer = new PIXI.display.Layer();
const loader = PIXI.Loader.shared;
const Sprite = PIXI.Sprite;
const Container = PIXI.Container;
const graphics = new PIXI.Graphics();


// app.stop();

app.stage.interactive = true;
app.stage.buttonMode = true;
$('#gameContainer').append(app.view);

// Add to the PIXI loader
for (let name in manifest) {
    loader.add(name, manifest[name]);
}
loader.load(onAssetsLoaded);

const vpw = document.getElementById("game_box").offsetWidth;  // Width of the viewport
const vph = document.getElementById("game_box").offsetHeight; // Height of the viewport
let nvw; // New game width
let nvh; // New game height
nvw = vpw;
// if (vph / vpw < HEIGHT / WIDTH) {
//     nvh = vph;
//     nvw = (nvh * WIDTH) / HEIGHT;
// } else {
//     // In the else case, the opposite is happening.
//     nvw = vpw;
//     nvh = (nvw * HEIGHT) / WIDTH;
//     // nvh = 600;
// }
nvw = x;
nvh = 600 * (x/1366)
// app.renderer.resize(nvw, nvh);
console.log(nvh);
$('#gameContainer').css({'height': nvh});
// This command scales the stage to fit the new size of the game.

let bg_container = new Container;
let player_container = new Container;
let sound = null;
let bg_sprite, fg_sprite, player_sprite,
    player_sprite_msg, player_sprite_action_go,
    player_sprite_final, player_sprite_back_msg, player_sprite_back_btn,
    computer_operating, mobile_operating,
    mobile_button_operating;
let textureArray, textureArrayJump;
const
    axis = 'y',
    direction = -2, //to Top
    gravity = 1,
    power = 18;
let jumping = false;
let jumpAt = 0;
let bg_speed = 5;
let enemy_sprite = [];
let enemy_container = new Container;
let dog_container = new Container;
let operating_container = new Container;
let run_create_enemy = 0;
let enemy_no = 0;
let die_count = 0;
let maskGraphic = new PIXI.Graphics();

function onAssetsLoaded(loaderInstance, res) {
    graphics.beginFill(0x213e29);
    graphics.drawRect(0, 0, nvw, nvh);
    graphics.alpha = 0.8;
    graphics.endFill();

    player_container.addChild(graphics);
    app.stage = new PIXI.display.Stage();
    app.stage.sortableChildren = true;

    bg_sprite = new PIXI.projection.TilingSprite2d(loader.resources["background_forest"].texture, WIDTH, loader.resources["background_forest"].texture.height);
    bg_sprite.position.set(WIDTH / 2, loader.resources["background_forest"].texture.height);
    bg_sprite.anchor.set(0.5, 1.0);
    bg_container.addChild(bg_sprite);
    app.stage.addChild(bg_container);
    mobile_button_operating = new Sprite(loader.resources["mobile_button"].texture);
    mobile_button_operating.position.set(nvw  - mobile_button_operating.width* 2  - 20 , nvh - mobile_button_operating.height - 30);
    mobile_button_operating.alpha = 0;
    mobile_button_operating.interactive = true;
    player_container.addChild(mobile_button_operating);

    computer_operating = new Sprite(loader.resources["computer_operating"].texture);
    mobile_operating = new Sprite(loader.resources["mobile_operating"].texture);
    computer_operating.position.set(nvw / 2 - computer_operating.width / 2, nvh / 5);
    mobile_operating.position.set(nvw / 2 - mobile_operating.width / 2, nvh / 5);
    computer_operating.alpha = 1;
    computer_operating.interactive = true;
    computer_operating.pointerdown = function () {
        graphics.alpha = 0;
        player_container.removeChild(computer_operating);
        player_container.removeChild(mobile_operating);
        player_sprite.textures = textureArray.player_action;
        player_sprite.y = nvh - player_sprite.getBounds().height + 10;

        app.renderer.render(app.stage);
    }
    // computer_operating.on('pointerdown', function () {
    //     graphics.alpha = 0;
    //     player_container.removeChild(computer_operating);
    //     player_container.removeChild(mobile_operating);
    //     player_sprite.textures = textureArray.player_action;
    //     player_sprite.y = nvh - player_sprite.getBounds().height + 10;
    //
    //     app.renderer.render(app.stage);
    // });
    mobile_operating.alpha = 1;
    mobile_operating.interactive = true;
    mobile_operating.pointerdown = function () {
        graphics.alpha = 0;
        player_container.removeChild(computer_operating);
        player_container.removeChild(mobile_operating);
        player_sprite.textures = textureArray.player_action;
        player_sprite.y = nvh - player_sprite.getBounds().height + 10;
        app.renderer.render(app.stage);
    }
    if (md.mobile() != null) {
        window.scrollTo(0,200);
        computer_operating.alpha = 0;
        mobile_button_operating.alpha = 1;
    }

    player_container.addChild(computer_operating);
    player_container.addChild(mobile_operating);
    textureArray = [];
    textureArray['player_action'] = [
        loader.resources["player_action_1"].texture,
    ];
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
    textureArray['cry'] = [
        loader.resources["player_cry"].texture,
    ];
    textureArray['try_again'] = new Sprite(loader.resources["try_again"].texture);
    textureArray['back_question'] = new Sprite(loader.resources["back_question"].texture);
    textureArray['back_btn'] = new Sprite(loader.resources["back_btn"].texture);

    textureArray['action_go'] = new Sprite(loader.resources["action_go"].texture);
    textureArray['final'] = new Sprite(loader.resources["final"].texture);

    // console.log(textureArray);
    player_sprite = new PIXI.AnimatedSprite(textureArray.run);
    player_sprite.animationSpeed = 0.25;
    player_sprite.position.set(WIDTH / 4, nvh - player_sprite.height);
    // console.log(player_sprite.height);
    // console.log(nvh);
    textureArray['shiba_cry'] = new Sprite(loader.resources["shiba_cry"].texture)
    textureArray['shiba_cry'].position.set(WIDTH / 1.8, -player_sprite.height - 200);
    textureArray['shiba_cry'].anchor.set(0.5, 0);
    dog_container.addChild(textureArray['shiba_cry']);
    app.stage.addChild(dog_container);

    textureArray['shiba_succes'] = new Sprite(loader.resources["shiba_succes"].texture)
    textureArray['shiba_succes'].position.set(WIDTH / 1.8, nvh - textureArray['shiba_succes'].height + 10);
    textureArray['shiba_succes'].anchor.set(0.5, 0);
    textureArray['shiba_succes'].alpha = 0;
    dog_container.addChild(textureArray['shiba_succes']);

    textureArray['shiba_thank'] = new Sprite(loader.resources["shiba_thank"].texture)
    textureArray['shiba_thank'].position.set(WIDTH / 1.5, nvh - textureArray['shiba_succes'].height - 50);
    textureArray['shiba_thank'].anchor.set(0.5, 0);
    textureArray['shiba_thank'].alpha = 0;
    dog_container.addChild(textureArray['shiba_thank']);
    app.stage.addChild(dog_container);


    textureArray['enemies'] = [
        new Sprite(loader.resources["obstacle_1"].texture),
        new Sprite(loader.resources["obstacle_2"].texture),
        new Sprite(loader.resources["Answer_bacterial_1"].texture), //2
        new Sprite(loader.resources["obstacle_3"].texture),
        new Sprite(loader.resources["Answer_bacterial_2"].texture), // 4
        new Sprite(loader.resources["obstacle_4"].texture),
        new Sprite(loader.resources["obstacle_5"].texture),
        new Sprite(loader.resources["Answer_bacterial_3"].texture), //7
        new Sprite(loader.resources["obstacle_6"].texture),
        new Sprite(loader.resources["Answer_bacterial_4"].texture), //9
        new Sprite(loader.resources["obstacle_7"].texture),
        new Sprite(loader.resources["devil"].texture), //11
    ];
    for (let i = 0; i < textureArray['enemies'].length; i++) {

        enemy_sprite[i] = textureArray['enemies'][i];
        enemy_sprite[i].position.set(WIDTH + 300, nvh - enemy_sprite[i].height + 10);
        enemy_sprite[i].anchor.set(0);
        player_container.addChild(enemy_sprite[i]);
    }

    player_sprite_msg = textureArray.try_again;
    player_sprite_back_msg = textureArray.back_question;
    player_sprite_back_msg.position.set(nvw / 2 - player_sprite_back_msg.width / 2, nvh / 5);
    player_sprite_back_btn = textureArray.back_btn;
    player_sprite_back_btn.position.set(player_sprite_back_msg.position.x + player_sprite_back_msg.width / 3, player_sprite_back_msg.position.y + player_sprite_back_msg.height + 10);
    player_sprite_back_btn.interactive = true;
    player_sprite_back_msg.alpha = 0;
    player_sprite_back_btn.alpha = 0;
    player_sprite_back_btn.pointerdown = function () {
        player_sprite_back_msg.alpha = 0;
        player_sprite_back_btn.alpha = 0;
        app.start();
    }
    player_sprite_action_go = textureArray.action_go;
    player_sprite_final = textureArray.final;
    player_container.addChild(player_sprite_final);
    player_container.addChild(player_sprite_action_go);
    player_container.addChild(player_sprite);
    player_container.addChild(player_sprite_back_msg);
    player_container.addChild(player_sprite_back_btn);

    player_container.sortableChildren = true;

    app.stage.addChild(player_container);

    //  gsap.to(enemy_container, {
    //     pixi: {scale: 1},
    //     duration: 1,
    //     repeat: 1,
    //     ease: "power3.in",
    //     onComplete: function () {
    //     },
    //     onUpdate: function () {
    //     }
    // });
    // // });
    //
    // // _germs_container[r_i].addChild(animatedSprite);
    // _germs_container[r_i].alpha = 1;
    // _germs_container[r_i].interactive = true;
    mobile_button_operating.pointerdown = function () {
        jumping = true;
        game_stop = true;
        player_sprite.textures = textureArray.jump;
    }
    player_sprite_msg.pointerdown = function () {
        location.reload();
    }
    graphics.zIndex = 15;
    mobile_operating.zIndex = 20;
    computer_operating.zIndex = 30;
    player_sprite.zIndex = 10;
    mobile_button_operating.zIndex = 50;
    player_sprite_msg.zIndex = 50;
    player_sprite.play();
    jumpAt = nvh - player_sprite.height;
    app.start();
}

let time = 0;
let game_stop = true;
let enemy_generate_speed = 6
let move_x = 0;
let question_index = [2, 4, 7, 9, 11];
let ans_done = [true, true, true, true, true];
let push_start = true;
let pendulum = 0.01;
let rotationWay = false;
let rotationTime = 0;
let last_q = true;
let count = 0;
let kill_boss = false;

app.ticker.add((deltaMS) => {

    app.stage.scale.set(1,1);
    window.addEventListener("resize", resize(app));
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function () {
        resize(app);
    }, false);
    console.log(nvh);
    if (kill_boss) {
        count += 0.1;
        textureArray['shiba_cry'].position.y += deltaMS * 16;
        if (textureArray['shiba_cry'].position.y >= nvh - textureArray['shiba_cry'].height) {

            textureArray['shiba_cry'].position.y = nvh - textureArray['shiba_cry'].height;
            textureArray['shiba_cry'].alpha = 0;
            textureArray['shiba_succes'].alpha = 1;
            textureArray['shiba_thank'].alpha = 1;
            textureArray['shiba_succes'].position.y = nvh - textureArray['shiba_succes'].height + 5 - Math.sin(count) * 5;
            console.log(textureArray['shiba_succes'].height);
        }
    }
    // if(textureArray['shiba_succes'].position.y >= nvh - textureArray['shiba_succes'].height){
    //     textureArray['shiba_succes'].position.y = nvh - textureArray['shiba_succes'].height + 10;
    // }else{
    //     textureArray['shiba_succes'].position.y = textureArray['shiba_succes'].position.y + deltaMS*20;
    // }



    player_sprite_final.position.set(player_sprite.position.x - player_sprite.width / 1.2, player_sprite.height * 1.5);
    player_sprite_final.interactive = true;
    player_sprite_final.pointerdown = function () {
        player_container.removeChild(player_sprite_action_go);
    }
    player_sprite_final.alpha = 0;

    if (push_start) {
        player_sprite.textures = textureArray.player_action;
        player_sprite.loop = true;
        player_sprite.y = nvh - player_sprite.getBounds().height + 10;
        app.renderer.render(app.stage);
        app.stop();
        player_sprite_action_go.position.set(player_sprite.position.x + player_sprite.width / 1.2, player_sprite.height);
        player_sprite_action_go.interactive = true;
        player_sprite_action_go.pointerdown = function () {
            // console.log('asd');
            player_container.removeChild(player_sprite_action_go);
            // app.renderer.render(app.stage);
            player_sprite.textures = textureArray.run;
            player_sprite.animationSpeed = 0.25;
            // player_sprite.loop = true;
            player_sprite.play();
            app.start();
            push_start = false;
        }
    }
    bg_sprite.tilePosition.x = (bg_sprite.tilePosition.x - deltaMS * bg_speed) % bg_sprite.texture.width;
    setTimeout(() => {
        // app.ticker.stop();
    }, 1000)
    app.view.addEventListener('mousedown', function () {
        // jumping = true;
        // game_stop = true;
        // player_sprite.textures = textureArray.jump;
    });
    keyboard(32).press = function () {
        jumping = true;
        game_stop = true;
        player_sprite.textures = textureArray.jump;
    };
    // console.log(run_create_enemy % enemy_generate_speed);
    run_create_enemy += deltaMS;
    if (enemy_no < textureArray['enemies'].length) {
        if ((run_create_enemy % enemy_generate_speed) < 1) {
            // creatEnemy(enemy_no++);

        }
    }


    if (jumping) {
        const jumpHeight = (-gravity / 2) * Math.pow(time, 2) + power * time;
        if (jumpHeight < 0) {
            player_sprite.textures = textureArray.run;
            player_sprite.animationSpeed = 0.25;
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
                    game_stop = false;
                }, 400)
            }
            setTimeout(() => {
                // app.ticker.start();
            }, 1200)
        }

        player_sprite.y = jumpAt + (jumpHeight * direction);
        time += deltaMS;
    }
    if (enemy_no == 2) {

        // app.stop();
    }
    move_x += 0.02;

    if (enemy_no < textureArray['enemies'].length) {
        let aBox = enemy_sprite[enemy_no].getBounds();
        let bBox = player_sprite.getBounds();
        // enemy_sprite[enemy_no].getBounds().width = 50;
        // console.log( enemy_sprite[enemy_no].x );
        // console.log( player_sprite.x );
        // enemy_container.width = 139;

        if (enemy_no == 11) {
            if (last_q) {
                last_q = false;
                setTimeout(() => {
                    $('.q5').fadeIn();
                }, 3000);
            }
            if (enemy_sprite[enemy_no].position.x > nvw / 1.8) {
                enemy_sprite[enemy_no].position.x = enemy_sprite[enemy_no].position.x - 10 * move_x;

            } else {
                player_sprite_final.alpha = 1;
                player_sprite.textures = textureArray.player_action;
                player_sprite.y = nvh - player_sprite.getBounds().height + 10;

                if (textureArray['shiba_cry'].position.y < -30) {
                    textureArray['shiba_cry'].position.y += deltaMS * 16;
                    textureArray['shiba_cry'].angle = -10;
                } else {
                    if (run_create_enemy % 60 < 1) {

                        if (rotationWay) {
                            rotationWay = false;
                        } else {
                            rotationWay = true;
                        }
                    }


                    if (rotationWay) {
                        textureArray['shiba_cry'].rotation += Math.PI / 720;
                    } else {
                        textureArray['shiba_cry'].rotation -= Math.PI / 720;
                    }
                    if (textureArray['shiba_cry'].rotation < -0.3) {
                        textureArray['shiba_cry'].rotation = 0.0;
                    } else if (textureArray['shiba_cry'].rotation > 0.3) {
                        textureArray['shiba_cry'].rotation = 0.0;
                    }

                    console.log(textureArray['shiba_cry'].rotation);


                }
            }
        } else {
            enemy_sprite[enemy_no].position.x = enemy_sprite[enemy_no].position.x - 10 * move_x;
        }
        if (enemy_sprite[enemy_no].position.x < -300) {
            enemy_no++
            move_x = 0;
            die_count = 0;
            is_first_run = false;
            player_container.addChild(enemy_sprite[enemy_no]);
            // app.stage.addChild(player_container);
            player_container.interactive = true;
        }

        if (ans_done[0]) {
            ans_done[0] = false;
            $('.ans_1').click(function () {
                if ($(this).attr('val') === "A") {
                    console.log("yes");
                    gsap.to(enemy_sprite[2], {
                        pixi: {scale: 0},
                        duration: 0,
                        repeat: 1,
                        onComplete: function () {
                            $('.q1').fadeOut(function () {
                                question_index.splice(question_index.indexOf(2), 1);
                                app.start();
                                $('.q1').remove();
                            });
                        },
                        onUpdate: function () {
                        }
                    });
                } else {
                    $('.q1').hide();
                    graphics.alpha = 0.4;
                    app.renderer.render(app.stage);
                    $('.error_message').fadeIn();
                    $('.back_btn').click(function () {

                        graphics.alpha = 0;
                        app.renderer.render(app.stage);
                        $('.error_message').fadeOut();
                        $('.q1').show();
                        ans_done[0] = true;
                    });
                    // setTimeout(() => {
                    //     $('.error_message').fadeOut();
                    //     ans_done[0] = true;
                    //     // app.start();
                    // }, 2000)
                }
            });
        }
        if (ans_done[1]) {
            ans_done[1] = false;
            $('.ans_2').click(function () {
                if ($(this).attr('val') === "A") {
                    console.log("yes");
                    gsap.to(enemy_sprite[4], {
                        pixi: {scale: 0},
                        duration: 0,
                        repeat: 1,
                        onComplete: function () {
                            $('.q2').fadeOut(function () {
                                question_index.splice(question_index.indexOf(4), 1);
                                app.start();
                                $('.q2').remove();
                            });
                        },
                        onUpdate: function () {
                        }
                    });
                } else {
                    $('.q2').hide();
                    $('.error_message').fadeIn();
                    $('.back_btn').click(function () {

                        graphics.alpha = 0;
                        app.renderer.render(app.stage);
                        $('.q2').show();
                        $('.error_message').fadeOut();
                        ans_done[1] = true;
                    });
                    // setTimeout(() => {
                    //     $('.error_message').fadeOut();
                    //     ans_done[1] = true;
                    //     // app.start();
                    // }, 2000)
                }
            });
        }
        if (ans_done[2]) {
            ans_done[2] = false;
            $('.ans_3').click(function () {
                if ($(this).attr('val') === "A") {
                    console.log("yes");
                    gsap.to(enemy_sprite[7], {
                        pixi: {scale: 0},
                        duration: 0,
                        repeat: 1,
                        onComplete: function () {
                            $('.q3').fadeOut(function () {
                                question_index.splice(question_index.indexOf(7), 1);
                                app.start();
                                $('.q3').remove();
                            });
                        },
                        onUpdate: function () {
                        }
                    });
                } else {
                    $('.q3').hide();
                    $('.error_message').fadeIn();
                    $('.back_btn').click(function () {

                        graphics.alpha = 0;
                        app.renderer.render(app.stage);
                        $('.q3').show();
                        $('.error_message').fadeOut();
                        ans_done[2] = true;
                    });
                    // setTimeout(() => {
                    //     $('.error_message').fadeOut();
                    //     ans_done[2] = true;
                    //     // app.start();
                    // }, 2000)
                }
            });
        }
        if (ans_done[3]) {
            ans_done[3] = false;
            $('.ans_4').click(function () {
                if ($(this).attr('val') === "A") {
                    console.log("yes");
                    gsap.to(enemy_sprite[9], {
                        pixi: {scale: 0},
                        duration: 0,
                        repeat: 1,
                        onComplete: function () {
                            $('.q4').fadeOut(function () {
                                question_index.splice(question_index.indexOf(9), 1);
                                app.start();
                                $('.q4').remove();
                            });
                        },
                        onUpdate: function () {
                        }
                    });
                } else {
                    $('.q4').hide();
                    $('.error_message').fadeIn();
                    $('.back_btn').click(function () {
                        graphics.alpha = 0;
                        app.renderer.render(app.stage);
                        $('.q4').show();
                        $('.error_message').fadeOut();
                        ans_done[3] = true;
                    });
                    // setTimeout(() => {
                    //     $('.error_message').fadeOut();
                    //     ans_done[3] = true;
                    //     // app.start();
                    // }, 2000)
                }
            });
        }
        if (ans_done[4]) {
            ans_done[4] = false;
            $('.ans_5').click(function () {
                if ($(this).attr('val') === "A") {
                    console.log("yes");
                    gsap.to(enemy_sprite[11], {
                        pixi: {scale: 0},
                        duration: 0,
                        repeat: 1,
                        onComplete: function () {
                            $('.q5').fadeOut(function () {
                                question_index.splice(question_index.indexOf(11), 1);
                                kill_boss = true;
                                app.start();
                            });
                        },
                        onUpdate: function () {
                            enemy_no = 12;
                            player_sprite_final.alpha = 0;
                            jumping = true;
                        }
                    });
                } else {
                    $('.q5').hide();
                    $('.error_message').fadeIn();
                    $('.back_btn').click(function () {
                        graphics.alpha = 0;
                        app.renderer.render(app.stage);
                        $('.q5').show();
                        $('.error_message').fadeOut();
                        ans_done[4] = true;
                    });
                    // setTimeout(() => {
                    //     $('.error_message').fadeOut();
                    //     ans_done[4] = true;
                    //     // app.start();
                    // }, 2000)
                }
            });
        }
        if (hitTestRectangle(aBox, bBox)) {
            // console.log('die');
            die_count++;
            if (die_count > 7) {
                // console.log('die');
                if (player_container.position.y >= nvh) {
                    player_container.position.y = player_container.position.y + deltaMS * 20;
                } else {

                    app.stop();
                }
                enemy_sprite[enemy_no].position.x = enemy_sprite[enemy_no].position.x + 100;
                player_sprite.position.x = enemy_sprite[enemy_no].position.x - 200;
                player_sprite.position.y = nvh - 239;
                player_sprite.textures = textureArray.cry;

                player_sprite.animationSpeed = 0.25;
                // player_sprite.loop = true;


                player_sprite.play();
                player_container.addChild(player_sprite_msg);
                player_sprite_msg.position.set(player_sprite.position.x + player_sprite.width / 1.2, player_sprite.height*1.2);
                player_sprite_msg.interactive = true;

                app.renderer.render(app.stage);
                console.log('die');
                //
                setTimeout(() => {

                    // app.start();
                }, 2000)
            }
        } else {
            // console.log(enemy_no);
            // console.log(question_index);
            if (question_index.indexOf(enemy_no) != -1) {
                if (enemy_sprite[enemy_no].position.x < player_sprite.position.x + player_sprite.width) {
                    // console.log('game1');
                    if (enemy_no == 2) {
                        $('.q1').fadeIn();
                    } else if (enemy_no == 4) {
                        $('.q2').fadeIn();
                    } else if (enemy_no == 7) {
                        $('.q3').fadeIn();
                    } else if (enemy_no == 9) {
                        $('.q4').fadeIn();
                    } else if (enemy_no == 11) {

                    }

                    app.stop();
                }
            }
        }
    }

});
let is_first_run = true;

function creatEnemy(no) {
    // console.log(no);
    // console.log(enemy_no);
    if (enemy_no < textureArray['enemies'].length) {
        is_first_run = false;
        player_container.addChild(enemy_sprite[enemy_no]);
        // app.stage.addChild(player_container);

        player_container.interactive = true;
        // gsap.to(enemy_sprite[enemy_no], {
        //     pixi: { },
        //     duration: 5,
        //     repeat: 1,
        //     x: -50,
        //     ease: "power3.in",
        //     onComplete: function () {
        //         // enemy_no++;
        //         player_container.removeChildAt(0)
        //         console.log(enemy_no);
        //         die = 0;
        //     },
        //     onUpdate: function () {
        //     }
        // });
    }


    // enemy_sprite.position.x = ( enemy_sprite.position.x -  deltaMS*10) ;
}

//縮放
function resize(app) {
    console.log('resize');
    return function () {
        let vpw = 1366;  // Width of the viewport

        let vph = 600;
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


        app.stage.scale.set(nvw / 1366, nvh / 600);


    };
}


function hitTestRectangle(r1, r2) {
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
    hit = false;
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
    if (Math.abs(vx) < combinedHalfWidths) {
        if (Math.abs(vy) < combinedHalfHeights) {
            hit = true;
        } else {
            hit = false;
        }
    } else {
        hit = false;
    }
    return hit;
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