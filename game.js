"use strict";


/* ============================================================
   IRON FURY
   3D FIGHTING GAME ENGINE
   ============================================================ */

const THREE = window.THREE;

if (!THREE) {
  throw new Error("Three.js failed to load.");
}


/* ============================================================
   DOM HELPER
   ============================================================ */

const $ = (id) => {

  const el =
    document.getElementById(id);

  if (!el) {
    throw new Error(
      "Missing #" + id
    );
  }

  return el;

};


/* ============================================================
   DOM
   ============================================================ */

const canvas =
  $("gameCanvas");

const loadingScreen =
  $("loadingScreen");

const loadingText =
  $("loadingText");

const loadingProgress =
  $("loadingProgress");


const playerHealth =
  $("playerHealth");

const enemyHealth =
  $("enemyHealth");

const playerHealthText =
  $("playerHealthText");

const enemyHealthText =
  $("enemyHealthText");


const playerVitality =
  $("playerVitality");

const enemyVitality =
  $("enemyVitality");

const playerVitalityText =
  $("playerVitalityText");

const enemyVitalityText =
  $("enemyVitalityText");


const fury1 = $("fury1");
const fury2 = $("fury2");
const fury3 = $("fury3");

const enemyFury1 =
  $("enemyFury1");

const enemyFury2 =
  $("enemyFury2");

const enemyFury3 =
  $("enemyFury3");


const playerFuryText =
  $("playerFuryText");

const enemyFuryText =
  $("enemyFuryText");


const timer =
  $("timer");

const roundNumber =
  $("roundNumber");


const message =
  $("message");

const subMessage =
  $("subMessage");


const comboCounter =
  $("comboCounter");

const comboNumber =
  $("comboNumber");


const damageNumber =
  $("damageNumber");

const damageFlash =
  $("damageFlash");

const furyFlash =
  $("furyFlash");


const pauseButton =
  $("pauseButton");

const pauseMenu =
  $("pauseMenu");

const resumeButton =
  $("resumeButton");

const pauseRestartButton =
  $("pauseRestartButton");


const resultOverlay =
  $("resultOverlay");

const resultTitle =
  $("resultTitle");

const resultDescription =
  $("resultDescription");

const resultCombo =
  $("resultCombo");

const resultDamage =
  $("resultDamage");

const resultFury =
  $("resultFury");

const restartButton =
  $("restartButton");


const finishOverlay =
  $("finishOverlay");

const finishTitle =
  $("finishTitle");

const finishSubtitle =
  $("finishSubtitle");

const finishButton =
  $("finishButton");


const joystick =
  $("joystick");

const joystickKnob =
  $("joystickKnob");


const jumpButton =
  $("jumpButton");

const dashButton =
  $("dashButton");

const punchButton =
  $("punchButton");

const kickButton =
  $("kickButton");

const blockButton =
  $("blockButton");

const furyButton =
  $("furyButton");


/* ============================================================
   CONSTANTS
   ============================================================ */

const MAX_HEALTH = 100;

const MAX_VITALITY = 100;

const MAX_FURY = 3;

const ARENA_X = 8.2;

const ARENA_Z = 3.0;

const GRAVITY = 22;

const JUMP_FORCE = 8.8;

const PLAYER_SPEED = 5.2;

const ENEMY_SPEED = 3.45;

const ROUND_TIME = 60;

const COMBO_WINDOW = 1.05;


/* ============================================================
   GAME STATE
   ============================================================ */

const game = {

  running: false,

  paused: false,

  ended: false,

  time: ROUND_TIME,

  maxCombo: 0,

  totalDamage: 0,

  cameraShake: 0

};


/* ============================================================
   INPUT
   ============================================================ */

const input = {

  left: false,

  right: false,

  up: false,

  down: false

};


const stick = {

  active: false,

  x: 0,

  y: 0

};


/* ============================================================
   RENDERER
   ============================================================ */

const renderer =
  new THREE.WebGLRenderer({

    canvas,

    antialias: true,

    powerPreference:
      "high-performance"

  });


renderer.setPixelRatio(

  Math.min(
    window.devicePixelRatio || 1,
    2
  )

);


renderer.setSize(
  window.innerWidth,
  window.innerHeight
);


renderer.shadowMap.enabled =
  true;

renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
  THREE.SRGBColorSpace;


/* ============================================================
   SCENE
   ============================================================ */

const scene =
  new THREE.Scene();


scene.background =
  new THREE.Color(
    0x05080e
  );


scene.fog =
  new THREE.Fog(
    0x05080e,
    14,
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

    0.1,

    100

  );


camera.position.set(
  0,
  5.2,
  14
);


/* ============================================================
   LIGHTING
   ============================================================ */

scene.add(

  new THREE.HemisphereLight(
    0x9bd6ff,
    0x11141b,
    1.8
  )

);


const sun =
  new THREE.DirectionalLight(
    0xffffff,
    2.6
  );


sun.position.set(
  5,
  10,
  8
);


sun.castShadow =
  true;


sun.shadow.mapSize.set(
  1024,
  1024
);


scene.add(sun);


const blueLight =
  new THREE.PointLight(
    0x159dff,
    12,
    18
  );


blueLight.position.set(
  -8,
  4,
  2
);


scene.add(
  blueLight
);


const redLight =
  new THREE.PointLight(
    0xff3150,
    12,
    18
  );


redLight.position.set(
  8,
  4,
  2
);


scene.add(
  redLight
);


/* ============================================================
   MATERIAL
   ============================================================ */

function mat(
  color,
  metal = 0.15,
  rough = 0.55
) {

  return new THREE.MeshStandardMaterial({

    color,

    metalness: metal,

    roughness: rough

  });

}


function basic(color) {

  return new THREE.MeshBasicMaterial({
    color
  });

}


/* ============================================================
   ARENA
   ============================================================ */

const floor =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      22,
      14
    ),

    mat(
      0x121b24,
      0.35,
      0.7
    )

  );


floor.rotation.x =
  -Math.PI / 2;


floor.receiveShadow =
  true;


scene.add(floor);


/* GRID */

const grid =
  new THREE.GridHelper(
    18,
    36,
    0x35505e,
    0x18252e
  );


grid.position.y =
  0.015;


scene.add(grid);


/* BACK WALL */

const wall =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      22,
      8,
      0.45
    ),

    mat(
      0x091017,
      0.25,
      0.8
    )

  );


wall.position.set(
  0,
  4,
  -5
);


wall.receiveShadow =
  true;


scene.add(wall);


/* SIDE MARKERS */

for (
  const x of [-9, 9]
) {

  const marker =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.16,
        2.6,
        0.16
      ),

      basic(
        0x28d7ff
      )

    );


  marker.position.set(
    x,
    1.3,
    -0.3
  );


  scene.add(marker);

}


/* ARENA RINGS */

for (
  const x of [-6, 0, 6]
) {

  const ring =
    new THREE.Mesh(

      new THREE.TorusGeometry(
        2.5,
        0.025,
        8,
        64
      ),

      basic(
        0x1c5266
      )

    );


  ring.rotation.x =
    Math.PI / 2;


  ring.position.set(
    x,
    0.03,
    0
  );


  scene.add(ring);

}


/* ============================================================
   PARTICLES
   ============================================================ */

const particles = [];


function burst(
  position,
  color,
  count = 14,
  power = 4
) {

  for (
    let i = 0;
    i < count;
    i++
  ) {

    const p =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.045,
          6,
          6
        ),

        basic(color)

      );


    p.position.copy(
      position
    );


    p.userData.life =
      0.3 +
      Math.random() *
      0.4;


    p.userData.v =
      new THREE.Vector3(

        (Math.random() - 0.5) *
          power,

        Math.random() *
          power,

        (Math.random() - 0.5) *
          power

      );


    scene.add(p);

    particles.push(p);

  }

}


function updateParticles(dt) {

  for (
    let i = particles.length - 1;
    i >= 0;
    i--
  ) {

    const p =
      particles[i];


    p.userData.life -=
      dt;


    p.userData.v.y -=
      12 * dt;


    p.position.addScaledVector(
      p.userData.v,
      dt
    );


    if (
      p.userData.life <= 0
    ) {

      scene.remove(p);

      p.geometry.dispose();

      p.material.dispose();

      particles.splice(
        i,
        1
      );

    }

  }

}


/* ============================================================
   MODEL HELPERS
   ============================================================ */

function capsule(
  radius,
  length,
  material
) {

  const mesh =
    new THREE.Mesh(

      new THREE.CapsuleGeometry(
        radius,
        length,
        6,
        12
      ),

      material

    );


  mesh.castShadow =
    true;


  return mesh;

}


function addBox(
  parent,
  size,
  position,
  material
) {

  const mesh =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        ...size
      ),

      material

    );


  mesh.position.set(
    ...position
  );


  mesh.castShadow =
    true;


  parent.add(
    mesh
  );


  return mesh;

}


/* ============================================================
   FIGHTER CLASS
   ============================================================ */

class Fighter {

  constructor(
    name,
    color,
    accent,
    playerControlled
  ) {

    this.name =
      name;

    this.color =
      color;

    this.accent =
      accent;

    this.playerControlled =
      playerControlled;


    this.group =
      new THREE.Group();


    this.body =
      new THREE.Group();


    this.group.add(
      this.body
    );


    this.health =
      MAX_HEALTH;

    this.vitality =
      MAX_VITALITY;

    this.fury =
      0;


    this.damageDone =
      0;

    this.furyUsed =
      0;


    this.grounded =
      true;


    this.velocity =
      new THREE.Vector3();


    this.facing =
      playerControlled
        ? 1
        : -1;


    this.blocking =
      false;


    this.attacking =
      false;


    this.attack =
      null;


    this.attackTime =
      0;


    this.hitConfirmed =
      false;


    this.hitStun =
      0;


    this.dashTime =
      0;


    this.invincible =
      false;


    this.comboStep =
      0;


    this.comboTimer =
      0;


    this.queuedAttack =
      null;


    this.moveBlend =
      0;


    this.createModel();


    scene.add(
      this.group
    );

  }


  /* ==========================================================
     CREATE 3D CHARACTER
     ========================================================== */

  createModel() {

    const skin =
      mat(
        0xc88968,
        0.05,
        0.72
      );


    const suit =
      mat(
        this.color,
        0.35,
        0.42
      );


    const accent =
      mat(
        this.accent,
        0.55,
        0.3
      );


    const dark =
      mat(
        0x10151b,
        0.4,
        0.38
      );


    const glow =
      basic(
        this.accent
      );


    /* TORSO */

    this.torso =
      addBox(

        this.body,

        [
          1.08,
          1.35,
          0.62
        ],

        [
          0,
          2.55,
          0
        ],

        suit

      );


    /* WAIST */

    this.waist =
      addBox(

        this.body,

        [
          0.76,
          0.34,
          0.56
        ],

        [
          0,
          1.83,
          0
        ],

        dark

      );


    /* NECK */

    this.neck =
      new THREE.Mesh(

        new THREE.CylinderGeometry(
          0.18,
          0.2,
          0.28,
          12
        ),

        skin

      );


    this.neck.position.set(
      0,
      3.34,
      0
    );


    this.neck.castShadow =
      true;


    this.body.add(
      this.neck
    );


    /* HEAD */

    this.head =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.43,
          18,
          14
        ),

        skin

      );


    this.head.position.set(
      0,
      3.82,
      0
    );


    this.head.castShadow =
      true;


    this.body.add(
      this.head
    );


    /* HAIR */

    this.hair =
      addBox(

        this.body,

        [
          0.62,
          0.18,
          0.48
        ],

        [
          0,
          4.16,
          -0.02
        ],

        dark

      );


    /* VISOR */

    this.visor =
      addBox(

        this.body,

        [
          0.58,
          0.14,
          0.08
        ],

        [
          0,
          3.83,
          0.40
        ],

        dark

      );


    /* CHEST ARMOR */

    this.chest =
      addBox(

        this.body,

        [
          0.7,
          0.36,
          0.67
        ],

        [
          0,
          2.72,
          0.33
        ],

        accent

      );


    /* CHEST EMBLEM */

    const emblem =
      new THREE.Mesh(

        new THREE.TorusGeometry(
          0.16,
          0.045,
          8,
          20
        ),

        glow

      );


    emblem.position.set(
      0,
      2.72,
      0.68
    );


    emblem.rotation.x =
      Math.PI / 2;


    this.body.add(
      emblem
    );


    /* ARMS */

    this.buildArm(
      "left",
      -0.7,
      suit,
      accent
    );


    this.buildArm(
      "right",
      0.7,
      suit,
      accent
    );


    /* LEGS */

    this.buildLeg(
      "left",
      -0.3,
      dark,
      accent
    );


    this.buildLeg(
      "right",
      0.3,
      dark,
      accent
    );


    this.resetPose();

  }


  /* ==========================================================
     ARM
     ========================================================== */

  buildArm(
    side,
    x,
    suit,
    accent
  ) {

    const arm =
      this[
        side + "Arm"
      ] =
      new THREE.Group();


    arm.position.set(
      x,
      3.05,
      0
    );


    this.body.add(
      arm
    );


    arm.rotation.z =
      side === "left"
        ? 0.12
        : -0.12;


    const upper =
      capsule(
        0.19,
        0.52,
        suit
      );


    upper.position.y =
      -0.27;


    arm.add(
      upper
    );


    const fore =
      this[
        side + "Forearm"
      ] =
      new THREE.Group();


    fore.position.y =
      -0.55;


    arm.add(
      fore
    );


    const foreMesh =
      capsule(
        0.17,
        0.48,
        suit
      );


    foreMesh.position.y =
      -0.25;


    fore.add(
      foreMesh
    );


    const glove =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.2,
          12,
          10
        ),

        accent

      );


    glove.position.set(
      0,
      -0.56,
      0.02
    );


    glove.castShadow =
      true;


    fore.add(
      glove
    );


    this[
      side + "Glove"
    ] =
      glove;


    /* SHOULDER */

    const pad =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.25,
          12,
          8
        ),

        accent

      );


    pad.scale.set(
      1,
      0.65,
      0.8
    );


    pad.position.set(
      0,
      0.02,
      0
    );


    pad.castShadow =
      true;


    arm.add(
      pad
    );

  }


  /* ==========================================================
     LEG
     ========================================================== */

  buildLeg(
    side,
    x,
    dark,
    accent
  ) {

    const leg =
      this[
        side + "Leg"
      ] =
      new THREE.Group();


    leg.position.set(
      x,
      1.65,
      0
    );


    this.body.add(
      leg
    );


    const thigh =
      capsule(
        0.25,
        0.68,
        dark
      );


    thigh.position.y =
      -0.36;


    leg.add(
      thigh
    );


    const shin =
      this[
        side + "Shin"
      ] =
      new THREE.Group();


    shin.position.y =
      -0.72;


    leg.add(
      shin
    );


    const shinMesh =
      capsule(
        0.21,
        0.62,
        dark
      );


    shinMesh.position.y =
      -0.31;


    shin.add(
      shinMesh
    );


    addBox(

      shin,

      [
        0.38,
        0.24,
        0.65
      ],

      [
        0,
        -0.69,
        0.12
      ],

      accent

    );

  }


  /* ==========================================================
     POSE
     ========================================================== */

  resetPose() {

    this.leftArm.rotation.set(
      0.05,
      0,
      0.16
    );


    this.rightArm.rotation.set(
      0.05,
      0,
      -0.16
    );


    this.leftForearm.rotation.set(
      0,
      0,
      0
    );


    this.rightForearm.rotation.set(
      0,
      0,
      0
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


    this.body.rotation.set(
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


  /* ==========================================================
     MOVEMENT
     ========================================================== */

  move(
    dx,
    dz,
    dt
  ) {

    if (
      this.attacking ||
      this.blocking ||
      this.hitStun > 0 ||
      this.dashTime > 0
    ) {

      return;

    }


    const length =
      Math.hypot(
        dx,
        dz
      );


    if (
      length < 0.01
    ) {

      this.moveBlend *=
        0.8;

      return;

    }


    dx /= length;
    dz /= length;


    const speed =
      this.playerControlled
        ? PLAYER_SPEED
        : ENEMY_SPEED;


    this.group.position.x +=
      dx *
      speed *
      dt;


    this.group.position.z +=
      dz *
      speed *
      dt;


    this.moveBlend =
      Math.min(
        1,
        this.moveBlend +
          dt * 7
      );

  }


  /* ==========================================================
     JUMP
     ========================================================== */

  jump() {

    if (
      !this.grounded ||
      this.attacking ||
      this.blocking ||
      this.hitStun > 0
    ) {

      return;

    }


    this.velocity.y =
      JUMP_FORCE;


    this.grounded =
      false;


    burst(

      this.group.position
        .clone()
        .setY(0.15),

      this.accent,

      8,

      2

    );

  }


  /* ==========================================================
     DASH
     ========================================================== */

  dash() {

    if (
      this.dashTime > 0 ||
      this.hitStun > 0 ||
      this.attacking
    ) {

      return;

    }


    this.dashTime =
      0.18;


    this.invincible =
      true;


    burst(

      this.group.position
        .clone()
        .setY(1),

      this.accent,

      10,

      3

    );

  }


  /* ==========================================================
     BLOCK
     ========================================================== */

  block(value) {

    if (
      this.attacking ||
      this.hitStun > 0
    ) {

      this.blocking =
        false;

      return;

    }


    this.blocking =
      value;

  }


  /* ==========================================================
     ATTACK
     ========================================================== */

  beginAttack(
    type,
    continueCombo = false
  ) {

    this.attacking =
      true;


    this.attack =
      type;


    this.hitConfirmed =
      false;


    this.attackTime =
      type === "punch"
        ? 0.40
        : type === "kick"
          ? 0.55
          : 1.05;


    if (
      !continueCombo
    ) {

      this.comboStep =

        this.comboTimer > 0 &&
        this.comboStep > 0

          ? Math.min(
              3,
              this.comboStep + 1
            )

          : 1;

    }

  }


  startAttack(type) {

    if (
      this.hitStun > 0 ||
      this.blocking
    ) {

      return;

    }


    /* QUEUE NEXT COMBO HIT */

    if (
      this.attacking
    ) {

      const duration =

        this.attack === "punch"
          ? 0.40
          : this.attack === "kick"
            ? 0.55
            : 1.05;


      const progress =
        1 -
        this.attackTime /
          duration;


      if (
        progress > 0.52 &&
        this.comboStep < 3
      ) {

        this.queuedAttack =
          type;


        this.comboStep =
          Math.min(
            3,
            this.comboStep + 1
          );

      }


      return;

    }


    this.beginAttack(
      type,
      false
    );

  }


  /* ==========================================================
     FURY
     ========================================================== */

  useFury() {

    const level =
      Math.floor(
        this.fury
      );


    if (
      level < 1 ||
      this.attacking ||
      this.blocking ||
      this.hitStun > 0
    ) {

      return;

    }


    this.fury =
      0;


    this.furyUsed +=
      level;


    this.comboStep =
      0;


    this.comboTimer =
      0;


    this.queuedAttack =
      null;


    this.beginAttack(
      "fury",
      true
    );


    furyFlash.classList.remove(
      "active"
    );


    void furyFlash.offsetWidth;


    furyFlash.classList.add(
      "active"
    );


    burst(

      this.group.position
        .clone()
        .setY(2.2),

      this.accent,

      40,

      7

    );


    updateHUD();

  }


  /* ==========================================================
     ATTACK UPDATE
     ========================================================== */

  updateAttack(
    dt,
    opponent
  ) {

    this.attackTime -=
      dt;


    const duration =

      this.attack === "punch"
        ? 0.40
        : this.attack === "kick"
          ? 0.55
          : 1.05;


    const progress =

      1 -
      this.attackTime /
        duration;


    if (
      !this.hitConfirmed &&
      progress > 0.30 &&
      progress < 0.72
    ) {

      this.hitConfirmed =
        true;


      const distance =
        this.group.position
          .distanceTo(
            opponent.group.position
          );


      const range =

        this.attack === "kick"
          ? 2.25
          : this.attack === "fury"
            ? 3.4
            : 1.75;


      if (
        distance <= range &&
        Math.abs(
          opponent.group.position.y -
          this.group.position.y
        ) < 1.3
      ) {

        let damage =

          this.attack === "punch"
            ? 7
            : this.attack === "kick"
              ? 10
              : 18 +
                this.furyUsed * 5;


        /* THIRD HIT BONUS */

        if (
          this.playerControlled &&
          this.attack !== "fury" &&
          this.comboStep === 3
        ) {

          damage += 7;

        }


        opponent.takeDamage(
          damage,
          this
        );


        if (
          this.playerControlled &&
          this.comboStep >= 2
        ) {

          showCombo(
            this.comboStep
          );

        }


        burst(

          opponent.group.position
            .clone()
            .setY(2.4),

          opponent.blocking
            ? 0xb76cff
            : 0xffc247,

          opponent.blocking
            ? 8
            : 16,

          4.5

        );

      }

    }


    if (
      this.attackTime <= 0
    ) {

      this.attacking =
        false;


      this.attack =
        null;


      this.attackTime =
        0;


      this.body.scale.set(
        1,
        1,
        1
      );


      /* CONTINUE COMBO */

      if (
        this.queuedAttack
      ) {

        const next =
          this.queuedAttack;


        this.queuedAttack =
          null;


        this.beginAttack(
          next,
          true
        );

      }

    }

  }


  /* ==========================================================
     DAMAGE
     ========================================================== */

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


    let actual =
      damage;


    if (
      this.blocking
    ) {

      actual *= 0.2;


      this.vitality =
        Math.max(
          0,
          this.vitality -
            damage * 0.10
        );

    }

    else {

      this.vitality =
        Math.max(
          0,
          this.vitality -
            damage * 0.07
        );


      this.hitStun =
        0.18;


      this.velocity.copy(

        new THREE.Vector3(
          attacker.facing * 2.2,
          0,
          0
        )

      );


      this.comboTimer =
        COMBO_WINDOW;

    }


    this.health =
      Math.max(
        0,
        this.health -
          actual
      );


    attacker.damageDone +=
      actual;


    if (
      attacker.playerControlled
    ) {

      attacker.comboTimer =
        COMBO_WINDOW;


      game.maxCombo =
        Math.max(
          game.maxCombo,
          attacker.comboStep
        );


      game.totalDamage +=
        actual;


      gainFury(
        attacker,
        actual
      );


      showDamage(
        actual
      );

    }


    game.cameraShake =
      Math.min(
        0.28,
        game.cameraShake +
          0.10
      );


    updateHUD();


    if (
      this.health <= 0
    ) {

      this.health =
        0;


      checkWinner();

    }

  }


  /* ==========================================================
     PHYSICS
     ========================================================== */

  physics(dt) {

    if (
      !this.grounded
    ) {

      this.velocity.y -=
        GRAVITY * dt;


      this.group.position.y +=
        this.velocity.y *
        dt;


      if (
        this.group.position.y <= 0
      ) {

        this.group.position.y =
          0;


        this.velocity.y =
          0;


        this.grounded =
          true;

      }

    }


    if (
      this.hitStun > 0
    ) {

      this.group.position.x +=
        this.velocity.x *
        dt;


      this.velocity.x *=
        Math.pow(
          0.01,
          dt
        );

    }

  }


  /* ==========================================================
     FACE OPPONENT
     ========================================================== */

  faceOpponent(
    opponent
  ) {

    const dx =
      opponent.group.position.x -
      this.group.position.x;


    const dz =
      opponent.group.position.z -
      this.group.position.z;


    if (
      Math.abs(dx) +
      Math.abs(dz) <
      0.01
    ) {

      return;

    }


    this.facing =
      dx >= 0
        ? 1
        : -1;


    this.group.rotation.y =
      Math.atan2(
        dx,
        dz
      ) -
      Math.PI / 2;

  }


  /* ==========================================================
     ANIMATION
     ========================================================== */

  animate() {

    const time =
      performance.now() *
      0.008;


    const bob =
      Math.sin(time) *
      0.025;


    if (
      this.hitStun > 0
    ) {

      this.body.rotation.z =
        0.22 *
        this.facing;

      return;

    }


    this.body.rotation.z =
      0;


    this.body.position.y =
      bob;


    /* BLOCK */

    if (
      this.blocking
    ) {

      this.leftArm.rotation.x =
        -0.8;

      this.rightArm.rotation.x =
        -0.8;

      this.leftArm.rotation.z =
        0.65;

      this.rightArm.rotation.z =
        -0.65;

      return;

    }


    /* ATTACK */

    if (
      this.attacking
    ) {

      const duration =

        this.attack === "punch"
          ? 0.40
          : this.attack === "kick"
            ? 0.55
            : 1.05;


      const progress =
        THREE.MathUtils.clamp(

          1 -
          this.attackTime /
            duration,

          0,
          1

        );


      const swing =
        Math.sin(
          progress *
          Math.PI
        );


      /* PUNCH */

      if (
        this.attack ===
        "punch"
      ) {

        if (
          this.facing === 1
        ) {

          this.rightArm.rotation.x =
            -1.65 *
            swing;


          this.rightForearm.rotation.x =
            -0.35 *
            swing;

        }

        else {

          this.leftArm.rotation.x =
            -1.65 *
            swing;


          this.leftForearm.rotation.x =
            -0.35 *
            swing;

        }

      }


      /* KICK */

      else if (
        this.attack ===
        "kick"
      ) {

        if (
          this.facing === 1
        ) {

          this.rightLeg.rotation.x =
            -1.35 *
            swing;

        }

        else {

          this.leftLeg.rotation.x =
            -1.35 *
            swing;

        }

      }


      /* FURY */

      else {

        const pulse =
          1 +
          Math.sin(
            time * 4
          ) *
          0.08;


        this.body.scale.set(
          pulse,
          pulse,
          pulse
        );


        this.leftArm.rotation.x =
          -1.35;


        this.rightArm.rotation.x =
          -1.35;

      }


      return;

    }


    /* WALK */

    const walk =
      Math.sin(
        performance.now() *
        0.012
      ) *
      0.45 *
      this.moveBlend;


    this.leftArm.rotation.x =
      walk;


    this.rightArm.rotation.x =
      -walk;


    this.leftLeg.rotation.x =
      -walk * 0.65;


    this.rightLeg.rotation.x =
      walk * 0.65;

  }


  /* ==========================================================
     UPDATE
     ========================================================== */

  update(
    dt,
    opponent
  ) {

    if (
      this.hitStun > 0
    ) {

      this.hitStun =
        Math.max(
          0,
          this.hitStun - dt
        );

    }


    /* DASH */

    if (
      this.dashTime > 0
    ) {

      this.dashTime -=
        dt;


      this.invincible =
        true;


      let dx = 0;
      let dz = 0;


      if (
        this.playerControlled
      ) {

        dx =
          (input.right ? 1 : 0) -
          (input.left ? 1 : 0);


        dz =
          (input.down ? 1 : 0) -
          (input.up ? 1 : 0);

      }


      if (
        !this.playerControlled ||
        Math.abs(dx) +
        Math.abs(dz) < 0.1
      ) {

        dx =
          this.facing;

        dz =
          0;

      }


      const length =
        Math.hypot(
          dx,
          dz
        ) || 1;


      this.group.position.x +=
        (dx / length) *
        13 *
        dt;


      this.group.position.z +=
        (dz / length) *
        13 *
        dt;

    }

    else {

      this.invincible =
        false;

    }


    if (
      this.attacking
    ) {

      this.updateAttack(
        dt,
        opponent
      );

    }


    this.physics(dt);


    this.faceOpponent(
      opponent
    );


    this.limit();


    this.animate();


    if (
      this.comboTimer > 0
    ) {

      this.comboTimer -=
        dt;

    }

    else {

      this.comboStep =
        0;

    }

  }


  /* ==========================================================
     ARENA LIMIT
     ========================================================== */

  limit() {

    this.group.position.x =
      THREE.MathUtils.clamp(

        this.group.position.x,

        -ARENA_X,
        ARENA_X

      );


    this.group.position.z =
      THREE.MathUtils.clamp(

        this.group.position.z,

        -ARENA_Z,
        ARENA_Z

      );

  }

}


/* ============================================================
   CREATE BOTH FIGHTERS
   ============================================================ */

const player =
  new Fighter(

    "IRON FURY",

    0x1d4053,

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


player.group.position.set(
  -3.8,
  0,
  0
);


enemy.group.position.set(
  3.8,
  0,
  0
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

      Math.round(

        (
          fighter.fury +
          (
            damage >= 8
              ? 0.16
              : 0.10
          )
        ) *
        10

      ) / 10

    );

}


/* ============================================================
   COMBO DISPLAY
   ============================================================ */

function showCombo(
  number
) {

  comboNumber.textContent =
    number;


  comboCounter.classList.add(
    "visible"
  );

}


/* ============================================================
   DAMAGE DISPLAY
   ============================================================ */

function showDamage(
  amount
) {

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
   PLAYER UPDATE
   ============================================================ */

function updatePlayer(dt) {

  let x =
    stick.x +
    (input.right ? 1 : 0) -
    (input.left ? 1 : 0);


  let z =
    -stick.y +
    (input.down ? 1 : 0) -
    (input.up ? 1 : 0);


  x =
    THREE.MathUtils.clamp(
      x,
      -1,
      1
    );


  z =
    THREE.MathUtils.clamp(
      z,
      -1,
      1
    );


  player.move(
    x,
    z,
    dt
  );

}


/* ============================================================
   ENEMY AI
   ============================================================ */

let aiTimer =
  0;


function updateEnemy(dt) {

  aiTimer -=
    dt;


  if (
    aiTimer > 0
  ) {

    return;

  }


  aiTimer =
    0.16 +
    Math.random() *
    0.25;


  const dx =
    player.group.position.x -
    enemy.group.position.x;


  const dz =
    player.group.position.z -
    enemy.group.position.z;


  const distance =
    Math.hypot(
      dx,
      dz
    );


  if (
    distance > 2.15
  ) {

    enemy.move(
      dx,
      dz,
      dt * 2.1
    );

    return;

  }


  const random =
    Math.random();


  if (
    enemy.fury >= 1 &&
    random < 0.14
  ) {

    enemy.useFury();

  }

  else if (
    random < 0.46
  ) {

    enemy.startAttack(
      "punch"
    );

  }

  else if (
    random < 0.72
  ) {

    enemy.startAttack(
      "kick"
    );

  }

  else {

    enemy.block(
      true
    );

  }


  if (
    enemy.blocking
  ) {

    setTimeout(
      () => {

        enemy.block(
          false
        );

      },
      300
    );

  }

}


/* ============================================================
   CAMERA
   ============================================================ */

function updateCamera() {

  const center =
    player.group.position
      .clone()
      .add(
        enemy.group.position
      )
      .multiplyScalar(
        0.5
      );


  const distance =
    player.group.position
      .distanceTo(
        enemy.group.position
      );


  const targetZ =
    THREE.MathUtils.clamp(

      12 +
      distance *
      0.45,

      11.5,
      16

    );


  let shakeX = 0;
  let shakeY = 0;


  if (
    game.cameraShake >
    0.01
  ) {

    shakeX =
      (
        Math.random() -
        0.5
      ) *
      game.cameraShake;


    shakeY =
      (
        Math.random() -
        0.5
      ) *
      game.cameraShake;


    game.cameraShake *=
      0.86;

  }


  camera.position.x +=
    (
      center.x +
      shakeX -
      camera.position.x
    ) *
    0.08;


  camera.position.y +=
    (
      5.1 +
      center.y +
      shakeY -
      camera.position.y
    ) *
    0.08;


  camera.position.z +=
    (
      targetZ -
      camera.position.z
    ) *
    0.08;


  camera.lookAt(
    center.x,
    2.25,
    0
  );

}


/* ============================================================
   HUD
   ============================================================ */

function updateHUD() {

  playerHealth.style.width =
    player.health +
    "%";


  enemyHealth.style.width =
    enemy.health +
    "%";


  playerVitality.style.width =
    player.vitality +
    "%";


  enemyVitality.style.width =
    enemy.vitality +
    "%";


  playerHealthText.textContent =
    Math.ceil(
      player.health
    );


  enemyHealthText.textContent =
    Math.ceil(
      enemy.health
    );


  playerVitalityText.textContent =
    Math.ceil(
      player.vitality
    );


  enemyVitalityText.textContent =
    Math.ceil(
      enemy.vitality
    );


  playerFuryText.textContent =
    Math.floor(
      player.fury
    ) +
    " / 3";


  enemyFuryText.textContent =
    Math.floor(
      enemy.fury
    ) +
    " / 3";


  roundNumber.textContent =
    "ROUND 1";


  timer.textContent =
    Math.max(
      0,
      Math.ceil(
        game.time
      )
    );


  [
    fury1,
    fury2,
    fury3
  ].forEach(

    (element, index) => {

      element.classList.toggle(

        "active",

        index <
        Math.floor(
          player.fury
        )

      );


      element.classList.toggle(

        "ready",

        Math.floor(
          player.fury
        ) === 3

      );

    }

  );


  [
    enemyFury1,
    enemyFury2,
    enemyFury3
  ].forEach(

    (element, index) => {

      element.classList.toggle(

        "active",

        index <
        Math.floor(
          enemy.fury
        )

      );


      element.classList.toggle(

        "ready",

        Math.floor(
          enemy.fury
        ) === 3

      );

    }

  );


  furyButton.classList.toggle(

    "ready",

    player.fury >= 1

  );


  comboCounter.classList.toggle(

    "visible",

    player.comboTimer > 0 &&
    player.comboStep > 0

  );


  comboNumber.textContent =
    player.comboStep;

}


/* ============================================================
   ROUND MESSAGE
   ============================================================ */

function showMessage(
  main,
  sub,
  milliseconds = 900
) {

  message.textContent =
    main;


  subMessage.textContent =
    sub;


  message.classList.add(
    "show"
  );


  subMessage.classList.add(
    "show"
  );


  setTimeout(
    () => {

      message.classList.remove(
        "show"
      );


      subMessage.classList.remove(
        "show"
      );

    },
    milliseconds
  );

}


/* ============================================================
   WINNER
   ============================================================ */

function checkWinner() {

  if (
    game.ended
  ) {

    return;

  }


  if (
    enemy.health <= 0
  ) {

    finishOverlay.classList.remove(
      "hidden"
    );


    finishTitle.textContent =
      "FURY FINISH";


    finishSubtitle.textContent =
      "THE RIVAL IS DOWN";

  }


  else if (
    player.health <= 0
  ) {

    endGame(
      false,
      "THE RIVAL WINS"
    );

  }

}


/* ============================================================
   FURY FINISH
   ============================================================ */

finishButton.addEventListener(

  "click",

  () => {

    finishOverlay.classList.add(
      "hidden"
    );


    game.ended =
      true;


    burst(

      enemy.group.position
        .clone()
        .setY(2.5),

      0x28d7ff,

      60,

      8

    );


    showMessage(
      "FURY FINISH",
      "IRON FURY",
      1200
    );


    setTimeout(
      () => {

        endGame(
          true,
          "FURY FINISH"
        );

      },
      900
    );

  }

);


/* ============================================================
   END GAME
   ============================================================ */

function endGame(
  victory,
  description
) {

  game.ended =
    true;


  resultTitle.textContent =
    victory
      ? "VICTORY"
      : "DEFEAT";


  resultDescription.textContent =
    description;


  resultCombo.textContent =
    game.maxCombo;


  resultDamage.textContent =
    Math.round(
      game.totalDamage
    );


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

  game.running =
    true;


  game.paused =
    false;


  game.ended =
    false;


  game.time =
    ROUND_TIME;


  game.maxCombo =
    0;


  game.totalDamage =
    0;


  game.cameraShake =
    0;


  aiTimer =
    0;


  for (
    const fighter of
    [player, enemy]
  ) {

    fighter.health =
      MAX_HEALTH;


    fighter.vitality =
      MAX_VITALITY;


    fighter.fury =
      0;


    fighter.damageDone =
      0;


    fighter.furyUsed =
      0;


    fighter.grounded =
      true;


    fighter.velocity.set(
      0,
      0,
      0
    );


    fighter.blocking =
      false;


    fighter.attacking =
      false;


    fighter.attack =
      null;


    fighter.attackTime =
      0;


    fighter.hitStun =
      0;


    fighter.dashTime =
      0;


    fighter.invincible =
      false;


    fighter.comboStep =
      0;


    fighter.comboTimer =
      0;


    fighter.queuedAttack =
      null;


    fighter.group.rotation.set(
      0,
      0,
      0
    );


    fighter.resetPose();

  }


  player.group.position.set(
    -3.8,
    0,
    0
  );


  enemy.group.position.set(
    3.8,
    0,
    0
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


  resetStick();


  updateHUD();


  showMessage(
    "ROUND 1",
    "FIGHT",
    1100
  );

}


/* ============================================================
   PAUSE
   ============================================================ */

function setPaused(
  value
) {

  if (
    game.ended
  ) {

    return;

  }


  game.paused =
    value;


  pauseMenu.classList.toggle(
    "hidden",
    !value
  );

}


pauseButton.addEventListener(
  "click",
  () => {

    setPaused(
      !game.paused
    );

  }
);


resumeButton.addEventListener(
  "click",
  () => {

    setPaused(
      false
    );

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
   MOBILE BUTTONS
   ============================================================ */

function bindPress(
  element,
  down,
  up = () => {}
) {

  const release =
    () => {

      element.classList.remove(
        "pressed"
      );

      up();

    };


  element.addEventListener(

    "pointerdown",

    (event) => {

      event.preventDefault();

      element.setPointerCapture?.(
        event.pointerId
      );

      element.classList.add(
        "pressed"
      );

      down();

    },

    {
      passive: false
    }

  );


  element.addEventListener(

    "pointerup",

    (event) => {

      event.preventDefault();

      release();

    },

    {
      passive: false
    }

  );


  element.addEventListener(
    "pointercancel",
    release
  );


  element.addEventListener(
    "lostpointercapture",
    release
  );

}


bindPress(
  jumpButton,
  () => player.jump()
);


bindPress(
  dashButton,
  () => player.dash()
);


bindPress(
  punchButton,
  () => player.startAttack("punch")
);


bindPress(
  kickButton,
  () => player.startAttack("kick")
);


bindPress(
  blockButton,
  () => player.block(true),
  () => player.block(false)
);


bindPress(
  furyButton,
  () => player.useFury()
);


/* ============================================================
   KEYBOARD
   ============================================================ */

window.addEventListener(

  "keydown",

  (event) => {

    if (

      [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Space"
      ].includes(
        event.code
      )

    ) {

      event.preventDefault();

    }


    if (
      event.code === "ArrowLeft" ||
      event.code === "KeyA"
    ) {

      input.left =
        true;

    }


    if (
      event.code === "ArrowRight" ||
      event.code === "KeyD"
    ) {

      input.right =
        true;

    }


    if (
      event.code === "ArrowUp" ||
      event.code === "KeyW"
    ) {

      input.up =
        true;

    }


    if (
      event.code === "ArrowDown" ||
      event.code === "KeyS"
    ) {

      input.down =
        true;

    }


    if (
      event.repeat
    ) {

      return;

    }


    if (
      event.code === "Space"
    ) {

      player.jump();

    }


    if (
      event.code === "ShiftLeft"
    ) {

      player.dash();

    }


    if (
      event.code === "KeyJ"
    ) {

      player.startAttack(
        "punch"
      );

    }


    if (
      event.code === "KeyK"
    ) {

      player.startAttack(
        "kick"
      );

    }


    if (
      event.code === "KeyL"
    ) {

      player.block(
        true
      );

    }


    if (
      event.code === "KeyF"
    ) {

      player.useFury();

    }


    if (
      event.code === "Escape"
    ) {

      setPaused(
        !game.paused
      );

    }

  },

  {
    passive: false
  }

);


window.addEventListener(

  "keyup",

  (event) => {

    if (
      event.code === "ArrowLeft" ||
      event.code === "KeyA"
    ) {

      input.left =
        false;

    }


    if (
      event.code === "ArrowRight" ||
      event.code === "KeyD"
    ) {

      input.right =
        false;

    }


    if (
      event.code === "ArrowUp" ||
      event.code === "KeyW"
    ) {

      input.up =
        false;

    }


    if (
      event.code === "ArrowDown" ||
      event.code === "KeyS"
    ) {

      input.down =
        false;

    }


    if (
      event.code === "KeyL"
    ) {

      player.block(
        false
      );

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
    x -
    centerX;


  let dy =
    y -
    centerY;


  const radius =
    rect.width *
    0.34;


  const distance =
    Math.hypot(
      dx,
      dy
    );


  if (
    distance > radius
  ) {

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
    dx /
    radius;


  stick.y =
    dy /
    radius;


  joystickKnob.style.transform =

    "translate(" +

    "calc(-50% + " +
    dx +
    "px), " +

    "calc(-50% + " +
    dy +
    "px)" +

    ")";

}


function resetStick() {

  stick.active =
    false;


  stick.x =
    0;


  stick.y =
    0;


  joystickKnob.style.transform =
    "translate(-50%, -50%)";

}


joystick.addEventListener(

  "pointerdown",

  (event) => {

    event.preventDefault();


    stick.active =
      true;


    joystick.setPointerCapture?.(
      event.pointerId
    );


    updateStick(
      event.clientX,
      event.clientY
    );

  },

  {
    passive: false
  }

);


joystick.addEventListener(

  "pointermove",

  (event) => {

    if (
      !stick.active
    ) {

      return;

    }


    event.preventDefault();


    updateStick(
      event.clientX,
      event.clientY
    );

  },

  {
    passive: false
  }

);


joystick.addEventListener(
  "pointerup",
  resetStick
);


joystick.addEventListener(
  "pointercancel",
  resetStick
);


joystick.addEventListener(
  "lostpointercapture",
  resetStick
);


/* ============================================================
   TIMER
   ============================================================ */

function updateTimer(
  dt
) {

  game.time -=
    dt;


  if (
    game.time <= 0
  ) {

    game.time =
      0;


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


function loop(
  now
) {

  requestAnimationFrame(
    loop
  );


  const dt =
    Math.min(

      0.05,

      (
        now -
        previous
      ) /
      1000

    );


  previous =
    now;


  if (
    game.running &&
    !game.paused &&
    !game.ended
  ) {

    updatePlayer(
      dt
    );


    updateEnemy(
      dt
    );


    player.update(
      dt,
      enemy
    );


    enemy.update(
      dt,
      player
    );


    updateTimer(
      dt
    );


    updateHUD();

  }


  updateParticles(
    dt
  );


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

  loadingText.textContent =
    "BUILDING ARENA";


  let progress =
    0;


  const interval =
    setInterval(

      () => {

        progress +=
          20;


        loadingProgress.style.width =
          progress +
          "%";


        if (
          progress < 40
        ) {

          loadingText.textContent =
            "BUILDING ARENA";

        }

        else if (
          progress < 70
        ) {

          loadingText.textContent =
            "CREATING FIGHTERS";

        }

        else if (
          progress < 100
        ) {

          loadingText.textContent =
            "ARMING COMBOS";

        }

        else {

          clearInterval(
            interval
          );


          loadingText.textContent =
            "READY";


          setTimeout(

            () => {

              loadingScreen.classList.add(
                "hidden"
              );


              restartGame();

            },

            250

          );

        }

      },

      80

    );

}


/* ============================================================
   BOOT
   ============================================================ */

try {

  updateHUD();

  requestAnimationFrame(
    loop
  );

  initialize();

}

catch (error) {

  console.error(
    "IRON FURY ERROR:",
    error
  );


  loadingText.textContent =
    "ENGINE ERROR - CHECK CONSOLE";

}
