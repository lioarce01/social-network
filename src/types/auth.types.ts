export interface AuthRequest extends Request
{
  auth?: {
    sub: string;
    email?: string;
    name?: string;
    picture?: string
  };
}

export interface DeletePostRequest extends Request
{
  auth?: {
    sub: string;
    [key: string]: any;
  };
  postBody: {
    id: string;
  };
}
