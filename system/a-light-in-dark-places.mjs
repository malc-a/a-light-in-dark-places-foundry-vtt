// Import document classes.
import { ALiDPActor } from "./documents/actor.mjs";
import { ALiDPItem } from "./documents/item.mjs";

// Import sheet classes.
import { ALiDPActorSheet } from "./sheets/actor-sheet.mjs";
import { ALiDPItemSheet } from "./sheets/item-sheet.mjs";
import { ALiDPJournalSheet } from "./sheets/journal-sheet.mjs";

// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { registerHandlebarsHelpers } from "./helpers/handlebars.mjs";
import { ALiDPCombatTracker, ALiDPCombat } from "./helpers/combat-tracker.mjs";
import { ALIDP } from "./helpers/config.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {
    // Add utility classes to the global game object so that they're more easily
    // accessible in global contexts.
    game.alidp = {
        ALiDPActor,
        ALiDPItem,
        ALiDPJournalSheet,
    };

    // Add custom constants for configuration.
    CONFIG.ALIDP = ALIDP;

    // Define custom Document classes
    CONFIG.Actor.documentClass = ALiDPActor;
    CONFIG.Item.documentClass = ALiDPItem;

    // Override the default status effects
    CONFIG.statusEffects = ALIDP.statusEffects;

    // Override the default combat tracker
    CONFIG.Combat.documentClass = ALiDPCombat;
    CONFIG.ui.combat = ALiDPCombatTracker;

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("a-light-in-dark-places", ALiDPActorSheet, { makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("a-light-in-dark-places", ALiDPItemSheet, { makeDefault: true });
    Journal.unregisterSheet("core", JournalSheet);
    Journal.registerSheet("a-light-in-dark-places", ALiDPJournalSheet, {
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
