import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { LambdaFunctionURLEvent } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import getAllServicesEvent from '../../../events/get-all-services.json';
import { servicesHandler } from '../../../handlers/services';

describe('Test servicesHandler', () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  it('should get all services', async () => {
    const result = await servicesHandler(
      getAllServicesEvent as LambdaFunctionURLEvent
    );

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body!)).toHaveLength(6);
  });
});
