import { getAddress } from '../../src/middlewares/gps';

describe('getAddress', () => {
  it('return the same gps', async () => {
    expect.assertions(1)
    const gps = [70, 70]
    const data = await getAddress(gps[0], gps[1])
    expect(data.gps).toEqual(gps)
  })
})
