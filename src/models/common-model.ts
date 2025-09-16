export interface AuthUser
{
  Error:string;
  Value:string;
}
export interface UserCredential {
  email: string;
  password: string;
}
export interface UserDetails {
  firstName: string;
  lastName: string;
  role: string;
  state: string;
  address: string[];
  dob: string;
  _id: Id;
  emailId: string;
  active: boolean;
  phoneNumber: string;
  addressLine1: string;
  zipCode: string;
  twofactorAuthentication: boolean;
  loginId: string;
  status: string;
  createdDateTime: CreatedDateTime;
  gender: string;
  city: string;
  parentUser: string;
  fullName: string;
  adminInfo: AdminInfo;
  addressLine2: string;
  country: string;
  userProfile: string;
}

export interface Id {
  $oid: string;
}

export interface CreatedDateTime {
  $date: string;
}

export interface AdminInfo {
  type: string;
  options: string[];
}