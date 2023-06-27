const USERNAME_MASK = '--username=';
const DEFAULT_USERNAME = 'Anonymous';

export const getNameByArg = () => {
  const args = process.argv[2];

  if (args && args.startsWith(USERNAME_MASK)) {
    return args.replace(USERNAME_MASK, '').trim();
  }

  return DEFAULT_USERNAME;
}
