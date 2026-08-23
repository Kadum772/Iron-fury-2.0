const player = document.getElementById("player");
const enemy = document.getElementById("enemy");

const playerHealth =
  document.getElementById("player-health");

const enemyHealth =
  document.getElementById("enemy-health");

const timerElement =
  document.getElementById("timer");

const message =
  document.getElementById("message");

const joystick =
  document.getElementById("joystick");

const knob =
  document.getElementById("joystick-knob");

const jumpButton =
  document.getElementById("jump");

const dashButton =
  document.getElementById("dash");

const punchButton =
  document.getElementById("punch");

const kickButton =
  document.getElementById("kick");

const blockButton =
  document.getElementById("block");

const specialButton =
  document.getElementById("special");


const furyBars = [
  document.getElementById("fury1"),
  document.getElementById("fury2"),
  document.getElementById("fury3")
];

const enemyFuryBars = [
  document.getElementById("enemy-fury1"),
  document.getElementById("enemy-fury2"),
  document.getElementById("enemy-fury3")
];


/* =========================
   GAME STATE
========================= */

const game = {

  running: true,

  time: 60,

  player: {
    x: 23,
    y: 0,

    hp: 100,
    fury: 0,

    velocityY: 0,

    attacking: false,
    blocking: false,
    cooldown: false
  },

  enemy: {
    x: 68,
    y: 0,

    hp: 100,
    fury: 0,

    velocityY: 0,

    attacking: false,
    blocking: false,
    cooldown: false
  }

};


let stickX = 0;
let stickY = 0;

let joystickActive = false;

let aiTimer = 0;


/* =========================
   HELPERS
========================= */

function clamp(value, min, max) {

  return Math.max(
    min,
    Math.min(max, value)
  );

}


function distance() {

  return Math.abs(
    game.player.x -
    game.enemy.x
  );

}


/* =========================
   FURY
========================= */

function updateFuryUI() {

  const p =
    game.player;

  const e =
    game.enemy;


  furyBars.forEach(
    (bar, index) => {

      bar.classList.toggle(
        "full",
        p.fury >= index + 1
      );

    }
  );


  enemyFuryBars.forEach(
    (bar, index) => {

      bar.classList.toggle(
        "full",
        e.fury >= index + 1
      );

    }
  );

}


function addPlayerFury(amount) {

  game.player.fury =
    clamp(
      game.player.fury + amount,
      0,
      3
    );

}


function addEnemyFury(amount) {

  game.enemy.fury =
    clamp(
      game.enemy.fury + amount,
      0,
      3
    );

}


/* =========================
   RENDER
========================= */

function render() {

  const p =
    game.player;

  const e =
    game.enemy;


  player.style.left =
    p.x + "%";

  enemy.style.left =
    e.x + "%";


  player.style.bottom =
    `calc(25% + ${p.y}px)`;

  enemy.style.bottom =
    `calc(25% + ${e.y}px)`;


  playerHealth.style.width =
    clamp(p.hp, 0, 100) + "%";

  enemyHealth.style.width =
    clamp(e.hp, 0, 100) + "%";


  /*
    Face each other.
  */

  if (p.x < e.x) {

    player.style.transform =
      "scaleX(1)";

    enemy.style.transform =
      "scaleX(-1)";

  } else {

    player.style.transform =
      "scaleX(-1)";

    enemy.style.transform =
      "scaleX(1");

  }


  updateFuryUI();

}


/* =========================
   JOYSTICK
========================= */

function moveJoystick(x, y) {

  const rect =
    joystick.getBoundingClientRect();

  const centerX =
    rect.left +
    rect.width / 2;

  const centerY =
    rect.top +
    rect.height / 2;


  let dx =
    x - centerX;

  let dy =
    y - centerY;


  const max =
    rect.width / 2 - 26;


  const d =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  if (d > max) {

    dx =
      dx / d * max;

    dy =
      dy / d * max;

  }


  stickX =
    dx / max;

  stickY =
    dy / max;


  knob.style.left =
    `calc(50% + ${dx}px)`;

  knob.style.top =
    `calc(50% + ${dy}px)`;

}


function resetJoystick() {

  joystickActive = false;

  stickX = 0;
  stickY = 0;

  knob.style.left = "50%";
  knob.style.top = "50%";

}


joystick.addEventListener(
  "pointerdown",
  event => {

    joystickActive = true;

    joystick.setPointerCapture(
      event.pointerId
    );

    moveJoystick(
      event.clientX,
      event.clientY
    );

  }
);


joystick.addEventListener(
  "pointermove",
  event => {

    if (!joystickActive)
      return;

    moveJoystick(
      event.clientX,
      event.clientY
    );

  }
);


joystick.addEventListener(
  "pointerup",
  resetJoystick
);

joystick.addEventListener(
  "pointercancel",
  resetJoystick
);


/* =========================
   PLAYER MOVEMENT
========================= */

function updatePlayer(delta) {

  const p =
    game.player;


  if (!game.running)
    return;


  if (
    Math.abs(stickX) > .08 &&
    !p.attacking
  ) {

    p.x +=
      stickX *
      .045 *
      delta;

    p.x =
      clamp(
        p.x,
        5,
        90
      );

    player.classList.add(
      "walking"
    );

  } else {

    player.classList.remove(
      "walking"
    );

  }

}


/* =========================
   PHYSICS
========================= */

function updatePhysics(delta) {

  const p =
    game.player;


  p.velocityY -=
    .0022 * delta;

  p.y +=
    p.velocityY * delta;


  if (p.y < 0) {

    p.y = 0;

    p.velocityY = 0;

  }

}


/* =========================
   JUMP
========================= */

jumpButton.addEventListener(
  "pointerdown",
  () => {

    if (!game.running)
      return;

    if (game.player.y > 2)
      return;


    game.player.velocityY =
      .72;

  }
);


/* =========================
   PUNCH
========================= */

punchButton.addEventListener(
  "pointerdown",
  () => {

    const p =
      game.player;


    if (!game.running)
      return;

    if (p.attacking)
      return;

    if (p.cooldown)
      return;


    p.attacking = true;
    p.cooldown = true;


    player.classList.add(
      "punching"
    );


    setTimeout(() => {

      if (
        distance() < 15
      ) {

        let damage = 10;


        if (
          game.enemy.blocking
        ) {

          damage = 2;

        }


        game.enemy.hp -=
          damage;


        addPlayerFury(0.35);

        addEnemyFury(0.12);


        enemy.classList.add(
          "hit"
        );


        setTimeout(() => {

          enemy.classList.remove(
            "hit"
          );

        }, 160);

      }

    }, 100);


    setTimeout(() => {

      player.classList.remove(
        "punching"
      );

      p.attacking = false;

    }, 270);


    setTimeout(() => {

      p.cooldown = false;

    }, 380);

  }
);


/* =========================
   KICK
========================= */

kickButton.addEventListener(
  "pointerdown",
  () => {

    const p =
      game.player;


    if (!game.running)
      return;

    if (p.attacking)
      return;


    p.attacking = true;


    player.classList.add(
      "kicking"
    );


    setTimeout(() => {

      if (
        distance() < 17
      ) {

        let damage = 14;


        if (
          game.enemy.blocking
        ) {

          damage = 3;

        }


        game.enemy.hp -=
          damage;


        addPlayerFury(.45);

        addEnemyFury(.15);


        enemy.classList.add(
          "hit"
        );


        setTimeout(() => {

          enemy.classList.remove(
            "hit"
          );

        }, 160);

      }

    }, 120);


    setTimeout(() => {

      player.classList.remove(
        "kicking"
      );

      p.attacking = false;

    }, 320);

  }
);


/* =========================
   BLOCK
========================= */

function startBlock() {

  if (!game.running)
    return;


  game.player.blocking =
    true;


  player.classList.add(
    "blocking"
  );

}


function stopBlock() {

  game.player.blocking =
    false;


  player.classList.remove(
    "blocking"
  );

}


blockButton.addEventListener(
  "pointerdown",
  startBlock
);

blockButton.addEventListener(
  "pointerup",
  stopBlock
);

blockButton.addEventListener(
  "pointercancel",
  stopBlock
);

blockButton.addEventListener(
  "pointerleave",
  stopBlock
);


/* =========================
   DASH
========================= */

dashButton.addEventListener(
  "pointerdown",
  () => {

    const p =
      game.player;


    if (!game.running)
      return;

    if (p.cooldown)
      return;


    p.cooldown = true;


    player.classList.add(
      "dashing"
    );


    let direction;


    if (
      Math.abs(stickX) > .1
    ) {

      direction =
        stickX < 0
          ? -1
          : 1;

    } else {

      direction =
        p.x < game.enemy.x
          ? 1
          : -1;

    }


    p.x +=
      direction * 10;


    p.x =
      clamp(
        p.x,
        5,
        90
      );


    setTimeout(() => {

      player.classList.remove(
        "dashing"
      );

    }, 180);


    setTimeout(() => {

      p.cooldown = false;

    }, 550);

  }
);


/* =========================
   3-STAGE FURY
========================= */

specialButton.addEventListener(
  "pointerdown",
  () => {

    const p =
      game.player;


    if (!game.running)
      return;

    if (p.attacking)
      return;

    if (p.fury <= 0)
      return;


    const level =
      Math.floor(p.fury);


    /*
      Each level uses a different
      amount of Fury.
    */

    p.fury -= level;

    p.attacking = true;


    message.textContent =
      level === 1
        ? "FURY STRIKE"
        : level === 2
          ? "FURY COMBO"
          : "SIGNATURE FURY";


    player.classList.add(
      "punching"
    );


    setTimeout(() => {

      if (
        distance() < 25
      ) {

        const damage =
          level === 1
            ? 18
            : level === 2
              ? 28
              : 42;


        game.enemy.hp -=
          damage;


        enemy.classList.add(
          "hit"
        );


        setTimeout(() => {

          enemy.classList.remove(
            "hit"
          );

        }, 220);

      }

    }, 180);


    setTimeout(() => {

      player.classList.remove(
        "punching"
      );

      p.attacking = false;

      message.textContent = "";

    }, 650);

  }
);


/* =========================
   ENEMY AI
========================= */

function updateEnemy(delta) {

  const e =
    game.enemy;

  const p =
    game.player;


  if (!game.running)
    return;


  aiTimer -= delta;


  const d =
    distance();


  /*
    Follow player.
  */

  if (
    d > 15 &&
    !e.attacking &&
    !e.blocking
  ) {

    const direction =
      p.x < e.x
        ? -1
        : 1;


    e.x +=
      direction *
      .018 *
      delta;


    e.x =
      clamp(
        e.x,
        5,
        90
      );


    enemy.classList.add(
      "walking"
    );

  } else {

    enemy.classList.remove(
      "walking"
    );

  }


  /*
    AI decision.
  */

  if (
    aiTimer <= 0 &&
    !e.attacking &&
    !e.blocking
  ) {

    aiTimer =
      350 +
      Math.random() * 700;


    if (d < 18) {

      const choice =
        Math.random();


      if (choice < .68) {

        enemyPunch();

      } else {

        enemyBlock();

      }

    }

  }

}


/* =========================
   ENEMY PUNCH
========================= */

function enemyPunch() {

  const e =
    game.enemy;


  if (e.cooldown)
    return;


  e.cooldown = true;
  e.attacking = true;


  enemy.classList.add(
    "punching"
  );


  setTimeout(() => {

    if (
      distance() < 16
    ) {

      let damage = 9;


      if (
        game.player.blocking
      ) {

        damage = 2;

      }


      game.player.hp -=
        damage;


      addEnemyFury(.3);

      addPlayerFury(.1);


      player.classList.add(
        "hit"
      );


      setTimeout(() => {

        player.classList.remove(
          "hit"
        );

      }, 160);

    }

  }, 110);


  setTimeout(() => {

    enemy.classList.remove(
      "punching"
    );

    e.attacking = false;

  }, 280);


  setTimeout(() => {

    e.cooldown = false;

  }, 650);

}


/* =========================
   ENEMY BLOCK
========================= */

function enemyBlock() {

  const e =
    game.enemy;


  e.blocking = true;


  enemy.classList.add(
    "blocking"
  );


  setTimeout(() => {

    e.blocking = false;

    enemy.classList.remove(
      "blocking"
    );

  }, 500);

}


/* =========================
   ROUND END
========================= */

function endRound(text) {

  if (!game.running)
    return;


  game.running = false;


  message.textContent =
    text;


  setTimeout(
    resetRound,
    2200
  );

}


/* =========================
   RESET
========================= */

function resetRound() {

  game.running = true;

  game.time = 60;


  game.player.x = 23;
  game.player.y = 0;
  game.player.hp = 100;
  game.player.fury = 0;
  game.player.velocityY = 0;
  game.player.attacking = false;
  game.player.blocking = false;
  game.player.cooldown = false;


  game.enemy.x = 68;
  game.enemy.y = 0;
  game.enemy.hp = 100;
  game.enemy.fury = 0;
  game.enemy.velocityY = 0;
  game.enemy.attacking = false;
  game.enemy.blocking = false;
  game.enemy.cooldown = false;


  aiTimer = 0;

  message.textContent = "";

  render();

}


/* =========================
   TIMER
========================= */

setInterval(() => {

  if (!game.running)
    return;


  game.time--;

  timerElement.textContent =
    Math.max(
      0,
      game.time
    );


  if (game.time <= 0) {

    if (
      game.player.hp >
      game.enemy.hp
    ) {

      endRound("IRON FURY WINS");

    } else if (
      game.enemy.hp >
      game.player.hp
    ) {

      endRound("RIVAL WINS");

    } else {

      endRound("DRAW");

    }

  }

}, 1000);


/* =========================
   GAME LOOP
========================= */

let lastTime =
  performance.now();


function gameLoop(now) {

  const delta =
    Math.min(
      now - lastTime,
      40
    );


  lastTime = now;


  if (game.running) {

    updatePlayer(delta);

    updatePhysics(delta);

    updateEnemy(delta);


    if (
      game.player.hp <= 0
    ) {

      endRound(
        "RIVAL WINS"
      );

    }


    if (
      game.enemy.hp <= 0
    ) {

      endRound(
        "IRON FURY WINS"
      );

    }

  }


  render();


  requestAnimationFrame(
    gameLoop
  );

}


/* =========================
   START
========================= */

render();

requestAnimationFrame(
  gameLoop
);
