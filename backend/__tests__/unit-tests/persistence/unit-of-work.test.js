const createUnitOfWork = require('../../../src/persistence/unit-of-work');

const dbMock = {
  run: jest.fn(),
};

const unitOfWork = createUnitOfWork(dbMock);

describe('Unit Of Work Tests', () => {
  test('beginTransaction should resolve when successful', async () => {
    dbMock.run.mockImplementation((sql, callback) => callback(null));

    await expect(unitOfWork.beginTransaction()).resolves.not.toBeDefined();
  });

  test('beginTransaction should reject with error when error occurs', async () => {
    const errorMock = new Error();
    dbMock.run.mockImplementation((sql, callback) => callback(errorMock));

    await expect(unitOfWork.beginTransaction()).rejects.toEqual(errorMock);
  });

  test('rollback should resolve when successful', async () => {
    dbMock.run.mockImplementation((sql, callback) => callback(null));

    await expect(unitOfWork.rollback()).resolves.not.toBeDefined();
  });

  test('rollback should reject with error when error occurs', async () => {
    const errorMock = new Error();
    dbMock.run.mockImplementation((sql, callback) => callback(errorMock));

    await expect(unitOfWork.rollback()).rejects.toEqual(errorMock);
  });

  test('commit should resolve when successful', async () => {
    dbMock.run.mockImplementation((sql, callback) => callback(null));

    await expect(unitOfWork.commit()).resolves.not.toBeDefined();
  });

  test('commit should reject with error when error occurs', async () => {
    const errorMock = new Error();
    dbMock.run.mockImplementation((sql, callback) => callback(errorMock));

    await expect(unitOfWork.commit()).rejects.toEqual(errorMock);
  });
});
