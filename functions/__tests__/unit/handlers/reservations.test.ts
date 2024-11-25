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

describe('Test reservations Handler', () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);
  const userEmail = 'user@email.com';
  const testTableName = 'test-table-name';

  beforeEach(() => {
    ddbMock.reset();
    (verifyToken as jest.Mock).mockReturnValue({ email: userEmail });
    process.env.RESERVATIONS_TABLE = testTableName;
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

      const expectedResult = {
        statusCode: 200,
        body: JSON.stringify(items),
      };

      expect(result).toEqual(expect.objectContaining(expectedResult));
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
    it('should add a new reservation', async () => {
      ddbMock.on(PutCommand).resolves({
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
