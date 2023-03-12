/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor partials.
    "systems/thosewhowander/templates/actor/parts/actor-main.html",
    "systems/thosewhowander/templates/actor/parts/actor-magic.html",
    "systems/thosewhowander/templates/actor/parts/actor-gear.html",
    "systems/thosewhowander/templates/actor/parts/actor-other.html",
  ]);
};
