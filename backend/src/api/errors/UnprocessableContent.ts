import { UNPROCESSABLE_CONTENT } from '../../utils/httpStatusCodes';

export default class UnprocessableContent extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnprocessableContent';
    this.stack = String(UNPROCESSABLE_CONTENT);
  }
}
