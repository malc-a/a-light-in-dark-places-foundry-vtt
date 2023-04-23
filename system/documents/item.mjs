// Import the dice roll dialogue from the roll helper
import { ThoseWhoWanderRoll } from "../helpers/roll.mjs";

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
    const label = `[${this.type}] ${this.name}`;

    // Default the dice for each category
    let skill_dice = 0;
    let bonus_dice = 0;
    let injury_penalty = 0;
    let action_penalty = 0;

    // Handle ability rolls
    if (this.type == "skill" || this.type == "school") {
      // Start out with the dice from the ability
      skill_dice = this.system.dice ?? 0;

      // Calculate the bonus from talents and gear
      for (let i of this.actor.items) {
        if (i.type == "talent" || i.type == "gear" && i.system.equipped) {
          let bs = i.system.bonus;
          let re = new RegExp(`(^|,)\\s*${this.name}\\s+([+-]\\d+)d\\s*($|,)`);
          let m = bs.match(re);
          if (m && m[2] && m[2] != 0) {
            bonus_dice += parseInt(m[2]) ?? 0;
          }
        }
      }
    } else if (this.type == "talent" || this.type == "gear") {
      // Find the related skill and optional bonus
      let valid = false;
      const m = this.system.bonus.match(/(^|,)\s*(\w+)\s+([+-]\d+)do?\s*(,|$)/);
      if (m) {
        for (let i of this.actor.items) {
          // Have we found the skill matching the optional bonus
          if (i.type == "skill" && i.name == m[2]) {
            skill_dice = i.system.dice ?? 0;
            bonus_dice = parseInt(m[3]) ?? 0;
            found = true;
          }
        }
      }

      // Report an error if we didn't find a valid rollable bonus
      if (!valid) {
        const warning = game.i18n.localize("THOSEWHOWANDER.roll.no_bonus");
        ui.notifications.warn(warning);
        return;
      }
    }

    // Calculate the penalty for Injuries
    for (let [k,v] of Object.entries(this.actor.system.resistances)) {
      injury_penalty = Math.min(injury_penalty + (v.injuries ?? 0), 3);
    }

    // Calculate the penalty for multiple actions
    action_penalty = Math.max(((this.actor.system.actions ?? 0) - (this.actor.system.speed ?? 1)) * 2, 0);

    // Invoke the roll and submit it to chat
    return ThoseWhoWanderRoll.Roll({
      title: label,
      speaker: speaker,
      flavor: label,
      dice: skill_dice + bonus_dice - injury_penalty - action_penalty,
    });
  }
}
