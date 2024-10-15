export class IdsServiceBaseResponseDto<T> {
  data: T;
  code: string;
  message: string;
  success: boolean;
}
