import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  APIGatewayProxyCallback,
  Context,
  LambdaFunctionURLEvent,
} from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { v4 as uuidv4 } from 'uuid';
import deleteReservationByIdEvent from '../../../events/delete-reservation-by-id.json';
import getAllReservationsEvent from '../../../events/get-all-reservations.json';
import getReservationByIdEvent from '../../../events/get-reservation-by-id.json';
import postReservationEvent from '../../../events/post-reservation.json';
import { reservationsHandler } from '../../../handlers/reservations';
import { verifyToken } from '../../../utils/auth';

jest.mock('../../../utils/auth', () => ({
  ...jest.requireActual('../../../utils/auth'),
  verifyToken: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('Test reservations Handler', () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);
  const userEmail = 'user@email.com';
  const testTableName = 'test-table-name';

  beforeAll(() => {
    const fixedDate = new Date('2024-11-25T02:00:00Z');
    const fixedTimestamp = fixedDate.getTime();
    jest.spyOn(Date, 'now').mockReturnValue(fixedTimestamp);
  });

  beforeEach(() => {
    ddbMock.reset();
    (verifyToken as jest.Mock).mockReturnValue({ email: userEmail });
    process.env.RESERVATIONS_TABLE = testTableName;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('authorization header', () => {
    it('should call verify token', async () => {
      const items = [{ id: 'id1' }, { id: 'id2' }];

      ddbMock.on(QueryCommand).resolves({
        Items: items,
      });

      const result = await reservationsHandler(
        getAllReservationsEvent as unknown as LambdaFunctionURLEvent,
        undefined as unknown as Context,
        undefined as unknown as APIGatewayProxyCallback
      );

      expect(verifyToken).toHaveBeenCalledWith(
        getAllReservationsEvent.headers.Authorization.replace('Bearer ', '')
      );
    });

    it('should return 401 when "Authorization" header is not provided', async () => {
      const items = [{ id: 'id1' }, { id: 'id2' }];

      ddbMock.on(QueryCommand).resolves({
        Items: items,
      });

      const { headers, ...event } = getAllReservationsEvent;

      const result = await reservationsHandler(
        event as unknown as LambdaFunctionURLEvent,
        undefined as unknown as Context,
        undefined as unknown as APIGatewayProxyCallback
      );

      expect(result).toEqual(expect.objectContaining({ statusCode: 401 }));
    });
  });

  describe('get all reservations', () => {
    it('should return all reservations for a user', async () => {
      const items = [{ id: 'id1' }, { id: 'id2' }];

      ddbMock
        .on(QueryCommand)
        .resolves({
          Items: [],
        })
        .on(QueryCommand, {
          TableName: testTableName,
          IndexName: 'email-index',
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': userEmail,
          },
        })
        .resolves({
          Items: items,
        });

      const result = await reservationsHandler(
        getAllReservationsEvent as unknown as LambdaFunctionURLEvent,
        undefined as unknown as Context,
        undefined as unknown as APIGatewayProxyCallback
      );

      expect(result.statusCode).toBe(200);
      const reservations = JSON.parse(result.body);
      expect(reservations).toEqual(
        expect.arrayContaining([
          expect.objectContaining(items[0]),
          expect.objectContaining(items[1]),
        ])
      );
    });

    it('should indicate reservations as in the past based on time', async () => {
      const reservationsFromDB = [
        { id: 'id1', date: '2024-10-21T14:00-0400' },
        { id: 'id2', date: '2024-11-24T23:00-0500' },
        { id: 'id3', date: '2025-02-21T18:00-0500' },
      ];

      ddbMock
        .on(QueryCommand)
        .resolves({
          Items: [],
        })
        .on(QueryCommand, {
          TableName: testTableName,
          IndexName: 'email-index',
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': userEmail,
          },
        })
        .resolves({
          Items: reservationsFromDB,
        });

      const result = await reservationsHandler(
        getAllReservationsEvent as unknown as LambdaFunctionURLEvent,
        undefined as unknown as Context,
        undefined as unknown as APIGatewayProxyCallback
      );

      expect(result.statusCode).toBe(200);
      const reservations = JSON.parse(result.body);
      expect(reservations[0].past).toBeTruthy();
      expect(reservations[1].past).toBeFalsy();
      expect(reservations[1].past).toBeFalsy();
    });

    it('should return 400 when encountering an error while querying all reservations', async () => {
      ddbMock.on(QueryCommand).rejects();

      const result = await reservationsHandler(
        getAllReservationsEvent as unknown as LambdaFunctionURLEvent,
        undefined as unknown as Context,
        undefined as unknown as APIGatewayProxyCallback
      );

      expect(result).toEqual(expect.objectContaining({ statusCode: 400 }));
    });
  });

  describe('get reservation by ID', () => {
    it('should get reservation by id', async () => {
      const item = { id: 'id1' };

      ddbMock
        .on(QueryCommand)
        .resolves({
          Items: undefined,
        })
        .on(QueryCommand, {
          TableName: testTableName,
          KeyConditionExpression: 'email = :email',
          FilterExpression: 'id = :id',
          ExpressionAttributeValues: {
            ':email': userEmail,
            ':id': getReservationByIdEvent.requestContext.http.path.slice(1),
          },
        })
        .resolves({
          Items: [item],
        });

      const result = await reservationsHandler(
        getReservationByIdEvent as unknown as LambdaFunctionURLEvent,
        undefined as unknown as Context,
        undefined as unknown as APIGatewayProxyCallback
      );

      const expectedResult = {
        statusCode: 200,
        body: JSON.stringify(item),
      };

      expect(result).toEqual(expect.objectContaining(expectedResult));
    });

    it('should return 400 when encountering an error while querying a reservation', async () => {
      ddbMock.on(QueryCommand).rejects();

      const result = await reservationsHandler(
        getReservationByIdEvent as unknown as LambdaFunctionURLEvent,
        undefined as unknown as Context,
        undefined as unknown as APIGatewayProxyCallback
      );

      expect(result).toEqual(expect.objectContaining({ statusCode: 400 }));
    });
  });

  describe('add a new reservation', () => {
    it('should add a new reservation with a new UUID as id', async () => {
      const uuid = 'some-uuid';
      (uuidv4 as jest.Mock).mockReturnValue(uuid);

      const expectedEventBody = {
        ...JSON.parse(postReservationEvent.body),
        email: userEmail,
        id: uuid,
        status: 'Requested',
      };

      ddbMock
        .on(PutCommand)
        .rejects()
        .on(PutCommand, {
          TableName: testTableName,
          Item: expectedEventBody,
        })
        .resolves({
          $metadata: { httpStatusCode: 200 },
        });

      const result = await reservationsHandler(
        postReservationEvent as unknown as LambdaFunctionURLEvent,
        undefined as unknown as Context,
        undefined as unknown as APIGatewayProxyCallback
      );

      expect(result).toEqual(expect.objectContaining({ statusCode: 201 }));
    });

    it('should return 400 when encountering an error', async () => {
      ddbMock.on(PutCommand).rejects();

      const result = await reservationsHandler(
        postReservationEvent as unknown as LambdaFunctionURLEvent,
        undefined as unknown as Context,
        undefined as unknown as APIGatewayProxyCallback
      );

      expect(result).toEqual(expect.objectContaining({ statusCode: 400 }));
    });
  });

  describe('delete a reservation', () => {
    it('should delete a reservation by id', async () => {
      const item = { id: 'id1' };

      ddbMock
        .on(DeleteCommand)
        .resolves({
          $metadata: { httpStatusCode: 404 },
        })
        .on(DeleteCommand, {
          TableName: testTableName,
          Key: {
            id: deleteReservationByIdEvent.requestContext.http.path.slice(1),
          },
          ConditionExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': userEmail,
          },
        })
        .resolves({
          $metadata: { httpStatusCode: 200 },
        });

      const result = await reservationsHandler(
        deleteReservationByIdEvent as unknown as LambdaFunctionURLEvent,
        undefined as unknown as Context,
        undefined as unknown as APIGatewayProxyCallback
      );

      expect(result).toEqual(expect.objectContaining({ statusCode: 200 }));
    });

    it('should return 400 when encountering an error while deleting a reservation', async () => {
      ddbMock.on(DeleteCommand).rejects();

      const result = await reservationsHandler(
        deleteReservationByIdEvent as unknown as LambdaFunctionURLEvent,
        undefined as unknown as Context,
        undefined as unknown as APIGatewayProxyCallback
      );

      expect(result).toEqual(expect.objectContaining({ statusCode: 400 }));
    });
  });
});
