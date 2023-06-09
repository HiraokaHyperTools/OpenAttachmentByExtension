// pref module

export function get(key: string): string | null {
  return localStorage.getItem(`pref.${key}`)
}

export function set(key: string, value: string): void {
  localStorage.setItem(`pref.${key}`, value)
}

export function remove(key: string): void {
  localStorage.removeItem(`pref.${key}`)
}

export function listKeys(): string[] {
  const list = []
  for (let i = 0; i < localStorage.length; i++) {
    const rawKey = localStorage.key(i)
    if (rawKey && rawKey.startsWith('pref.')) {
      list.push(rawKey.substring(5))
    }
  }
  return list
}
