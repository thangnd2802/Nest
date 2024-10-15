export class BaseCreateIdsUserDto {
  password: string;
}
export class CreateIdsUserByEmailDto extends BaseCreateIdsUserDto {
  email: string;
}
export class CreateIdsUserByPhoneDto extends BaseCreateIdsUserDto {
  phone: string;
}
