"use strict";

/* ============================================================
   IRON FURY
   CLEAN 3D MOBILE FIGHTING ENGINE
   ============================================================ */

const THREE = window.THREE;


/* ============================================================
   DOM HELPER
============================================================ */

function $(id) {
  const el = document.getElementById(id);

  if (!el) {
    throw new Error("Missing element: #" + id);
  }

  return el;
}


/* ============================================================
   DOM
============================================================ */

const canvas = $("gameCanvas");

const loadingScreen = $("loadingScreen");
const loadingProgress = $("loadingProgress");
const loadingText = $("loadingText");

const playerHealth = $("playerHealth");
const enemyHealth = $("enemyHealth");

const playerHealthText = $("playerHealthText");
const enemyHealthText = $("enemyHealthText");

const playerVitality = $("playerVitality");
const enemyVitality = $("enemyVitality");

const playerVitalityText = $("playerVitalityText");
const enemyVitalityText = $("enemyVitalityText");

const fury1 = $("fury1");
const fury2 = $("fury2");
const fury3 = $("fury3");

const enemyFury1 = $("enemyFury1");
const enemyFury2 = $("enemyFury2");
const enemyFury3 = $("enemyFury3");

const playerFuryText = $("playerFuryText");
const enemyFuryText = $("enemyFuryText");

const timer = $("timer");
const roundNumber = $("roundNumber");

const message = $("message");
const subMessage = $("subMessage");

const comboCounter = $("comboCounter");
const comboNumber = $("comboNumber");

const damageNumber = $("damageNumber");
const damageFlash = $("damageFlash");
const furyFlash = $("furyFlash");

const pauseButton = $("pauseButton");
const pauseMenu = $("pauseMenu");
const resumeButton = $("resumeButton");
const pauseRestartButton = $("pauseRestartButton");

const resultOverlay = $("resultOverlay");
const resultTitle = $("resultTitle");
const resultDescription = $("resultDescription");
const resultCombo = $("resultCombo");
const resultDamage = $("resultDamage");
const resultFury = $("resultFury");
const restartButton = $("restartButton");

const finishOverlay = $("finishOverlay");
const finishTitle = $("finishTitle");
const finishSubtitle = $("finishSubtitle");
const finishButton = $("finishButton");

const joystick = $("joystick");
const joystickKnob = $("joystickKnob");

const jumpButton = $("jumpButton");
const dashButton = $("dashButton");
const punchButton = $("punchButton");
const kickButton = $("kickButton");
const blockButton = $("blockButton");
const furyButton = $("furyButton");


/* ============================================================
   CONSTANTS
============================================================ */

const MAX_HEALTH = 100;
const MAX_VITALITY = 100;
const MAX_FURY = 3;

const ARENA_LIMIT = 8;

const PLAYER_SPEED = 5;
const ENEMY_SPEED = 3.1;

const GRAVITY = 22;
const JUMP_FORCE = 8.5;

const ROUND_TIME = 60;
const COMBO_TIME = 1.15;


/* ============================================================
   GAME
============================================================ */

const game = {
  running: false,
  paused: false,
  ended: false,

  time: ROUND_TIME,
  round: 1,

  maxCombo: 0,
  totalDamage: 0,

  cameraShake: 0
};


/* ============================================================
   INPUT
============================================================ */

const input = {
  left: false,
  right: false
};

const stick = {
  active: false,
  x: 0,
  y: 0
};


/* ============================================================
   RENDERER
============================================================ */

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: "high-performance"
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio || 1, 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;


/* ============================================================
   SCENE
============================================================ */

const scene = new THREE.Scene();

scene.background =
  new THREE.Color(0x05080c);

scene.fog =
  new THREE.Fog(
    0x05080c,
    15,
    34
  );


/* ============================================================
   CAMERA
============================================================ */

const camera =
  new THREE.PerspectiveCamera(
    45,
    window.innerWidth /
      window.innerHeight,
    .1,
    100
  );

camera.position.set(
  0,
  4.7,
  13
);


/* ============================================================
   LIGHT
============================================================ */

scene.add(
  new THREE.HemisphereLight(
    0x8fc8ff,
    0x101010,
    2
  )
);

const sun =
  new THREE.DirectionalLight(
    0xffffff,
    2.5
  );

sun.position.set(
  4,
  10,
  8
);

sun.castShadow = true;

scene.add(sun);

const blueLight =
  new THREE.PointLight(
    0x18aaff,
    7,
    16
  );

blueLight.position.set(
  -8,
  4,
  2
);

scene.add(blueLight);

const redLight =
  new THREE.PointLight(
    0xff304d,
    7,
    16
  );

redLight.position.set(
  8,
  4,
  2
);

scene.add(redLight);


/* ============================================================
   MATERIAL
============================================================ */

function mat(color, metal = .15) {

  return new THREE.MeshStandardMaterial({
    color,
    roughness: .58,
    metalness: metal
  });

}


/* ============================================================
   ARENA
============================================================ */

const floor =
  new THREE.Mesh(
    new THREE.PlaneGeometry(22, 14),
    mat(0x111920, .35)
  );

floor.rotation.x =
  -Math.PI / 2;

floor.receiveShadow = true;

scene.add(floor);


/* GRID */

const grid =
  new THREE.GridHelper(
    18,
    36,
    0x39515e,
    0x18252d
  );

grid.position.y = .01;

scene.add(grid);


/* WALL */

const backWall =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      22,
      8,
      .5
    ),
    mat(0x091016)
  );

backWall.position.set(
  0,
  4,
  -5
);

scene.add(backWall);


/* ARENA LIGHTS */

function arenaLight(x, color) {

  const light =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        .15,
        2.5,
        .15
      ),
      new THREE.MeshBasicMaterial({
        color
      })
    );

  light.position.set(
    x,
    1.25,
    -.4
  );

  scene.add(light);
}

arenaLight(-9, 0x28d7ff);
arenaLight(9, 0xff304d);


/* ============================================================
   PARTICLES
============================================================ */

const particles = [];

function particlesBurst(
  position,
  color,
  count = 12
) {

  for (let i = 0; i < count; i++) {

    const particle =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          .045,
          6,
          6
        ),
        new THREE.MeshBasicMaterial({
          color
        })
      );

    particle.position.copy(position);

    particle.userData.life =
      .25 + Math.random() * .4;

    particle.userData.velocity =
      new THREE.Vector3(
        (Math.random() - .5) * 5,
        Math.random() * 5,
        (Math.random() - .5) * 3
      );

    scene.add(particle);
    particles.push(particle);
  }
}

function updateParticles(dt) {

  for (
    let i = particles.length - 1;
    i >= 0;
    i--
  ) {

    const p = particles[i];

    p.userData.life -= dt;

    p.userData.velocity.y -=
      10 * dt;

    p.position.addScaledVector(
      p.userData.velocity,
      dt
    );

    if (p.userData.life <= 0) {

      scene.remove(p);

      p.geometry.dispose();
      p.material.dispose();

      particles.splice(i, 1);
    }
  }
}


/* ============================================================
   FIGHTER CLASS
========================================================================================================= */

  class Fighter {

  constructor(name, color, accent, playerControlled) {

    this.name = name;
    this.color = color;
    this.accent = accent;
    this.playerControlled = playerControlled;

    this.group = new THREE.Group();

    this.health = MAX_HEALTH;
    this.vitality = MAX_VITALITY;
    this.fury = 0;

    this.combo = 0;
    this.comboTimer = 0;

    this.grounded = true;
    this.velocity = new THREE.Vector3();

    this.facing = playerControlled ? 1 : -1;

    this.blocking = false;

    this.attacking = false;
    this.attack = null;
    this.attackTime = 0;
    this.hitConfirmed = false;

    this.hitStun = 0;

    this.dashTime = 0;
    this.invincible = false;

    this.damageDone = 0;
    this.furyUsed = 0;

    this.createModel();

    scene.add(this.group);
  }


  /* ========================================================
     FIGHTER MODEL
     ======================================================== */

  createModel() {

    /* ---------- MATERIALS ---------- */

    const skin = mat(0xc88968, 0.05);

    const suit = mat(
      this.color,
      0.45
    );

    const accent = mat(
      this.accent,
      0.65
    );

    const dark = mat(
      0x111820,
      0.65
    );

    const metal = mat(
      0x66727c,
      0.8
    );

    const black = mat(
      0x05080b,
      0.5
    );


    /* ======================================================
       MAIN BODY
       ====================================================== */

    this.body = new THREE.Group();

    this.group.add(this.body);


    /* ======================================================
       WAIST
       ====================================================== */

    this.waist = new THREE.Mesh(

      new THREE.BoxGeometry(
        0.82,
        0.38,
        0.56
      ),

      dark

    );

    this.waist.position.y = 1.82;

    this.waist.castShadow = true;

    this.body.add(this.waist);


    /* ======================================================
       TORSO
       ====================================================== */

    this.torso = new THREE.Mesh(

      new THREE.BoxGeometry(
        1.12,
        1.35,
        0.62
      ),

      suit

    );

    this.torso.position.y = 2.65;

    this.torso.castShadow = true;

    this.body.add(this.torso);


    /* ======================================================
       CHEST ARMOR
       ====================================================== */

    this.chestArmor = new THREE.Mesh(

      new THREE.BoxGeometry(
        0.82,
        0.55,
        0.12
      ),

      accent

    );

    this.chestArmor.position.set(
      0,
      2.78,
      0.37
    );

    this.chestArmor.castShadow = true;

    this.body.add(this.chestArmor);


    /* ======================================================
       CHEST CORE
       ====================================================== */

    this.core = new THREE.Mesh(

      new THREE.CylinderGeometry(
        0.13,
        0.13,
        0.08,
        16
      ),

      new THREE.MeshBasicMaterial({
        color: this.accent
      })

    );

    this.core.rotation.x =
      Math.PI / 2;

    this.core.position.set(
      0,
      2.78,
      0.45
    );

    this.body.add(this.core);


    /* ======================================================
       NECK
       ====================================================== */

    this.neck = new THREE.Mesh(

      new THREE.CylinderGeometry(
        0.18,
        0.21,
        0.32,
        10
      ),

      skin

    );

    this.neck.position.y = 3.45;

    this.neck.castShadow = true;

    this.body.add(this.neck);


    /* ======================================================
       HEAD
       ====================================================== */

    this.head = new THREE.Mesh(

      new THREE.SphereGeometry(
        0.43,
        18,
        14
      ),

      skin

    );

    this.head.position.y = 3.85;

    this.head.castShadow = true;

    this.body.add(this.head);


    /* ======================================================
       HEAD ARMOR / HAIR
       ====================================================== */

    this.headArmor = new THREE.Mesh(

      new THREE.SphereGeometry(
        0.45,
        18,
        10,
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.55
      ),

      dark

    );

    this.headArmor.position.y = 3.94;

    this.headArmor.castShadow = true;

    this.body.add(this.headArmor);


    /* ======================================================
       VISOR
       ====================================================== */

    this.visor = new THREE.Mesh(

      new THREE.BoxGeometry(
        0.58,
        0.15,
        0.08
      ),

      black

    );

    this.visor.position.set(
      0,
      3.86,
      0.40
    );

    this.body.add(this.visor);


    /* ======================================================
       VISOR LIGHT
       ====================================================== */

    this.visorLight = new THREE.Mesh(

      new THREE.BoxGeometry(
        0.38,
        0.035,
        0.025
      ),

      new THREE.MeshBasicMaterial({
        color: this.accent
      })

    );

    this.visorLight.position.set(
      0,
      3.86,
      0.445
    );

    this.body.add(this.visorLight);


    /* ======================================================
       SHOULDERS
       ====================================================== */

    this.leftShoulder = new THREE.Mesh(

      new THREE.SphereGeometry(
        0.28,
        12,
        10
      ),

      accent

    );

    this.rightShoulder =
      this.leftShoulder.clone();

    this.leftShoulder.position.set(
      -0.72,
      3.12,
      0
    );

    this.rightShoulder.position.set(
      0.72,
      3.12,
      0
    );

    this.body.add(
      this.leftShoulder,
      this.rightShoulder
    );


    /* ======================================================
       ARMS
       ====================================================== */

    this.leftArm = this.limb(
      0.19,
      0.78,
      suit
    );

    this.rightArm = this.limb(
      0.19,
      0.78,
      suit
    );

    this.leftArm.position.set(
      -0.72,
      3.05,
      0
    );

    this.rightArm.position.set(
      0.72,
      3.05,
      0
    );

    this.body.add(
      this.leftArm,
      this.rightArm
    );


    /* ======================================================
       FOREARM ARMOR
       ====================================================== */

    this.leftGuard = new THREE.Mesh(

      new THREE.CylinderGeometry(
        0.22,
        0.20,
        0.42,
        10
      ),

      metal

    );

    this.rightGuard =
      this.leftGuard.clone();

    this.leftGuard.position.y = -0.48;

    this.rightGuard.position.y = -0.48;

    this.leftArm.add(
      this.leftGuard
    );

    this.rightArm.add(
      this.rightGuard
    );


    /* ======================================================
       FISTS / GLOVES
       ====================================================== */

    this.leftFist = new THREE.Mesh(

      new THREE.SphereGeometry(
        0.22,
        12,
        10
      ),

      accent

    );

    this.rightFist =
      this.leftFist.clone();

    this.leftFist.position.y = -0.82;

    this.rightFist.position.y = -0.82;

    this.leftArm.add(
      this.leftFist
    );

    this.rightArm.add(
      this.rightFist
    );


    /* ======================================================
       BELT
       ====================================================== */

    this.belt = new THREE.Mesh(

      new THREE.BoxGeometry(
        0.95,
        0.18,
        0.65
      ),

      dark

    );

    this.belt.position.y = 1.98;

    this.body.add(this.belt);


    /* ======================================================
       BELT CORE
       ====================================================== */

    this.beltCore = new THREE.Mesh(

      new THREE.BoxGeometry(
        0.22,
        0.20,
        0.08
      ),

      accent

    );

    this.beltCore.position.set(
      0,
      1.98,
      0.37
    );

    this.body.add(
      this.beltCore
    );


    /* ======================================================
       LEGS
       ====================================================== */

    this.leftLeg = this.limb(
      0.27,
      0.85,
      dark
    );

    this.rightLeg = this.limb(
      0.27,
      0.85,
      dark
    );

    this.leftLeg.position.set(
      -0.32,
      1.55,
      0
    );

    this.rightLeg.position.set(
      0.32,
      1.55,
      0
    );

    this.body.add(
      this.leftLeg,
      this.rightLeg
    );


    /* ======================================================
       KNEE ARMOR
       ====================================================== */

    this.leftKnee = new THREE.Mesh(

      new THREE.SphereGeometry(
        0.25,
        10,
        8
      ),

      metal

    );

    this.rightKnee =
      this.leftKnee.clone();

    this.leftKnee.position.y = -0.42;

    this.rightKnee.position.y = -0.42;

    this.leftLeg.add(
      this.leftKnee
    );

    this.rightLeg.add(
      this.rightKnee
    );


    /* ======================================================
       BOOTS
       ====================================================== */

    this.leftFoot = new THREE.Mesh(

      new THREE.BoxGeometry(
        0.38,
        0.24,
        0.68
      ),

      black

    );

    this.rightFoot =
      this.leftFoot.clone();

    this.leftFoot.position.set(
      0,
      -0.58,
      0.17
    );

    this.rightFoot.position.set(
      0,
      -0.58,
      0.17
    );

    this.leftLeg.add(
      this.leftFoot
    );

    this.rightLeg.add(
      this.rightFoot
    );


    /* ======================================================
       BOOT ACCENTS
       ====================================================== */

    this.leftBootAccent = new THREE.Mesh(

      new THREE.BoxGeometry(
        0.32,
        0.07,
        0.10
      ),

      accent

    );

    this.rightBootAccent =
      this.leftBootAccent.clone();

    this.leftBootAccent.position.set(
      0,
      -0.49,
      0.49
    );

    this.rightBootAccent.position.set(
      0,
      -0.49,
      0.49
    );

    this.leftLeg.add(
      this.leftBootAccent
    );

    this.rightLeg.add(
      this.rightBootAccent
    );


    this.resetPose();
  }


  /* ========================================================
     LIMB
     ======================================================== */

  limb(
    radius,
    length,
    material
  ) {

    const pivot =
      new THREE.Group();

    const mesh =
      new THREE.Mesh(

        new THREE.CylinderGeometry(
          radius,
          radius * 0.92,
          length,
          10
        ),

        material

      );

    mesh.position.y =
      -length / 2;

    mesh.castShadow = true;

    pivot.add(mesh);

    return pivot;
  }


  /* ========================================================
     RESET POSE
     ======================================================== */

  resetPose() {

    this.leftArm.rotation.set(
      0.1,
      0,
      0.15
    );

    this.rightArm.rotation.set(
      0.1,
      0,
      -0.15
    );

    this.leftLeg.rotation.set(
      0,
      0,
      0
    );

    this.rightLeg.rotation.set(
      0,
      0,
      0
    );

    this.torso.rotation.set(
      0,
      0,
      0
    );

    this.body.scale.set(
      1,
      1,
      1
    );
  }


  /* ========================================================
     UPDATE
     ======================================================== */

  update(dt, opponent) {

    if (this.hitStun > 0) {

      this.hitStun -= dt;

      this.blocking = false;

      this.physics(dt);

      this.animateHit();

      return;
    }


    if (this.dashTime > 0) {

      this.dashTime -= dt;

      this.group.position.x +=
        this.facing * 13 * dt;

      this.invincible = true;

    } else {

      this.invincible = false;
    }


    if (this.attacking) {

      this.updateAttack(
        dt,
        opponent
      );
    }


    this.physics(dt);

    this.faceOpponent(
      opponent
    );

    this.animate();

    this.limitPosition();


    this.comboTimer -= dt;

    if (this.comboTimer <= 0) {

      this.combo = 0;
    }
  }


  /* ========================================================
     PHYSICS
     ======================================================== */

  physics(dt) {

    if (!this.grounded) {

      this.velocity.y -=
        GRAVITY * dt;

      this.group.position.y +=
        this.velocity.y * dt;


      if (
        this.group.position.y <= 0
      ) {

        this.group.position.y = 0;

        this.velocity.y = 0;

        this.grounded = true;
      }
    }
  }


  /* ========================================================
     MOVEMENT
     ======================================================== */

  move(direction, dt) {

    if (
      this.attacking ||
      this.blocking ||
      this.hitStun > 0 ||
      this.dashTime > 0
    ) {

      return;
    }


    const speed =
      this.playerControlled
        ? PLAYER_SPEED
        : ENEMY_SPEED;


    this.group.position.x +=
      direction * speed * dt;
  }


  /* ========================================================
     JUMP
     ======================================================== */

  jump() {

    if (
      !this.grounded ||
      this.attacking ||
      this.blocking
    ) {

      return;
    }


    this.velocity.y =
      JUMP_FORCE;

    this.grounded = false;
  }


  /* ========================================================
     DASH
     ======================================================== */

  dash() {

    if (
      this.dashTime > 0 ||
      this.hitStun > 0
    ) {

      return;
    }


    this.dashTime = 0.18;

    particlesBurst(

      new THREE.Vector3(
        this.group.position.x,
        1,
        0
      ),

      this.accent,

      8
    );
  }


  /* ========================================================
     BLOCK
     ======================================================== */

  block(value) {

    if (
      this.attacking ||
      this.hitStun > 0
    ) {

      this.blocking = false;

      return;
    }


    this.blocking = value;
  }


  /* ========================================================
     ATTACK
     ======================================================== */

  startAttack(type) {

    if (
      this.attacking ||
      this.blocking ||
      this.hitStun > 0
    ) {

      return;
    }


    this.attacking = true;

    this.attack = type;

    this.hitConfirmed = false;


    this.attackTime =
      type === "punch"
        ? 0.42
        : type === "kick"
          ? 0.55
          : 1.15;
  }


  updateAttack(
    dt,
    opponent
  ) {

    this.attackTime -= dt;


    const duration =
      this.attack === "punch"
        ? 0.42
        : this.attack === "kick"
          ? 0.55
          : 1.15;


    const progress =
      1 -
      this.attackTime /
        duration;


    if (
      !this.hitConfirmed &&
      progress > 0.3 &&
      progress < 0.72
    ) {

      this.hitConfirmed = true;


      const distance =
        Math.abs(
          opponent.group.position.x -
          this.group.position.x
        );


      const range =
        this.attack === "kick"
          ? 2.05
          : this.attack === "fury"
            ? 3.2
            : 1.7;


      if (
        distance <= range
      ) {

        let damage = 0;


        if (
          this.attack === "punch"
        ) {

          damage = 7;

        } else if (
          this.attack === "kick"
        ) {

          damage = 10;

        } else {

          damage =
            15 +
            this.furyUsed * 8;
        }


        opponent.takeDamage(
          damage,
          this
        );
      }
    }


    if (
      this.attackTime <= 0
    ) {

      this.attacking = false;

      this.attack = null;

      this.attackTime = 0;

      this.body.scale.set(
        1,
        1,
        1
      );
    }
  }


  /* ========================================================
     DAMAGE
     ======================================================== */

  takeDamage(
    damage,
    attacker
  ) {

    if (
      this.invincible ||
      game.ended
    ) {

      return;
    }


    let actual = damage;


    if (this.blocking) {

      actual *= 0.2;

      this.vitality =
        Math.max(
          0,
          this.vitality -
            damage * 0.15
        );

    } else {

      this.vitality =
        Math.max(
          0,
          this.vitality -
            damage * 0.08
        );


      this.hitStun = 0.2;


      this.velocity.x =
        attacker.facing * 2;


      this.comboTimer =
        COMBO_TIME;
    }


    this.health =
      Math.max(
        0,
        this.health - actual
      );


    attacker.damageDone += actual;


    if (
      attacker.playerControlled
    ) {

      attacker.combo++;

      attacker.comboTimer =
        COMBO_TIME;


      game.maxCombo =
        Math.max(
          game.maxCombo,
          attacker.combo
        );


      game.totalDamage += actual;


      gainFury(
        attacker,
        actual
      );


      showDamage(actual);
    }


    game.cameraShake =
      Math.min(
        0.25,
        game.cameraShake + 0.09
      );


    particlesBurst(

      new THREE.Vector3(
        this.group.position.x,
        2.5,
        0.5
      ),

      this.blocking
        ? 0xb76cff
        : 0xffbf3d,

      this.blocking
        ? 7
        : 12
    );


    updateHUD();


    if (
      this.health <= 0
    ) {

      this.health = 0;

      checkWinner();
    }
  }


  /* ========================================================
     FURY
     ======================================================== */

  useFury() {

    const level =
      Math.floor(this.fury);


    if (
      level < 1 ||
      this.attacking ||
      this.blocking ||
      this.hitStun > 0
    ) {

      return;
    }


    this.fury = 0;

    this.furyUsed += level;

    this.attacking = true;

    this.attack = "fury";

    this.attackTime = 1.15;

    this.hitConfirmed = false;


    furyFlash.classList.remove(
      "active"
    );

    void furyFlash.offsetWidth;

    furyFlash.classList.add(
      "active"
    );


    particlesBurst(

      new THREE.Vector3(
        this.group.position.x,
        2.5,
        0
      ),

      this.accent,

      35
    );


    updateHUD();
  }


  /* ========================================================
     ANIMATION
     ======================================================== */

  animate() {

    const time =
      performance.now() * 0.008;


    /* ---------- BLOCK ---------- */

    if (this.blocking) {

      this.leftArm.rotation.x =
        -0.7;

      this.rightArm.rotation.x =
        -0.7;

      this.leftArm.rotation.z =
        0.65;

      this.rightArm.rotation.z =
        -0.65;

      return;
    }


    /* ---------- ATTACK ---------- */

    if (this.attacking) {

      const progress =
        1 -
        this.attackTime /
        (
          this.attack === "punch"
            ? 0.42
            : this.attack === "kick"
              ? 0.55
              : 1.15
        );


      const swing =
        Math.sin(
          Math.min(
            1,
            progress
          ) * Math.PI
        );


      /* PUNCH */

      if (
        this.attack === "punch"
      ) {

        if (
          this.facing === 1
        ) {

          this.rightArm.rotation.x =
            -1.7 * swing;

          this.rightArm.rotation.z =
            -0.3 * swing;

        } else {

          this.leftArm.rotation.x =
            -1.7 * swing;

          this.leftArm.rotation.z =
            0.3 * swing;
        }
      }


      /* KICK */

      if (
        this.attack === "kick"
      ) {

        if (
          this.facing === 1
        ) {

          this.rightLeg.rotation.x =
            -1.45 * swing;

        } else {

          this.leftLeg.rotation.x =
            -1.45 * swing;
        }
      }


      /* FURY */

      if (
        this.attack === "fury"
      ) {

        const pulse =
          1 +
          Math.sin(time * 4) *
          0.08;


        this.body.scale.set(
          pulse,
          pulse,
          pulse
        );


        this.leftArm.rotation.x =
          -1.4;

        this.rightArm.rotation.x =
          -1.4;

        this.leftLeg.rotation.x =
          -0.25;

        this.rightLeg.rotation.x =
          0.25;
      }


      return;
    }


    /* ---------- JUMP ---------- */

    if (!this.grounded) {

      this.leftLeg.rotation.x =
        -0.3;

      this.rightLeg.rotation.x =
        0.3;

      return;
    }


    /* ---------- WALK ---------- */

    const walking =
      Math.sin(
        performance.now() * 0.012
      );


    this.leftArm.rotation.x =
      walking * 0.18;

    this.rightArm.rotation.x =
      -walking * 0.18;


    this.leftLeg.rotation.x =
      -walking * 0.15;

    this.rightLeg.rotation.x =
      walking * 0.15;
  }


  /* ========================================================
     HIT ANIMATION
     ======================================================== */

  animateHit() {

    this.torso.rotation.z =
      0.2 * this.facing;

    this.leftArm.rotation.z =
      0.45;

    this.rightArm.rotation.z =
      -0.45;
  }


  /* ========================================================
     FACING
     ======================================================== */

  faceOpponent(opponent) {

    if (this.attacking) {

      return;
    }


    this.facing =
      opponent.group.position.x >
      this.group.position.x
        ? 1
        : -1;


    this.group.rotation.y =
      this.facing === 1
        ? 0
        : Math.PI;
  }


  /* ========================================================
     ARENA LIMIT
     ======================================================== */

  limitPosition() {

    this.group.position.x =
      THREE.MathUtils.clamp(
        this.group.position.x,
        -ARENA_LIMIT,
        ARENA_LIMIT
      );
  }

}
      


/* ============================================================
   FIGHTERS
============================================================ */

const player =
  new Fighter(
    "IRON FURY",
    0x263b46,
    0x28d7ff,
    true
  );

const enemy =
  new Fighter(
    "RIVAL",
    0x4a2029,
    0xff4057,
    false
  );


/* ============================================================
   FURY
============================================================ */

function gainFury(
  fighter,
  damage
) {

  fighter.fury =
    Math.min(
      MAX_FURY,
      fighter.fury +
      (damage >= 8 ? .16 : .1)
    );

  fighter.fury =
    Math.floor(
      fighter.fury * 10
    ) / 10;
}


/* ============================================================
   PLAYER
============================================================ */

function updatePlayer(dt) {

  let direction = 0;

  if (
    stick.x < -.2 ||
    input.left
  ) {
    direction -= 1;
  }

  if (
    stick.x > .2 ||
    input.right
  ) {
    direction += 1;
  }

  player.move(
    direction,
    dt
  );
}


/* ============================================================
   ENEMY AI
============================================================ */

let aiTimer = 0;

function updateEnemy(dt) {

  aiTimer -= dt;

  if (aiTimer > 0) {
    return;
  }

  aiTimer =
    .18 +
    Math.random() * .22;


  const distance =
    player.group.position.x -
    enemy.group.position.x;

  const absolute =
    Math.abs(distance);


  if (absolute > 2) {

    enemy.move(
      Math.sign(distance),
      dt * 2.5
    );

    return;
  }


  const choice =
    Math.random();


  if (choice < .35) {

    enemy.startAttack("punch");

  }
  else if (choice < .55) {

    enemy.startAttack("kick");

  }
  else if (choice < .72) {

    enemy.block(true);

    setTimeout(
      () => enemy.block(false),
      350
    );

  }
  else if (enemy.fury >= 1) {

    enemy.useFury();
  }
}


/* ============================================================
   CAMERA
============================================================ */

function updateCamera() {

  const center =
    (
      player.group.position.x +
      enemy.group.position.x
    ) / 2;

  const distance =
    Math.abs(
      player.group.position.x -
      enemy.group.position.x
    );


  const targetZ =
    THREE.MathUtils.clamp(
      12 + distance * .35,
      11,
      16
    );


  let shakeX = 0;
  let shakeY = 0;


  if (game.cameraShake > 0) {

    shakeX =
      (Math.random() - .5) *
      game.cameraShake;

    shakeY =
      (Math.random() - .5) *
      game.cameraShake;

    game.cameraShake *= .88;
  }


  camera.position.x +=
    (
      center +
      shakeX -
      camera.position.x
    ) * .08;


  camera.position.y +=
    (
      4.7 +
      shakeY -
      camera.position.y
    ) * .08;


  camera.position.z +=
    (
      targetZ -
      camera.position.z
    ) * .08;


  camera.lookAt(
    center,
    2.2,
    0
  );
}


/* ============================================================
   HUD
============================================================ */

function updateHUD() {

  playerHealth.style.width =
    player.health + "%";

  enemyHealth.style.width =
    enemy.health + "%";


  playerVitality.style.width =
    player.vitality + "%";

  enemyVitality.style.width =
    enemy.vitality + "%";


  playerHealthText.textContent =
    Math.ceil(player.health);

  enemyHealthText.textContent =
    Math.ceil(enemy.health);


  playerVitalityText.textContent =
    Math.ceil(player.vitality);

  enemyVitalityText.textContent =
    Math.ceil(enemy.vitality);


  playerFuryText.textContent =
    Math.floor(player.fury) + " / 3";

  enemyFuryText.textContent =
    Math.floor(enemy.fury) + " / 3";


  const playerFury =
    Math.floor(player.fury);

  const enemyFury =
    Math.floor(enemy.fury);


  const playerSlots = [
    fury1,
    fury2,
    fury3
  ];

  const enemySlots = [
    enemyFury1,
    enemyFury2,
    enemyFury3
  ];


  playerSlots.forEach(
    (slot, index) => {

      slot.classList.toggle(
        "active",
        index < playerFury
      );

      slot.classList.toggle(
        "ready",
        playerFury === 3
      );
    }
  );


  enemySlots.forEach(
    (slot, index) => {

      slot.classList.toggle(
        "active",
        index < enemyFury
      );

      slot.classList.toggle(
        "ready",
        enemyFury === 3
      );
    }
  );


  furyButton.classList.toggle(
    "ready",
    playerFury >= 1
  );


  comboNumber.textContent =
    player.combo;

  comboCounter.classList.toggle(
    "visible",
    player.combo > 0
  );


  timer.textContent =
    Math.max(
      0,
      Math.ceil(game.time)
    );
}


/* ============================================================
   DAMAGE DISPLAY
============================================================ */

function showDamage(amount) {

  damageNumber.textContent =
    Math.round(amount);

  damageNumber.classList.remove(
    "show"
  );

  void damageNumber.offsetWidth;

  damageNumber.classList.add(
    "show"
  );


  damageFlash.classList.remove(
    "active"
  );

  void damageFlash.offsetWidth;

  damageFlash.classList.add(
    "active"
  );
}


/* ============================================================
   WINNER
============================================================ */

function checkWinner() {

  if (game.ended) {
    return;
  }


  if (enemy.health <= 0) {

    finishOverlay.classList.remove(
      "hidden"
    );

    finishTitle.textContent =
      "FURY FINISH";

    finishSubtitle.textContent =
      "THE RIVAL HAS FALLEN";

    return;
  }


  if (player.health <= 0) {

    endGame(
      false,
      "THE RIVAL WINS"
    );
  }
}


/* ============================================================
   FINISH
============================================================ */

finishButton.addEventListener(
  "click",
  () => {

    finishOverlay.classList.add(
      "hidden"
    );

    game.ended = true;

    particlesBurst(
      new THREE.Vector3(
        enemy.group.position.x,
        2.5,
        0
      ),
      0x28d7ff,
      50
    );

    showMessage(
      "FURY FINISH",
      "IRON FURY",
      1500
    );


    setTimeout(
      () => {

        endGame(
          true,
          "FURY FINISH"
        );

      },
      1200
    );
  }
);


/* ============================================================
   MESSAGE
============================================================ */

let messageTimer = null;

function showMessage(
  title,
  subtitle,
  duration
) {

  message.textContent = title;
  subMessage.textContent = subtitle;

  clearTimeout(messageTimer);

  messageTimer =
    setTimeout(
      () => {

        message.textContent = "";
        subMessage.textContent = "";

      },
      duration
    );
}


/* ============================================================
   END GAME
============================================================ */

function endGame(
  victory,
  description
) {

  if (game.ended && resultOverlay.classList.contains("hidden") === false) {
    return;
  }

  game.ended = true;

  resultTitle.textContent =
    victory
      ? "VICTORY"
      : "DEFEAT";

  resultDescription.textContent =
    description;

  resultCombo.textContent =
    game.maxCombo;

  resultDamage.textContent =
    Math.round(game.totalDamage);

  resultFury.textContent =
    player.furyUsed;

  resultOverlay.classList.remove(
    "hidden"
  );
}


/* ============================================================
   RESTART
============================================================ */

function restartGame() {

  game.running = true;
  game.paused = false;
  game.ended = false;

  game.time = ROUND_TIME;

  game.maxCombo = 0;
  game.totalDamage = 0;

  game.cameraShake = 0;


  resetFighter(
    player,
    -3.8
  );

  resetFighter(
    enemy,
    3.8
  );


  resultOverlay.classList.add(
    "hidden"
  );

  pauseMenu.classList.add(
    "hidden"
  );

  finishOverlay.classList.add(
    "hidden"
  );


  updateHUD();


  showMessage(
    "ROUND 1",
    "FIGHT",
    1200
  );
}


function resetFighter(
  fighter,
  x
) {

  fighter.health =
    MAX_HEALTH;

  fighter.vitality =
    MAX_VITALITY;

  fighter.fury = 0;

  fighter.combo = 0;
  fighter.comboTimer = 0;

  fighter.furyUsed = 0;

  fighter.attacking = false;
  fighter.blocking = false;

  fighter.attack = null;
  fighter.attackTime = 0;

  fighter.hitStun = 0;

  fighter.dashTime = 0;

  fighter.velocity.set(
    0,
    0,
    0
  );

  fighter.group.position.set(
    x,
    0,
    0
  );

  fighter.grounded = true;

  fighter.resetPose();
}


/* ============================================================
   PAUSE
============================================================ */

function setPaused(value) {

  game.paused = value;

  pauseMenu.classList.toggle(
    "hidden",
    !value
  );
}


pauseButton.addEventListener(
  "click",
  () => {
    setPaused(!game.paused);
  }
);

resumeButton.addEventListener(
  "click",
  () => {
    setPaused(false);
  }
);

pauseRestartButton.addEventListener(
  "click",
  restartGame
);

restartButton.addEventListener(
  "click",
  restartGame
);


/* ============================================================
   MOBILE BUTTON HELPER
============================================================ */

function pressButton(
  element,
  down,
  up
) {

  element.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      element.classList.add(
        "pressed"
      );

      down();

    },
    { passive: false }
  );


  element.addEventListener(
    "pointerup",
    event => {

      event.preventDefault();

      element.classList.remove(
        "pressed"
      );

      up();

    },
    { passive: false }
  );


  element.addEventListener(
    "pointercancel",
    () => {

      element.classList.remove(
        "pressed"
      );

      up();

    }
  );
}


pressButton(
  jumpButton,
  () => player.jump(),
  () => {}
);

pressButton(
  dashButton,
  () => player.dash(),
  () => {}
);

pressButton(
  punchButton,
  () => player.startAttack("punch"),
  () => {}
);

pressButton(
  kickButton,
  () => player.startAttack("kick"),
  () => {}
);

pressButton(
  blockButton,
  () => player.block(true),
  () => player.block(false)
);

pressButton(
  furyButton,
  () => player.useFury(),
  () => {}
);


/* ============================================================
   KEYBOARD
============================================================ */

window.addEventListener(
  "keydown",
  event => {

    if (
      event.code === "ArrowLeft" ||
      event.code === "KeyA"
    ) {
      input.left = true;
    }


    if (
      event.code === "ArrowRight" ||
      event.code === "KeyD"
    ) {
      input.right = true;
    }


    if (
      event.code === "Space" &&
      !event.repeat
    ) {
      player.jump();
    }


    if (
      event.code === "ShiftLeft" &&
      !event.repeat
    ) {
      player.dash();
    }


    if (
      event.code === "KeyJ" &&
      !event.repeat
    ) {
      player.startAttack("punch");
    }


    if (
      event.code === "KeyK" &&
      !event.repeat
    ) {
      player.startAttack("kick");
    }


    if (event.code === "KeyL") {
      player.block(true);
    }


    if (
      event.code === "KeyF" &&
      !event.repeat
    ) {
      player.useFury();
    }


    if (
      event.code === "Escape" &&
      !event.repeat
    ) {
      setPaused(!game.paused);
    }
  }
);


window.addEventListener(
  "keyup",
  event => {

    if (
      event.code === "ArrowLeft" ||
      event.code === "KeyA"
    ) {
      input.left = false;
    }


    if (
      event.code === "ArrowRight" ||
      event.code === "KeyD"
    ) {
      input.right = false;
    }


    if (event.code === "KeyL") {
      player.block(false);
    }
  }
);


/* ============================================================
   JOYSTICK
============================================================ */

function updateStick(
  x,
  y
) {

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

  const radius =
    rect.width * .34;

  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  if (distance > radius) {

    dx =
      dx /
      distance *
      radius;

    dy =
      dy /
      distance *
      radius;
  }


  stick.x =
    dx / radius;

  stick.y =
    dy / radius;


  joystickKnob.style.transform =
    "translate(calc(-50% + " +
    dx +
    "px), calc(-50% + " +
    dy +
    "px))";
}


function resetStick() {

  stick.active = false;

  stick.x = 0;
  stick.y = 0;

  joystickKnob.style.transform =
    "translate(-50%, -50%)";
}


joystick.addEventListener(
  "pointerdown",
  event => {

    event.preventDefault();

    stick.active = true;

    joystick.setPointerCapture(
      event.pointerId
    );

    updateStick(
      event.clientX,
      event.clientY
    );
  },
  { passive: false }
);


joystick.addEventListener(
  "pointermove",
  event => {

    if (!stick.active) {
      return;
    }

    event.preventDefault();

    updateStick(
      event.clientX,
      event.clientY
    );
  },
  { passive: false }
);


joystick.addEventListener(
  "pointerup",
  resetStick
);

joystick.addEventListener(
  "pointercancel",
  resetStick
);


/* ============================================================
   TIMER
============================================================ */

function updateTimer(dt) {

  game.time -= dt;

  if (game.time <= 0) {

    game.time = 0;

    if (
      player.health >=
      enemy.health
    ) {

      endGame(
        true,
        "TIME VICTORY"
      );

    }
    else {

      endGame(
        false,
        "TIME DEFEAT"
      );
    }
  }
}


/* ============================================================
   RESIZE
============================================================ */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        2
      )
    );
  }
);


/* ============================================================
   MAIN LOOP
============================================================ */

let previous =
  performance.now();


function loop(now) {

  requestAnimationFrame(loop);

  const dt =
    Math.min(
      .05,
      (now - previous) / 1000
    );

  previous = now;


  if (
    game.running &&
    !game.paused &&
    !game.ended
  ) {

    updatePlayer(dt);

    updateEnemy(dt);

    player.update(
      dt,
      enemy
    );

    enemy.update(
      dt,
      player
    );

    updateTimer(dt);
  }


  updateParticles(dt);

  updateCamera();

  renderer.render(
    scene,
    camera
  );
}


/* ============================================================
   STARTUP
============================================================ */

function initialize() {

  let progress = 0;

  loadingText.textContent =
    "INITIALIZING ENGINE";


  const interval =
    setInterval(
      () => {

        progress += 10;

        if (progress >= 30) {
          loadingText.textContent =
            "BUILDING ARENA";
        }

        if (progress >= 60) {
          loadingText.textContent =
            "LOADING FIGHTERS";
        }

        if (progress >= 85) {
          loadingText.textContent =
            "ARMING FURY SYSTEM";
        }


        loadingProgress.style.width =
          progress + "%";


        if (progress >= 100) {

          clearInterval(interval);

          loadingText.textContent =
            "READY";


          setTimeout(
            () => {

              loadingScreen.classList.add(
                "hidden"
              );

              restartGame();

            },
            350
          );
        }

      },
      70
    );
}


/* ============================================================
   BOOT
============================================================ */

try {

  updateHUD();

  loop(
    performance.now()
  );

  initialize();

}
catch (error) {

  console.error(
    "IRON FURY ERROR:",
    error
  );

  loadingText.textContent =
    "ENGINE ERROR";

  loadingProgress.style.width =
    "100%";
}
