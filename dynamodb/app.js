var AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-west-2",
  // don't ask why http://localhost:8000 doesn't work
  endpoint: "http://docker.for.mac.localhost:8000"
});

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

let response;

exports.createtable = (event, context, callback) => {
  // var jsonInput = JSON.parse(event.body);
  var params = {
    TableName: event.pathParameters.tableName,
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH" } //Partition key
    ],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "N" }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  dynamodb.createTable(params, function(err, data) {
    if (err) {
      console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
      response = {
        statusCode: err.statusCode,
        body: JSON.stringify({
          message: err.message
        })
      };
      callback(null, response);
    } else {
      console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
      response = {
        statusCode: 200,
        body: JSON.stringify({
          message: `Table Created: ${data.TableDescription.TableName}`
        })
      };
      callback(null, response);
    }
  });
};

exports.listTables = (event, context, callback) => {
  dynamodb.listTables({ Limit: 10 }, function(err, data) {
    if (err) {
      console.log("Error", err.code);
      response = {
        statusCode: err.code,
        body: JSON.stringify({
          message: err.message
        })
      };
      callback(err, null);
    } else {
      console.log("Table names are ", data.TableNames);
      response = {
        statusCode: 200,
        body: JSON.stringify({
          message: "EVERYTHING OK",
          tables: data.TableNames
        })
      };
      callback(null, response);
    }
  });
};

exports.loadcar = (event, context, callback) => {
  var car = JSON.parse(event.body);

  var params = {
    TableName: "Cars",
    Item: {
      id: car.id,
      type: car.type,
      name: car.name,
      manufacturer: car.manufacturer,
      fuel_type: car.fuel_type,
      description: car.description
    }
  };

  docClient.put(params, function(err, data) {
    if (err) {
      console.error("Unable to add Car", car.name, ". Error JSON:", JSON.stringify(err, null, 2));
      response = {
        statusCode: err.statusCode,
        body: JSON.stringify({
          message: err.message
        })
      };
      callback(null, response);
    } else {
      console.log("PutItem succeeded:", car.name);
      response = {
        statusCode: 200,
        body: JSON.stringify({
          message: "EVERYTHING OK",
          imported: car.name
        })
      };
      callback(null, response);
    }
  });
};

exports.readCar = (event, context, callback) => {
  var params = {
    TableName: "Cars",
    Key: {
      id: parseInt(event.pathParameters.id)
    }
  };

  docClient.get(params, function(err, data) {
    if (err) {
      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      response = {
        statusCode: err.statusCode,
        body: JSON.stringify({
          message: err.message
        })
      };
      callback(null, response);
    } else {
      console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
      response = {
        statusCode: 200,
        body: JSON.stringify({
          item: data.Item
        })
      };
      callback(null, response);
    }
  });
};
