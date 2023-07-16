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
  "dying": "THOSEWHOWANDER.status.dying",
}

// Strings used by the combat tracker
THOSEWHOWANDER.combat = {
  "reset_actions": "THOSEWHOWANDER.combat.reset_actions",
  "add_action": "THOSEWHOWANDER.combat.add_action",
  "remove_action": "THOSEWHOWANDER.combat.remove_action",
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

// Strings defining types of dice roll
THOSEWHOWANDER.rolls = {
// Other strings used within the system
  "resistance": "THOSEWHOWANDER.rolls.resistance",
  "skill": "THOSEWHOWANDER.rolls.skill",
  "school": "THOSEWHOWANDER.rolls.school",
  "spell": "THOSEWHOWANDER.rolls.spell",
  "talent": "THOSEWHOWANDER.rolls.talent",
  "weapon": "THOSEWHOWANDER.rolls.weapon",
  "gear": "THOSEWHOWANDER.rolls.gear",
  "monster-attack": "THOSEWHOWANDER.rolls.monster-attack",
  "monster-ability": "THOSEWHOWANDER.rolls.monster-ability",
}

THOSEWHOWANDER.labels = {
  "name": "THOSEWHOWANDER.label.name",
  "concept": "THOSEWHOWANDER.label.concept",
  "speed": "THOSEWHOWANDER.label.speed",
  "actions": "THOSEWHOWANDER.label.actions",
  "resistances": "THOSEWHOWANDER.label.resistances",
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
  "school": "THOSEWHOWANDER.label.school",
  "complexity": "THOSEWHOWANDER.label.complexity",
  "range": "THOSEWHOWANDER.label.range",
  "duration": "THOSEWHOWANDER.label.duration",
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
  // Basic effects that don't have mechanical meaning (yet)
  { id: 'asleep', label: 'EFFECT.StatusAsleep', icon: 'icons/svg/sleep.svg' },
  { id: 'burning', label: 'EFFECT.StatusBurning', icon: 'icons/svg/fire.svg' },
  { id: 'corroding', label: 'EFFECT.StatusCorrode', icon: 'icons/svg/acid.svg' },
  { id: 'dead', label: 'EFFECT.StatusDead', icon: 'icons/svg/skull.svg' },
  { id: 'dying', label: 'THOSEWHOWANDER.status.dying', icon: 'icons/svg/blood.svg' },
  { id: 'fear', label: 'EFFECT.StatusFear', icon: 'icons/svg/terror.svg' },
  { id: 'poisoned', label: 'EFFECT.StatusPoison', icon: 'icons/svg/poison.svg' },
  { id: 'prone', label: 'EFFECT.StatusProne', icon: 'icons/svg/falling.svg' },
  { id: 'restrain', label: 'EFFECT.StatusRestrained', icon: 'icons/svg/net.svg' },
  { id: 'unconscious', label: 'EFFECT.StatusUnconscious', icon: 'icons/svg/unconscious.svg' },
];
