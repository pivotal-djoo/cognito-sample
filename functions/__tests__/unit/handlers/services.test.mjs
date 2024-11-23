import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { servicesHandler } from '../../../src/handlers/services.mjs';

describe('Test servicesHandler', () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  it('should get all services', async () => {
    const event = {
      requestContext: {
        http: {
          method: 'GET',
          path: '/',
        },
      },
    };

    const result = await servicesHandler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toHaveLength(6);
  });
});
