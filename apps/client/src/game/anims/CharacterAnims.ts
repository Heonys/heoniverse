import Phaser from "phaser";

export const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
  const animsFrameRate = 15;

  // suit
  anims.create({
    key: "suit_idle_right",
    frames: anims.generateFrameNames("suit", {
      start: 56,
      end: 61,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "suit_idle_up",
    frames: anims.generateFrameNames("suit", {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "suit_idle_left",
    frames: anims.generateFrameNames("suit", {
      start: 68,
      end: 73,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "suit_idle_down",
    frames: anims.generateFrameNames("suit", {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "suit_run_right",
    frames: anims.generateFrameNames("suit", {
      start: 112,
      end: 117,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "suit_run_up",
    frames: anims.generateFrameNames("suit", {
      start: 118,
      end: 123,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "suit_run_left",
    frames: anims.generateFrameNames("suit", {
      start: 124,
      end: 129,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "suit_run_down",
    frames: anims.generateFrameNames("suit", {
      start: 130,
      end: 135,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });
  anims.create({
    key: "suit_sit_down",
    frames: anims.generateFrameNames("suit", {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "suit_sit_up",
    frames: anims.generateFrameNames("suit", {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "suit_sit_right",
    frames: anims.generateFrameNames("suit", {
      start: 224,
      end: 229,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "suit_sit_left",
    frames: anims.generateFrameNames("suit", {
      start: 230,
      end: 235,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "suit_phone",
    frames: anims.generateFrameNames("suit", {
      start: 336,
      end: 247,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  // kimono
  anims.create({
    key: "kimono_idle_right",
    frames: anims.generateFrameNames("kimono", {
      start: 56,
      end: 61,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "kimono_idle_up",
    frames: anims.generateFrameNames("kimono", {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "kimono_idle_left",
    frames: anims.generateFrameNames("kimono", {
      start: 68,
      end: 73,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "kimono_idle_down",
    frames: anims.generateFrameNames("kimono", {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "kimono_run_right",
    frames: anims.generateFrameNames("kimono", {
      start: 112,
      end: 117,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "kimono_run_up",
    frames: anims.generateFrameNames("kimono", {
      start: 118,
      end: 123,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "kimono_run_left",
    frames: anims.generateFrameNames("kimono", {
      start: 124,
      end: 129,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "kimono_run_down",
    frames: anims.generateFrameNames("kimono", {
      start: 130,
      end: 135,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });
  anims.create({
    key: "kimono_sit_down",
    frames: anims.generateFrameNames("kimono", {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "kimono_sit_up",
    frames: anims.generateFrameNames("kimono", {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "kimono_sit_right",
    frames: anims.generateFrameNames("kimono", {
      start: 224,
      end: 229,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "kimono_sit_left",
    frames: anims.generateFrameNames("kimono", {
      start: 230,
      end: 235,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "kimono_phone",
    frames: anims.generateFrameNames("kimono", {
      start: 336,
      end: 247,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  // bald
  anims.create({
    key: "bald_idle_right",
    frames: anims.generateFrameNames("bald", {
      start: 56,
      end: 61,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "bald_idle_up",
    frames: anims.generateFrameNames("bald", {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "bald_idle_left",
    frames: anims.generateFrameNames("bald", {
      start: 68,
      end: 73,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "bald_idle_down",
    frames: anims.generateFrameNames("bald", {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "bald_run_right",
    frames: anims.generateFrameNames("bald", {
      start: 112,
      end: 117,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "bald_run_up",
    frames: anims.generateFrameNames("bald", {
      start: 118,
      end: 123,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "bald_run_left",
    frames: anims.generateFrameNames("bald", {
      start: 124,
      end: 129,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "bald_run_down",
    frames: anims.generateFrameNames("bald", {
      start: 130,
      end: 135,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });
  anims.create({
    key: "bald_sit_down",
    frames: anims.generateFrameNames("bald", {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "bald_sit_up",
    frames: anims.generateFrameNames("bald", {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "bald_sit_right",
    frames: anims.generateFrameNames("bald", {
      start: 224,
      end: 229,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "bald_sit_left",
    frames: anims.generateFrameNames("bald", {
      start: 230,
      end: 235,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "bald_phone",
    frames: anims.generateFrameNames("bald", {
      start: 336,
      end: 247,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  // ghost
  anims.create({
    key: "ghost_idle_right",
    frames: anims.generateFrameNames("ghost", {
      start: 56,
      end: 61,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "ghost_idle_up",
    frames: anims.generateFrameNames("ghost", {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "ghost_idle_left",
    frames: anims.generateFrameNames("ghost", {
      start: 68,
      end: 73,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "ghost_idle_down",
    frames: anims.generateFrameNames("ghost", {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "ghost_run_right",
    frames: anims.generateFrameNames("ghost", {
      start: 112,
      end: 117,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "ghost_run_up",
    frames: anims.generateFrameNames("ghost", {
      start: 118,
      end: 123,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "ghost_run_left",
    frames: anims.generateFrameNames("ghost", {
      start: 124,
      end: 129,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "ghost_run_down",
    frames: anims.generateFrameNames("ghost", {
      start: 130,
      end: 135,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });
  anims.create({
    key: "ghost_sit_down",
    frames: anims.generateFrameNames("ghost", {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "ghost_sit_up",
    frames: anims.generateFrameNames("ghost", {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "ghost_sit_right",
    frames: anims.generateFrameNames("ghost", {
      start: 224,
      end: 229,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "ghost_sit_left",
    frames: anims.generateFrameNames("ghost", {
      start: 230,
      end: 235,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "ghost_phone",
    frames: anims.generateFrameNames("ghost", {
      start: 336,
      end: 247,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  // jobless
  anims.create({
    key: "jobless_idle_right",
    frames: anims.generateFrameNames("jobless", {
      start: 56,
      end: 61,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "jobless_idle_up",
    frames: anims.generateFrameNames("jobless", {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "jobless_idle_left",
    frames: anims.generateFrameNames("jobless", {
      start: 68,
      end: 73,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "jobless_idle_down",
    frames: anims.generateFrameNames("jobless", {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "jobless_run_right",
    frames: anims.generateFrameNames("jobless", {
      start: 112,
      end: 117,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "jobless_run_up",
    frames: anims.generateFrameNames("jobless", {
      start: 118,
      end: 123,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "jobless_run_left",
    frames: anims.generateFrameNames("jobless", {
      start: 124,
      end: 129,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "jobless_run_down",
    frames: anims.generateFrameNames("jobless", {
      start: 130,
      end: 135,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });
  anims.create({
    key: "jobless_sit_down",
    frames: anims.generateFrameNames("jobless", {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "jobless_sit_up",
    frames: anims.generateFrameNames("jobless", {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "jobless_sit_right",
    frames: anims.generateFrameNames("jobless", {
      start: 224,
      end: 229,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "jobless_sit_left",
    frames: anims.generateFrameNames("jobless", {
      start: 230,
      end: 235,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "jobless_phone",
    frames: anims.generateFrameNames("jobless", {
      start: 336,
      end: 247,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  //  police
  anims.create({
    key: "police_idle_right",
    frames: anims.generateFrameNames("police", {
      start: 56,
      end: 61,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "police_idle_up",
    frames: anims.generateFrameNames("police", {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "police_idle_left",
    frames: anims.generateFrameNames("police", {
      start: 68,
      end: 73,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "police_idle_down",
    frames: anims.generateFrameNames("police", {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "police_run_right",
    frames: anims.generateFrameNames("police", {
      start: 112,
      end: 117,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "police_run_up",
    frames: anims.generateFrameNames("police", {
      start: 118,
      end: 123,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "police_run_left",
    frames: anims.generateFrameNames("police", {
      start: 124,
      end: 129,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "police_run_down",
    frames: anims.generateFrameNames("police", {
      start: 130,
      end: 135,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });
  anims.create({
    key: "police_sit_down",
    frames: anims.generateFrameNames("police", {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "police_sit_up",
    frames: anims.generateFrameNames("police", {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "police_sit_right",
    frames: anims.generateFrameNames("police", {
      start: 224,
      end: 229,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "police_sit_left",
    frames: anims.generateFrameNames("police", {
      start: 230,
      end: 235,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "police_phone",
    frames: anims.generateFrameNames("police", {
      start: 336,
      end: 247,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  // rapper
  anims.create({
    key: "rapper_idle_right",
    frames: anims.generateFrameNames("rapper", {
      start: 56,
      end: 61,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "rapper_idle_up",
    frames: anims.generateFrameNames("rapper", {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "rapper_idle_left",
    frames: anims.generateFrameNames("rapper", {
      start: 68,
      end: 73,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "rapper_idle_down",
    frames: anims.generateFrameNames("rapper", {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "rapper_run_right",
    frames: anims.generateFrameNames("rapper", {
      start: 112,
      end: 117,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "rapper_run_up",
    frames: anims.generateFrameNames("rapper", {
      start: 118,
      end: 123,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "rapper_run_left",
    frames: anims.generateFrameNames("rapper", {
      start: 124,
      end: 129,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "rapper_run_down",
    frames: anims.generateFrameNames("rapper", {
      start: 130,
      end: 135,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });
  anims.create({
    key: "rapper_sit_down",
    frames: anims.generateFrameNames("rapper", {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "rapper_sit_up",
    frames: anims.generateFrameNames("rapper", {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "rapper_sit_right",
    frames: anims.generateFrameNames("rapper", {
      start: 224,
      end: 229,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "rapper_sit_left",
    frames: anims.generateFrameNames("rapper", {
      start: 230,
      end: 235,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "rapper_phone",
    frames: anims.generateFrameNames("rapper", {
      start: 336,
      end: 247,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  // shark
  anims.create({
    key: "shark_idle_right",
    frames: anims.generateFrameNames("shark", {
      start: 56,
      end: 61,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "shark_idle_up",
    frames: anims.generateFrameNames("shark", {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "shark_idle_left",
    frames: anims.generateFrameNames("shark", {
      start: 68,
      end: 73,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "shark_idle_down",
    frames: anims.generateFrameNames("shark", {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "shark_run_right",
    frames: anims.generateFrameNames("shark", {
      start: 112,
      end: 117,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "shark_run_up",
    frames: anims.generateFrameNames("shark", {
      start: 118,
      end: 123,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "shark_run_left",
    frames: anims.generateFrameNames("shark", {
      start: 124,
      end: 129,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "shark_run_down",
    frames: anims.generateFrameNames("shark", {
      start: 130,
      end: 135,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });
  anims.create({
    key: "shark_sit_down",
    frames: anims.generateFrameNames("shark", {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "shark_sit_up",
    frames: anims.generateFrameNames("shark", {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "shark_sit_right",
    frames: anims.generateFrameNames("shark", {
      start: 224,
      end: 229,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "shark_sit_left",
    frames: anims.generateFrameNames("shark", {
      start: 230,
      end: 235,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "shark_phone",
    frames: anims.generateFrameNames("shark", {
      start: 336,
      end: 247,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  // sufer
  anims.create({
    key: "sufer_idle_right",
    frames: anims.generateFrameNames("sufer", {
      start: 56,
      end: 61,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "sufer_idle_up",
    frames: anims.generateFrameNames("sufer", {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "sufer_idle_left",
    frames: anims.generateFrameNames("sufer", {
      start: 68,
      end: 73,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
  anims.create({
    key: "sufer_idle_down",
    frames: anims.generateFrameNames("sufer", {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "sufer_run_right",
    frames: anims.generateFrameNames("sufer", {
      start: 112,
      end: 117,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "sufer_run_up",
    frames: anims.generateFrameNames("sufer", {
      start: 118,
      end: 123,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "sufer_run_left",
    frames: anims.generateFrameNames("sufer", {
      start: 124,
      end: 129,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "sufer_run_down",
    frames: anims.generateFrameNames("sufer", {
      start: 130,
      end: 135,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });
  anims.create({
    key: "sufer_sit_down",
    frames: anims.generateFrameNames("sufer", {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "sufer_sit_up",
    frames: anims.generateFrameNames("sufer", {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "sufer_sit_right",
    frames: anims.generateFrameNames("sufer", {
      start: 224,
      end: 229,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "sufer_sit_left",
    frames: anims.generateFrameNames("sufer", {
      start: 230,
      end: 235,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "sufer_phone",
    frames: anims.generateFrameNames("sufer", {
      start: 336,
      end: 247,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });
};
