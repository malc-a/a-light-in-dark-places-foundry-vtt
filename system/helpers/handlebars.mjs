/**
 * Register any required Handlebars templates
 * @return {Promise}
 */
export const registerHandlebarsHelpers = async function() {
    // A helper to handle injury tracks on actor sheets
    return Handlebars.registerHelper('injuries', function(field, options) {
        // Extract the value of the injuries
        const value = Number(options.hash.value);
        const max = Number(options.hash.max);

	// Get the tooltip we should use for an Injury track
	const label = game.i18n.localize("THOSEWHOWANDER.tooltip.injuries");

        // Build the HTML for the injury track
        let s = `<a title="${label}" class="injuries" data-field="${field}" data-max="${max}">`;
	for (let i = 0; i < max; i++) {
            s += (i >= value) ? '<i class="far fa-circle"></i>' : '<i class="fas fa-circle"></i>'
        }
        s += '</a>';
        return new Handlebars.SafeString(s);
    });
}
