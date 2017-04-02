'use strict'

const Xcfg = require('./xcfg')
const expect = require('chai').expect
const path = require('path')
const os = require('os')
const fs = require('fs')

const id = 'net.jonbeebe.lib.xcfg'
const configDir = path.join(os.homedir(), '.config', id)
const configPath = path.join(configDir, 'config.json')

describe('Xcfg class', () => {
  let xcfg = new Xcfg(id)

  describe('new Xcfg()', () => {
    it('instance init', () => {
      expect(xcfg).to.not.equal(undefined)
    })

    it('config directory and file creation', () => {
      let fileExists = fs.existsSync(configPath)
      expect(fileExists).to.equal(true)
    })
  })

  describe('- get()', () => {
    it('return proper value after set()', () => {
      xcfg.set('bar', 'foo')
      expect(xcfg.get('bar')).to.equal('foo')
    })
  })

  describe('- set()', () => {
    it('in memory set()', () => {
      xcfg.set('foo', 'bar')
      expect(xcfg._data.foo).to.equal('bar')
    })

    it('save after set()', (done) => {
      xcfg.set('foo', 'bar', true, () => {
        let jsonData = JSON.parse(readConfig())
        expect(jsonData.foo).to.equal('bar')
        done()
      })
    })
  })

  describe('- del()', () => {
    it('in memory del()', () => {
      xcfg.set('foo', 'bar')
      xcfg.del('foo')
      expect(xcfg._data.foo).to.equal(undefined)
    })

    it('save after del()', (done) => {
      xcfg.set('foo', 'bar', true, () => {
        xcfg.del('foo', true, () => {
          let jsonData = JSON.parse(readConfig())
          expect(jsonData.foo).to.equal(undefined)
          done()
        })
      })
    })
  })

  describe('- save()', () => {
    it('verify file contents after save()', (done) => {
      xcfg.set('foo', 'bar')
      xcfg.set('bar', 'foo')
      xcfg.save(() => {
        let jsonData = JSON.parse(readConfig())
        expect(jsonData.foo).to.equal('bar')
        expect(jsonData.bar).to.equal('foo')
        done()
      })
    })
  })

  describe('- deleteAll()', () => {
    it('in memory deleteAll()', () => {
      xcfg.set('foo', 'bar')
      xcfg.set('bar', 'foo')
      xcfg.deleteAll()
      expect(xcfg._data.foo).to.equal(undefined)
      expect(xcfg._data.bar).to.equal(undefined)
    })

    it('save after deleteAll()', (done) => {
      xcfg.set('foo', 'bar')
      xcfg.set('bar', 'foo', true, () => {
        xcfg.deleteAll(true, () => {
          let jsonData = JSON.parse(readConfig())
          expect(jsonData.foo).to.equal(undefined)
          expect(jsonData.bar).to.equal(undefined)
          done()
        })
      })
    })
  })

  after(cleanUp)
})

function readConfig () {
  return fs.readFileSync(configPath, { encoding: 'utf-8' })
}

function cleanUp () {
  fs.unlinkSync(configPath)
  fs.rmdirSync(configDir)
}
