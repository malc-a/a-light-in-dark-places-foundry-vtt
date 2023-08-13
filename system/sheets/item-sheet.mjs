/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class ThoseWhoWanderItemSheet extends ItemSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["those-who-wander", "sheet", "item"],
            width: 350,
            height: 400,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }

    /** @override */
    get template() {
        const path = "systems/those-who-wander/templates/item";

        // Return the location of the specific item template
        return `${path}/item-${this.item.type}-sheet.html`;
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        // Retrieve base data structure.
        const context = super.getData();

        // Use a safe clone of the item data for further operations.
        const itemData = context.item;

        // Retrieve the roll data for TinyMCE editors.
        context.rollData = {};
        let actor = this.object?.parent ?? null;
        if (actor) {
            context.rollData = actor.getRollData();
        }

        // Add the item's data to context.data for easier access, as well as flags.
        context.system = itemData.system;
        context.flags = itemData.flags;

        return context;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;

	// Set up validating input fields on the sheet
	const inputs = html.find('input');
	for (const i of html.find('input')) {
	    // We only validate numeric fields, so only set up the listener for them
	    if (i.type === 'number') {
		i.addEventListener('change', () => {
		    // If the value isn't valid then default it to the minumum or zero
		    if (!i.checkValidity()) {
			// See if we can get the current value, if not default it
			const c = getProperty(this.object, i.name ?? "");
			i.value = c ?? (i.min ?? 0).toString();
		    }
		});
	    }
	}
    }
}
