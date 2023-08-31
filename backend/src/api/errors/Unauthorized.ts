import { UNAUTHORIZED } from '../../utils/httpStatusCodes';

export default class Unauthorized extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Unauthorized';
    this.stack = String(UNAUTHORIZED);
  }
}
