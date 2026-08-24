/* ============================================================
   FIGHTER
   IRON FURY - HERO MODEL SYSTEM v2
   ============================================================ */

class Fighter {

  constructor(
    name,
    color,
    accent,
    playerControlled
  ) {

    this.name = name;

    this.color = color;

    this.accent = accent;

    this.playerControlled =
      playerControlled;

    /*
      Character identity.

      Player = KAI
      Enemy  = ROCCO
    */

    this.characterType =
      playerControlled
        ? "KAI"
        : "ROCCO";

    this.group =
      new THREE.Group();

    this.health =
      MAX_HEALTH;

    this.vitality =
      MAX_VITALITY;

    this.fury = 0;

    this.combo = 0;

    this.comboTimer = 0;

    this.grounded = true;

    this.velocity =
      new THREE.Vector3();

    this.facing =
      playerControlled
        ? 1
        : -1;

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

    /*
      Animation state
    */

    this.animationClock = 0;

    this.breathClock = 0;

    this.stepClock = 0;

    this.createModel();

    scene.add(
      this.group
    );

  }


  /* ========================================================
     MATERIAL HELPERS
     ======================================================== */

  makeMat(
    color,
    roughness = 0.55,
    metalness = 0.15
  ) {

    return new THREE.MeshStandardMaterial({

      color: color,

      roughness: roughness,

      metalness: metalness

    });

  }


  /* ========================================================
     MODEL
     ======================================================== */

  createModel() {

    /*
      --------------------------------------------------------
      MATERIALS
      --------------------------------------------------------
    */

    const skin =
      this.makeMat(
        this.characterType === "KAI"
          ? 0xc98c6b
          : 0x9d654e,
        0.72,
        0.05
      );


    const skinDark =
      this.makeMat(
        this.characterType === "KAI"
          ? 0x9b5e49
          : 0x704333,
        0.78,
        0.02
      );


    const suit =
      this.makeMat(
        this.color,
        0.55,
        0.22
      );


    const accent =
      this.makeMat(
        this.accent,
        0.42,
        0.38
      );


    const dark =
      this.makeMat(
        0x11161b,
        0.48,
        0.35
      );


    const black =
      this.makeMat(
        0x07090c,
        0.42,
        0.28
      );


    const white =
      this.makeMat(
        0xe9eef2,
        0.35,
        0.08
      );


    const eyeColor =
      this.makeMat(
        this.characterType === "KAI"
          ? 0x111b25
          : 0x28150f,
        0.28,
        0.05
      );


    /*
      --------------------------------------------------------
      MAIN BODY GROUP
      --------------------------------------------------------
    */

    this.body =
      new THREE.Group();

    this.group.add(
      this.body
    );


    /*
      --------------------------------------------------------
      PELVIS
      --------------------------------------------------------
    */

    this.pelvis =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.95,
          0.48,
          0.62
        ),

        suit

      );

    this.pelvis.position.y =
      1.82;

    this.pelvis.castShadow = true;

    this.body.add(
      this.pelvis
    );


    /*
      --------------------------------------------------------
      TORSO
      --------------------------------------------------------
    */

    this.torso =
      new THREE.Mesh(

        new THREE.CylinderGeometry(
          0.42,
          0.57,
          1.35,
          12
        ),

        suit

      );

    this.torso.scale.z =
      0.82;

    this.torso.position.y =
      2.65;

    this.torso.castShadow = true;

    this.body.add(
      this.torso
    );


    /*
      --------------------------------------------------------
      CHEST ARMOR / SHIRT
      --------------------------------------------------------
    */

    this.chest =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.76,
          0.48,
          0.12
        ),

        accent

      );

    this.chest.position.set(
      0,
      2.83,
      0.47
    );

    this.chest.castShadow = true;

    this.body.add(
      this.chest
    );


    /*
      --------------------------------------------------------
      CHEST CENTER STRIP
      --------------------------------------------------------
    */

    const chestStrip =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.12,
          0.85,
          0.08
        ),

        dark

      );

    chestStrip.position.set(
      0,
      2.58,
      0.49
    );

    this.body.add(
      chestStrip
    );


    /*
      --------------------------------------------------------
      NECK
      --------------------------------------------------------
    */

    this.neck =
      new THREE.Mesh(

        new THREE.CylinderGeometry(
          0.20,
          0.23,
          0.34,
          12
        ),

        skin

      );

    this.neck.position.y =
      3.46;

    this.neck.castShadow = true;

    this.body.add(
      this.neck
    );


    /*
      --------------------------------------------------------
      HEAD
      --------------------------------------------------------
    */

    this.head =
      new THREE.Group();

    this.head.position.y =
      3.88;

    this.body.add(
      this.head
    );


    this.headMesh =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.43,
          20,
          16
        ),

        skin

      );

    this.headMesh.scale.set(
      0.92,
      1.05,
      0.92
    );

    this.headMesh.castShadow = true;

    this.head.add(
      this.headMesh
    );


    /*
      --------------------------------------------------------
      EARS
      --------------------------------------------------------
    */

    this.leftEar =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.09,
          10,
          8
        ),

        skinDark

      );

    this.rightEar =
      this.leftEar.clone();

    this.leftEar.position.set(
      -0.41,
      0,
      0
    );

    this.rightEar.position.set(
      0.41,
      0,
      0
    );

    this.head.add(
      this.leftEar,
      this.rightEar
    );


    /*
      --------------------------------------------------------
      NOSE
      --------------------------------------------------------
    */

    this.nose =
      new THREE.Mesh(

        new THREE.ConeGeometry(
          0.07,
          0.18,
          8
        ),

        skinDark

      );

    this.nose.rotation.x =
      Math.PI / 2;

    this.nose.position.set(
      0,
      -0.02,
      0.405
    );

    this.head.add(
      this.nose
    );


    /*
      --------------------------------------------------------
      EYES
      --------------------------------------------------------
    */

    this.leftEye =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.055,
          10,
          8
        ),

        eyeColor

      );

    this.rightEye =
      this.leftEye.clone();

    this.leftEye.position.set(
      -0.16,
      0.08,
      0.395
    );

    this.rightEye.position.set(
      0.16,
      0.08,
      0.395
    );

    this.head.add(
      this.leftEye,
      this.rightEye
    );


    /*
      --------------------------------------------------------
      EYEBROWS
      --------------------------------------------------------
    */

    this.leftBrow =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.15,
          0.035,
          0.035
        ),

        dark

      );

    this.rightBrow =
      this.leftBrow.clone();

    this.leftBrow.position.set(
      -0.16,
      0.17,
      0.405
    );

    this.rightBrow.position.set(
      0.16,
      0.17,
      0.405
    );

    this.leftBrow.rotation.z =
      -0.08;

    this.rightBrow.rotation.z =
      0.08;

    this.head.add(
      this.leftBrow,
      this.rightBrow
    );


    /*
      --------------------------------------------------------
      MOUTH / JAW
      --------------------------------------------------------
    */

    this.mouth =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.18,
          0.035,
          0.025
        ),

        skinDark

      );

    this.mouth.position.set(
      0,
      -0.19,
      0.405
    );

    this.head.add(
      this.mouth
    );


    /*
      --------------------------------------------------------
      HAIR
      --------------------------------------------------------
    */

    if (
      this.characterType === "KAI"
    ) {

      this.hair =
        new THREE.Mesh(

          new THREE.SphereGeometry(
            0.45,
            16,
            12
          ),

          black

        );

      this.hair.scale.set(
        1.0,
        0.52,
        0.98
      );

      this.hair.position.set(
        0,
        0.32,
        -0.02
      );

      this.hair.castShadow = true;

      this.head.add(
        this.hair
      );


      /*
        Kai hair spikes
      */

      for (
        let i = 0;
        i < 5;
        i++
      ) {

        const spike =
          new THREE.Mesh(

            new THREE.ConeGeometry(
              0.10,
              0.35,
              7
            ),

            black

          );

        spike.position.set(
          (i - 2) * 0.12,
          0.55 -
            Math.abs(i - 2) *
            0.035,
          0.02
        );

        spike.rotation.z =
          (i - 2) *
          0.15;

        this.head.add(
          spike
        );

      }

    } else {

      /*
        ------------------------------------------------------
        ROCCO HEAD STRUCTURE
        ------------------------------------------------------
      */

      const scalp =
        new THREE.Mesh(

          new THREE.SphereGeometry(
            0.435,
            18,
            14
          ),

          skin

        );

      scalp.scale.set(
        1,
        0.62,
        1
      );

      scalp.position.y =
        0.28;

      scalp.castShadow = true;

      this.head.add(
        scalp
      );


      /*
        Rocco beard
      */

      const beard =
        new THREE.Mesh(

          new THREE.SphereGeometry(
            0.31,
            14,
            10
          ),

          dark

        );

      beard.scale.set(
        0.95,
        0.58,
        0.5
      );

      beard.position.set(
        0,
        -0.17,
        0.25
      );

      this.head.add(
        beard
      );

    }


    /*
      --------------------------------------------------------
      SHOULDERS
      --------------------------------------------------------
    */

    this.leftShoulder =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.25,
          12,
          10
        ),

        suit

      );

    this.rightShoulder =
      this.leftShoulder.clone();

    this.leftShoulder.position.set(
      -0.58,
      3.10,
      0
    );

    this.rightShoulder.position.set(
      0.58,
      3.10,
      0
    );

    this.body.add(
      this.leftShoulder,
      this.rightShoulder
    );


    /*
      --------------------------------------------------------
      ARMS
      --------------------------------------------------------
    */

    this.leftArm =
      this.limb(
        0.16,
        0.58,
        suit
      );

    this.rightArm =
      this.limb(
        0.16,
        0.58,
        suit
      );


    this.leftArm.position.set(
      -0.70,
      3.02,
      0
    );

    this.rightArm.position.set(
      0.70,
      3.02,
      0
    );


    this.body.add(
      this.leftArm,
      this.rightArm
    );


    /*
      --------------------------------------------------------
      FOREARMS
      --------------------------------------------------------
    */

    this.leftForearm =
      this.limb(
        0.145,
        0.58,
        skin
      );

    this.rightForearm =
      this.limb(
        0.145,
        0.58,
        skin
      );


    this.leftForearm.position.y =
      -0.54;

    this.rightForearm.position.y =
      -0.54;


    this.leftArm.add(
      this.leftForearm
    );

    this.rightArm.add(
      this.rightForearm
    );


    /*
      --------------------------------------------------------
      GLOVES
      --------------------------------------------------------
    */

    this.leftFist =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.20,
          12,
          10
        ),

        dark

      );

    this.rightFist =
      this.leftFist.clone();


    this.leftFist.scale.set(
      1.0,
      0.82,
      1.12
    );

    this.rightFist.scale.copy(
      this.leftFist.scale
    );


    this.leftFist.position.y =
      -0.43;

    this.rightFist.position.y =
      -0.43;


    this.leftForearm.add(
      this.leftFist
    );

    this.rightForearm.add(
      this.rightFist
    );


    /*
      --------------------------------------------------------
      GLOVE ACCENT
      --------------------------------------------------------
    */

    const leftGloveBand =
      new THREE.Mesh(

        new THREE.TorusGeometry(
          0.145,
          0.025,
          6,
          12
        ),

        accent

      );

    const rightGloveBand =
      leftGloveBand.clone();


    leftGloveBand.rotation.x =
      Math.PI / 2;

    rightGloveBand.rotation.x =
      Math.PI / 2;


    leftGloveBand.position.y =
      -0.20;

    rightGloveBand.position.y =
      -0.20;


    this.leftForearm.add(
      leftGloveBand
    );

    this.rightForearm.add(
      rightGloveBand
    );


    /*
      --------------------------------------------------------
      BELT
      --------------------------------------------------------
    */

    this.belt =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          1.02,
          0.13,
          0.68
        ),

        dark

      );

    this.belt.position.y =
      1.98;

    this.body.add(
      this.belt
    );


    /*
      --------------------------------------------------------
      BELT CENTER
      --------------------------------------------------------
    */

    const beltCenter =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.20,
          0.20,
          0.08
        ),

        accent

      );

    beltCenter.position.set(
      0,
      1.98,
      0.37
    );

    this.body.add(
      beltCenter
    );


    /*
      --------------------------------------------------------
      LEGS
      --------------------------------------------------------
    */

    this.leftLeg =
      this.limb(
        0.23,
        0.78,
        suit
      );

    this.rightLeg =
      this.limb(
        0.23,
        0.78,
        suit
      );


    this.leftLeg.position.set(
      -0.30,
      1.70,
      0
    );

    this.rightLeg.position.set(
      0.30,
      1.70,
      0
    );


    this.body.add(
      this.leftLeg,
      this.rightLeg
    );


    /*
      --------------------------------------------------------
      LOWER LEGS
      --------------------------------------------------------
    */

    this.leftShin =
      this.limb(
        0.19,
        0.78,
        dark
      );

    this.rightShin =
      this.limb(
        0.19,
        0.78,
        dark
      );


    this.leftShin.position.y =
      -0.72;

    this.rightShin.position.y =
      -0.72;


    this.leftLeg.add(
      this.leftShin
    );

    this.rightLeg.add(
      this.rightShin
    );


    /*
      --------------------------------------------------------
      KNEES
      --------------------------------------------------------
    */

    this.leftKnee =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.16,
          10,
          8
        ),

        accent

      );

    this.rightKnee =
      this.leftKnee.clone();


    this.leftKnee.position.y =
      -0.48;

    this.rightKnee.position.y =
      -0.48;


    this.leftLeg.add(
      this.leftKnee
    );

    this.rightLeg.add(
      this.rightKnee
    );


    /*
      --------------------------------------------------------
      FEET
      --------------------------------------------------------
    */

    this.leftFoot =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.38,
          0.20,
          0.70
        ),

        dark

      );

    this.rightFoot =
      this.leftFoot.clone();


    this.leftFoot.position.set(
      0,
      -0.56,
      0.17
    );

    this.rightFoot.position.set(
      0,
      -0.56,
      0.17
    );


    this.leftFoot.castShadow = true;

    this.rightFoot.castShadow = true;


    this.leftShin.add(
      this.leftFoot
    );

    this.rightShin.add(
      this.rightFoot
    );


    /*
      --------------------------------------------------------
      FOOT ACCENTS
      --------------------------------------------------------
    */

    const leftSole =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.40,
          0.07,
          0.72
        ),

        black

      );

    const rightSole =
      leftSole.clone();


    leftSole.position.y =
      -0.10;

    rightSole.position.y =
      -0.10;


    this.leftFoot.add(
      leftSole
    );

    this.rightFoot.add(
      rightSole
    );


    /*
      --------------------------------------------------------
      CHARACTER-SPECIFIC CLOTHING
      --------------------------------------------------------
    */

    if (
      this.characterType === "KAI"
    ) {

      /*
        Kai martial-arts waist cloth
      */

      this.waistCloth =
        new THREE.Mesh(

          new THREE.BoxGeometry(
            0.76,
            0.52,
            0.08
          ),

          suit

        );

      this.waistCloth.position.set(
        0,
        1.73,
        0.36
      );

      this.body.add(
        this.waistCloth
      );


      /*
        Side cloth pieces
      */

      this.leftCloth =
        new THREE.Mesh(

          new THREE.BoxGeometry(
            0.16,
            0.62,
            0.05
          ),

          accent

        );

      this.rightCloth =
        this.leftCloth.clone();


      this.leftCloth.position.set(
        -0.28,
        1.65,
        0.40
      );

      this.rightCloth.position.set(
        0.28,
        1.65,
        0.40
      );


      this.leftCloth.rotation.z =
        -0.10;

      this.rightCloth.rotation.z =
        0.10;


      this.body.add(
        this.leftCloth,
        this.rightCloth
      );

    } else {

      /*
        ------------------------------------------------------
        ROCCO HEAVY FIGHTER DETAILS
        ------------------------------------------------------
      */

      const shoulderArmor =
        this.makeMat(
          0x242a30,
          0.42,
          0.48
        );


      this.leftArmor =
        new THREE.Mesh(

          new THREE.SphereGeometry(
            0.28,
            12,
            10
          ),

          shoulderArmor

        );

      this.rightArmor =
        this.leftArmor.clone();


      this.leftArmor.position.set(
        -0.61,
        3.08,
        0
      );

      this.rightArmor.position.set(
        0.61,
        3.08,
        0
      );


      this.body.add(
        this.leftArmor,
        this.rightArmor
      );


      /*
        Rocco chest plate
      */

      this.armorChest =
        new THREE.Mesh(

          new THREE.BoxGeometry(
            0.82,
            0.62,
            0.13
          ),

          shoulderArmor

        );

      this.armorChest.position.set(
        0,
        2.73,
        0.49
      );

      this.body.add(
        this.armorChest
      );


      /*
        Arm bands
      */

      const bandMaterial =
        this.makeMat(
          0x1a1d20,
          0.45,
          0.55
        );


      this.leftBand =
        new THREE.Mesh(

          new THREE.TorusGeometry(
            0.18,
            0.035,
            7,
            12
          ),

          bandMaterial

        );

      this.rightBand =
        this.leftBand.clone();


      this.leftBand.rotation.x =
        Math.PI / 2;

      this.rightBand.rotation.x =
        Math.PI / 2;


      this.leftBand.position.y =
        -0.28;

      this.rightBand.position.y =
        -0.28;


      this.leftArm.add(
        this.leftBand
      );

      this.rightArm.add(
        this.rightBand
      );

    }


    /*
      --------------------------------------------------------
      SHADOWS
      --------------------------------------------------------
    */

    this.body.traverse(
      object => {

        if (
          object.isMesh
        ) {

          object.castShadow = true;

        }

      }
    );


    /*
      --------------------------------------------------------
      INITIAL POSE
      --------------------------------------------------------
    */

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
          radius * 1.05,
          length,
          10
        ),

        material

      );


    mesh.position.y =
      -length / 2;


    mesh.castShadow = true;


    pivot.add(
      mesh
    );


    return pivot;

  }


  /* ========================================================
     RESET POSE
     ======================================================== */

  resetPose() {

    /*
      Body
    */

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


    /*
      Torso
    */

    this.torso.rotation.set(
      0,
      0,
      0
    );


    /*
      Head
    */

    this.head.rotation.set(
      0,
      0,
      0
    );


    /*
      Arms
    */

    this.leftArm.rotation.set(
      -0.18,
      0,
      0.28
    );

    this.rightArm.rotation.set(
      -0.18,
      0,
      -0.28
    );


    /*
      Forearms
    */

    this.leftForearm.rotation.set(
      -0.72,
      0,
      0.05
    );

    this.rightForearm.rotation.set(
      -0.72,
      0,
      -0.05
    );


    /*
      Legs
    */

    this.leftLeg.rotation.set(
      0.03,
      0,
      0
    );

    this.rightLeg.rotation.set(
      -0.03,
      0,
      0
    );


    this.leftShin.rotation.set(
      0.03,
      0,
      0
    );

    this.rightShin.rotation.set(
      -0.03,
      0,
      0
    );


    /*
      Feet
    */

    this.leftFoot.rotation.set(
      0,
      0,
      0
    );

    this.rightFoot.rotation.set(
      0,
      0,
      0
    );

  }


  /* ========================================================
     UPDATE
     ======================================================== */

  update(
    dt,
    opponent
  ) {

    this.animationClock +=
      dt;

    this.breathClock +=
      dt;


    if (
      this.hitStun > 0
    ) {

      this.hitStun -= dt;

      this.blocking = false;

      this.physics(dt);

      this.animateHit();

      return;

    }


    if (
      this.dashTime > 0
    ) {

      this.dashTime -= dt;

      this.group.position.x +=
        this.facing *
        13 *
        dt;

      this.invincible = true;

    } else {

      this.invincible = false;

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

    this.animate();

    this.limitPosition();

    this.comboTimer -=
      dt;


    if (
      this.comboTimer <= 0
    ) {

      this.combo = 0;

    }

  }


  /* ========================================================
     PHYSICS
     ======================================================== */

  physics(dt) {

    if (
      !this.grounded
    ) {

      this.velocity.y -=
        GRAVITY * dt;

      this.group.position.y +=
        this.velocity.y * dt;


      if (
        this.group.position.y <=
        0
      ) {

        this.group.position.y =
          0;

        this.velocity.y =
          0;

        this.grounded =
          true;

      }

    }

  }


  /* ========================================================
     MOVEMENT
     ======================================================== */

  move(
    direction,
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


    const speed =
      this.playerControlled
        ? PLAYER_SPEED
        : ENEMY_SPEED;


    this.group.position.x +=
      direction *
      speed *
      dt;


    if (
      direction !== 0
    ) {

      this.stepClock +=
        dt *
        9;

    }

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

    this.grounded =
      false;

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


    this.dashTime =
      0.18;


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

  block(
    value
  ) {

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


  /* ========================================================
     ATTACK
     ======================================================== */

  startAttack(
    type
  ) {

    if (
      this.attacking ||
      this.blocking ||
      this.hitStun > 0
    ) {

      return;

    }


    this.attacking =
      true;

    this.attack =
      type;

    this.hitConfirmed =
      false;


    this.attackTime =
      type === "punch"
        ? 0.42
        : type === "kick"
          ? 0.55
          : 1.15;

  }


  /* ========================================================
     ATTACK UPDATE
     ======================================================== */

  updateAttack(
    dt,
    opponent
  ) {

    this.attackTime -=
      dt;


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

      this.hitConfirmed =
        true;


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
          this.attack ===
          "punch"
        ) {

          damage = 7;

        } else if (
          this.attack ===
          "kick"
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
            damage * 0.15
        );

    } else {

      this.vitality =
        Math.max(
          0,
          this.vitality -
            damage * 0.08
        );


      this.hitStun =
        0.2;


      this.velocity.x =
        attacker.facing * 2;


      this.comboTimer =
        COMBO_TIME;

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

      attacker.combo++;

      attacker.comboTimer =
        COMBO_TIME;


      game.maxCombo =
        Math.max(
          game.maxCombo,
          attacker.combo
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
        0.25,
        game.cameraShake +
          0.09
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


    this.fury = 0;

    this.furyUsed +=
      level;


    this.attacking =
      true;

    this.attack =
      "fury";

    this.attackTime =
      1.15;

    this.hitConfirmed =
      false;


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
      this.animationClock;


    /*
      --------------------------------------------------------
      BLOCK
      --------------------------------------------------------
    */

    if (
      this.blocking
    ) {

      this.leftArm.rotation.x =
        -1.15;

      this.rightArm.rotation.x =
        -1.15;

      this.leftArm.rotation.z =
        0.62;

      this.rightArm.rotation.z =
        -0.62;


      this.leftForearm.rotation.x =
        -1.05;

      this.rightForearm.rotation.x =
        -1.05;


      this.body.rotation.z =
        0;


      return;

    }


    /*
      --------------------------------------------------------
      ATTACK
      --------------------------------------------------------
    */

    if (
      this.attacking
    ) {

      const progress =
        1 -
        this.attackTime /
          (
            this.attack ===
              "punch"
              ? 0.42
              : this.attack ===
                  "kick"
                ? 0.55
                : 1.15
          );


      const clamped =
        THREE.MathUtils.clamp(
          progress,
          0,
          1
        );


      const swing =
        Math.sin(
          clamped *
          Math.PI
        );


      /*
        Punch
      */

      if (
        this.attack ===
        "punch"
      ) {

        if (
          this.facing === 1
        ) {

          this.rightArm.rotation.x =
            -1.65 * swing;

          this.rightArm.rotation.z =
            -0.38 * swing;

          this.rightForearm.rotation.x =
            -0.85 * swing;

        } else {

          this.leftArm.rotation.x =
            -1.65 * swing;

          this.leftArm.rotation.z =
            0.38 * swing;

          this.leftForearm.rotation.x =
            -0.85 * swing;

        }


        this.body.rotation.y =
          -0.12 *
          swing *
          this.facing;

      }


      /*
        Kick
      */

      if (
        this.attack ===
        "kick"
      ) {

        if (
          this.facing === 1
        ) {

          this.rightLeg.rotation.x =
            -1.45 * swing;

          this.rightShin.rotation.x =
            0.65 * swing;

        } else {

          this.leftLeg.rotation.x =
            -1.45 * swing;

          this.leftShin.rotation.x =
            0.65 * swing;

        }


        this.body.rotation.y =
          0.15 *
          swing *
          this.facing;

      }


      /*
        Fury
      */

      if (
        this.attack ===
        "fury"
      ) {

        const pulse =
          1 +
          Math.sin(
            time * 18
          ) *
          0.07;


        this.body.scale.set(
          pulse,
          pulse,
          pulse
        );


        this.leftArm.rotation.x =
          -1.35;

        this.rightArm.rotation.x =
          -1.35;


        this.leftForearm.rotation.x =
          -0.75;

        this.rightForearm.rotation.x =
          -0.75;


        this.leftLeg.rotation.x =
          -0.22;

        this.rightLeg.rotation.x =
          0.22;


        this.body.rotation.z =
          Math.sin(
            time * 10
          ) *
          0.035;

      }


      return;

    }


    /*
      --------------------------------------------------------
      JUMP
      --------------------------------------------------------
    */

    if (
      !this.grounded
    ) {

      this.leftLeg.rotation.x =
        -0.38;

      this.rightLeg.rotation.x =
        0.38;


      this.leftShin.rotation.x =
        0.35;

      this.rightShin.rotation.x =
        -0.35;


      this.leftArm.rotation.x =
        -0.35;

      this.rightArm.rotation.x =
        -0.35;


      return;

    }


    /*
      --------------------------------------------------------
      IDLE BREATHING
      --------------------------------------------------------
    */

    const breathing =
      Math.sin(
        time * 2.4
      );


    this.torso.scale.y =
      1 +
      breathing * 0.012;


    this.head.position.y =
      3.88 +
      breathing * 0.018;


    /*
      --------------------------------------------------------
      IDLE ARM MOVEMENT
      --------------------------------------------------------
    */

    const idle =
      Math.sin(
        time * 1.7
      );


    this.leftArm.rotation.x =
      -0.18 +
      idle * 0.035;

    this.rightArm.rotation.x =
      -0.18 -
      idle * 0.035;


    this.leftForearm.rotation.x =
      -0.72 +
      idle * 0.04;

    this.rightForearm.rotation.x =
      -0.72 -
      idle * 0.04;


    /*
      --------------------------------------------------------
      WALK ANIMATION
      --------------------------------------------------------
    */

    if (
      Math.abs(
        stick.x
      ) > 0.2 ||
      input.left ||
      input.right
    ) {

      const walk =
        Math.sin(
          time * 10
        );


      this.leftLeg.rotation.x =
        walk * 0.38;

      this.rightLeg.rotation.x =
        -walk * 0.38;


      this.leftShin.rotation.x =
        -Math.max(
          0,
          walk
        ) * 0.18;

      this.rightShin.rotation.x =
        -Math.max(
          0,
          -walk
        ) * 0.18;


      this.leftArm.rotation.x =
        -0.18 -
        walk * 0.12;

      this.rightArm.rotation.x =
        -0.18 +
        walk * 0.12;

    }


    /*
      --------------------------------------------------------
      NATURAL STANCE
      --------------------------------------------------------
    */

    this.body.rotation.z =
      breathing * 0.008;

  }


  /* ========================================================
     HIT ANIMATION
     ======================================================== */

  animateHit() {

    this.torso.rotation.z =
      0.25 *
      this.facing;


    this.head.rotation.z =
      -0.12 *
      this.facing;


    this.leftArm.rotation.z =
      0.55;


    this.rightArm.rotation.z =
      -0.55;


    this.leftForearm.rotation.x =
      -0.4;


    this.rightForearm.rotation.x =
      -0.4;


    this.leftLeg.rotation.x =
      -0.10;


    this.rightLeg.rotation.x =
      0.10;

  }


  /* ========================================================
     FACING
     ======================================================== */

  faceOpponent(
    opponent
  ) {

    if (
      this.attacking
    ) {

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
     LIMIT
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
