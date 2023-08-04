// Import document classes.
import { ThoseWhoWanderActor } from "./documents/actor.mjs";
import { ThoseWhoWanderItem } from "./documents/item.mjs";

// Import sheet classes.
import { ThoseWhoWanderActorSheet } from "./sheets/actor-sheet.mjs";
import { ThoseWhoWanderItemSheet } from "./sheets/item-sheet.mjs";
import { ThoseWhoWanderJournalSheet } from "./sheets/journal-sheet.mjs";

// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { registerHandlebarsHelpers } from "./helpers/handlebars.mjs";
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
    Journal.unregisterSheet("core", JournalSheet);
    Journal.registerSheet("those-who-wander", ThoseWhoWanderJournalSheet, {
        label: () => game.i18n.format("SHEETS.DefaultDocumentSheet",
				      { document: game.i18n.localize("DOCUMENT.JournalEntry") }),
        makeDefault: true,
    });

    // Preload Handlebars templates and register helpers
    preloadHandlebarsTemplates();
    return registerHandlebarsHelpers();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
    // Include steps that must happen after Foundry is fully loaded here
});
