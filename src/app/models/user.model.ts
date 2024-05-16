export class User {
  email? : string;
  role? : string;
}

export class UserCreate {
  email? : string;
  password? : string;
  confirmPassword? : string;
  role? : string;
}

export class UserChangePass {
  email? : string;
  password? : string;
  confirmPassword? : string;
}

export class UserDelete {
  email? : string;
}
