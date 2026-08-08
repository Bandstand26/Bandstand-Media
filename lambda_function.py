import json
import os
import re
import time
import boto3
from botocore.exceptions import ClientError

TABLE_NAME = os.environ["TABLE_NAME"]

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def response(status, message=None):
    result = {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json"
        }
    }

    if message is not None:
        result["body"] = json.dumps({
            "message": message
        })

    return result


def lambda_handler(event, context):

    method = (
        event
        .get("requestContext", {})
        .get("http", {})
        .get("method", "")
    )

    if method == "OPTIONS":
        return {
            "statusCode": 204,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST,OPTIONS",
                "Access-Control-Allow-Headers": "content-type"
            },
            "body": ""
        }

    try:
        body = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return response(400, "Invalid request.")

    email = str(body.get("email", "")).strip().lower()

    if not EMAIL_REGEX.match(email):
        return response(
            400,
            "Please enter a valid email address."
        )

    try:
        table.put_item(
            Item={
                "email": email,
                "createdAt": int(time.time()),
                "source": "BandStand Media website"
            },
            ConditionExpression="attribute_not_exists(email)"
        )

        return response(
            201,
            "You're on the BandStand Media list!"
        )

    except ClientError as e:
        if (
            e.response["Error"]["Code"]
            == "ConditionalCheckFailedException"
        ):
            return response(
                200,
                "You're already on the BandStand Media list!"
            )

        print(e)

        return response(
            500,
            "Unable to save your email right now."
        )
