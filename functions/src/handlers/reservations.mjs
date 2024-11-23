import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = process.env.RESERVATIONS_TABLE;

export const reservationsHandler = async (event, context) => {
  let responseBody;
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
  };

  const { method, path, body: requestBody } = event.requestContext.http;

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
        console.log('event: ', event);
        console.log('request body: ', requestBody);
        let requestJSON = JSON.parse(requestBody);
        responseBody = await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: requestJSON,
          })
        );
        responseBody = responseBody.returnedItem;
        // responseBody = `Put item ${requestJSON.id}`;
        break;
      default:
        throw new Error(`Unsupported method: "${method}"`);
    }
  } catch (err) {
    statusCode = 400;
    responseBody = err.message;
  } finally {
    responseBody = JSON.stringify(responseBody);
  }

  return {
    statusCode,
    headers,
    body: responseBody,
  };
};
