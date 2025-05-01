//authDtos.js


export class LoginRequestDto {
  constructor(email = "admin@gmail.com", password = "Admin@123") {
    this.email = email;
    this.password = password;
  }
}


export class RegisterRequestDto {
  constructor(email = "admin@gmail.com", password = "Admin@123") {
    this.email = email;
    this.password = password;
  }
}