// A class to add a dialog box to dice rolls
export class ThoseWhoWanderRoll {
  /**
   * Handle a dice-rolling dialog to set modifiers and roll mode
   * @param {String} title          The title of the roll
   * @param {String} speaker        The ID of the actor making the roll
   * @param {String} flavor         A description of the roll type
   * @param {Integer} dice          The base number of dice to be rolled
   * @param {Bool} skipDialog       Skip the dialog and roll with no modifier
   */
  static async Roll({
    title = null,
    speaker = null,
    flavor = null,
    dice = 0,
    skipDialog = false,
  } = {}) {
    let rolled = false;
    const template = "systems/those-who-wander/templates/chat/roll-dialog.html";

    let dialogData = {
      dice: dice,
      modifier: 0,
      rollMode: game.settings.get("core", "rollMode"),
      rollModes: CONFIG.Dice.rollModes,
    };

    let rollData = {
      title: title,
      flavor: flavor,
      speaker: speaker,
      dice: dice,
      modifier: 0,
    };

    if (skipDialog) { return ThoseWhoWanderRoll.sendRoll(rollData); }

    let buttons = {
      ok: {
        label: game.i18n.localize("THOSEWHOWANDER.roll.roll"),
        icon: '<i class="fas fa-dice-d10"></i>',
        callback: (html) => {
          rolled = true;
          rollData.form = html[0].querySelector("form");
          roll = ThoseWhoWanderRoll.sendRoll(rollData);
        },
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize("THOSEWHOWANDER.roll.cancel"),
        callback: (html) => { },
      },
    };

    const html = await renderTemplate(template, dialogData);
    let roll;

    // Create Dialog window
    return new Promise((resolve) => {
      new Dialog({
        title: title,
        content: html,
        buttons: buttons,
        default: "ok",
        close: () => {
          resolve(rolled ? roll : false);
        },
      }).render(true);
    });
  }

  /**
   * Actually perform the roll after the dialog has been completed
   * @param {String} title          The title of the roll
   * @param {String} speaker        The ID of the actor making the roll
   * @param {String} flavor         A description of the roll type
   * @param {Object} form           The results of the dialog form
   */
  static async sendRoll({
    title = null,
    speaker = null,
    flavor = null,
    form = null,
  } = {}) {
    let dice = 0;

    // Get the number of dice and modifier
    if (form !== null) {
        dice = (parseInt(form.dice.value) ?? 0) + (parseInt(form.modifier.value) ?? 0);
    }

    // If we have dice to roll, invoke the roll and submit it to chat
    if (dice > 0) {
      const formula = `${dice}d10cs>=6`;
      const roll = new Roll(formula, {});
      let rollMode = game.settings.get("core", "rollMode");
      rollMode = form ? form.rollMode.value : rollMode;

      // If we have dice to roll, invoke the roll and submit it to chat
      if (dice > 0) {
        const formula = `${dice}d10cs>=6`;
        const roll = new Roll(formula, {});
        roll.toMessage({ speaker: speaker, flavor: flavor }, { rollMode: rollMode });
        return roll;
      }
    }

    // We ended up with no dice to roll
    const warning = game.i18n.localize("THOSEWHOWANDER.roll.no_dice");
    ui.notifications.warn(warning);
  }
}
