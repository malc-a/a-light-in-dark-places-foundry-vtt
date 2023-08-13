// Import the dice roll dialogue from the roll helper
import { ALiDPRoll } from "../helpers/roll.mjs";

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ALiDPActor extends Actor {

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
        // Set up the actor's derived values
        if (this.type === 'minion') {
            // Calculate the total dice and fake health/injuries bars for minions
            this.system.dice = this.system.number * this.system.threat;
            this.system.health = { value: 0, max: 0 };
            this.system.injuries = { value: this.system.damage, max : this.system.dice };
        } else {
            // Calculate pool/injuries bars for everyone else
            const imax = CONFIG.ALIDP.maxInjuries[this.type];
            for (let [k, v] of Object.entries(this.system.resistances)) {
                this.system[CONFIG.ALIDP.pools[k]] =
                    { value: this.system.resistances[k].pool, max: this.getPoolMax(k) };
            }
            this.system.injuries = { value: this.system.resistances.body.injuries, max: imax };
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
        const rolltype = game.i18n.localize("ALIDP.rolls.resistance");
        const label = `[${rolltype}] ` + game.i18n.localize(`ALIDP.resistance.${resistance}`);
        const dice = this.system.resistances[resistance].dice;
        return ALiDPRoll.Roll({
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
        const rolltype = game.i18n.localize("ALIDP.rolls.wealth");
        const label = `[${rolltype}] ${rolltype}`;
        const dice = this.system.wealth ?? 0;
        return ALiDPRoll.Roll({
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
        const rolltype = game.i18n.localize("ALIDP.rolls.minion");
        const label = `[${rolltype}] ${rolltype}`;
        const dice = (this.system.dice ?? 0) - (this.system.damage ?? 0);
        return ALiDPRoll.Roll({
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
        // The maximum Injuries depends on the actor type
        const imax = (this.type === 'minion') ? this.system.dice ?? 0 :
              CONFIG.ALIDP.maxInjuries[this.type];

        // First sanity check the injuries
        injuries = ((injuries ?? 0) >= 0) ? (injuries ?? 0) : 0;
        injuries = ((injuries ?? 0) <= imax) ? injuries : imax;

        // Default the changes we're making to the actor
        let changes = {};

        // Handle injuries to minions, which work a little differently
        if (this.type === 'minion' && resistance === 'minion') {
            changes['system.damage'] = injuries;
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
                           content: game.i18n.localize("ALIDP.chat.refresh_pools") };

        // Finally, send a chat message and update the actor itself
        ChatMessage.create(chatData);
        return this.update(changes);
    }

    /**
     * Get the maximum value of a pool (specified by resistance)
     */
    getPoolMax(resistance) {
        // If the actor is a minion then they have no pools
        if (this.type === 'minion') {
            return 0;
        }

        // Default the maximum to the number of dice in the resistance
        let dice = this.system.resistances[resistance].dice ?? 0;

        // Get the label of the pool to check for bonuses
        let pool = CONFIG.ALIDP.pools[resistance];
        let label = game.i18n.localize("ALIDP.pool." + pool) ?? pool;

        // Calculate the bonus from talents, features, attacks, gear and weapons
        for (let i of this.items) {
            if (["talent","feature","attack"].includes(i.type)
                || ["gear","weapon"].includes(i.type) && i.system.equipped) {
                let bs = i.system.bonus;
                let re = new RegExp(`(^|,)\\s*${label}\\s+([+-]\\d+)\\s*($|,)`);
                let m = bs.match(re);
                if (m && m[2] && m[2] != 0) {
                    dice += parseInt(m[2]) ?? 0;
                }
            }
        }

        // And return the calculated maximum
        return dice;
    }

    /**
     * Returns the actor's build data; only relevant to characters
     */
    getBuild() {
        // Calculate the points cost of a number of dice
        function pointsCost(dice) {
            // Set up the defaults
            let cost = 0;
            let each = 1;

            // Calculate the cost
            for (let i = 0; i < dice; i++) {
                if (i > 0 && (i % 4) == 0) { each *= 2; }
                cost += each;
            }

            // And return it
            return(cost);
        }

        // This function is only available (or useful) for characters
        if (this.type !== 'character') { return; }

        // Initialise the data for the character
        let build = {
            counts: { skill: 0, school: 0, wealth: 0, talent: 0, language: 0 },
            points: { resistance: 0, skill: 0, school: 0, wealth: 0, talent: 0 },
            spells: {},
            total: 0,
        }

        // Calculate the points spent on resistances
        for (let [k, v] of Object.entries(this.system.resistances)) {
            build.points.resistance += pointsCost(v.dice);
        }

        // Calculate the points spent on wealth
        build.points.wealth = pointsCost(this.system.wealth);
        build.counts.wealth = this.system.wealth;

        // Now loop over the actor's items to handle them
        for (let i of this.items) {
            if (["skill","school"].includes(i.type)) {
                // Calculate the points spent on abilities
                build.counts[i.type]++;
                build.points[i.type] += pointsCost(i.system.dice);

                // If this is a school then default the spells and set the dice
                if (i.type === 'school' && !(i.name in build.spells)) {
                    build.spells[i.name] = { dice: i.system.dice, count: 0, complexity: 0 };
                } else if (i.type === 'school') {
                    build.spells[i.name].dice = i.system.dice;
                }
            } else if (["language","talent"].includes(i.type)) {
                // Just count languages as they may be free
                build.counts[i.type] += 1;
            } else if (i.type == "spell") {
                // Add the spell data to the spells
                if (!(i.system.school in build.spells)) {
                    build.spells[i.system.school] = { dice: 0, count: 0, complexity: 0 };
                }
                build.spells[i.system.school].count++;
                build.spells[i.system.school].complexity += i.system.complexity;
            }
        }

        // Set up the points cost of any talents; the first 3 are free
        build.points.talent = (build.counts.talent > 3) ? (build.counts.talent - 3) * 2 : 0;

        // Now get the total points for the character
        build.total = Object.values(build.points).reduce((a, b) => a + b, 0);

        // Return the details of the character build
        return(build);
    }
}
