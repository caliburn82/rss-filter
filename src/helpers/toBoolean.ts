export default function toBoolean(string: string): boolean {
  return ['yes', '1', 'true', '(true)'].includes(string.toLowerCase());
}
