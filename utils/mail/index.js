import { EventEmitter } from 'events';
import nodeMailer from './mailer';
/**
 * Enum for event types.
 * 
 * @readonly
 * @enum {sring}
 */
const events = {
    USER_CREATED: 'user created'
};
/** 
 * @module Mailer
 */
export default (function() {

    const privateMethods = new WeakMap();
    /**
     * Encapsulates the events registration and triggering.
     * 
     * @constructor
     * @extends {EventEmitter}
     *
     * @param {Object} nodeMailer - Who actually possess methods capable of sending emails.
     */
    const Mailer = function(nodeMailer) {
        EventEmitter.call(this);
        /**
         * Sends a registration email to the specified user.
         *
         * @param {Object} user - The user object from which to extract the needed details.
         */
        const sendRegistrationMailTo = user => {
            setImmediate(async () => {
                await nodeMailer.sendRegistrationMailTo(user);
            });
        };

        privateMethods.set(this, {
            sendRegistrationMailTo
        });
    };

    Mailer.prototype = Object.create(EventEmitter.prototype);
    Mailer.prototype.constructor = Mailer;
    /** 
     * Registers all events and listeners. 
     */
    Mailer.prototype.listen = function() {
        this.on(events.USER_CREATED, privateMethods.get(this).sendRegistrationMailTo);
    };
    /**
     * Emits USER_CREATED event.
     * 
     * @param {Object} user - User object to attach to this event.
     */
    Mailer.prototype.reportUserCreated = function(user) {
        this.emit(events.USER_CREATED, user);
    };

    return new Mailer(nodeMailer);

})();
