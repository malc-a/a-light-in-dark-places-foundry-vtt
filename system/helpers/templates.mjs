/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor tabs
    "systems/those-who-wander/templates/actor/tabs/actor-main.html",
    "systems/those-who-wander/templates/actor/tabs/actor-magic.html",
    "systems/those-who-wander/templates/actor/tabs/actor-gear.html",
    "systems/those-who-wander/templates/actor/tabs/actor-other.html",
    "systems/those-who-wander/templates/actor/tabs/actor-effects.html",

    // Chat and dialog templates
    "systems/those-who-wander/templates/chat/roll-dialog.html",
  ]);
};
