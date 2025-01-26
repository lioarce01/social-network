export type UpdateUserDTO = {
  name?: string;
  profile_pic?: string;
  headline?: string;
  country?: string;
  postal_code?: string;
  city?: string;
  current_position?: string;
};

export class FollowerDTO {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly profile_pic: string,
    public readonly headline: string,
  ) {}
}
