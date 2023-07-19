// Import document classes.
import { ThoseWhoWanderActor } from "./documents/actor.mjs";
import { ThoseWhoWanderItem } from "./documents/item.mjs";

// Import sheet classes.
import { ThoseWhoWanderActorSheet } from "./sheets/actor-sheet.mjs";
import { ThoseWhoWanderItemSheet } from "./sheets/item-sheet.mjs";

// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { ThoseWhoWanderCombat, ThoseWhoWanderCombatant,
         ThoseWhoWanderCombatTracker } from "./helpers/combat-tracker.mjs";
import { THOSEWHOWANDER } from "./helpers/config.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {
    // Add utility classes to the global game object so that they're more easily
    // accessible in global contexts.
    game.thosewhowander = {
        ThoseWhoWanderActor,
        ThoseWhoWanderItem,
    };

    // Add custom constants for configuration.
    CONFIG.THOSEWHOWANDER = THOSEWHOWANDER;

    // Define custom Document classes
    CONFIG.Actor.documentClass = ThoseWhoWanderActor;
    CONFIG.Item.documentClass = ThoseWhoWanderItem;

    // Override the default status effects
    CONFIG.statusEffects = THOSEWHOWANDER.statusEffects;

    // Override the default combat tracker
    CONFIG.Combat.documentClass = ThoseWhoWanderCombat;
    CONFIG.Combatant.documentClass = ThoseWhoWanderCombatant;
    CONFIG.ui.combat = ThoseWhoWanderCombatTracker;

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("those-who-wander", ThoseWhoWanderActorSheet, { makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("those-who-wander", ThoseWhoWanderItemSheet, { makeDefault: true });

    // Preload Handlebars templates.
    return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
        if (typeof arguments[arg] != 'object') {
            outStr += arguments[arg];
        }
    }
    return outStr;
});

Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
    // Include steps that must happen after Foundry is fully loaded here
});
