/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor tabs
    "systems/thosewhowander/templates/actor/tabs/actor-main.html",
    "systems/thosewhowander/templates/actor/tabs/actor-magic.html",
    "systems/thosewhowander/templates/actor/tabs/actor-gear.html",
    "systems/thosewhowander/templates/actor/tabs/actor-other.html",
  ]);
};
