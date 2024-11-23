import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  PutCommandOutput,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { LambdaFunctionURLEvent } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import getAllReservationsEvent from '../../../events/get-all-reservations.json';
import getReservationByIdEvent from '../../../events/get-reservation-by-id.json';
import postReservationEvent from '../../../events/post-reservation.json';
import { reservationsHandler } from '../../../handlers/reservations';

describe('Test reservationsHandler', () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  it('should return all reservations', async () => {
    const items = [{ id: 'id1' }, { id: 'id2' }];

    ddbMock.on(ScanCommand).resolves({
      Items: items,
    });

    const result = await reservationsHandler(
      getAllReservationsEvent as LambdaFunctionURLEvent
    );

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(items),
    };

    expect(result).toEqual(expect.objectContaining(expectedResult));
  });

  it('should get reservation by id', async () => {
    const item = { id: 'id1' };

    ddbMock.on(GetCommand).resolves({
      Item: item,
    });

    const result = await reservationsHandler(
      getReservationByIdEvent as LambdaFunctionURLEvent
    );

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(item),
    };

    expect(result).toEqual(expect.objectContaining(expectedResult));
  });

  it('should add a new reservation to the table', async () => {
    const returnedItem = { id: 'id1', name: 'name1' };

    ddbMock.on(PutCommand).resolves({
      returnedItem,
    } as unknown as PutCommandOutput);

    const result = await reservationsHandler(
      postReservationEvent as LambdaFunctionURLEvent
    );

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(returnedItem),
    };

    expect(result).toEqual(expect.objectContaining(expectedResult));
  });
});
