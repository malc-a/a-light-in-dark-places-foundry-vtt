export const THOSEWHOWANDER = {};

// The set of resistances used within the sytem.
THOSEWHOWANDER.resistances = {
  "body": "THOSEWHOWANDER.resistance.body",
  "mind": "THOSEWHOWANDER.resistance.mind",
  "soul": "THOSEWHOWANDER.resistance.soul",
};

// The set of pools used within the system
THOSEWHOWANDER.pools = {
  "body": "THOSEWHOWANDER.pool.health",
  "mind": "THOSEWHOWANDER.pool.focus",
  "soul": "THOSEWHOWANDER.pool.will",
};

// Custom status effects used by the system
THOSEWHOWANDER.statuses = {
  "one_action": "THOSEWHOWANDER.status.one_action",
  "two_actions": "THOSEWHOWANDER.status.two_actions",
  "three_actions": "THOSEWHOWANDER.status.three_actions",
  "four_actions": "THOSEWHOWANDER.status.four_actions",
  "five_actions": "THOSEWHOWANDER.status.five_actions",
  "six_actions": "THOSEWHOWANDER.status.six_actions",
  "dying": "THOSEWHOWANDER.status.dying",
}

// Strings used by the dice roller dialog
THOSEWHOWANDER.roll = {
  "dice": "THOSEWHOWANDER.roll.dice",
  "modifier": "THOSEWHOWANDER.roll.modifier",
  "mode": "THOSEWHOWANDER.roll.mode",
  "roll": "THOSEWHOWANDER.roll.roll",
  "cancel": "THOSEWHOWANDER.roll.cancel",
  "no_bonus": "THOSEWHOWANDER.roll.no_bonus",
  "no_dice": "THOSEWHOWANDER.roll.no_dice",
}

// Other strings used within the system
THOSEWHOWANDER.labels = {
  "name": "THOSEWHOWANDER.label.name",
  "concept": "THOSEWHOWANDER.label.concept",
  "skills": "THOSEWHOWANDER.label.skills",
  "talents": "THOSEWHOWANDER.label.talents",
  "problems": "THOSEWHOWANDER.label.problems",
  "languages": "THOSEWHOWANDER.label.languages",
  "schools": "THOSEWHOWANDER.label.schools",
  "spells": "THOSEWHOWANDER.label.spells",
  "passions": "THOSEWHOWANDER.label.passions",

  "main": "THOSEWHOWANDER.label.main",
  "magic": "THOSEWHOWANDER.label.magic",
  "gear": "THOSEWHOWANDER.label.gear",
  "other": "THOSEWHOWANDER.label.other",
  "effects": "THOSEWHOWANDER.label.effects",

  "description": "THOSEWHOWANDER.label.description",
  "details": "THOSEWHOWANDER.label.details",
  "dice": "THOSEWHOWANDER.label.dice",
  "bonus": "THOSEWHOWANDER.label.bonus",
  "cost": "THOSEWHOWANDER.label.cost",
  "xp": "THOSEWHOWANDER.label.xp",
  "wealth": "THOSEWHOWANDER.label.wealth",
  "treasure": "THOSEWHOWANDER.label.treasure",
  "equipped": "THOSEWHOWANDER.label.equipped",

  "add_skill": "THOSEWHOWANDER.label.add_skill",
  "edit_skill": "THOSEWHOWANDER.label.edit_skill",
  "delete_skill": "THOSEWHOWANDER.label.delete_skill",
  "add_talent": "THOSEWHOWANDER.label.add_talent",
  "edit_talent": "THOSEWHOWANDER.label.edit_talent",
  "delete_talent": "THOSEWHOWANDER.label.delete_talent",
  "add_problem": "THOSEWHOWANDER.label.add_problem",
  "edit_problem": "THOSEWHOWANDER.label.edit_problem",
  "delete_problem": "THOSEWHOWANDER.label.delete_problem",
  "add_language": "THOSEWHOWANDER.label.add_language",
  "edit_language": "THOSEWHOWANDER.label.edit_language",
  "delete_language": "THOSEWHOWANDER.label.delete_language",
  "add_school": "THOSEWHOWANDER.label.add_school",
  "edit_school": "THOSEWHOWANDER.label.edit_school",
  "delete_school": "THOSEWHOWANDER.label.delete_school",
  "add_spell": "THOSEWHOWANDER.label.add_spell",
  "edit_spell": "THOSEWHOWANDER.label.edit_spell",
  "delete_spell": "THOSEWHOWANDER.label.delete_spell",
  "add_item": "THOSEWHOWANDER.label.add_item",
  "edit_item": "THOSEWHOWANDER.label.edit_item",
  "delete_item": "THOSEWHOWANDER.label.delete_item",
  "add_passion": "THOSEWHOWANDER.label.add_passion",
  "edit_passion": "THOSEWHOWANDER.label.edit_passion",
  "delete_passion": "THOSEWHOWANDER.label.delete_passion",
  "add_effect": "THOSEWHOWANDER.label.add_effect",
  "toggle_effect": "THOSEWHOWANDER.label.toggle_effect",
  "delete_effect": "THOSEWHOWANDER.label.delete_effect",
};

// The status effects used by the system
THOSEWHOWANDER.statusEffects = [
  // Set the number of actions a character is taking
  {
    icon: 'systems/thosewhowander/assets/icons/status/2-actions.svg',
    id: '2-actions',
    label: 'THOSEWHOWANDER.status.two_actions',
    duration: {
      rounds: 1,
    },
    changes: [
      {
        key: 'system.actions',
        value: '-2',
        mode: 5,
      },
    ],
  },
  {
    icon: 'systems/thosewhowander/assets/icons/status/3-actions.svg',
    id: '3-actions',
    label: 'THOSEWHOWANDER.status.three_actions',
    duration: {
      rounds: 1,
    },
    changes: [
      {
        key: 'system.actions',
        value: '-4',
        mode: 5,
      },
    ],
  },
  {
    icon: 'systems/thosewhowander/assets/icons/status/4-actions.svg',
    id: '4-actions',
    label: 'THOSEWHOWANDER.status.four_actions',
    duration: {
      rounds: 1,
    },
    changes: [
      {
        key: 'system.actions',
        value: '-6',
        mode: 5,
      },
    ],
  },
  {
    icon: 'systems/thosewhowander/assets/icons/status/5-actions.svg',
    id: '5-actions',
    label: 'THOSEWHOWANDER.status.five_actions',
    duration: {
      rounds: 1,
    },
    changes: [
      {
        key: 'system.actions',
        value: '-8',
        mode: 5,
      },
    ],
  },
  {
    icon: 'systems/thosewhowander/assets/icons/status/6-actions.svg',
    id: '6-actions',
    label: 'THOSEWHOWANDER.status.six_actions',
    duration: {
      rounds: 1,
    },
    changes: [
      {
        key: 'system.actions',
        value: '-10',
        mode: 5,
      },
    ],
  },

  // Basic effects that don't have mechanical meaning			     
  { id: 'sleep', label: 'EFFECT.StatusAsleep', icon: 'icons/svg/sleep.svg' },
  { id: 'burning', label: 'EFFECT.StatusBurning', icon: 'icons/svg/fire.svg' },
  { id: 'corrode', label: 'EFFECT.StatusCorrode', icon: 'icons/svg/acid.svg' },
  { id: 'dead', label: 'EFFECT.StatusDead', icon: 'icons/svg/skull.svg' },
  { id: 'dying', label: 'THOSEWHOWANDER.status.dying', icon: 'icons/svg/blood.svg' },
  { id: 'fear', label: 'EFFECT.StatusFear', icon: 'icons/svg/terror.svg' },
  { id: 'poison', label: 'EFFECT.StatusPoison', icon: 'icons/svg/poison.svg' },
  { id: 'prone', label: 'EFFECT.StatusProne', icon: 'icons/svg/falling.svg' },
  { id: 'restrain', label: 'EFFECT.StatusRestrained', icon: 'icons/svg/net.svg' },
  { id: 'unconscious', label: 'EFFECT.StatusUnconscious', icon: 'icons/svg/unconscious.svg' },
];
