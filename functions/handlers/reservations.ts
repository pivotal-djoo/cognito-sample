import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEventHeaders, Handler } from 'aws-lambda';
import { getAuthToken, verifyToken } from '../utils/auth';

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const getUserEmail = async (
  headers: APIGatewayProxyEventHeaders
): Promise<string> => {
  const token = getAuthToken(headers);
  const tokenPayload = await verifyToken(token!);
  if (!tokenPayload.email) {
    throw new Error("'email' is not found in auth token payload.");
  }
  return tokenPayload.email;
};

const handleGetAll = async (userEmail: string): Promise<string> => {
  const queryResult = await dynamo.send(
    new QueryCommand({
      TableName: process.env.RESERVATIONS_TABLE,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': userEmail,
      },
    })
  );
  if (queryResult.Items) {
    return JSON.stringify(queryResult.Items);
  } else {
    throw new Error(`Unable to retrieve all reservations for: ${userEmail}`);
  }
};

const handleGetOne = async (id: string, userEmail: string): Promise<string> => {
  const queryResult = await dynamo.send(
    new QueryCommand({
      TableName: process.env.RESERVATIONS_TABLE,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      FilterExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':email': userEmail,
        ':id': id,
      },
    })
  );
  if (queryResult.Items) {
    return JSON.stringify(queryResult.Items[0]);
  } else {
    throw new Error(`Unable to retrieve reservation with ID: ${id}`);
  }
};

const handlePut = async (userEmail: string, requestBody?: string) => {
  if (!requestBody) {
    throw new Error('Reservation details required.');
  }

  const requestJSON = JSON.parse(requestBody);
  requestJSON['email'] = userEmail;

  const putResult = await dynamo.send(
    new PutCommand({
      TableName: process.env.RESERVATIONS_TABLE,
      Item: requestJSON,
    })
  );

  if (putResult.$metadata.httpStatusCode !== 200) {
    throw new Error(`Unable to put reservation with ID: ${requestJSON.id}}`);
  }
};

const handleDelete = async (id: string, userEmail: string) => {
  const deleteResult = await dynamo.send(
    new DeleteCommand({
      TableName: process.env.RESERVATIONS_TABLE,
      Key: {
        id: id,
      },
      ConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': userEmail,
      },
    })
  );
  if (deleteResult.$metadata.httpStatusCode !== 200) {
    throw new Error(`Unable to delete reservation with ID: ${id}`);
  }
};

export const reservationsHandler: Handler = async (event) => {
  let responseBody;
  let statusCode = 200;
  let userEmail;
  let headers = {
    'Content-Type': 'application/json',
  };

  try {
    userEmail = await getUserEmail(event.headers);
  } catch (err) {
    return {
      statusCode: 401,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: err instanceof Error ? err.message : 'Not authorized',
    };
  }

  const { method, path } = event.requestContext.http;

  try {
    switch (method) {
      case 'DELETE':
        await handleDelete(path.slice(1), userEmail);
        break;
      case 'GET':
        if (path !== '/') {
          responseBody = await handleGetOne(path.slice(1), userEmail);
        } else {
          responseBody = await handleGetAll(userEmail);
        }
        break;
      case 'POST':
        await handlePut(userEmail, event.body);
        statusCode = 201;
        break;
      default:
        throw new Error(`Unsupported method: "${method}"`);
    }
  } catch (err) {
    statusCode = 400;
    headers = {
      'Content-Type': 'text/plain',
    };
    if (err instanceof Error) {
      responseBody = err.message;
    } else {
      responseBody = 'An unknown error occurred';
    }
  }

  return {
    statusCode,
    ...(responseBody ? { headers, body: responseBody } : {}),
  };
};
