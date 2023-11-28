'use server';

// Import packages
import pify from 'pify';
import 'node-self';
import ee from '@google/earthengine';

// Promisify some function
const eeCallback = { multiArgs: true, errorFirst: false };
export const authenticateViaPrivateKey = pify(ee.data.authenticateViaPrivateKey);
export const initialize = pify(ee.initialize);
export const getMapId = pify(ee.data.getMapId, eeCallback);
