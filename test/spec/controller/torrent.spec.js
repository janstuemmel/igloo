jest.mock('../../../src/model/torrent', () => { 
  const obj = {
    create: jest.fn(() => new Promise(res => res({ id: 1 }))),
    findAll: jest.fn(),
    findOne: jest.fn(),
    scope: () => obj
  }
  return obj
})

jest.mock('../../../src/tracker', () => ({ getSwarmInfo: jest.fn() }))

const fs = require('fs')

const { postMultipart, get, getById, getDownloadById } = require('../../../src/controller/torrent')
const Torrent = require('../../../src/model/torrent')
const tracker = require('../../../src/tracker')

describe('torrent get', () => {

  it('should get all torrents', async () => {

    // given
    tracker.getSwarmInfo.mockImplementationOnce(() => ({ complete: 1, incomplete: 0 }))
    Torrent.findAll.mockImplementationOnce(() => new Promise(res => res([{ dataValues: { name: 'foo' } }])))
    ctx = {}

    // when
    await get(ctx)

    // then
    expect(ctx.body).toEqual([
      { name: 'foo', swarm: { complete: 1, incomplete: 0 } }
    ])
  })


  it('should get by id', async () => {

    // given
    const file = fs.readFileSync(__dirname + '/../../fixtures/test.pdf.torrent')
    Torrent.findOne.mockImplementationOnce(() => new Promise(res => res({ dataValues: { 
      name: 'foo',
      file
    }})))

    ctx = { params: { id: 1 } }

    // when
    await getById(ctx)

    // then
    expect(ctx.body).toEqual({
      name: 'foo',
      files: [ { path: 'test.pdf', name: 'test.pdf', length: 6508, offset: 0 } ]
    })
  })


  it('should not get by id - 404', async () => {

    // given
    Torrent.findOne.mockImplementationOnce(() => new Promise(res => res(null)))
    ctx = { params: { id: 1 }, throw: jest.fn() }

    // when
    await getById(ctx)

    // then
    expect(ctx.throw).toHaveBeenCalledWith(404)
  })


  it('should get downloadable file', async () => {

    // given
    const file = fs.readFileSync(__dirname + '/../../fixtures/test.pdf.torrent')

    Torrent.findOne.mockImplementationOnce(() => new Promise(res => res({ dataValues: { 
      name: 'foo',
      file
    }})))

    const ctx = {
      params: { id: 1 },
      set: jest.fn(),
      attachment: jest.fn()
    }

    // when
    await getDownloadById(ctx)

    // then
    expect(ctx.set).toHaveBeenCalledWith({ 'Content-Type': 'application/x-bittorrent' })
    expect(ctx.attachment).toHaveBeenCalledWith('foo.torrent')
    expect(ctx.body).toBeInstanceOf(Buffer)
  })


  it('should not get downloadable file - 404', async () => {

    // given
    Torrent.findOne.mockImplementationOnce(() => new Promise(res => res(null)))
    ctx = { params: { id: 1 }, throw: jest.fn() }

    // when
    await getDownloadById(ctx)

    // then
    expect(ctx.throw).toHaveBeenCalledWith(404)
  })
})

describe('torrent upload', () => {

  it('should upload multipart', async () => {

    // given
    const ctx = KoaMockObject({
      request: {
        files: {
          torrent: {
            path: __dirname + '/../../fixtures/test.pdf.torrent',
            type: 'application/x-bittorrent'
          }
        },
        body: {
          title: 'Test',
          description: ''
        }
      }
    })

    // when
    await postMultipart(ctx)

    // then
    expect(ctx.body).toBe(1)
  })


  it('should not upload - missing title', async () => {

    // given
    const ctx = KoaMockObject({
      request: { body: { title: '', } },
    })

    // when
    await postMultipart(ctx)

    // then
    expect(ctx.throw).toBeCalledWith(400, 'Missing title')
  })


  it('should not upload - missing files', async () => {

    // given
    const ctx = KoaMockObject({
      request: {
        files: {},
        body: {
          title: 'Test',
          description: ''
        }
      }
    })

    // when
    await postMultipart(ctx)

    // then
    expect(ctx.throw).toBeCalledWith(400, 'Missing file')
  })
  
  
  it('should not upload - wrong mime', async () => {

    // given
    const ctx = KoaMockObject({
      request: {
        files: {
          torrent: {
            path: __dirname + '/../../fixtures/test.pdf.torrent',
            type: 'text/plain'
          }
        },
        body: {
          title: 'Test',
          description: ''
        }
      }
    })

    // when
    await postMultipart(ctx)

    // then
    expect(ctx.throw).toBeCalledWith(415, 'Wrong mime. No torrent')
  })
  
  
  it('should not upload - torrent not parsable', async () => {

    // given
    const ctx = KoaMockObject({
      request: {
        files: {
          torrent: {
            path: __dirname + '/../../fixtures/test.pdf',
            type: 'application/x-bittorrent'
          }
        },
        body: {
          title: 'Test',
          description: ''
        }
      }
    })

    // when
    await postMultipart(ctx)

    // then
    expect(ctx.throw).toBeCalledWith(415, 'Torrent not parsable')
  })

})

function KoaMockObject(object = {}) {
  return Object.assign({}, {
    request: {},
    throw: jest.fn(),
    assert: jest.fn(),
  }, object)
}