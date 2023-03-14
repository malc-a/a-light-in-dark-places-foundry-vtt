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
	  let re = new RegExp(`^\\s*${this.name}\\s+([+-]\\d+)d\\s*$`);
          let m = bs.match(re);
	  if (m && m[1] && m[1] != 0) {
	    dice += parseInt(m[1]) ?? 0;
	  }
	}
      }

      // If we have dice to roll, invoke the roll and submit it to chat
      if (dice > 0) {
        const formula = `${dice}d10cs>=6`;
        const roll = new Roll(formula, {});
	roll.toMessage({
          speaker: speaker,
          rollMode: rollMode,
          flavor: label,
        });
	return roll;
      }
    } else if (this.type == "talent" || this.type == "gear") {
      // Find the related skill and bonus
      const m = this.system.bonus.match(/^\s*(\w+)\s+([+-]\d+)do?\s*$/);
      if (m) {
        for (let i of this.actor.items) {
          if (i.type == "skill" && i.name == m[1]) {
	    dice += (i.system.dice ?? 0) + (parseInt(m[2]) ?? 0);

	    // If we have dice to roll, invoke the roll and submit it to chat
	    if (dice > 0) {
	      const formula = `${dice}d10cs>=6`;
              const roll = new Roll(formula, {});
              roll.toMessage({
	        speaker: speaker,
	        rollMode: rollMode,
	        flavor: label,
	      });
	      return roll;
	    }
	  }
	}
      }

      // The item doesn't have a valid roll
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: `${this.name} does not have a rollable bonus`,
      });
      return;
    }

    // We ended up with no dice to roll
    ChatMessage.create({
      speaker: speaker,
      rollMode: rollMode,
      flavor: label,
      content: `${this.name} has no remaining dice to roll`,
    });
  }
}
