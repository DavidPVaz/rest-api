/** 
 * @module Server 
 */
import Glue from '@hapi/glue';
import Config from '../../config';
import Plugins from '../plugins';

const manifest = {
    server: {
        host: Config.host,
        port: Config.port,
        tls: Config.tls,
        routes: {
            cors: Config.cors
        }
    },
    register: { plugins: Plugins }
};

function registerNodeSignals(hapi) {

    const nodeSignals = [ 'exit', 'SIGINT' ];

    nodeSignals.forEach(function(signal) {

        process.on(signal, function() { 
            
            hapi.stop().then(function(err) {
                console.log('Hapi server stopped');
                process.exit((err) ? 1 : 0);
            });
        });

    });
}

export default {
    build: async () => Glue.compose(manifest),
    registerNodeSignals
};
