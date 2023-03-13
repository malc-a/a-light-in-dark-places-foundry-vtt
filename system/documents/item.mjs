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

    // Handle skill rolls
    if (this.type == "skill") {
      // Calculate the bonus from talents and gear
      let bonus = 0;
      for (let i of this.actor.items) {
        if (i.type == "talent" || i.type == "gear" && i.system.equipped) {
	  let bs = i.system.bonus;
	  let re = new RegExp(`^\\s*${this.name}\\s+([+-]\\d+)d\\s*$`);
          let m = bs.match(re);
	  if (m && m[1] && m[1] != 0) {
	    bonus += parseInt(m[1]);
	  }
	}
      }

      // Invoke the roll and submit it to chat.
      const formula = `${this.system.dice + bonus}d10cs>=6`;
      const roll = new Roll(formula, {});
      roll.toMessage({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
      });
      return roll;
    } else if (this.type == "talent" || this.type == "gear") {
      // Find the related skill and bonus
      const m = this.system.bonus.match(/^\s*(\w+)\s+([+-]\d+)do?\s*$/);
      if (m) {
        for (let i of this.actor.items) {
          if (i.type == "skill" && i.name == m[1]) {
	    // Invoke the roll and submit it to chat
	    const formula = `${i.system.dice + parseInt(m[2])}d10cs>=6`;
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
      // The item doesn't have a valid roll
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: `${this.name} does not have a rollable bonus`,
      });
    }
  }
}
