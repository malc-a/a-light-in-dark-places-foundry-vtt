// Import the custom dialogue from the dialogue helper
import { ALiDPDialog } from "../helpers/dialog.mjs";

// Import some effects management functions from the effects helper
import {onManageActiveEffect, prepareActiveEffectCategories} from "../helpers/effects.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ALiDPActorSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["a-light-in-dark-places", "sheet", "actor"],
            template: "systems/a-light-in-dark-places/templates/actor/actor-sheet.html",
            width: 600,
            height: 600,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }]
        });
    }

    /** @override */
    get template() {
        return `systems/a-light-in-dark-places/templates/actor/actor-${this.actor.type}-sheet.html`;
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        // Retrieve the data structure from the base sheet. You can inspect or log
        // the context variable to see the structure, but some key properties for
        // sheets are the actor object, the data object, whether or not it's
        // editable, the items array, and the effects array.
        const context = super.getData();

        // Use a safe clone of the actor data for further operations.
        const actorData = this.actor.toObject(false);

        // Add the actor's data to context.data for easier access, as well as flags.
        context.system = actorData.system;
        context.flags = actorData.flags;

        // Prepare actor data and items
        this._prepareItems(context, (actorData.type === 'character'));
        this._prepareData(context);

        // Add roll data for TinyMCE editors.
        context.rollData = context.actor.getRollData();

        // Prepare active effects
        context.effects = prepareActiveEffectCategories(this.actor.effects);

        return context;
    }

    /**
     * Initialise data for Actor sheets.
     *
     * @param {Object} actorData The actor to prepare.
     *
     * @return {undefined}
     */
    _prepareData(context) {
        // Handle resistance and pool labels
        for (let [k, v] of Object.entries(context.system.resistances)) {
            // Get the name of the pool related to the resistance
            const pool = CONFIG.ALIDP.pools[k];

            // And set up the labels
            v.label = game.i18n.localize("ALIDP.resistance." + k) ?? k;
            v.pool_label = game.i18n.localize("ALIDP.pool." + pool) ?? pool;
        }
    }

    /**
     * Organize and classify Items for Character sheets.
     *
     * @param {Object} actorData The actor to prepare.
     *
     * @return {undefined}
     */
    _prepareItems(context, pc) {
        // Initialize containers.
        const skills = [];
        const schools = [];
        const spells = [];
        const talents = [];
        const problems = [];
        const languages = [];
        const gear = [];

        // Iterate through items, allocating to containers
        for (let i of context.items) {
            i.img = i.img || DEFAULT_TOKEN;
            if (i.type === 'skill') { // Skill
                skills.push(i);
            } else if (i.type === 'school') { // School of Magic
                schools.push(i);
            } else if (i.type === 'spell') { // Spell
                spells.push(i);
            } else if (i.type === 'talent') { // Talent
                talents.push(i);
            } else if (i.type === 'language') { // Language
                languages.push(i);
            } else if (i.type === 'gear') { // Gear
                gear.push(i);
            } else if (i.type === 'weapon') { // Weapons
                gear.push(i);
            } else if (pc && i.type === 'problem') { // Problem
                problems.push(i);
            } else if (!pc && i.type === 'feature') { // Special Feature
                talents.push(i);
            } else if (!pc && i.type === 'attack') { // Special Attack
                talents.push(i);
            }
        }

        // Assign and return
        context.skills = skills;
        context.schools = schools;
        context.spells = spells;
        context.talents = talents;
        context.problems = problems;
        context.languages = languages;
        context.gear = gear;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Render the item sheet for viewing/editing prior to the editable check.
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.sheet.render(true);
        });

        // The character build report popup
        html.find('.show-build-report').click(this._onBuildReport.bind(this));

        // -------------------------------------------------------------
        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;

        // Set up validating input fields on the sheet
        const inputs = html.find('input');
        for (const i of html.find('input')) {
            // We only validate numeric fields, so only set up the listener for them
            if (i.type === 'number') {
                i.addEventListener('change', () => {
                    // If the value isn't valid then we need to fix it
                    if (!i.checkValidity()) {
                        // See if we can get the current value, if not default it
                        const c = getProperty(this.actor, i.name ?? "");
                        i.value = c ?? (i.min ?? 0).toString();
                    } else if (i.value === "") {
                        // Numerical fields with no input should be set to zero
                        i.value = "0";
                    }
                });
            }
        }

        // Handle increasing or decreasing injuries
        html.find('.injuries').on('click contextmenu', ev => {
            // Gather the values passed by the template
            const element = ev.currentTarget;
            const field = element.dataset.field;
            const max = element.dataset.max;

            // Figure out the updated number of injuries
            let value = foundry.utils.getProperty(this.actor, field) ?? 0;
            value = (ev.type === 'click') ? value + 1 : value - 1;
            value = (value < 0) ? 0 : (value > max) ? max : value;

            // Now build and apply the update
            const update = { [field]: value };
            return this.actor.update(update);
        });

        // Handle the buttons to increase and decrease speed
        html.find('.increase-speed').click(ev => {
            const update = { 'system.speed': (this.actor.system.speed ?? 0) + 1 };
            return this.actor.update(update);
        });
        html.find('.decrease-speed').click(ev => {
            const update = { 'system.speed': Math.max((this.actor.system.speed ?? 0) - 1, 1) };
            return this.actor.update(update);
        });

        // Handle the button to refresh the pools
        html.find('.refresh-pools').click(ev => {
            return this.actor.refreshPools();
        });

        // Handle the buttons to increase and decrease actions
        html.find('.add-action').click(ev => {
            return this.actor.updateActions((this.actor.system.actions ?? 0) + 1);
        });
        html.find('.remove-action').click(ev => {
            return this.actor.updateActions((this.actor.system.actions ?? 0) - 1);
        });

        // Handle equipping gear
        html.find('.item-equip').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            const updateData = { 'system.equipped': !item.system.equipped };
            return item.update(updateData);
        });

        // Add Inventory Item
        html.find('.item-create').click(this._onItemCreate.bind(this));

        // Delete Inventory Item
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.delete();
            li.slideUp(200, () => this.render(false));
        });

        // Active Effect management
        html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

        // Rollable abilities
        html.find('.rollable').click(this._onRoll.bind(this));

        // Drag events for macros.
        if (this.actor.isOwner) {
            let handler = ev => this._onDragStart(ev);
            html.find('li.item').each((i, li) => {
                if (li.classList.contains("inventory-header")) return;
                li.setAttribute("draggable", true);
                li.addEventListener("dragstart", handler, false);
            });
        }
    }

    /**
     * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
     * @param {Event} event   The originating click event
     * @private
     */
    async _onItemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        // Get the type of item to create.
        const type = header.dataset.type;
        // Grab any data associated with this control.
        const data = duplicate(header.dataset);
        // Initialize a default name.
        const name = `New ${type.capitalize()}`;
        // Prepare the item object.
        const itemData = {
            name: name,
            type: type,
            system: data
        };
        // Remove the type from the dataset since it's in the itemData.type prop.
        delete itemData.system["type"];

        // Finally, create the item!
        return await Item.create(itemData, {parent: this.actor});
    }

    /**
     * Handle clickable rolls.
     * @param {Event} event   The originating click event
     * @private
     */
    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;

        if (element.dataset.rollType) {
            // Handle resistance, wealth and minion attack rolls
            if (element.dataset.rollType == 'resistance') {
                this.actor.rollResistance(event, element.dataset.label);
            } else if (element.dataset.rollType == 'wealth') {
                this.actor.rollWealth(event);
            } else if (element.dataset.rollType == 'minion') {
                this.actor.rollMinionDice(event);
            }

            // Handle skill, school, spell, talent, feature, atttack, gear or weapon rolls
            if (["skill","school","spell","talent","feature","attack",
                 "gear","weapon"].includes(element.dataset.rollType)) {
                const itemId = element.closest('.item').dataset.itemId;
                const item = this.actor.items.get(itemId);
                if (item) return item.roll();
            }
        }
    }

    /**
     * Handle displaying the build report.
     * @param {Event} event   The originating click event
     * @private
     */
    async _onBuildReport(event) {
        // Stop processing the event here
        event.preventDefault();

        // Render the template for the report with the build details
        const template = "systems/a-light-in-dark-places/templates/chat/build-report.html";
        const dialogData = { build: this.actor.getBuild() };
        const html = await renderTemplate(template, dialogData);

        // The button to close the build report window
        let buttons = {
            ok: {
                label: game.i18n.localize("ALIDP.buildReport.ok"),
                callback: (html) => {},
            },
        };

        // Create the dialog window
        return new Promise((resolve) => {
            new ALiDPDialog({
                title: game.i18n.localize("ALIDP.buildReport.title"),
                content: html,
                buttons: buttons,
            }).render(true);
        });
    }
}
