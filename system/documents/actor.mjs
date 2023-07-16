// Import the dice roll dialogue from the roll helper
import { ThoseWhoWanderRoll } from "../helpers/roll.mjs";

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ThoseWhoWanderActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Override prepareDerivedData() to add any calculated values
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
  }

  /**
   * @override
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Copy the resistances and ability scores to the top level for convenience
    if (data.resistances) {
      for (let [k, v] of Object.entries(data.resistances)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }
    if (data.skills) {
      for (let [k, v] of Object.entries(data.skills)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }
    if (data.schools) {
      for (let [k, v] of Object.entries(data.schools)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }
  }

  /**
   * Roll a named resistance for this actor.
   * @param {Event} event       The originating click event
   * @param {String} resistance The name of the resistance to roll
   */
  rollResistance(event, resistance) {
    event.preventDefault();

    // Get the resistance dice, invoke the roll and submit it to chat
    const rolltype = game.i18n.localize("THOSEWHOWANDER.rolls.resistance");
    const label = `[${rolltype}] ` + game.i18n.localize(`THOSEWHOWANDER.resistance.${resistance}`);
    const dice = this.system.resistances[resistance].dice;
    return ThoseWhoWanderRoll.Roll({
      title: label,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: label,
      dice: dice,
    });
  }

  /**
   * Update the actions for this actor.
   */
  updateActions(actions) {
    // First sanity check the number of actions
    actions = ((actions ?? 0) >= 0) ? (actions ?? 0) : 0;

    // Now see if we have any combatants to render
    game.combats.forEach((combat) => {
      combat.combatants.filter((c) => c.actor === this).map((c) => {
        c.update({ 'initiative': actions })
      });
    });

    // Now update the actor itself
    return this.update({ 'system.actions': actions });
  }
}
