/* eslint-disable import/prefer-default-export */
import { CONNECTION_CLOSED_ERROR_MESSAGE } from '../constants/ws-constants';

/**
 * @param {Error} error
 * @param {() => any} [handler]
 */
export function handleConnectionClosedError(error, handler) {
	if (error.message === CONNECTION_CLOSED_ERROR_MESSAGE) return handler && handler();
	throw error;
}
