import { compareSync, genSaltSync, hashSync } from 'bcrypt';

export const hashString = (str: string, saltRounds = 10) => {
  const salt = genSaltSync(saltRounds);
  const hash = hashSync(str, salt);
  return hash;
};

export const checkPlainWithHash = (plain: string, hash: string) => {
  return compareSync(plain, hash);
};
