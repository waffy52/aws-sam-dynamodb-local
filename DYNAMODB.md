# Running Dynamo DB locally

## Run the database
Pull the docker image using this command:

```bash
docker pull amazon/dynamodb-local
```
Then run this command to run the image locally:

```bash
docker run -p 8000:8000 amazon/dynamodb-local
```
Now your database is running on local port 8000

## Install AWS CLI
Use these instructions to install AWS CLI 
> https://docs.aws.amazon.com/cli/latest/userguide/install-macos.html

## Database operations
When your database is running and you got AWS CLI installed, you can access your database.
Please see following commands on how to work with your DB:
> https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithTables.Basics.html

IMPORTANT!
Commands shown in the link above will work locally ONLY if you put endpoint specification at the end of the command. 
Example usage:

This WILL work locally
```bash
aws dynamodb create-table \
    --table-name Music \
    --attribute-definitions \
        AttributeName=Artist,AttributeType=S \
        AttributeName=SongTitle,AttributeType=S \
    --key-schema \
        AttributeName=Artist,KeyType=HASH \
        AttributeName=SongTitle,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=10,WriteCapacityUnits=5 \
    --endpoint-url http://localhost:8000
```

This WILL NOT work locally
```bash
aws dynamodb create-table \
    --table-name Music \
    --attribute-definitions \
        AttributeName=Artist,AttributeType=S \
        AttributeName=SongTitle,AttributeType=S \
    --key-schema \
        AttributeName=Artist,KeyType=HASH \
        AttributeName=SongTitle,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=10,WriteCapacityUnits=5
```

# AWS SDK for accesing the DynamoDB
You can work with DB not only using console commands shown above, but also using SDK written in Javascript.

See the Topics in this link.
> https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-examples.html

Example usage is shown here. Just clone and run this application:
> https://github.com/jameshamann/node-dynamo-db-example

# AWS SAM and API Gateway
To initialize skeleton project run this command:

```bash
sam init
```

Now your initial project is set. To start run this command:

```bash
sam local start-api
```

Your API Gateway is running and you can code your own endpoints and lambda functions.