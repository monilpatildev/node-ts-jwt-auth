import bcrypt from "bcrypt";

class PasswordManager {
  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }
  public async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

export default new PasswordManager();
