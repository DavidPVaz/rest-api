import { EventEmitter } from 'events';
import nodeMailer from './mailer';

const events = {
    userCreated: 'user created'
};

export default (function() {

    const privateMethods = new WeakMap();

    const Mailer = function(nodeMailer) {
        EventEmitter.call(this);

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

    Mailer.prototype.listen = function() {
        this.on(events.userCreated, privateMethods.get(this).sendRegistrationMailTo);
    };

    Mailer.prototype.reportUserCreated = function(user) {
        this.emit(events.userCreated, user);
    };

    return new Mailer(nodeMailer);

})();
