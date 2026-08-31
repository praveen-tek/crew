import "dotenv/config";
import { db } from "./index";
import { aatmodayGroup, aatmodayEvent } from "./schema";

export const SEED_GROUPS = [
  {
    id: "grp_robotics",
    name: "Aatmoday Robotics & Embedded Systems Guild",
    description:
      "A hands-on crew of hardware hackers building autonomous drones, combat bots, ROS2 robotics, and edge microcontrollers.",
    category: "Technology",
    tags: ["robotics", "hardware", "arduino", "drones", "iot", "ros2", "embedded", "engineering"],
    events: [
      {
        id: "evt_robotics_1",
        name: "Hack The Bot: Autonomous Line Follower Sprint",
        description: "Build, program, and race an autonomous obstacle-avoiding bot in teams of three.",
        location: "Maker Space Lab, Building B Room 204",
        startsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // in 3 days
      },
      {
        id: "evt_robotics_2",
        name: "Edge AI & Vision on Raspberry Pi Workshop",
        description: "Hands-on setup for running YOLOv8 object detection on low-power single board computers.",
        location: "Hardware Hack Lab, Ground Floor",
        startsAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // in 8 days
      },
    ],
  },
  {
    id: "grp_gamedev",
    name: "Aatmoday Indie Game Dev & Creative Coding Circle",
    description:
      "Passionate game designers, shader wizards, pixel artists, and sound composers collaborating on indie titles, Godot projects, and weekend game jams.",
    category: "Technology & Creative",
    tags: ["game-dev", "godot", "unity", "pixel-art", "creative-coding", "shaders", "game-design", "indie-games"],
    events: [
      {
        id: "evt_gamedev_1",
        name: "48-Hour Campus Weekend Game Jam",
        description: "Create an entire playable game around a surprise theme announced at kickoff! Pizza provided.",
        location: "Design Studio & Discord",
        startsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "evt_gamedev_2",
        name: "Procedural Shaders & 2D Lighting Masterclass",
        description: "Learn GLSL shader magic to make retro pixel games pop with dynamic lighting.",
        location: "Computer Lab 3",
        startsAt: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "grp_ai_lab",
    name: "Aatmoday AI & Open Source Builders Lab",
    description:
      "A community of developers building autonomous LLM agents, experimenting with local models (Ollama, vLLM), and contributing to high-impact open source.",
    category: "Technology",
    tags: ["ai", "machine-learning", "open-source", "python", "llm", "agents", "full-stack", "coding"],
    events: [
      {
        id: "evt_ai_1",
        name: "Autonomous LLM Agents Hack Night",
        description: "Collaborative evening building multi-agent systems with tool-calling and reasoning chains.",
        location: "Incubation Center Co-working Space",
        startsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "evt_ai_2",
        name: "Open Source First PR Marathon",
        description: "Pair with senior maintainers to resolve good-first-issues in popular OSS repos.",
        location: "Main Library Tech Lounge",
        startsAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "grp_music_jam",
    name: "Aatmoday Indie Rock & Jam Collective",
    description:
      "Musicians, vocalists, synth lovers, and drummers who gather for weekly rooftop jam sessions, original songwriting, and campus live shows.",
    category: "Music & Performing Arts",
    tags: ["music", "guitar", "singing", "drums", "synth", "bands", "indie-rock", "jamming", "production"],
    events: [
      {
        id: "evt_music_1",
        name: "Unplugged Acoustic Jam on the Terrace",
        description: "Bring your acoustic instruments or just your voice for a relaxed evening under the fairy lights.",
        location: "Student Activity Center Open Terrace",
        startsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      },
      {
        id: "evt_music_2",
        name: "Lo-Fi Beats & Songwriting Workshop",
        description: "From chord progressions to Ableton live tracking, craft your first complete demo track.",
        location: "Music Room 102",
        startsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "grp_photography",
    name: "Aatmoday Film Photography & Darkroom Society",
    description:
      "Visual storytellers celebrating analogue 35mm film, vintage glass lenses, street portraits, architectural framing, and self-published photo zines.",
    category: "Visual Arts",
    tags: ["photography", "analog-film", "street-photography", "visual-arts", "camera", "zine", "editing"],
    events: [
      {
        id: "evt_photo_1",
        name: "Golden Hour Campus Street Walk & Shoot",
        description: "Explore hidden campus architecture and street aesthetics with fellow photographers.",
        location: "Starting at Central Fountain Plaza",
        startsAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: "evt_photo_2",
        name: "Photo Zine Printing & Darkroom Basics",
        description: "Curate your best photos and assemble a physical mini-zine to trade with peers.",
        location: "Arts Studio Block D",
        startsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "grp_boardgames",
    name: "Aatmoday Board Games & Tactical Strategy Guild",
    description:
      "Tabletop enthusiasts meeting for deep strategy sessions, Dungeons & Dragons campaigns, high-stakes Catan tournaments, and social deduction games.",
    category: "Gaming & Social",
    tags: ["board-games", "dnd", "catan", "tabletop", "chess", "strategy", "social-games", "roleplay"],
    events: [
      {
        id: "evt_bg_1",
        name: "Friday D&D One-Shot: The Sunken Ruins of Aatmoday",
        description: "Beginner-friendly 3-hour tabletop adventure. Pre-generated character sheets provided.",
        location: "Student Lounge East Wing",
        startsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      },
      {
        id: "evt_bg_2",
        name: "Campus Settlers of Catan Championship",
        description: "Trade wood for sheep and claim the longest road! Trophy and custom dice for the winner.",
        location: "Cafeteria Mezzanine",
        startsAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "grp_outdoors",
    name: "Aatmoday Trekking, Bouldering & Outdoor Explorers",
    description:
      "Adventure seekers who escape campus for sunrise summit hikes, weekend bouldering sessions, slacklining, and stargazing campouts.",
    category: "Outdoors & Adventure",
    tags: ["hiking", "trekking", "bouldering", "climbing", "nature", "fitness", "camping", "adventure"],
    events: [
      {
        id: "evt_outdoor_1",
        name: "Sunrise Ridge Trek & Trail Breakfast",
        description: "Early morning 8km scenic ridge hike to catch the cloud inversions and morning chai.",
        location: "Meet at Main Campus Gate 1 (Bus departs 5:30 AM)",
        startsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "evt_outdoor_2",
        name: "Beginner Bouldering & Grip Clinic",
        description: "Learn route reading, footwork, and dynamic movement on the campus climbing wall.",
        location: "Sports Complex Climbing Wall",
        startsAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "grp_anime_art",
    name: "Aatmoday Anime, Manga & Digital Illustration Guild",
    description:
      "Digital artists, animators, and manga fans who collaborate on webcomics, character concept design, cosplay builds, and anime watch parties.",
    category: "Art & Pop Culture",
    tags: ["anime", "manga", "digital-art", "illustration", "drawing", "concept-art", "animation", "cosplay"],
    events: [
      {
        id: "evt_anime_1",
        name: "Cyberpunk Character Illustration Jam",
        description: "Bring your tablets or sketchbooks and design original sci-fi characters in 90 minutes.",
        location: "Design Studio 104",
        startsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: "evt_anime_2",
        name: "Studio Ghibli & Makoto Shinkai Film Night",
        description: "Late night movie screening with discussion on background art and soundtrack composition.",
        location: "Auditorium Mini Hall",
        startsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "grp_culinary",
    name: "Aatmoday Specialty Coffee & Culinary Lab",
    description:
      "Foodies, bakers, and home baristas experimenting with third-wave pour-overs, sourdough fermentation, international street foods, and flavor chemistry.",
    category: "Lifestyle & Food",
    tags: ["coffee", "cooking", "baking", "food", "culinary", "barista", "gastronomy", "tasting"],
    events: [
      {
        id: "evt_coffee_1",
        name: "Third-Wave Coffee Cupping & Latte Art Session",
        description: "Taste single-origin beans from across India and practice milk steaming and latte art pours.",
        location: "Campus Common Kitchen & Cafe",
        startsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "evt_coffee_2",
        name: "Sourdough & Artisanal Pizza Making Night",
        description: "Learn 72-hour cold fermentation doughs and bake wood-fired pizzas together.",
        location: "Culinary Workshop Studio",
        startsAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "grp_debate",
    name: "Aatmoday Debating Society & Philosophy Salon",
    description:
      "A forum for spirited debates, philosophical inquiries into technology, ethics, politics, and razor-sharp parliamentary debating tournaments.",
    category: "Discourse & Humanities",
    tags: ["debate", "philosophy", "public-speaking", "ethics", "politics", "critical-thinking", "discourse"],
    events: [
      {
        id: "evt_debate_1",
        name: "Late-Night Salon: The Ethics of AGI & Human Autonomy",
        description: "Informal, moderated discourse on consciousness, synthetic minds, and future society.",
        location: "Amphitheater Steps",
        startsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: "evt_debate_2",
        name: "British Parliamentary Debate Novice Invitational",
        description: "Quick 15-minute prep rounds with constructive feedback from national debaters.",
        location: "Humanities Hall Room 301",
        startsAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "grp_cybersecurity",
    name: "Aatmoday Cyber Security & Ethical Hacking Crew",
    description:
      "Defenders and penetration testers solving Capture The Flag (CTF) challenges, reverse engineering malware, and dissecting web application vulnerabilities.",
    category: "Technology",
    tags: ["cybersecurity", "ctf", "ethical-hacking", "reverse-engineering", "networking", "infosec", "linux"],
    events: [
      {
        id: "evt_cyber_1",
        name: "Midnight CTF: Web Exploitation & Cryptography",
        description: "A 4-hour live jeopardy-style CTF with bounties for first-blood flag submissions.",
        location: "Virtual Discord & Computer Lab 1",
        startsAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "grp_literature",
    name: "Aatmoday Literature, Poetry & Creative Writing Guild",
    description:
      "Writers, poets, and bibliophiles sharing micro-fiction, hosting spoken word open mics, and producing quarterly print literary magazines.",
    category: "Literature & Writing",
    tags: ["writing", "poetry", "books", "reading", "creative-writing", "storytelling", "literature", "open-mic"],
    events: [
      {
        id: "evt_lit_1",
        name: "Campfire Spoken Word & Storytelling Circle",
        description: "Share original poetry, prose fragments, or listen by the courtyard lantern glow.",
        location: "Old Banyan Courtyard",
        startsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      },
      {
        id: "evt_lit_2",
        name: "Flash Fiction & Worldbuilding Sprint",
        description: "Write a complete 500-word speculative universe in 45 minutes from sensory prompts.",
        location: "Library Reading Room",
        startsAt: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "grp_astronomy",
    name: "Aatmoday Astronomy & Astrophotography Society",
    description:
      "Stargazers observing lunar craters, planetary alignments, deep-sky nebulae, and learning long-exposure telescope astrophotography.",
    category: "Science & Space",
    tags: ["astronomy", "space", "stargazing", "physics", "telescope", "astrophotography", "science"],
    events: [
      {
        id: "evt_astro_1",
        name: "Deep-Sky Telescope Observation: Saturn's Rings & Orion Nebula",
        description: "High-powered 10-inch Dobsonian telescope session with planetary imaging demo.",
        location: "Physics Department Observatory Rooftop",
        startsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "grp_esports",
    name: "Aatmoday Competitive Esports & Speedrunning League",
    description:
      "Gamers competing in Valorant, Super Smash Bros, Rocket League, and retro speedrunning leaderboard showdowns.",
    category: "Gaming & Esports",
    tags: ["esports", "gaming", "valorant", "smash-bros", "rocket-league", "speedrun", "tournaments"],
    events: [
      {
        id: "evt_esports_1",
        name: "Campus 5v5 Valorant Inter-Hostel Showdown",
        description: "Double elimination bracket casted live on campus Twitch stream with prize pool.",
        location: "Gaming Den & Twitch",
        startsAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      },
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding Aatmoday groups and events...");

  for (const group of SEED_GROUPS) {
    const { events, ...groupData } = group;

    await db
      .insert(aatmodayGroup)
      .values(groupData)
      .onConflictDoUpdate({
        target: aatmodayGroup.id,
        set: {
          name: groupData.name,
          description: groupData.description,
          category: groupData.category,
          tags: groupData.tags,
        },
      });

    for (const event of events) {
      await db
        .insert(aatmodayEvent)
        .values({
          id: event.id,
          groupId: group.id,
          name: event.name,
          description: event.description,
          location: event.location,
          startsAt: event.startsAt,
        })
        .onConflictDoUpdate({
          target: aatmodayEvent.id,
          set: {
            groupId: group.id,
            name: event.name,
            description: event.description,
            location: event.location,
            startsAt: event.startsAt,
          },
        });
    }
  }

  console.log("✅ Seed completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
