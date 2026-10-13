/**
 * Storage Utility for Arcade Web
 * Handles safe read/write operations with localStorage and JSON serialization.
 */

const STORAGE_PREFIX = 'ARCADE_WEB_';

export const storage = {
  /**
   * Save an item into localStorage
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(STORAGE_PREFIX + key, serialized);
      return true;
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
      return false;
    }
  },

  /**
   * Retrieve an item from localStorage
   * @param {string} key
   * @param {*} defaultValue
   */
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (raw === null || raw === undefined) {
        return defaultValue;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.warn('LocalStorage parse failed for key:', key, e);
      return defaultValue;
    }
  },

  /**
   * Remove an item from localStorage
   * @param {string} key
   */
  remove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Check if a key exists
   * @param {string} key
   */
  has(key) {
    return localStorage.getItem(STORAGE_PREFIX + key) !== null;
  }
};
