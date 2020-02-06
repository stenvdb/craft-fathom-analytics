/* eslint-disable import/no-extraneous-dependencies */
import Debug from 'debug';
/* eslint-enable import/no-extraneous-dependencies */
import project from '../config/project.config';
import server from '../server/main';

const debug = Debug('webpack');

debug('Just before listening to server');
server.listen(project.serverPort);
debug(`🚎 Server is now running at http://localhost:${project.serverPort}.`);
