import json
import os
import time
import uuid
import boto3

TABLE_NAME = os.environ["TABLE_NAME"]

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)


def response(status, message):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,OPTIONS",
            "Access-Control-Allow-Headers": "content-type"
        },
        "body": json.dumps({
            "message": message
        })
    }


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
        return response(400, "Invalid form submission.")

    name = str(body.get("name", "")).strip()
    email = str(body.get("email", "")).strip().lower()
    phone = str(body.get("phone", "")).strip()
    role = str(body.get("role", "")).strip()
    school = str(body.get("school", "")).strip()
    school_level = str(body.get("schoolLevel", "")).strip()
    city = str(body.get("city", "")).strip()
    state = str(body.get("state", "")).strip()
    program_name = str(body.get("programName", "")).strip()
    program_size = str(body.get("programSize", "")).strip()
    interests = body.get("interests", [])
    notes = str(body.get("notes", "")).strip()

    if not name or not email or not role or not school:
        return response(
            400,
            "Please complete all required fields."
        )

    submission_id = str(uuid.uuid4())

    table.put_item(
        Item={
            "submissionId": submission_id,
            "name": name,
            "email": email,
            "phone": phone,
            "role": role,
            "school": school,
            "schoolLevel": school_level,
            "city": city,
            "state": state,
            "programName": program_name,
            "programSize": program_size,
            "interests": interests,
            "notes": notes,
            "createdAt": int(time.time()),
            "source": "BandStand Media Program Interest Form"
        }
    )

    return response(
        201,
        "Thank you! The BandStand Media team will be in touch."
    )
