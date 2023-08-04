export const THOSEWHOWANDER = {};

// Allow us to get the related pool for a resistance
THOSEWHOWANDER.pools = {
  "body": "health",
  "mind": "focus",
  "soul": "will",
};

// Allow us to get the related resistance for a pool
THOSEWHOWANDER.resistances = {
  "health": "body",
  "focus": "mind",
  "will": "soul",
};

// How many injuries can each type of actor take
THOSEWHOWANDER.maxInjuries = {
  "character" : 4,
  "minion" : 0,
  "menace": 1,
  "master" : 4,
}

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
