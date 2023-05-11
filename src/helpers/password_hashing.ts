import { compareSync, genSaltSync, hashSync } from 'bcrypt-nodejs';

export const hashPassword = (password: string, saltRounds = 10) => {
  const salt = genSaltSync(saltRounds);
  const hash = hashSync(password, salt);
  return hash;
};

export const checkPasswordWithHash = (
  plainPassword: string,
  hashPassword: string
) => {
  return compareSync(plainPassword, hashPassword);
};
