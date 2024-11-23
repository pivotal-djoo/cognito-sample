import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyResult, LambdaFunctionURLEvent } from 'aws-lambda';

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = process.env.RESERVATIONS_TABLE;

export const reservationsHandler = async (
  event: LambdaFunctionURLEvent
): Promise<APIGatewayProxyResult> => {
  let responseBody;
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
  };

  const { method, path } = event.requestContext.http;

  try {
    switch (method) {
      case 'DELETE':
        await dynamo.send(
          (responseBody = new DeleteCommand({
            TableName: tableName,
            Key: {
              id: path.slice(1),
            },
          }))
        );
        // responseBody = `Deleted item ${responseBody}`;
        break;
      case 'GET':
        if (path !== '/') {
          responseBody = await dynamo.send(
            new GetCommand({
              TableName: tableName,
              Key: {
                id: path.slice(1),
              },
            })
          );
          responseBody = responseBody.Item;
        } else {
          responseBody = await dynamo.send(
            new ScanCommand({ TableName: tableName })
          );
          responseBody = responseBody.Items;
        }
        break;
      case 'POST':
        if (!event.body) {
          throw new Error('Reservation details required.');
        }
        let requestJSON = JSON.parse(event.body);
        responseBody = await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: requestJSON,
          })
        );
        if ('returnedItem' in responseBody) {
          responseBody = responseBody.returnedItem;
        }
        // responseBody = `Put item ${requestJSON.id}`;
        break;
      default:
        throw new Error(`Unsupported method: "${method}"`);
    }
  } catch (err) {
    statusCode = 400;
    if (err instanceof Error) {
      responseBody = err.message;
    } else {
      responseBody = 'An unknown error occurred';
    }
  } finally {
    responseBody = JSON.stringify(responseBody);
  }

  return {
    statusCode,
    headers,
    body: responseBody,
  };
};
