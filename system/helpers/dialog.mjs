/**
 * Extend the basic Dialog to add a system-specific class entry
 * @extends {Dialog}
 */
export class ThoseWhoWanderDialog extends Dialog {
    /** @override */
    constructor(dialogData = {}, options = {}) {
	super(dialogData, options);
	this.options.classes.unshift("those-who-wander");
    }
}
