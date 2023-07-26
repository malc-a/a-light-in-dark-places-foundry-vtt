/**
 * Extend the basic JournalSheet to add a system-specific class entry
 * @extends {JournalSheet}
 */
export class ThoseWhoWanderJournalSheet extends JournalSheet {
    /** @override */
    static get defaultOptions() {
	let options = super.defaultOptions;
	options.classes.unshift("those-who-wander");
	return options;
    }
}
