// pref2 module

// prefs:
// custom_temp_dir
// use_custom_temp_dir
// extension.###

import * as pref from './pref'

function normalizeExtension(ext: string) {
  return (ext || '').toLowerCase()
}

export default {
  get customTempDir(): string {
    return pref.get('custom_temp_dir') || ""
  },
  set customTempDir(val: string) {
    pref.set('custom_temp_dir', val)
  },

  get useCustomTempDir(): boolean {
    return pref.get('use_custom_temp_dir') === "1"
  },
  set useCustomTempDir(val: boolean) {
    pref.set('use_custom_temp_dir', val ? "1" : "0")
  },

  setExtensionCommand(extension: string, command: string): void {
    pref.set(`extension.${normalizeExtension(extension)}`, command)
  },
  removeExtensionCommand(extension: string): void {
    pref.remove(`extension.${normalizeExtension(extension)}`)
  },
  getExtensionCommand(extension: string): string | null {
    return pref.get(`extension.${normalizeExtension(extension)}`)
  },
}
