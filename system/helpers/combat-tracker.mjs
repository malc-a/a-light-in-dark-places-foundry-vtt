export class ThoseWhoWanderCombatTracker extends CombatTracker {
  get template() {
    return "systems/thosewhowander/templates/chat/combat-tracker.html";
  }

  async getData(options) {
    const data = await super.getData(options);
    return {
      ...data,
      turns: data.turns.map((turn) => {
        const c = this.viewed.combatants.get(turn.id);
        turn.actions = c.actions;
        turn.declared = c.declared;
        return turn;
      }),
    };
  }

  async _onCombatantControl(event) {
    super._onCombatantControl(event);
    const btn = event.currentTarget;
    const li = btn.closest(".combatant");
    const combat = this.viewed;
    const c = combat.combatants.get(li.dataset.combatantId);
    switch (btn.dataset.control) {
      case "addAction":
        await c.setFlag("thosewhowander", "actions", c.actions + 1);
        return c.actor.update({ "system.actions": c.actions });
      case "removeAction":
        if (c.getFlag("thosewhowander", "actions") > 0) {
          await c.setFlag("thosewhowander", "actions", c.actions - 1);
          return c.actor.update({ "system.actions": c.actions });
        }
    }
  }
}

export class ThoseWhoWanderCombatant extends Combatant {
  constructor(data, options) {
    let c = super(data, options);
    c.setFlag("thosewhowander", "actions", c.actor.system.actions);
    c.setFlag("thosewhowander", "declared", c.actor.system.declared);
    return c;
  }

  get actions() {
    return this.getFlag("thosewhowander", "actions");
  }

  get declared() {
    return this.getFlag("thosewhowander", "declared");
  }
}

export class ThoseWhoWanderCombat extends Combat {
  async rollInitiative(ids, { _ = null, updateTurn = true, messageOptions = {} } = {}) {
    // Structure input data
    ids = typeof ids === "string" ? [ids] : ids;
    const currentId = this.combatant?.id;
    const rollMode = messageOptions.rollMode || game.settings.get("core", "rollMode");

    // Iterate over Combatants, performing an initiative roll for each
    const updates = [];
    const messages = [];
    for (let [i, id] of ids.entries()) {
      // Get Combatant data (non-strictly)
      const combatant = this.combatants.get(id);

      if (!combatant?.isOwner) {
        ui.notifications.error(localizeString("ERROR.NOT_OWNER"));
        break;
      }

      // Figure out how many dice the combatant will roll
      let dice = 0;
      for (let i of combatant.actor.items) {
        // We can use Battle or Notice for initiative
        if (i.type == "skill" && ["Battle","Notice"].includes(i.name) && i.system.dice > dice) {
          dice = i.system.dice;
        }

        // Calculate the penalty for Injuries
        for (let [k,v] of Object.entries(combatant.actor.system.resistances)) {
          dice -= v.injuries ?? 0;
        }

        // Ensure we don't try to roll a negative number of dice
        if (dice < 0) dice = 0;
      }

      // Produce an initiative roll for the Combatant if possible
      const formula = `${dice}d10cs>=6`;
      const roll = new Roll(formula);
      await roll.evaluate({ async: true });
      updates.push({ _id: id, initiative: roll.total });

      // Construct chat message data
      let messageData = foundry.utils.mergeObject({
        speaker: ChatMessage.getSpeaker({
          actor: combatant.actor,
          token: combatant.token,
          alias: combatant.name,
        }),
        flavor: game.i18n.format("COMBAT.RollsInitiative", { name: combatant.name }),
        flags: { "core.initiativeRoll": true },
      }, messageOptions);

      const chatData = await roll.toMessage(messageData, {
        create: false,
        rollMode: combatant.hidden && ["roll", "publicroll"].includes(rollMode) ? "gmroll" : rollMode,
      });

      // Play 1 sound for the whole rolled set
      if (i > 0) chatData.sound = null;
      messages.push(chatData);
    }
    if (!updates.length) return this;

    // Update multiple combatants
    await this.updateEmbeddedDocuments("Combatant", updates);

    // Ensure the turn order remains with the same combatant
    if (updateTurn && currentId) {
      await this.update({ turn: this.turns.findIndex((t) => t.id === currentId) });
    }

    // Create multiple chat messages
    await ChatMessage.implementation.create(messages);
    return this;
  }

  async beginCombat() {
    this.turns.forEach((c) => c.setFlag("thosewhowander", "actions", 0));
    this.turns.forEach((c) => c.setFlag("thosewhowander", "declared", c.actor.system.speed));
    this.turns.forEach((c) => c.actor.update({ "system.actions": 0 }));
    return super.beginCombat();
  }

  async nextRound() {
    this.turns.forEach((c) => c.setFlag("thosewhowander", "actions", 0));
    this.turns.forEach((c) => c.setFlag("thosewhowander", "declared", c.actor.system.speed));
    this.turns.forEach((c) => c.actor.update({ "system.actions": 0 }));
    return super.nextRound();
  }
}
