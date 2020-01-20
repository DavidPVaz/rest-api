/** 
 * @file Where different types of templates should be configured for each context.
 * 
 * These templates are used by Mail Generator to build HTML and Plain Text.
 */

/**
 * Get a custom registration template for `username`. 
 *
 * @param {string} username - The username to insert in the template.
 * 
 * @return {Object} A registration template object.
 */
function getRegistrationBody(username) {

    return {
        body: {
            name: `${username}`,
            greeting: 'Welcome',
            intro: 'Thank you for registering!',
            action: {
                button: {
                    color: '#48cfad', 
                    text: 'Go to my GitHub profile',
                    link: 'https://github.com/DavidPVaz'
                }
            },
            signature: 'Sincerely'
        }
    };
}
/** 
 * @module EmailTemplates
 */
export default {
    getRegistrationBody
};
