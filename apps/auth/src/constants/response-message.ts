/* eslint-disable prettier/prettier */
import { ResponseCodes } from './response-code';

export const ResponseMessage =  {
  [ResponseCodes.SUCCESS.BASE_SUCESS]: 'base.BASE_SUCESS',
  [ResponseCodes.SUCCESS.AUTH_SUCCESS]: 'base.AUTH_SUCCESS',
  [ResponseCodes.SUCCESS.USER_CREATED]: 'base.USER_CREATED',
  [ResponseCodes.ERROR.AUTH_FAILED]: 'base.AUTH_FAILED',
  [ResponseCodes.ERROR.USER_NOT_FOUND]: 'base.USER_NOT_FOUND',
  [ResponseCodes.ERROR.INVALID_CREDENTIALS]: 'base.INVALID_CREDENTIALS',
  [ResponseCodes.ERROR.PASSWORD_MISMATCH]: 'base.PASSWORD_MISMATCH',
  [ResponseCodes.ERROR.USER_ALREADY_EXISTS]: 'base.USER_ALREADY_EXISTS',
  [ResponseCodes.ERROR.INTERNAL_SERVER_ERROR]: 'base.INTERNAL_SERVER_ERROR',
  [ResponseCodes.ERROR.VALIDATION_ERROR]: 'base.VALIDATION_ERROR',
  [ResponseCodes.ERROR.UNAUTHORIZED]: 'base.UNAUTHORIZED',
  [ResponseCodes.ERROR.FORBIDDEN]: 'base.FORBIDDEN',
  [ResponseCodes.ERROR.NOT_FOUND]: 'base.NOT_FOUND',
};
