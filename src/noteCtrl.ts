import * as response from "./response";
import { DynamoDB } from "aws-sdk";
import { APIGatewayEvent, Context, APIGatewayProxyCallback } from "aws-lambda";

const documentClient = new DynamoDB.DocumentClient({ region: "us-east-1" });
const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME as string;

export async function create(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body as string);
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Item: {
        noteId: data.id,
        title: data.title,
        body: data.body,
      },
      ConditionExpression: "attribute_not_exists(noteId)",
    };
    await documentClient.put(params).promise();
    callback(null, response.send(201, data));
  } catch (error) {
    callback(null, response.error(error));
  }
}

export async function update(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
  context.callbackWaitsForEmptyEventLoop = false;
  const noteId = event.pathParameters?.id;
  // const data = JSON.parse(event.body as string);
  const data = JSON.parse(event.body!);
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: { noteId },
      UpdateExpression: "set #title = :title, #body = :body",
      ExpressionAttributeNames: {
        "#title": "title",
        "#body": "body",
      },
      ExpressionAttributeValues: {
        ":title": data.title,
        ":body": data.body,
      },
      ConditionExpression: "attribute_exists(noteId)",
    };
    await documentClient.update(params).promise();
    callback(null, response.send(200, { id: noteId, ...data }));
  } catch (error) {
    callback(null, response.error(error));
  }
}

export async function remove(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
  context.callbackWaitsForEmptyEventLoop = false;
  const noteId = event.pathParameters?.id;
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: { noteId },
      ConditionExpression: "attribute_exists(noteId)",
    };

    await documentClient.delete(params).promise();
    callback(null, response.send(200, noteId));
  } catch (error) {
    callback(null, response.error(error));
  }
}
export async function getOne(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
  context.callbackWaitsForEmptyEventLoop = false;
  const noteId = event.pathParameters?.id;
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: { noteId },
    };
    const data = await documentClient.get(params).promise();
    if (data.Item) {
      callback(null, response.send(200, data.Item));
    } else {
      callback(
        null,
        response.send(404, {
          code: "02",
          message: "No Note found with this Id",
        })
      );
    }
  } catch (error) {
    callback(null, response.error(error));
  }
}
export async function getAll(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
  console.log(event);
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
    };

    const data = await documentClient.scan(params).promise();
    callback(null, response.send(200, data));
  } catch (error) {
    callback(null, response.error(error));
  }
}

module.exports = { create, update, getOne, getAll, remove };
