/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
    return loadTemplates([

        // Actor tabs
        "systems/a-light-in-dark-places/templates/actor/tabs/actor-main.html",
        "systems/a-light-in-dark-places/templates/actor/tabs/actor-magic.html",
        "systems/a-light-in-dark-places/templates/actor/tabs/actor-gear.html",
        "systems/a-light-in-dark-places/templates/actor/tabs/actor-notes.html",
        "systems/a-light-in-dark-places/templates/actor/tabs/actor-effects.html",

        // Chat and dialog templates
        "systems/a-light-in-dark-places/templates/chat/roll-dialog.html",
    ]);
};
