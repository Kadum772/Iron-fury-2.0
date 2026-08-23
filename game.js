
const player = document.getElementById("player");
const enemy = document.getElementById("enemy");

const playerHealth = document.getElementById("player-health");
const enemyHealth = document.getElementById("enemy-health");

const playerEnergy = document.getElementById("player-energy");
const enemyEnergy = document.getElementById("enemy-energy");

const timerElement = document.getElementById("timer");
const message = document.getElementById("message");

const joystick = document.getElementById("joystick");
const knob = document.getElementById("joystick-knob");

const jumpButton = document.getElementById("jump");
const dashButton = document.getElementById("dash");
const specialButton = document.getElementById("special");
const punchButton = document.getElementById("punch");
const kickButton = document.getElementById("kick");
const blockButton = document.getElementById("block");


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
    energy: 25,

    velocityY: 0,

    attacking: false,
    blocking: false,
    cooldown: false
  },

  enemy: {
    x: 68,
    y: 0,
    hp: 100,
    energy: 25,

    velocityY: 0,

    attacking: false,
    blocking: false,
    cooldown: false
  }

};


/* =========================
   JOYSTICK STATE
========================= */

let stickX = 0;
let stickY = 0;
let joystickActive = false;


/* =========================
   HELPER
========================= */

function clamp(value, min, max) {

  return Math.max(
    min,
    Math.min(max, value)
  );

}


function distanceBetweenFighters() {

  return Math.abs(
    game.player.x -
    game.enemy.x
  );

}


/* =========================
   RENDER
========================= */

function render() {

  const p = game.player;
  const e = game.enemy;


  player.style.left =
    p.x + "%";

  enemy.style.left =
    e.x + "%";


  player.style.bottom =
    `calc(24% + ${p.y}px)`;

  enemy.style.bottom =
    `calc(24% + ${e.y}px)`;


  playerHealth.style.width =
    clamp(p.hp, 0, 100) + "%";

  enemyHealth.style.width =
    clamp(e.hp, 0, 100) + "%";


  playerEnergy.style.width =
    clamp(p.energy, 0, 100) + "%";

  enemyEnergy.style.width =
    clamp(e.energy, 0, 100) + "%";


  /*
    Fighters face each other.
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
      "scaleX(1)";
  }

}


/* =========================
   JOYSTICK
========================= */

function moveJoystick(clientX, clientY) {

  const rect =
    joystick.getBoundingClientRect();

  const centerX =
    rect.left +
    rect.width / 2;

  const centerY =
    rect.top +
    rect.height / 2;


  let dx =
    clientX - centerX;

  let dy =
    clientY - centerY;


  const maximum =
    rect.width / 2 - 26;


  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  if (distance > maximum) {

    dx =
      dx / distance *
      maximum;

    dy =
      dy / distance *
      maximum;

  }


  stickX =
    dx / maximum;

  stickY =
    dy / maximum;


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
    Math.abs(stickX) > 0.08 &&
    !p.attacking
  ) {

    /*
      Movement speed.
    */

    p.x +=
      stickX *
      0.045 *
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
   JUMP
========================= */

jumpButton.addEventListener(
  "pointerdown",
  () => {

    const p =
      game.player;


    if (!game.running)
      return;


    if (p.y > 2)
      return;


    p.velocityY =
      0.72;

  }
);


/* =========================
   PHYSICS
========================= */

function updatePhysics(delta) {

  const p =
    game.player;


  /*
    Gravity.
  */

  p.velocityY -=
    0.0022 *
    delta;


  p.y +=
    p.velocityY *
    delta;


  if (p.y < 0) {

    p.y = 0;

    p.velocityY = 0;

  }


  /*
    Energy regeneration.
  */

  p.energy =
    clamp(
      p.energy +
      0.004 * delta,
      0,
      100
    );


  const e =
    game.enemy;


  e.energy =
    clamp(
      e.energy +
      0.003 * delta,
      0,
      100
    );

}


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
        distanceBetweenFighters()
        < 14
      ) {

        let damage = 10;


        if (
          game.enemy.blocking
        ) {

          damage = 2;

        }


        game.enemy.hp -=
          damage;


        enemy.classList.add(
          "hit"
        );


        setTimeout(() => {

          enemy.classList.remove(
            "hit"
          );

        }, 160);


        p.energy =
          clamp(
            p.energy + 8,
            0,
            100
          );

      }

    }, 100);


    setTimeout(() => {

      player.classList.remove(
        "punching"
      );

      p.attacking = false;

    }, 250);


    setTimeout(() => {

      p.cooldown = false;

    }, 350);

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
        distanceBetweenFighters()
        < 17
      ) {

        let damage = 14;


        if (
          game.enemy.blocking
        ) {

          damage = 3;

        }


        game.enemy.hp -=
          damage;


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

    }, 300);

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


    const direction =
      stickX < 0
        ? -1
        : stickX > 0
          ? 1
          : p.x < game.enemy.x
            ? 1
            : -1;


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
   SPECIAL ATTACK
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

    if (p.energy < 100)
      return;


    p.energy = 0;

    p.attacking = true;


    message.textContent =
      "FURY";


    player.classList.add(
      "punching"
    );


    setTimeout(() => {

      if (
        distanceBetweenFighters()
        < 25
      ) {

        let damage = 30;


        if (
          game.enemy.blocking
        ) {

          damage = 6;

        }


        game.enemy.hp -=
          damage;


        enemy.classList.add(
          "hit"
        );


        setTimeout(() => {

          enemy.classList.remove(
            "hit"
          );

        }, 180);

      }

    }, 160);


    setTimeout(() => {

      player.classList.remove(
        "punching"
      );

      p.attacking = false;

      message.textContent = "";

    }, 600);

  }
);


/* =========================
   ENEMY AI
========================= */

let aiTimer = 0;


function updateEnemy(delta) {

  const e =
    game.enemy;

  const p =
    game.player;


  if (!game.running)
    return;


  aiTimer -= delta;


  const distance =
    distanceBetweenFighters();


  /*
    Enemy follows player.
  */

  if (
    distance > 14 &&
    !e.attacking &&
    !e.blocking
  ) {

    const direction =
      p.x < e.x
        ? -1
        : 1;


    e.x +=
      direction *
      0.018 *
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
    Enemy decides what to do.
  */

  if (
    aiTimer <= 0 &&
    !e.attacking &&
    !e.blocking
  ) {

    aiTimer =
      350 +
      Math.random() * 650;


    if (distance < 17) {

      const choice =
        Math.random();


      if (choice < 0.72) {

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
      distanceBetweenFighters()
      < 16
    ) {

      let damage = 9;


      if (
        game.player.blocking
      ) {

        damage = 2;

      }


      game.player.hp -=
        damage;

    }

  }, 110);


  setTimeout(() => {

    enemy.classList.remove(
      "punching"
    );

    e.attacking = false;

  }, 270);


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


  if (e.attacking)
    return;


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


  player.classList.remove(
    "walking",
    "punching",
    "kicking",
    "blocking",
    "dashing"
  );


  enemy.classList.remove(
    "walking",
    "punching",
    "blocking"
  );


  /*
    Automatically restart.
  */

  setTimeout(() => {

    resetRound();

  }, 2200);

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
  game.player.energy = 25;
  game.player.velocityY = 0;
  game.player.attacking = false;
  game.player.blocking = false;
  game.player.cooldown = false;


  game.enemy.x = 68;
  game.enemy.y = 0;
  game.enemy.hp = 100;
  game.enemy.energy = 25;
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

      endRound("FURY WINS");

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


function gameLoop(currentTime) {

  const delta =
    Math.min(
      currentTime - lastTime,
      40
    );


  lastTime =
    currentTime;


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
        "FURY WINS"
      );

    }

  }


  render();


  requestAnimationFrame(
    gameLoop
  );

}


/* =========================
   START GAME
========================= */

render();

requestAnimationFrame(
  gameLoop
);
