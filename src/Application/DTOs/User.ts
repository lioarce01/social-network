export type UpdateUserDTO = {
  name?: string;
  profile_pic?: string;
  headline?: string;
  country?: string;
  postal_code?: string;
  city?: string;
  current_position?: string;
};

export class CreateUserDTO
{
  constructor(
    public readonly sub: string,
    public readonly profile_pic: string,
    public readonly email: string,
    public readonly name?: string,
  ) { }
}

export class FollowerDTO
{
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly profile_pic: string,
    public readonly headline: string,
  ) { }
}
