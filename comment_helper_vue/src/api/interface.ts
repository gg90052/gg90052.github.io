export interface ProfileDataType {
  Member: {
    CreateTime: string;
    Gender: number;
    Phone: string;
    Point: number;
    Status: number;
    StreamerID: number;
    UserName: string;
    NickName: string | null;
    HerderVersion: number;
    Password: string;
  },
  Detail: {
    Area: string;
    Birthday: string;
    Description: string | null;
    Email: string | null;
    EmailVerified: boolean;
    LastLoginIP: string | null;
    LastLoginTime: string | null;
    Name: string | null;
    StreamerID: number;
  }
}