export interface UserType extends Omit<User, 'password' | 'sessions'> {}
