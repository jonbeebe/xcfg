'use strict'

let os = require('os')
let path = require('path')
let fs = require('fs')

const DIR_MODE = parseInt('0700', 8)
const FILE_MODE = parseInt('0600', 8)

/**
 * Xcfg class
 */
class Xcfg {
  /**
   * Creates a new Xcfg instance, initializes config directory structure and
   * prepares a blank config file if it doesn't exist.
   *
   * @param {string} id - Identifier (used to create config directory in ~/.config), sanitized with: `id.replace(/[/?<>\\:*|" :]/g, '.').replace(/\.+/g, '.')`
   * @param {Object} options - options to change default behavior.
   * @param {string} options.confdir - override directory name (default: `'.config'`)
   * @param {number} options.dir_mode - override directory file mode (default: `parseInt('0700', 8)`).
   * @param {number} options.file_mode - override file mode (default: `parseInt('0600', 8)`).
   * @param {string} options.filename - override file name (default: `'config.json'`).
   * @param {boolean} options.minify - when saving config, minify the output (default: `false`).
   */
  constructor (id, options = {}) {
    // sanitize id
    this._id = id.replace(/[/?<>\\:*|" :]/g, '.').replace(/\.+/g, '.')

    // check options
    let confDir = options.confdir || '.config'
    let dirMode = options.dir_mode || DIR_MODE
    let filename = options.filename || 'config.json'
    this._file_mode = options.file_mode || FILE_MODE
    this._minify = !!options.minify

    // Create directory structure (same as mkdir -p)
    let dirParts = [os.homedir(), confDir, this._id]
    let dirPath = dirParts.reduce((acc, val) => {
      let currPath = acc + path.sep + val
      if (!fs.existsSync(currPath)) {
        fs.mkdirSync(currPath, dirMode)
      }
      return currPath
    })

    // Create config.json if it doesn't exist
    this._file_path = path.join(dirPath, filename)
    if (!fs.existsSync(this._file_path)) {
      let fd = fs.openSync(this._file_path, 'w', this._file_mode)
      if (fd) {
        fs.closeSync(fd)
      } else {
        throw new Error('There was a problem opening ' + this._file_path)
      }
    }

    this._data = {} // holds data that will be written to config.json
  }

  /**
   * Returns the sanitized version identifier that was passed to the constructor.
   *
   * @returns {string} - this id was used to create the config directory in ~/.config
   */
  id () {
    return this._id
  }

  /**
   * Returns value at provided key.
   *
   * @param {string} key - retrieve the data stored at this key.
   * @returns {any} the data at the provided key.
   */
  get (key) {
    checkKey('get', key)
    return this._data[key]
  }

  /**
   * Store data at provided key and optionally save (async) to disk.
   *
   * @param {string} key - store data at this key.
   * @param {any} value - data to store at provided key.
   * @param {boolean} shouldSave - save to disk (default: `false`).
   * @param {function} callback - function to call if `shouldSave` is set to `true`
   */
  set (key, value = '', shouldSave = false, callback) {
    checkKey('set', key)
    this._data[key] = value
    if (shouldSave) {
      this.save(callback)
    }
  }

  /**
   * Delete data at provided key and optionally save (async) to disk.
   *
   * @param {string} key - delete the data at this key.
   * @param {boolean} shouldSave - save to disk (default: `false`).
   * @param {function} callback - function to call if `shouldSave` is set to `true`
   */
  del (key, shouldSave = false, callback) {
    checkKey('del', key)
    delete this._data[key]
    if (shouldSave) {
      this.save(callback)
    }
  }

  /**
   * Delete data at all keys optionally save (async) to disk.
   *
   * @param {boolean} shouldSave - save to disk (default: `false`).
   * @param {function} callback - function to call if `shouldSave` is set to `true`
   */
  deleteAll (shouldSave = false, callback) {
    this._data = {}
    if (shouldSave) {
      this.save(callback)
    }
  }

  /**
   * Saves config data to disk.
   *
   * @param {function} callback - function to call after save operation.
   */
  save (callback) {
    let saveData
    if (this._minify) {
      saveData = JSON.stringify(this._data)
    } else {
      saveData = JSON.stringify(this._data, null, 2)
    }

    fs.writeFile(this._file_path, saveData, {
      'mode': this._file_mode,
      'flag': 'w'
    }, callback)
  }
}

function checkKey (method, key) {
  if (!key || typeof key !== 'string') {
    throw new Error('Xcfg ' + method + '() key must be a string')
  }
}

module.exports = Xcfg
