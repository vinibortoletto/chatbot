import { BAD_REQUEST } from '../../utils/httpStatusCodes';

export default class BadRequest extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequest';
    this.stack = String(BAD_REQUEST);
  }
}
