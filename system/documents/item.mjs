// Import the dice roll dialogue from the roll helper
import { ThoseWhoWanderRoll } from "../helpers/roll.js";

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class ThoseWhoWanderItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${this.type}] ${this.name}`;
    let dice = (this.actor.system.actions ?? 0) + (this.actor.system.effects ?? 0);

    // Handle skill rolls
    if (this.type == "skill") {
      // Start out with the dice from the skill
      dice += this.system.dice ?? 0;

      // Calculate the bonus from talents and gear
      for (let i of this.actor.items) {
        if (i.type == "talent" || i.type == "gear" && i.system.equipped) {
	  let bs = i.system.bonus;
	  let re = new RegExp(`(^|,)\\s*${this.name}\\s+([+-]\\d+)d\\s*($|,)`);
          let m = bs.match(re);
	  if (m && m[2] && m[2] != 0) {
	    dice += parseInt(m[2]) ?? 0;
	  }
	}
      }

      // Calculate the penalty for Injuries
      for (let [k,v] of Object.entries(this.actor.system.resistances)) {
        dice -= v.injuries ?? 0;
      }

      // Invoke the roll and submit it to chat
      return ThoseWhoWanderRoll.Roll({
        title: label,
	speaker: speaker,
	flavor: label,
	dice: dice,
      });
    } else if (this.type == "talent" || this.type == "gear") {
      // Find the related skill and optional bonus
      const m = this.system.bonus.match(/(^|,)\s*(\w+)\s+([+-]\d+)do?\s*(,|$)/);
      if (m) {
        for (let i of this.actor.items) {
	  // Have we found the skill matching the optional bonus
          if (i.type == "skill" && i.name == m[2]) {
	    dice += (i.system.dice ?? 0) + (parseInt(m[3]) ?? 0);

	    // Calculate the penalty for Injuries
	    for (let [k,v] of Object.entries(this.actor.system.resistances)) {
	      dice -= v.injuries ?? 0;
	    }

            // Invoke the roll and submit it to chat
	    return ThoseWhoWanderRoll.Roll({
	      title: label,
              speaker: speaker,
	      flavor: label,
	      dice: dice,
            });
	  }
	}
      }

      // The item doesn't have a valid rollable bonus
      const warning = game.i18n.localize("THOSEWHOWANDER.roll.no_bonus");
      ui.notifications.warn(warning);
      throw new Error(warning);
    }
  }
}
