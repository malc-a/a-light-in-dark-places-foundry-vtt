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

        // Set the total dice for minions
        if (this.type === 'minion') {
            systemData.dice = systemData.number * systemData.threat;
        }
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
     * Roll wealth for this actor.
     * @param {Event} event       The originating click event
     */
    rollWealth(event) {
        event.preventDefault();

        // Get the wealth dice, invoke the roll and submit it to chat
        const rolltype = game.i18n.localize("THOSEWHOWANDER.rolls.wealth");
        const label = `[${rolltype}] ${rolltype}`;
        const dice = this.system.wealth ?? 0;
        return ThoseWhoWanderRoll.Roll({
            title: label,
            speaker: ChatMessage.getSpeaker({ actor: this }),
            flavor: label,
            dice: dice,
        });
    }

    /**
     * Roll minion dice for a minion
     * @param {Event} event       The originating click event
     */
    rollMinionDice(event) {
        event.preventDefault();

        // Get the minion dice, invoke the roll and submit it to chat
        const rolltype = game.i18n.localize("THOSEWHOWANDER.rolls.minion");
        const label = `[${rolltype}] ${rolltype}`;
        const dice = (this.system.dice ?? 0) - (this.system.injuries ?? 0);
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
        actions = ((actions ?? 0) >= 1) ? (actions ?? 0) : 1;

        // Now see if we have any combatants to render
        game.combats.forEach((combat) => {
            combat.combatants.filter((c) => c.actor === this).map((c) => {
                c.update({ 'initiative': actions })
            });
        });

        // Now update the actor itself
        return this.update({ 'system.actions': actions });
    }

    /**
     * Update the value of a specified pool for this actor.
     */
    updatePool(resistance, value) {
        // If the actor is a minion then there are no pools to update
        if (this.type === 'minion') {
            return;
        }

        // First sanity check the value
        value = ((value ?? 0) >= 0) ? (value ?? 0) : 0;
        value = (value > this.getPoolMax(resistance)) ? this.getPoolMax(resistance) : value;

        // Add the required change for this resistance to the object
        let changes = {};
        changes['system.resistances.' + resistance + '.pool'] = value;
        return this.update(changes);
    }

    /**
     * Update the value of specified injuries for this actor.
     */
    updateInjuries(resistance, injuries) {
        // If the actor is a menace then there are no injuries to update
        if (this.type === 'menace') {
            return;
        }

        // First sanity check the injuries
        injuries = ((injuries ?? 0) >= 0) ? (injuries ?? 0) : 0;
        if (this.type === 'minion') {
            injuries = (injuries > this.system.dice) ? this.system.dice : injuries;
        }

        // Default the changes we're making to the actor
        let changes = {};

        // Handle injuries to minions, which work a little differently
        if (this.type === 'minion' && resistance === 'minion') {
            changes['system.injuries'] = injuries;
        } else if (this.type !== 'minion' && resistance !== 'minion') {
            changes['system.resistances.' + resistance + '.injuries'] = injuries;
        }

        // Update the actor with the required change
        return this.update(changes);
    }

    /**
     * Restore all pools for this actor to their maximum value
     */
    refreshPools() {
        // If the actor is a minion then there are no pools to refresh
        if (this.type === 'minion') {
            return;
        }

        // Build the update to apply
        let changes = {};

        // Loop over each resistance and add the update to the map
        for (let [r, _] of Object.entries(this.system.resistances)) {
            // Add the required change for this resistance to the object
            changes['system.resistances.' + r + '.pool'] = this.getPoolMax(r);
        }

        // Set up the data for the chat message
        const chatData = { speaker: { actor: this.id, alias: this.name, token: this.token?.id, },
                           content: game.i18n.localize("THOSEWHOWANDER.chat.refresh_pools") };

        // Finally, send a chat message and update the actor itself
        ChatMessage.create(chatData);
        return this.update(changes);
    }

    /**
     * Get the maximum value of a pool (specified by resistance)
     */
    getPoolMax(resistance) {
        // If the actor is a minion then there are no pools to refresh
        if (this.type === 'minion') {
            return 0;
        }

        // Default the maximum to the number of dice in the resistance
        let dice = this.system.resistances[resistance].dice ?? 0;

        // Get the label of the pool to check for bonuses
        let pool = game.i18n.localize(CONFIG.THOSEWHOWANDER.pools[resistance]);

        // Calculate the bonus from talents, features, attacks, gear and weapons
        for (let i of this.items) {
            if (["talent","feature","attack"].includes(i.type)
                || ["gear","weapon"].includes(i.type) && i.system.equipped) {
                let bs = i.system.bonus;
                let re = new RegExp(`(^|,)\\s*${pool}\\s+([+-]\\d+)\\s*($|,)`);
                let m = bs.match(re);
                if (m && m[2] && m[2] != 0) {
                    dice += parseInt(m[2]) ?? 0;
                }
            }
        }

        // And return the calculated maximum
        return dice;
    }
}
