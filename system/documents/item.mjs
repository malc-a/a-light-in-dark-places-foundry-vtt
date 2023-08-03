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
        const rolltype = game.i18n.localize("THOSEWHOWANDER.rolls." + this.type);
        const label = `[${rolltype}] ${this.name}`;

        // Default the dice for each category
        let ability_dice = 0;
        let bonus_dice = 0;
        let injury_penalty = 0;
        let action_penalty = 0;

        // Handle ability and spell rolls
        if (["skill","school","spell"].includes(this.type)) {
            // Which ability will we be rolling?
            let ability = this.name;

            // Spells are rolled by using the related School
            if (this.type =="spell") {
                // We're using the School for the spell
                ability = this.system.school;

                // Find the related School of magic
                for (let i of this.actor.items) {
                    // Have we found the school matching the spell?
                    if (i.type == "school" && i.name == ability) {
                        ability_dice = i.system.dice ?? 0;
                    }
                }
            } else {
                // Start out with the dice from the ability
                ability_dice = this.system.dice ?? 0;
            }

            // Calculate the bonus from talents, features, attacks, gear and weapons
            for (let i of this.actor.items) {
                if (["talent","feature","attack"].includes(i.type)
                    || ["gear","weapon"].includes(i.type) && i.system.equipped) {
                    let bs = i.system.bonus;
                    let re = new RegExp(`(^|,)\\s*${ability}\\s+([+-]\\d+)d\\s*($|,)`);
                    let m = bs.match(re);
                    if (m && m[2] && m[2] != 0) {
                        bonus_dice += parseInt(m[2]) ?? 0;
                    }
                }
            }
        } else if (["talent","feature","attack","gear","weapon"].includes(this.type)) {
            // Find the related ability and optional bonus
            let valid = false;
            const m = this.system.bonus.match(/(^|,)\s*([\w\s]+)\s+([+-]\d+)do?\s*(,|$)/);
            if (m) {
		// Handle a bonus to minion dice or regular abilities
		const minionDice = game.i18n.localize("THOSEWHOWANDER.rolls.minion");
		if (this.actor.type == "minion" && m[2] === minionDice) {
		    ability_dice = (this.actor.system.dice ?? 0)
			- (this.actor.system.injuries ?? 0);
		    bonus_dice = parseInt(m[3]) ?? 0;
		    valid = true;
		} else for (let i of this.actor.items) {
                    // Have we found the ability matching the optional bonus?
                    if (["skill","school"].includes(i.type) && i.name == m[2]) {
                        ability_dice = i.system.dice ?? 0;
                        bonus_dice = parseInt(m[3]) ?? 0;
                        valid = true;
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
            injury_penalty += (v.injuries ?? 0);
        }

        // Calculate the penalty for multiple actions
        action_penalty = Math.max(((this.actor.system.actions ?? 0) - (this.actor.system.speed ?? 1)) * 2, 0);

        // Invoke the roll and submit it to chat
        return ThoseWhoWanderRoll.Roll({
            title: label,
            speaker: speaker,
            flavor: label,
            dice: ability_dice + bonus_dice - injury_penalty - action_penalty,
        });
    }
}
