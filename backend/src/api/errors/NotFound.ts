import { NOT_FOUND } from '../../utils/httpStatusCodes';

export default class NotFound extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFound';
    this.stack = String(NOT_FOUND);
  }
}
